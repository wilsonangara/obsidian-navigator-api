/**
 * Editor handlers contains list of handlers to navigate through the editor
 * in Obsidian.
 */
import { FastifyInstance } from "fastify";
import { IContextService } from "src/context";

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
  };
}
