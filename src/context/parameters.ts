export interface CreateEditWordDto {
    text: string;
    translation: string;
    each_minutes: number;
    repeat_remember: number;
}
export interface WherePagedDto {
    search?: string;
    page?: number;
    perPage?: number;
}
export interface SaveConfigDto {
    remember_days: number;
    active: boolean;
    date: Date | string;
}