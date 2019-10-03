<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-calendar"></i> 规则
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="form-box">
                <el-form ref="form" :model="form" label-width="120px">
                    <el-form-item label="名称">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>
                    <el-form-item label="介绍">
                        <el-input v-model="form.info"></el-input>
                    </el-form-item>
                    <el-form-item label="内容匹配规则">
                        <el-input v-model="form.contentRex"></el-input>
                    </el-form-item>
                    <el-form-item label="标题匹配规则">
                        <el-input v-model="form.titleRex"></el-input>
                    </el-form-item>
                    <el-form-item label="下一章匹配规则">
                        <el-input v-model="form.nextPageRex"></el-input>
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" @click="postRex">新增规则</el-button>
                        <el-button @click="reset">取消</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'RexForm',
    data() {
        return {
            form:{}
        };
    },
    created(){
    	if(process.env.NODE_ENV)
    		this.form = {
				contentRex:'<div[^<]*id="content"[^<]*>([\\s\\S]*?)</div>',
				titleRex:'<h1>([^<]*)</h1>',
				nextPageRex:'<a[^<]*href="([^<]*.html)"[^<]*>下一章</a>',
				name:'笔趣阁爬虫方案',
				info:'无'
			};
    },
    methods: {
        postRex() {
			this.$axios.post('/admin/rex',this.form).then(data=>{
				this.$message.success('新增成功！');
				this.reset();
			}).catch(err=>{
				this.$message.error('新增失败！');
            })
        },
		reset() {
			this.form = {
                contentRex:'',
                titleRex:'',
                nextPageRex:'',
                name:'',
                info:''
			}
        }
    },
};
</script>
