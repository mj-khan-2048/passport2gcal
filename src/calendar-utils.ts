import { toRFC3339 } from "./date-utils";
import * as dotenv from "dotenv";
import { Shift } from "./schedule-adapter";

dotenv.config();

export async function pushShiftsToCalendar(shifts: Shift[], calendar: any) {

    const CALENDAR_ID = process.env.CALENDAR_ID ?? "primary";

    for (const shift of shifts) {
        try {
            await calendar.events.insert({
                calendarId: CALENDAR_ID,
                requestBody: {
                    id: `shift${shift.id}`,
                    summary: "Shift",
                    description: shift.description,
                    start: { dateTime: toRFC3339(shift.start) },
                    end: { dateTime: toRFC3339(shift.end) },
                },
            });
        } catch(err: any) {
            if (err.code === 409) {
                await calendar.events.update({
                    calendarId: CALENDAR_ID,
                    eventId: `shift${shift.id}`,
                    requestBody: {
                        summary: "Shift",
                        description: shift.description,
                        start: { dateTime: toRFC3339(shift.start) },
                        end: { dateTime: toRFC3339(shift.end) },
                    },
                });
            } else {
                throw err;
            }
        }
    }
}
