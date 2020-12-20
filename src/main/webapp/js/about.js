let userInfo = new Vue({
    el: "#user",
    data: {
        user: {},
        userInfo: {},
        flag: true
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
        getUserInfo(id) {
            axios("http://localhost:8080/user/api/info/" + id).then(res => {
                this.userInfo = res.data.userInfo;
                this.userInfo.csdn = this.userInfo.csdn.split("/")[this.userInfo.csdn.split("/").length - 1];
                this.userInfo.github = this.userInfo.github.split("/")[this.userInfo.github.split("/").length - 1];
            }).catch(err => console.log(err))
        },
        getUser(id) {
            axios("http://localhost:8080/user/api/user/" + id).then(res => {
                this.user = res.data;
            }).catch(err => console.log(err))
        },
        updateUser() {
            console.log(this.user);
            this.sendUserRequest();
        },
        updateUserInfo() {
            this.userInfo.github = "https://github.com/"+this.userInfo.github;
            this.userInfo.csdn = "https://blog.csdn.net/"+this.userInfo.csdn;
            console.log(this.userInfo);
            this.sendUserInfoRequest();
        },
        sendUserRequest() {
            $.ajax({
                type: 'post',
                //传json不加header会报415错误
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify(this.user),
                url: "http://localhost:8080/user/update/user",
                dataType: "json",
                success: (data) => {
                    if(data.res===1) {
                        console.log("更新用户信息成功");
                    } else {
                        console.log("更新用户信息失败");
                    }
                },
                error(msg) {
                    alert("更新失败，请联系管理员");
                }
            });
        },
        sendUserInfoRequest() {
            $.ajax({
                type: 'post',
                //传json不加header会报415错误
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify(this.userInfo),
                url: "http://localhost:8080/user/update/userinfo",
                dataType: "json",
                success: (data) => {
                    data.log
                },
                error(msg) {
                    alert("更新失败，请联系管理员");
                }
            });
        }
    },
    created() {
        this.getUserInfo(this.getQueryVariable("id"))
        this.getUser(this.getQueryVariable("id"))
    }
})