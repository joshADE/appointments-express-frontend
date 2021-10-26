export interface Customer {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
}

export interface CustomerAuthRequest {
    customerId: number;
    passcode: string;
}

export interface CustomerAuthResponse {
    customer: Customer;
    request: CustomerAuthRequest;
}

