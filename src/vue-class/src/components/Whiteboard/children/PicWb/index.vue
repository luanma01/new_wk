<template>
    <div id="picwb">
        <el-carousel trigger="click" height="300px"  :autoplay="false" indicator-position="none">
            <el-carousel-item v-for="(item,key) in picSrc" :key="key">
                <el-row type="flex" justify="center" align="center" class="pic-wrap">
                    <img :src="item" width="100%">
                </el-row>
            </el-carousel-item>
            <canvas width="600px" height="300px"></canvas>
        </el-carousel>
    </div>
</template>

<script>
    export default{
        name: 'PicWb',
        data(){
            return{
                picSrc: ['http://pic.58pic.com/58pic/14/21/42/32U58PICj6I_1024.jpg',
                'http://img3.imgtn.bdimg.com/it/u=2044554116,207873343&fm=200&gp=0.jpg']
            }
        }
    }
</script>

<style scoped>
    #picwb{
        /* background:#bfabe0; */
        width: 100%;
    }
    .pic-wrap{
        padding:0 60px;
        
    }
    canvas{
        /* background:#fbd0f1; */
        position: absolute;
        left:0;
        right:0;
        margin:0 auto;
        z-index: 10;
    }
</style>

