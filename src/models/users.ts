import { Room } from "./rooms";

export class User {
    email: string;
    name: string;
    password: string;
    photo: string;
    registime: Date;
    friends: Array<User>;
    rooms: Array<Room>;
    tel: string;
    path_photo: string;
}