/**
 * Workspace handlers contains list of handlers to manipulate the workspace
 * in Obsidian.
 */
import { FastifyInstance } from "fastify";
import { App, Workspace } from "obsidian";

export default class WorkspaceHandler {
  private workspace: Workspace;

  constructor(private app: App) {
    this.workspace = app.workspace;
  }

  public routes = (fastify: FastifyInstance, opts: Object) => {
    /**
     * Opens a file with the given link text and will create a new file by default
     * if file doesn't exist yet.
     */
    fastify.post<{
      Body: { filepath: string };
      Reply: {
        message?: string;
        error?: string;
      };
    }>(
      "/open-link-text",
      {
        schema: {
          body: {
            type: "object",
            required: ["filepath"],
            properties: {
              // path to the file, relative to root directory
              filepath: { type: "string" },
            },
          },
          response: {
            200: {
              type: "object",
              properties: {
                message: { type: "string" },
              },
            },
            500: {
              type: "object",
              properties: {
                error: { type: "string" },
              },
            },
          },
        },
      },
      async (request, reply) => {
        const { filepath } = request.body;

        try {
          await this.workspace.openLinkText(filepath, "/", false);
          reply.status(200).send({ message: "ok" });
        } catch (err) {
          reply.status(500).send({ error: err.message });
        }
      },
    );
  };
}
