import * as openpgp from 'openpgp'
import { saveToLocalStorage, getFromLocalStorage} from './local_storage_manager';

export async function keygen(name: string, email: string, password: string): Promise<Boolean>{
    try{
        const { privateKey, publicKey, revocationCertificate} = await openpgp.generateKey({
            type: 'ecc',
            curve: 'curve25519Legacy',
            userIDs: [{name: name, email: email}],
            passphrase: password,
            format: 'armored'
        });




        saveToLocalStorage(`${name}PrivateKey`, privateKey)
        saveToLocalStorage(`${name}PublicKeys`, publicKey)
        saveToLocalStorage('revocationCertificate', revocationCertificate)
    
        // console.log(privateKey);
        // console.log(publicKey);
        return true
    } catch (e){
        console.error('Error Generating key', e)
        return false
    }

}

export function textEncoder(text: string):Uint8Array{
    const encoder = new TextEncoder();
    const binaryData = encoder.encode(text);

    return binaryData;
}

export function textDecorder(array: Uint8Array):string{
    const decoder = new TextDecoder(); // Default encoding is 'utf-8'
    const text =  decoder.decode(array);

    return text;
}


export async function keyEncryption(key:string, pass: string) {
    
    const binaryData = textEncoder(key);
    const message = await openpgp.createMessage({ binary: new Uint8Array(binaryData) });
    const excrypted = await openpgp.encrypt({
        message,
        passwords: pass,
        format: 'binary'
    });
    return JSON.stringify(Array.from(excrypted))
}

export async function keyDecryption(encryptedKey:Uint8Array, pass: string) {

    const encryptedMessage = await openpgp.readMessage({
        binaryMessage: encryptedKey // parse encrypted bytes
    });
    const { data: decrypted } = await openpgp.decrypt({
        message: encryptedMessage,
        passwords: pass, // decrypt with password
        format: 'binary' // output as Uint8Array
    });

    return textDecorder(decrypted)
}



export async function encryptMessage(message:string, publicKeyArmored: string, privateKeyArmored: string) {
    const publicKey = await openpgp.readKey({ armoredKey: publicKeyArmored });

    const privateKey = await openpgp.decryptKey({
        privateKey: await openpgp.readPrivateKey({ armoredKey: privateKeyArmored }),
        passphrase
    });
    
}

