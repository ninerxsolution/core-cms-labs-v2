"use client";

import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface MaxWidthFieldProps {
  value: string;
  onChange: (value: string) => void;
  name: string;
  label?: string;
  options: Array<{ value: string; label: string }>;
}

const PRESET_OPTIONS = [
  { value: "full", label: "Full" },
  { value: "md", label: "Medium" },
  { value: "lg", label: "Large" },
  { value: "xl", label: "Extra Large" },
];

export function MaxWidthField({ value, onChange, label, options = PRESET_OPTIONS }: MaxWidthFieldProps) {
  // ตรวจสอบว่า value เป็น preset option หรือ custom
  const isPresetValue = value && options.some((opt) => opt.value === value);
  const [isCustom, setIsCustom] = useState(value ? !isPresetValue : false);
  const [customValue, setCustomValue] = useState(isPresetValue ? "" : (value || ""));
  const [presetValue, setPresetValue] = useState(isPresetValue ? value : (value || "lg"));
  
  // ใช้ ref เพื่อ track ว่าเป็นการเปลี่ยนแปลงจากภายในหรือภายนอก
  const isInternalChangeRef = useRef(false);
  const previousValueRef = useRef(value);
  const isTogglingToCustomRef = useRef(false);

  // Sync state เมื่อ value เปลี่ยนจากภายนอกเท่านั้น
  useEffect(() => {
    // ถ้าเป็นการเปลี่ยนแปลงจากภายใน component เอง ให้ข้าม
    if (isInternalChangeRef.current) {
      isInternalChangeRef.current = false;
      return;
    }

    // ถ้า value ไม่เปลี่ยนจริงๆ ให้ข้าม
    if (previousValueRef.current === value) {
      return;
    }

    previousValueRef.current = value;

    // ถ้า value เป็น empty string และเรากำลังอยู่ใน custom mode หรือกำลัง toggle เป็น custom ให้เก็บ custom mode ไว้
    if (!value && (isCustom || isTogglingToCustomRef.current)) {
      isTogglingToCustomRef.current = false;
      // ไม่ต้องทำอะไร ให้อยู่ใน custom mode ต่อไป
      return;
    }

    if (!value) {
      setIsCustom(false);
      setPresetValue("lg");
      setCustomValue("");
      return;
    }
    
    const isPreset = options.some((opt) => opt.value === value);
    setIsCustom(!isPreset);
    
    if (isPreset) {
      setPresetValue(value);
    } else {
      setCustomValue(value);
      // ถ้า value ไม่ใช่ preset และไม่ใช่ empty string แสดงว่าเป็น custom
      setIsCustom(true);
    }
  }, [value, options, isCustom]);

  const handleToggle = (custom: boolean) => {
    isInternalChangeRef.current = true;
    setIsCustom(custom);
    if (custom) {
      // เปลี่ยนเป็น custom mode
      isTogglingToCustomRef.current = true;
      // ถ้ามี customValue อยู่แล้วให้ใช้
      if (customValue) {
        onChange(customValue);
        isTogglingToCustomRef.current = false;
      } else {
        // ถ้า customValue เป็น empty string ไม่เรียก onChange
        // ให้ user พิมพ์ใน input แล้วค่อยเรียก onChange ผ่าน handleCustomChange
        // isTogglingToCustomRef จะถูก reset ใน useEffect เมื่อ value เปลี่ยน
      }
    } else {
      // เปลี่ยนเป็น preset mode - ใช้ค่า preset
      isTogglingToCustomRef.current = false;
      onChange(presetValue || "lg");
    }
  };

  const handlePresetChange = (newValue: string) => {
    isInternalChangeRef.current = true;
    setPresetValue(newValue);
    setIsCustom(false);
    onChange(newValue);
  };

  const handleCustomChange = (newValue: string) => {
    isInternalChangeRef.current = true;
    setCustomValue(newValue);
    setIsCustom(true);
    onChange(newValue);
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {label}
        </label>
      )}
      
      {/* Toggle Buttons */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => handleToggle(false)}
          className={cn(
            "flex-1 rounded-md border px-3 py-2 text-sm font-medium transition-colors",
            !isCustom
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-background text-muted-foreground border-input hover:bg-accent hover:text-accent-foreground"
          )}
        >
          Option
        </button>
        <button
          type="button"
          onClick={() => handleToggle(true)}
          className={cn(
            "flex-1 rounded-md border px-3 py-2 text-sm font-medium transition-colors",
            isCustom
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-background text-muted-foreground border-input hover:bg-accent hover:text-accent-foreground"
          )}
        >
          Custom
        </button>
      </div>

      {/* Option Select */}
      {!isCustom && (
        <Select value={presetValue} onValueChange={handlePresetChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select max width" />
          </SelectTrigger>
          <SelectContent className="w-full">
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value} className="w-full">
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {/* Custom Input */}
      {isCustom && (
        <Input
          type="text"
          value={customValue}
          onChange={(e) => handleCustomChange(e.target.value)}
          placeholder="e.g., max-w-4xl, 1200px, 80rem"
        />
      )}
    </div>
  );
}

