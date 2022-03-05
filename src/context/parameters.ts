export interface CreateEditWordDto {
    text?: string;
    translation?: string;
    each_minutes?: number | string;
    repeat_remember?: number | string;
    complete?: boolean;
}
export interface WherePagedDto {
    search?: string;
    page?: number;
    perPage?: number;
}
export interface SaveConfigDto {
    active_notification?: boolean;
    active_sound?: boolean;
}