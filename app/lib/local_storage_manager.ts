export const  saveToLocalStorage = ( keyname: string ,key: string) =>{
    localStorage.setItem(keyname, key);
}

export const getFromLocalStorage = (key: string): string | null => {
    const saveString = localStorage.getItem(key);
    return saveString
}
