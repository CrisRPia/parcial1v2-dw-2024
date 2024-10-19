import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { SafeType } from "../../../../../../utils/typebox.js";
import { comentarioSchema } from "../../../../../../types/comentario.js";
import { create, findAll } from "../../../../../../services/comentarios.js";

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

    fastify.post("/", {
        onRequest: [fastify.verifyJWT, fastify.verifySelf],
        schema: {
            params: SafeType.Pick(comentarioSchema, [
                "id_usuario",
                "id_tema",
            ]),
            body: SafeType.Pick(comentarioSchema, ["descripcion"]),
            response: {
                200: SafeType.Array(comentarioSchema),
                ...SafeType.CreateErrors(["unauthorized"]),
            },
            tags: ["comentarios"],
        },
        async handler(request, reply) {
            const result = await create(
                request.params.id_tema,
                request.params.id_usuario,
                request.body.descripcion
            );

            return reply.code(201).send(result);
        },
    });

}) satisfies FastifyPluginAsyncTypebox;
