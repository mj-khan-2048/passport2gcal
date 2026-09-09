import { runLoginAndScraper } from "./login-scraper";

runLoginAndScraper().catch((err) => {
    console.error("Log in sequence and scraping failed.", err);
    process.exit(1);
});