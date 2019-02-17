'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    //console.log('Congratulations, your extension "markdown-title-index" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    // let disposable = vscode.commands.registerCommand('extension.sayHello', () => {
    //     // The code you place here will be executed every time your command is executed

    //     // Display a message box to the user
    //     vscode.window.showInformationMessage('Hello World!');
    // });

    // context.subscriptions.push(disposable);
    let disposable = vscode.commands.registerCommand("extension.addMarkdownHeadNumber",() => {
          var editor = vscode.window.activeTextEditor;
          if (!editor) {
            vscode.window.showInformationMessage("No open text editor");
            return; // No open text editor
          }
          var selection = editor.selection;
          var text = editor.document.getText(selection);
          var lines;
          if (text.length == 0) {
            // use all text if no selection
            lines = editor.document.getText().split("\n");
            selection = new vscode.Selection(0, 0, lines.length, 0);
          } else {
            lines = text.split("\n");
          }
          addMarkdownTitleIndex(lines);
          editor.edit(function(builder) {
            var resultText = lines.join("\n");
            builder.replace(
              new vscode.Range(selection.start, selection.end),
              resultText
            );
          });
        }
      );
      context.subscriptions.push(disposable);

      let disposable2 = vscode.commands.registerCommand("extension.delMarkdownHeadNumber",() => {
          var editor = vscode.window.activeTextEditor;
          if (!editor) {
            vscode.window.showInformationMessage("No open text editor");
            return; // No open text editor
          }
          var selection = editor.selection;
          var text = editor.document.getText(selection);
          var lines;
          if (text.length == 0) {
            // use all text if no selection
            lines = editor.document.getText().split("\n");
            selection = new vscode.Selection(0, 0, lines.length, 0);
          } else {
            lines = text.split("\n");
          }
          delMarkdownTitleIndex(lines);
          editor.edit(function(builder) {
            var resultText = lines.join("\n");
            builder.replace(
              new vscode.Range(selection.start, selection.end),
              resultText
            );
          });
        }
      );
      context.subscriptions.push(disposable2);
      let disposable3 = vscode.commands.registerCommand("extension.addMarkdownHeadChapter",() => {
          var editor = vscode.window.activeTextEditor;
          if (!editor) {
            vscode.window.showInformationMessage("No open text editor");
            return; // No open text editor
          }
          var selection = editor.selection;
          var text = editor.document.getText(selection);
          var lines;
          if (text.length == 0) {
            lines = editor.document.getText().split("\n");
            selection = new vscode.Selection(0, 0, lines.length, 0);
          } else {
            lines = text.split("\n");
          }
          addMarkdownTitleIndex(lines);
          replaceHeadTop(lines);
          editor.edit(function(builder) {
            var resultText = lines.join("\n");
            builder.replace(
              new vscode.Range(selection.start, selection.end),
              resultText
            );
          });
        }
      );
      context.subscriptions.push(disposable3);
      let disposable4 = vscode.commands.registerCommand("extension.delMarkdownLineBreaks",() => {
        var editor = vscode.window.activeTextEditor;
        if (!editor) {
          vscode.window.showInformationMessage("No open text editor");
          return; // No open text editor
        }
        var selection = editor.selection;
        var text = editor.document.getText(selection);
        //var lines;
        if (text.length == 0) {
          // use all text if no selection
          text=editor.document.getText();
        }

        editor.edit(function(builder) {
          builder.replace(
            new vscode.Range(selection.start, selection.end),
            text.replace(/\n(?!\w)/g,"")
          );
        });
      }
    );
    context.subscriptions.push(disposable4);
}

// this method is called when your extension is deactivated
export function deactivate() {
}
function addPrefix(line, prefix, markCount) {

    //1.3 标题格式  如果注释掉，就是1.3. 表格格式
    if(prefix.endsWith(".")){
      prefix=prefix.substr(0,prefix.length-1);
    }

    // remove previous index
    var markIndex = line.indexOf("#");
    if (markIndex == -1) {
      markIndex = 0;
    }

     var regx = /\s+((\d\.?)+)\s*/g;
    if (regx.test(line)) {
      line = line.replace(regx, prefix + " ");
      line =
        line.substr(0, markIndex + markCount) +
        " " +
        line.substr(markIndex + markCount).trim();
    } else {
      line = line.replace(regx, "");
      line =
        line.substr(0, markIndex + markCount) +
        " " +
        prefix +
        " " +
        line.substr(markIndex + markCount).trim();
    }
    return line;
  }
  function countStartsWith(fliter, chars) {
    var count = 0;
    chars.some(function(element) {
      if (fliter(element)) {
        count++;
        return false;
      } else {
        return true;
      }
    });
    return count;
  }
  function addTitleIndex(content, lastMarkCount, prefix, cursor) {
    // leave the normal line and count #
    var targetMarkCount = 0;
    while (cursor < content.length) {
      var line = content[cursor].trim();
      if (line.startsWith("#")) {
        // if (line.startsWith("##")) {
        targetMarkCount = countStartsWith(function(x) {
          return x == "#";
        }, line.split(""));
        break;
      } else {
        cursor++;
      }
    }
    var seq = 1;
    while (cursor < content.length) {
      var markCount = countStartsWith(function(x) {
        return x == "#";
      }, content[cursor].trim().split(""));
      if (markCount == targetMarkCount && markCount > lastMarkCount) {
        var curPrefix = prefix + seq + ".";
        content[cursor] = addPrefix(content[cursor], curPrefix, markCount);
        seq++;
        // deep first search
        cursor = addTitleIndex(content, markCount, curPrefix, cursor + 1);
      } else if (markCount <= lastMarkCount) {
        // rollback 1 row
        cursor--;
        break;
      }
      cursor++;
    }
    return cursor;
  }

function addMarkdownTitleIndex(content) {
    var startNum = 0;
    var cursor = 0;
    while (cursor < content.length) {
      var line = content[cursor].trim();
      if (line.startsWith("# ")) {
        var regx = /\s+(\d+)\s*/g;
        var r = line.match(regx);
        if (r != null) {
          startNum = parseInt(r[0].trim()) - 1;
        }
        break;
      }
      cursor++;
    }
    if (startNum < 0) {
      startNum = 0;
    }
    addTitleIndex(content, 0, startNum, 0);
    return content;
  }
  function delMarkdownTitleIndex(content) {
    var cursor = 0;
    while (cursor < content.length) {
      var line = content[cursor].trim();
      if (line.startsWith("#")) {
        content[cursor] = line.replace(/#\s+([\d\.]+)\s*/g, "# ").replace(/#\s+(第.+章)\s*/g, "# ");
      }
      cursor++;
    }
    return content;
  }
function replaceHeadTop(content) {
    var startNum = 0;
    var cursor = 0;
    var regxTopHead = /^#\s+/ig;
    while (cursor < content.length)
    {
      let linetxt = content[cursor];
      if (regxTopHead.test(linetxt))
      {
        var regx = /#\s+(\d+)\s+/ig;
        let r = regx.exec(linetxt);
        if (r != null)
        {
          var chapter = SectionToChinese(parseInt(r[1].trim()));
          content[cursor] = linetxt.replace(/#\s+(\d+)\s+/g, "# 第"+chapter+"章 ")
        }
      }
      cursor++;
    }

    return content;
  }

  var chnNumChar = ["零","一","二","三","四","五","六","七","八","九"];
  var chnUnitSection = ["","万","亿","万亿","亿亿"];
  var chnUnitChar = ["","十","百","千"];

  function SectionToChinese(section){
      var strIns = '', chnStr = '';
      var unitPos = 0;
      var zero = true;
      while(section > 0){
          var v = section % 10;
          if(v === 0){
              if(!zero){
                  zero = true;
                  chnStr = chnNumChar[v] + chnStr;
              }
          }else{
              zero = false;
              strIns = chnNumChar[v];
              strIns += chnUnitChar[unitPos];
              chnStr = strIns + chnStr;
          }
          unitPos++;
          section = Math.floor(section / 10);
      }
      return chnStr;
  }


