import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye, MessageSquare, MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface Ticket {
  id: string;
  timestamp: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  emotion: string;
  subject: string;
  priority: 'low' | 'medium' | 'high';
  status: 'new' | 'assigned' | 'in-progress' | 'resolved';
}

interface TicketsTableProps {
  tickets: Ticket[];
  onViewTicket?: (ticketId: string) => void;
  onAssignTicket?: (ticketId: string) => void;
}

export function TicketsTable({ tickets, onViewTicket, onAssignTicket }: TicketsTableProps) {
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-neon-green border-neon-green';
      case 'negative': return 'text-neon-red border-neon-red';
      default: return 'text-muted-foreground border-muted-foreground';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-neon-red text-white';
      case 'medium': return 'bg-neon-yellow text-black';
      case 'low': return 'bg-neon-green text-black';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-neon-blue text-white';
      case 'assigned': return 'bg-neon-purple text-white';
      case 'in-progress': return 'bg-neon-yellow text-black';
      case 'resolved': return 'bg-neon-green text-black';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getEmotionEmoji = (emotion: string) => {
    const emotionMap: { [key: string]: string } = {
      'angry': '😡',
      'sad': '😢',
      'neutral': '😐',
      'happy': '😊',
      'excited': '🤩',
      'frustrated': '😤',
      'confused': '😕',
      'satisfied': '😌'
    };
    return emotionMap[emotion.toLowerCase()] || '😐';
  };

  return (
    <Card className="sentiment-card">
      <div className="flex items-center gap-2 mb-6">
        <div className="text-lg">📋</div>
        <h3 className="text-lg font-semibold">Recent Support Tickets</h3>
        <Badge variant="secondary" className="ml-auto">
          {tickets.length} tickets
        </Badge>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Timestamp</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Sentiment</TableHead>
              <TableHead>Emotion</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickets.map((ticket) => (
              <TableRow key={ticket.id} className="hover:bg-secondary/30">
                <TableCell className="font-mono text-sm">{ticket.id}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {ticket.timestamp}
                </TableCell>
                <TableCell className="max-w-[200px] truncate">
                  {ticket.subject}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={getSentimentColor(ticket.sentiment)}>
                    {ticket.sentiment}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getEmotionEmoji(ticket.emotion)}</span>
                    <span className="text-sm">{ticket.emotion}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getPriorityColor(ticket.priority)}>
                    {ticket.priority}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(ticket.status)}>
                    {ticket.status.replace('-', ' ')}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewTicket?.(ticket.id)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onAssignTicket?.(ticket.id)}
                    >
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit Priority</DropdownMenuItem>
                        <DropdownMenuItem>Change Status</DropdownMenuItem>
                        <DropdownMenuItem>Add Note</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}