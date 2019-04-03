
import { User } from "./users";

export class Room {
    friend: User;
    messages: Array<Messages>;
}

export class Messages {
    content: string;
    type: string;
    sender: string;
    date: Date;
}