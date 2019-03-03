'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "markdown-haed-number" is now active!');

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
          delMarkdownChapter(lines);
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

      let disposable4 = vscode.commands.registerCommand("extension.addMarkdownHeadPreText",() => {
        vscode.window.showInformationMessage("addMarkdownHeadPreText");
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
        const config = vscode.workspace.getConfiguration('arrayfly');
        const onepretext = config.get('onepretext');
        const twopretext = config.get('twopretext');
        if(!onepretext && !twopretext)
        {
          return;
        }
        lines=addMarkdownTitlePreText(lines,onepretext,twopretext);
        editor.edit(function(builder) {
          var resultText = lines.join("\n");
          builder.replace(
            new vscode.Range(selection.start, selection.end),
            resultText
          );
        });
      }
    );
    context.subscriptions.push(disposable4);

    let disposable5 = vscode.commands.registerCommand("extension.delMarkdownHeadPreText",() => {
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
      const config = vscode.workspace.getConfiguration('arrayfly');
        const onepretext = config.get('onepretext');
        const twopretext = config.get('twopretext');
        if(!onepretext && !twopretext)
        {
          return;
        }
      lines=delMarkdownTitlePreText(lines,onepretext,twopretext);
      editor.edit(function(builder) {
        var resultText = lines.join("\n");
        builder.replace(
          new vscode.Range(selection.start, selection.end),
          resultText
        );
      });
    }
  );
  context.subscriptions.push(disposable5);

  let disposable6 = vscode.commands.registerCommand("extension.delMarkdownLineBreaks",() => {
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
      selection = new vscode.Selection(0, 0, text.split("\n").length, 0);
    }

    //remove black line ^[ \t]*\n
    text=text.replace(/^[ \t]*\n/g,"");
    //remove space before title or option
    text=text.replace(/^\s+(?=\w)/g,"");
    //remove ansower
    //text=text.replace(/\?[A-D]\n/g,"?\n");
    // add line breaks before title number
    text=text.replace(/\n+(?=\s*\d+[\.、\s])/g,"\n\n");
   // text=text.replace(/(?<=D.*)\n(?!\n)[^A]/g,"\n\n1.");
    // remove line breaks in center of description
    text=text.replace(/\n(?!\s*\w)/g,"");
// add line breaks before title number
 //  text=text.replace(/\n+(?=\d)/g,"\n\n");
  // text=text.replace(/\s+(?=[A-D])/g,"\n");
    //add dot . befor option  eg. A.
    text=text.replace(/^A(?!\.)/g,'A.')
    //.replace(/^B[^\.]/g,'B.').replace(/^C.[^\.]/g,'C.').replace(/^D[^\.]/g,'D.');
    vscode.window.showInformationMessage(' replace(         ^[A-D](?!\\.)     , $0.      )');
    editor.edit(function(builder) {

      builder.replace(
        new vscode.Range(selection.start, selection.end),
        text
      );
    });
  }
);
context.subscriptions.push(disposable6);

let disposable7 = vscode.commands.registerCommand("extension.formatMarkdownLineAnowser",() => {
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
    selection = new vscode.Selection(0, 0, text.split("\n").length, 0);
  }
  //remove ansower
  text=text.replace(/[^A-Z]/g,"");
  text=text.replace(/([A-D])/g,'$1\n');
  text=text.replace(/([A])/g,'1')
  text=text.replace(/([B])/g,'2')
  text=text.replace(/([C])/g,'3')
  text=text.replace(/([D])/g,'4')
  editor.edit(function(builder) {

    builder.replace(
      new vscode.Range(selection.start, selection.end),
      text
    );
  });
}
);
context.subscriptions.push(disposable7);

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
      var line = content[cursor];
      if (line.startsWith("#")) {
        content[cursor] = line.replace(/#\s+([\d\.]+)\s*/g, "# ").replace(/#\s+(第.+章)\s*/g, "# ");
      }
      cursor++;
    }
    return content;
}

function delMarkdownChapter(content) {
  var cursor = 0;
  var regxTopHead = /^#\s+/ig;
  while (cursor < content.length) {
    var line = content[cursor].trim();
    if (regxTopHead.test(line)){
    // if (line.startsWith("#")) {
      content[cursor] = line.replace(/#\s+(第.+章)\s*/g, "# ");
    }
    cursor++;
  }
  return content;
}
function addMarkdownTitlePreText(content,onepretext,twopretext) {
  var startNum = 0;
  var cursor = 0;
  var result= new Array();
  while (cursor < content.length) {
    var line = content[cursor].trim();
    if (line.startsWith("# ")) {
      if(onepretext && onepretext!="")
      {
        result.push("");
        result.push(onepretext);
      }
    }
    else if (line.startsWith("## ")) {
      if(twopretext && twopretext!="")
      {
        result.push("");
        result.push(twopretext);
      }
    }
    result.push(line);
    cursor++;
  }

  return result;
}
function delMarkdownTitlePreText(content,onepretext,twopretext) {
  var startNum = 0;
  var cursor = 0;
  var result= new Array();
  while (cursor < content.length) {
    var line = content[cursor].trim();
    if (onepretext!="" && line==onepretext) {
        if(cursor>0 && result[cursor-1]=="")
        {
          result.pop();
        }
    }
    else if (twopretext!="" && line==twopretext) {
      if(cursor>0 && result[cursor-1]=="")
      {
        result.pop();
      }
    }
    else
    {
      result.push(line);
    }
    cursor++;
  }

  return result;
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


