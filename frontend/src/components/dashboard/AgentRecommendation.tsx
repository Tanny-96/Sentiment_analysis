import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, Star, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Agent {
  id: string;
  name: string;
  avatar?: string;
  specialties: string[];
  rating: number;
  availability: 'available' | 'busy' | 'offline';
  responseTime: string;
}

interface AgentRecommendationProps {
  recommendedAgent: Agent;
  sentiment: 'positive' | 'neutral' | 'negative';
  emotion: string;
}

export function AgentRecommendation({ 
  recommendedAgent, 
  sentiment, 
  emotion 
}: AgentRecommendationProps) {
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-neon-green';
      case 'negative': return 'text-neon-red';
      default: return 'text-muted-foreground';
    }
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available': return 'bg-neon-green';
      case 'busy': return 'bg-neon-yellow';
      case 'offline': return 'bg-muted-foreground';
      default: return 'bg-muted-foreground';
    }
  };

  return (
    <Card className="agent-recommendation">
      <div className="flex items-center gap-2 mb-4">
        <Users className="h-5 w-5 text-neon-purple" />
        <h3 className="text-lg font-semibold">🧠 Agent Recommendation</h3>
      </div>

      <div className="space-y-4">
        {/* Sentiment Analysis */}
        <div className="bg-secondary/30 rounded-lg p-3">
          <h4 className="text-sm font-medium mb-2">Analysis Result</h4>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm">Sentiment:</span>
              <Badge className={getSentimentColor(sentiment)}>
                {sentiment.charAt(0).toUpperCase() + sentiment.slice(1)}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm">Emotion:</span>
              <Badge variant="outline">{emotion}</Badge>
            </div>
          </div>
        </div>

        {/* Recommended Agent */}
        <div className="border border-border rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="relative">
              <Avatar className="h-12 w-12">
                <AvatarImage src={recommendedAgent.avatar} />
                <AvatarFallback>
                  {recommendedAgent.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className={cn(
                "absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-background",
                getAvailabilityColor(recommendedAgent.availability)
              )} />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold">{recommendedAgent.name}</h4>
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 text-neon-yellow fill-current" />
                  <span className="text-sm text-neon-yellow">{recommendedAgent.rating}</span>
                </div>
              </div>
              
              <div className="text-sm text-muted-foreground mb-2">
                Avg. response: {recommendedAgent.responseTime}
              </div>
              
              <div className="flex flex-wrap gap-1">
                {recommendedAgent.specialties.map((specialty) => (
                  <Badge key={specialty} variant="secondary" className="text-xs">
                    {specialty}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <Button size="sm" className="flex-1">
              <MessageSquare className="h-4 w-4 mr-2" />
              Assign Ticket
            </Button>
            <Button variant="outline" size="sm">
              View Profile
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}