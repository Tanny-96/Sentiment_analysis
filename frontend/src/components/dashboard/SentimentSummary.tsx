import React from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface SentimentData {
  positive: number;
  neutral: number;
  negative: number;
  emotions: {
    angry: number;
    sad: number;
    neutral: number;
    happy: number;
    excited: number;
  };
}

interface SentimentSummaryProps {
  data: SentimentData;
}

export function SentimentSummary({ data }: SentimentSummaryProps) {
  const total = data.positive + data.neutral + data.negative;
  const positivePercent = total > 0 ? (data.positive / total) * 100 : 0;
  const neutralPercent = total > 0 ? (data.neutral / total) * 100 : 0;
  const negativePercent = total > 0 ? (data.negative / total) * 100 : 0;

  const emotionData = [
    { name: 'Angry', value: data.emotions.angry, emoji: '😡', color: 'text-neon-red' },
    { name: 'Sad', value: data.emotions.sad, emoji: '😢', color: 'text-neon-blue' },
    { name: 'Neutral', value: data.emotions.neutral, emoji: '😐', color: 'text-muted-foreground' },
    { name: 'Happy', value: data.emotions.happy, emoji: '😊', color: 'text-neon-green' },
    { name: 'Excited', value: data.emotions.excited, emoji: '🤩', color: 'text-neon-yellow' },
  ];

  const overallTrend = positivePercent > negativePercent ? 'positive' : 
                      positivePercent < negativePercent ? 'negative' : 'neutral';

  return (
    <Card className="sentiment-card">
      <div className="flex items-center gap-2 mb-6">
        <div className="text-2xl">🎭</div>
        <h3 className="text-lg font-semibold">Real-time Sentiment & Emotion</h3>
        <div className="ml-auto flex items-center gap-1">
          {overallTrend === 'positive' && <TrendingUp className="h-4 w-4 text-neon-green" />}
          {overallTrend === 'negative' && <TrendingDown className="h-4 w-4 text-neon-red" />}
          {overallTrend === 'neutral' && <Minus className="h-4 w-4 text-muted-foreground" />}
        </div>
      </div>

      {/* Sentiment Overview */}
      <div className="space-y-4 mb-6">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium flex items-center gap-2">
            <span className="w-3 h-3 bg-neon-green rounded-full"></span>
            Positive
          </span>
          <span className="text-sm text-neon-green font-bold">{positivePercent.toFixed(1)}%</span>
        </div>
        <Progress value={positivePercent} className="h-2" />

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium flex items-center gap-2">
            <span className="w-3 h-3 bg-muted-foreground rounded-full"></span>
            Neutral
          </span>
          <span className="text-sm font-bold">{neutralPercent.toFixed(1)}%</span>
        </div>
        <Progress value={neutralPercent} className="h-2" />

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium flex items-center gap-2">
            <span className="w-3 h-3 bg-neon-red rounded-full"></span>
            Negative
          </span>
          <span className="text-sm text-neon-red font-bold">{negativePercent.toFixed(1)}%</span>
        </div>
        <Progress value={negativePercent} className="h-2" />
      </div>

      {/* Emotion Breakdown */}
      <div className="border-t border-border pt-4">
        <h4 className="text-sm font-medium mb-3">Emotion Breakdown</h4>
        <div className="grid grid-cols-5 gap-2">
          {emotionData.map((emotion) => (
            <div key={emotion.name} className="text-center">
              <div className="text-2xl mb-1">{emotion.emoji}</div>
              <div className={`text-lg font-bold ${emotion.color}`}>
                {emotion.value}
              </div>
              <div className="text-xs text-muted-foreground">{emotion.name}</div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}