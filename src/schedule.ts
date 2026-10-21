import { getSaturdayDate, toPublixDateStr, Shift, extractShifts } from "./utils.js";
import { Page } from "playwright";

export async function fetchSchedules(page: Page, offsets: number[]): Promise<Shift[]> {
    const shifts: Shift[] = [];

    for (const offset of offsets) {
        const dateStr = toPublixDateStr(getSaturdayDate(offset));

        console.log("Requesting data for schedule...");

        const response = await page.request.post(
            "https://www.publix.org/api/Sitecore/Scheduling/GetScheduleForWeek",
            {
                data: { date: dateStr, direction: dateStr },
            }
        );

        const scheduleData = await response.json();
        
        console.log("Success! Returning data...");

        shifts.push(...extractShifts(scheduleData)); 
    }
    
    return shifts;
}
