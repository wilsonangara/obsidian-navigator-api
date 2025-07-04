/**
 * AppHandler contains list of handlers to manipulate the app.
 */
import { Command } from "obsidian";
import { FastifyInstance } from "fastify";
import { IContextService } from "src/context";
import { getCurrentFilepath } from "./utils";

declare module "obsidian" {
  interface App {
    /**
     * undocumented, but present at runtime
     * refer: https://forum.obsidian.md/t/resolved-official-api-method-to-get-list-of-commands-from-command-palette/38896
     */
    commands: {
      commands: Record<string, Command>;
      executeCommandById: (id: string) => void;
    };
  }
}

export default class AppHandler {
  private context: IContextService;

  constructor(context: IContextService) {
    this.context = context;
  }

  public routes = (fastify: FastifyInstance, opts: Object) => {
    /**
     * Returns a list of commands that are available in the obisidan app.
     */
    fastify.get("/commands", async (request, reply) => {
      try {
        const app = this.context.app;

        const commands: Command[] = [];
        for (const c in app.commands.commands) {
          commands.push({
            id: c,
            name: app.commands.commands[c].name,
          });
        }

        reply.status(200).send({ commands });
      } catch (err) {
        reply.status(500).send({ error: err.message });
      }
    });

    /**
     * Executes an command by the provided command id.
     */
    fastify.post<{
      Body: { id: string };
      Reply: {
        error?: string;
      };
    }>(
      "/commands",
      {
        schema: {
          body: {
            type: "object",
            properties: {
              id: {
                type: "string",
              },
            },
          },
          response: {
            204: {},
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
          const { id } = request.body;
          this.context.app.commands.executeCommandById(id);
          reply.status(204);
        } catch (err) {
          reply.status(500).send({ error: err.message });
        }
      },
    );

    /**
     * Navigate forward to next view.
     */
    fastify.post(
      "/navigate-forward",
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
          this.context.app.commands.executeCommandById("app:go-forward");

          // defaults to empty string if no file is open
          let filepath = "";
          filepath = await getCurrentFilepath(this.context);

          reply.status(200).send({ filepath });
        } catch (err) {
          reply.status(500).send({ error: err.message });
        }
      },
    );

    /**
     * Navigate back to previous view.
     */
    fastify.post(
        "/navigate-back",
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
        this.context.app.commands.executeCommandById("app:go-back");

        // defaults to empty string if no file is open
        let filepath = "";
        filepath = await getCurrentFilepath(this.context);

        reply.status(200).send({ filepath });
      } catch (err) {
        reply.status(500).send({ error: err.message });
      }
    });
  };
}
