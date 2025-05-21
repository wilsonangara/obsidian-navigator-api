/**
 * AppHandler contains list of handlers to manipulate the app.
 */
import { Command } from "obsidian";
import { FastifyInstance } from "fastify";
import { IContextService } from "src/context";

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
            required: ["filepath"],
            properties: {
              id: {
                type: "string",
                describe: "Command ID from `{GET} /app/commands",
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
  };
}
