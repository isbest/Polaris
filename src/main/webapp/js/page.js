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
        },
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
