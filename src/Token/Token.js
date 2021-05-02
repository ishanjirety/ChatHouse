export function setToken(token,email){
    localStorage.setItem('token',JSON.stringify({"token":token,"email":email}))
}
export function getToken(){
    return JSON.parse(localStorage.getItem('token'))
}