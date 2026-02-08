import { EditorPage } from "@/views/editor";

interface PageProps {
  params: Promise<{ blockId: string }>;
}

export default async function Page({ params }: PageProps) {
  const { blockId } = await params;

  return <EditorPage blockId={blockId} />;
}
