import bcrypt from "bcryptjs";
import { getFromLocalStorage } from "./local_storage_manager";
import { keyDecryption } from "./openpgp";

type HashResult<T> = { success: true; data: {name: string, email:string, password: string} } | { success: false; error: string };
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

    const dataObject = JSON.parse(userData)
    
    const hashedPassword = dataObject.password
    try {
        const isValid = await bcrypt.compare(plainpassword, hashedPassword) 
        if (isValid){
            dataObject.password = plainpassword
            return { success: true, data: dataObject}
        }else{
            return{ success: false, error: "username or password is incorrect"}
        }

    } catch (e) {
        console.error(e);   
        return { success: false, error: "Some thing went wrong" }
    }
}
