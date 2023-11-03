export interface Iuser {
    id: string;
    fullname: string;
    email: string;
    phoneNo?: string;
    business: Ibusiness;
    pmLevel: number; // 1 - Admin
}

export interface Ibusiness {
    businessId: string;
    businessName: string;
    address?: string;
    businessUrl?: string;
    domain?: string;
    country?: string;
}
