import { getKeyIdFromPublicKey } from "./openpgp";

export const  saveToLocalStorage = ( keyname: string ,key: string) =>{
    localStorage.setItem(keyname, key);
}

export const getFromLocalStorage = (key: string): string | null => {
    const saveString = localStorage.getItem(key);
    return saveString
}

export async function savePublicKeys(username: string, keyOwner: string, ownerEmail: string, createdDate: string,key: string){
    
    
    let jsonArrayString1 = localStorage.getItem(`${username}PublicKeys`)
    let jsonArrayString2 = localStorage.getItem(`${username}PublicKeysData`)

    
    const jsonArray1: Array<{keyID: string, key: string }> = jsonArrayString1 ? JSON.parse(jsonArrayString1) : [];
    const jsonArray2: Array<{ name: string; email: string; date: string; keyID: string }> = jsonArrayString2 ? JSON.parse(jsonArrayString2) : [];

    const keyid = await getKeyIdFromPublicKey(key);
    const newObject1 = {
        keyID: keyid,
        key: key
    };

    const newObject2 = {
        name: keyOwner,
        email: ownerEmail,
        date: createdDate,
        keyID: keyid
    };

    jsonArray1.push(newObject1)
    jsonArray2.push(newObject2)

    localStorage.setItem(`${username}PublicKeys`, JSON.stringify(jsonArray1))
    localStorage.setItem(`${username}PublicKeysData`, JSON.stringify(jsonArray2))

}

export function saveconversations(username: string, firendkey: string, conversationId: string){
    const file = localStorage.getItem(`${username}Conversations`)
    const filevalues: Array<{name: string, conversationId: string}> = file ? JSON.parse(file) : [];

    const newobj ={
        name: firendkey,
        conversationId: conversationId
    }

    filevalues.push(newobj)
    localStorage.setItem(`${username}Conversations`, JSON.stringify(filevalues))

}