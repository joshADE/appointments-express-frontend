export interface Appointment {
    id: number;
    storeId: number;
    customerId: number;
    start: string;
    end: string;
    title: string;
    description: string;
    status: AppointmentStatus;
    createdAt: string;
}

export enum AppointmentStatus {
    pending,
    complete,
    declined,
}


export interface CreateAppointmentRequest {
    appointment: Partial<Appointment>;
    domain: string;
    email: string;
    firstName: string;
    lastName: string;
}