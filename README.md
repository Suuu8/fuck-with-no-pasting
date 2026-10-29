# fuck-with-no-pasting

学习通（超星）作业编辑器粘贴解禁脚本。一个 Tampermonkey（油猴）用户脚本，用来恢复学习通网页版作业编辑框被禁用的复制 / 粘贴功能。

## 文件说明

| 文件 | 说明 |
| --- | --- |
| `xuexitong-paste-v2.user.js` | **当前版本（推荐）**。在 v1 基础上修复了 iframe 编辑器支持：富文本编辑器通常嵌在 iframe 里且是后加载的，v1 只在页面加载时清理一次、且没有在 iframe 内部安装拦截；v2 用 `@all-frames` + MutationObserver + iframe load 监听覆盖动态出现的编辑器。 |
| `xuexitong-paste.user.js` | v1，第一版，作为回退保留。 |

## 安装方法

1. 浏览器安装 Tampermonkey 扩展。
2. 打开本仓库的 `xuexitong-paste-v2.user.js`，点 **Raw**，Tampermonkey 会自动弹出安装页，点「安装」。
   （也可以在 Tampermonkey 里新建脚本，把文件内容整段粘贴进去后保存。）
3. 打开学习通作业页面，在编辑框里正常 Ctrl+V 粘贴。

## 工作原理

学习通页面通过监听 `paste` / `copy` 等事件并拦截来禁止粘贴。本脚本：

- 在**捕获阶段**抢先监听这些事件并 `stopImmediatePropagation()`，让页面自己的拦截处理函数收不到事件；同时**不**调用 `preventDefault()`，所以浏览器自身的粘贴动作照常发生；
- 清除元素上的内联 `onpaste` / `oncopy` 等处理函数，并恢复文字可选（`user-select: text`）；
- v2 额外处理嵌套在 iframe 中、且动态加载的富文本编辑器。

## 说明

- 匹配域名：`*.chaoxing.com`、`*.xuexitong.com`、`*.mooc.chaoxing.com`。
- 若某个作业启用了教师端的「答案防粘贴」且由编辑器组件在更深层拦截，本脚本不保证对所有情况都有效。
- 仅供个人在自己的学习场景中使用。
