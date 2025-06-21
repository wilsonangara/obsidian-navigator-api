import { MarkdownView, WorkspaceLeaf } from "obsidian";
import { IContextService } from "src/context";

/**
 * Utility function to get the current file path in Obsidian in the active editor.
 */
export const getCurrentFilepath = async (context: IContextService) => {
  // gets the opened file path
  const filepath = await new Promise<string>((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error("Navigation timeout."));
      context.workspace.off("active-leaf-change", handler);
    }, 1000); // Optional safety timeout

    const handler = (leaf: WorkspaceLeaf) => {
      const view = leaf.view;
      if (view instanceof MarkdownView) {
        clearTimeout(timeout);
        context.workspace.off("active-leaf-change", handler);
        resolve(view.file?.path ?? "");
      }
    };

    context.workspace.on("active-leaf-change", handler);
  });

  return filepath;
};
