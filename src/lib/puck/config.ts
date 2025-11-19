import React from "react";
import { Config } from "@measured/puck";
import { HTMLField } from "./fields/HTMLField";
import { MaxWidthField } from "./fields/MaxWidthField";
import { PaddingField } from "./fields/PaddingField";
import { MarginField } from "./fields/MarginField";

/**
 * Puck.js Configuration
 * Defines all components available in the editor
 */
export const puckConfig: Config = {
  components: {
    Heading: {
      label: "Heading",
      fields: {
        text: { type: "text", label: "Text" },
        level: {
          type: "select",
          label: "Level",
          options: [
            { value: "1", label: "H1" },
            { value: "2", label: "H2" },
            { value: "3", label: "H3" },
            { value: "4", label: "H4" },
            { value: "5", label: "H5" },
            { value: "6", label: "H6" },
          ],
        },
      },
      defaultProps: {
        text: "Heading",
        level: "1",
      },
      render: ({ text, level }) => {
        const HeadingTag = `h${level}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
        const sizeClasses = {
          "1": "text-4xl font-bold",
          "2": "text-3xl font-bold",
          "3": "text-2xl font-semibold",
          "4": "text-xl font-semibold",
          "5": "text-lg font-medium",
          "6": "text-base font-medium",
        };
        return React.createElement(
          HeadingTag,
          { className: sizeClasses[level as keyof typeof sizeClasses] || "text-2xl font-semibold" },
          text
        );
      },
    },
    Text: {
      label: "Text",
      fields: {
        content: { type: "textarea", label: "Content" },
      },
      defaultProps: {
        content: "Enter text here...",
      },
      render: ({ content }) => {
        return React.createElement("p", { className: "text-base leading-relaxed mb-4" }, content);
      },
    },
    Container: {
      label: "Container",
      fields: {
        content: {
          type: "slot",
          label: "Content",
        },
        padding: {
          type: "custom",
          label: "Padding",
          render: ({ field, onChange, value }) => {
            const options = [
              { value: "none", label: "None" },
              { value: "small", label: "Small" },
              { value: "medium", label: "Medium" },
              { value: "large", label: "Large" },
            ];
            return React.createElement(PaddingField, {
              value: value || "",
              onChange: (newValue) => onChange(newValue),
              name: "padding",
              label: field.label,
              options,
            });
          },
        },
        margin: {
          type: "custom",
          label: "Margin",
          render: ({ field, onChange, value }) => {
            const options = [
              { value: "none", label: "None" },
              { value: "small", label: "Small" },
              { value: "medium", label: "Medium" },
              { value: "large", label: "Large" },
            ];
            return React.createElement(MarginField, {
              value: value || "",
              onChange: (newValue) => onChange(newValue),
              name: "margin",
              label: field.label,
              options,
            });
          },
        },
        maxWidth: {
          type: "custom",
          label: "Max Width",
          render: ({ field, onChange, value }) => {
            const options = [
              { value: "full", label: "Full" },
              { value: "md", label: "Medium" },
              { value: "lg", label: "Large" },
              { value: "xl", label: "Extra Large" },
            ];
            return React.createElement(MaxWidthField, {
              value: value || "",
              onChange: (newValue) => onChange(newValue),
              name: "maxWidth",
              label: field.label,
              options,
            });
          },
        },
        backgroundColor: {
          type: "text",
          label: "Background Color",
        },
        display: {
          type: "select",
          label: "Display",
          options: [
            { value: "block", label: "Block" },
            { value: "flex", label: "Flex" },
            { value: "grid", label: "Grid" },
            { value: "inline-flex", label: "Inline Flex" },
            { value: "inline-block", label: "Inline Block" },
            { value: "none", label: "None" },
          ],
        },
        flexDirection: {
          type: "select",
          label: "Flex Direction",
          options: [
            { value: "row", label: "Row" },
            { value: "column", label: "Column" },
            { value: "row-reverse", label: "Row Reverse" },
            { value: "column-reverse", label: "Column Reverse" },
          ],
        },
        alignItems: {
          type: "select",
          label: "Align Items",
          options: [
            { value: "flex-start", label: "Flex Start" },
            { value: "center", label: "Center" },
            { value: "flex-end", label: "Flex End" },
            { value: "stretch", label: "Stretch" },
            { value: "baseline", label: "Baseline" },
          ],
        },
        justifyContent: {
          type: "select",
          label: "Justify Content",
          options: [
            { value: "flex-start", label: "Flex Start" },
            { value: "center", label: "Center" },
            { value: "flex-end", label: "Flex End" },
            { value: "space-between", label: "Space Between" },
            { value: "space-around", label: "Space Around" },
            { value: "space-evenly", label: "Space Evenly" },
          ],
        },
        flexWrap: {
          type: "select",
          label: "Flex Wrap",
          options: [
            { value: "nowrap", label: "No Wrap" },
            { value: "wrap", label: "Wrap" },
            { value: "wrap-reverse", label: "Wrap Reverse" },
          ],
        },
        gap: {
          type: "select",
          label: "Gap",
          options: [
            { value: "none", label: "None" },
            { value: "small", label: "Small" },
            { value: "medium", label: "Medium" },
            { value: "large", label: "Large" },
          ],
        },
        id: {
          type: "text",
          label: "ID",
        },
        className: {
          type: "text",
          label: "Custom Classes",
        },
      },
      defaultProps: {
        padding: "medium",
        margin: "none",
        maxWidth: "lg",
        backgroundColor: "",
        display: "block",
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        flexWrap: "nowrap",
        gap: "none",
        id: "",
        className: "",
        // content: [],
      },
      render: ({ padding, margin, maxWidth, backgroundColor, display = "block", flexDirection = "row", alignItems = "flex-start", justifyContent = "flex-start", flexWrap = "nowrap", gap = "none", id, className, content: Content }) => {
        const paddingClasses = {
          none: "p-0",
          small: "p-4",
          medium: "p-6",
          large: "p-8",
        };
        const marginClasses = {
          none: "m-0",
          small: "m-4",
          medium: "m-6",
          large: "m-8",
        };
        const maxWidthClasses = {
          full: "max-w-full",
          md: "max-w-3xl",
          lg: "max-w-5xl",
          xl: "max-w-7xl",
        };

        // Display classes
        const displayClasses = {
          block: "block",
          flex: "flex",
          grid: "grid",
          "inline-flex": "inline-flex",
          "inline-block": "inline-block",
          none: "hidden",
        };

        // Flex direction classes
        const flexDirectionClasses = {
          row: "flex-row",
          column: "flex-col",
          "row-reverse": "flex-row-reverse",
          "column-reverse": "flex-col-reverse",
        };

        // Align items classes
        const alignItemsClasses = {
          "flex-start": "items-start",
          center: "items-center",
          "flex-end": "items-end",
          stretch: "items-stretch",
          baseline: "items-baseline",
        };

        // Justify content classes
        const justifyContentClasses = {
          "flex-start": "justify-start",
          center: "justify-center",
          "flex-end": "justify-end",
          "space-between": "justify-between",
          "space-around": "justify-around",
          "space-evenly": "justify-evenly",
        };

        // Flex wrap classes
        const flexWrapClasses = {
          nowrap: "flex-nowrap",
          wrap: "flex-wrap",
          "wrap-reverse": "flex-wrap-reverse",
        };

        // Gap classes
        const gapClasses = {
          none: "gap-0",
          small: "gap-2",
          medium: "gap-4",
          large: "gap-6",
        };

        // Helper function เพื่อ parse padding/margin แบบ 4 ด้าน
        const parseSpacing = (val: string): { top: string; right: string; bottom: string; left: string } | null => {
          if (!val) return null;

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

          // ถ้าเป็น CSS shorthand
          const parts = val.trim().split(/\s+/);
          if (parts.length === 1 && (parts[0].includes("px") || parts[0].includes("rem") || parts[0].includes("em") || parts[0].includes("%"))) {
            return { top: parts[0], right: parts[0], bottom: parts[0], left: parts[0] };
          } else if (parts.length === 2) {
            return { top: parts[0], right: parts[1], bottom: parts[0], left: parts[1] };
          } else if (parts.length === 4) {
            return { top: parts[0], right: parts[1], bottom: parts[2], left: parts[3] };
          }

          return null;
        };

        // ตรวจสอบว่า padding เป็น preset หรือ custom
        const isPaddingPreset = padding && paddingClasses[padding as keyof typeof paddingClasses];
        const paddingClass = isPaddingPreset
          ? paddingClasses[padding as keyof typeof paddingClasses]
          : "";
        const customPaddingClass = padding && !isPaddingPreset && (padding.startsWith("p-") || padding.startsWith("px-") || padding.startsWith("py-") || padding.startsWith("pt-") || padding.startsWith("pb-") || padding.startsWith("pl-") || padding.startsWith("pr-"))
          ? padding
          : "";

        // ตรวจสอบว่า margin เป็น preset หรือ custom
        const isMarginPreset = margin && marginClasses[margin as keyof typeof marginClasses];
        const marginClass = isMarginPreset
          ? marginClasses[margin as keyof typeof marginClasses]
          : "";
        const customMarginClass = margin && !isMarginPreset && (margin.startsWith("m-") || margin.startsWith("mx-") || margin.startsWith("my-") || margin.startsWith("mt-") || margin.startsWith("mb-") || margin.startsWith("ml-") || margin.startsWith("mr-"))
          ? margin
          : "";

        // ตรวจสอบว่า maxWidth เป็น preset หรือ custom
        const isMaxWidthPreset = maxWidth && maxWidthClasses[maxWidth as keyof typeof maxWidthClasses];
        const maxWidthClass = isMaxWidthPreset
          ? maxWidthClasses[maxWidth as keyof typeof maxWidthClasses]
          : "";

        const style: React.CSSProperties = {};
        if (backgroundColor) {
          style.backgroundColor = backgroundColor;
        }

        // Apply custom gap values via style (ถ้าไม่ใช่ preset)
        if ((display === "flex" || display === "grid" || display === "inline-flex") && gap && !gapClasses[gap as keyof typeof gapClasses]) {
          // ถ้า gap ไม่ใช่ preset ให้ใช้ style
          if (gap.includes("px") || gap.includes("rem") || gap.includes("em") || gap.includes("%")) {
            style.gap = gap;
          }
        }

        // Parse และ apply padding แบบ 4 ด้าน
        if (padding && !isPaddingPreset && !customPaddingClass) {
          const paddingSides = parseSpacing(padding);
          if (paddingSides) {
            if (paddingSides.top) style.paddingTop = paddingSides.top;
            if (paddingSides.right) style.paddingRight = paddingSides.right;
            if (paddingSides.bottom) style.paddingBottom = paddingSides.bottom;
            if (paddingSides.left) style.paddingLeft = paddingSides.left;
          } else if (padding.includes("px") || padding.includes("rem") || padding.includes("em") || padding.includes("%")) {
            // Fallback สำหรับค่าเดียว
            style.padding = padding;
          }
        }

        // Parse และ apply margin แบบ 4 ด้าน
        if (margin && !isMarginPreset && !customMarginClass) {
          const marginSides = parseSpacing(margin);
          if (marginSides) {
            if (marginSides.top) style.marginTop = marginSides.top;
            if (marginSides.right) style.marginRight = marginSides.right;
            if (marginSides.bottom) style.marginBottom = marginSides.bottom;
            if (marginSides.left) style.marginLeft = marginSides.left;
          } else if (margin.includes("px") || margin.includes("rem") || margin.includes("em") || margin.includes("%")) {
            // Fallback สำหรับค่าเดียว
            style.margin = margin;
          }
        }

        // ถ้าเป็น custom maxWidth value ให้ใช้ style
        if (maxWidth && !isMaxWidthPreset) {
          style.maxWidth = maxWidth.includes("px") || maxWidth.includes("rem") || maxWidth.includes("em") || maxWidth.includes("%")
            ? maxWidth
            : maxWidth.startsWith("max-w-")
              ? undefined // ถ้าเป็น Tailwind class ให้ใช้ className แทน
              : maxWidth;
        }

        // ถ้าเป็น Tailwind class ที่ไม่ใช่ preset ให้ใช้ className
        const customMaxWidthClass = maxWidth && !isMaxWidthPreset && maxWidth.startsWith("max-w-")
          ? maxWidth
          : "";

        // สร้าง className โดยรวม layout classes รวม display, flex, และ gap
        // ใช้ default values ถ้า props เป็น undefined
        const displayClass = displayClasses[display as keyof typeof displayClasses] || "";

        // Apply flex classes เมื่อ display เป็น flex
        const flexDirectionClass = (display === "flex" || display === "inline-flex")
          ? (flexDirectionClasses[flexDirection as keyof typeof flexDirectionClasses] || "")
          : "";

        const alignItemsClass = (display === "flex" || display === "inline-flex")
          ? (alignItemsClasses[alignItems as keyof typeof alignItemsClasses] || "")
          : "";

        const justifyContentClass = (display === "flex" || display === "inline-flex")
          ? (justifyContentClasses[justifyContent as keyof typeof justifyContentClasses] || "")
          : "";

        const flexWrapClass = (display === "flex" || display === "inline-flex")
          ? (flexWrapClasses[flexWrap as keyof typeof flexWrapClasses] || "")
          : "";

        const gapClass = (display === "flex" || display === "grid" || display === "inline-flex") && gap && gap !== "none"
          ? (gapClasses[gap as keyof typeof gapClasses] || "")
          : "";

        const classNames = [
          displayClass,
          flexDirectionClass,
          alignItemsClass,
          justifyContentClass,
          flexWrapClass,
          gapClass,
          paddingClass,
          customPaddingClass,
          marginClass,
          customMarginClass,
          maxWidthClass,
          customMaxWidthClass,
          // เพิ่ม mx-auto เฉพาะเมื่อไม่มี margin class ที่จะ override และ display ไม่ใช่ flex/grid
          !marginClass && !customMarginClass && display !== "flex" && display !== "grid" && display !== "inline-flex" ? "mx-auto" : "",
          // เพิ่ม custom className ที่ user ใส่เข้ามา
          className || "",
        ].filter(Boolean).join(" ");

        return React.createElement(
          "div",
          {
            id: id || undefined,
            className: classNames,
            style,
          },
          Content ? React.createElement(Content) : null
        );
      },
    },
    Button: {
      label: "Button",
      fields: {
        text: { type: "text", label: "Button Text" },
        variant: {
          type: "select",
          label: "Variant",
          options: [
            { value: "default", label: "Default" },
            { value: "outline", label: "Outline" },
            { value: "ghost", label: "Ghost" },
            { value: "link", label: "Link" },
          ],
        },
        href: { type: "text", label: "Link URL (optional)" },
      },
      defaultProps: {
        text: "Click me",
        variant: "default",
        href: "",
      },
      render: ({ text, variant, href }) => {
        const variantClasses = {
          default: "bg-primary text-primary-foreground hover:bg-primary/90",
          outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
          ghost: "hover:bg-accent hover:text-accent-foreground",
          link: "text-primary underline-offset-4 hover:underline",
        };
        const baseClasses = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none h-10 py-2 px-4";
        const className = `${baseClasses} ${variantClasses[variant as keyof typeof variantClasses] || variantClasses.default}`;

        if (href) {
          return React.createElement("a", { href, className }, text);
        }
        return React.createElement("button", { className, type: "button" }, text);
      },
    },
    Image: {
      label: "Image",
      fields: {
        src: { type: "text", label: "Image URL" },
        alt: { type: "text", label: "Alt Text" },
        width: { type: "number", label: "Width (optional)" },
        height: { type: "number", label: "Height (optional)" },
      },
      defaultProps: {
        src: "https://via.placeholder.com/800x400",
        alt: "Image",
        width: undefined,
        height: undefined,
      },
      render: ({ src, alt, width, height }) => {
        return React.createElement("img", {
          src,
          alt,
          width: width || undefined,
          height: height || undefined,
          className: "w-full h-auto rounded-lg",
        });
      },
    },
    Divider: {
      label: "Divider",
      fields: {
        spacing: {
          type: "select",
          label: "Spacing",
          options: [
            { value: "small", label: "Small" },
            { value: "medium", label: "Medium" },
            { value: "large", label: "Large" },
          ],
        },
      },
      defaultProps: {
        spacing: "medium",
      },
      render: ({ spacing }) => {
        const spacingClasses = {
          small: "my-4",
          medium: "my-8",
          large: "my-12",
        };
        return React.createElement("hr", {
          className: `${spacingClasses[spacing as keyof typeof spacingClasses]} border-border`,
        });
      },
    },
    HTML: {
      label: "HTML",
      fields: {
        html: {
          type: "custom",
          label: "HTML Code",
          render: ({ field, onChange, value }) => {
            return React.createElement(HTMLField, {
              value: value || "",
              onChange: (newValue) => onChange(newValue),
              name: "html",
              label: field.label,
            });
          },
        },
      },
      defaultProps: {
        html: "<div class=\"p-4 bg-gray-100 rounded-lg\">\n  <p class=\"text-lg font-semibold\">Your HTML here</p>\n  <p class=\"text-gray-600\">You can use Tailwind CSS classes</p>\n</div>",
      },
      render: ({ html }) => {
        // ใช้ display: contents เพื่อทำให้ div wrapper ไม่ส่งผลต่อ layout
        // แต่ยังคงต้องมี div เพราะ dangerouslySetInnerHTML ต้องมี element
        return React.createElement("div", {
          dangerouslySetInnerHTML: { __html: html || "" },
          style: { display: "contents" }, // ทำให้ div นี้ไม่ส่งผลต่อ layout
        });
      },
    },
    ContainerOriginal: {
      label: "Container Original",
      fields: {
        content: { type: "slot", label: "Content Original" },
        padding: {
          type: "select",
          label: "Padding",
          options: [
            { value: "none", label: "None" },
            { value: "small", label: "Small" },
            { value: "medium", label: "Medium" },
            { value: "large", label: "Large" },
          ],
        },
      },
      defaultProps: {
        padding: "medium",
        // content: [],
      },
      render: ({ padding, content: Content }) => {
        const paddingClasses = {
          none: "p-0",
          small: "p-4",
          medium: "p-6",
          large: "p-8",
        };

        const paddingClass = padding && paddingClasses[padding as keyof typeof paddingClasses]
          ? paddingClasses[padding as keyof typeof paddingClasses]
          : "";

        return React.createElement(
          "div",
          {
            className: paddingClass,
          },
          Content ? React.createElement(Content) : null
        );
      },
    },
  },
  categories: {
    typography: {
      title: "Typography",
      components: ["Heading", "Text"],
    },
    layout: {
      title: "Layout",
      components: ["Container", "ContainerOriginal", "Divider", "HTML"],
    },
    interactive: {
      title: "Interactive",
      components: ["Button"],
    },
    media: {
      title: "Media",
      components: ["Image"],
    },
  },
  root: {
    fields: {
      title: {
        type: "text",
        label: "Page Title",
      },
      description: {
        type: "textarea",
        label: "Page Description",
      },
    },
    defaultProps: {
      title: "",
      description: "",
    },
    render: (props: { children?: React.ReactNode; title?: string; description?: string }) => {
      const { children, title, description } = props;
      return React.createElement(
        "div",
        { className: "min-h-screen bg-background" },
        title && React.createElement("h1", { className: "sr-only" }, title),
        description && React.createElement("p", { className: "sr-only" }, description),
        children
      );
    },
  },
};

