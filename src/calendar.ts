import { toRFC3339, Shift } from "./utils.js";

export async function pushShiftsToCalendar(shifts: Shift[], calendarSvcClient: any, calendarId: string) {
    for (const shift of shifts) {
        try {
            await calendarSvcClient.events.insert({
                calendarId: calendarId,
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
                await calendarSvcClient.events.update({
                    calendarId: calendarId,
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
