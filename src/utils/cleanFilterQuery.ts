import { FilterQuery } from "mongoose";

export function cleanFilterQuery<T>(query: Partial<T>): FilterQuery<T> {
    return Object.fromEntries(
        Object.entries(query).filter(([_, value]) => value !== undefined)
    ) as FilterQuery<T>;
}