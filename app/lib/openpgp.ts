import * as openpgp from 'openpgp'
import { saveToLocalStorage, getFromLocalStorage, savePublicKeys} from './local_storage_manager';

type MessageData<T> = { success: true; data: string} | {success: false; error: string};
type KeyData<T> = { success: true; data: string} | {success: false; error: string};
type PublicKeyData<T> = { success: true; data: {name: string, email: string, keyid: string}} | {success: false; error: string};


export async function keygen(name: string, email: string, password: string): Promise<KeyData<null>>{
    try{
        const { privateKey, publicKey, revocationCertificate} = await openpgp.generateKey({
            type: 'ecc',
            curve: 'curve25519Legacy',
            userIDs: [{name: name, email: email}],
            passphrase: password,
            format: 'armored'
        });

        const currentDate = await new Date();
        const formattedDate = currentDate.toLocaleDateString(); 

        saveToLocalStorage(`${name}PrivateKey`, privateKey)
        savePublicKeys(name, name, email, formattedDate,publicKey)
        saveToLocalStorage('revocationCertificate', revocationCertificate)

        const publickeyid = await getKeyIdFromPublicKey(publicKey)

        return {success: true, data: publickeyid}
    
        // console.log(privateKey);
        // console.log(publicKey);
    } catch (e){
        console.error('Error Generating key', e)
        return {success: false, error: "Error when Generating Keys"}
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

export async function getKeyIdFromPublicKey(publicKeyArmored: string): Promise<string> {
    // Read the armored public key
    const publicKey = await openpgp.readKey({ armoredKey: publicKeyArmored });

    const keyId = publicKey.getKeyID().toHex()

    return keyId;
}



export async function getKeyData(key:string):Promise<PublicKeyData<null>> {
    try{
        const publicKey = await openpgp.readKey({ armoredKey: key });

        const data = publicKey.getUserIDs()
        const id = publicKey.getKeyID().toHex()

        const match = data[0].match(/(.+?) <(.+?)>/);

        if (match) {
            const val = {
                name: match[1].trim(),
                email: match[2].trim(),
              keyid: id, 
    
            }
            return {success: true, data: val}

        }else{
            return {success:false, error: "Invalid Key "}

        }


    }catch(e){
        console.log(e)
        return {success: false, error: "Error reading key"}
    }

}