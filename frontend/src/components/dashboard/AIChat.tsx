import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, Bot, User } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface AIChatProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
}

export function AIChat({ isCollapsed = false }: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! I\'m your AI assistant for sentiment analysis. How can I help you today?',
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: newMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: generateAIResponse(newMessage),
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const generateAIResponse = (userMessage: string): string => {
    const responses = [
      'I can help you analyze sentiment patterns in your tickets. Would you like me to explain any specific metric?',
      'Based on the current data, I notice some interesting trends. Let me know if you need detailed insights.',
      'I can recommend agents based on ticket sentiment and complexity. What specific case are you working on?',
      'The sentiment analysis shows some patterns that might be worth investigating. Would you like me to dive deeper?',
      'I can help you set up automated alerts for negative sentiment spikes. Would that be useful?'
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (isCollapsed) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          size="lg"
          className="h-14 w-14 rounded-full neon-glow-blue"
          onClick={() => {}}
        >
          <Bot className="h-6 w-6" />
        </Button>
      </div>
    );
  }

  return (
    <Card className="sentiment-card h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4 border-b border-border pb-4">
        <Bot className="h-5 w-5 text-neon-purple" />
        <h3 className="text-lg font-semibold">💬 AI Assistant</h3>
        <div className="ml-auto flex items-center gap-2">
          <div className="w-2 h-2 bg-neon-green rounded-full"></div>
          <span className="text-sm text-muted-foreground">Online</span>
        </div>
      </div>

      <ScrollArea className="flex-1 mb-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.sender === 'ai' && (
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-neon-purple text-black">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              )}
              
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.sender === 'user'
                    ? 'bg-primary text-primary-foreground ml-auto'
                    : 'bg-secondary text-secondary-foreground'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>

              {message.sender === 'user' && (
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-neon-blue text-black">
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="flex gap-2">
        <Input
          placeholder="Ask me about sentiment analysis..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1"
        />
        <Button
          onClick={handleSendMessage}
          disabled={!newMessage.trim()}
          size="sm"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}