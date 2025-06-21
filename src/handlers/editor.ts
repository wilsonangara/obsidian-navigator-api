/**
 * Editor handlers contains list of handlers to navigate through the editor
 * in Obsidian.
 */
import { FastifyInstance } from "fastify";
import { IContextService } from "src/context";
import { getCurrentFilepath } from "./utils";

export default class EditorHandler {
  private context: IContextService;

  constructor(context: IContextService) {
    this.context = context;
  }

  public routes = (fastify: FastifyInstance, opts: Object) => {
    /**
     * Scroll into view inside the current editor is to sync scrolling position
     * with the current cursor position.
     *
     * This endpoint is possible to be used only if there is an active editor.
     */
    fastify.post("/scroll-into-view", async (request, reply) => {
      try {
        const { line } = request.body as { line: number };

        let editor = this.context.editor;
        if (!editor) {
          // gets the active open editor instance.
          const activeEditor = this.context.workspace.activeEditor;
          if (activeEditor && activeEditor.editor) {
            this.context.setEditor(activeEditor.editor);
            editor = activeEditor.editor;
          } else {
            reply.status(400).send({ error: "No active editor found." });
            return;
          }
        }

        // scrolls the editor into view.
        editor.scrollIntoView(
          {
            from: { line, ch: 0 },
            to: { line, ch: 0 },
          },
          // always centerize the cursor position
          true,
        );

        reply.status(204);
      } catch (err) {
        reply.status(500).send({ error: err.message });
      }
    });

    fastify.post<{
      Body: {
        line: number;
        ch: number;
      };
      Reply: {
        filepath?: string;
        error?: string;
      };
    }>(
      "/open-link",
      {
        schema: {
          body: {
            type: "object",
            required: ["line", "ch"],
            properties: {
              line: { type: "number" },
              ch: { type: "number" },
            },
          },
          response: {
            200: {
              type: "object",
              properties: {
                filepath: { type: "string" },
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
        try {
          const { line, ch } = request.body;

          const editor = this.context.editor;
          if (!editor) {
            throw new Error("No active editor found.");
          }

          // moves the cursor to the specified position
          editor.setCursor({ line, ch });

          // executes the command to follow the link
          this.context.app.commands.executeCommandById("editor:follow-link");

          // gets the opened file path
          const filepath = await getCurrentFilepath(this.context);

          reply.status(200).send({ filepath });
        } catch (err) {
          reply.status(500).send({ error: err.message });
        }
      },
    );
  };
}
