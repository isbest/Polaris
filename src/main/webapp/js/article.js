window.onload = function () {
    let toggle = document.getElementsByClassName("toggle-sidebar-wrap")[0];
    let commentSubmit = document.getElementById('submit-comment');

    toggle.onclick = function () {
        console.log("yes");
        let sidebar = document.getElementById("sidebar");
        let body = document.getElementsByTagName("body")[0];
        if (toggle.style.transform === "rotateZ(-90deg)") {
            sidebar.style.transform = "translateX(0px)";
            toggle.style.transform = "rotateZ(90deg)";
            body.style.paddingLeft = "0px";
            return;
        }
        sidebar.style.transform = "translateX(300px)";
        toggle.style.transform = "rotateZ(-90deg)";
        body.style.paddingLeft = "300px";
    }
    commentSubmit.onclick = function () {
        alert(comment.getValue());
    }
}


let article = new Vue({
    el: "#article",
    data: {
        contentEditor: "",
        item: {content: "loading..."},
        flag: true,
    },
    methods: {
        getQueryVariable(variable) {
            const query = window.location.search.substring(1);
            let vars = query.split("&");
            for (let i = 0; i < vars.length; i++) {
                let pair = vars[i].split("=");
                if (pair[0] === variable) {
                    return pair[1];
                }
            }
            return false;
        },
        async getDetails(id) {
            axios({
                url: "http://localhost:8080/article/api/" + id,
                method: "get",
            }).then(res => {
                article.item.content = res.data.content;
                console.log("数据请求完成");
            }).catch(err => alert(err))
        },
        //渲染文章本体
        async renderMarkdown(md) {
            console.log("开始渲染")
            await Vditor.preview(document.getElementById('article-body'), md, {
                anchor: 1, math: {
                    "inlineDigit": true,
                    engine: "MathJax",
                    macros: {
                        "bf": "{\\boldsymbol f}",
                        "bu": "{\\boldsymbol u}",
                        "bv": "{\\boldsymbol v}",
                        "bw": "{\\boldsymbol w}"
                    }
                }, after() {
                    console.log("渲染完成");
                }
            });
        },
        //渲染文章大纲
        async renderOutline(md) {
            console.log("开始渲染大纲");
            let outlineElement = document.getElementById("outline");
            let html = await Vditor.md2html(md);
            outlineElement.innerHTML = html;
            Vditor.outlineRender(outlineElement, outlineElement);
            console.log("大纲渲染完成");
            if (outlineElement.innerHTML === "" || outlineElement.innerText === "") {
                this.flag = false;
            }
        }
    },
    watch: {
        item: {
            //开启深度监控
            deep: true,
            handler(obj) {
                this.renderMarkdown(obj.content);
                this.renderOutline(obj.content);
            }
        }
    },
    created() {
        this.getDetails(this.getQueryVariable("id"));
    },
    mounted() {
        document.getElementById('article-body').innerHTML = "loading...";
    }
})

let comment = new Vditor('comment-edit', {
    toolbarConfig: {
        pin: true
    },
    height: window.innerHeight / 3,
    theme: 'classic',
    mode: "wysiwyg",
    typewriterMode: false,
    //设置代码块高亮 行号 数学公式
    toolbar: [
        'emoji',
        'link',
        'upload',
        'edit-mode'
    ],
    preview: {
        hljs: {
            "lineNumber": true
        },
        math: {
            "inlineDigit": true,
            engine: "MathJax",
            macros: {
                "bf": "{\\boldsymbol f}",
                "bu": "{\\boldsymbol u}",
                "bv": "{\\boldsymbol v}",
                "bw": "{\\boldsymbol w}"
            },
        },
    },
    //空内容提示
    placeholder: "欢迎来踩～喵",
    //图片上传
    upload: {
        accept: "image/*, .wav",
        url: 'http://localhost:8080/article/fileupload',
        fieldName: "file[]", //上传字段名称
        multiple: true, //多文件上传
        filename(name) {
            return name.replace(/[^(a-zA-Z0-9\u4e00-\u9fa5\.)]/g, '')
                .replace(/[\?\\/:|<>\*\[\]\(\)\$%\{\}@~]/g, '')
                .replace('/\\s/g', '');
        },
        success(editor, msg) {
            msg = JSON.parse(msg)
            console.log(msg);
            if (msg.code === 0) {
                comment.tip(msg.msg, 3 * 1000);
                let content;
                let fileMap = msg.data.succMap;
                for (const key in fileMap) {
                    //获取文件后缀，判断类型
                    let temp = key.substring(key.lastIndexOf('.') + 1)
                    if (temp === "png" || temp === "jpg") {
                        // 图片
                        content = "![" + key + "](" + fileMap[key] + ")";
                    } else {
                        //资源
                        content = "[" + key + "](" + fileMap[key] + ")";
                    }
                    //插入上传文件后的markdown代码
                    comment.insertValue(content);
                }
            } else {//请求失败
                let errFileMsg = "";
                if (msg.errFiles != null) {
                    let errFiles = msg.errFiles;
                    for (const errFile of errFiles) {
                        errFileMsg += errFile + '\n';
                    }
                }
                comment.tip(errFileMsg + " " + msg.msg, 3 * 1000);
            }
        },
        error(msg) {
            comment.tip("服务器出错，上传失败", 3 * 1000);
        }
    },
    // 开启缓存
    cache: {
        enable: true,
        id: "comment",
        after(str) {
            comment.tip("实时保存成功", 1000);
        },
    },
    //字数统计
    counter: {
        enable: true,
    },
});
