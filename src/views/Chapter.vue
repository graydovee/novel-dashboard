<template>
    <div>
        <bookContent v-for="chapter in chapters" :key="chapter.id" :chapter="chapter"></bookContent>
        <div @click="getNextPage" id="nextPage">
            <p>
                点击获取下一章
            </p>
        </div>
    </div>
</template>

<script>
    import bookContent from '@/components/Content'

	export default {
		name: 'Chapter',
        data () {
			return {
				book:{},
                chapters:[],

            }
        },
        methods: {
            getFirstPage(){
				let data = this.getStore()
                if(this.book  && this.book.firstChapter){
                    if(data && confirm("检测到您已阅读至"+data.title+"\n是否继续阅读？"))
                        this.getPage(data.id)
					else
						this.getPage(this.book.firstChapter)
                } else {
					this.getPage(data.id)
                }
            },
            getPage(id){
                let data = {
					firstChapter: id
                }
				this.$post("first_page",data).then(res => {
					let data = res.data
					this.chapters = [];
					this.chapters.push(data)

					this.store(data)
				})
            },
			getNextPage() {
				let data = this.getStore()
				if(data){
					this.$post('next_page',data).then(res=>{
						let data = res.data
						this.chapters.push(data)
						this.store(data)
					}).catch(res=>{
						console.log(res)
                    })
				}
			},
            store(data){
				let store = {
					thisPage : data.thisPage,
					nextPage : data.nextPage,
					bookId: data.bookId,
					id: data.id,
					title: data.title
				}
				let bookId = this.getBookId()

                if(!(bookId>0))
                    return

				localStorage.setItem(bookId.toString(),JSON.stringify(store))
            },
            getStore(){
                let localBook = localStorage.getItem(this.getBookId().toString())
				if(localBook){
                    return JSON.parse(localBook)
				}
                return null;
            },
            getBookId(){
                if(this.book){
                    return parseInt(this.book.id)
                } else if(this.chapters.length>0){
                    return parseInt(this.chapters.bookId)
                }
                return 0;
            }
        },
		components: {
			bookContent,
        },
        created () {
			this.book = this.$store.state.book
			this.getFirstPage()
		}
	}
</script>

<style lang="scss" scoped>
    #nextPage{
        width: 100%;
        height: 50vh;
        border: 0;
        background-color: antiquewhite;

        p{
            font-size: 30px;
            text-align: center;
        }
    }
</style>
