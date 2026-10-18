import { runLoginAndScraper } from "./login-scraper.js";
import { getAuthorizedClient } from "./google-auth.js";
import { pushShiftsToCalendar } from "./gcal-push.js";
import { google } from "googleapis";

async function main() {
    const auth = await getAuthorizedClient();
    const shifts = await runLoginAndScraper();
    const calendar = google.calendar({ version: "v3", auth });
    
    await pushShiftsToCalendar(shifts, calendar);
    console.log("It is done.");
}

main().catch((err) => {
    console.error("Failed.", err);
    process.exit(1);
});
