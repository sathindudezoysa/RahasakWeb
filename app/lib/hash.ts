import bcrypt from "bcryptjs";
import { getFromLocalStorage } from "./local_storage_manager";

type HashResult<T> = { success: true; data: Boolean } | { success: false; error: string };
type Hash<t> = { success: true; data: string} | {success: false; error: string};

export async function getHashValue(password:string): Promise<Hash<null>> {
    try {
        const hashPassword = await bcrypt.hash(password, 10);
        return { success: true, data: hashPassword}
    } catch (error) {
        console.error("Error:", error);
        return {success: false, error: "Something went wrong when hashing"}
    }

}

export async function isMatch(email:string, plainpassword: string): Promise<HashResult<null>> {
    
    const userData = getFromLocalStorage(email)

    if(userData == null){
        return { success: false, error: "user name not found" }
    }
    
    const hashedPassword = JSON.parse(userData).password
    try {
        return { success: true, data: await bcrypt.compare(plainpassword, hashedPassword) }

    } catch (e) {
        console.error(e);   
        return { success: false, error: "Some thing went wrong" }
    }
}
