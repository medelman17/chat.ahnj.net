import {
  loadUnstructuredElements,
  withNestedChildren,
} from "@/lib/unstructured";
import { ChatOpenAI } from "@langchain/openai";
import { UnstructuredLoader } from "@langchain/community/document_loaders/fs/unstructured";
import { Document } from "@langchain/core/documents";

// Set the runtime to edge
// export const runtime = "edge";

export async function GET() {
  const elements = await loadUnstructuredElements();
  const nodes = withNestedChildren(elements);

  // Return the response as a data stream
  return Response.json({ nodes, elements });
}
