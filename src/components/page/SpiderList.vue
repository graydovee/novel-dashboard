<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 基础表格
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button
                        type="primary"
                        icon="el-icon-refresh"
                        @click="refresh"
                >刷新</el-button>
            </div>
            <el-table
                :data="tableData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
            >
                <el-table-column prop="id" label="ID" width="70" align="center"></el-table-column>
                <el-table-column prop="book.name" label="书名"></el-table-column>
                <el-table-column prop="url" label="爬虫位置"></el-table-column>
                <el-table-column prop="matchRex.name" label="匹配规则"></el-table-column>
                <el-table-column label="状态" align="center" width="70">
                    <template slot-scope="scope">
                        <el-tag
                                :type="scope.row.finished===false?'success':'danger'"
                        >{{scope.row.finished===false?'连载':'完结'}}</el-tag>
                    </template>
                </el-table-column>

                <el-table-column prop="createTime" label="开始时间"></el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            @click="handleEdit(scope.$index, scope.row)"
                        >编辑</el-button>
                        <el-button
                            type="text"
                            icon="el-icon-delete"
                            class="red"
                            @click="handleDelete(scope.$index, scope.row)"
                            v-if="!scope.row.finished"
                        >停更</el-button>
                        <el-button
                                type="text"
                                icon="el-icon-lx-global"
                                class="green"
                                @click="handleRefresh(scope.$index, scope.row)"
                                v-if="scope.row.finished"
                        >追更</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <div class="pagination">
                <el-pagination
                        background
                        layout="total, prev, pager, next"
                        :current-page.sync="query.index"
                        :page-size="query.size"
                        :total="totalElements"
                        @current-change="getData"
                ></el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="70px">
                <el-form-item label="id">
                    <el-input v-model="form.id" disabled="false" style="width: 30%"></el-input>
                    <el-button type="success" style="margin-left: 10%" @click="update">更新</el-button>
                </el-form-item>
                <el-form-item label="爬虫位置">
                    <el-input v-model="form.url"></el-input>
                </el-form-item>
                <el-form-item label="规则">
                    <el-select v-model="form.matchRexId" placeholder="请选择">
                        <el-option v-for="item in rex" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button
                            type="primary"
                            icon="el-icon-refresh"
                            class="refresh"
                            @click="refresh"
                    >刷新</el-button>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'spiderList',
    data() {
        return {
            tableData: [],
            query: {
                index: 1,
                size: 10
            },
            totalElements: 0,
            editVisible: false,
            form: {
            	id: 0,
                url: '',
                matchRexId: '',
            },
            rex:{},
        };
    },
    created() {
        this.getData();
    },
    methods: {
        // 获取数据
        getData() {
            let data = {
                index: this.query.index - 1,
                size: this.query.size
            }
        	this.$axios.get('/admin/spider_info', data).then(res=>{
                let page = res.data.data;
                this.tableData = page.content;
                this.totalElements = page.totalElements;
            })
        },
		refresh(){
            let data = {
                index: this.query.index - 1,
                size: this.query.size
            }
            this.$axios.get('/admin/spider_info', data).then(res=>{
                let page = res.data.data;
                this.tableData = page.content;
                this.totalElements = page.totalElements;
                this.$message.success("刷新成功！")
            })
        },
		update(){
			this.$confirm('确定要立刻更新吗？', '提示', {
				type: 'warning'
			})
			.then(() => {
				this.$axios.post('/admin/update?id='+this.form.id).then(res=>{
					if(res.data.code===200){
						this.$message.success('操作成功');
						this.getData();
					}else{
						this.$message.error('服务器繁忙');
					}
				}).catch(res=>{
					this.$message.error('服务器繁忙');
				})
			})
			.catch(() => {});
        },
        // 删除操作
        handleDelete(index, row) {
            // 二次确认删除
            this.$confirm('确定要停止吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    this.$axios.delete('/admin/spider_info?id='+row.id).then(res=>{
                    	if(res.data.code===200){
                    		this.$message.success('操作成功');
                    		this.getData();
                        }else{
                    		this.$message.error('数据异常');
                        }
                    }).catch(res=>{
						this.$message.error('服务器繁忙');
                    })
                })
                .catch(() => {});
        },
		handleRefresh(index, row) {
			// 二次确认删除
			this.$confirm('确定要继续更新吗？', '提示', {
				type: 'warning'
			})
			.then(() => {
				let data = {
					id: row.id,
                    refresh: 1
                }
				this.$axios.delete('/admin/spider_info', data).then(res=>{
					if(res.data.code===200){
						this.$message.success('操作成功');
						this.getData();
					}else{
						this.$message.error('数据异常');
					}
				}).catch(res=>{
					this.$message.error('服务器繁忙');
				})
			})
			.catch(() => {});
		},
        // 编辑操作
        handleEdit(index, row) {
			this.getRex();
            this.form = {
            	id: row.id,
                matchRexId: row.matchRex.id,
                url: row.url
            };
            this.editVisible = true;
        },
        // 保存编辑
        saveEdit() {
        	this.$axios.put('/admin/spider_info',this.form).then(res=>{
        		if(res.data.code===200){
					this.editVisible = false;
					this.getData();
					this.$message.success("保存成功");
                }else{
        			this.$message.error('数据异常');
                }
            }).catch(err=>{
				this.$message.error('服务器繁忙');
            })
        },
		getRex() {
			this.$axios.get("/admin/rex").then(res => {
				this.rex = res.data.data;
			});
		}
    }
};
</script>

<style scoped>
.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 120px;
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
.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}
.green{
    color: rgb(103,194,58);
}

</style>
