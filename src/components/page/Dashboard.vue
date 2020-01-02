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
                    <div class="user-info-list">创建时间：<span>{{user.create_time}}</span></div>
                    <div class="user-info-list">欢迎回来！</div>
                </el-card>
            </el-col>
            <el-col :span="16">
                <el-row :gutter="20" class="mgb20">
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-1">
                                <i class="el-icon-notebook-2 grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{visit}}</div>
                                    <div>阅读量</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>
            </el-col>

        </el-row>
        <el-row :gutter="20">
            <el-col :span="12">
                <el-card shadow="hover">
                    <chart></chart>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import Chart from '@/components/common/Chart'
    export default {
        name: 'dashboard',
        data() {
            return {
				user: {},
				visit:0,
                data: {}
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
        mounted(){
			this.user = JSON.parse(localStorage.getItem("user_info"));
			this.$axios.get('visit').then(res=>{
				this.visit = res.data.data;
            })
        },
        components: {
            Chart
        }
    }

</script>


<style scoped>
    .grid-content {
        display: flex;
        align-items: center;
        height: 100px;
    }
    .grid-cont-right {
        flex: 1;
        text-align: center;
        font-size: 14px;
        color: #999;
    }
    .grid-num {
        font-size: 30px;
        font-weight: bold;
    }
    .grid-con-icon {
        font-size: 50px;
        width: 100px;
        height: 100px;
        text-align: center;
        line-height: 100px;
        color: #fff;
    }
    .grid-con-1 .grid-con-icon {
        background: rgb(45, 140, 240);
    }
    .grid-con-1 .grid-num {
        color: rgb(45, 140, 240);
    }
    .grid-con-2 .grid-con-icon {
        background: rgb(100, 213, 114);
    }
    .grid-con-2 .grid-num {
        color: rgb(45, 140, 240);
    }
    .grid-con-3 .grid-con-icon {
        background: rgb(242, 94, 67);
    }
    .grid-con-3 .grid-num {
        color: rgb(242, 94, 67);
    }
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
    }
    .user-info-list span {
        margin-left: 70px;
    }


    .mgb20 {
        margin-bottom: 20px;
    }

</style>
