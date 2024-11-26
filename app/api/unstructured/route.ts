import { buildChildMap, loadUnstructuredElements } from "@/lib/unstructured";

// Set the runtime to edge
// export const runtime = "edge";

export async function GET() {
  let elements = await loadUnstructuredElements();
  const relationships = buildChildMap(elements);
  const parents = Object.keys(relationships);
  // const result: string[] = [];

  for (const element of elements) {
    const isParent = parents.includes(element.element_id);
    if (isParent) {
      // Get the children
      const children = relationships[element.element_id];
      console.log(
        `ParentId: ${element.element_id} has ${children.length} children`,
      );
    }
  }

  // for (const [parent, children] of Object.entries(relationships)) {
  //   console.log(`ParentId: ${parent}`);

  //   for (const child of children) {
  //     result.push(`---> ChildId: ${child}`);
  //     const childElement = getUnstructuredElementById(elements, child);
  //     if (childElement) {
  //       const childIsParent = hasChildren(childElement, elements);
  //       console.log(`---> ChildIsParent: ${childIsParent}`);
  //     } else {
  //       console.log(`---> ChildElementNotFound: ${child}`);
  //     }
  //   }
  // }
  // Return the response as a data stream
  return Response.json({ parents });
}
