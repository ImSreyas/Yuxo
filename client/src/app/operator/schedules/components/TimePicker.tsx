"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const TimePicker = ({
  value,
  // onChange,
  onTimeChange,
}: {
  value: string;
  // onChange: (time: string) => void;
  onTimeChange: (time: string) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hours, setHours] = useState(12);
  const [minutes, setMinutes] = useState(0);
  const [period, setPeriod] = useState("AM");

  useEffect(() => {
    if (value) {
      const date = new Date(`2000-01-01T${value}`);
      setHours(date.getHours() % 12 || 12);
      setMinutes(Math.floor(date.getMinutes() / 5) * 5);
      setPeriod(date.getHours() >= 12 ? "PM" : "AM");
    }
  }, [value, isOpen]);

  const handleTimeChange = (
    newHours: number,
    newMinutes: number,
    newPeriod: string
  ) => {
    const formattedHours =
      newPeriod === "PM" ? (newHours % 12) + 12 : newHours % 12;
    const timeString = `${formattedHours
      .toString()
      .padStart(2, "0")}:${newMinutes.toString().padStart(2, "0")}`;
    // onChange(timeString);
    onTimeChange(timeString);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-start text-left font-normal"
        >
          <Clock className="mr-2 h-4 w-4" />
          {value
            ? new Date(`2000-01-01T${value}`).toLocaleTimeString([], {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              })
            : "Select time"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Select Time</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="text-lg font-medium text-center">
            {value
              ? new Date(`2000-01-01T${value}`).toLocaleTimeString([], {
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                })
              : "Select time"}
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Select
              value={hours.toString()}
              onValueChange={(v) => setHours(parseInt(v))}
            >
              <SelectTrigger>
                <SelectValue placeholder="HH" />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
                  <SelectItem key={h} value={h.toString()}>
                    {h.toString().padStart(2, "0")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={minutes.toString()}
              onValueChange={(v) => setMinutes(parseInt(v))}
            >
              <SelectTrigger>
                <SelectValue placeholder="MM" />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {Array.from({ length: 12 }, (_, i) => i * 5).map((m) => (
                  <SelectItem key={m} value={m.toString()}>
                    {m.toString().padStart(2, "0")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger>
                <SelectValue placeholder="AM/PM" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AM">AM</SelectItem>
                <SelectItem value="PM">PM</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={() => handleTimeChange(hours, minutes, period)}>
            Set Time
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TimePicker;