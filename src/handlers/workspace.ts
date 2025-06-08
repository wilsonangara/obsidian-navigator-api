/**
 * Workspace handlers contains list of handlers to manipulate the workspace
 * in Obsidian.
 */
import { FastifyInstance } from "fastify";
import { MarkdownView } from "obsidian";
import { IContextService } from "src/context";

export default class WorkspaceHandler {
  private context: IContextService;

  constructor(context: IContextService) {
    this.context = context;
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
          // opens file based on the filepath.
          await this.context.workspace.openLinkText(filepath, "/", false);

          // gets the active open editor instance.
          const activeEditor = this.context.workspace.activeEditor;
          if (activeEditor && activeEditor.editor) {
            this.context.setEditor(activeEditor.editor);
          }

          reply.status(200).send({ message: "ok" });
        } catch (err) {
          reply.status(500).send({ error: err.message });
        }
      },
    );

    /**
     * Opens a new tab.
     */
    fastify.post("/tabs/new", async (request, reply) => {
      try {
        this.context.app.commands.executeCommandById("workspace:new-tab");
        reply.status(204).send();
      } catch (err) {
        reply.status(500).send({ error: err.message });
      }
    });

    /**
     * Close current tab.
     */
    fastify.post("/tabs/close", async (request, reply) => {
      try {
        this.context.app.commands.executeCommandById("workspace:close");
        reply.status(204).send();
      } catch (err) {
        reply.status(500).send({ error: err.message });
      }
    });

    /**
     * Close all other tabs except current.
     */
    fastify.post("/tabs/close-others", async (request, reply) => {
      try {
        this.context.app.commands.executeCommandById("workspace:close-others");
        reply.status(204).send();
      } catch (err) {
        reply.status(500).send({ error: err.message });
      }
    });

    /**
     * Goes to the next tab if there is one.
     */
    fastify.post("/tabs/next", async (request, reply) => {
      try {
        this.context.app.commands.executeCommandById("workspace:next-tab");
        reply.status(204).send();
      } catch (err) {
        reply.status(500).send({ error: err.message });
      }
    });

    /**
     * Goes to the previous tab if there is one.
     */
    fastify.post("/tabs/prev", async (request, reply) => {
      try {
        this.context.app.commands.executeCommandById("workspace:previous-tab");
        reply.status(204).send();
      } catch (err) {
        reply.status(500).send({ error: err.message });
      }
    });
  };
}
