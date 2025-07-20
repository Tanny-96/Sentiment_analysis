import React, { useState, useEffect } from 'react';
import { PDFUpload } from './PDFUpload';
import { SentimentSummary } from './SentimentSummary';
import { SentimentChart } from './SentimentChart';
import { AlertBanner } from './AlertBanner';
import { AgentRecommendation } from './AgentRecommendation';
import { TicketsTable } from './TicketsTable';
import { SearchFilter } from './SearchFilter';
import { AIChat } from './AIChat';

// Mock data
const mockSentimentData = {
  positive: 45,
  neutral: 30,
  negative: 25,
  emotions: {
    angry: 12,
    sad: 8,
    neutral: 30,
    happy: 35,
    excited: 15
  }
};

const mockChartData = [
  { timestamp: '09:00', positive: 8, neutral: 5, negative: 2, total: 15 },
  { timestamp: '10:00', positive: 12, neutral: 7, negative: 3, total: 22 },
  { timestamp: '11:00', positive: 15, neutral: 8, negative: 7, total: 30 },
  { timestamp: '12:00', positive: 10, neutral: 12, negative: 8, total: 30 },
  { timestamp: '13:00', positive: 8, neutral: 6, negative: 12, total: 26 },
  { timestamp: '14:00', positive: 6, neutral: 4, negative: 15, total: 25 },
  { timestamp: '15:00', positive: 9, neutral: 8, negative: 5, total: 22 }
];

const mockAgent = {
  id: '1',
  name: 'Sarah Martinez',
  avatar: '',
  specialties: ['Customer Complaints', 'Technical Issues', 'De-escalation'],
  rating: 4.8,
  availability: 'available' as const,
  responseTime: '2.3 min'
};

const mockTickets = [
  {
    id: 'TKT-001',
    timestamp: '2024-01-20 14:30',
    sentiment: 'negative' as const,
    emotion: 'angry',
    subject: 'Unable to login to account',
    priority: 'high' as const,
    status: 'new' as const
  },
  {
    id: 'TKT-002',
    timestamp: '2024-01-20 14:25',
    sentiment: 'positive' as const,
    emotion: 'happy',
    subject: 'Great customer service',
    priority: 'low' as const,
    status: 'resolved' as const
  },
  {
    id: 'TKT-003',
    timestamp: '2024-01-20 14:20',
    sentiment: 'neutral' as const,
    emotion: 'neutral',
    subject: 'Question about billing',
    priority: 'medium' as const,
    status: 'in-progress' as const
  },
  {
    id: 'TKT-004',
    timestamp: '2024-01-20 14:15',
    sentiment: 'negative' as const,
    emotion: 'frustrated',
    subject: 'Software bug report',
    priority: 'high' as const,
    status: 'assigned' as const
  },
  {
    id: 'TKT-005',
    timestamp: '2024-01-20 14:10',
    sentiment: 'positive' as const,
    emotion: 'satisfied',
    subject: 'Feature request feedback',
    priority: 'low' as const,
    status: 'new' as const
  }
];

export function SentimentDashboard() {
  const [alertActive, setAlertActive] = useState(false);
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');
  const [isChatCollapsed, setIsChatCollapsed] = useState(true);
  const [affectedTickets, setAffectedTickets] = useState(0);

  // Check for angry/confused emotions spike
  useEffect(() => {
    const timer = setTimeout(() => {
      const angryConfusedTickets = mockTickets.filter(ticket => 
        ticket.emotion === 'angry' || ticket.emotion === 'frustrated'
      );
      const affectedCount = angryConfusedTickets.length;
      const percentage = (affectedCount / mockTickets.length) * 100;
      
      setAffectedTickets(affectedCount);
      
      if (percentage > 60) {
        setAlertActive(true);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleFileUpload = (file: File) => {
    console.log('File uploaded:', file.name);
    // Simulate processing
    setTimeout(() => {
      setAlertActive(true);
    }, 3000);
  };

  const handleViewTicket = (ticketId: string) => {
    console.log('View ticket:', ticketId);
  };

  const handleAssignTicket = (ticketId: string) => {
    console.log('Assign ticket:', ticketId);
  };

  return (
    <div className="min-h-screen bg-background p-4 space-y-6 relative overflow-hidden">
      {/* Background ambient elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-64 h-64 rounded-full opacity-20 aurora-flow" 
             style={{ background: 'var(--gradient-aurora)' }}></div>
        <div className="absolute bottom-40 right-32 w-48 h-48 rounded-full opacity-15 float"
             style={{ background: 'var(--gradient-secondary)' }}></div>
        <div className="absolute top-1/2 left-1/3 w-32 h-32 rounded-full opacity-10 floating-element"
             style={{ background: 'var(--gradient-primary)' }}></div>
      </div>

      {/* Alert Banner */}
      <AlertBanner
        isActive={alertActive}
        severity="high"
        message="⚠️ Spike in Negative Sentiment Detected!"
        affectedTickets={affectedTickets}
        totalTickets={mockTickets.length}
        playSound={true}
        onDismiss={() => setAlertActive(false)}
      />

      {/* Header */}
      <div className="text-center mb-8 relative z-10">
        <h1 className="text-5xl font-bold mb-2 neon-text" 
            style={{ 
              background: 'var(--gradient-rainbow)', 
              backgroundClip: 'text', 
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              backgroundSize: '400% 400%'
            }}>
          <span className="data-flow bg-clip-text text-transparent">
            Sentiment Analysis Dashboard
          </span>
        </h1>
        <p className="text-muted-foreground text-lg opacity-80 shimmer">
          Real-time support ticket sentiment monitoring and analysis
        </p>
        <div className="mx-auto w-24 h-1 mt-4 rounded-full" 
             style={{ background: 'var(--gradient-primary)' }}></div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-8 space-y-6">
          {/* Top Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PDFUpload onFileUpload={handleFileUpload} />
            <SentimentSummary data={mockSentimentData} />
          </div>

          {/* Chart */}
          <div className="relative">
            <SentimentChart data={mockChartData} type={chartType} />
            <div className="absolute top-4 right-4">
              <div className="flex gap-2">
                <button
                  onClick={() => setChartType('line')}
                  className={`px-3 py-1 rounded text-sm ${
                    chartType === 'line' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-secondary text-secondary-foreground'
                  }`}
                >
                  Line
                </button>
                <button
                  onClick={() => setChartType('bar')}
                  className={`px-3 py-1 rounded text-sm ${
                    chartType === 'bar' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-secondary text-secondary-foreground'
                  }`}
                >
                  Bar
                </button>
              </div>
            </div>
          </div>

          {/* Search and Filter */}
          <SearchFilter
            onSearch={(query) => console.log('Search:', query)}
            onFilter={(filters) => console.log('Filters:', filters)}
          />

          {/* Tickets Table */}
          <TicketsTable
            tickets={mockTickets}
            onViewTicket={handleViewTicket}
            onAssignTicket={handleAssignTicket}
          />
        </div>

        {/* Right Column */}
        <div className="lg:col-span-4 space-y-6">
          <AgentRecommendation
            recommendedAgent={mockAgent}
            sentiment="negative"
            emotion="angry"
          />
          
          {!isChatCollapsed && (
            <div className="h-96">
              <AIChat isCollapsed={false} />
            </div>
          )}
        </div>
      </div>

      {/* Floating AI Chat Button */}
      {isChatCollapsed && (
        <div 
          className="fixed bottom-6 right-6 z-50 cursor-pointer"
          onClick={() => setIsChatCollapsed(false)}
        >
          <AIChat isCollapsed={true} />
        </div>
      )}

      {/* Chat Overlay for Mobile */}
      {!isChatCollapsed && (
        <div className="lg:hidden fixed inset-0 z-40 bg-background/80 backdrop-blur-sm">
          <div className="absolute bottom-0 left-0 right-0 h-[70vh] border-t border-border">
            <div className="h-full relative">
              <button
                onClick={() => setIsChatCollapsed(true)}
                className="absolute top-4 right-4 z-50 text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
              <AIChat isCollapsed={false} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}