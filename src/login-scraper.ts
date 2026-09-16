import { firefox } from "playwright";
import * as dotenv from "dotenv";
import * as fs from "fs";
import { getWeekStartSaturday, formatDate } from "./date-utils";
import { Shift, extractShifts } from "./schedule-adapter";
import { askUser } from "./prompt-utils";

dotenv.config();

async function getSchedule(page: import("playwright").Page): Promise<Shift[]> {
    const dateStr = formatDate(getWeekStartSaturday(2));

    console.log("Requesting data for schedule...");

    const response = await page.request.post(
        "https://www.publix.org/api/Sitecore/Scheduling/GetScheduleForWeek",
        {
            data: { date: dateStr, direction: dateStr },
        }
    );

    const scheduleData = await response.json();
    
    // Export locally for debugging and error purposes
    console.log("Writing JSON data to file...");
    const fileName = dateStr.replace(/\//g, "-");
    fs.writeFileSync(`cached-data/week-of-${fileName}.json`, JSON.stringify(scheduleData, null, 2));
    
    console.log("Success! JSONs exported! Returning data...");

    return extractShifts(scheduleData); 
}

export async function runLoginAndScraper(): Promise<Shift[]> {
    // Setup variables from .env
    const email = process.env.PASSPORT_EMAIL;
    const password = process.env.PASSPORT_PASSWORD;
    const loginUrl = process.env.PASSPORT_LOGIN_URL;

    // .env Error Catch
    if (!email || !password || !loginUrl) {
        throw new Error("Missing PASSPORT_EMAIL, PASSPORT_PASSWORD, or PASSPORT_LOGIN_URL in .env");
    }

    // Main Login
    const browser = await firefox.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto(loginUrl);

    console.log("Logging in...");
    await page.getByRole("button", { name: "Log in" }).click();

    console.log("Entering email...");
    await page.locator('input[type="email"]').fill(email);
    await page.getByRole("button", { name: "Next" }).click();

    console.log("Entering password...");
    await page.locator('input[type="password"]').fill(password);
    await page.getByRole("button", { name: "Sign in" }).click();
    await page.getByRole("button", { name: /Text/i }).click();

    console.log("Waiting on OTP...");
    const code = await askUser("Enter the OTP code you received: ");
    await page.getByPlaceholder('Code').fill(code);
    await page.getByRole("button", { name: "Verify" }).click();

    await page.getByRole("link", { name: "Schedule" }).click();

    console.log("Success! Logged in!");

    console.log("Navigating to Schedule page...");

    // POST request for schedule data and import into JSON files
    const shifts = await getSchedule(page);

    console.log("Closing user agent...");
    await browser.close();

    return shifts;
}
