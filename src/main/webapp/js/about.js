let userInfo = new Vue({
    el: "#user",
    data: {
        user: {
            userName:"",
            password:"",
            sex:"",
            birthdayDate:""
        },
        userInfo: {
            github:"",
            csdn:"",
            qq:"",
            motto:"",
            avatarURL:""
        },
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
            axios("http://localhost:8080/user/api/info").then(res => {
                if(res.data.userInfo!==null) {
                    console.log(userInfo);
                    this.userInfo = res.data.userInfo;
                }
                this.userInfo.csdn = this.userInfo.csdn.split("/")[this.userInfo.csdn.split("/").length - 1];
                this.userInfo.github = this.userInfo.github.split("/")[this.userInfo.github.split("/").length - 1];
            }).catch(err => console.log(err))
        },
        getUser(id) {
            axios("http://localhost:8080/user/api/user/" + id).then(res => {
                this.user = res.data;
                this.userInfo.uid = this.user.id;
            }).catch(err => console.log(err))
        },
        updateUser() {
            this.sendUserRequest(JSON.stringify(this.user));
        },
        updateUserInfo() {
            this.userInfo.github = "https://github.com/" + this.userInfo.github;
            this.userInfo.csdn = "https://blog.csdn.net/" + this.userInfo.csdn;
            if(this.userInfo.csdn === "https://blog.csdn.net/") {
                this.userInfo.csdn = "";
            }
            if(this.userInfo.github === "https://github.com/") {
                this.userInfo.github = "";
            }
            this.sendUserInfoRequest(JSON.stringify(this.userInfo));
        },
        sendUserRequest(dataSource) {
            $.ajax({
                type: 'post',
                //传json不加header会报415错误
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                data: dataSource,
                url: "http://localhost:8080/user/update/user",
                dataType: "json",
                success: (data) => {
                    alert("更新成功");
                },
                error(msg) {
                    console.log("更新失败");
                }
            });
        },
        sendUserInfoRequest(dataSource) {
            $.ajax({
                type: 'post',
                //传json不加header会报415错误
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                data: dataSource,
                url: "http://localhost:8080/user/update/userinfo",
                dataType: "json",
                success: (data) => {
                    if(data.res===1) {
                        alert("更新成功");
                    } else {
                        alert("更新失败");
                    }
                },
                error(msg) {
                    alert("更新失败，请联系管理员");
                }
            });
        },
        uploadAvatar(){
            let that = this;
            let formData = new FormData($('#uploadForm')[0]);
            $.ajax({
                type: 'post',
                data: formData,
                url: "http://localhost:8080/user/upload/avatar",
                cache : false,
                processData : false,
                contentType : false,
                success: (data) => {
                    if(data.msg==="上传成功") {
                        that.userInfo.avatarURL=data.url;

                        let newInfo={
                            uid:that.user.id,
                            avatarURL:that.userInfo.avatarURL
                        }
                        console.log(newInfo);
                        that.sendUserInfoRequest(JSON.stringify(newInfo))
                    } else {
                        alert("上传失败");
                    }
                },
                error(msg) {
                    alert("服务器出错，请联系管理员");
                }
            });
        }
    },
    created() {
        this.getUserInfo(this.getQueryVariable("id"))
        this.getUser(this.getQueryVariable("id"))
    }
})