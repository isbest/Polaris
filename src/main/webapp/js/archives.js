const info = {
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
                if(this.info==="") {
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

let decInfo = new Vue({
    el: '#archives',
    methods: {},
    components: {
        info
    }
});
