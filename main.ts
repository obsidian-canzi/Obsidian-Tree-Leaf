import { App, Editor, MarkdownView, CachedMetadata, View,  Modal, Notice,getAllTags, Plugin, PluginSettingTab, Setting, ItemView, WorkspaceLeaf ,TFile} from 'obsidian';
import * as CodeMirror from 'codemirror';

// Remember to rename these classes and interfaces!
// 记得要重命名这些类和接口！

export const VIEW_TYPE_OB_TREELEAF = 'ob_treeleaf';
export let editor:any;
export let allFileList:TFile[];

export let thisTagList: string[] =[];
export let upTagList: string[] =[];
export let addTagList: string[] =[];
export let isYaml:boolean = false;

export let thisFile:TFile;
export let thisLines:string;

//声明变量类型
interface TreeLeafPluginSettings {
	SHOW_RIBBON: boolean;
	keyWords:string;
	mySetting: string;
}

const DEFAULT_SETTINGS: TreeLeafPluginSettings = {
	SHOW_RIBBON: true,
	keyWords:'',
	mySetting: '默认'
}

export default class TreeLeafPlugin extends Plugin {
	settings: TreeLeafPluginSettings;
	view: View;
	app: App;

	async onload() {
		await this.loadSettings();

		this.registerView(VIEW_TYPE_OB_TREELEAF, (leaf: WorkspaceLeaf) => this.view = new TreeLeafView(leaf));
		this.addCommand({
			id: "show-treeleaf-panel",
			name: "打开推荐面板",
			callback: () => this.showPanel()
		});

		// 下列代码将在左侧创建一个按钮。
		if (this.settings.SHOW_RIBBON) {
			this.addRibbonIcon('lines-of-text', "显示推荐面板", (e) => this.showPanel());
		}

		this.registerEvent(this.app.workspace.on('file-open', (file:TFile) => {
            if (file != null) {
                allFileList = this.app.vault.getMarkdownFiles();
                thisFile = file;
				this.getLineTags(file);
            }
        }));

		this.registerEvent(this.app.metadataCache.on("changed", (file:TFile) => {
            if (file != null) {
				this.getLineTags(file);
            }
        })); 

		// 这里添加一条编辑命令，是对正文进行编辑处理。
		this.addCommand({
			id: 'editor-dvjs-moc1',
			name: '按文件名筛选叶型笔记列表',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				console.log(editor.getSelection());
                let dvjs1:string = '↩↩```dataviewjs↩let tagname =dv.current().file.name.replace(/^&+/,"#").replace(/\-/g," and #")↩dv.table( ["叶级笔记列表","内含标签"],↩dv.pages(tagname).sort(p => p.file.tags).map(p => {↩    return  [p.file.link, p.file.tags.sort().join(" | ").replace(/#/g,"")]↩})); ↩```↩此文件最后修改时间为： `$= dv.current().file.mtime`。↩↩ '
                new Notice("此代码运行需要安装并启用 DataView 插件，\n请将文件名称修改为 '&词1-词2-词3' 的样式，代码会自动识别文件名称中的关键词进行筛选。\n鼠标点此即可关闭！",20000)
				editor.replaceSelection(dvjs1.replace(/↩/g,"\n"));
			}
		});

        this.addCommand({
			id: 'editor-dvjs-moc2',
			name: '按标签组筛选叶型笔记列表',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				console.log(editor.getSelection());
                let dvjs2:string = '↩↩```dataviewjs↩let tagname =dv.current().file.tags.join(" and ")↩dv.table( ["叶级笔记列表","内含标签"],↩dv.pages(tagname).sort(p => p.file.tags).map(p => {↩    return  [p.file.link, p.file.tags.sort().join(" | ").replace(/#/g,"")]↩})); ↩```↩此文件最后修改时间为： `$= dv.current().file.mtime`。 ↩↩'
                new Notice("此代码运行需要安装并启用 DataView 插件，\n请在笔记内设置至少三个 '#标签'，代码会自动识别笔记内的标签词进行筛选。\n鼠标点此即可关闭！",20000)
				editor.replaceSelection(dvjs2.replace(/↩/g,"\n"));
			}
		});

		/*这里添加一个复杂的命令，该命令可以检查应用程序的当前状态是否允许执行命令
		this.addCommand({
			id: 'open-sample-modal-complex',
			name: '打开面板',
			checkCallback: (checking: boolean) => {
				// 条件检查，指定一条布尔值
				const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
				if (markdownView) {
					// 如果结果为真，我们只是在“检查”该命令是否可以运行。
					// 如果结果为假，则希望实际执行该操作。
					if (!checking) {
						new SampleModal(this.app).open();
					}

					// 仅当Check函数返回True时，此命令才会显示在命令组件面板中
					return true;
				}
			}
		});*/

		// 这将添加设置选项卡，以便用户对插件进行各个方面配置。
		this.addSettingTab(new SampleSettingTab(this.app, this));

		// 如果插件执行了任何全局 DOM 事件(在不属于此插件的应用程序部分)
		// 当禁用此插件时，使用此函数将自动删除事件侦听器。
		/*this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			console.log('click', evt);
		});*/

		// 当注册时间间隔时，此功能将在禁用插件时自动清除该时间间隔。
		//this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
	}

	showPanel = function () {
		this.app.workspace.getRightLeaf(true)
			.setViewState({ type: VIEW_TYPE_OB_TREELEAF });
	}

	onunload() {
		console.log('卸载插件');
	}

	async loadSettings() {
		// 加载设置参数文件.json
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		// 保存设置参数，参数文件.json 一般会保存到插件文件夹内
		await this.saveData(this.settings);
	}

	//获取正文及标签信息
	getLineTags(file:TFile):any{
		thisTagList = [];
		upTagList = [];
		addTagList = [];
		editor = this.getEditor();
		thisLines = this.getLines(editor);
		thisTagList = this.getThisTagList(file);
		upTagList = this.getUpTagList(thisLines);
	}

	//获取推荐标签列表
    getUpTagList(lines:string):any {
        var allkeywords:string = this.settings.keyWords.replace(/(\s*\n)+/g,"\n").replace(/[ ,，、]+/g,",");
        var wordList: string[] = allkeywords.split("\n");
		var ary0: string[] = [];
        for(var k:number =0; k<wordList.length; k++){
            var wordKey:string = wordList[k].replace(/,/g,"|");//整理当前词条并处理为 词|词
            var tag0 = wordKey.match(/^[^\|]+/);
			var tag:string = "";
			 if(tag0 == null){
				tag = String("#"+wordKey);
			 }else{
				tag = String("#"+tag0[0]);
			 }
			 //识别词表中的首位 标签词，将加前缀#
            var reg0:RegExp = eval("/("+wordKey+")/");
            //console.log(wordKey+" "+tag0+" "+reg0);
            if(reg0.test(lines) && !upTagList.includes(tag) && !thisTagList.includes(tag)){
                ary0.push(tag);
                console.log(tag0);
            }
        };
		return ary0;
    }

	//获取当前标签列表
    getThisTagList(file:TFile):any {
		var fileCache = this.app.metadataCache.getFileCache(file);
		if(fileCache){
			var array:any = getAllTags(fileCache);
			if(array == null){
				return;
				console.log("未获得标签信息！")
			}else{
				return this.aryToHeavy(array);
				console.log("已获取当前所有标签并去重处理！")
			}
		}
    };

	/** 以下为基础功能函数 */
	getEditor(): CodeMirror.Editor {
        let view:any = this.app.workspace.getActiveViewOfType(MarkdownView);
		//if (!view) return;

		let cm = view.sourceMode.cmEditor;
		return cm;
    };

	getLines(editor:CodeMirror.Editor):string {
		return  editor.getValue();
    };

	//去重算法
	aryToHeavy(_array:string[]):string[]{
        var reg:RegExp = /(,[^\,]+)\1+/gim;    //正则表达式，验证数据连续重复
        var arrayStr:string = ","+_array.sort().toString()+",";    //前后补加逗号，将首尾元素封闭起来，转为字符串
        while(reg.test(arrayStr)){    //如果存在数据重复
           arrayStr=arrayStr.replace(reg,",$1");   //就把重复部分替换去重一次
        }
        //去掉首尾逗号，截取保留中部部分
        arrayStr = arrayStr.slice(1,arrayStr.length-1);
        //输出为数组
        return String(arrayStr).split(",").sort();
    }
}


// 指定弹出窗口的 打开与关闭 命令
class SampleModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const {contentEl} = this;
		contentEl.setText('显示弹出面板中的文字!');
	}

	onClose() {
		const {contentEl} = this;
		contentEl.empty();
	}
}

class SampleSettingTab extends PluginSettingTab {
	plugin: TreeLeafPlugin;

	constructor(app: App, plugin: TreeLeafPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		containerEl.createEl('h2', {text: '树叶插件'});

		new Setting(containerEl)
			.setName('关于插件(About TreeLeaf)')
			.setDesc('此插件魔改自 Obsidian-Comments 插件，配合树叶笔记法实现【落叶寻枝】【循枝生叶】功能。')

        new Setting(containerEl)
			.setName('筛选笔记(Filter Notes)')
			.setDesc('执行【按文件名/标签词筛选】命令，会在笔记中添加 DataViewJS 代码，并根据文件名称或内含标签组进行全库筛选。')

		new Setting(containerEl)
			.setName('关键词表(Keyword table)')
			.setDesc('每行一组词，用逗号间隔。(Each line has a group of words separated by commas.)')
			.addTextArea(text => {
                text
                    .setPlaceholder('tag,word1,word2,word...')
                    .setValue(this.plugin.settings.keyWords)
                    .onChange((value) => {
                        this.plugin.settings.keyWords = value.replace(/(\n\s*)*$/,"");
                        this.plugin.saveSettings();
                });
                text.inputEl.rows = 20;
                text.inputEl.cols = 84;
            });
	}
}

export class TreeLeafView extends ItemView {

    constructor(leaf: WorkspaceLeaf) {
        super(leaf);
        this.redraw = this.redraw.bind(this);
        this.containerEl = this.containerEl;
        //this.registerEvent(this.app.workspace.on("layout-ready", this.redraw));
        this.registerEvent(this.app.workspace.on("file-open", this.redraw));
        this.registerEvent(this.app.workspace.on("quick-preview", this.redraw));
        this.registerEvent(this.app.metadataCache.on("changed",this.redraw));
    }

    getViewType(): string {
        return VIEW_TYPE_OB_TREELEAF;
    }

    getDisplayText(): string {
        return "推荐面板";
    }

    getIcon(): string {
        return "lines-of-text";
    }

    onClose(): Promise<void> {
        return Promise.resolve();
    }

    async onOpen(): Promise<void> {
        this.redraw();
    }

    async redraw() {
        let active_leaf = this.app.workspace.getActiveFile();
        this.containerEl.empty();
        this.containerEl.setAttribute('class', 'comment-panel')

        // Condition if current leaf is present
        if (active_leaf) {
			let El1 = document.createElement("p");
            El1.setAttribute('class', 'comment-panel')
            this.containerEl.appendChild(El1);
            El1.setText(' ➀ 推荐标签: ' + upTagList.length);
			El1.onmouseover =() => {
				console.log("将把推荐的标签写入到笔记中！");
			}
			El1.onclick = () => {
                if(addTagList.length>0){
                    this.addTagTo()
                    console.log(addTagList.join(","));
                }else{
                    new Notice("未发现推荐标签，请完善关键词表再尝试！");
                }
            };
            for (let i = 0; i < upTagList.length; i++) {
                let div = document.createElement('Div');
                div.setAttribute('class', 'comment-pannel-bubble')
                let pEl = document.createElement("text");
                pEl.setAttribute('class', 'comment-pannel-p1')
				let _tagStr:string = upTagList[i]
				pEl.setText(_tagStr.replace(/^#/,"☐ "));
				pEl.onclick = () => {
                    if(/☑/.test(pEl.innerText)){
                        pEl.setText(_tagStr.replace(/^#/,"☐ "));
                        addTagList.splice(addTagList.indexOf(_tagStr),1);
                        upTagList.push(_tagStr);
                    }else{
                        pEl.setText(_tagStr.replace(/^#/,"☑ "));
                        addTagList.push(_tagStr);
                        upTagList.splice(upTagList.indexOf(_tagStr),1);
                    }
                };
                div.appendChild(pEl)
                this.containerEl.appendChild(div)
            }

            let El4 = document.createElement("p");
            El4.setAttribute('class', 'comment-panel');
            this.containerEl.appendChild(El4);
            El4.setText(' ➁ 设置词表 ');
            El4.onclick = () => {
                (this.app as any).setting.open();
                (this.app as any).setting.openTabById("obsidian-tree-leaf");
            };
        
			let El2 = document.createElement("p");
            El2.setAttribute('class', 'comment-panel');
            this.containerEl.appendChild(El2);
            El2.setText(' ➂ 继承标签: ');// + thisTagList.length
            El2.onclick = () => {
                (this.app as any).commands.executeCommandById('editor:focus-left');
                (this.app as any).workspace.activeLeaf.view.editor.exec("goRight");
                (this.app as any).commands.executeCommandById('file-explorer:new-file-in-new-pane');
                (this.app as any).workspace.activeLeaf.view.editor.exec("goRight");
                if(thisTagList.length>0){
                    navigator.clipboard.writeText(thisTagList.join(" ")+"\n\n");
                    new Notice("继承标签已写入剪贴板，敬请粘贴！");
                }else{
                    new Notice("刚才的笔记不存在标签，无承可继！");
                }
            };
            
            for (let i = 0; i < thisTagList.length; i++) {
                let div2 = document.createElement('Div');
                div2.setAttribute('class', 'comment-pannel-bubble');
                let pEl2 = document.createElement("text");
                pEl2.setAttribute('class', 'comment-panel');
                let showText2 = thisTagList[i];
                pEl2.setText(showText2);
                div2.appendChild(pEl2);
                this.containerEl.appendChild(div2);
            }

			let El3 = document.createElement("p");
            El3.setAttribute('class', 'comment-panel');
            this.containerEl.appendChild(El3);
            El3.setText(' ➃ 返回叶级 ');
            El3.onclick = () => {
                new Notice("此功能尚未开发！");
            };
            

		}
    }

	//将确认的标签添加到笔记正文中
	addTagTo():any{
        (this.app as any).commands.executeCommandById('editor:focus-left');
        let view:any = this.app.workspace.getActiveViewOfType(MarkdownView);
        if (!view){return};
        let editor:any = view.sourceMode.cmEditor;
        let lines:string = editor.getValue();
        if(!/\s*tags:+\s+\[*/i.test(lines)){
            editor.setCursor(0, 0);
            if(/^\s*#/.test(lines)){
                editor.replaceSelection(addTagList.join(" ")+" ");
            }else{
                editor.replaceSelection(addTagList.join(" ")+"\n");
            }
        }else{
            console.log("具备YAML数据")
            let temp = addTagList.join(",").replace(/#/g,"");
            editor.setValue(lines.replace(/(\s*tags:+\s+\[*)/i,"$1"+temp+","));
        }
        addTagList = [];
        this.redraw();
    }
}
