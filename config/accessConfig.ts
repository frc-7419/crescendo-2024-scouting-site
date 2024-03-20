import {Access} from "@/types/Access";

export const accessConfig: Record<string, Access[]> = {
    "/data": ["TEAM", "ADMIN", "SITEADMIN"],
    "/scouters": ["ADMIN", "SITEADMIN"],
    "/dashboard/admin": ["ADMIN", "SITEADMIN"],
};