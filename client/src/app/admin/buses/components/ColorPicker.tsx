"use client";

import { useEffect, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const colors = [
  { name: "HotRed", value: "#af1919", isKsrtc: true },
  { name: "White", value: "#FFFFFF", isKsrtc: true },
  { name: "Orange", value: "#F97316", isKsrtc: true },
  { name: "HotGreen", value: "#007324", isKsrtc: true },
  { name: "Yellow", value: "#EAB308", isKsrtc: true },
  { name: "SkyBlue", value: "#0EA5E9", isKsrtc: true },
  { name: "Black", value: "#000000", isKsrtc: true },
  { name: "Red", value: "#ed3b41", isKsrtc: false },
  { name: "Blue", value: "#0EA5E9", isKsrtc: false },
  { name: "Green", value: "#00e020", isKsrtc: false },
];

const ColorPicker = ({ setValue }: { setValue: any }) => {
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  useEffect(() => {
    setValue("color", colors[0].value);
  }, []);
  const [isOpen, setIsOpen] = useState(false);
  const handleColorPick = (color: (typeof colors)[0]) => {
    setSelectedColor(color);
    setValue("color", color.value);
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-label="Select a color"
          className="w-full justify-between"
        >
          <div className="flex items-center gap-2">
            <div
              className={
                "w-4 h-4 rounded-full " +
                (selectedColor.name === "White" && "border border-zinc-300")
              }
              style={{ backgroundColor: selectedColor.value }}
            />
            {selectedColor.name}
          </div>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 pointer-events-auto" align="end">
        <div className="py-4 px-6 bg-background rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold mb-3 text-foreground">
            Select Bus Color
          </h2>
          <div className="pb-3 text-xs">Private</div>
          <div className="grid grid-cols-5 gap-2 mb-4">
            {colors
              .filter((color) => color.isKsrtc === false)
              .map((color) => (
                <Button
                  key={color.name}
                  className={cn(
                    "w-8 h-8 border rounded-full p-0 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background",
                    selectedColor.name === color.name &&
                      "ring-2 ring-offset-2 ring-offset-background",
                    selectedColor.name === "White" && "border border-zinc-300"
                  )}
                  style={{ backgroundColor: color.value }}
                  onClick={() => handleColorPick(color)}
                  aria-label={`Select ${color.name}`}
                >
                  {selectedColor.name === color.name && (
                    <Check className="text-white h-4 w-4" />
                  )}
                </Button>
              ))}
          </div>
          <div className="pb-3 text-xs">Ksrtc</div>
          <div className="grid grid-cols-5 gap-2 mb-4">
            {colors
              .filter((color) => color.isKsrtc === true)
              .map((color) => (
                <Button
                  key={color.name}
                  className={cn(
                    "w-8 h-8 border rounded-full p-0 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background",
                    selectedColor.name === color.name &&
                      "ring-2 ring-offset-2 ring-offset-background",
                    selectedColor.name === "White" && "border border-zinc-300"
                  )}
                  style={{ backgroundColor: color.value }}
                  onClick={() => handleColorPick(color)}
                  aria-label={`Select ${color.name}`}
                >
                  {selectedColor.name === color.name && (
                    <Check className="text-white h-4 w-4" />
                  )}
                </Button>
              ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ColorPicker;
