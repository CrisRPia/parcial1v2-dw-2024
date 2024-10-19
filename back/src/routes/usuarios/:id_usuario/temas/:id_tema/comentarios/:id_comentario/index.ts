import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { SafeType } from "../../../../../../../utils/typebox.js";
import { comentarioSchema } from "../../../../../../../types/comentario.js";
import {
    erase,
    modify,
} from "../../../../../../../services/comentarios.js";

export default (async (fastify) => {
    fastify.put("/", {
        onRequest: [fastify.verifyJWT, fastify.verifyAdmin],
        schema: {
            params: SafeType.Pick(comentarioSchema, [
                "id_usuario",
                "id_tema",
                "id_comentario",
            ]),
            body: SafeType.Pick(comentarioSchema, ["descripcion"]),
            response: {
                200: SafeType.Array(comentarioSchema),
                ...SafeType.CreateErrors(["unauthorized"]),
            },
            tags: ["comentarios"],
        },
        async handler(request, reply) {
            const result = await modify(
                request.params.id_tema,
                request.params.id_comentario,
                request.body.descripcion
            );

            return result;
        },
    });

    fastify.delete("/", {
        onRequest: [fastify.verifyJWT, fastify.verifyTemaCreator],
        schema: {
            params: SafeType.Pick(comentarioSchema, [
                "id_usuario",
                "id_tema",
                "id_comentario",
            ]),
            response: {
                200: SafeType.Array(comentarioSchema),
            },
            tags: ["comentarios"],
        },
        async handler(request, reply) {
            const result = await erase(
                request.params.id_tema,
                request.params.id_comentario
            );

            return result;
        },
    });
}) satisfies FastifyPluginAsyncTypebox;
