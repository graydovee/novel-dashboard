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

            <el-row>
                <el-col :span="3">
                    <el-image :src="form.coverUrl" class="cover" v-loading="image_loading">
                        <div slot="error" class="image-slot image-bg">
                        </div>
                    </el-image>
                </el-col>
                <el-col :span="12">
                    <div class="form-box">
                        <el-form ref="form" :model="form" label-width="80px">
                            <el-form-item label="书名">
                                <el-input v-model="form.bookName"></el-input>
                            </el-form-item>
                            <el-form-item label="作者">
                                <el-input v-model="form.authorName"></el-input>
                            </el-form-item>
                            <el-form-item label="简介">
                                <el-input v-model="form.introduce"></el-input>
                            </el-form-item>
                            <el-form-item label="封面地址">
                                <el-input v-model="form.coverUrl"></el-input>
                            </el-form-item>
                            <el-form-item label="首章地址">
                                <el-input v-model="form.firstChapterUrl"></el-input>
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
                </el-col>
                <el-col :span="6" :offset="3">
                    <el-form>
                        <el-form-item label="自定义爬取:">
                            <el-switch v-model="advance"></el-switch>
                        </el-form-item>
                        <div v-if="advance">
                            <el-form-item label="主页地址:">
                                <el-input v-model="url"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="getIndex(url)">自动填充</el-button>
                            </el-form-item>
                        </div>
                        <div v-else="advance">
                            <el-form-item label="书名或作者:">
                                <el-input v-model="findStr" class="handle-input mr10"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
                            </el-form-item>
                        </div>
                    </el-form>
                </el-col>
            </el-row>
        </div>
        <div class="container" v-if="!advance">
            <div style="margin: 20px">点击选择小说</div>
            <div>
                <el-button v-for="book in books" class="chapter" :title="book.title" style="margin: 0 10px 0 0" @click="choose(book.url)">{{book.title}}</el-button>
            </div>
        </div>
        <div class="container" v-if="showChapters">
            <div style="margin: 20px">点击选择首章</div>
            <div>
                <el-button v-for="chapter in chapters" class="chapter" :title="chapter.title" style="margin: 0 10px 0 0" @click="setFirstChapter(chapter.url)">{{chapter.title}}</el-button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'SpiderForm',
    data() {
        return {
            form:{
                bookName: '',
                authorName: '',
                firstChapterUrl:'',
                coverUrl:'',
                introduce:'',
                matchRexId: '',
            },
            advance: false,
            rex:[],
            findStr: '',
            books: [],
            image_loading: false,
            url: '',
            chapters:[],
            showChapters: false
        };
    },
    created(){
    	this.getRex();
		if(process.env.NODE_ENV === 'development')
			this.url = "http://www.biquge.tv/2_2491/"
    },
    methods: {
		refresh(){
			this.$axios.get("/admin/rex").then(res => {
				this.rex = res.data;
				this.$message.success("刷新成功！")
			});
		},
        onSubmit() {
			this.$axios.post('/admin/book',this.form).then(res=>{
				this.$message.success("正在爬取！");
                this.reset();
			})
        },
		getRex() {
			this.$axios.get("/admin/rex").then(res => {
				this.rex = res.data;
			});
		},
        reset(){
        	this.form = {
                bookName: '',
                authorName: '',
                firstChapterUrl:'',
                coverUrl:'',
                introduce:'',
                matchRexId: '',
			}
			this.url = '';
            this.chapters = [];
            this.showChapters = false;
        },
        getIndex(url){
		    if (!url)
		        return
            this.image_loading = true
		    let param = {
		        url: url
            }
            this.$axios.post("/spider/index", param).then(res => {
                let data = res.data
                this.form.bookName = data.bookName;
                this.form.authorName = data.authorName;
                this.form.coverUrl = data.coverUrl;
                this.form.introduce = data.introduce;
                this.form.matchRexId = data.matchRexId;
                this.chapters = data.chapters;
                this.showChapters = true;
                this.image_loading = false;
            }).catch(err => {
                this.$message.error("获取失败")
                this.image_loading = false;
            })
        },
        setFirstChapter(firstChapterUrl){
            this.form.firstChapterUrl = firstChapterUrl;
        },
        search(){
		    let data = {
		        name: this.findStr
            }
            this.$axios.post('/spider/search', data).then(res=>{
                this.books = res.data;
                console.log(res.data)
            })
        },
        choose(url){
		    this.getIndex(url);
        }
    },
};
</script>
<style>
    .refresh{
        margin-left: 10px;
    }

    .cover {
        margin: 20% 15%;
        width: 120px;
        height: 150px;
    }
    .image-bg{
        width: 120px;
        height: 150px;
        background-color: #F5F7FA;
    }

    .chapter{
        width: 150px;
        overflow: hidden;
        text-overflow:ellipsis;
        margin: 0;
    }
</style>
