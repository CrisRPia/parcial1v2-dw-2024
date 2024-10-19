/** @typedef {{ "token": "string", "usuario": { "id_usuario": 0, "username": "string", "email": "string", "is_admin": true } }} LoginResponse */

/** @type {(login: LoginResponse) => void} */
export function setLogin(login) {
    localStorage.setItem("login", JSON.stringify(login));
}

export function getLogin() {
    const login = localStorage.getItem("login");

    /** @type {LoginResponse | undefined)} */
    const parsed = JSON.parse(login);

    return parsed;
}

export function getAuthorization() {
    return {
        Authorization: "Bearer " + getLogin()?.token
    }
}
