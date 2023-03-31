const vscode = require("vscode");

function activate(context) {
  console.log("Activating the Markdown Checkmarks extension");

  let disposable = vscode.commands.registerCommand(
    "extension.markdownCheckmarks",
    () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        return;
      }

      const document = editor.document;
      const selections = editor.selections;

      editor.edit((editBuilder) => {
        for (const selection of selections) {
          const startLine = selection.start.line;
          const endLine = selection.end.line;

          for (
            let lineNumber = startLine;
            lineNumber <= endLine;
            lineNumber++
          ) {
            const line = document.lineAt(lineNumber);
            let contents = line.text;
            let newContents;

            if (contents.includes("- ")) {
              if (contents.includes("- [")) {
                if (contents.includes("[ ]")) {
                  newContents = contents.replace("[ ]", "[x]", 1);
                } else {
                  if (contents.includes("[x]")) {
                    newContents = contents.replace("[x] ", "", 1);
                  }
                }
              } else {
                newContents = contents.replace("- ", "- [ ] ", 1);
              }
            } else {
              newContents = "- " + contents;
            }

            if (newContents && newContents !== contents) {
              // const range = new vscode.Range(line.start, line.end);
              // editBuilder.replace(range, newContents);
              editBuilder.replace(line.range, newContents);
            }
          }
        }
      });
    }
  );

  context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
