import { getFolderTree } from "@/lib/db/queries/folders";
import Sidebar from "@/components/Sidebar";

export default async function KnowledgeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const folderTree = await getFolderTree();

  return (
    <div style={{ display: "flex", minHeight: "calc(100vh - var(--navbar-height))" }}>
      {/* Sidebar */}
      <Sidebar folders={folderTree} />

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
