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
                    <el-form-item label="表单名称">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>
                    <el-form-item label="表单名称">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>
                    <el-form-item label="编码">
                        <el-select v-model="form.encode" placeholder="请选择">
                            <el-option key="utf-8" label="UTF-8" value="UTF-8"></el-option>
                            <el-option key="gbk" label="GBK" value="GBK"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="规则">
                        <el-select v-model="form.matchRexId" placeholder="请选择">
                            <el-option v-for="item in rex" :key="item.id" :label="item.name" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" @click="getRex">开始爬取</el-button>
                        <el-button>取消</el-button>
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
                bookName: '',
                authorName: '',
                url:'',
                encode:'',
                matchRexId: 0,
            },
            rex:[]
        };
    },
    created(){
        this.getRex();
    },
    methods: {
        onSubmit() {
            this.$message.success('提交成功！');
        },
        getRex() {
            this.$axios.token().get("/admin/rex").then(res => {
                this.rex = res.data.data;
            });
        }
    },
};
</script>
