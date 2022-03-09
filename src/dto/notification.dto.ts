export interface NotificationDto {
    _id: string;
    title: string;
    message: string;
    created_at: Date;
    open_at: Date;
    user: string;
}
