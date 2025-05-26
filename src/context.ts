/**
 * ContextService contains the application context that is shared across the
 * handlers.
 */
import { App, Editor, Workspace } from "obsidian";

export interface IContextService {
  readonly app: App;

  readonly workspace: Workspace;
  setWorkspace(workspace: Workspace): void;

  readonly editor: Editor | null | undefined;
  setEditor(editor: Editor): void;
}

interface IContextServiceConstructor {
  new (app: App): ContextService;
}

export default class ContextService implements IContextService {
  public readonly app: App;

  private _workspace: Workspace;
  private _editor: Editor;

  constructor(app: App) {
    this.app = app;
    this.setWorkspace(app.workspace);
  }

  // workspace getter.
  public get workspace(): Workspace {
    return this._workspace;
  }

  // workspace setter.
  public setWorkspace(workspace: Workspace): void {
    this._workspace = workspace;
  }

  // editor getter.
  public get editor(): Editor {
    return this._editor;
  }

  // editor setter.
  public setEditor(editor: Editor): void {
    this._editor = editor;
  }
}

const _ctorCheck: IContextServiceConstructor = ContextService;
