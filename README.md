从今天开始尝试用 Windows7 + Visual Studio Code + node.js + Github 搭建的开发环境来开发树叶助理插件，逐步实现树叶笔记法的功能。

## 1.0.0 功能更新：自动识别标签词

此插件将根据设置面板中关键词信息来对笔记内容进行识别，然后在侧边栏中推荐相应的标签词，用户可轻松勾选，点击【推荐标签】按钮即可上屏。

https://user-images.githubusercontent.com/16410542/208897503-5f8e7fd5-417b-427d-b5ee-961c0a9ea4c6.mp4


如笔记中内含一些标签，我们可以点击【继承标签】按钮来在右侧快速创建新笔记，执行粘贴操作，即可将前一笔记的同步到新窗口中，这是生叶过程。

在新页面中，可以执行命令【按文件名/标签组筛选】叶型笔记列表，会向笔记中添加 DataViewJS 代码（需要提前安装并启用 DataView 插件）进行自动筛选（归档）。

## 1.1.0 功能更新：平铺查看当前笔记的内链笔记页面

首先启用Obsidian 1.1.8 核心插件 Canvas，新建一个名为 000000 的白板页面。
然后查看某一篇具有多个[[内部链接]]的笔记，执行【平铺查看内链笔记】命令即会看到效果。
建议使用 Shift+1 缩放到合适、Shift+2 缩放到选区 两个命令灵活显示。

https://user-images.githubusercontent.com/16410542/208896442-7030f45c-b55c-432f-a87d-2fe71d76a638.mp4

## 1.2.0 功能更新：返回枝级导航页面

点击【枝级导航】列表中的文件名，可以跳转到相应导航页面查看同枝笔记。

## 1.3.0 功能更新：随机查看落叶笔记

点击【随风落叶】按钮，可从未含标签的落叶笔记中随机抽取一则进行查看。


## 功能待续...
 
- 实现返回枝级导航页面功能
- 实现推荐相关笔记功能
- ......

### 反馈与建议
如您在试用过程中发现问题，欢迎联系蚕子（QQ：312815311），有了插件开发环境，更新将更加便捷迅速，提前感谢！
