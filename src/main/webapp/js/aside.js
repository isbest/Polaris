
let userInfo = new Vue({
    el: "#userInfo",
    data: {
        info: {},
        userName: 'loading',
        articleNum: 0,
        tagNum: 0
    },
    methods:{
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
        getUserInfo(id) {
            axios("http://localhost:8080/user/api/info/"+id).then(res => {
                this.userName = res.data.userName;
                this.info = res.data.userInfo;
                this.articleNum = res.data.userArticles;
            }).catch(err => console.log(err))
        }
    },
    created() {
        this.getUserInfo(9);
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
        }).catch(err => console.log(err))
    }
});