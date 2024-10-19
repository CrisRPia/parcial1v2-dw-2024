import { getLogin } from "./localstorage.js";

if (!getLogin()) {
    window.location.href = "./auth/login"
}
