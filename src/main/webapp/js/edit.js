$(function () {
    const vditor = new Vditor('vditor', {
        minHeight: 900,
        width: '100%',
        theme: 'classic',
        mode: "wysiwyg",
        typewriterMode: false,
        //设置代码块高亮 行号 数学公式
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
        placeholder: "Vditor 是一款浏览器端的 Markdown 编辑器，支持所见即所得（富文本）、即时渲染（类似 Typora）和分屏预览模式",
        //图片上传
        upload: {
            accept: "image/*, .wav",
            url: '/article/fileupload',
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
                    vditor.tip(msg.msg, 3 * 1000);
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
                        vditor.insertValue(content);
                    }
                } else {//请求失败
                    let errFileMsg = "";
                    if (msg.errFiles != null) {
                        let errFiles = msg.errFiles;
                        for (const errFile of errFiles) {
                            errFileMsg += errFile + '\n';
                        }
                    }
                    vditor.tip(errFileMsg + " " + msg.msg, 3 * 1000);
                }
            },
            error(msg) {
                vditor.tip("服务器出错，上传失败", 3 * 1000);
            }
        },
        // 开启缓存
        cache: {
            enable: true,
            id: "polaris",
            after(str) {
                vditor.tip("实时保存成功", 1000);
            },
        },
        //字数统计
        counter: {
            enable: true,
        },
        //@提示
        hint: {
            extend: [
                {
                    key: '@',
                    hint: (key) => {
                        if ('vanessa'.indexOf(key.toLocaleLowerCase()) > -1) {
                            return [
                                {
                                    value: '@Vanessa',
                                    html: '<img src="https://avatars0.githubusercontent.com/u/970828?s=60&v=4"/> Vanessa',
                                }]
                        }
                        return []
                    },
                },
                {
                    key: '#',
                    hint: (key) => {
                        if ('vditor'.indexOf(key.toLocaleLowerCase()) > -1) {
                            return [
                                {
                                    value: '#Vditor',
                                    html: '#Vditor ♏ 一款浏览器端的 Markdown 编辑器，支持所见即所得（富文本）、即时渲染（类似 Typora）和分屏预览模式。',
                                }]
                        }
                        return []
                    },
                }],
        },
    });

    $(function () {
        new Vue({
            el: '#app',
            data: {
                vTags: ['java', 'php', 'hadoop'],
                name: "开发日记",
            },
            methods: {
                send() {

                    this.makeToast("正在提交", false);

                    $.ajax({
                        type: 'post',
                        //传json不加header会报415错误
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        data: this.makeData(),
                        url: "/article/add",
                        dataType: "json",
                        success: (data) => {
                            if (data.msg === 29) {
                                this.makeToast("请先登录", false);
                            }
                            if (data.msg === 30) {
                                this.makeToast("文章入库失败", false);
                            }
                            if (data.msg === 31) {
                                this.makeToast("标签入库失败", false);
                            }
                            if (data.msg === 32) {
                                this.makeToast("提交成功", true);
                            }
                        },
                        error: (data) => {
                            this.makeToast("请求失败", false);
                        }
                    })

                },
                makeData() {
                    if (vditor.getHTML() === "" || vditor.getHTML() == null) {
                        return null;
                    }
                    let data = {};
                    data.id = "";
                    data.authorId = "";
                    data.title = this.name;
                    data.content = vditor.getHTML();
                    data.releaseDate = this.getNowDate();
                    data.modifyDate = this.getNowDate();
                    data.like = 0;
                    data.views = 0;
                    let tags = [];
                    for (const fTag in this.vTags) {
                        let tag = {};
                        tag.id = "";
                        tag.articleId = "";
                        tag.tag = this.vTags[fTag];
                        tags.push(tag)
                    }
                    data.tags = tags;
                    console.log(data);
                    return JSON.stringify(data);
                },
                makeToast(msg, flag) {
                    if (flag) {
                        this.$buefy.toast.open({
                            duration: 2000,
                            message: msg,
                            position: 'is-bottom',
                            type: 'is-success'
                        })
                    } else {
                        this.$buefy.toast.open({
                            duration: 2000,
                            message: msg,
                            position: 'is-bottom',
                            type: 'is-danger'
                        })
                    }
                },
                getNowDate() {
                    Date.prototype.format = function (fmt) {
                        var o = {
                            'M+': this.getMonth() + 1, //月份
                            'd+': this.getDate(), //日
                            'HH+': this.getHours(), //小时
                            'm+': this.getMinutes(), //分
                            's+': this.getSeconds(), //秒
                            'q+': Math.floor((this.getMonth() + 3) / 3), //季度
                            S: this.getMilliseconds(), //毫秒
                        };

                        if (/(y+)/.test(fmt)) {
                            fmt = fmt.replace(
                                RegExp.$1,
                                (this.getFullYear() + '').substr(4 - RegExp.$1.length)
                            );
                        }

                        for (var k in o) {
                            if (new RegExp('(' + k + ')').test(fmt)) {
                                fmt = fmt.replace(
                                    RegExp.$1,
                                    RegExp.$1.length === 1
                                        ? o[k]
                                        : ('00' + o[k]).substr(('' + o[k]).length)
                                );
                            }
                        }

                        return fmt;
                    };
                    return new Date().format('yyyy-MM-dd');
                }
            },
        });
    })

})