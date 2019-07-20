<template>
    <div id="main">
        <div class="in">
            <p>书名：</p>
            <label><input type="text" v-model="data.bookName" id="bookName"></label>
        </div>
        <div class="in">
            <p>作者：</p>
            <label><input type="text" v-model="data.author" id="author"></label>
        </div>
        <div class="in">
            <p>编号：</p>
            <label><input type="text" v-model="data.bookNumber" id="bookNumber"></label>
        </div>
        <div class="in">
            <p>第一章：</p>
            <label><input type="text" v-model="data.firstPage" id="firstPage"></label>
        </div>
        <div class="in">
            <p>最终章：</p>
            <label><input type="text" v-model="data.finalPage" id="finalPage"></label>
        </div>

        <div class="in">
            <button type="button" @click="startGet">开始爬取</button>
        </div>
    </div>
</template>

<script>
	export default {
		name: 'Admin',
        data () {
			return {
				data: {
					bookName: '',
					author: '',
					bookNumber: '',
					firstPage: '',
					finalPage: ''
                }
            }
        },
        methods: {
			startGet(){
                let data = this.data
                this.data = {
					bookName: '',
					author: '',
					bookNumber: '',
					firstPage: '',
					finalPage: ''
				}
				this.$post('down',data).then(res=>{
					console.log(res)
					alert("正在爬取！")
                }).catch(err=>{
					console.log(err)
                })
            }
        }
	}
</script>

<style lang="scss" scoped>

    #main{
        padding-top: 50px;
    }
.in{
    text-align: center;
    padding: 10px 0 10px 0;

    p{
        text-align: left;
        padding-left: 20%;
    }
    input{
        width: 60%;
    }
}
</style>
