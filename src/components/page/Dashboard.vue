<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="8">
                <el-card shadow="hover" class="mgb20" style="height:252px;">
                    <div class="user-info">
                        <img src="../../assets/img/img.jpg" class="user-avator" alt="">
                        <div class="user-info-cont">
                            <div class="user-info-name">{{username}}</div>
                            <div>{{role}}</div>
                        </div>
                    </div>
                    <div class="user-info-list">欢迎{{username}}回来！</div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    export default {
        name: 'dashboard',
        data() {
            return {
				user: {}
            }
        },
        computed: {
            role() {
            	let ret = '普通用户';
            	if(this.user.authorities){
            		let authorities = this.user.authorities;
            		for(let i in authorities){
            			if(authorities[i] === "ROLE_USER"){
            				if(ret !== '超级管理员' )
							    ret = '管理员';
                        }else if (authorities[i] === "ROLE_ROOT"){
            				ret = '超级管理员';
                        }
                    }
                }
                return ret;
            },
			username() {
				return this.user.user_name ? this.user.user_name : "---";
			}
        },
        created(){
			this.user = JSON.parse(localStorage.user_info);
        },
        methods: {
        }
    }

</script>


<style scoped>
    .user-info {
        display: flex;
        align-items: center;
        padding-bottom: 20px;
        border-bottom: 2px solid #ccc;
        margin-bottom: 20px;
    }

    .user-avator {
        width: 120px;
        height: 120px;
        border-radius: 50%;
    }

    .user-info-cont {
        padding-left: 50px;
        flex: 1;
        font-size: 14px;
        color: #999;
    }

    .user-info-cont div:first-child {
        font-size: 30px;
        color: #222;
    }

    .user-info-list {
        font-size: 14px;
        color: #999;
        line-height: 25px;
        margin-left: 70px;
    }


    .mgb20 {
        margin-bottom: 20px;
    }


</style>
