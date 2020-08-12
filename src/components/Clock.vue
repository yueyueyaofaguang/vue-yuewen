<template>
    <div class="box-container">
        <div class="box">
            <div class="clock">
                <span class="hours" v-bind:style="{transform: 'rotate('+ h +'deg)'}"></span>
                <span class="minutes" v-bind:style="{transform: 'rotate('+ m +'deg)'}"></span>
            </div>
            <div class="date">
                <div id="daymonth">{{`${new Date().getMonth()}月${new Date().getUTCDate()}`}}</div>
                <div id="year">{{new Date().getFullYear()}}</div>
                <p>Let's</p>
                <p>play a game with <span class="strong">time</span></p>
                <p>it runs,we catch it</p>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Clock",
        data(){
            return{
                clock:null,
                h:0,
                m:0
            }
        },
        methods:{
            time(){
                let d = new Date(),
                    s = d.getSeconds() * 6,
                    m = d.getMinutes() * 6 + (s / 60),
                    h = d.getHours() % 12 / 12 * 360 + (m / 12);
                this.h = h;
                this.m  = m;
            }
        },
        created(){
            let _this = this;
            this.clock = setInterval(_this.time, 1000);
            this.time()
        },
        destroy(){
            clearInterval(this.clock);
        }
    }
</script>
<style scoped>
    .box-container{
        background-color: #d83d3d;
        text-align: center;
    }
    .box {
        background:#FFF;
        border-radius:5px;
        display:inline-block;
        margin:6em 0 2em;
        padding:0 20px 20px;
    }

    .date #daymonth {
        color:#454545;
        font-size:2em;
        padding:10px 0;
    }
    .date #year {
        color:#C1C1C1;
        font-size:1.8em;
    }

    .date .strong{
        font-weight: bold;
        font-style: italic;
    }

    .clock {
        background-color:#D75B42;
        border: 0.6em solid white;
        border-radius: 100%;
        height: 10em;
        margin-top:-50%;
        position: relative;
        width: 10em;
    }
    .clock span {
        background: white;
        bottom: 50%;
        display: block;
        left: 50%;
        position: absolute;
        transform-origin: bottom center;
    }
    .clock .hours {
        height: 30%;
        width: 0.2em;
    }
    .clock .minutes {
        height: 45%;
        width: 0.2em;
    }
</style>