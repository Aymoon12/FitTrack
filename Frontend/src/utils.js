export const getUUID = () => {
    return localStorage.getItem('uuid');
};

export const getToken = () =>{
    return localStorage.getItem('token');
}
export const getUser = () =>{
    let user = localStorage.getItem('user')
    return JSON.parse(user)
}



