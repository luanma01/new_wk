<template>
    <el-container id="whiteboard">
        <el-container direction="vertical" class="wb-main">
            <el-row type="flex" justify="end" class="row-offset">
                <el-button-group>
                    <el-button size="mini" round>刷新</el-button>
                    <el-button size="mini" round>适页</el-button>
                    <el-button size="mini" round>备注</el-button>
                </el-button-group>
            </el-row>

            <el-row type="flex" justify="center" class="wb-content">
                <pic-wb></pic-wb>
            </el-row>

            <el-row type="flex" justify="end" class="row-offset">
                <el-button size="mini" round>1/12</el-button>
            </el-row>
        </el-container>

        <el-aside width="60px">
            <div class="btn-wrap">
                <el-button-group class="file-ctrl">
                    <el-button size="mini" class="icon-ICon-05"></el-button>
                    <el-button size="mini" class="icon-ICon-06"></el-button>
                </el-button-group>

                <el-button-group class="tool-ctrl">
                    <el-button size="mini" class="icon-ICon-07"></el-button>
                    <el-button size="mini" class="icon-ICon-08"></el-button>
                    <el-button size="mini" class="icon-ICon-10"></el-button>
                    <el-button size="mini" class="icon-ICon-09"></el-button>
                    <el-button size="mini" class="icon-ICon-17"></el-button>
                    <el-button size="mini" class="icon-ICon-12"></el-button>
                </el-button-group>
            </div>
        </el-aside>
    </el-container>
</template>

<script>
    import PicWb from './children/PicWb'
    export default {
        name: "Whiteboard",
        components: { PicWb },
        data(){
            return{
                msg: 'this is whiteboard'
            }
        }
    }
</script>

<style scoped>

    #whiteboard{
        border:1px solid salmon;

        padding: 5px;
        border-radius: 10px;
        /* background-color:grey; */
    }
    .wb-main{
        background:burlywood;
        padding: 10px 0;
        /* justify-content: space-between; */
    }
    .wb-main .row-offset{
        padding-right: 10px;
    }
    .wb-content{
        /* background:cadetblue; */
    }
    .btn-wrap{
        width: 30px;
    }

</style>