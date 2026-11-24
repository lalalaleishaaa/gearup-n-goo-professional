
import os, tempfile, json, warnings
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import gradio as gr
from scipy.optimize import minimize
from scipy.special import gammaln, expit
from sklearn.metrics import mean_absolute_error, mean_squared_error
from scapy.utils import PcapReader

warnings.filterwarnings("ignore")

STATE = {"counts": None, "source": None, "audit": None, "results": None}

def read_pcap(path):
    ts = []
    with PcapReader(path) as reader:
        for packet in reader:
            try:
                ts.append(float(packet.time))
            except Exception:
                pass
    if not ts:
        raise ValueError("No readable packet timestamps were found.")
    ts = np.asarray(ts, dtype=np.float64)
    ts.sort()
    first = int(np.floor(ts.min()))
    last = int(np.floor(ts.max()))
    counts = np.bincount(np.floor(ts).astype(np.int64)-first,
                         minlength=last-first+1).astype(np.int64)
    return counts, len(ts), first, last

def read_csv_counts(path, column):
    df = pd.read_csv(path)
    if column not in df.columns:
        raise ValueError(f"Column '{column}' not found. Available columns: {list(df.columns)}")
    vals = pd.to_numeric(df[column], errors="coerce").dropna().to_numpy()
    if len(vals) == 0 or np.any(vals < 0):
        raise ValueError("CSV packet counts must be non-empty and non-negative.")
    if not np.allclose(vals, np.round(vals)):
        raise ValueError("CSV packet counts must be integer values.")
    return np.round(vals).astype(np.int64), len(vals), None, None

def nb_logpmf(x, mu, r):
    x = np.asarray(x, dtype=float)
    mu = max(float(mu), 1e-10); r = max(float(r), 1e-8)
    return (gammaln(x+r)-gammaln(r)-gammaln(x+1)
            + r*np.log(r/(r+mu)) + x*np.log(mu/(r+mu)))

def fit_nb(x):
    x = np.asarray(x, dtype=int)
    m = max(float(x.mean()), 1e-8)
    r0 = max(m*m/max(float(x.var())-m, 1e-5), 0.05)
    def nll(z):
        mu, r = np.exp(z)
        return -np.sum(nb_logpmf(x, mu, r))
    res = minimize(nll, np.log([m, r0]), method="L-BFGS-B",
                   bounds=[(-12, 15), (-8, 15)])
    mu, r = np.exp(res.x)
    return {"mu": float(mu), "r": float(r), "ll": float(-res.fun),
            "k": 2, "success": bool(res.success)}

def zinb_logpmf(x, mu, r, pi):
    x = np.asarray(x, dtype=int)
    base = nb_logpmf(x, mu, r) + np.log(max(1-pi, 1e-12))
    zero_nb = nb_logpmf(np.array([0]), mu, r)[0]
    base[x == 0] = np.logaddexp(np.log(max(pi, 1e-12)),
                                np.log(max(1-pi, 1e-12))+zero_nb)
    return base

def fit_zinb(x):
    x = np.asarray(x, dtype=int)
    m = max(float(x.mean()), 1e-8)
    def nll(z):
        mu, r = np.exp(z[0]), np.exp(z[1])
        pi = expit(z[2])
        return -np.sum(zinb_logpmf(x, mu, r, pi))
    res = minimize(nll, [np.log(m), np.log(1.0), -1.0],
                   method="L-BFGS-B",
                   bounds=[(-12, 15), (-8, 15), (-12, 12)])
    return {"mu": float(np.exp(res.x[0])), "r": float(np.exp(res.x[1])),
            "pi": float(expit(res.x[2])), "ll": float(-res.fun),
            "k": 3, "success": bool(res.success)}

def poisson_loglik(x, lam):
    lam = max(float(lam), 1e-10)
    return float(np.sum(x*np.log(lam)-lam-gammaln(x+1)))

def fit_models(x, cap=150000):
    x = np.asarray(x, dtype=int)
    # Deterministic evenly-spaced sample limits optimization runtime.
    fit_x = x if len(x) <= cap else x[np.linspace(0, len(x)-1, cap).astype(int)]
    lam = max(float(fit_x.mean()), 1e-10)
    pois_ll = poisson_loglik(fit_x, lam)
    nb = fit_nb(fit_x)
    zi = fit_zinb(fit_x)
    rows = []
    for name, ll, k in [
        ("Poisson", pois_ll, 1),
        ("Negative Binomial", nb["ll"], nb["k"]),
        ("ZINB", zi["ll"], zi["k"])
    ]:
        rows.append({"Model": name, "Log-likelihood": ll, "Parameters": k,
                     "AIC": 2*k-2*ll, "BIC": np.log(len(fit_x))*k-2*ll,
                     "Fit observations": len(fit_x)})
    return pd.DataFrame(rows), {"poisson":{"lambda":lam,"ll":pois_ll},
                                "negative_binomial":nb,"zinb":zi}, fit_x

def markov_binary(x):
    s = (np.asarray(x) > 0).astype(int)
    c = np.zeros((2,2), dtype=int)
    np.add.at(c, (s[:-1], s[1:]), 1)
    p = c / np.maximum(c.sum(axis=1, keepdims=True), 1)
    return c, p

def make_dashboard(path, csv_column, bin_width, fit_cap):
    if path is None:
        raise gr.Error("Upload a PCAPNG/PCAP or CSV file first.")
    ext = os.path.splitext(path)[1].lower()
    try:
        if ext in [".pcapng", ".pcap"]:
            counts, packet_count, first, last = read_pcap(path)
            source = f"PCAP capture | {packet_count:,} packets | epoch seconds {first}–{last}"
        elif ext == ".csv":
            counts, packet_count, first, last = read_csv_counts(path, csv_column.strip())
            source = f"CSV count series | {len(counts):,} intervals"
        else:
            raise ValueError("Supported formats: .pcapng, .pcap, .csv")
    except Exception as e:
        raise gr.Error(str(e))

    # Current app uses one-second counts for packet captures.
    # For CSV, values are interpreted as already-binned counts.
    x = counts
    n = len(x)
    mean = float(np.mean(x))
    var = float(np.var(x, ddof=1)) if n > 1 else 0.0
    zeros = float(np.mean(x == 0)*100)
    dispersion = var/mean if mean > 0 else np.nan
    audit = pd.DataFrame({
        "Metric":["Packet observations / intervals","Time bins","Mean packets per bin",
                  "Sample variance","Zero intervals (%)","Variance-to-mean ratio","Std. deviation"],
        "Value":[packet_count,n,mean,var,zeros,dispersion,float(np.sqrt(var))]
    })
    model_table, params, fit_x = fit_models(x, int(fit_cap))
    trans_counts, trans_prob = markov_binary(x)
    # Forecast baselines: expanding historical mean, persistence, moving average.
    split = int(.85*n)
    if split < 10 or split >= n:
        forecast_table = pd.DataFrame({"Model":["Not enough observations"],"MAE":[np.nan],"RMSE":[np.nan]})
    else:
        train, test = x[:split], x[split:]
        hist = list(train)
        p_mean=[]; p_persist=[]; p_ma=[]
        for actual in test:
            p_mean.append(float(np.mean(hist)))
            p_persist.append(float(hist[-1]))
            p_ma.append(float(np.mean(hist[-5:])))
            hist.append(int(actual))
        forecast_table = pd.DataFrame([
            {"Model":"Historical mean","MAE":mean_absolute_error(test,p_mean),"RMSE":mean_squared_error(test,p_mean)**.5},
            {"Model":"Persistence","MAE":mean_absolute_error(test,p_persist),"RMSE":mean_squared_error(test,p_persist)**.5},
            {"Model":"Moving average (5)","MAE":mean_absolute_error(test,p_ma),"RMSE":mean_squared_error(test,p_ma)**.5}
        ])
    STATE.update({"counts":x,"source":source,"audit":audit,
                  "results":{"models":model_table,"params":params,
                             "transition_counts":trans_counts,"transition_prob":trans_prob,
                             "forecast":forecast_table}})
    fig, axes = plt.subplots(2,2,figsize=(13,8))
    axes[0,0].plot(x[:min(3000,n)],lw=.7); axes[0,0].set_title("Packet counts — first 3,000 bins")
    axes[0,1].hist(x,bins=min(40,max(10,int(np.sqrt(n)))),density=True); axes[0,1].set_title("Packet-count distribution")
    axes[1,0].plot(pd.Series(x).rolling(300,min_periods=1).mean()); axes[1,0].set_title("Rolling mean (300 bins)")
    axes[1,1].bar(["Empty","Active"],[(x==0).mean(),(x>0).mean()]); axes[1,1].set_title("Empty vs active intervals")
    for ax in axes.flat: ax.set_xlabel("Bin")
    fig.tight_layout()
    # Model PMF comparison
    ks=np.arange(min(max(int(np.quantile(fit_x,.995)),10),40)+1)
    empirical=np.array([(fit_x==k).mean() for k in ks])
    lam=params["poisson"]["lambda"]
    from scipy.stats import poisson
    nb=params["negative_binomial"]; zi=params["zinb"]
    fig2, ax=plt.subplots(figsize=(9,4.5))
    ax.plot(ks,empirical,"o",label="Empirical")
    ax.plot(ks,poisson.pmf(ks,lam),label="Poisson")
    ax.plot(ks,np.exp(nb_logpmf(ks,nb["mu"],nb["r"])),label="Negative Binomial")
    ax.plot(ks,np.exp(zinb_logpmf(ks,zi["mu"],zi["r"],zi["pi"])),label="ZINB")
    ax.set_title("Observed vs fitted packet-count probabilities")
    ax.set_xlabel("Packets per bin"); ax.set_ylabel("Probability"); ax.legend(); fig2.tight_layout()
    trans_df=pd.DataFrame(trans_prob,index=["Empty","Active"],columns=["Next: Empty","Next: Active"])
    return (f"Loaded: {source}", audit, model_table, forecast_table, trans_df, fig, fig2)

def export_results():
    if STATE["counts"] is None:
        raise gr.Error("Run an analysis before exporting.")
    path="internet_traffic_results.xlsx"
    with pd.ExcelWriter(path) as writer:
        STATE["audit"].to_excel(writer,sheet_name="Data audit",index=False)
        STATE["results"]["models"].to_excel(writer,sheet_name="Model comparison",index=False)
        STATE["results"]["forecast"].to_excel(writer,sheet_name="Forecast metrics",index=False)
        pd.DataFrame(STATE["results"]["transition_prob"],
                     index=["Empty","Active"],columns=["Next empty","Next active"]).to_excel(writer,sheet_name="Markov transition")
        pd.DataFrame([STATE["results"]["params"]]).to_json("model_parameters.json",orient="records",indent=2)
    return path

with gr.Blocks(title="Internet Traffic Research Studio", theme=gr.themes.Soft()) as demo:
    gr.Markdown("# Internet Traffic Research Studio\nUpload a packet capture or packet-count CSV to explore traffic patterns, fit count distributions and compare forecasting baselines.")
    with gr.Row():
        file_in=gr.File(label="Upload PCAPNG / PCAP / CSV",file_types=[".pcapng",".pcap",".csv"],type="filepath")
        csv_col=gr.Textbox(value="packet_count",label="CSV packet-count column")
    with gr.Row():
        bin_width=gr.Dropdown(["1 second"],value="1 second",label="Packet-capture aggregation")
        fit_cap=gr.Slider(10000,300000,value=150000,step=10000,label="Maximum observations for distribution fitting")
    run=gr.Button("Analyze traffic",variant="primary")
    status=gr.Markdown()
    with gr.Tabs():
        with gr.Tab("Overview"):
            audit_out=gr.Dataframe(label="Dataset audit",interactive=False)
            traffic_plot=gr.Plot(label="Traffic dashboard")
        with gr.Tab("Model laboratory"):
            model_out=gr.Dataframe(label="Distribution model comparison",interactive=False)
            dist_plot=gr.Plot(label="Observed vs fitted distributions")
            gr.Markdown("AIC/BIC are comparable only when models use the same observations and likelihood convention.")
        with gr.Tab("Forecasting"):
            forecast_out=gr.Dataframe(label="Chronological holdout forecast metrics",interactive=False)
            gr.Markdown("Forecast metrics use an 85/15 chronological split and rolling one-step-ahead baselines.")
        with gr.Tab("Traffic states"):
            markov_out=gr.Dataframe(label="Binary Markov transition probabilities",interactive=False)
            gr.Markdown("States are Empty (0 packets) and Active (at least 1 packet). This is a descriptive two-state Markov chain, not yet the hidden-state MM-ZINB model.")
    export_btn=gr.Button("Export results to Excel")
    export_file=gr.File(label="Download research results")
    run.click(make_dashboard,[file_in,csv_col,bin_width,fit_cap],
              [status,audit_out,model_out,forecast_out,markov_out,traffic_plot,dist_plot])
    export_btn.click(export_results,outputs=export_file)

if __name__ == "__main__":
    demo.launch(share=True, debug=True)
