import * as local from "../../localstorage.js";

/** @type {HTMLButtonElement} */
const submit = document.getElementById("submit");

/** @type {HTMLInputElement} */
const usernameInput = document.getElementById("username");

/** @type {HTMLInputElement} */
const passwordInput = document.getElementById("password");

async function main() {
    submit.addEventListener("click", async () => {
        const result = await fetch("http://localhost/back/auth/", {
            body: JSON.stringify({
                username: usernameInput.value,
                contraseña: passwordInput.value,
            }),
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!result.ok) {
            alert("Credenciales inválidas");
            console.error(result);
            return;
        }

        /** @type {LoginResponse} */
        const parsedResult = await result.json();

        local.setLogin(parsedResult);

        window.location.href = "../../";
    });
}

main();
