<template>
    <div>
        <div class="flx">
            <div class="block">
                <span class="demonstration"></span>
                <el-date-picker
                        v-model="timeValue"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                </el-date-picker>
                <el-button type="primary" icon="el-icon-search"  class="query" @click="getVisit">查询</el-button>
            </div>
        </div>
        <schart ref="bar" class="schart" canvasId="bar" :data="visit" type="bar"
                :options="{
                        title: '最近七天每天的用户访问量',
                        showValue: true,
                        fillColor: 'rgb(45, 140, 240)',
                        bottomPadding: 30,
                        topPadding: 30
                        }">
        </schart>
    </div>
</template>

<script>
    import Schart from 'vue-schart';
    export default {
        name: 'Chart',
        data(){
            return {
                visit:[],
                timeValue: [],
                bookId: null,
            }
        },
        methods:{
            dateFormat(fmt, date) {
                if (date) {
                    let ret;
                    let opt = {
                        "Y+": date.getFullYear().toString(),        // 年
                        "m+": (date.getMonth() + 1).toString(),     // 月
                        "d+": date.getDate().toString(),            // 日
                        "H+": date.getHours().toString(),           // 时
                        "M+": date.getMinutes().toString(),         // 分
                        "S+": date.getSeconds().toString()          // 秒
                        // 有其他格式化字符需求可以继续添加，必须转化成字符串
                    };
                    for (let k in opt) {
                        ret = new RegExp("(" + k + ")").exec(fmt);
                        if (ret) {
                            fmt = fmt.replace(ret[1], (ret[1].length === 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
                        }
                    }
                    return fmt;
                }
                return null
            },
            getDate(str){
                str = str.replace(/-/g, '/')
                return new Date(str)
            },
            getVisit() {
                let fmt = 'YYYY/mm/dd'
                if (!this.timeValue[0]) {
                    this.timeValue[0] = new Date();
                    this.timeValue[0].setTime(this.timeValue[0].getTime() - 3600 * 1000 * 24 * 7)
                }

                if (this.timeValue[1]) {
                    if (this.timeValue[0].getTime() >= this.timeValue[1].getTime()) {
                        return
                    }
                } else {
                    this.timeValue[1] = new Date()
                }

                let param = {
                    begin: this.dateFormat(fmt, this.timeValue[0]),
                    end: this.dateFormat(fmt, this.timeValue[1]),
                    bookId: this.bookId
                }
                this.$axios.get('/admin/visit', param).then(res => {
                    let get_data = res.data.data
                    let temp = {}
                    for(let i = 0; i < get_data.length; ++i){
                        temp[get_data[i].date] = get_data[i].visit
                    }
                    let ret = []
                    let date = new Date()
                    date.setTime(this.timeValue[0].getTime())
                    for(; date.getTime() < this.timeValue[1].getTime(); date.setTime(date.getTime() + 3600 * 1000 * 24)){
                        let tag =  this.dateFormat('YYYY-mm-dd', date);
                        ret.push({
                            value: temp[tag] ? temp[tag]: 0,
                            name: tag.replace(/-/g, '/')
                        })
                    }
                    console.log(ret)
                    this.visit = ret
                })
            }
        },
        components: {
            Schart
        },
        props:['id'],
        mounted () {
            this.bookId = this.id
            this.getVisit()
        }
    }
</script>

<style scoped>
    .flx{
        display: flex;
        margin: 10px 0;
    }
    .block{
        margin: 0 20px;
    }
    .schart {
        width: 100%;
        height: 300px;
    }
    .query{
        margin-left: 20px;
    }
</style>
