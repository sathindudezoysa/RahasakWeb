export const  saveToLocalStorage = ( keyname: string ,key: string) =>{
    localStorage.setItem(keyname, key);
}

export const getFromLocalStorage = ():string | null => {
    const saveString = localStorage.getItem('mykey');
    console.log(saveString)
    return saveString
}
