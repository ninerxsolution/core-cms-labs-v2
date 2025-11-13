"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Code2 } from "lucide-react";
import dynamic from "next/dynamic";

// Dynamic import เพื่อลด bundle size
const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-96">
      <p className="text-muted-foreground">Loading editor...</p>
    </div>
  ),
});

interface HTMLFieldProps {
  value: string;
  onChange: (value: string) => void;
  name: string;
  label?: string;
}

export function HTMLField({ value, onChange, label }: HTMLFieldProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [editorValue, setEditorValue] = useState(value || "");

  const handleOpen = () => {
    setEditorValue(value || "");
    setIsOpen(true);
  };

  const handleSave = () => {
    onChange(editorValue);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setEditorValue(value || "");
    setIsOpen(false);
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {label}
        </label>
      )}
      <Button
        type="button"
        variant="outline"
        onClick={handleOpen}
        className="w-full justify-start"
      >
        <Code2 className="mr-2 h-4 w-4" />
        Edit HTML
      </Button>
      
      {value && (
        <p className="text-xs text-muted-foreground">
          {value.length} characters
        </p>
      )}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="!max-w-[90vw] h-[90vh] flex flex-col p-0">
          <DialogHeader className="px-6 pt-6 pb-4 border-b">
            <DialogTitle>Edit HTML Code</DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 overflow-hidden px-6 py-4">
            <MonacoEditor
              height="100%"
              language="html"
              theme="vs-dark"
              value={editorValue}
              onChange={(val) => setEditorValue(val || "")}
              options={{
                minimap: { enabled: true },
                lineNumbers: "on",
                fontSize: 14,
                wordWrap: "on",
                automaticLayout: true,
                tabSize: 2,
                formatOnPaste: true,
                formatOnType: true,
                scrollBeyondLastLine: false,
              }}
            />
          </div>

          <DialogFooter className="px-6 pb-6 pt-4 border-t">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="button" onClick={handleSave}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

