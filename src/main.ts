import { Plugin } from "obsidian";
import Fastify, { FastifyInstance } from "fastify";

// Services
import ContextService from "./context";

// Handlers
import AppHandler from "./handlers/app";
import WorkspaceHandler from "./handlers/workspace";
import DailyNotesHandler from "./handlers/daily-notes";
import EditorHandler from "./handlers/editor";

export default class ObsidianNavigatorAPI extends Plugin {
  public port: number = 27124;
  private fastify: FastifyInstance | undefined;

  async onload(): Promise<void> {
    this.fastify = Fastify();

    // health endpoint
    this.fastify.get(
      "/health",
      { schema: { response: { 200: { message: { type: "string" } } } } },
      async (_, reply) => {
        reply.code(200).send({
          message: "ok",
        });
      },
    );

    // context
    const context = new ContextService(this.app);

    // register handlers
    const appHandler = new AppHandler(context);
    const workspaceHandler = new WorkspaceHandler(context);
    const dailyNotesHandler = new DailyNotesHandler(context);
    const editorHandler = new EditorHandler(context);

    // endpoints
    this.fastify.register(appHandler.routes, { prefix: "/app" });
    this.fastify.register(workspaceHandler.routes, { prefix: "/workspace" });
    this.fastify.register(dailyNotesHandler.routes, { prefix: "/daily-notes" });
    this.fastify.register(editorHandler.routes, { prefix: "/editor" });

    this.fastify.listen({ port: this.port }, (err, address) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      console.log(`listening to: ${address}`);
    });
  }

  onunload(): void {
    if (this.fastify) {
      console.log(`Shutting down server on port ${this.port}`);
      this.fastify.close();
    }
  }
}
