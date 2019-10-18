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
                    :data="rex"
                    border
                    class="table"
                    ref="multipleTable"
                    header-cell-class-name="table-header"
            >
                <el-table-column prop="id" label="ID" width="100" align="center"></el-table-column>
                <el-table-column prop="name" label="名称"></el-table-column>
                <el-table-column prop="info" label="介绍"></el-table-column>
                <el-table-column prop="contentRex" label="内容匹配规则"></el-table-column>
                <el-table-column prop="titleRex" label="标题匹配规则"></el-table-column>
                <el-table-column prop="nextPageRex" label="下章匹配规则"></el-table-column>
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
                        >删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                        background
                        layout="total, prev, pager, next"
                        :current-page="query.index"
                        :page-size="query.size"
                        :total="totalElements"
                        @current-change="getRex"
                ></el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="100px">
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
                <el-form-item label="下章匹配规则">
                    <el-input v-model="form.nextPageRex"></el-input>
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
		name: 'rexTable',
		data() {
			return {
				rex:[],
				delList: [],
				editVisible: false,
				pageTotal: 0,
				form: {},
				idx: -1,
				id: -1,
                query:{
				    index: 0,
                    size: 10,
                },
                totalElements: 0
			};
		},
		created() {
			this.getRex();
		},
		methods: {
			// 获取数据
			getRex() {
			    let data = {
			        index: this.query.index,
                    size: this.query.size
                }
				this.$axios.get("/admin/rex", data).then(res => {
                    let page = res.data.data;
                    this.rex = page.content;
                    this.totalElements = page.totalElements;
				});
			},
            refresh(){
                let data = {
                    index: this.query.index,
                    size: this.query.size
                }
				this.$axios.get("/admin/rex", data).then(res => {
                    let page = res.data.data;
                    this.rex = page.content;
                    this.totalElements = page.totalElements;
					this.$message.success("刷新成功！")
				});
            },
			// 删除操作
			handleDelete(index, row) {
				// 二次确认删除
				this.$confirm('确定要删除吗？', '提示', {
					type: 'warning'
				})
				.then(() => {
					this.$axios.delete("/admin/rex?id=" + row.id).then(res => {
						this.rex = res.data.data;
						this.$message.success('删除成功');
						this.getRex();
					})
				})
				.catch(() => {});
			},
			// 编辑操作
			handleEdit(index, row) {
				this.idx = index;
				this.form = row;
				this.editVisible = true;
			},
			// 保存编辑
			saveEdit() {
				this.editVisible = false;
                this.$axios.post('/admin/rex',this.form).then(data=>{
                    this.$message.success(`修改成功`);
                    this.getRex();
                }).catch(err=>{
                    this.$message.error('修改失败！');
                })
			},
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
</style>
