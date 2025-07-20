import React from 'react';
import { Card } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp } from 'lucide-react';

interface ChartData {
  timestamp: string;
  positive: number;
  neutral: number;
  negative: number;
  total: number;
}

interface SentimentChartProps {
  data: ChartData[];
  type?: 'line' | 'bar';
}

export function SentimentChart({ data, type = 'line' }: SentimentChartProps) {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.dataKey}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="sentiment-card">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="h-5 w-5 text-neon-blue" />
        <h3 className="text-lg font-semibold">📈 Sentiment Trend</h3>
        <span className="text-sm text-muted-foreground ml-auto">
          Last {data.length} tickets
        </span>
      </div>

      <div className="chart-container h-64">
        <ResponsiveContainer width="100%" height="100%">
          {type === 'line' ? (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="timestamp" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="positive" 
                stroke="hsl(var(--neon-green))" 
                strokeWidth={2}
                dot={{ fill: "hsl(var(--neon-green))", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: "hsl(var(--neon-green))", strokeWidth: 2 }}
              />
              <Line 
                type="monotone" 
                dataKey="neutral" 
                stroke="hsl(var(--muted-foreground))" 
                strokeWidth={2}
                dot={{ fill: "hsl(var(--muted-foreground))", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: "hsl(var(--muted-foreground))", strokeWidth: 2 }}
              />
              <Line 
                type="monotone" 
                dataKey="negative" 
                stroke="hsl(var(--neon-red))" 
                strokeWidth={2}
                dot={{ fill: "hsl(var(--neon-red))", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: "hsl(var(--neon-red))", strokeWidth: 2 }}
              />
            </LineChart>
          ) : (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="timestamp" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="positive" 
                fill="hsl(var(--neon-green))" 
                radius={[2, 2, 0, 0]}
              />
              <Bar 
                dataKey="neutral" 
                fill="hsl(var(--muted-foreground))" 
                radius={[2, 2, 0, 0]}
              />
              <Bar 
                dataKey="negative" 
                fill="hsl(var(--neon-red))" 
                radius={[2, 2, 0, 0]}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </Card>
  );
}