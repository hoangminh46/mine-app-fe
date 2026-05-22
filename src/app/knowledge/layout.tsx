import { getKnowledgeTree } from "@/lib/knowledge";
import Sidebar from "@/components/Sidebar";

export default function KnowledgeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const tree = getKnowledgeTree();

  return (
    <div style={{ display: "flex", minHeight: "calc(100vh - var(--navbar-height))" }}>
      {/* Sidebar */}
      <Sidebar tree={tree} />

      {/* Main + TOC area — children handles its own TOC column */}
      <div
        style={{
          flex: 1,
          minWidth: 0,
        }}
      >
        {children}
      </div>
    </div>
  );
}
