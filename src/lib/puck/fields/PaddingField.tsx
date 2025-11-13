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

interface PaddingFieldProps {
  value: string;
  onChange: (value: string) => void;
  name: string;
  label?: string;
  options: Array<{ value: string; label: string }>;
}

const PRESET_OPTIONS = [
  { value: "none", label: "None" },
  { value: "small", label: "Small" },
  { value: "medium", label: "Medium" },
  { value: "large", label: "Large" },
];

export function PaddingField({ value, onChange, label, options = PRESET_OPTIONS }: PaddingFieldProps) {
  // ตรวจสอบว่า value เป็น preset option หรือ custom
  const isPresetValue = value && options.some((opt) => opt.value === value);
  const [isCustom, setIsCustom] = useState(value ? !isPresetValue : false);
  const [customValue, setCustomValue] = useState(isPresetValue ? "" : (value || ""));
  const [presetValue, setPresetValue] = useState(isPresetValue ? value : (value || "medium"));
  
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
      setPresetValue("medium");
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
      onChange(presetValue || "medium");
    }
  };

  const handlePresetChange = (newValue: string) => {
    isInternalChangeRef.current = true;
    setPresetValue(newValue);
    setIsCustom(false);
    onChange(newValue);
  };

  // Parse custom value จาก string format (JSON หรือ CSS shorthand)
  const parseCustomValue = (val: string): { top: string; right: string; bottom: string; left: string } => {
    if (!val) return { top: "", right: "", bottom: "", left: "" };
    
    // ถ้าเป็น JSON string
    try {
      const parsed = JSON.parse(val);
      if (typeof parsed === "object" && parsed !== null) {
        return {
          top: parsed.top || "",
          right: parsed.right || "",
          bottom: parsed.bottom || "",
          left: parsed.left || "",
        };
      }
    } catch {
      // ไม่ใช่ JSON
    }
    
    // ถ้าเป็น CSS shorthand (เช่น "1rem 2rem 1rem 2rem" หรือ "1rem 2rem")
    const parts = val.trim().split(/\s+/);
    if (parts.length === 1) {
      return { top: parts[0], right: parts[0], bottom: parts[0], left: parts[0] };
    } else if (parts.length === 2) {
      return { top: parts[0], right: parts[1], bottom: parts[0], left: parts[1] };
    } else if (parts.length === 4) {
      return { top: parts[0], right: parts[1], bottom: parts[2], left: parts[3] };
    }
    
    // ถ้าเป็น Tailwind class (เช่น "pt-4 pr-6 pb-4 pl-6")
    const twClasses = val.split(/\s+/);
    const result = { top: "", right: "", bottom: "", left: "" };
    twClasses.forEach((cls) => {
      if (cls.startsWith("pt-")) result.top = cls;
      if (cls.startsWith("pr-")) result.right = cls;
      if (cls.startsWith("pb-")) result.bottom = cls;
      if (cls.startsWith("pl-")) result.left = cls;
      if (cls.startsWith("px-")) {
        result.left = cls;
        result.right = cls;
      }
      if (cls.startsWith("py-")) {
        result.top = cls;
        result.bottom = cls;
      }
      if (cls.startsWith("p-")) {
        result.top = cls;
        result.right = cls;
        result.bottom = cls;
        result.left = cls;
      }
    });
    
    return result;
  };

  // Convert object เป็น string format สำหรับเก็บใน Puck
  const formatCustomValue = (sides: { top: string; right: string; bottom: string; left: string }): string => {
    // ถ้าทุกด้านเท่ากัน
    if (sides.top === sides.right && sides.right === sides.bottom && sides.bottom === sides.left && sides.top) {
      return sides.top;
    }
    // ถ้า top === bottom และ left === right
    if (sides.top === sides.bottom && sides.left === sides.right && sides.top && sides.left) {
      return `${sides.top} ${sides.left}`;
    }
    // เก็บเป็น JSON string
    return JSON.stringify(sides);
  };

  const handleCustomChange = (newValue: string) => {
    isInternalChangeRef.current = true;
    setCustomValue(newValue);
    setIsCustom(true);
    onChange(newValue);
  };

  const handleCustomSideChange = (side: "top" | "right" | "bottom" | "left", sideValue: string) => {
    isInternalChangeRef.current = true;
    const currentSides = parseCustomValue(customValue);
    const newSides = { ...currentSides, [side]: sideValue };
    const formattedValue = formatCustomValue(newSides);
    setCustomValue(formattedValue);
    setIsCustom(true);
    onChange(formattedValue);
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
            <SelectValue placeholder="Select padding" />
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

      {/* Custom Input - 4 Sides */}
      {isCustom && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Top</label>
              <Input
                type="text"
                value={parseCustomValue(customValue).top}
                onChange={(e) => handleCustomSideChange("top", e.target.value)}
                placeholder="e.g., 1rem, 16px"
                className="h-8"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Right</label>
              <Input
                type="text"
                value={parseCustomValue(customValue).right}
                onChange={(e) => handleCustomSideChange("right", e.target.value)}
                placeholder="e.g., 1rem, 16px"
                className="h-8"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Bottom</label>
              <Input
                type="text"
                value={parseCustomValue(customValue).bottom}
                onChange={(e) => handleCustomSideChange("bottom", e.target.value)}
                placeholder="e.g., 1rem, 16px"
                className="h-8"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Left</label>
              <Input
                type="text"
                value={parseCustomValue(customValue).left}
                onChange={(e) => handleCustomSideChange("left", e.target.value)}
                placeholder="e.g., 1rem, 16px"
                className="h-8"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

