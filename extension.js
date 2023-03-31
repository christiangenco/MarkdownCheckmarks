const vscode = require("vscode");

exports.activate = function (context) {
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
            const contents = line.text;

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

            if (newContents) {
              const range = new vscode.Range(line.start, line.end);
              editBuilder.replace(range, newContents);
            }
          }
        }
      });
    }
  );

  context.subscriptions.push(disposable);
};

exports.deactivate = () => {};
