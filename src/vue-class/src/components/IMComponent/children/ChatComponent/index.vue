<template>
    <div>
        <div>
            <el-tabs type="card" v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="当前消息" name="first">
                    <ul v-for="(item,key) in chatData" :key="key">
                        <li class="teacher">
                            <div class="chat-title">
                                <span class="chat-name">王老师</span>
                                <span class="chat-time">10:52:11</span>
                            </div>
                            <div class="chat-msg">开始上课！！！</div>
                        </li>
                       
                    </ul>
                </el-tab-pane>
                <el-tab-pane label="历史消息" name="second">
                    <ul>
                        <li>当前暂无历史消息</li>
                    </ul>
                </el-tab-pane>
            </el-tabs> 
        </div> 
        <div>
            <div id="editor"></div>
            <div class="editor-ctrl">
                <div>
                    <el-button type="text" size="mini" class="icon-10"></el-button>
                    <el-button type="text" size="mini" class="icon-01"></el-button>
                </div>
                <el-button type="primary" size="mini">发送</el-button>
            </div>
        </div>
    </div>
</template>

<script>
    export default{
        name: 'ChatComponent',
        data(){
            return{
                activeName: 'first',
                chatData: [{},{}]
            }
        }
        
    }
</script>

<style scoped>
    #editor{
        height: 100px;
    }
    .editor-ctrl{
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
</style>

