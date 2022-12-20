/*
欢迎测试由蚕子开发的Obsidian插件。本人水平有限，感谢您能反馈问题或提出宝贵建议！
*/

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// main.ts
var main_exports = {};
__export(main_exports, {
  TreeLeafView: () => TreeLeafView,
  VIEW_TYPE_OB_TREELEAF: () => VIEW_TYPE_OB_TREELEAF,
  addTagList: () => addTagList,
  allFileList: () => allFileList,
  default: () => TreeLeafPlugin,
  editor: () => editor,
  isYaml: () => isYaml,
  thisFile: () => thisFile,
  thisLines: () => thisLines,
  thisTagList: () => thisTagList,
  upTagList: () => upTagList
});
module.exports = __toCommonJS(main_exports);
var import_obsidian = require("obsidian");
var VIEW_TYPE_OB_TREELEAF = "ob_treeleaf";
var editor;
var allFileList;
var thisTagList = [];
var upTagList = [];
var addTagList = [];
var isYaml = false;
var thisFile;
var thisLines;
var DEFAULT_SETTINGS = {
  SHOW_RIBBON: true,
  keyWords: "",
  mySetting: "\u9ED8\u8BA4"
};
var TreeLeafPlugin = class extends import_obsidian.Plugin {
  constructor() {
    super(...arguments);
    this.showPanel = function() {
      this.app.workspace.getRightLeaf(true).setViewState({ type: VIEW_TYPE_OB_TREELEAF });
    };
  }
  async onload() {
    await this.loadSettings();
    this.registerView(VIEW_TYPE_OB_TREELEAF, (leaf) => this.view = new TreeLeafView(leaf));
    this.addCommand({
      id: "show-treeleaf-panel",
      name: "\u6253\u5F00\u63A8\u8350\u9762\u677F",
      callback: () => this.showPanel()
    });
    if (this.settings.SHOW_RIBBON) {
      this.addRibbonIcon("lines-of-text", "\u663E\u793A\u63A8\u8350\u9762\u677F", (e) => this.showPanel());
    }
    this.registerEvent(this.app.workspace.on("file-open", (file) => {
      if (file != null) {
        allFileList = this.app.vault.getMarkdownFiles();
        thisFile = file;
        this.getLineTags(file);
      }
    }));
    this.registerEvent(this.app.metadataCache.on("changed", (file) => {
      if (file != null) {
        this.getLineTags(file);
      }
    }));
    this.addCommand({
      id: "editor-dvjs-moc1",
      name: "\u6309\u6587\u4EF6\u540D\u7B5B\u9009\u53F6\u578B\u7B14\u8BB0\u5217\u8868",
      editorCallback: (editor2, view) => {
        console.log(editor2.getSelection());
        let dvjs1 = '\u21A9\u21A9```dataviewjs\u21A9let tagname =dv.current().file.name.replace(/^&+/,"#").replace(/-/g," and #")\u21A9dv.table( ["\u53F6\u7EA7\u7B14\u8BB0\u5217\u8868","\u5185\u542B\u6807\u7B7E"],\u21A9dv.pages(tagname).sort(p => p.file.tags).map(p => {\u21A9    return  [p.file.link, p.file.tags.sort().join(" | ").replace(/#/g,"")]\u21A9})); \u21A9```\u21A9\u6B64\u6587\u4EF6\u6700\u540E\u4FEE\u6539\u65F6\u95F4\u4E3A\uFF1A `$= dv.current().file.mtime`\u3002\u21A9\u21A9 ';
        new import_obsidian.Notice("\u6B64\u4EE3\u7801\u8FD0\u884C\u9700\u8981\u5B89\u88C5\u5E76\u542F\u7528 DataView \u63D2\u4EF6\uFF0C\n\u8BF7\u5C06\u6587\u4EF6\u540D\u79F0\u4FEE\u6539\u4E3A '&\u8BCD1-\u8BCD2-\u8BCD3' \u7684\u6837\u5F0F\uFF0C\u4EE3\u7801\u4F1A\u81EA\u52A8\u8BC6\u522B\u6587\u4EF6\u540D\u79F0\u4E2D\u7684\u5173\u952E\u8BCD\u8FDB\u884C\u7B5B\u9009\u3002\n\u9F20\u6807\u70B9\u6B64\u5373\u53EF\u5173\u95ED\uFF01", 2e4);
        editor2.replaceSelection(dvjs1.replace(/↩/g, "\n"));
      }
    });
    this.addCommand({
      id: "editor-dvjs-moc2",
      name: "\u6309\u6807\u7B7E\u7EC4\u7B5B\u9009\u53F6\u578B\u7B14\u8BB0\u5217\u8868",
      editorCallback: (editor2, view) => {
        console.log(editor2.getSelection());
        let dvjs2 = '\u21A9\u21A9```dataviewjs\u21A9let tagname =dv.current().file.tags.join(" and ")\u21A9dv.table( ["\u53F6\u7EA7\u7B14\u8BB0\u5217\u8868","\u5185\u542B\u6807\u7B7E"],\u21A9dv.pages(tagname).sort(p => p.file.tags).map(p => {\u21A9    return  [p.file.link, p.file.tags.sort().join(" | ").replace(/#/g,"")]\u21A9})); \u21A9```\u21A9\u6B64\u6587\u4EF6\u6700\u540E\u4FEE\u6539\u65F6\u95F4\u4E3A\uFF1A `$= dv.current().file.mtime`\u3002 \u21A9\u21A9';
        new import_obsidian.Notice("\u6B64\u4EE3\u7801\u8FD0\u884C\u9700\u8981\u5B89\u88C5\u5E76\u542F\u7528 DataView \u63D2\u4EF6\uFF0C\n\u8BF7\u5728\u7B14\u8BB0\u5185\u8BBE\u7F6E\u81F3\u5C11\u4E09\u4E2A '#\u6807\u7B7E'\uFF0C\u4EE3\u7801\u4F1A\u81EA\u52A8\u8BC6\u522B\u7B14\u8BB0\u5185\u7684\u6807\u7B7E\u8BCD\u8FDB\u884C\u7B5B\u9009\u3002\n\u9F20\u6807\u70B9\u6B64\u5373\u53EF\u5173\u95ED\uFF01", 2e4);
        editor2.replaceSelection(dvjs2.replace(/↩/g, "\n"));
      }
    });
    this.addSettingTab(new SampleSettingTab(this.app, this));
  }
  onunload() {
    console.log("\u5378\u8F7D\u63D2\u4EF6");
  }
  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }
  async saveSettings() {
    await this.saveData(this.settings);
  }
  getLineTags(file) {
    thisTagList = [];
    upTagList = [];
    addTagList = [];
    editor = this.getEditor();
    thisLines = this.getLines(editor);
    thisTagList = this.getThisTagList(file);
    upTagList = this.getUpTagList(thisLines);
  }
  getUpTagList(lines) {
    var allkeywords = this.settings.keyWords.replace(/(\s*\n)+/g, "\n").replace(/[ ,，、]+/g, ",");
    var wordList = allkeywords.split("\n");
    var ary0 = [];
    for (var k = 0; k < wordList.length; k++) {
      var wordKey = wordList[k].replace(/,/g, "|");
      var tag0 = wordKey.match(/^[^\|]+/);
      var tag = "";
      if (tag0 == null) {
        tag = String("#" + wordKey);
      } else {
        tag = String("#" + tag0[0]);
      }
      var reg0 = eval("/(" + wordKey + ")/");
      if (reg0.test(lines) && !upTagList.includes(tag) && !thisTagList.includes(tag)) {
        ary0.push(tag);
        console.log(tag0);
      }
    }
    ;
    return ary0;
  }
  getThisTagList(file) {
    var fileCache = this.app.metadataCache.getFileCache(file);
    if (fileCache) {
      var array = (0, import_obsidian.getAllTags)(fileCache);
      if (array == null) {
        return;
        console.log("\u672A\u83B7\u5F97\u6807\u7B7E\u4FE1\u606F\uFF01");
      } else {
        return this.aryToHeavy(array);
        console.log("\u5DF2\u83B7\u53D6\u5F53\u524D\u6240\u6709\u6807\u7B7E\u5E76\u53BB\u91CD\u5904\u7406\uFF01");
      }
    }
  }
  getEditor() {
    let view = this.app.workspace.getActiveViewOfType(import_obsidian.MarkdownView);
    let cm = view.sourceMode.cmEditor;
    return cm;
  }
  getLines(editor2) {
    return editor2.getValue();
  }
  aryToHeavy(_array) {
    var reg = /(,[^\,]+)\1+/gim;
    var arrayStr = "," + _array.sort().toString() + ",";
    while (reg.test(arrayStr)) {
      arrayStr = arrayStr.replace(reg, ",$1");
    }
    arrayStr = arrayStr.slice(1, arrayStr.length - 1);
    return String(arrayStr).split(",").sort();
  }
};
var SampleModal = class extends import_obsidian.Modal {
  constructor(app) {
    super(app);
  }
  onOpen() {
    const { contentEl } = this;
    contentEl.setText("\u663E\u793A\u5F39\u51FA\u9762\u677F\u4E2D\u7684\u6587\u5B57!");
  }
  onClose() {
    const { contentEl } = this;
    contentEl.empty();
  }
};
var SampleSettingTab = class extends import_obsidian.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl("h2", { text: "\u6811\u53F6\u63D2\u4EF6" });
    new import_obsidian.Setting(containerEl).setName("\u5173\u4E8E\u63D2\u4EF6(About TreeLeaf)").setDesc("\u6B64\u63D2\u4EF6\u9B54\u6539\u81EA Obsidian-Comments \u63D2\u4EF6\uFF0C\u914D\u5408\u6811\u53F6\u7B14\u8BB0\u6CD5\u5B9E\u73B0\u3010\u843D\u53F6\u5BFB\u679D\u3011\u3010\u5FAA\u679D\u751F\u53F6\u3011\u529F\u80FD\u3002");
    new import_obsidian.Setting(containerEl).setName("\u7B5B\u9009\u7B14\u8BB0(Filter Notes)").setDesc("\u6267\u884C\u3010\u6309\u6587\u4EF6\u540D/\u6807\u7B7E\u8BCD\u7B5B\u9009\u3011\u547D\u4EE4\uFF0C\u4F1A\u5728\u7B14\u8BB0\u4E2D\u6DFB\u52A0 DataViewJS \u4EE3\u7801\uFF0C\u5E76\u6839\u636E\u6587\u4EF6\u540D\u79F0\u6216\u5185\u542B\u6807\u7B7E\u7EC4\u8FDB\u884C\u5168\u5E93\u7B5B\u9009\u3002");
    new import_obsidian.Setting(containerEl).setName("\u5173\u952E\u8BCD\u8868(Keyword table)").setDesc("\u6BCF\u884C\u4E00\u7EC4\u8BCD\uFF0C\u7528\u9017\u53F7\u95F4\u9694\u3002(Each line has a group of words separated by commas.)").addTextArea((text) => {
      text.setPlaceholder("tag,word1,word2,word...").setValue(this.plugin.settings.keyWords).onChange((value) => {
        this.plugin.settings.keyWords = value.replace(/(\n\s*)*$/, "");
        this.plugin.saveSettings();
      });
      text.inputEl.rows = 20;
      text.inputEl.cols = 84;
    });
  }
};
var TreeLeafView = class extends import_obsidian.ItemView {
  constructor(leaf) {
    super(leaf);
    this.redraw = this.redraw.bind(this);
    this.containerEl = this.containerEl;
    this.registerEvent(this.app.workspace.on("file-open", this.redraw));
    this.registerEvent(this.app.workspace.on("quick-preview", this.redraw));
    this.registerEvent(this.app.metadataCache.on("changed", this.redraw));
  }
  getViewType() {
    return VIEW_TYPE_OB_TREELEAF;
  }
  getDisplayText() {
    return "\u63A8\u8350\u9762\u677F";
  }
  getIcon() {
    return "lines-of-text";
  }
  onClose() {
    return Promise.resolve();
  }
  async onOpen() {
    this.redraw();
  }
  async redraw() {
    let active_leaf = this.app.workspace.getActiveFile();
    this.containerEl.empty();
    this.containerEl.setAttribute("class", "comment-panel");
    if (active_leaf) {
      let El1 = document.createElement("p");
      El1.setAttribute("class", "comment-panel");
      this.containerEl.appendChild(El1);
      El1.setText("\xA0\u2780 \u63A8\u8350\u6807\u7B7E: " + upTagList.length);
      El1.onmouseover = () => {
        console.log("\u5C06\u628A\u63A8\u8350\u7684\u6807\u7B7E\u5199\u5165\u5230\u7B14\u8BB0\u4E2D\uFF01");
      };
      El1.onclick = () => {
        if (addTagList.length > 0) {
          this.addTagTo();
          console.log(addTagList.join(","));
        } else {
          new import_obsidian.Notice("\u672A\u53D1\u73B0\u63A8\u8350\u6807\u7B7E\uFF0C\u8BF7\u5B8C\u5584\u5173\u952E\u8BCD\u8868\u518D\u5C1D\u8BD5\uFF01");
        }
      };
      for (let i = 0; i < upTagList.length; i++) {
        let div = document.createElement("Div");
        div.setAttribute("class", "comment-pannel-bubble");
        let pEl = document.createElement("text");
        pEl.setAttribute("class", "comment-pannel-p1");
        let _tagStr = upTagList[i];
        pEl.setText(_tagStr.replace(/^#/, "\u2610 "));
        pEl.onclick = () => {
          if (/☑/.test(pEl.innerText)) {
            pEl.setText(_tagStr.replace(/^#/, "\u2610 "));
            addTagList.splice(addTagList.indexOf(_tagStr), 1);
            upTagList.push(_tagStr);
          } else {
            pEl.setText(_tagStr.replace(/^#/, "\u2611 "));
            addTagList.push(_tagStr);
            upTagList.splice(upTagList.indexOf(_tagStr), 1);
          }
        };
        div.appendChild(pEl);
        this.containerEl.appendChild(div);
      }
      let El4 = document.createElement("p");
      El4.setAttribute("class", "comment-panel");
      this.containerEl.appendChild(El4);
      El4.setText("\xA0\u2781 \u8BBE\u7F6E\u8BCD\u8868 ");
      El4.onclick = () => {
        this.app.setting.open();
        this.app.setting.openTabById("obsidian-tree-leaf");
      };
      let El2 = document.createElement("p");
      El2.setAttribute("class", "comment-panel");
      this.containerEl.appendChild(El2);
      El2.setText("\xA0\u2782 \u7EE7\u627F\u6807\u7B7E: ");
      El2.onclick = () => {
        this.app.commands.executeCommandById("editor:focus-left");
        this.app.workspace.activeLeaf.view.editor.exec("goRight");
        this.app.commands.executeCommandById("file-explorer:new-file-in-new-pane");
        this.app.workspace.activeLeaf.view.editor.exec("goRight");
        if (thisTagList.length > 0) {
          navigator.clipboard.writeText(thisTagList.join(" ") + "\n\n");
          new import_obsidian.Notice("\u7EE7\u627F\u6807\u7B7E\u5DF2\u5199\u5165\u526A\u8D34\u677F\uFF0C\u656C\u8BF7\u7C98\u8D34\uFF01");
        } else {
          new import_obsidian.Notice("\u521A\u624D\u7684\u7B14\u8BB0\u4E0D\u5B58\u5728\u6807\u7B7E\uFF0C\u65E0\u627F\u53EF\u7EE7\uFF01");
        }
      };
      for (let i = 0; i < thisTagList.length; i++) {
        let div2 = document.createElement("Div");
        div2.setAttribute("class", "comment-pannel-bubble");
        let pEl2 = document.createElement("text");
        pEl2.setAttribute("class", "comment-panel");
        let showText2 = thisTagList[i];
        pEl2.setText(showText2);
        div2.appendChild(pEl2);
        this.containerEl.appendChild(div2);
      }
      let El3 = document.createElement("p");
      El3.setAttribute("class", "comment-panel");
      this.containerEl.appendChild(El3);
      El3.setText("\xA0\u2783 \u8FD4\u56DE\u53F6\u7EA7 ");
      El3.onclick = () => {
        new import_obsidian.Notice("\u6B64\u529F\u80FD\u5C1A\u672A\u5F00\u53D1\uFF01");
      };
    }
  }
  addTagTo() {
    this.app.commands.executeCommandById("editor:focus-left");
    let view = this.app.workspace.getActiveViewOfType(import_obsidian.MarkdownView);
    if (!view) {
      return;
    }
    ;
    let editor2 = view.sourceMode.cmEditor;
    let lines2 = editor2.getValue();
    if (!/\s*tags:+\s+\[*/i.test(lines2)) {
      editor2.setCursor(0, 0);
      if (/^\s*#/.test(lines2)) {
        editor2.replaceSelection(addTagList.join(" ") + " ");
      } else {
        editor2.replaceSelection(addTagList.join(" ") + "\n");
      }
    } else {
      console.log("\u5177\u5907YAML\u6570\u636E");
      let temp = addTagList.join(",").replace(/#/g, "");
      editor2.setValue(lines2.replace(/(\s*tags:+\s+\[*)/i, "$1" + temp + ","));
    }
    addTagList = [];
    this.redraw();
  }
};
