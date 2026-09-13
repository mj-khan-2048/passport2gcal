export function getWeekStartSaturday(weeksFromNow: number = 0): Date {
    const today = new Date();
    const day = today.getDay();
    const diffToLastSaturday = (day - 6 + 7) % 7;
    const saturday = new Date(today);
    saturday.setDate(today.getDate() - diffToLastSaturday + weeksFromNow * 7);
    return saturday;
}

export function formatDate(date: Date): string {
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const yyyy = date.getFullYear();
    return `${mm}/${dd}/${yyyy}`;
}
