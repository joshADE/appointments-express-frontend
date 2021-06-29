export interface Store {
    id: number;
    name: string;
    location: string;
    minTimeBlock: number;
    maxTimeBlock: number;
    isQuickProfile: boolean;
    createdAt: string;
}

export interface Role {
    id: number;
    name: string;
    description: string;
}

export interface StoreHours {
    storeId: number;
    dayOfWeek: number;
    isOpen: boolean;
    open: string;
    close: string;
}

export enum RepeatInterval {
    everyDayOfWeek,
    currentDayOfWeek,
    currentDayOfMonth,
    currentDayOfYear
}

export interface ClosedDaysTimes {
    id: number;
    storeId: number;
    from: string;
    to: string;
    repeat: boolean;
    repeatInterval: RepeatInterval;
}

export interface StoreWithDetails {
    store: Store;
    role: Role;
    storeHours: StoreHours[];
    closedDaysTimes: ClosedDaysTimes[];
}