interface Shift {
    id: string;
    start: string;
    end: string; 
}

export function extractShifts(scheduleData: any): Shift[] {
    const shifts: Shift[] = [];

    for (const day of scheduleData.ScheduledDays) {
        for (const shift of scheduleData.ScheduledShiftsList) {
            shifts.push({
                id: shift.ShiftId,
                start: shift.Start,
                end: shift.End,
            });
        }
    }
    
    return shifts;
}
