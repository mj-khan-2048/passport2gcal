import { runLoginAndScraper } from "./login-scraper";

runLoginAndScraper().catch((err) => {
    console.error("Script failed:", err);
    process.exit(1);
});