import React from "react";
import { Config } from "@measured/puck";
import { HTMLField } from "./fields/HTMLField";

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
          type: "select",
          label: "Padding",
          options: [
            { value: "none", label: "None" },
            { value: "small", label: "Small" },
            { value: "medium", label: "Medium" },
            { value: "large", label: "Large" },
          ],
        },
        maxWidth: {
          type: "select",
          label: "Max Width",
          options: [
            { value: "full", label: "Full" },
            { value: "md", label: "Medium" },
            { value: "lg", label: "Large" },
            { value: "xl", label: "Extra Large" },
          ],
        },
        backgroundColor: {
          type: "text",
          label: "Background Color",
        },
      },
      defaultProps: {
        padding: "medium",
        maxWidth: "lg",
        backgroundColor: "",
        content: [],
      },
      render: ({ padding, maxWidth, backgroundColor, content: Content }) => {
        const paddingClasses = {
          none: "p-0",
          small: "p-4",
          medium: "p-6",
          large: "p-8",
        };
        const maxWidthClasses = {
          full: "max-w-full",
          md: "max-w-3xl",
          lg: "max-w-5xl",
          xl: "max-w-7xl",
        };
        const style: React.CSSProperties = {};
        if (backgroundColor) {
          style.backgroundColor = backgroundColor;
        }
        
        return React.createElement(
          "div",
          {
            className: `${paddingClasses[padding as keyof typeof paddingClasses]} ${maxWidthClasses[maxWidth as keyof typeof maxWidthClasses]} mx-auto`,
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
          render: ({ field, name, onChange, value }) => {
            return React.createElement(HTMLField, {
              value: value || "",
              onChange: (newValue) => onChange(newValue),
              name,
              label: field.label,
            });
          },
        },
      },
      defaultProps: {
        html: "<div class=\"p-4 bg-gray-100 rounded-lg\">\n  <p class=\"text-lg font-semibold\">Your HTML here</p>\n  <p class=\"text-gray-600\">You can use Tailwind CSS classes</p>\n</div>",
      },
      render: ({ html }) => {
        return React.createElement("div", {
          dangerouslySetInnerHTML: { __html: html || "" },
        });
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
      components: ["Container", "Divider", "HTML"],
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

