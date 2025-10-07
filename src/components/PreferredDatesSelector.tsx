import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CalendarIcon, Plus, X } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export interface PreferredDate {
  date: string;
  start_time: string;
  end_time: string;
}

interface PreferredDatesSelectorProps {
  value: PreferredDate[];
  onChange: (dates: PreferredDate[]) => void;
}

const PreferredDatesSelector: React.FC<PreferredDatesSelectorProps> = ({ value, onChange }) => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('13:00');

  const addDate = () => {
    if (!selectedDate) return;

    const newDate: PreferredDate = {
      date: format(selectedDate, 'yyyy-MM-dd'),
      start_time: startTime,
      end_time: endTime,
    };

    onChange([...value, newDate]);
    setSelectedDate(undefined);
    setStartTime('10:00');
    setEndTime('13:00');
  };

  const removeDate = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <Label>Preferred Collaboration Date(s) & Time</Label>
      
      {/* Selected Dates List */}
      {value.length > 0 && (
        <div className="space-y-2">
          {value.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-muted/50 p-3 rounded-lg text-sm"
            >
              <div>
                <span className="font-medium">
                  {format(new Date(item.date), 'MMM dd, yyyy')}
                </span>
                <span className="text-muted-foreground ml-2">
                  {item.start_time} - {item.end_time}
                </span>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeDate(index)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Date Picker */}
      <div className="flex flex-col gap-3 p-3 border rounded-lg">
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className={cn(
                  "justify-start text-left font-normal flex-1",
                  !selectedDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, "MMM dd, yyyy") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <Label htmlFor="start-time" className="text-xs">Start Time</Label>
            <Input
              id="start-time"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="end-time" className="text-xs">End Time</Label>
            <Input
              id="end-time"
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addDate}
          disabled={!selectedDate}
          className="w-full"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Date & Time
        </Button>
      </div>

      {value.length === 0 && (
        <p className="text-xs text-muted-foreground">
          Add one or more preferred dates and time ranges for this collaboration
        </p>
      )}
    </div>
  );
};

export default PreferredDatesSelector;
