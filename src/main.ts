import { Plugin } from "obsidian";
import Fastify, { FastifyInstance } from "fastify";

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
