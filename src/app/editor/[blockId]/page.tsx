import { EditorPage } from "@/views/editor";

export default function Page({ params }: { params: { blockId: string } }) {
  return <EditorPage blockId={params.blockId} />;
}
