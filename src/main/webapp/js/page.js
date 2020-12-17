const pagination = {
    name: "pagination",
    template: `
    <div class="pagination">
        <div class="pagination-inner" >
            <a v-for="(item,index) in pagelist" @click="gotopage(index)" :class="{'page-number': true, current: current===item}" ref="pageNum">{{item+1}}</a>
        </div>
    </div>
    `,
    props: ["pagelist", "current"],
    methods: {
        gotopage(index) {
            return this.$emit("gotopage", index)
        }
    }
}


let summary = new Vue({
    el: '#summary',
    data: {
        items: [{title: 'loading...'}],
        url: [],
        articlesNum: 0,
        current: 0,
    },
    computed: {
        pagelist: function () {
            let len = Math.ceil(this.articlesNum/5);
            return [...Array(len).keys()]
        }
    },
    methods: {
        getArticlesOfPage(current) {
            axios("http://localhost:8080/article/api/page/" + current).then(res => {
                console.log(current);
                summary.items = res.data;
                for (const item of res.data) {
                    summary.url.push(item.id);
                }
                console.log("数据请求完成");
            }).catch(err => console.log(err));
        },
        getArticles() {
            axios("http://localhost:8080/system/api/sysInfo").then(res => {
                summary.articlesNum = res.data.articlesNum;
                console.log("systemInfo 数据请求完成");
            }).catch(err => console.log(err))
        },
        gotopage(index) {
            this.current = index;
            this.getArticlesOfPage(index);
        }
    },
    //获取分页数据
    created() {
        this.getArticles();
        this.getArticlesOfPage(this.current);
    },
    components: {
        pagination
    }
});

let userInfo = new Vue({
    el: "#userInfo",
    data: {
        info: {},
        userName: 'loading',
        articleNum: 0,
        tagNum: 0
    },
    created() {
        axios("http://localhost:8080/user/api/info/9").then(res => {
            userInfo.userName = res.data.userName;
            userInfo.info = res.data.userInfo;
            userInfo.articleNum = res.data.userArticles;
            userInfo.tagNum = res.data.tags;
            console.log("userInfo.info 数据请求完成");
            console.log(res.data);
        }).catch(err => console.log(err))
    }
});

let tag = new Vue({
    el: "#tags",
    data: {
        tags: []
    },
    created() {
        axios("http://localhost:8080/user/api/info/tags").then(res => {
            tag.tags = res.data;
            console.log("tags.tags 数据请求完成");
            console.log(res.data);
        }).catch(err => console.log(err))
    }
});

let systemInfo = new Vue({
    el: "#sysInfo",
    data: {
        articlesNum: 0,
        runDays: 0
    },
    created() {
        axios("http://localhost:8080/system/api/sysInfo").then(res => {
            systemInfo.articlesNum = res.data.articlesNum;
            systemInfo.runDays = res.data.runDays;
            console.log("systemInfo 数据请求完成");
            console.log(res.data);
        }).catch(err => console.log(err))
    }
});