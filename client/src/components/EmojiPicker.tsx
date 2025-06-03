import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Smile } from 'lucide-react';

const EMOJI_CATEGORIES = {
  'Common': ['🚀', '💻', '🌐', '📱', '🔧', '⚡', '📊', '🔒', '📈', '🎮', '🎵', '📷', '📝', '📚', '🎨'],
  'Tech': ['💾', '🔌', '🖥️', '⌨️', '🖱️', '📡', '🔋', '💿', '📲', '🖨️', '🎥', '🎬', '🎧', '🎤', '📺'],
  'Nature': ['🌞', '🌙', '⭐', '🌈', '🌊', '🌪️', '❄️', '🔥', '💧', '🌱', '🌳', '🌸', '🍀', '🌺', '🌻'],
  'Objects': ['📦', '🔍', '🔑', '💼', '📎', '📌', '✏️', '📏', '📐', '🔨', '🔧', '🔩', '⚙️', '🔋', '💡'],
  'Symbols': ['❤️', '✨', '💫', '🌟', '💯', '✅', '❌', '⚠️', '⚡', '💪', '🎯', '🎲', '🎮', '🎲', '🎯']
};

interface EmojiPickerProps {
  value: string;
  onChange: (emoji: string) => void;
  className?: string;
}

export const EmojiPicker: React.FC<EmojiPickerProps> = ({ value, onChange, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleEmojiSelect = (emoji: string) => {
    onChange(emoji);
    setIsOpen(false);
  };

  const filteredEmojis = Object.entries(EMOJI_CATEGORIES).reduce((acc, [category, emojis]) => {
    const filtered = emojis.filter(emoji => 
      emoji.includes(searchTerm) || category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (filtered.length > 0) {
      acc[category] = filtered;
    }
    return acc;
  }, {} as Record<string, string[]>);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className={`w-[100px] justify-between ${className}`}
        >
          {value || <Smile className="h-4 w-4" />}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <div className="p-2">
          <Input
            placeholder="Search emojis..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-2"
          />
          <div className="max-h-[300px] overflow-y-auto">
            {Object.entries(filteredEmojis).map(([category, emojis]) => (
              <div key={category} className="mb-2">
                <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1 px-2">
                  {category}
                </h4>
                <div className="grid grid-cols-8 gap-1">
                  {emojis.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => handleEmojiSelect(emoji)}
                      className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md text-lg"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}; 