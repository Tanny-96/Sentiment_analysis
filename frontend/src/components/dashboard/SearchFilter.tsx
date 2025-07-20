import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, X } from 'lucide-react';

interface FilterOptions {
  sentiment: string;
  emotion: string;
  priority: string;
  status: string;
  dateRange: string;
}

interface SearchFilterProps {
  onSearch?: (query: string) => void;
  onFilter?: (filters: FilterOptions) => void;
}

export function SearchFilter({ onSearch, onFilter }: SearchFilterProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<FilterOptions>({
    sentiment: 'all',
    emotion: 'all',
    priority: 'all',
    status: 'all',
    dateRange: 'all'
  });

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    onSearch?.(value);
  };

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    const newFilters = { ...activeFilters, [key]: value };
    setActiveFilters(newFilters);
    onFilter?.(newFilters);
  };

  const clearFilter = (key: keyof FilterOptions) => {
    handleFilterChange(key, 'all');
  };

  const clearAllFilters = () => {
    const defaultFilters: FilterOptions = {
      sentiment: 'all',
      emotion: 'all',
      priority: 'all',
      status: 'all',
      dateRange: 'all'
    };
    setActiveFilters(defaultFilters);
    onFilter?.(defaultFilters);
  };

  const activeFilterCount = Object.values(activeFilters).filter(value => value && value !== 'all').length;

  return (
    <Card className="sentiment-card">
      <div className="flex items-center gap-2 mb-4">
        <Search className="h-5 w-5 text-neon-blue" />
        <h3 className="text-lg font-semibold">🎯 Search & Filter</h3>
        {activeFilterCount > 0 && (
          <Badge variant="secondary" className="ml-auto">
            {activeFilterCount} active
          </Badge>
        )}
      </div>

      {/* Search Bar */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search tickets by keyword, ID, or description..."
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Filters */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
        <Select value={activeFilters.sentiment} onValueChange={(value) => handleFilterChange('sentiment', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Sentiment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sentiments</SelectItem>
            <SelectItem value="positive">Positive</SelectItem>
            <SelectItem value="neutral">Neutral</SelectItem>
            <SelectItem value="negative">Negative</SelectItem>
          </SelectContent>
        </Select>

        <Select value={activeFilters.emotion} onValueChange={(value) => handleFilterChange('emotion', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Emotion" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Emotions</SelectItem>
            <SelectItem value="angry">😡 Angry</SelectItem>
            <SelectItem value="sad">😢 Sad</SelectItem>
            <SelectItem value="neutral">😐 Neutral</SelectItem>
            <SelectItem value="happy">😊 Happy</SelectItem>
            <SelectItem value="excited">🤩 Excited</SelectItem>
            <SelectItem value="frustrated">😤 Frustrated</SelectItem>
          </SelectContent>
        </Select>

        <Select value={activeFilters.priority} onValueChange={(value) => handleFilterChange('priority', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>

        <Select value={activeFilters.status} onValueChange={(value) => handleFilterChange('status', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="assigned">Assigned</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
          </SelectContent>
        </Select>

        <Select value={activeFilters.dateRange} onValueChange={(value) => handleFilterChange('dateRange', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Time Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Active Filters */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {Object.entries(activeFilters).map(([key, value]) => 
            value && value !== 'all' && (
              <Badge key={key} variant="secondary" className="flex items-center gap-1">
                {key}: {value}
                <button
                  onClick={() => clearFilter(key as keyof FilterOptions)}
                  className="ml-1 hover:text-neon-red"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-neon-red hover:text-neon-red-glow"
          >
            Clear All
          </Button>
        </div>
      )}
    </Card>
  );
}