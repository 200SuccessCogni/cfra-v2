export type MessageType = {
    user: UserType;
    message: string;
    date?: Date | string;
}

export type UserType = {
    isSender: boolean;
    fullName: string;
}