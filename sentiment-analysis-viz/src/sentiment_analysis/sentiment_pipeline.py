import numpy as np
import torch
from transformers import Pipeline, pipeline


class SentimentAnalysisPipeline:
    """
    A class to handle sentiment analysis using a pre-trained model.
    """

    sentiment_pipeline: Pipeline

    def __init__(self, model_name: str, label_mapping: dict[str, float]) -> None:
        self.model_name = model_name
        self.label_mapping = label_mapping

    def run(self, text: str) -> float:
        if not hasattr(self, "sentiment_pipeline"):
            self.sentiment_pipeline = pipeline(
                task="sentiment-analysis",
                model=self.model_name,
                top_k=3,
            )

        sentiment: list[dict[str]] = self.sentiment_pipeline(text)[0]  # type: ignore

        positivity = 0.0
        for label_score_dict in sentiment:
            label: str = label_score_dict["label"]
            score: float = label_score_dict["score"]

            if label in self.label_mapping:
                positivity += self.label_mapping[label] * score

        positivity = np.clip(positivity, -1, 1)
        return positivity


# 🧠 Set up instance and helper function for quick use
_model_name = "distilbert-base-uncased-finetuned-sst-2-english"
_label_mapping = {
    "NEGATIVE": -1.0,
    "POSITIVE": 1.0,
}

_pipeline_instance = SentimentAnalysisPipeline(model_name=_model_name, label_mapping=_label_mapping)


def analyze_sentiment(text: str) -> tuple[str, float]:
    score = _pipeline_instance.run(text)

    if score >= 0.3:
        sentiment = "Positive"
    elif score <= -0.3:
        sentiment = "Negative"
    else:
        sentiment = "Neutral"

    return sentiment, score
