"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDownIcon } from "lucide-react";
import { useState } from "react";

type SortOption = "alphabetical" | "schedule" | "number";

const SortButton = ({ className }: { className: string }) => {
  const [currentSort, setCurrentSort] = useState<SortOption>("alphabetical");

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: "alphabetical", label: "Alphabetical" },
    { value: "schedule", label: "Schedule" },
    { value: "number", label: "Number" },
  ];

  const handleSort = (option: SortOption) => {
    setCurrentSort(option);
    console.log(`Sorting by: ${option}`);
  };

  return (
    <div className={className}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-content justify-between">
            Sort by:{" "}
            {sortOptions.find((option) => option.value === currentSort)?.label}
            <ChevronDownIcon className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[200px]">
          {sortOptions.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onSelect={() => handleSort(option.value)}
              className="cursor-pointer"
            >
              {option.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default SortButton;
