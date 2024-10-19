import { getLogin, getAuthorization } from "../../localstorage.js";

//<!doctype html>
//<html lang="es">
//    <head>
//        <meta charset="UTF-8" />
//        <meta name="viewport" content="width=device-width, initial-scale=1" />
//        <title>Mis temas</title>
//        <link href="../global.css" rel="stylesheet" />
//        <script src="../guard.js" defer></script>
//        <script src="./mythemes.js" defer type="module"></script>
//    </head>
//    <body>
//        <h1>Mis temas</h1>
//        <p id="myInfo"></p>
//        <button type="button" id="logout">Cerrar sesión</button>
//        <h2>Eliminar comentario</h2>
//        <form>
//            <label for="id">Identificador de comentario.</label>
//            <input type="number" name="id" id="deleteId" value="" />
//            <button type="button" id="deleteButton"> Eliminar</button>
//        </form>
//        <h2> Crear comentario. </h2>
//        <form>
//            <label for="id">Identificador de comentario.</label>
//            <input type="number" name="id" value="" id="createId">
//            <label for="comment">Comentario</label>
//            <input type="text" name="comment" value="" id="createCommentDescription">
//            <button type="button" id="createButton"></button>
//        </form>
//        <section id="themes"></section>
//    </body>
//</html>

/** @type {HTMLInputElement} */
const createThemeIdInput = document.getElementById("createId");

/** @type {HTMLInputElement} */
const commentDescriptionInput = document.getElementById("createCommentDescription");

/** @type {HTMLButtonElement} */
const createButton = document.getElementById("createButton");

/** @type {Tema[]} */
let themes = [];

/** @type {BackendComment[]} */
let comments = [];

/** @type {HTMLParagraphElement} */
const myInfoP = document.getElementById("myInfo");

/** @type {HTMLDivElement} */
const showThemesDiv = document.getElementById("themes");

/** @type {HTMLInputElement} */
const deleteIdInput = document.getElementById("deleteId");

/** @type {HTMLButtonElement} */
const deleteButton = document.getElementById("deleteButton");

async function main() {
    const login = getLogin();

    myInfoP.textContent = `Hola ${login.usuario.username}`;

    const result = await fetch(
        `http://localhost/back/temas/`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                ...getAuthorization(),
            },
        }
    );

    if (!result.ok && alert("Error al conseguir temas. Recargar?")) {
        window.location.reload();
    }

    /** @type {Tema[]} */
    themes = await result.json();

    for (const theme of themes) {
        const div = document.createElement("div");

        const commentsResult = await fetch(
            `http://localhost/back/usuarios/${theme.id_usuario}/temas/${theme.id_tema}/comentarios/`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    ...getAuthorization(),
                },
            }
        );

        if (
            !commentsResult.ok &&
            confirm("Error al conseguir comentarios. Recargar?")
        ) {
            window.location.reload();
        }

        /** @type {BackendComment[]} */
        comments = [...comments, ...(await commentsResult.json())];

        div.innerHTML = `
<h1> ${theme.titulo} </h1>
<p> Creador: ${theme.creador} </p>
<p> Identificador: ${theme.id_tema} </p>
<h2> Comentarios para la tarea: </h2>

`;

        for (const comment of comments) {
            const commentDiv = document.createElement("div");

            commentDiv.innerHTML = JSON.stringify(comment);

            div.appendChild(commentDiv);
        }

        showThemesDiv.appendChild(div);
    }

    deleteButton.addEventListener("click", async () => {
        const commentId = deleteIdInput.value;
        if (commentId === "") {
            alert("Debe incluir un Identificador para eliminar un comentario");
            return;
        }

        /** @type {BackendComment} */
        const comment = comments.find((val) => {
            return val.id_comentario == commentId;
        });

        const deleteResult = await fetch(
            `http://localhost/back/usuarios/${comment.id_usuario}/temas/${comment.id_tema}/comentarios/${comment.id_comentario}/`,
            {
                method: "DELETE",
                headers: {
                    ...getAuthorization(),
                },
            }
        );

        if (!deleteResult.ok) {
            alert("Error al eliminar el comentario");
            return;
        }

        window.location.reload();
    });

    createButton.addEventListener("click", async () => {
        const comment = commentDescriptionInput.value;
        const themeId = createThemeIdInput.value;
        if (!comment) {
            alert("Debe incluir información en el comentario para crearlo.");
            return;
        }

        if (themeId === "") {
            alert("Debe incluir identificador de tema.");
            return;
        }

        const result = await fetch(`http://localhost/back/usuarios/${login.usuario.id_usuario}/temas/${themeId}/comentarios`, {
            method: "POST",
            body: JSON.stringify({
                descripcion: comment,
            }),
            headers: {
                ...getAuthorization(),
                "Content-Type": "application/json",
            },
        });

        if (!result.ok) {
            alert("Error al crear el comentario");
            return;
        }

        window.location.reload();

    });
}

main();
