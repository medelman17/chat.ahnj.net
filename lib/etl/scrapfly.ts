import { ScrapeConfig, ScrapeResult, ScrapflyClient } from "scrapfly-sdk";
import { SCRAPFLY_API_KEY } from "./config";

export const client = new ScrapflyClient({ key: SCRAPFLY_API_KEY });

export const scrape = async (url: string) => {
  try {
    const result: ScrapeResult = await client.scrape(
      new ScrapeConfig({
        url,
        render_js: true,
        country: "US",
        asp: true,
      }),
    );

    return { ...result, url, selector: result.selector };
  } catch (error) {
    console.error(error);
    throw error;
  }
};