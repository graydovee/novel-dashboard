<template>
    <div>
        <h1 class="center" id="title">BOOK</h1>
        <div id="search" class="center">
            <label>
                <input type="text" v-model="name" placeholder="请输入书名"/>
            </label>
            <button type="button" @click="searchBooks">搜索</button>
        </div>
        <div v-if="key!==''">关键词：{{key}}</div>
        <ul id='books'>
            <li v-for="(book,i) in books" :key="book.id"  class="book" :class="{odd:i%2===1,not:i%2===0}">
                <p @click="read(book)" class="name">{{book.name}}</p><p class="chapters" @click="chapterList(book)">章节</p>
            </li>
        </ul>
    </div>
</template>

<script>
	export default {
		name: 'Book',
        data() {
			return {
				books: [],
                name: '',
                key:''
            }
        },
        methods: {
			getAllBooks(){
				this.$get("book").then(res=>{
					this.books=res.data;
                })
            },
            read(book){
				this.$store.commit('setBook',book)
                this.$router.push({name: 'chapter'})
            },
            chapterList(book){
				this.$store.commit('setBook',book)
				this.$router.push({name: 'list'})
            },
            searchBooks(){
				this.key = this.name;
				if(this.key === ''){
					this.getAllBooks();
                } else {
					this.$get("book?name="+this.key).then(res=>{
						this.books = res.data;
					})
                }

            }
        },
        mounted () {
			this.getAllBooks();
		}
	}
</script>

<style scoped>
    #title{
        padding: 50px;
    }
    .center{
         text-align: center;
     }
    #books{
        margin-top: 20px;
    }
    .book{
        margin: 0 20%;
        display: flex;
        font-size: 24px;
        list-style: none;
        border: 1px solid black;
    }
    .name{
        width: 40vw;
        padding: 1% 5%;
    }
    .chapters{
        width: 20vw;
        padding: 1% 5%;
        background-color: cornflowerblue;
        color: white;
    }

    .odd{
        background-color: antiquewhite;
        color: cadetblue;
    }
    .not{
        background-color: cadetblue;
        color: antiquewhite;
    }
</style>
