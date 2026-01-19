# Sentiment Watchdog

**Sentiment Watchdog** is a real-time AI agent designed to analyze the emotional tone of support tickets, chats, and documents. It helps customer support teams detect negative sentiment spikes and respond proactively.

## Features

- **Real-time Sentiment Analysis**: Analyzes text input (single message or batch) for emotional tone.
- **PDF Support**: Extract and analyze text from uploaded Support Ticket PDFs.
- **Visual Dashboard**: View dominant emotions, confidence scores, and sentiment trends over time.
- **Alert System**: Detects spikes in negative sentiment (3+ negative messages in the last 5) and sends email alerts.
- **History & Filtering**: Review past analysis history and filter by specific emotions.

## Installation

1.  **Clone the repository** (if you haven't already):
    ```sh
    git clone <repository_url>
    cd sentiment-analysis-viz
    ```

2.  **Create and activate a virtual environment** (recommended):
    ```sh
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    ```

3.  **Install dependencies**:
    ```sh
    pip install -r requirements.txt
    ```
    *Note: This project requires `pdfplumber` for PDF processing, which is included in the updated requirements.*

## Usage

1.  **Run the Streamlit application**:
    ```sh
    streamlit run app.py
    ```

2.  **Access the Dashboard**:
    The application will open in your default web browser (usually at `http://localhost:8501`).

3.  **Configure Email Alerts (Optional)**:
    To enable email alerts, you need to create a `.streamlit/secrets.toml` file with your email credentials:
    ```toml
    [email_credentials]
    sender_email = "your_email@gmail.com"
    sender_password = "your_app_password"
    recipient_email = "recipient@example.com"
    ```

## Project Structure

- `app.py`: Main Streamlit application entry point.
- `src/`: Source code for sentiment analysis logic.
- `requirements.txt`: Python dependencies.
- `.streamlit/`: Streamlit configuration and styles.

```
sentiment-analysis-viz/
├── .streamlit/              # Streamlit configuration and secrets
│   ├── config.toml
│   ├── secrets.toml         # [Optional] Email credentials (not committed)
│   └── style.css            # Custom CSS styles
├── src/                     # Source code package
│   └── sentiment_analysis/
│       ├── __init__.py
│       ├── sentiment_pipeline.py # Core sentiment analysis logic
│       └── utils.py         # Helper functions
├── tests/                   # Unit tests
│   ├── test_sentiment_pipeline.py
│   └── test_smiley.py
├── app.py                   # Main Streamlit application entry point
├── LICENSE
├── README.md
├── pyproject.toml           # Project metadata and tool configuration
├── requirements.txt         # Python dependencies
├── ruff.toml                # Linter configuration
└── uv.lock                  # Lock file for dependencies
```
