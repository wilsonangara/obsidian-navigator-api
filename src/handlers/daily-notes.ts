/**
 * Daily Notes handlers contains list of handlers to manipulate navigation
 * for daily notes in Obsidian.
 */

import { FastifyInstance } from "fastify";
import { IContextService } from "src/context";
import { getCurrentFilepath } from "./utils";

export default class DailyNotesHandler {
  private context: IContextService;

  constructor(context: IContextService) {
    this.context = context;
  }

  public routes = (fastify: FastifyInstance, opts: Object) => {
    /**
     * Opens today's daily note.
     */
    fastify.post(
      "/today",
      {
        schema: {
          body: {},
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
          this.context.app.commands.executeCommandById("daily-notes");

          const filepath = await getCurrentFilepath(this.context);

          reply.status(200).send({ filepath });
        } catch (err) {
          reply.status(500).send({ error: err.message });
        }
      },
    );

    /**
     * Opens next daily notes.
     */
    fastify.post(
      "/next",
      {
        schema: {
          body: {},
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
          this.context.app.commands.executeCommandById("daily-notes:goto-next");

          const filepath = await getCurrentFilepath(this.context);

          reply.status(200).send({ filepath });
        } catch (err) {
          reply.status(500).send({ error: err.message });
        }
      },
    );

    /**
     * Opens previous daily notes.
     */
    fastify.post(
      "/prev",
      {
        schema: {
          body: {},
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
          this.context.app.commands.executeCommandById("daily-notes:goto-prev");

          const filepath = await getCurrentFilepath(this.context);

          reply.status(200).send({ filepath });
        } catch (err) {
          reply.status(500).send({ error: err.message });
        }
      },
    );
  };
}
