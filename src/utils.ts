import * as readline from "readline/promises";
import { Browser, Page} from "playwright";

/*
 * Gets date of most recent Saturday (and following Saturdays based on parameter)
 */
export function getSaturdayDate(weekOffset: number = 0): Date {
    const today = new Date();
    const dayOfTheWeek = today.getDay();
    const differenceToLastSaturday = (dayOfTheWeek + 1) % 7;

    const saturdayDate = new Date(today);
    saturdayDate.setDate((today.getDate() - differenceToLastSaturday) + (weekOffset * 7));
    return saturdayDate;
}

/*
 * Formats date to be compatible with Publix PASSPORT POST request
 */
export function toPublixDateStr(date: Date): string {
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const yyyy = date.getFullYear();
    return `${mm}/${dd}/${yyyy}`;
}

/*
 * Formats date to RFC3339 to be compatible with Google Calendar API
 */
export function toRFC3339(publixDateStr: string): string {
    const date = new Date(publixDateStr);
    return date.toISOString();
}

/*
 * Prompts user and stores user response as a string
 */
export async function askUser(questionStr: string): Promise<string> {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    const answer = await rl.question(questionStr);
    rl.close();
    return answer.trim();
}

/*
 * Custom Session interface to store Playwright contexts
 */
export interface Session {
    browserInstance: Browser;
    page: Page;
}

/*
 * Custom Shift interface for storing parsed JSON data
 */
export interface Shift {
    id: string;
    description: string;
    start: string;
    end: string; 
}

/*
 * Parses JSON data and stores it as an array of Shift objects
 */
export function extractShifts(scheduleData: any): Shift[] {
    const shifts: Shift[] = [];

    for (const day of scheduleData.ScheduledDays) {
        for (const shift of day.ScheduledShiftsList) {
            shifts.push({
                id: shift.ShiftId,
                description: shift.ShiftDescription,
                start: shift.Start,
                end: shift.End,
            });
        }
    }
    
    return shifts;
}