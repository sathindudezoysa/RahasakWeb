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


        saveToLocalStorage('myPrivateKey', privateKey)
        saveToLocalStorage('myPublicKey', publicKey)
        saveToLocalStorage('revocationCertificate', revocationCertificate)
    
        // console.log(privateKey);
        // console.log(publicKey);
        return true
    } catch (e){
        console.error('Error Generating key', e)
        return false
    }

}

