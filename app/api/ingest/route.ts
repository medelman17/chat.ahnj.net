import { scrape } from "@/lib/etl/scrapfly";
import { ECODE360_CUSTOMER_ID, ECODE360_WEBSITE_URL } from "@/lib/etl/config";
import { NextResponse } from "next/server";

// export const runtime = "edge";

export async function GET() {
  try {
    const { result } = await scrape(
      ECODE360_WEBSITE_URL + "/" + ECODE360_CUSTOMER_ID,
    );
    console.log(
      `[api/ingest] result: ${JSON.stringify(result, null, 2)}`,
    );
    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    throw error;
  }
}
