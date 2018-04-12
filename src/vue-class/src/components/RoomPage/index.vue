<template>
    <el-container id="roompage">
        <el-row>
            <roominfo></roominfo>
        </el-row>

            <el-row type="flex" justify="space-between">
                <el-container>
                    <whiteboard></whiteboard>
                </el-container>

                <el-aside width="350px">
                    <IM-component></IM-component>
                </el-aside>
            </el-row>
    </el-container>
</template>

<script>
import Roominfo from '@/components/Roominfo'
import Whiteboard from '@/components/Whiteboard'
import IMComponent from '@/components/IMComponent'

export default {
  name: 'RoomPage',
  components:{ Roominfo, Whiteboard, IMComponent}
}
</script>

<style scoped>
    #roompage{
        font-size:14px;
        display: flex;
        flex-direction: column;
        padding: 10px;
    }
</style>
