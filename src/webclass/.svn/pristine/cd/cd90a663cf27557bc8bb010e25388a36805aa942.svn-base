// get canvas
let $file_box = $("#file-box"),
    $cvs = $("#cvs"),
    $cvs_cache = $("#cvs_cache");


$(function () {
    let bv = IEVersion();
    if (bv >= 0 && bv <= 12) {
        layer.alert("Your browser is no support WebRTC! Please try to use Chrome 58+ or Firefox 56+ etc.</br>" +
            "您当前使用的浏览器不支持web端上课,请更换 Chrome58+ 或 FireFox 56+ 重新尝试!");
        return;
    }
    //
    // initStorage();

    if ($('canvas').get(0).getContext) {

        // 获取url 参数
        let str = location.href;
        let index = str.indexOf('?');
        str = str.substr(index + 10); // '?webclass='
        str = decodeURIComponent(str);

        $.ajax({
            url: "http://10.45.172.102:8088/webclass/main/enterRoom",
            type: "POST",
            dataType: "json",
            data: {"webclass": str},
            error: function (XMLHttpRequest, errorInfo, e) {
                console.error("Failed to get enterRoom data! error: " + errorInfo);
            },
            success: function (resp) {
                console.log(resp);
                if (resp.success) {
                    // local_user
                    local_user.uid = parseInt(resp.data.UserID);
                    local_user.name = resp.data.UserName;
                    local_user.type = parseInt(resp.data.UserType);
                    local_user.token = resp.data.IMToken;
                    // local_group
                    local_group.gid = parseInt(resp.data.RoomInfo.RoomID);
                    local_group.title = resp.data.RoomInfo.RoomName;
                    local_group.orgname = resp.data.GroupID;

                    let room = {};
                    room.id = resp.data.RoomInfo.RoomID;
                    room.name = resp.data.RoomInfo.RoomName;
                    room.time = resp.data.RoomInfo.StartTime + "—" + resp.data.RoomInfo.StopTime;
                    saveData('room',room);


                    let list = state.tfPic.list.concat(resp.data.FileInfo);
                    let itemNum = list.length - 1;
                    let tf = list[itemNum];
                    state.tfPic.list = list;
                    state.tfPic.fileDir = tf.FileDir;


                    (async function(){
                        await JoinGroup(local_user.token, local_group.title);
                        // init agora
                        await agoraInit();
                        await loadImg(tf);
                        await fitScreen();
                        await differentRole(local_user.type);
                        await initLayerGroup();
                    })();

                }
                else {
                    layer.msg(resp.message, {time: 3000});
                }
            },
            complete: function () {
                $(window).resize(() => fitScreen());
            }
        });
    }
    else {
        layer.alert("Your browser is no support canvas! Please try to use Chrome 58+ or Firefox 56+ etc.</br>" +
            "您当前使用的浏览器不支持画笔功能,请更换 Chrome58+ 或 FireFox 56+ 重新尝试!");
        return;
    }


    // 按钮：教材翻页
    $(".page-pre").on("click", e => {
        e.preventDefault();
        tfPicChange('prev');
    });
    $(".page-next").on("click", e => {
        e.preventDefault();
        tfPicChange('next');
    });

    // 弹出层：设置
    $("#sys_setting").on("click", e => {
        let $div = $("#sys_setting_div"),
            $checkbox = $("#isLocked"),
            $switch = $("#sys_setting_div .switch"),
            $switch_fill = $(".switch-fill"),
            $btn_yes = $("#sys_setting_div .btn-yes"),
            $btn_cancel = $("#sys_setting_div .btn-cancel"),
            $btn_test = $("#sys_setting_div .btn-test");
        let video = $("#camera-test").get(0);
        let isOk = false;
        let intervalTimer;

        // check devices
        getLocalDevices();

        // render audio level
        if(localStream)
        {
            function interval(){
                let audioLevel = localStream.getAudioLevel();
                let width = Math.ceil(audioLevel*1000);
                $(".micro-go").stop().animate({width:width});
                $(".speaker-go").stop().animate({width:width});
                // console.log(width);
                intervalTimer = setTimeout(interval,500);
            }
            interval();
        }


        if ($div.css('display') === 'none') {
            $div.show();
            isLockedFunc();
            // 帐号锁定开关
            $switch.on("click", e => {
                setTimeout(isLockedFunc);
            });
            // 按钮：‘测试’
            $btn_test.on("click",e=>{
                e.preventDefault();

                agoraInit();
            });
            // 按钮：‘确定’ ‘取消’
            $btn_yes.on("click", e => {
                e.preventDefault();
                $div.hide();
                intervalTimer = null;

/*
                if(isOk){

                }
*/
            });
            $btn_cancel.on("click", e => {
                e.preventDefault();
                $div.hide();
                intervalTimer = null;
            });
        } else {
            $div.hide();
        }

        function isLockedFunc() {
            if ($checkbox.prop('checked')) {
                $switch_fill.stop().animate({width: 56});
                $switch.next().html('帐号已锁定');
            }
            else {
                $switch_fill.stop().animate({width: 24});
                $switch.next().html('帐号未锁定');
            }
        }

        //访问用户媒体设备
        function getUserMedia(constraints, success, error) {
            if (navigator.mediaDevices.getUserMedia) {
                //最新的标准API
                navigator.mediaDevices.getUserMedia(constraints).then(success).catch(error);
            } else if (navigator.webkitGetUserMedia) {
                //webkit核心浏览器
                navigator.webkitGetUserMedia(constraints,success, error)
            } else if (navigator.mozGetUserMedia) {
                //firfox浏览器
                navigator.mozGetUserMedia(constraints, success, error);
            } else if (navigator.getUserMedia) {
                //旧版API
                navigator.getUserMedia(constraints, success, error);
            }
        }

        function success(stream) {
            //兼容webkit核心浏览器
            let CompatibleURL = window.URL || window.webkitURL;
            //将视频流设置为video元素的源
            console.log(stream);

            //video.src = CompatibleURL.createObjectURL(stream);
            video.srcObject = stream;
            video.play();

            //
            $("#camera-test+span").html('已连接摄像头');

            let va = stream.getAudioLevel();
            console.log(va);
            isOk = true;
        }

        function error(error) {
            console.log(`访问用户媒体设备失败${error.name}, ${error.message}`);
        }

        if (navigator.mediaDevices.getUserMedia || navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia) {
            //调用用户媒体设备, 访问摄像头
            getUserMedia({video : true, audio: true}, success, error);
        } else {
            alert('不支持访问用户媒体');
        }

    });

    // 弹出层：选择教材
    $("#select_file").on("click",e=>{
        e.stopPropagation();

        let $div = $("#select_file_div");
        if($div.css('display') === 'none'){
            $div.show();
        }else{
            $div.hide();
        }
        $(document).on("click",e=>{
            $div.hide();
        });

    })

    // 弹出层：上传教材
    $("#upload_file").on("click",e=>{
        let $div = $("#upload_file_div"),
            $labels = $("#upload_file_div label"),
            $btn_yes = $("#upload_file_div .btn-yes"),
            $btn_cancel = $("#upload_file_div .btn-cancel");

        if($div.css('display') === 'none'){
            $div.show();

            // 选择要上传的文件类型
            $labels.on("click",e=>{
                let $ipt_checked = $("#upload_file_div input[type=radio]:checked");
                $ipt_checked.parent().parent().addClass('on').siblings().removeClass('on');
            });

            // 按钮：‘确定’ ‘取消’
            $btn_yes.on("click", e => {
                e.preventDefault();
                $div.hide();
            });
            $btn_cancel.on("click", e => {
                e.preventDefault();
                $div.hide();
            });
        }else{
            $div.hide();
        }
    });

    // 弹出框：备注/教案
    $("#notes").on("click",e=>{
        e.stopPropagation();
        $("#notes_div").show();

        $("#notes_div").on("click",e=>{
            e.stopPropagation();
        });
        $(document).on("click",e=>{
            $("#notes_div").hide();
        });
    });

    // 弹出框：页码
    $("#page_count").on("click", e => {
        let $div = $("#page_count_div"),
            $btn_yes = $("#page_count_div .btn-yes"),
            $btn_cancel = $("#page_count_div .btn-cancel"),
            $ipt_num = $("#turnToNum");

        $ipt_num.val(state.tfPic.pageNum);

        if ($div.css('display') === 'none') {
            $div.show();
            // 按钮：‘跳转’ ‘取消’
            $btn_yes.on("click", e => {
                e.preventDefault();
                let num = $ipt_num.val();
                let tf = state.tfPic.currentItem;
                tf.CurrentPage = num;
                loadImg(tf).then(()=>showOnePageLayer());
                pageTurn(tf);
                $div.hide();

            });
            $btn_cancel.on("click", e => {
                e.preventDefault();
                $div.hide();
            });
        }
        else {
            $div.hide();
        }
    });

});



// prevent reload
$(document).keydown(function(e){
    let keycode = e.keyCode || e.which;
    if(e.ctrlKey && keycode == 82){	// Ctrl + R
        e.preventDefault();
        window.event.returnValue= false;
    }
    if (keycode == 116) {	// F5
        e.preventDefault();
        window.event.returnValue= false;
    }
});
document.oncontextmenu = function(){
    return false;
};
