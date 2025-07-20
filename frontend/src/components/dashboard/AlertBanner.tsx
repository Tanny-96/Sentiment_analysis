import React, { useEffect, useRef } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AlertBannerProps {
  isActive: boolean;
  severity: 'low' | 'medium' | 'high';
  message: string;
  affectedTickets?: number;
  totalTickets?: number;
  playSound?: boolean;
  onDismiss?: () => void;
}

export function AlertBanner({ 
  isActive, 
  severity, 
  message, 
  affectedTickets, 
  totalTickets, 
  playSound = false,
  onDismiss 
}: AlertBannerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (isActive && playSound) {
      // Create a simple beep sound using Web Audio API
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.3);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    }
  }, [isActive, playSound]);

  if (!isActive) return null;

  const severityConfig = {
    low: {
      color: 'border-amber-500 text-amber-400',
      bgColor: 'bg-amber-500/10',
      icon: '⚠️'
    },
    medium: {
      color: 'border-blue-500 text-blue-400', 
      bgColor: 'bg-blue-500/10',
      icon: '🔔'
    },
    high: {
      color: 'border-red-500 text-red-400',
      bgColor: 'bg-red-500/20',
      icon: '🚨'
    }
  };

  const config = severityConfig[severity];

  return (
    <div className={cn(
      "fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-3xl mx-4",
      severity === 'high' && "animate-pulse"
    )}>
      <Alert className={cn(
        "border-2 shadow-2xl backdrop-blur-sm transition-all duration-300",
        config.color,
        config.bgColor,
        severity === 'high' && "shadow-red-500/50 animate-pulse"
      )}>
        <div className="flex items-start gap-4">
          <div className={cn(
            "text-3xl flex-shrink-0",
            severity === 'high' && "animate-bounce"
          )}>
            {config.icon}
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-xl">
                {message}
              </h4>
              {affectedTickets !== undefined && totalTickets !== undefined && (
                <div className={cn(
                  "px-3 py-1 rounded-full text-sm font-semibold",
                  severity === 'high' 
                    ? "bg-red-500/30 text-red-300 border border-red-500/50" 
                    : "bg-blue-500/30 text-blue-300 border border-blue-500/50"
                )}>
                  {affectedTickets}/{totalTickets} tickets
                </div>
              )}
            </div>
            <AlertDescription className="text-base opacity-90">
              Immediate attention required for customer satisfaction
            </AlertDescription>
          </div>
          {onDismiss && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onDismiss}
              className="hover:bg-white/10 text-current opacity-70 hover:opacity-100"
            >
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>
      </Alert>
    </div>
  );
}