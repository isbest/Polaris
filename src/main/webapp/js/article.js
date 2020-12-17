window.onload = function () {
    let toggle = document.getElementsByClassName("toggle-sidebar-wrap")[0];

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
}


const commentEdit = {
    template: `
     <div class="comment-edit">
        <div id="commentVditor" ref="vditorHost"></div>
        <button @click="submitCom" class="comment-edit-btn">回复</button>
        <button @click="closeEdit" class="comment-close-btn" v-if="!isclose">关闭</button>
     </div>
    `,
    props: ["cid", "isclose", "aid"],
    data: () => {
        return {
            vditor: null,
        }
    },
    methods: {
        initVditor() {
            const that = this;
            const options = {
                height: 200,
                theme: 'classic',
                mode: "wysiwyg",
                toolbar: [
                    'emoji',
                    'link',
                    'upload',
                    'edit-mode'
                ],
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
                            that.vditor.tip(msg.msg, 3 * 1000);
                            let content;
                            let fileMap = msg.data.succMap;
                            for (let key in fileMap) {
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
                                that.vditor.insertValue(content);
                            }
                        } else {//请求失败
                            let errFileMsg = "";
                            if (msg.errFiles != null) {
                                let errFiles = msg.errFiles;
                                for (const errFile of errFiles) {
                                    errFileMsg += errFile + '\n';
                                }
                            }
                            that.vditor.tip(errFileMsg + " " + msg.msg, 3 * 1000);
                        }
                    },
                    error(msg) {
                        that.vditor.tip("服务器出错，上传失败", 3 * 1000);
                    }
                },
                cache: {
                    enable: false,
                }
            };
            this.vditor = new Vditor("edit" + that.cid, options);
        },
        submitCom: function () {
            $.ajax({
                type: 'post',
                //传json不加header会报415错误
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                data: this.makeData(),
                url: "http://localhost:8080/comment/api/add",
                dataType: "json",
                success: (data) => {
                    if(data === -1) {
                        alert("请先登录");
                    }
                    if(data === 1) {
                        console.log("提交失败，请联系管理员");
                    }
                    if(data === 0) {
                        //清空输入框，关闭输入框
                        this.vditor.setValue("",true);
                        this.closeEdit();
                        this.refresh();
                    }
                },
                error(msg) {
                    console.log(msg);
                }
            });
        },
        closeEdit() {
            return this.$emit("close");
        },
        refresh(){
            return this.$emit("refresh");
        },
        makeData(){
            if(this.vditor.getValue()===null || this.vditor.getValue()==="") {
                alert("评论内容不能为空");
                return;
            }
            let comment = {};
            comment.user = null;
            comment.aid = this.aid;
            comment.likes = 0;
            comment.id = null;
            comment.childCom = null;
            comment.date = new Date();
            comment.content = this.vditor.getValue();
            if (this.cid === 0) {
                comment.cid = null;
            } else {
                comment.cid = this.cid;
            }
            console.log(JSON.stringify(comment));
            return JSON.stringify(comment);
        }
    },
    mounted() {
        this.$refs.vditorHost.setAttribute("id", "edit" + this.cid);
        this.initVditor();
    },
}


const commentBox = {
    template: `
    <div>
        <div class="commentBox" v-for="(item,index) in comments" :key="item.id" v-if="comments!==undefined">
            <div class="comment-inner">
                <div class="comment-inner-avatar">
                    <span>
                        <img src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" :alt="item.user.userName">
                    </span>
                </div>
                <div class="comment-content">
                    <div class="comment-content-author">
                        <span>
                            <a :href="'http://localhost:8080/user/info/id?id='+item.user.id">{{item.user.userName}}</a>
                        </span>
                        <span>
                            <span>{{item.date}}</span>
                        </span>
                    </div>
                    <div class="comment-content-detail">
                        <p>
                         {{item.content}}
                        </p>
                    </div>
                    <ul class="comment-action">
                        <li>
                            <span @click="addLike(item.id)">
                                <i class="iconfont icon-dianzan comment-icon"></i>
                                <span>{{item.likes}}</span>
                            </span>
                        </li>
                        <li>
                            <span @click="openEdit(index)"> 
                                <i class="iconfont icon-chakantiezihuifu"></i>
                                <span>回复</span>
                            </span>
                        </li>
                    </ul>
                </div>
            </div>
             <!--这里的id填写文章id+评论id-->
             <div class="comment-edit-box" ref="subComEdit" >
                <comment-edit :cid="item.id" :isclose="false" @close="closeEdit" :aid="item.aid" @refresh="refresh"></comment-edit>
             </div>
            <div class="sub-com" v-if="item.childCom!==undefined && item.childCom.length>0">
               <comment-box :comments="item.childCom" @refresh="refresh"></comment-box>
            </div>
      </div>
    </div>
    `,
    name: 'comment-box',
    methods: {
        openEdit: function (index) {
            this.closeEdit();
            this.$refs.subComEdit[index].style = "display:block";
        },
        closeEdit: function () {
            for (let index in this.$refs.subComEdit) {
                this.$refs.subComEdit[index].style = "display:none";
            }
        },
        refresh() {
            return this.$emit("refresh");
        },
        addLike(id) {
            console.log(id);
            $.ajax({
                type: 'post',
                //传json不加header会报415错误
                data: id,
                url: "http://localhost:8080/comment/api/like/add/"+id,
                dataType: "json",
                success: (data) => {
                    this.refresh();
                },
                error(msg) {
                    alert("点赞失败，请联系管理员");
                }
            });
        }
    },
    props: ['comments'],
    components: {
        commentEdit,
    },
    created() {
        console.log(this.comments);
    },
    mounted() {
        this.closeEdit();
    }
}

let article = new Vue({
    el: "#article",
    data: {
        contentEditor: "",
        item: {content: "loading..."},
        cid: 0,
        aid: 0,
        comments: ``,
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
            }).catch(err => alert(err))
        },
        //渲染文章本体
        async renderMarkdown(md) {
            console.log("开始渲染")
            await Vditor.preview(this.$refs.art, md, {
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
            this.$refs.outline.innerHTML = await Vditor.md2html(md);
            Vditor.outlineRender(this.$refs.outline, this.$refs.outline);
            if (this.$refs.outline.innerHTML === "" || this.$refs.outline.innerText === "") {
                this.$refs.outline.innerText = "这一篇没有大纲嗷~";
                console.log("没有大纲");
            }
            console.log("大纲渲染完成");
        },
        //获取文章的评论
        async getComTree(id) {
            axios({
                url: "http://localhost:8080/comment/api/comtree/" + id,
                method: "get",
            }).then(res => {
                article.comments = res.data;
            }).catch(err => alert(err))
        },
        refresh(){
            this.getComTree(this.aid).then(r => console.log("刷新完成"));
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
        this.aid = this.getQueryVariable("id")
        this.getDetails(this.aid).then(r => console.log("文章数据请求完毕"));
        this.getComTree(this.aid).then(r => console.log("评论数据请求完毕"));
    },
    mounted() {
        this.$refs.art.innerHTML = "loading...";
    },
    components: {
        commentEdit,
        commentBox
    }
})
