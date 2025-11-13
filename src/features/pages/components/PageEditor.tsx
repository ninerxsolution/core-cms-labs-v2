"use client";

import "@measured/puck/puck.css";
import { Puck, type Data } from "@measured/puck";
import { puckConfig } from "@/lib/puck/config";
import { Button } from "@/components/ui/button";
import { Save, Eye, Settings, ArrowLeft, Upload } from "lucide-react";
import { useState, useEffect } from "react";

interface PageEditorProps {
  initialData?: Data;
  onSave: (data: Data) => Promise<void>;
  onPublish?: (data: Data) => Promise<void>;
  onPreview?: () => void;
  onPageInfo?: () => void;
  onExit?: () => void;
  isLoading?: boolean;
}

export function PageEditor({
  initialData,
  onSave,
  onPublish,
  onPreview,
  onPageInfo,
  onExit,
  isLoading = false,
}: PageEditorProps) {
  // Initialize data with proper structure
  const getInitialData = (): Data => {
    if (initialData) {
      return {
        content: initialData.content || [],
        root: initialData.root || { props: {} },
        zones: initialData.zones || {},
      };
    }
    return {
      content: [],
      root: { props: {} },
      zones: {},
    };
  };

  const [data, setData] = useState<Data>(getInitialData());

  // Sync with initialData when it changes
  useEffect(() => {
    if (initialData) {
      setData({
        content: initialData.content || [],
        root: initialData.root || { props: {} },
        zones: initialData.zones || {},
      });
    }
  }, [initialData]);

  const handleSave = async () => {
    await onSave(data);
  };

  const handlePublish = async () => {
    if (onPublish) {
      await onPublish(data);
    } else {
      // Fallback to save if onPublish is not provided
      await onSave(data);
    }
  };

  return (
    <div className="flex h-full flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b bg-background p-4">
        <div className="flex items-center gap-3">
          {onExit && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onExit}
              disabled={isLoading}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Exit
            </Button>
          )}
          <h2 className="text-lg font-semibold">Page Editor</h2>
        </div>
        <div className="flex items-center gap-2">
          {onPageInfo && (
            <Button
              variant="outline"
              size="sm"
              onClick={onPageInfo}
              disabled={isLoading}
            >
              <Settings className="mr-2 h-4 w-4" />
              Page Info
            </Button>
          )}
          {onPreview && (
            <Button
              variant="outline"
              size="sm"
              onClick={onPreview}
              disabled={isLoading}
            >
              <Eye className="mr-2 h-4 w-4" />
              Preview
            </Button>
          )}
          <Button
            size="sm"
            onClick={handleSave}
            disabled={isLoading}
            variant="outline"
          >
            <Save className="mr-2 h-4 w-4" />
            {isLoading ? "Saving..." : "Save"}
          </Button>
          {onPublish && (
            <Button
              size="sm"
              onClick={handlePublish}
              disabled={isLoading}
            >
              <Upload className="mr-2 h-4 w-4" />
              {isLoading ? "Publishing..." : "Publish"}
            </Button>
          )}
        </div>
      </div>

      {/* Puck Editor */}
      <div className="flex-1 overflow-hidden">
        <Puck
          config={puckConfig}
          data={data}
          onPublish={handlePublish}
          onChange={setData}
        />
      </div>
    </div>
  );
}

