<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 小说列表
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button
                        type="primary"
                        icon="el-icon-refresh"
                        class="mr10"
                        @click="refresh"
                >刷新</el-button>
                <el-input v-model="findStr" placeholder="书名或作者名" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>
            <el-table
                :data="book"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
            >
                <el-table-column prop="id" label="ID" width="100" align="center"></el-table-column>
                <el-table-column prop="name" label="书名"></el-table-column>
                <el-table-column prop="author.name" label="作者"></el-table-column>
                <el-table-column prop="createTime" label="爬取时间"></el-table-column>

                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                                type="text"
                                icon="el-icon-lx-sort"
                                class="green"
                                @click="handleEdit(scope.$index, scope.row)"
                        >章节</el-button>
                        <el-button
                            type="text"
                            icon="el-icon-delete"
                            class="red"
                            @click="handleDelete(scope.$index, scope.row)"
                        >删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <!-- 章节出框 -->
        <el-dialog title="章节列表" :visible.sync="editVisible" width="50%">
            <el-table
                    :data="chapter.content"
                    border
                    class="table"
                    ref="multipleTable"
                    header-cell-class-name="table-header"
            >
                <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
                <el-table-column prop="title" label="标题"></el-table-column>
                <el-table-column prop="createTime" label="爬取时间"></el-table-column>
            </el-table>
            <p class="visit">访问量：{{visit}}</p>
            <div class="pagination">
                <el-pagination
                        background
                        layout="total, prev, pager, next"
                        :current-page="query.pageIndex"
                        :page-size="query.pageSize"
                        :total="chapter.totalElements"
                        @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </el-dialog>

    </div>
</template>

<script>
export default {
    name: 'novelList',
    data() {
        return {
			query: {
				bookId: 0,
				pageIndex: 1,
				pageSize: 5
			},
            chapter:{
				content:{},
				totalElements: 0,
				totalPages:0
            },
            book:[],
            editVisible: false,
            findStr:'',
            form:{},
            visit:0,
        };
    },
    created() {
        this.getData();
    },
    methods: {
        // 获取 easy-mock 的模拟数据
        getData() {
            this.$axios.get("/book").then(res => {
                this.book = res.data.data;
            });
        },
        refresh(){
			this.$axios.get("/book").then(res => {
				this.book = res.data.data;
				this.$message.success("刷新成功！")
			});
        },
        // 触发搜索按钮
        handleSearch() {
            this.$set(this.query, 'pageIndex', 1);
            this.getData();
        },
        // 删除操作
        handleDelete(index, row) {
            // 二次确认删除
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
            .then(() => {
                this.$axios.delete('/admin/book?id=' + row.id).then(res=>{
					this.$message.success('删除成功');
					this.getData();
                }).catch(err=>{
					this.$message.error('删除失败');
                })
            })
            .catch(() => {});
        },
		// 打开章节列表操作
		handleEdit(index, row) {
			this.form = row;
			this.editVisible = true;
			this.getChapter(row.id);
			this.getVisit(row.id);
		},
        getVisit(book_id){
			this.$axios.get('/visit?bookId='+book_id).then(res=>{
				this.visit = res.data.data;
            });
        },
        getChapter(id){
        	if(id)
        	    this.query.bookId = id;

        	let data = {
        		bookId: this.query.bookId,
				pageIndex: this.query.pageIndex - 1,
                pageSize: this.query.pageSize
            }
        	this.$axios.get('/chapter',data).then(res=>{
        		console.log(res.data);
        		this.chapter = res.data.data;
            })
        },
		// 分页导航
		handlePageChange(val) {
			this.$set(this.query, 'pageIndex', val);
			this.getChapter();
		}
    }
};
</script>

<style scoped>
.handle-box {
    margin-bottom: 20px;
}

.handle-input {
    width: 300px;
    display: inline-block;
}
.table {
    width: 100%;
    font-size: 14px;
}
.red {
    color: #ff0000;
}
.mr10 {
    margin-right: 10px;
}

.green{
    color: rgb(103,194,58);
}
.visit{
    padding: 20px 20px 0 20px;
}
</style>
