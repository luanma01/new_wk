<template>
    <el-container id="roominfo">
        <img src="@/assets/LOGO.png" alt="LOGO">

        <div class="room-title">
            <span class="icon-08"></span>
            <span class="room-name">{{roomName}}</span> /
            <span class="room-duration">{{roomDuration}}</span> /
            <span class="room-id">教室号：{{roomId}}</span>
        </div>

        <div class="room-controller">
            <el-button type="info" size="mini" round>
                <span>服务器时间：</span>
                <span>{{serverTimer}}</span>
            </el-button>
            <el-button type="info" size="mini" round>
                <span class="icon-ICon-01"></span>
                <span>停止上课</span>
            </el-button>
            <el-button type="info" size="mini" round>
                <span>计时：</span>
                <span>{{roomTimer}}</span>
            </el-button>
            <el-button type="info" size="mini" round>
                <span class="icon-ICon-02"></span>
                <span>设置</span>
            </el-button>
        </div>
    </el-container>
</template>

<script>
    export default {
        name: "Roominfo",
        data(){
            return{
                msg: 'this is roominfo',
                roomName: 'hello',
                roomDuration: '08:30~11:30',
                roomId: 12306,
                serverTimer: '23:59:59',
                roomTimer: '23:59:59',
            }
        }
    }
</script>

<style scoped>
    #roominfo{border:1px solid cadetblue}
    #roominfo, .room-title{
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .room-title{
        color: #0072ff;
    }
</style>