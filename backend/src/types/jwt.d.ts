import { JwtPayload as DefaultJwtPayload } from "jsonwebtoken";


export interface MyJwtPayload extends DefaultJwtPayload{
    id : string;
    firstName : string;
}