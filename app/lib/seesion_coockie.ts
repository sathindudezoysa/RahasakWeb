// Creating a session coockie

export function storeUserState(stateName: string, stateValue: string, expireDays = 0){
    const  currentDate = new Date();
    if(expireDays > 0){
        currentDate.setTime(currentDate.getTime() + (expireDays * 24 * 60 * 60 * 100));
        const expires = "expires=" + currentDate.toUTCString(); 

        const cookieString = `${stateName}=${stateValue};${expires};path=/`;    
        
        document.cookie = cookieString;
    }
}


export function retrieveUserState(stateName: string): {name: string, email: string, password: string, mykeyID: string} | null {
    const name = stateName + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const stateEntries = decodedCookie.split(';');
    for (let i = 0; i < stateEntries.length; i++) {
        let stateEntry = stateEntries[i];
        while (stateEntry.charAt(0) === ' ') {
            stateEntry = stateEntry.substring(1);
        }
        if (stateEntry.indexOf(name) === 0) {
            return JSON.parse(stateEntry.substring(name.length, stateEntry.length));
        }
    }
    return null;
}

export function deleteUserState(stateName: string){
    const  currentDate = new Date();

    currentDate.setTime(currentDate.getTime() - (1 * 24 * 60 * 60 * 100));
    const expires = "expires=" + currentDate.toUTCString(); 

    const cookieString = `${stateName}= ;${expires};path=/`;    

    document.cookie = cookieString;
}