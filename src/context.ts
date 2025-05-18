/**
 * ContextService contains the application context that is shared across the
 * handlers.
 */
import { App, Workspace } from "obsidian";

export interface IContextService {
  readonly app: App;
  readonly workspace: Workspace;
}

interface IContextServiceConstructor {
  new (app: App): ContextService;
}

export default class ContextService implements IContextService {
  private static instance: ContextService;

  public readonly app: App;
  public readonly workspace: Workspace;

  constructor(app: App) {
    this.app = app;
    this.workspace = app.workspace;
  }
}

const _ctorCheck: IContextServiceConstructor = ContextService;
