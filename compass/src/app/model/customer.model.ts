import { CustomerPreference } from "./customer-preference.model";
export class Customer {
    customerId?:string;
    firstName?:string;
    lastName?:string;
    email?:string;
    phoneNumber?:string;
    password?:string;
    confirmPassword?:string;
    demo?:boolean;
    preference?: CustomerPreference;
}
