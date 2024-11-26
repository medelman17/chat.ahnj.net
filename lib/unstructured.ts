export type ElementType =
  | "Header"
  | "Title"
  | "Footer"
  | "NarrativeText"
  | "Table"
  | "PageNumber"
  | "UncategorizedText"
  | "ListItem"
  | "Image";

export interface Metadata {
  filetype: string;
  languages: string[];
  page_number: number;
  filename: string;
  parent_id?: string; // Optional field as it's not present in all elements
}

export interface UnstructuredElement {
  type: ElementType;
  element_id: string;
  text: string;
  metadata: Metadata;
}

export interface UnstructuredElementWithChildren extends UnstructuredElement {
  children: UnstructuredElement[];
}

import { promises as fs } from "fs";
import path from "path";

export async function loadJsonFile<T>(filename: string): Promise<T> {
  try {
    const filePath = path.join(process.cwd(), "data", filename);
    const fileContents = await fs.readFile(filePath, "utf-8");
    return JSON.parse(fileContents) as T;
  } catch (error) {
    console.error(`Error loading JSON file ${filename}:`, error);
    throw error;
  }
}

// Convenience function specifically for UnstructuredElements
export async function loadUnstructuredElements(): Promise<
  UnstructuredElement[]
> {
  let elements = await loadJsonFile<UnstructuredElement[]>(
    "unstructured-no-chunking.json",
  );

  elements = filterFooters(elements);

  return elements;
}

function filterFooters(elements: UnstructuredElement[]) {
  const filteredElements: UnstructuredElement[] = [];

  for (const element of elements) {
    if (
      element.type !== "Footer" ||
      element.text !==
        "Downloaded from https://ecode360.com/AT0153 on 2024-11-20"
    ) {
      filteredElements.push(element);
    }
  }

  return filteredElements;
}

export function returnFooters(elements: UnstructuredElement[]) {
  const footers: string[] = [];
  const footers_elements: UnstructuredElement[] = [];

  for (const element of elements) {
    if (element.type === "Footer") {
      footers.push(element.text);
      footers_elements.push(element);
    }
  }

  return { footers, footers_elements };
}

export function returnHeaders(elements: UnstructuredElement[]) {
  const headers: string[] = [];
  const headers_elements: UnstructuredElement[] = [];

  for (const element of elements) {
    if (element.type === "Footer") {
      headers.push(element.text);
      headers_elements.push(element);
    }
  }

  return { headers, headers_elements };
}

export function mapElementTypes(elements: UnstructuredElement[]) {
  const elementMap: Record<string, number> = {};

  for (const element of elements) {
    if (element.type) {
      elementMap[element.type] = (elementMap[element.type] || 0) + 1;
    }
  }

  return elementMap;
}

export function hasParentId(element: UnstructuredElement) {
  return element.metadata.parent_id !== undefined;
}

export function getParentId(element: UnstructuredElement) {
  return element.metadata.parent_id || "";
}

export function elementsWithChildren(
  elements: UnstructuredElement[],
): UnstructuredElementWithChildren[] {
  const elementsWithChildren = addChildrenToElements(elements);

  return elementsWithChildren;
}

export function addChildrenToElements(elements: UnstructuredElement[]) {
  const elementsWithChildren: UnstructuredElementWithChildren[] = [];

  for (const element of elements) {
    elementsWithChildren.push({ ...element, children: [] });
  }

  return elementsWithChildren;
}

type ChildMap = Record<string, string[]>;

export function buildChildMap(elements: UnstructuredElement[]) {
  const childMap: ChildMap = {};

  for (const element of elements) {
    if (hasParentId(element)) {
      const parentId = getParentId(element);
      childMap[parentId] = childMap[parentId] || [];
      childMap[parentId].push(element.element_id);
    }
  }

  return childMap;
}

export function getUnstructuredElementById(
  elements: UnstructuredElement[],
  id: string,
) {
  return elements.find((element) => element.element_id === id);
}

export function hasChildren(
  element: UnstructuredElement,
  elements: UnstructuredElement[],
) {
  const childMap = buildChildMap(elements);
  const parents = parentList(childMap);
  return parents.includes(element.element_id);
}

function parentList(childMap: ChildMap) {
  return Object.keys(childMap);
}

export function withNestedChildren(elements: UnstructuredElement[]): UnstructuredElementWithChildren[] {
  // Create a map with all elements converted to UnstructuredElementWithChildren
  const elementMap = new Map<string, UnstructuredElementWithChildren>();
  const rootElements: UnstructuredElementWithChildren[] = [];
  
  // First pass: create the map of all elements with empty children arrays
  elements.forEach(element => {
      elementMap.set(element.element_id, {
          ...element,
          children: []
      });
  });
  
  // Second pass: organize elements into hierarchy
  elements.forEach(element => {
      const parentId = element.metadata.parent_id;
      const elementWithChildren = elementMap.get(element.element_id)!;
      
      if (!parentId) {
          // This is a root element
          rootElements.push(elementWithChildren);
      } else {
          // This element has a parent
          const parent = elementMap.get(parentId);
          
          if (parent) {
              // Add this element as a child
              parent.children.push(elementWithChildren);
          } else {
              // Parent not found, treat as root element
              console.warn(`Parent element with ID ${parentId} not found for element ${element.element_id}`);
              rootElements.push(elementWithChildren);
          }
      }
  });
  
  // Helper function to sort children recursively
  function sortChildrenRecursively(element: UnstructuredElementWithChildren) {
      // Sort children by their position in the original array
      element.children.sort((a, b) => {
          const aIndex = elements.findIndex(e => e.element_id === a.element_id);
          const bIndex = elements.findIndex(e => e.element_id === b.element_id);
          return aIndex - bIndex;
      });
      
      // Recursively sort children's children
      (element.children as UnstructuredElementWithChildren[]).forEach(sortChildrenRecursively);
  }
  
  // Sort all root elements and their children
  rootElements.forEach(sortChildrenRecursively);
  
  return rootElements;
}