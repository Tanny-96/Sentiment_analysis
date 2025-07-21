import numpy as np
from transformers import pipeline, Pipeline

# A set of emotions that we consider "negative" for alerting purposes
NEGATIVE_EMOTIONS = {"anger", "sadness", "fear", "disgust"}

class EmotionAnalysisPipeline:
    """
    A class to handle emotion analysis using a pre-trained model.
    This model can classify text into multiple emotions.
    """
    emotion_pipeline: Pipeline

    def __init__(self, model_name: str) -> None:
        """Initializes the pipeline with a specific model name."""
        self.model_name = model_name

    def run(self, text: str) -> list[dict]:
        """
        Runs the emotion analysis pipeline on the given text.

        Returns:
            A list of dictionaries, each containing an emotion label and its score.
        """
        if not hasattr(self, "emotion_pipeline"):
            self.emotion_pipeline = pipeline(
                task="text-classification",
                model=self.model_name,
                top_k=None  # Return scores for all emotions
            )
        results = self.emotion_pipeline(text)
        return results[0]

# 🧠 Set up the pipeline instance
_model_name = "j-hartmann/emotion-english-distilroberta-base"
_pipeline_instance = EmotionAnalysisPipeline(model_name=_model_name)

def analyze_emotion_all_scores(text: str) -> list[dict]:
    """
    Analyzes the text to find the scores for all emotions.
    
    Returns:
        A list of dictionaries (e.g., [{'label': 'joy', 'score': 0.98}, ...]).
    """
    return _pipeline_instance.run(text)

def get_top_emotion(all_emotions: list[dict]) -> tuple[str, float]:
    """
    Finds the dominant emotion from a list of emotion scores.
    """
    if not all_emotions:
        return "unknown", 0.0
    top_emotion = max(all_emotions, key=lambda x: x['score'])
    return top_emotion['label'], top_emotion['score']
