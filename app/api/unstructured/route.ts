import {  loadUnstructuredElements, withNestedChildren } from "@/lib/unstructured";

// Set the runtime to edge
// export const runtime = "edge";

export async function GET() {
  const elements = await loadUnstructuredElements();
  const nodes = withNestedChildren(elements);

  // Return the response as a data stream
  return Response.json({ nodes });
}
