import streamlit as st
import pandas as pd
import streamlit as st
import pandas as pd
import pdfplumber
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# Updated import to get both functions
from src.sentiment_analysis.sentiment_pipeline import (
    analyze_emotion_all_scores,
    get_top_emotion,
    NEGATIVE_EMOTIONS
)

# --- Page Configuration ---
st.set_page_config(page_title="Sentiment Watchdog", layout="wide", initial_sidebar_state="collapsed")

# --- App Title ---
st.title("🚨 Customer Sentiment Watchdog")
st.markdown("AI agent to analyze support tickets, chats, and documents for emotional tone in real-time.")

# --- Session State Initialization ---
if "history" not in st.session_state:
    st.session_state.history = []
if "alert_sent" not in st.session_state:
    st.session_state.alert_sent = False

# --- Email Sending Logic (No changes) ---
def send_alert_email(recent_history_df):
    try:
        sender = st.secrets["email_credentials"]["sender_email"]
        password = st.secrets["email_credentials"]["sender_password"]
        recipient = st.secrets["email_credentials"]["recipient_email"]
        subject = "ALERT: Negative Sentiment Spike Detected!"
        body_html = f"<html><body><h2>🚨 Alert</h2><p>A spike in negative emotions has been detected.</p><p><b>Recent History:</b></p>{recent_history_df.to_html(index=False)}</body></html>"
        msg = MIMEMultipart()
        msg['From'] = sender; msg['To'] = recipient; msg['Subject'] = subject
        msg.attach(MIMEText(body_html, 'html'))
        with smtplib.SMTP('smtp.gmail.com', 587) as server:
            server.starttls()
            server.login(sender, password)
            server.sendmail(sender, recipient, msg.as_string())
        st.toast("Alert email sent successfully!", icon="📧")
    except Exception:
        st.warning("Email credentials not set or incorrect. Cannot send email.", icon="⚠️")

# --- Alerting Logic (No changes) ---
def check_for_sentiment_spike():
    if len(st.session_state.history) < 5: return
    recent_entries = st.session_state.history[-5:]
    negative_count = sum(1 for entry in recent_entries if entry["Top Emotion"] in NEGATIVE_EMOTIONS)
    if negative_count >= 3:
        st.error("**ALERT: Negative Sentiment Spike Detected!** Review immediately.", icon="🔥")
        if not st.session_state.alert_sent:
            recent_df = pd.DataFrame([{"Message": e["Message"], "Emotion": e["Top Emotion"]} for e in recent_entries])
            send_alert_email(recent_df)
            st.session_state.alert_sent = True
    else:
        st.session_state.alert_sent = False

# --- Input Mode Selection (No changes) ---
mode = st.radio(
    "Choose Input Source:",
    ["Live Chat / Single Message", "Batch Messages (newline-separated)", "Upload Support Ticket (PDF)"],
    horizontal=True, key="input_mode"
)

# --- Processing Functions (No changes) ---
def process_and_display(text: str):
    if not text.strip():
        st.warning("Please enter some text to analyze.")
        return
    all_scores = analyze_emotion_all_scores(text)
    top_emotion, top_score = get_top_emotion(all_scores)
    st.session_state.history.append({
        "Message": text, "Top Emotion": top_emotion, "Top Score": top_score, "All Scores": all_scores
    })
    emotion_emoji_map = {"anger": "😠", "sadness": "😢", "fear": "😨", "joy": "😄", "surprise": "😮", "disgust": "🤢", "neutral": "😐"}
    emoji = emotion_emoji_map.get(top_emotion, "❓")
    st.success(f"{emoji} Dominant Emotion: **{top_emotion.capitalize()}**\n\n🔢 Confidence Score: `{top_score:.2f}`")

# --- UI Layout (No changes to this part) ---
if mode == "Live Chat / Single Message":
    user_input = st.text_area("📝 Enter message:", height=150)
    if st.button("Analyze Message"): process_and_display(user_input)
elif mode == "Batch Messages (newline-separated)":
    batch_input = st.text_area("📋 Paste multiple messages here:", height=200)
    if st.button("Analyze Batch"):
        lines = [line.strip() for line in batch_input.split("\n") if line.strip()]
        if not lines: st.warning("Please enter at least one message.")
        else:
            progress_bar = st.progress(0, text="Analyzing batch...")
            for i, msg in enumerate(lines):
                process_and_display(msg)
                progress_bar.progress((i + 1) / len(lines))
            st.success(f"Batch analysis of {len(lines)} messages complete! ✅")
elif mode == "Upload Support Ticket (PDF)":
    uploaded_file = st.file_uploader("📄 Choose a PDF file", type="pdf")
    if uploaded_file:
        try:
            with pdfplumber.open(uploaded_file) as pdf:
                full_text = "".join(page.extract_text() for page in pdf.pages if page.extract_text())
            st.text_area("Extracted Text from PDF", full_text, height=250, key="pdf_text")
            if st.button("Analyze PDF Content"): process_and_display(full_text)
        except Exception as e: st.error(f"Failed to process PDF file. Error: {e}")

# --- History and Visualization ---
if st.session_state.history:
    st.markdown("---")
    check_for_sentiment_spike()

    # --- Overall Sentiment Breakdown (No changes) ---
    st.markdown("### 📊 Overall Sentiment Breakdown")
    positive_emotions = {'joy'}; neutral_emotions = {'neutral', 'surprise'}
    total_count = len(st.session_state.history)
    pos_count = sum(1 for e in st.session_state.history if e['Top Emotion'] in positive_emotions)
    neg_count = sum(1 for e in st.session_state.history if e['Top Emotion'] in NEGATIVE_EMOTIONS)
    neu_count = sum(1 for e in st.session_state.history if e['Top Emotion'] in neutral_emotions)
    pos_perc = (pos_count / total_count) * 100 if total_count > 0 else 0
    neg_perc = (neg_count / total_count) * 100 if total_count > 0 else 0
    neu_perc = (neu_count / total_count) * 100 if total_count > 0 else 0
    st.markdown(f"🟢 **Positive:** `{pos_perc:.1f}%`"); st.progress(int(pos_perc))
    st.markdown(f"⚪ **Neutral:** `{neu_perc:.1f}%`"); st.progress(int(neu_perc))
    st.markdown(f"🔴 **Negative:** `{neg_perc:.1f}%`"); st.progress(int(neg_perc))
    st.markdown("---")

    # --- Interactive Emotion Trend Chart ---
    st.markdown("### 📈 Emotion Trend")
    chart_type = st.radio("Select Chart Type:", ["Line", "Bar"], horizontal=True, key="chart_toggle")

    # Prepare data for the new chart
    chart_data = []
    for entry in st.session_state.history:
        scores_dict = {item['label']: item['score'] for item in entry['All Scores']}
        chart_data.append(scores_dict)
    chart_df = pd.DataFrame(chart_data)

    # Group emotions for plotting in the desired color order
    plot_df = pd.DataFrame({
        'Positive': chart_df.get('joy', 0),
        'Negative': chart_df.get(list(NEGATIVE_EMOTIONS), 0).sum(axis=1),
        'Neutral': chart_df.get(['neutral', 'surprise'], 0).sum(axis=1)
    })

    # Define the colors to match the DataFrame column order
    # Positive (Green), Negative (Red), Neutral (Grey)
    color_map = ["#26A358", "#FF4B4B", "#808495"]

    if chart_type == "Line":
        st.line_chart(plot_df, color=color_map)
    else:
        st.bar_chart(plot_df, color=color_map)
    # --- END of chart section ---

    st.markdown("## 📚 Analysis History")
    history_df_data = [{"Message": e["Message"], "Top Emotion": e["Top Emotion"], "Score": e["Top Score"]} for e in st.session_state.history]
    df = pd.DataFrame(history_df_data)
    def color_emotion(val):
        if val in NEGATIVE_EMOTIONS: return "color: #FF4B4B"
        elif val == "joy": return "color: #26A358"
        else: return "color: #FAFAFA"
    st.dataframe(df.style.applymap(color_emotion, subset=["Top Emotion"]), use_container_width=True)

# --- Footer ---
st.markdown("---")
st.caption("Built by Tanishq with ❤️ using Transformers and Streamlit")