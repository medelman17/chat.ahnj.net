import { createClient, createIndex } from "@/lib/pinecone";

const pc = createClient();

export async function GET() {
  await createIndex(pc, "municipal-code-index");
  return Response.json({ msg: "OK" });
}
