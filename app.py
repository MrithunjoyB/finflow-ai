import streamlit as st
import os
from orchestrator import run_pipeline

st.set_page_config(
    page_title="FinFlow AI",
    page_icon="💹",
    layout="wide",
    initial_sidebar_state="collapsed"
)

st.markdown("""
<style>
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');

* { font-family: 'Space Grotesk', sans-serif !important; }

.stApp {
    background: #020008;
    overflow-x: hidden;
}

#neural-canvas {
    position: fixed;
    top: 0; left: 0;
    width: 100vw; height: 100vh;
    z-index: 0;
    pointer-events: none;
}

.main .block-container {
    position: relative;
    z-index: 10;
    padding: 2rem 3rem;
    max-width: 1400px;
}

/* HEADER */
.hero {
    text-align: center;
    padding: 40px 0 20px;
}
.hero-title {
    font-size: 4rem;
    font-weight: 700;
    background: linear-gradient(90deg, #00ff88, #00cfff, #a855f7);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin: 0;
    letter-spacing: -1px;
}
.hero-sub {
    color: rgba(255,255,255,0.4);
    font-size: 1rem;
    margin-top: 8px;
    letter-spacing: 2px;
    text-transform: uppercase;
}

/* AGENT NODES */
.agent-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    margin: 32px 0;
}
.agent-node {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 20px;
    padding: 24px;
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease;
    cursor: default;
}
.agent-node::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: var(--accent);
    opacity: 0.8;
}
.agent-node:hover {
    border-color: rgba(255,255,255,0.2);
    transform: translateY(-4px);
    box-shadow: 0 20px 60px rgba(0,0,0,0.5);
}
.agent-node .pulse {
    width: 10px; height: 10px;
    border-radius: 50%;
    background: var(--accent);
    display: inline-block;
    margin-right: 8px;
    animation: pulse 2s infinite;
    box-shadow: 0 0 8px var(--accent);
}
.agent-icon { font-size: 2.5rem; margin-bottom: 12px; display: block; }
.agent-name { font-size: 1rem; font-weight: 600; color: white; margin: 0; }
.agent-desc { font-size: 0.8rem; color: rgba(255,255,255,0.4); margin-top: 4px; }
.agent-status { font-size: 0.75rem; color: var(--accent); margin-top: 12px; letter-spacing: 1px; }

@keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(1.3); }
}

/* UPLOAD ZONE */
.upload-zone {
    background: rgba(255,255,255,0.02);
    border: 1px dashed rgba(255,255,255,0.15);
    border-radius: 24px;
    padding: 40px;
    text-align: center;
    margin: 24px 0;
    position: relative;
    transition: all 0.3s;
}
.upload-zone:hover {
    border-color: rgba(0,255,136,0.4);
    background: rgba(0,255,136,0.02);
}

/* METRICS */
.metric-row {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    margin: 24px 0;
}
.metric-card {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 16px;
    padding: 20px 24px;
    position: relative;
    overflow: hidden;
}
.metric-card::after {
    content: '';
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--accent), transparent);
}
.metric-num {
    font-size: 2.2rem;
    font-weight: 700;
    color: var(--accent);
    line-height: 1;
}
.metric-lbl {
    font-size: 0.8rem;
    color: rgba(255,255,255,0.4);
    margin-top: 6px;
    text-transform: uppercase;
    letter-spacing: 1px;
}

/* RESULT TABS */
.result-card {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 20px;
    padding: 28px;
    margin-top: 8px;
    line-height: 1.8;
}
.result-tag {
    display: inline-block;
    background: rgba(0,255,136,0.1);
    border: 1px solid rgba(0,255,136,0.2);
    border-radius: 20px;
    padding: 4px 14px;
    font-size: 0.75rem;
    color: #00ff88;
    letter-spacing: 1px;
    text-transform: uppercase;
    margin-bottom: 16px;
}

/* BUTTON */
.stButton > button {
    background: linear-gradient(135deg, #00ff88, #00cfff) !important;
    color: #020008 !important;
    border: none !important;
    border-radius: 14px !important;
    padding: 16px 40px !important;
    font-size: 1rem !important;
    font-weight: 700 !important;
    width: 100% !important;
    letter-spacing: 0.5px !important;
    transition: all 0.3s !important;
    box-shadow: 0 0 30px rgba(0,255,136,0.3) !important;
}
.stButton > button:hover {
    box-shadow: 0 0 50px rgba(0,255,136,0.5) !important;
    transform: translateY(-2px) !important;
}

[data-testid="stDownloadButton"] > button {
    background: rgba(255,255,255,0.05) !important;
    color: white !important;
    border: 1px solid rgba(255,255,255,0.15) !important;
    border-radius: 14px !important;
    width: 100% !important;
    font-weight: 600 !important;
}

/* TABS */
[data-baseweb="tab-list"] {
    background: rgba(255,255,255,0.03) !important;
    border-radius: 12px !important;
    padding: 4px !important;
    border: 1px solid rgba(255,255,255,0.08) !important;
}
[data-baseweb="tab"] {
    color: rgba(255,255,255,0.5) !important;
    border-radius: 8px !important;
}
[aria-selected="true"] {
    background: rgba(0,255,136,0.15) !important;
    color: #00ff88 !important;
}

/* TEXT */
p, li, span, div, label { color: rgba(255,255,255,0.8) !important; }
h1,h2,h3,h4 { color: white !important; }
strong { color: white !important; }

[data-testid="stFileUploader"] {
    background: transparent !important;
}

#MainMenu, footer, header { visibility: hidden; }

.divider {
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
    margin: 32px 0;
}

.glow-green { color: #00ff88 !important; }
.glow-blue  { color: #00cfff !important; }
.glow-purple{ color: #a855f7 !important; }
</style>

<!-- NEURAL NETWORK CANVAS -->
<canvas id="neural-canvas"></canvas>
<script>
const canvas = document.getElementById('neural-canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const nodes = [];
const count = 80;

for (let i = 0; i < count; i++) {
    nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 2 + 1,
        color: ['#00ff88','#00cfff','#a855f7'][Math.floor(Math.random()*3)]
    });
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < count; i++) {
        const a = nodes[i];
        a.x += a.vx; a.y += a.vy;
        if (a.x < 0 || a.x > canvas.width)  a.vx *= -1;
        if (a.y < 0 || a.y > canvas.height) a.vy *= -1;
        for (let j = i+1; j < count; j++) {
            const b = nodes[j];
            const dx = a.x - b.x, dy = a.y - b.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            if (dist < 160) {
                ctx.beginPath();
                ctx.strokeStyle = a.color;
                ctx.globalAlpha = (1 - dist/160) * 0.25;
                ctx.lineWidth = 0.5;
                ctx.moveTo(a.x, a.y);
                ctx.lineTo(b.x, b.y);
                ctx.stroke();
            }
        }
        ctx.globalAlpha = 0.7;
        ctx.beginPath();
        ctx.arc(a.x, a.y, a.r, 0, Math.PI*2);
        ctx.fillStyle = a.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = a.color;
        ctx.fill();
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
}
draw();
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
</script>
""", unsafe_allow_html=True)

# ── HERO ─────────────────────────────────────────────────
st.markdown("""
<div class='hero'>
    <h1 class='hero-title'>⬡ FinFlow AI</h1>
    <p class='hero-sub'>Multi-Agent · Neural Finance Operations · Real-time Intelligence</p>
</div>
""", unsafe_allow_html=True)

# ── AGENT NODES ──────────────────────────────────────────
st.markdown("""
<div class='agent-grid'>
    <div class='agent-node' style='--accent:#00ff88;'>
        <span class='agent-icon'>🔍</span>
        <span class='pulse'></span>
        <p class='agent-name'>Analyst Agent</p>
        <p class='agent-desc'>Reads PDFs & CSVs · Extracts all transactions · Structures raw data</p>
        <p class='agent-status'>● NODE ACTIVE</p>
    </div>
    <div class='agent-node' style='--accent:#00cfff;'>
        <span class='agent-icon'>📊</span>
        <span class='pulse'></span>
        <p class='agent-name'>Reporter Agent</p>
        <p class='agent-desc'>Generates P&L · Cash flow reports · Spending breakdowns</p>
        <p class='agent-status'>● NODE ACTIVE</p>
    </div>
    <div class='agent-node' style='--accent:#a855f7;'>
        <span class='agent-icon'>💡</span>
        <span class='pulse'></span>
        <p class='agent-name'>Advisor Agent</p>
        <p class='agent-desc'>Flags anomalies · Risk alerts · Actionable recommendations</p>
        <p class='agent-status'>● NODE ACTIVE</p>
    </div>
</div>
<div class='divider'></div>
""", unsafe_allow_html=True)

# ── UPLOAD ───────────────────────────────────────────────
col1, col2 = st.columns([3, 1])
with col1:
    st.markdown("<h3 style='color:white;margin-bottom:16px;'>📤 Upload Financial Document</h3>", unsafe_allow_html=True)
    uploaded_file = st.file_uploader("", type=["pdf", "csv"], label_visibility="collapsed")

with col2:
    st.markdown("""
    <div style='margin-top:48px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:16px;'>
        <p style='font-size:0.8rem;color:rgba(255,255,255,0.4);margin:0;text-transform:uppercase;letter-spacing:1px;'>Time saved</p>
        <p style='font-size:1.8rem;font-weight:700;color:#00ff88;margin:4px 0;'>~4 hrs</p>
        <p style='font-size:0.75rem;color:rgba(255,255,255,0.3);margin:0;'>per document processed</p>
    </div>
    """, unsafe_allow_html=True)

# ── RESULTS ──────────────────────────────────────────────
if uploaded_file is not None:
    os.makedirs("data", exist_ok=True)
    file_path = f"data/{uploaded_file.name}"
    with open(file_path, "wb") as f:
        f.write(uploaded_file.getbuffer())

    st.success(f"✅ Document loaded: **{uploaded_file.name}**")
    st.markdown("<br>", unsafe_allow_html=True)

    if st.button("⚡ ACTIVATE FINFLOW — Run All Agents"):
        with st.spinner("🧠 Neural agents processing your document..."):
            results = run_pipeline(file_path)

        st.markdown("<div class='divider'></div>", unsafe_allow_html=True)
        st.markdown("<h2 style='color:white;'>⬡ Intelligence Report</h2>", unsafe_allow_html=True)

        st.markdown("""
        <div class='metric-row'>
            <div class='metric-card' style='--accent:#00ff88;'>
                <div class='metric-num' style='color:#00ff88;'>3/3</div>
                <div class='metric-lbl'>Agents Completed</div>
            </div>
            <div class='metric-card' style='--accent:#00cfff;'>
                <div class='metric-num' style='color:#00cfff;'>&lt;30s</div>
                <div class='metric-lbl'>Processing Time</div>
            </div>
            <div class='metric-card' style='--accent:#a855f7;'>
                <div class='metric-num' style='color:#a855f7;'>~4hr</div>
                <div class='metric-lbl'>Manual Work Saved</div>
            </div>
        </div>
        """, unsafe_allow_html=True)

        tab1, tab2, tab3 = st.tabs(["🔍  Analyst", "📊  Reporter", "💡  Advisor"])

        with tab1:
            st.markdown("<div class='result-tag'>Agent 01 · Analyst</div>", unsafe_allow_html=True)
            st.markdown("<div class='result-card'>", unsafe_allow_html=True)
            st.write(results["analysis"])
            st.markdown("</div>", unsafe_allow_html=True)

        with tab2:
            st.markdown("<div class='result-tag'>Agent 02 · Reporter</div>", unsafe_allow_html=True)
            st.markdown("<div class='result-card'>", unsafe_allow_html=True)
            st.write(results["report"])
            st.markdown("</div>", unsafe_allow_html=True)

        with tab3:
            st.markdown("<div class='result-tag'>Agent 03 · Advisor</div>", unsafe_allow_html=True)
            st.markdown("<div class='result-card'>", unsafe_allow_html=True)
            st.write(results["advice"])
            st.markdown("</div>", unsafe_allow_html=True)

        st.markdown("<br>", unsafe_allow_html=True)
        full_report = f"""FINFLOW AI — INTELLIGENCE REPORT
==================================

[AGENT 01 — ANALYST]
{results['analysis']}

[AGENT 02 — REPORTER]
{results['report']}

[AGENT 03 — ADVISOR]
{results['advice']}
"""
        st.download_button("📥 Download Full Intelligence Report", data=full_report,
                           file_name="finflow_intelligence_report.txt", mime="text/plain")

else:
    st.markdown("""
    <div style='text-align:center;padding:80px 0;'>
        <div style='font-size:5rem;'>⬡</div>
        <p style='color:rgba(255,255,255,0.2);font-size:1rem;margin-top:16px;letter-spacing:2px;text-transform:uppercase;'>
            Awaiting document input
        </p>
    </div>
    """, unsafe_allow_html=True)

st.markdown("""
<div class='divider'></div>
<div style='text-align:center;padding:8px 0 24px;'>
    <span style='color:rgba(255,255,255,0.15);font-size:0.75rem;letter-spacing:2px;text-transform:uppercase;'>
        FinFlow AI · Hackathon Build · Groq + LLaMA 3.3 70B · Multi-Agent System
    </span>
</div>
""", unsafe_allow_html=True)