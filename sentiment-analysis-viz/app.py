import streamlit as st
import pandas as pd
import pdfplumber
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime

from src.sentiment_analysis.sentiment_pipeline import (
    analyze_emotion_all_scores,
    get_top_emotion,
    NEGATIVE_EMOTIONS
)

# --- Page Configuration ---
st.set_page_config(page_title="Sentiment Watchdog", layout="wide", initial_sidebar_state="collapsed")

# --- Function to load local CSS ---
def local_css(file_name):
    try:
        with open(file_name) as f:
            st.markdown(f'<style>{f.read()}</style>', unsafe_allow_html=True)
    except FileNotFoundError:
        st.error(f"CSS file not found: '{file_name}'. Make sure it's in the .streamlit folder.")

# --- Load Custom CSS ---
local_css(".streamlit/style.css")

# --- Session State Initialization ---
if "history" not in st.session_state:
    st.session_state.history = []
if "alert_sent" not in st.session_state:
    st.session_state.alert_sent = False

# --- Backend Functions ---
def send_alert_email(recent_history_df):
    try:
        sender = st.secrets["email_credentials"]["sender_email"]
        password = st.secrets["email_credentials"]["sender_password"]
        recipient = st.secrets["email_credentials"]["recipient_email"]
        subject = "ALERT: Negative Sentiment Spike Detected!"
        body_html = f"<html><body><h2>🚨 Alert</h2><p>A spike has been detected.</p><p><b>History:</b></p>{recent_history_df.to_html(index=False)}</body></html>"
        msg = MIMEMultipart(); msg['From'] = sender; msg['To'] = recipient; msg['Subject'] = subject
        msg.attach(MIMEText(body_html, 'html'))
        with smtplib.SMTP('smtp.gmail.com', 587) as server:
            server.starttls(); server.login(sender, password)
            server.sendmail(sender, recipient, msg.as_string())
        st.toast("Alert email sent successfully!", icon="📧")
    except Exception: st.warning("Email credentials not set. Cannot send email.", icon="⚠️")

def check_for_sentiment_spike(history):
    if len(history) < 5: return
    recent_entries = history[-5:]
    negative_count = sum(1 for entry in recent_entries if entry["Top Emotion"] in NEGATIVE_EMOTIONS)
    if negative_count >= 3:
        st.error("**ALERT: Negative Sentiment Spike Detected!** Review immediately.", icon="🔥")
        if not st.session_state.alert_sent:
            recent_df = pd.DataFrame([{"Message": e["Message"], "Emotion": e["Top Emotion"]} for e in recent_entries])
            send_alert_email(recent_df)
            st.session_state.alert_sent = True
    else: st.session_state.alert_sent = False

def process_analysis(text: str):
    if not text.strip(): st.warning("Please enter text."); return
    all_scores = analyze_emotion_all_scores(text)
    top_emotion, top_score = get_top_emotion(all_scores)
    st.session_state.history.append({
        "Message": text,
        "Top Emotion": top_emotion,
        "Top Score": top_score,
        "All Scores": all_scores,
        "Timestamp": datetime.now()
    })

# --- UI Layout ---
st.title("🛡️ Customer Sentiment Watchdog")
st.markdown("AI agent to analyze support tickets, chats, and documents for emotional tone in real-time.")

check_for_sentiment_spike(st.session_state.history)

col1, col2 = st.columns([2, 1.2])

with col1:
    st.subheader("Choose Input Source")
    with st.container():
        st.markdown('<div class="card">', unsafe_allow_html=True)
        mode = st.radio("", ["Live Chat / Single Message", "Batch Messages", "Upload PDF"], horizontal=True, label_visibility="collapsed")
        
        if mode == "Live Chat / Single Message":
            user_input = st.text_area("Enter message:", height=150, key="single_input", label_visibility="collapsed")
            if st.button("Analyze Message"):
                process_analysis(user_input)
                st.rerun()
        
        elif mode == "Batch Messages":
            batch_input = st.text_area("Paste messages (one per line):", height=150, key="batch_input", label_visibility="collapsed")
            if st.button("Analyze Batch"):
                lines = [line.strip() for line in batch_input.split("\n") if line.strip()]
                if lines:
                    for msg in lines: process_analysis(msg)
                    st.rerun()
                else: st.warning("Please enter at least one message.")
        
        elif mode == "Upload PDF":
            uploaded_file = st.file_uploader("Upload Support Ticket (PDF)", type="pdf", label_visibility="collapsed")
            if uploaded_file:
                try:
                    with pdfplumber.open(uploaded_file) as pdf:
                        full_text = "".join(page.extract_text() for page in pdf.pages if page.extract_text())
                    st.text_area("Extracted Text", full_text, height=150)
                    if st.button("Analyze PDF Content"):
                        process_analysis(full_text)
                        st.rerun()
                except Exception as e: st.error(f"Error processing PDF: {e}")
        st.markdown('</div>', unsafe_allow_html=True)

with col2:
    st.subheader("✨ Latest Analysis")
    with st.container():
        st.markdown('<div class="card">', unsafe_allow_html=True)
        if st.session_state.history:
            latest = st.session_state.history[-1]
            emotion_emoji_map = {"anger": "😠", "sadness": "😢", "fear": "😨", "joy": "😄", "surprise": "😮", "disgust": "🤢", "neutral": "😐"}
            emoji = emotion_emoji_map.get(latest['Top Emotion'], "❓")
            st.markdown(f"**Dominant Emotion:** {emoji} {latest['Top Emotion'].capitalize()}")
            st.markdown(f"**Confidence Score:**")
            st.progress(latest['Top Score'], text=f"{latest['Top Score']:.2%}")
        else: st.info("No analysis performed yet.")
        st.markdown('</div>', unsafe_allow_html=True)

if st.session_state.history:
    st.markdown("<hr>", unsafe_allow_html=True)
    col3, col4 = st.columns([1.5, 1])

    with col3:
        st.subheader("📊 Analysis History & Trends")
        with st.container():
            st.markdown('<div class="card">', unsafe_allow_html=True)
            all_emotions = sorted(list(set(e['Top Emotion'] for e in st.session_state.history)))
            selected = st.multiselect("Filter by emotion:", options=all_emotions, default=[], placeholder="All Emotions")
            filtered_history = [e for e in st.session_state.history if e['Top Emotion'] in selected] if selected else st.session_state.history
            df_display = pd.DataFrame([{"#": i, "Message": e["Message"], "Top Emotion": e["Top Emotion"], "Score": f"{e['Top Score']:.2%}"} for i, e in enumerate(filtered_history)])
            st.dataframe(df_display, hide_index=True, use_container_width=True)
            st.markdown('</div>', unsafe_allow_html=True)

    with col4:
        st.subheader("📈 Overall Sentiment Breakdown")
        with st.container():
            st.markdown('<div class="card">', unsafe_allow_html=True)
            if filtered_history:
                pos_emotions = {'joy'}; neu_emotions = {'neutral', 'surprise'}
                total = len(filtered_history)
                pos_count = sum(1 for e in filtered_history if e['Top Emotion'] in pos_emotions)
                neg_count = sum(1 for e in filtered_history if e['Top Emotion'] in NEGATIVE_EMOTIONS)
                neu_count = sum(1 for e in filtered_history if e['Top Emotion'] in neu_emotions)
                st.markdown(f"🟢 **Positive:** `{(pos_count/total):.1%}`"); st.progress(pos_count/total)
                st.markdown(f"🟡 **Neutral:** `{(neu_count/total):.1%}`"); st.progress(neu_count/total)
                st.markdown(f"🔴 **Negative:** `{(neg_count/total):.1%}`"); st.progress(neg_count/total)
            else: st.info("No data for selected filter.")
            st.markdown('</div>', unsafe_allow_html=True)
    
    st.subheader("📉 Emotion Trend")
    with st.container():
        st.markdown('<div class="card">', unsafe_allow_html=True)
        if filtered_history:
            chart_type = st.radio("Chart Type:", ["Line", "Bar"], horizontal=True, key="chart_toggle", label_visibility="collapsed")
            
            chart_data = []
            for entry in filtered_history:
                scores = {item['label']: item['score'] for item in entry['All Scores']}
                chart_data.append({
                    'Time': entry['Timestamp'].strftime('%H:%M:%S'),
                    'Positive': scores.get('joy', 0),
                    'Negative': sum(scores.get(label, 0) for label in NEGATIVE_EMOTIONS),
                    'Neutral': sum(scores.get(label, 0) for label in neu_emotions)
                })
            
            if chart_data:
                chart_df = pd.DataFrame(chart_data).set_index('Time')
                plot_df_reordered = chart_df[['Positive', 'Negative', 'Neutral']]
                color_map = ["#336659", "#FF4B4B", "#3d3d3d"] # Green, Red, Dark Grey
                if chart_type == "Line": st.line_chart(plot_df_reordered, color=color_map)
                else: st.bar_chart(plot_df_reordered, color=color_map)
        st.markdown('</div>', unsafe_allow_html=True)