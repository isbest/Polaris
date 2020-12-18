const articleInfo = {
    template: `
    <div class="archives">
        <div class="archives-title">
            文章总览
        </div>
        <div class="archives-sort">
            <div v-for="item in info">
                <div :class="{'archives-sort-item':true, year: item.id===0}">
                    <div v-if="item.id===0">{{item.title}}</div>
        
                    <div class="archives-item-img" v-if="item.id!==0">
                        <a :href="'http://localhost:8080/article/id?id='+item.id">
                            <img src="/images/avatar.png" :alt="item.title">
                        </a>
                    </div>
                    <div class="archives-item-post"  v-if="item.id!==0">
                        <a :href="'http://localhost:8080/article/id?id='+item.id"">
                        <i class="iconfont icon-fabushijian"></i>
                        <time>{{item.releaseDate}}</time>
                        <div class="arch-item-post-title">{{item.title}}</div>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `,
    data() {
        return {
            info: []
        }
    },
    methods: {
        getInfo() {
            axios("http://localhost:8080/article/time/line").then(res => {
                this.info = res.data;
                if (this.info === "") {
                    alert("请先登录");
                }
                console.log(this.info);
            }).catch(err => console.log(err))
        },
    },
    created() {
        this.getInfo();
    },
}

const tagInfo = {
    template: `
    <div class="archives">
        <div class="archives-title">
            标签
        </div>
        <div class="archives-sort">
            <div class="tag-cloud">
                <a v-for="(item,index) in tags" :href="'http://localhost:8080/tag/article/name?name='+item.tag" 
                :style="[{color:randomColor(index)},{'font-size':randomSize(index)}]"
                >
                    {{item.tag}}
                </a>
            </div>
        </div>
    </div>
    `,
    data() {
        return {
            tags: [],
        }
    },
    methods: {
        tagInfo() {
            axios("http://localhost:8080/tag/cloud").then(res => {
                this.tags = res.data;
                if (this.tags === "") {
                    alert("请先登录");
                }
            }).catch(err => console.log(err))
        },
        randomColor(index) {
            let r, g, b;
            r = Math.floor(Math.random() * 256);
            g = Math.floor(Math.random() * 256);
            b = Math.floor(Math.random() * 256);
            return "rgb(" + r + ',' + g + ',' + b + ")";
        },
        randomSize(index) {
            return 15 + Math.ceil(Math.random() * 10) + "px";
        }
    },
    created() {
        this.tagInfo()
    }
}


const articleByTag = {
    template: `
    <div class="archives">
        <div class="archives-title">
           标签 - {{tagName}}
        </div>
        <div class="archives-sort">
            <div v-for="item in info">
                <div :class="{'archives-sort-item':true, year: item.id===0}">
                    <div v-if="item.id===0">{{item.title}}</div>
        
                    <div class="archives-item-img" v-if="item.id!==0">
                        <a :href="'http://localhost:8080/article/id?id='+item.id">
                            <img src="/images/avatar.png" :alt="item.title">
                        </a>
                    </div>
                    <div class="archives-item-post"  v-if="item.id!==0">
                        <a :href="'http://localhost:8080/article/id?id='+item.id"">
                        <i class="iconfont icon-fabushijian"></i>
                        <time>{{item.releaseDate}}</time>
                        <div class="arch-item-post-title">{{item.title}}</div>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `,
    data() {
        return {
            info: [],
            tagName: "",
        }
    },
    methods: {
        getArticles(variable) {
            axios("http://localhost:8080/article/api/tag/"+variable).then(res => {
                console.log(res.data);
                this.info = res.data;
                if (this.info === "") {
                    alert("请先登录");
                }
            }).catch(err => console.log(err))
        },
        getQueryVariable(variable) {
            const query = window.location.search.substring(1);
            let vars = query.split("&");
            for (let i = 0; i < vars.length; i++) {
                let pair = vars[i].split("=");
                if (pair[0] === variable) {
                    this.tagName = pair[1];
                    return pair[1];
                }
            }
            return false;
        },
    },
    created() {
        this.getArticles(this.getQueryVariable("name"));
    },
}




let decInfo = new Vue({
    el: '#archives',
    data: {
        flag: "",
    },
    methods: {
        getmodel() {
            const pathname = window.location.pathname;
            if (pathname.indexOf("/tag/user") >= 0 && !pathname.indexOf("article") >= 0) return "tag";
            if (pathname.indexOf("/article/archives") >= 0 && !pathname.indexOf("tag") >= 0) return "article";
            if (pathname.indexOf("/tag/article/name") >= 0 && pathname.indexOf("name") >= 0) return "articleByTag";
            return "";
        },
    },
    components: {
        articleInfo,
        tagInfo,
        articleByTag
    },
    created() {
        this.flag = this.getmodel();
    }
});
