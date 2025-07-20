import streamlit as st
from src.sentiment_analysis.sentiment_pipeline import analyze_sentiment
import pandas as pd
import matplotlib.pyplot as plt

# Setup page
st.set_page_config(page_title="Sentiment Analyzer Pro", layout="centered")
st.title("📊 Real-Time Sentiment Analyzer Pro")

# Session state to store logs
if "history" not in st.session_state:
    st.session_state.history = []

# Input mode selection
mode = st.radio("Choose Input Mode:", ["Single Message", "Batch Messages (newline-separated)"], horizontal=True)

if mode == "Single Message":
    user_input = st.text_area("📝 Your Message", height=150)

    if st.button("Analyze"):
        if user_input.strip() == "":
            st.warning("Please enter some text to analyze.")
        else:
            sentiment, score = analyze_sentiment(user_input)
            st.session_state.history.append({"Message": user_input, "Sentiment": sentiment, "Score": score})

            if sentiment == "Positive":
                st.success(f"😊 Sentiment: **Positive**\n\n🔢 Score: `{score:.2f}`")
            elif sentiment == "Negative":
                st.error(f"😞 Sentiment: **Negative**\n\n🔢 Score: `{score:.2f}`")
            else:
                st.info(f"😐 Sentiment: **Neutral**\n\n🔢 Score: `{score:.2f}`")

elif mode == "Batch Messages (newline-separated)":
    batch_input = st.text_area("📄 Paste your messages here (each message on a new line)", height=200)

    if st.button("Analyze Batch"):
        lines = [line.strip() for line in batch_input.split("\n") if line.strip()]
        if not lines:
            st.warning("Please enter at least one message.")
        else:
            for msg in lines:
                sentiment, score = analyze_sentiment(msg)
                st.session_state.history.append({"Message": msg, "Sentiment": sentiment, "Score": score})
            st.success("Batch analysis complete ✅")

# Show history
if st.session_state.history:
    st.markdown("## 📚 Analysis History")
    df = pd.DataFrame(st.session_state.history)

    # Color mapping
    def color_sentiment(val):
        color = "green" if val == "Positive" else "red" if val == "Negative" else "gray"
        return f"color: {color}"

    st.dataframe(df.style.applymap(color_sentiment, subset=["Sentiment"]))

    # Plot chart
    st.markdown("## 📈 Sentiment Score Trend")
    fig, ax = plt.subplots()
    ax.plot(range(len(df)), df["Score"], marker='o')
    ax.set_xlabel("Message #")
    ax.set_ylabel("Sentiment Score")
    ax.set_title("Sentiment Score Over Time")
    ax.axhline(y=0, color='gray', linestyle='--', linewidth=0.7)
    st.pyplot(fig)

# Footer
st.markdown("---")
st.caption("Built by Tanishq with ❤️ using Transformers and Streamlit")
