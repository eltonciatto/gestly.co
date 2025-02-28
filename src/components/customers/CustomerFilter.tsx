import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface CustomerFilterProps {
  onFilterChange: (filter: string) => void;
  onTagChange: (tag: string) => void;
  currentFilter: string;
  currentTag: string;
  availableTags: string[];
}

export function CustomerFilter({
  onFilterChange,
  onTagChange,
  currentFilter,
  currentTag,
  availableTags,
}: CustomerFilterProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <div className="flex-1">
        <label htmlFor="search" className="sr-only">
          Buscar
        </label>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            id="search"
            type="search"
            placeholder="Buscar clientes..."
            className="pl-8"
            value={currentFilter}
            onChange={(e) => onFilterChange(e.target.value)}
          />
        </div>
      </div>

      {availableTags.length > 0 && (
        <div className="flex items-center gap-x-2 overflow-x-auto pb-2 sm:pb-0">
          <Button
            variant={currentTag === '' ? 'secondary' : 'ghost'}
            onClick={() => onTagChange('')}
            size="sm"
          >
            Todas
          </Button>
          {availableTags.map((tag) => (
            <Button
              key={tag}
              variant={currentTag === tag ? 'secondary' : 'ghost'}
              onClick={() => onTagChange(tag)}
              size="sm"
            >
              {tag}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}