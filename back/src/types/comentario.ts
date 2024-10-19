import { SafeType } from "../utils/typebox.js";
import { UsuarioSchema } from "./usuario.js";

export const comentarioSchema = SafeType.Object({
    id_tema: SafeType.Integer(),
    id_usuario: SafeType.Integer(),
    id_comentario: SafeType.Integer(),
    fecha_ingresado: SafeType.String({ "format": "date-time" }),
    descripcion: SafeType.String(),
    creado_por: UsuarioSchema.properties.username,
});
