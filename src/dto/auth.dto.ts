export interface LoginDto {
    username: string;
    password: string;
    captcha: string;
}

export interface RegisterDto {
    username: string;
    password: string;
    email: string;
    name: string;
    captcha: string;
}
