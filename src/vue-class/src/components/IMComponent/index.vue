<template>
<el-container id="im">
    <div>
        <div>
            <video-component></video-component>
            <video-component></video-component>
        </div>

        <div>
            <chat-component></chat-component>
        </div>
    </div>
</el-container>
</template>

<script>
    import VideoComponent from './children/VideoComponent'
    import ChatComponent from './children/ChatComponent'
    export default {
        name: "IMComponent",
        components: { VideoComponent, ChatComponent},
        data(){
            return{
                msg: 'this is IM component'
            }
        }
    }
</script>

<style scoped>
    #im{
        border:1px solid sandybrown;
        padding: 5px;
        border-radius: 10px;
    }
</style>