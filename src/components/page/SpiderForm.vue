<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-calendar"></i> 爬取
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="form-box">
                <el-form ref="form" :model="form" label-width="80px">
                    <el-form-item label="书名">
                        <el-input v-model="form.bookName"></el-input>
                    </el-form-item>
                    <el-form-item label="作者">
                        <el-input v-model="form.authorName"></el-input>
                    </el-form-item>
                    <el-form-item label="首章地址">
                        <el-input v-model="form.url"></el-input>
                    </el-form-item>
                    <el-form-item label="规则">
                        <el-select v-model="form.matchRexId" placeholder="请选择">
                            <el-option v-for="item in rex" :key="item.id" :label="item.name" :value="item.id"></el-option>
                        </el-select>
                        <el-button
                                type="primary"
                                icon="el-icon-refresh"
                                class="refresh"
                                @click="refresh"
                        >刷新</el-button>
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" @click="onSubmit">开始爬取</el-button>
                        <el-button @click="reset">取消</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'baseform',
    data() {
        return {
            form:{
                bookName: '牧神记',
                authorName: '宅猪',
                url:'http://www.biquge001.com/Book/16/16935/12799783.html',
                matchRexId: '',
            },
            rex:[]
        };
    },
    created(){
    	this.getRex();
    },
    methods: {
		refresh(){
			this.$axios.get("/admin/rex").then(res => {
				this.rex = res.data.data;
				this.$message.success("刷新成功！")
			});
		},
        onSubmit() {
			this.$axios.post('/admin/book',this.form).then(res=>{
				this.$message.success("正在爬取！")
			})
        },
		getRex() {
			this.$axios.get("/admin/rex").then(res => {
				this.rex = res.data.data;
			});
		},
        reset(){
        	this.form = {
				bookName: '',
				authorName: '',
				url:'',
				encode:'',
				matchRexId: '',
			}
        }
    },
};
</script>
<style>
    .refresh{
        margin-left: 10px;
    }
</style>
