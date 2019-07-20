<template>
    <div>
        <h1 class="title">章节目录</h1>
        <h2 class="title">{{book.name}}</h2>
        <div id="list">
            <ul>
                <li v-for="chapter in chapters" :key="chapter.id" @click="read(chapter.id)">{{chapter.title}}</li>
            </ul>
        </div>
    </div>
</template>

<script>
	export default {
		name: 'List',
        data () {
			return {
				book: {},
                chapters: {}
            }
        },
        methods: {
            getChapterList(){
                this.$get('all_chapter?bookId='+this.book.id).then(res => {
                    this.chapters = res.data
                })
            },
			read(id){
                this.book.firstChapter = id
				this.$store.commit('setBook',this.book)
                localStorage.removeItem(this.book.id.toString())
				this.$router.push({name: 'chapter'})
            }
        },
        created () {
			this.book = this.$store.state.book
            if(this.book)
                this.getChapterList()
		}
	}
</script>

<style lang="scss" scoped>
    .title{
        text-align: center;
        margin: 20px 0;
    }
    #list{
        padding: 0 10%;

        ul{
            list-style: none;

            li{
                padding: 1%;
            }
        }
    }
</style>
