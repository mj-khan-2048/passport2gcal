export interface Shift {
    id: string;
    description: string;
    start: string;
    end: string; 
}

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
