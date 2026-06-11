import { JwtPayload as DefaultJwtPayload } from "jsonwebtoken";


export interface MyJwtPayload extends DefaultJwtPayload{
    id : number;
    firstName : string;
}