import { scrape } from "@/lib/etl/scrapfly";
import {
  ECODE360_CONTENT_SELECTOR,
  ECODE360_CUSTOMER_ID,
  ECODE360_WEBSITE_URL,
} from "@/lib/etl/config";
import { NextResponse } from "next/server";

// export const runtime = "edge";

export async function GET() {
  try {
    const { selector } = await scrape(
      ECODE360_WEBSITE_URL + "/" + ECODE360_CUSTOMER_ID,
    );

    const html = selector("");

    const divisions = html.find("li .divisionTitle");
    const chapters = html.find("li .chapterTitle");

    return NextResponse.json({
      divisions: divisions.length,
      chapters: chapters.length,
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}
