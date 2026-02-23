import { BedCount } from "../enum/bed-count";
import { BathCount } from "../enum/bath-count";
import { HomeType } from "../enum/home-type";
import { City } from "./city.model";
export class CustomerPreference {
    minSquareFeet?:string;
    maxSquareFeet?:string;
    homeType?:string;
    minBed?: string;
    maxBed?: string;
    minBath?: string;
    minPrice?:string;
    maxPrice?:string;
    cities?:City[];
}
