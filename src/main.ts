import { runLoginAndScraper } from "./login-scraper";
import { getAuthorizedClient } from "./google-auth";
import { pushShiftsToCalendar } from "./calendar-utils";
import { google } from "googleapis";

async function main() {
    const shifts = await runLoginAndScraper();
    const auth = await getAuthorizedClient();
    const calendar = google.calendar({ version: "v3", auth });
    
    await pushShiftsToCalendar(shifts, calendar);
    console.log("It is done.");
}

main().catch((err) => {
    console.error("Failed.", err);
    process.exit(1);
});
