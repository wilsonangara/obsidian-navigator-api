/**
 * Daily Notes handlers contains list of handlers to manipulate navigation
 * for daily notes in Obsidian.
 */

import { FastifyInstance } from "fastify";
import { IContextService } from "src/context";

export default class DailyNotesHandler {
  private context: IContextService;

  constructor(context: IContextService) {
    this.context = context;
  }

  public routes = (fastify: FastifyInstance, opts: Object) => {
    /**
     * Opens today's daily note.
     */
    fastify.post("/today", async (request, reply) => {
      try {
        this.context.app.commands.executeCommandById("daily-notes");
        reply.status(204).send();
      } catch (err) {
        reply.status(500).send({ error: err.message });
      }
    });

    /**
     * Opens next daily notes.
     */
    fastify.post("/next", async (request, reply) => {
      try {
        this.context.app.commands.executeCommandById("daily-notes:goto-next");
        reply.status(204).send();
      } catch (err) {
        reply.status(500).send({ error: err.message });
      }
    });

    /**
     * Opens previous daily notes.
     */
    fastify.post("/prev", async (request, reply) => {
      try {
        this.context.app.commands.executeCommandById("daily-notes:goto-prev");
        reply.status(204).send();
      } catch (err) {
        reply.status(500).send({ error: err.message });
      }
    });
  };
}
