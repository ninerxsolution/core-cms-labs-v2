import { Render, type Data } from "@measured/puck";
import { puckConfig } from "@/lib/puck/config";

interface PageRendererProps {
  data: Data;
}

export function PageRenderer({ data }: PageRendererProps) {
  return <Render config={puckConfig} data={data} />;
}

