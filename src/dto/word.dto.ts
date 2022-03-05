export interface WordDto {
    _id: string;
    text: string;
    translation: string;
    each_minutes: number;
    repeat_remember: number;
    complete: boolean;
    completed_at: Date;
    created_at: Date;
}