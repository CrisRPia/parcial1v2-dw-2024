import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { SafeType } from "../../../../../../utils/typebox.js";
import { comentarioSchema } from "../../../../../../types/comentario.js";
import { findAll } from "../../../../../../services/comentarios.js";

export default (async (fastify) => {
    fastify.get("/", {
        onRequest: [fastify.verifyJWT, fastify.verifyTemaCreator],
        schema: {
            params: SafeType.Pick(comentarioSchema, ["id_tema", "id_usuario"]),
            response: {
                200: SafeType.Array(comentarioSchema),
                ...SafeType.CreateErrors(["unauthorized", "notFound"]),
            },
            tags: ["comentarios"],
        },
        async handler(request, reply) {
            return await findAll(request.params.id_tema);
        },
    });
}) satisfies FastifyPluginAsyncTypebox;
