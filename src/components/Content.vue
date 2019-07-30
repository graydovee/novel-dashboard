<template>
    <div>
        <div class="chapter" id="chapter">
            <h1 class="title">{{chapter.title}}</h1>
            <div class="content" style="white-space: pre-wrap;">{{chapter.content}}</div>
        </div>
    </div>
</template>

<script>
	export default {
		name: 'Content',
        props: ['chapter'],
	}
</script>

<style scoped>
    #chapter{
        background-color: antiquewhite;
    }
    .title{
        text-align: center;
        padding: 30px 10% 0 10%;
    }
    .content{
        white-space: pre-wrap;
        height: auto;
        overflow: auto;
        padding: 0 10%;
        font-size: 20px;
        line-height: 30px;
    }
</style>
