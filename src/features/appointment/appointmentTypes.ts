import { Store } from "../store/storeTypes";

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
    accepted
}


export interface CreateAppointmentRequest {
    appointment: Partial<Appointment>;
    domain: string;
    email: string;
    firstName: string;
    lastName: string;
}

export interface UpdateAppointmentStatusRequest {
    appointmentId: number;
    newStatus: AppointmentStatus;
}

export interface AppointmentAndStore {
    appointment: Appointment;
    store: Store;
}