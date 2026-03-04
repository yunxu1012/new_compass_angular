import { CustomerPreference } from "./customer-preference.model";
export class Customer {
    firstName?:string;
    lastName?:string;
    email?:string;
    phoneNumber?:string;
    password?:string;
    confirmPassword?:string;
    preference?: CustomerPreference;
}
