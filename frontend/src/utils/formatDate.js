//Gets the date in format "yyyy-mm-dd" (say 2026-05-01, and changes it to May 5th, Monday)
export const formatDate = (dateStr) => {
    const [year, month, day] = dateStr.split("-").map(Number);
    const date = new Date(year, month - 1, day);

    const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
    const monthName = date.toLocaleDateString("en-US", { month: "long" });

    const suffix = (d) => {
        if (d >= 11 && d <= 13) return "th";
        if (d % 10 === 1) return "st";
        if (d % 10 === 2) return "nd";
        if (d % 10 === 3) return "rd";
        return "th";
    };

    return {
        date: `${monthName} ${day}${suffix(day)}`,
        day: `${dayName}`
    };
};