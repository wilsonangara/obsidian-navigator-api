import { FastifyInstance } from "fastify";
import { IContextService } from "src/context";

export default class EditorHandler {
  private context: IContextService;

  constructor(context: IContextService) {
    this.context = context;
  }

  public routes = (fastify: FastifyInstance, opts: Object) => {
    fastify.get("/focus", async (request, reply) => {
      try {
        const editor = this.context.editor;

        reply.status(204);
      } catch (err) {
        reply.status(500).send({ error: err.message });
      }
    });

    fastify.post("/focus", async (request, reply) => {
      try {
        const editor = this.context.editor;
        editor.focus();
        reply.status(204);
      } catch (err) {
        reply.status(500).send({ error: err.message });
      }
    });

    fastify.post("/cursor", async (request, reply) => {
      try {
        const { line } = request.body;
        const editor = this.context.editor;
        editor.setCursor({ line, ch: 0 });
        console.log(editor.getCursor(), "GET CURSOR");
        reply.status(204);
      } catch (err) {
        reply.status(500).send({ error: err.message });
      }
    });

    fastify.post("/go-down", async (request, reply) => {
      try {
        const editor = this.context.editor;
        editor.exec("goDown");
        reply.status(204);
      } catch (err) {
        reply.status(500).send({ error: err.message });
      }
    });
  };
}
