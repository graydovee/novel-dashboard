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
                        @click="getData"
                >刷新</el-button>
            </div>
            <el-table
                :data="tableData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
            >
                <el-table-column prop="id" label="ID" width="100" align="center"></el-table-column>
                <el-table-column prop="username" label="用户名"></el-table-column>
                <el-table-column label="身份" align="center">
                    <template slot-scope="scope">
                        <el-tag
                                v-for="au in scope.row.authorities"
                                :type="au.name==='ROLE_USER'?'success':(au.name==='ROLE_ROOT'?'danger':'')"
                        >{{au.name | role}}</el-tag>
                    </template>
                </el-table-column>

                <el-table-column prop="createTime" label="注册时间">
                </el-table-column>

                <el-table-column label="状态" align="center" width="70px">
                    <template slot-scope="scope">
                        <el-tag
                                :type="scope.row.deleted===false?'success':'danger'"
                        >{{scope.row.deleted===false?'启用':'封停'}}</el-tag>
                    </template>
                </el-table-column>

                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            @click="handleEdit(scope.$index, scope.row)"
                        >修改</el-button>
                        <el-button
                                type="text"
                                icon="el-icon-edit"
                                class="yellow"
                                @click="handleRole(scope.$index, scope.row)"
                        >权限</el-button>
                        <el-button
                                type="text"
                                icon="el-icon-lx-people"
                                class="green"
                                @click="handleRefresh(scope.$index, scope.row)"
                                v-if="scope.row.deleted && !isme(scope.row)"
                        >启用</el-button>
                        <el-button
                            type="text"
                            icon="el-icon-delete"
                            class="red"
                            @click="handleDelete(scope.$index, scope.row)"
                            v-if="!scope.row.deleted && !isme(scope.row)"
                        >停用</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <div class="add-user">
                <el-button
                        type="primary"
                        @click="handleAdd()"
                >新增用户</el-button>
            </div>

        </div>
        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="70px">
                <el-form-item label="用户名">
                    <el-input v-model="form.username"></el-input>
                </el-form-item>
                <el-form-item label="密码">
                    <el-input type="password" v-model="form.password"></el-input>
                </el-form-item>
                <el-form-item label="确认密码">
                    <el-input type="password" v-model="confirm"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 新增用户弹出框 -->
        <el-dialog title="新增用户" :visible.sync="addVisible" width="30%">
            <el-form ref="form" :model="form" label-width="70px">
                <el-form-item label="用户名">
                    <el-input v-model="form.username"></el-input>
                </el-form-item>
                <el-form-item label="密码">
                    <el-input type="password" v-model="form.password"></el-input>
                </el-form-item>
                <el-form-item label="确认密码">
                    <el-input type="password" v-model="confirm"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addVisible = false">取 消</el-button>
                <el-button type="primary" @click="addUser">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 权限弹出框 -->
        <el-dialog title="权限" :visible.sync="roleVisible" width="30%">
            <el-form ref="form" :model="form" label-width="70px">
                <el-form-item label="用户名">
                    <el-input v-model="form.username" disabled="false"></el-input>
                </el-form-item>
                <el-form-item label="新增角色">
                    <el-select v-model="roleId" placeholder="请选择">
                        <el-option v-if="noRole(item.name, form.authorities)" v-for="item in roleData" :key="item.id" :label="item.name | role" :value="item.id"></el-option>
                    </el-select>
                    <el-button
                            type="primary"
                            icon="el-icon-refresh"
                            class="refresh"
                            @click="getRoles"
                    >刷新</el-button>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="roleVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveRole">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'userList',
    data() {
        return {
            tableData: [],
            roleData:[],
            editVisible: false,
            addVisible:false,
            roleVisible:false,
            roleId: null,
            form: {},
            confirm:'',
        };
    },
    created() {
        this.getData();
        this.getRoles();
    },
	filters:{
    	role(role){
    		if(role==='ROLE_USER'){
    			return '管理员';
            }else if(role==='ROLE_ROOT'){
    			return '用户管理员';
            }else{
    			return ''
            }
        }
    },
    methods: {
        // 获取数据
        getRoles(){
			this.$axios.get('/root/role').then(res=>{
				this.roleData = res.data;
			})
        },
        getData() {
            this.$axios.get('/root/user').then(res=>{
				this.tableData = res.data;
            })
        },
        isme(usr){
        	return JSON.parse(localStorage.user_info).user_name === usr.username;
        },
        // 删除操作
        handleDelete(index, row) {
            // 二次确认删除
            this.$confirm('确定要停用吗？', '提示', {
                type: 'warning'
            })
            .then(() => {
            	this.$axios.delete('/root/user?id='+row.id).then(res=>{
					this.$message.success('停用成功');
					this.getData();
                }).catch(err=>{
					this.$message.error('停用失败');
                })
            })
            .catch(() => {});
        },
		handleRefresh(index, row) {
        	let data = {
        		id: row.id
            }
			this.$axios.post('/root/user', data).then(res=>{
				this.$message.success('启用成功');
				this.getData();
			}).catch(err=>{
				this.$message.error('启用失败');
			})
		},

        // 编辑操作
        handleEdit(index, row) {
            this.idx = index;
            this.form = row;
            this.editVisible = true;
        },
        // 保存编辑
        saveEdit() {
            if(this.form.password===this.confirm||(!this.form.password&&!this.confirm)){
            	let data = {
            		id: this.form.id,
                    username: this.form.username,
                    password: this.form.password
                }
				this.$axios.put('/root/user',data).then(res=>{
					if(res.code===200){
						this.editVisible = false;
						this.$message.success('修改成功');
                    }else{
						this.$message.error(res.data.message);
                    }
                }).catch(err=>{
					this.$message.error("服务器繁忙");
                })
            }else{
            	this.$message.error("两次密码不一致");
            }
        },
		// 编辑操作
		handleAdd() {
			this.form = {};
			this.addVisible = true;
		},
        addUser(){
			if(this.form.password && this.confirm && this.form.password===this.confirm ){
				let data = {
					username: this.form.username,
					password: this.form.password
				}
				this.$axios.post('/root/register',data).then(res=>{
					if(res.code===200){
						this.$message.success('新增用户成功');
						this.getData();
						this.addVisible = false;
					}else{
						this.$message.error(res.data.message);
					}
				}).catch(err=>{
					this.$message.error("服务器繁忙");
				})
			}else{
				this.$message.error("两次密码不一致");
			}
        },
		handleRole(index, row) {
			this.idx = index;
			this.roleId = '';
			this.form = row;
			this.roleVisible = true;
		},
		// 保存编辑
		saveRole() {
			let data = {
				userId: this.form.id,
				roleId: this.roleId
			}
			this.$axios.put('/root/role',data).then(res=>{
				if(res.code===200){
					this.roleVisible = false;
					this.$message.success('权限修改成功');
					this.getData();
				}else{
					this.$message.error(res.data.message);
				}
			}).catch(err=>{
				this.$message.error("服务器繁忙");
			})
		},
		noRole(name, authorities){
        	for(let i in authorities){
        		if(authorities[i].name===name){
        			return false
                }
            }
        	return true;
        }
    }
};
</script>

<style scoped>
.handle-box {
    margin-bottom: 20px;
}

.add-user{
    text-align: right;
    margin-top: 10px;
}

.table {
    width: 100%;
    font-size: 14px;
}
.red {
    color: #ff0000;
}

.green{
    color: rgb(103,194,58);
}

.yellow{
    color: #cf9236;
}
.refresh{
    margin-left: 10px;
}
</style>
