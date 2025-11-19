"use client";

import "@measured/puck/puck.css";
import { Puck, type Data, usePuck } from "@measured/puck";
import { puckConfig } from "@/lib/puck/config";
import { Button } from "@/components/ui/button";
import { Save, Eye, Settings, ArrowLeft, Upload, Undo2, Redo2, PanelLeft, PanelRight } from "lucide-react";
import React, { useState, useEffect, useCallback } from "react";

interface PageEditorProps {
  initialData?: Data;
  onSave: (data: Data) => Promise<void>;
  onPublish?: (data: Data) => Promise<void>;
  onPreview?: () => void;
  onPageInfo?: () => void;
  onExit?: () => void;
  isLoading?: boolean;
  pageTitle?: string;
}

// Component to access usePuck hook for history
function HeaderActionsComponent({
  onPublish,
  onExit,
  onPageInfo,
  onPreview,
  onSave,
  isLoading,
  pageTitle,
}: {
  onPublish: () => void;
  onExit?: () => void;
  onPageInfo?: () => void;
  onPreview?: () => void;
  onSave: () => void;
  isLoading: boolean;
  pageTitle?: string;
}) {
  const { history, appState, dispatch } = usePuck();
  const canUndo = history.hasPast;
  const canRedo = history.hasFuture;
  const ui = appState.ui;

  return (
    <div className="flex items-center gap-4 w-[100vw] justify-between p-4 border-b">
      <div className="flex items-center gap-2">
        {/* Exit */}
        {onExit && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onExit}
            disabled={isLoading}
            title="Exit"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Exit
          </Button>
        )}

        <div>
          {/* Toggle Left Sidebar */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              dispatch({
                type: "setUi",
                ui: { leftSideBarVisible: !ui.leftSideBarVisible },
              });
            }}
            title="Toggle left sidebar"
          >
            <PanelLeft className="h-4 w-4" />
          </Button>

          {/* Toggle Right Sidebar */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              dispatch({
                type: "setUi",
                ui: { rightSideBarVisible: !ui.rightSideBarVisible },
              });
            }}
            title="Toggle right sidebar"
          >
            <PanelRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="text-lg font-bold">
        {pageTitle || "Page Title"}
      </div>

      <div className="flex items-center gap-3">
        <div>
          {/* Undo */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              history.back();
            }}
            disabled={!canUndo}
            title="Undo"
          >
            <Undo2 className="h-4 w-4" />
          </Button>

          {/* Redo */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              history.forward();
            }}
            disabled={!canRedo}
            title="Redo"
          >
            <Redo2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-3">
        {/* Page Info */}
        {onPageInfo && (
          <Button
            variant="outline"
            size="sm"
            onClick={onPageInfo}
            disabled={isLoading}
            title="Page Info"
          >
            <Settings className="mr-2 h-4 w-4" />
            Page Info
          </Button>
        )}

        {/* Preview */}
        {onPreview && (
          <Button
            variant="outline"
            size="sm"
            onClick={onPreview}
            disabled={isLoading}
            title="Preview"
          >
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Button>
        )}
      </div>

        <div className="flex items-center gap-3">
          {/* Save */}
          <Button
            size="sm"
            onClick={onSave}
            disabled={isLoading}
            variant="outline"
            title="Save"
          >
            <Save className="mr-2 h-4 w-4" />
            {isLoading ? "Saving..." : "Save"}
          </Button>

          {/* Publish */}
          <Button
            size="sm"
            onClick={onPublish}
            disabled={isLoading}
            title="Publish"
          >
            <Upload className="mr-2 h-4 w-4" />
            {isLoading ? "Publishing..." : "Publish"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export function PageEditor({
  initialData,
  onSave,
  onPublish,
  onPreview,
  onPageInfo,
  onExit,
  isLoading = false,
  pageTitle,
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

  // Handlers that will get the latest data from Puck context when called
  const handleSave = useCallback(async () => {
    await onSave(data);
  }, [onSave, data]);

  const handlePublish = useCallback(async () => {
    if (onPublish) {
      await onPublish(data);
    } else {
      // Fallback to save if onPublish is not provided
      await onSave(data);
    }
  }, [onPublish, onSave, data]);

  // Custom header component using overrides pattern
  const CustomHeader = () => {
    return (
      <HeaderActionsComponent
        onPublish={handlePublish}
        onExit={onExit}
        onPageInfo={onPageInfo}
        onPreview={onPreview}
        onSave={handleSave}
        isLoading={isLoading}
        pageTitle={pageTitle}
      />
    );
  };

  // Custom header actions component using overrides pattern
  const CustomHeaderActions = () => {
    return (
      <HeaderActionsComponent
        onPublish={handlePublish}
        onExit={onExit}
        onPageInfo={onPageInfo}
        onPreview={onPreview}
        onSave={handleSave}
        isLoading={isLoading}
        pageTitle={pageTitle}
      />
    );
  };

  return (
    <div className="h-full">
      <Puck
        config={puckConfig}
        data={data}
        // Don't pass onPublish to prevent default Publish button from showing
        onChange={setData}
        overrides={{
          header: CustomHeader,
          headerActions: CustomHeaderActions,
        }}
      />
    </div>
  );
}
