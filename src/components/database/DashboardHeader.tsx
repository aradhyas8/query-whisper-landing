
import React, { useState } from 'react';
import { Search, X, Filter, Star, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { motion } from 'framer-motion';

interface FilterOption {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface DashboardHeaderProps {
  connectionName?: string;
  databaseName?: string;
  onSearch?: (term: string) => void;
  onFilterChange?: (filter: string) => void;
  activeFilter?: string;
}

const filterOptions: FilterOption[] = [
  { id: 'recent', label: 'Recent', icon: <Clock className="h-3 w-3 mr-1" /> },
  { id: 'starred', label: 'Starred', icon: <Star className="h-3 w-3 mr-1" /> },
  { id: 'tables', label: 'By Table', icon: null },
];

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  connectionName,
  databaseName,
  onSearch,
  onFilterChange,
  activeFilter
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (onSearch) {
      onSearch(e.target.value);
    }
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    if (onSearch) {
      onSearch('');
    }
  };

  const handleFilterClick = (filterId: string) => {
    if (onFilterChange) {
      onFilterChange(activeFilter === filterId ? '' : filterId);
    }
  };

  return (
    <div className="space-y-4">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="#">Connections</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          {connectionName && (
            <>
              <BreadcrumbItem>
                <BreadcrumbLink href="#">{connectionName}</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
            </>
          )}
          {databaseName && (
            <>
              <BreadcrumbItem>
                <BreadcrumbPage>{databaseName}</BreadcrumbPage>
              </BreadcrumbItem>
            </>
          )}
        </BreadcrumbList>
      </Breadcrumb>

      {/* Search and filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search conversations..."
            className="pl-9 pr-8 bg-[#161616] border-[#1E1E1E] focus-visible:ring-1 focus-visible:ring-[#2DD4BF]/30 focus-visible:border-[#2DD4BF]/50 focus-visible:ring-offset-0"
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 hover:bg-transparent"
              onClick={handleClearSearch}
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </Button>
          )}
        </div>
        
        <div className="flex gap-2 flex-wrap">
          {filterOptions.map((filter) => (
            <motion.div key={filter.id} whileTap={{ scale: 0.95 }}>
              <Badge
                variant={activeFilter === filter.id ? "default" : "outline"}
                className={`py-1.5 px-3 cursor-pointer bg-[#1A1A1A] border-[#2A2A2A] hover:border-[#2DD4BF]/50 ${
                  activeFilter === filter.id 
                    ? "bg-[#2DD4BF] text-black hover:bg-[#25b0a0]" 
                    : "hover:bg-[#1D1D1D]"
                }`}
                onClick={() => handleFilterClick(filter.id)}
              >
                <div className="flex items-center">
                  {filter.icon}
                  {filter.label}
                </div>
              </Badge>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
