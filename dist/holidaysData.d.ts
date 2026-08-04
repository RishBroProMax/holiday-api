export declare const holidayData: {
    meta: {
        version: string;
        generated: string;
        source: string;
        totalHolidays: number;
        startYear: number;
        endYear: number;
        types: string[];
        timezone: string;
    };
    holidays: {
        id: string;
        name: string;
        date: string;
        year: number;
        month: number;
        day: number;
        dayOfWeek: string;
        type: string;
        category: string;
        isPublicHoliday: boolean;
        isBankHoliday: boolean;
        description: string;
    }[];
};
