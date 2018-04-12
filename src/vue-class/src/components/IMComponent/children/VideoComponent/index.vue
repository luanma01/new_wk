<template>
    <div class="video-pannel">
        <div class="vd-source"></div>
        <div class="vd-info">
            <div class="vd-ctrl">
                <span>{{userName}}</span>
                <el-button type="text" size="mini" class="icon-ICon-19"></el-button>
                <el-button type="text" size="mini" class="icon-ICon-20"></el-button>
            </div>
            <el-button type="text" size="mini" class="icon-ICon-31">{{priseNum}}</el-button>
        </div>
    </div>
</template>

<script>
    export default{
        name: 'VideoComponent',
        data(){
            return{
                userName: '未连接',
                priseNum: '00',
            }
        }
    }
</script>

<style scoped>
    .video-pannel{
        border:1px solid yellowgreen;

        border-radius: 10px;
        overflow: hidden;
        width: 340px;
        height: 255px;
        position: relative;
    }
    .vd-source{
        height: 100%;
        background-image: url('./outline.png');
        background-size: contain;
    }
    .vd-info{
        display:flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        position: absolute;
        bottom: 0;
    }
</style>

