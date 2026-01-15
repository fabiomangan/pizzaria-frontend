export interface User{
    id: string;
    name: string;
    email: string;
    role: "ADMIN" | "STAFF";
    createAt: string;
    updateAt: string;
}

export interface AuthResponse{
    id: string;
    name: string;
    email: string;
    role: "ADMIN" | "STAFF";
    token: string;
}