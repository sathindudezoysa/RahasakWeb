import * as openpgp from 'openpgp'
import { saveToLocalStorage, getFromLocalStorage} from './local_storage_manager';
import { List } from 'postcss/lib/list';

type MessageData<T> = { success: true; data: string} | {success: false; error: string};

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



export async function encryptMessage(message:string, publicKeyArmored: string, username: string, password: string): Promise<MessageData<null>> {
    
    const privateKeyArmored = getFromLocalStorage(`${username}PrivateKey`)
    if(privateKeyArmored == null){
        return {success: false, error: "Private Key Not Found"}
    }

    const publicKey = await openpgp.readKey({ armoredKey: publicKeyArmored });

    const privateKey = await openpgp.decryptKey({
        privateKey: await openpgp.readPrivateKey({ armoredKey: privateKeyArmored }),
        passphrase: password 
    });

    const encrypted = await openpgp.encrypt({
        message: await openpgp.createMessage({ text: message }), // input as Message object
        encryptionKeys: publicKey,
        signingKeys: privateKey // optional
    });
    console.log(encrypted);

    return {success: true, data: encrypted}
}

export async function encryptForGroup(message:string, publicKeysArmored: string[], username: string, password: string) {
    const privateKeyArmored = getFromLocalStorage(`${username}PrivateKey`)

    if(privateKeyArmored == null){
        return {success: false, error: "Private Key Not Found"}
    }

    const publicKeys = await Promise.all(publicKeysArmored.map(armoredKey => openpgp.readKey({ armoredKey })));

    const privateKey = await openpgp.decryptKey({
        privateKey: await openpgp.readPrivateKey({ armoredKey: privateKeyArmored }),
        passphrase: password 
    });


    const encrypted = await openpgp.encrypt({
        message: await openpgp.createMessage({ text: message }),
        encryptionKeys: publicKeys,
        signingKeys: privateKey // optional
    });
    console.log(encrypted); 
}

export async function decryptMessage(encryptedMessage:string, publicKeyArmored: string, username: string, password: string): Promise<MessageData<null>> {
    
    const privateKeyArmored = getFromLocalStorage(`${username}PrivateKey`)

    if(privateKeyArmored == null){
        return {success: false, error: "Private Key Not Found"}
    }
    
    const publicKey = await openpgp.readKey({ armoredKey: publicKeyArmored });

    const privateKey = await openpgp.decryptKey({
        privateKey: await openpgp.readPrivateKey({ armoredKey: privateKeyArmored }),
        passphrase: password 
    });

    const message = await openpgp.readMessage({
        armoredMessage: encryptedMessage // parse armored message
    });
    const { data: decrypted, signatures } = await openpgp.decrypt({
        message,
        verificationKeys: publicKey, // optional
        decryptionKeys: privateKey
    });

    try {
        await signatures[0].verified; // throws on invalid signature
        console.log('Signature is valid');
        return{success: true, data: decrypted}

    } catch (e: any) {
        return {success: false, error:'Signature could not be verified: ' + e.message}
    }

}


