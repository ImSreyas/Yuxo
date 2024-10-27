"use client";

import * as React from "react";
import {
  ArrowUpDown,
  SlidersHorizontal,
  Check,
  Sparkles,
  ArrowDownWideNarrow,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SortOption {
  label: string;
  value: string;
}

interface FilterOption {
  label: string;
  value: string;
}

interface SortFilterButtonsProps {
  sortOptions?: SortOption[];
  filterOptions?: FilterOption[];
  onSortChange?: (value: string) => void;
  onFilterChange?: (values: string[]) => void;
}

const ToolBar = ({
  sortOptions = [],
  filterOptions = [],
  onSortChange = () => {},
  onFilterChange = () => {},
}: SortFilterButtonsProps) => {
  const [activeSort, setActiveSort] = React.useState<string | null>(null);
  const [activeFilters, setActiveFilters] = React.useState<string[]>([]);

  if (sortOptions.length == 0) {
    sortOptions = [
      {
        label: "Alphabetical",
        value: "alphabetical",
      },
      {
        label: "Relevance",
        value: "relevance",
      },
      {
        label: "Popularity",
        value: "popularity",
      },
    ];
  }
  if (filterOptions.length == 0) {
    filterOptions = [
      {
        label: "Near 10km",
        value: "near-10",
      },
      {
        label: "Near 20km",
        value: "near-20",
      },
      {
        label: "Near 30km",
        value: "near-30",
      },
      {
        label: "Places",
        value: "places",
      },
      {
        label: "Bus stops",
        value: "bus-stops",
      },
    ];
  }

  const handleSortChange = (value: string) => {
    setActiveSort(value);
    onSortChange(value);
  };

  const handleFilterChange = (value: string) => {
    setActiveFilters((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
    onFilterChange(
      activeFilters.includes(value)
        ? activeFilters.filter((item) => item !== value)
        : [...activeFilters, value]
    );
  };

  return (
    <div className="flex space-x-2 justify-end py-3">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="border-dashed border-zinc-300 rounded-full"
          >
            <ArrowDownWideNarrow className="mr-2 h-3 w-3" />
            {activeSort && sortOptions
              ? sortOptions.find((option) => option.value === activeSort)
                  ?.label || "Sort"
              : "Sort"}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="w-fit min-w-40 rounded-md"
        >
          <DropdownMenuLabel className="text-xs font-bold">
            Sort by
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {sortOptions &&
            sortOptions.map((option) => (
              <DropdownMenuCheckboxItem
                key={option.value}
                // checked={activeSort === option.value}
                onCheckedChange={() => handleSortChange(option.value)}
                className="text-xs flex justify-between items-center ps-2"
              >
                <span>{option.label}</span>
                {activeSort === option.value && (
                  <span className="ml-2">
                    <Check className="h-3 w-3" />
                  </span>
                )}
              </DropdownMenuCheckboxItem>
            ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="border-dashed border-zinc-300 rounded-full"
          >
            <Sparkles className="mr-2 h-3 w-3" />
            Filter
            {activeFilters.length > 0 && (
              <span className="flex items-center justify-center ml-2 rounded-full bg-primary px-1 text-2xs w-4 h-4 font-medium text-primary-foreground">
                {activeFilters.length}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="w-fit min-w-40 rounded-md"
        >
          <DropdownMenuLabel className="text-xs font-bold">
            Filter by
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {filterOptions &&
            filterOptions.map((option) => (
              <DropdownMenuCheckboxItem
                key={option.value}
                // checked={activeFilters.includes(option.value)}
                onCheckedChange={() => handleFilterChange(option.value)}
                className="text-xs flex justify-between items-center ps-2"
              >
                <span>{option.label}</span>
                {activeFilters.includes(option.value) && (
                  <span className="ml-2">
                    <Check className="h-3 w-3" />
                  </span>
                )}
              </DropdownMenuCheckboxItem>
            ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ToolBar;
