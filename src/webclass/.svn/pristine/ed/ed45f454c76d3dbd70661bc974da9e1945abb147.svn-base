
// format Date
Date.prototype.formate = function(formate) {
	var date = {
		"M+": this.getMonth() + 1,
		"d+": this.getDate(),
		"h+": this.getHours(),
		"m+": this.getMinutes(),
		"s+": this.getSeconds(),
		"q+": Math.floor((this.getMonth() + 3) / 3),
		"S+": this.getMilliseconds()
	};
	if (/(y+)/i.test(formate)) {
		formate = formate.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
	}
	for (var k in date) {
		if (new RegExp("(" + k + ")").test(formate)) {
			formate = formate.replace(RegExp.$1, RegExp.$1.length == 1
			? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
		}
	}
	return formate;
}
	
// remove Array element
Array.prototype.indexOf = function(val) {
	for (var i = 0; i < this.length; i++) {
		if (this[i] == val)
			return i;
	}
	return -1;
};

Array.prototype.remove = function(val) {
	var index = this.indexOf(val);
	if (index > -1) {
		this.splice(index, 1);
	}
};

// trim String
String.prototype.trim = function() {
	return this.replace(/(^\s*)|(\s*$)/g, "");
}

// empty obj
function isEmpty(obj){
	if (obj == undefined || obj == null) {
		return true;
	}
	if (typeof(obj) == "string") {
		if (obj == "") {
			return true;
		}
		return false;
	}
}

// rgb to #xxxxxx
function zero_fill_hex(num, digits) {
    let s = num.toString(16);
    while (s.length < digits)
        s = "0" + s;
    return s;
}
function rgb2hex(rgb) {
    if (rgb.charAt(0) === '#')
        return rgb;

    let ds = rgb.split(/\D+/);
    let decimal = Number(ds[1]) * 65536 + Number(ds[2]) * 256 + Number(ds[3]);
    return "#" + zero_fill_hex(decimal, 6);
}



/**
 * different role have different interface
 */
async function differentRole(userType){
    /*更新界面数据*/
    let room = getData('room') && getData('room').id ? getData('room') : {id:'000',name:'无',time:'00:00~00:00'},
        teacher = getData('teacher')[0],
        student = getData('student')[0],
        fileList = state.tfPic.list;

    /*更新视图*/
    // roominfo
    $(".room-name").html(room.name);
    $(".room-time").html(room.time);
    $(".room-id").html(room.id);
    // video pannel
    $(".teacher-name").html(teacher.name);
    $(".student-name").html(student.name);
    $(".v1 .prise-count").html(teacher.prise);
    $(".v2 .prise-count").html(student.prise);
    priseColor('teacher',teacher.prise);
    priseColor('student',student.prise);
    // select_file_div
    $("#select_file_div .file-list").html(getFileListHtml());

    switch(userType)
    {
        case 1:
        {
            let userid = getData('student')[0]['id'],
                isMicPlay = getData('isMicPlay'),
                isCameraPlay = getData('isCameraPlay'),
                switchState;

            // 音视频开关
            $(".v2 .audio-btn").on("click",e=>{
                console.log('audio');
                media(userid,'mic','off');
            });
            $(".v2 .video-btn").on("click",e=>{
                console.log('video');
                media(userid,'mic','on');
            });

            // 点赞事件
            $(".v2 .prise-btn").on("click",e=>{
                let count = priseCount('student');
                $(".v2 .prise-count").html(count);
                priseColor('student',count);

                let userid = getData('student')[0]['id'],
                    actoruserid = local_user.uid;
                like(userid,actoruserid);
            });

            break;
        }
        case 2:
        {
            // 适页、备注按钮（隐藏）
            $(".top-fit").hide();
            $(".top-note").hide();
            // 锁定按钮（隐藏）
            $(".tool-lock").hide();
            // 白板（默认锁定）
            lockWhiteboard(true);
            // 点赞事件
            $(".v1 .prise-btn").on("click",e=>{
                let count = priseCount('teacher');
                $(".v1 .prise-count").html(count);
                priseColor('teacher',count);

                let userid = getData('teacher')[0]['id'],
                    actoruserid = local_user.uid;
                like(userid,actoruserid);
            });
            break;
        }
        default:
        {break;}
    }

}

function priseColor(role,count){
    let color = count > 0 ? '#ffe44f' : '#ffffff';
    if(role === 'teacher'){
        $(".v1 .prise-btn").css('color',color);

    }else if(role === 'student'){
        $(".v2 .prise-btn").css('color',color);
    }
}

function priseCount(role){
    let roleList = getData(role),
        count = roleList[0]['prise'];

    ++count;
    roleList[0]['prise'] = count;

    saveData(role,roleList);
    return count;
}

function pushRoleList(role,id,name,prise){
    let roleList,
        roleItem = {id: id,name: name,prise: prise};

    if(!getData(role))
    {
        roleList  = [roleItem];
        saveData(role,roleList);
    }
    else
    {

        roleList = getData(role);
        let i;
        for(i=0;i<roleList.length;i++){
            if(id == roleList[i]['id']){
                break;
            }
        }
        if(i === roleList.length){
            roleList.push(roleItem);
            saveData(role,roleList);
        }
    }

    return roleList;
}

function getFileListHtml(){
    let html = '',
        list = state.tfPic.list;
    for(let i=0;i<list.length;i++){
        let p = list[i],
            fileName = p.FileName,
            isUsingBtn,
            isUsingText;
        if(i === list.length - 1){
            isUsingBtn = ' btn-yes ';
            isUsingText = '已选用';
        }else{
            isUsingBtn = ' ';
            isUsingText = '选用';
        }
        html+=`
            <li class="file-item">
                <span>${fileName}</span>
                <button class="btn btn-cancel ${isUsingBtn}">${isUsingText}</button>
            </li>
        `;
    }
    return html;
}

/**
 * jCanvas layer
 *
 */
function initLayerGroup() {
    return new Promise((resolve, reject) => {
        /*
                let listLen = state.tfPic.list.length,
                    layerGroup = state.layerGroup;

                let rd1 = listLen - layerGroup.length;
                for (let i = 0; i < rd1; i++) layerGroup.push([]);
        */

        let fileDir = state.tfPic.fileDir,
            layerGP = state.layerGroup;

        layerGP[fileDir] = [];


        resolve();
    })
}

function showOnePageLayer() {
    return new Promise((resolve, reject) => {
        $cvs.setLayers({visible: false}).drawLayers();

        let gp_arr = getOnePageLayer();

        for (let gp of gp_arr) {
            $cvs.setLayerGroup(gp, {visible: true}).drawLayers();
        }

        state.layerStep = gp_arr.length - 1;

        resolve();
    })
}

function pushLayer(group) {
    let layerGP = state.layerGroup,
        fileDir = state.tfPic.fileDir,
        step = state.layerStep;

    let layer = layerGP[fileDir];
    let gp_arr = getOnePageLayer();
    let rd = gp_arr.length - 1 - step;

    if(rd > 0){
        let willDel = gp_arr.splice(step+1,rd);

        for(let wd of willDel){
            layer.remove(wd);
        }
    }

    layer.push(group);// group: 'x_xxxxx'

    state.layerStep++;
}

function unDoLayer(whatDo) {
    let gp_arr = getOnePageLayer();
    let step = state.layerStep;

    if (whatDo === 'undo') {
        if (step >= 0) {
            $cvs.setLayerGroup(gp_arr[step], {visible: false}).drawLayers();

            let gp = gp_arr[step];
            let i =gp.indexOf('_');
            let objid = gp.slice(i+1);

            removeObject(objid);

            step--;
        }
    }
    if (whatDo === 'redo') {
        if (step < gp_arr.length - 1) {
            step++;
            $cvs.setLayerGroup(gp_arr[step], {visible: true}).drawLayers();

            // TO DO: im
            let gp = gp_arr[step];
            let i =gp.indexOf('_');
            let objid = gp.slice(i+1);

            let wb = objArr['_'+objid];

            SendGMessage("",{
                "message":{
                    "type":"whiteboard",
                    "whiteboard":wb
                }
            });
        }
    }

    state.layerStep = step;
}

function getOnePageLayer() {
    let fileDir = state.tfPic.fileDir,
        page = state.tfPic.pageNum,
        layerGroup = state.layerGroup;

    let layer = layerGroup[fileDir];
    let gp_arr = [];

    for (let i=0;i<layer.length;i++) {
        let gp = layer[i];
        let gp_pre = gp.split('_')[0];
        if(gp_pre == page) gp_arr.push(gp);
    }

    return gp_arr;
}



/**
 * send message to server after done
 *
 */
// add object
function addObject(shape, color, local_cod, text, objid) {
    let wb_msg;
    let objtype;
    let rct = {};
    let cod = [];
    let domain = state.domain;
    let tf = state.tfPic.currentItem;
    let x_cod = [];
    let y_cod = [];
    let len = local_cod.length;
    let scale = state.tfPic.scale;
    let send_line_width = state.ctx.lineWidth;
    for (let i = 0; i < len; i++) {
        let x = (local_cod[i].x) / scale;
        let y = (local_cod[i].y) / scale;
        cod.push({"x": x, "y": y});
        x_cod.push(x);
        y_cod.push(y);
    }

    x_cod.sort(ascSort);
    y_cod.sort(ascSort);
    let min_x = x_cod[0];
    let max_x = x_cod[len - 1];
    let min_y = y_cod[0];
    let max_y = y_cod[len - 1];
    rct = {
        "top": min_y,
        "left": min_x,
        "right": max_x,
        "bottom": max_y,
    };
    switch (shape) {
        case 'pen': {
            objtype = "pen";
            wb_msg = {
                "message": {
                    "type": "whiteboard",
                    "whiteboard": {
                        "colour": color.replace("#", "0X"),
                        "currentpage": tf.CurrentPage,
                        "docserver": domain,
                        "filedir": tf.FileDir,
                        "fileid": tf.FileID,
                        "filename": tf.FileName,
                        "imageurl": "",
                        "linewidth": send_line_width,
                        "objdata": cod,
                        "objtype": objtype,
                        "objid": objid,
                        "pagenum": tf.PageNums,
                        "pointcount": cod.length,
                        "rect": rct,
                        "sqlid": "",
                        "subcommand": "addobject",
                    }
                }
            };

            break;
        }
        case 'line': {
            objtype = "line";
            // rect
            if (cod[0].x > cod[1].x) {
                if (cod[0].y > cod[1].y) {
                    rct = {
                        "top": max_y,
                        "left": max_x,
                        "right": min_x,
                        "bottom": min_y,
                    }
                } else {
                    rct = {
                        "top": min_y,
                        "left": max_x,
                        "right": min_x,
                        "bottom": max_y,
                    }
                }
            }
            else {
                if (cod[0].y > cod[1].y) {
                    rct = {
                        "top": max_y,
                        "left": min_x,
                        "right": max_x,
                        "bottom": min_y,
                    }
                }
            }

            wb_msg = {
                "message": {
                    "type": "whiteboard",
                    "whiteboard": {
                        "colour": color.replace("#", "0X"),
                        "currentpage": tf.CurrentPage,
                        "docserver": domain,
                        "filedir": tf.FileDir,
                        "fileid": tf.FileID,
                        "filename": tf.FileName,
                        "imageurl": "",
                        "linewidth": send_line_width,
                        "objdata": null,
                        "objtype": "shape",
                        "objid": objid,
                        "pagenum": tf.PageNums,
                        "rect": rct,
                        "shapetype": objtype,
                        "sqlid": "",
                        "subcommand": "addobject",
                    }
                }
            }

            break;
        }
        case 'emptyellipse': {
            objtype = "emptyellipse";
            wb_msg = {
                "message": {
                    "type": "whiteboard",
                    "whiteboard": {
                        "colour": color.replace("#", "0X"),
                        "currentpage": tf.CurrentPage,
                        "docserver": domain,
                        "filedir": tf.FileDir,
                        "fileid": tf.FileID,
                        "filename": tf.FileName,
                        "imageurl": "",
                        "linewidth": send_line_width,
                        "objdata": null,
                        "objtype": "shape",
                        "objid": objid,
                        "pagenum": tf.PageNums,
                        "rect": rct,
                        "shapetype": objtype,
                        "sqlid": "",
                        "subcommand": "addobject",
                    }
                }
            };

            break;
        }
        case 'emptyrect': {
            objtype = "emptyrect";
            wb_msg = {
                "message": {
                    "type": "whiteboard",
                    "whiteboard": {
                        "colour": color.replace("#", "0X"),
                        "currentpage": tf.CurrentPage,
                        "docserver": domain,
                        "filedir": tf.FileDir,
                        "fileid": tf.FileID,
                        "filename": tf.FileName,
                        "imageurl": "",
                        "linewidth": send_line_width,
                        "objdata": null,
                        "objtype": "shape",
                        "objid": objid,
                        "pagenum": tf.PageNums,
                        "rect": rct,
                        "shapetype": objtype,
                        "sqlid": "",
                        "subcommand": "addobject",
                    }
                }
            };

            break;
        }
        case 'text': {
            let fontSize = state.ctx.fontSize;

            objtype = "text";
            wb_msg = {
                "message": {
                    "type": "whiteboard",
                    "whiteboard": {
                        "subcommand": "addobject",
                        "fileid": tf.FileID,
                        "filename": tf.FileName,
                        "filedir": tf.FileDir,
                        "docserver": domain,
                        "sqlid": "",
                        "pagenum": tf.PageNums,
                        "currentpage": tf.CurrentPage,
                        "objtype": objtype,
                        "shapetype": objtype,
                        "objid": objid,
                        "objdata": {
                            "string": text,
                            "colour": color.replace("#", "0X"),
                            "fontlib": state.ctx.fontFamily,
                            "fontsize": fontSize,
                        },
                        "colour": color.replace("#", "0X"),
                        "linewidth": send_line_width,
                        "rect": rct,
                    }
                }
            };

            break;
        }
        default:
            break;
    }
    SendGMessage("", wb_msg);

    return wb_msg.message.whiteboard;
}

// remove object
function removeObject(objid) {
    let tf = state.tfPic.currentItem;

    let wb_msg = {
        "message": {
            "type": "whiteboard",
            "whiteboard": {
                "subcommand": "removeobject",
                "fileid": tf.FileID,
                "filename": tf.FileName,
                "pagenum": tf.PageNums,
                "currentpage": tf.CurrentPage,
                "objid": objid
            }
        }
    };
    SendGMessage("",wb_msg);
}

// pageturn
function pageTurn(tf) {
    let wb_msg = {
        "message": {
            "type": "whiteboard",
            "whiteboard": {
                "subcommand": "pageturn",
                "fileid": tf.FileID,
                "filename": tf.FileName,
                "filedir": tf.FileDir,
                "docserver": state.domain,
                "sqlid": "",
                "pagenum": tf.PageNums,
                "currentpage": tf.CurrentPage,
            }
        }
    }
    SendGMessage("", wb_msg);
}

// remove all
function removeAll(tf) {
    let wb_msg = {
        "message": {
            "type": "whiteboard",
            "whiteboard": {
                "subcommand": "removeall",
                "fileid": tf.FileID,
                "filename": tf.FileName,
                "pagenum": tf.PageNums,
                "currentpage": tf.CurrentPage,
            }
        }
    }
    SendGMessage("", wb_msg);
}

// lock whiteboard
function lock(userId,confirmLock){
    let wb_msg = {
        "message": {
            "type": "whiteboard",
            "whiteboard": {
                "subcommand": "lock",
                "status": confirmLock,
                "userid": userId
            }
        }
    };
    SendGMessage("",wb_msg);
}

// like
function like(userid,actoruserid){
    let mb_msg = {
        "message": {
            "type": "member",
            "subcommand": "like",
            "userid": userid,
            "useracount": '',
            "actoruserid": actoruserid,
            "actoruseracount": ''
        }
    };
    SendGMessage('',mb_msg);
}

// media (mic/camera)
function media(userid,mediaType,switchState){
    let md_msg = {
        "message":{
            "type": "media",
            "subcommand": mediaType,
            "switch": switchState,
            "userid": userid
        }
    };
    SendGMessage('',md_msg)
}

// chat
function sendChatMsg(msg) {
    let fromid = local_user.uid;
    let toid = local_group.gid;
    let chat_msg = {
        "message": {
            "from": fromid,
            "to": toid,
            "type": "chat",
            "authorization": "public",
            "body": {
                "text": msg,
                "time": new Date().formate("hh:mm:ss"),
                "user": local_user.name,
                "user_type": local_user.type,
            }
        }
    };
    SendGMessage("", chat_msg);
}

// show chat msg and sys msg
function showChatMsg(role,user,text,isMe) {
    if(!user) user = role === 'system' ? '系统消息' : $("."+role+"-name").html().trim();
    if(isMe) role = role + ' me';
    let date = new Date().formate("yyyy/MM/dd hh:mm:ss").slice(-8);

    let html = `
            <li class="${role}" >
                <div class="chat-title">
                    <span class="chat-name"> ${user} </span>
                    <span class="chat-time"> ${date} </span>
                </div>
                <div class="chat-msg"> ${text} </div>
            </li>
        `;

    $(".im-current").append(html);
    $(".chat-show").scrollTop($(".im-current")[0].scrollHeight);
}

function lockWhiteboard(bool){
    let className,pointerEv,cursor;
    if(bool){
        className = 'icon-ICon-12';
        pointerEv = 'none';
        // cursor = 'default';
    }else{
        className = 'icon-ICon-18';
        pointerEv = 'auto';
        // cursor = 'cell';
    }
    $(".tool-lock span").removeClass().addClass(className);
    $(".left").css({'pointer-events': pointerEv});
    // $("canvas").css({"cursor": cursor});
}



/**
 * onrecive group message, parse data
 * @param im_data
 */
function parseData(im_data) {
    console.info(im_data);
    // im_data = JSON.parse(toUTF8(im_data, false));
    im_data = JSON.parse(im_data);
    let data = im_data.message;
    let type = data.type;
    switch (type) {
        case "chat":
        {
            let chat_message = data.body;
            let text = chat_message.text;
            text = transText(text);
            let role = chat_message.user_type === 1 ? 'teacher' :
                chat_message.user_type === 2 ? 'student' : 'system';
            let user = chat_message.user;
            let isMe = chat_message.user_type === local_user.type;

            showChatMsg(role,user,text,isMe);

            break;
        }
        case "whiteboard":
        {
            let wb = data.whiteboard;
            if (wb != undefined && wb != "" && wb != null) {
                parseWb(wb);
            }

            break;
        }
        case "member":
        {
            let sbc = data.subcommand;
            if (sbc != undefined && sbc != "" && sbc != null) {
                switch (sbc) {
                    case "like":
                    {
                        let user_id = data.userid;
                        let actor_userid = data.actoruserid;
                        if (user_id == local_user.uid) {
                            switch(local_user.type)
                            {
                                case 1: {
                                    let count = priseCount('teacher');
                                    $(".v1 .prise-count").html(count);
                                    priseColor('teacher',count);

                                    break;
                                }
                                case 2: {
                                    let count = priseCount('student');
                                    $(".v2 .prise-count").html(count);
                                    priseColor('student',count);

                                    break;
                                }
                                default: break;
                            }
                        }
                        break;
                    }
                    default:
                        break;
                }
            }
            break;
        }
        case "timer":
        {
            let sbc = data.subcommand;
            if (sbc == "sync") {
                $("#video-record").attr("src", "/img/record-start.png");
                seconds = data.secondcounts;
                window.setInterval(function () {
                    seconds++;
                    hh = Math.floor(seconds / 60 / 60);
                    mm = Math.floor(seconds / 60 % 60);
                    ss = Math.floor(seconds % 60);
                    if (hh < 10) {
                        hh = "0" + hh;
                    }
                    if (mm < 10) {
                        mm = "0" + mm;
                    }
                    if (ss < 10) {
                        ss = "0" + ss;
                    }
                    let t = hh + ":" + mm + ":" + ss;
                    $(".record-time").html(t);
                }, 1000);
            }
            else if (sbc == "start") {
                $("#video-record").attr("src", "/img/record-start.png");
                seconds = 1;
                window.setInterval(function () {
                    seconds++;
                    hh = Math.floor(seconds / 60 / 60);
                    mm = Math.floor(seconds / 60 % 60);
                    ss = Math.floor(seconds % 60);
                    if (hh < 10) {
                        hh = "0" + hh;
                    }
                    if (mm < 10) {
                        mm = "0" + mm;
                    }
                    if (ss < 10) {
                        ss = "0" + ss;
                    }
                    let t = hh + ":" + mm + ":" + ss;
                    $(".record-time").html(t);
                }, 1000);
            }
            break;

        }
        case "media":
        {
            let sbc = data.subcommand;
            switch(sbc)
            {
                case "mic":{
                    let switchState = data.switch;
                    if(switchState === 'off'){
                        localStream.disableVideo();
                        showChatMsg('system','系统消息',"您已切换至音频通话模式!");
                    }else if(switchState === 'on'){
                        localStream.enableVideo();
                        showChatMsg('system','系统消息',"您已切换至视频通话模式!");
                    }

                    break;
                }
                case "camera":{
                    // localStream.enableVideo();
                    // showChatMsg('system','系统消息',"您已切换至视频通话模式!");
                    break;
                }
                default: break;
            }
            break;
        }
        default:
            break;
    }


}

function parseWb(wb) {
    let cmd = wb.subcommand;
    switch (cmd) {
        case "openfile":
        {
            let tfList = state.tfPic.list;
            let fileId = wb.fileid;
            let flag = false;
            for (let i = 0; i < tfList.length; i++) {
                if (tfList[i].FileID === fileId) {
                    flag = true;
                    break;
                }
            }
            if (!flag) {
                $.ajax({
                    url: "/webclass/main/getFileStatus",
                    type: "POST",
                    dataType: "json",
                    data: {
                        "fileId": wb.fileid,
                        "groupId": local_group.orgname,
                    },
                    error: function (XMLHttpRequest, errorInfo, e) {
                        console.error("Failed to get enterRoom data! error: " + errorInfo);
                    },
                    success: function (resp) {
                        if (resp.success) {
                            (async function(){
                                let tf = {
                                    "FileID": fileId,
                                    "FileName": wb.filename,
                                    "PageNums": wb.pagenum,
                                    "FileDir": wb.filedir,
                                    "CurrentPage": 1,
                                };
                                state.tfPic.list.push(tf);

                                await loadImg(tf);
                                await fitScreen();
                                await differentRole();
                                await initLayerGroup();
                            })();

                        } else {
                            console.error(resp.message);
                        }
                    }
                });
            }
            break;

        }
        case "closefile":
        {
            /*
            let fileId = wb.fileid;
            for (let i = 0; i < tfList.length; i++) {
                if (tfList[i].FileID == fileId) {
                    let tf = tfList[i];
                    tfList.remove(tf);
                    $(".teaching-file-tab ul").children("li[cs-fid='" + tf.FileID + "']").prev().tab("show");
                    $(".teaching-file-tab ul").children("li[cs-fid='" + tf.FileID + "']").remove();
                    break;
                }
            }
            */
            break;

        }
        case "pageturn":
        {
            let fileId = wb.fileid,
                tfList = state.tfPic.list,
                tf;
            for (let i = 0; i < tfList.length; i++) {
                if (tfList[i].FileID === fileId) {
                    tf = tfList[i];
                    tf.CurrentPage = wb.currentpage;
                    break;
                }
            }
            if (tf) {
                loadImg(tf).then(()=>showOnePageLayer());
            }

            break;
        }
        case "removeall":
        {
            $cvs.setLayers({visible: false}).drawLayers();
            state.layerStep = -1;
            break;
        }
        case "addobject":
        {
            let color = "#" + wb.colour.slice(2);
            let lineWidth = wb.linewidth;
            let scale = state.tfPic.scale;
            let objid = wb.objid;
            let page = wb.currentpage;
            let gp = page +'_'+ objid;

            switch (wb.objtype) {
                case "text": {
                    let od = wb.objdata;
                    let content = od.string,
                        fontSize = od.fontsize,
                        fontFamily = od.fontlib,
                        lf = wb.rect.left * scale,
                        tp = wb.rect.top * scale;

                    $cvs.drawText({
                        fillStyle: color,
                        x: lf,
                        y: tp,
                        fontSize: fontSize,
                        fontFamily: fontFamily,
                        text: content,
                        fromCenter: false,
                        layer: true,
                        groups: [gp]
                    });

                    break;
                }
                case "pen": {
                    let od = wb.objdata; //坐标集
                    for (let i = 0; i < od.length - 1; i++) {
                        let x1 = od[i].x * scale,
                            y1 = od[i].y * scale,
                            x2 = od[i + 1].x * scale,
                            y2 = od[i + 1].y * scale;

                        if(wb.colour === 'transparent')
                        {
                            //TO DO: eraser
                        }
                        else
                        {
                            $cvs.drawLine({
                                strokeStyle: color,
                                strokeWidth: lineWidth,
                                rounded: true,
                                x1: x1,
                                y1: y1,
                                x2: x2,
                                y2: y2,
                                layer: true,
                                groups: [gp],
                            });
                        }
                    }

                    break;
                }
                case "shape": {
                    let lf = wb.rect.left * scale,
                        rt = wb.rect.right * scale,
                        tp = wb.rect.top * scale,
                        bt = wb.rect.bottom * scale;

                    let width = rt - lf,
                        height = bt - tp,
                        centerX = lf + width / 2,
                        centerY = tp + height / 2;

                    switch (wb.shapetype) {
                        case "filledrect":
                            break;
                        case "emptyrect": {
                            $cvs.drawRect({
                                strokeStyle: color,
                                strokeWidth: lineWidth,
                                x: centerX,
                                y: centerY,
                                width: width,
                                height: height,
                                layer: true,
                                groups: [gp],
                            });

                            break;
                        }
                        case "filledellipse":
                            break;
                        case "emptyellipse": {
                            $cvs.drawEllipse({
                                strokeStyle: color,
                                strokeWidth: lineWidth,
                                x: centerX,
                                y: centerY,
                                width: width,
                                height: height,
                                layer: true,
                                groups: [gp],
                            });

                            break;
                        }
                        case "line": {
                            $cvs.drawLine({
                                strokeStyle: color,
                                strokeWidth: lineWidth,
                                rounded: true,
                                x1: lf,
                                y1: tp,
                                x2: rt,
                                y2: bt,
                                layer: true,
                                groups: [gp],
                            });

                            break;
                        }

                        default:
                            break;
                    }

                    break;
                }
                default:
                    break;
            }

            pushLayer(gp);
            objArr['_'+objid] = wb;


            break;
        }
        case "removeobject":
        {
            let objid = wb.objid;
            let page = wb.currentpage;
            let gp = page +'_'+ objid;

            $cvs.removeLayerGroup(gp).drawLayers();

            state.layerStep--;

            break;
        }
        case "lock":
        {
            let status = wb.status;
            let sys_message;
            if (status == "true") { // lock whiteboard
                // open --> lock
                lockWhiteboard(true);
                sys_message = "您的白板已被锁定!";
            } else { // open whiteboard
                // lock --> open
                lockWhiteboard(false);
                sys_message = "您的白板已被解锁!";
            }
            showChatMsg('system','系统消息',sys_message);
            break;
        }
        default:
            break;
    }
}


/**
 * utils
 *
 */

// browser version
function IEVersion() {
    let userAgent = navigator.userAgent;
    let isOpera = userAgent.indexOf("Opera") > -1;
    let isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera;
    let isEdge = userAgent.indexOf("Windows NT 6.1; WOW64; Trident/7.0;") > -1 && !isIE;
    let isFF = userAgent.indexOf("Firefox") > -1;
    let isSafari = userAgent.indexOf("Safari") > -1 && userAgent.indexOf("Chrome") == -1;
    let isChrome = userAgent.indexOf("Chrome") > -1 && userAgent.indexOf("Safari") > -1;
    if (isIE) {
        let reIE = new RegExp("MSIE (\\d+\\.\\d+);");
        reIE.test(userAgent);
        let fIEVersion = parseFloat(RegExp["$1"]);
        if (fIEVersion >= 7) {
            return fIEVersion;
        } else {//IE版本过低
            return 0;
        }
    } else if (isEdge) {
        return 12;
    } else if (isSafari) {
        return -2;
    } else {
        return -1;//非IE
    }
}

// reload img
function tfPicChange(dir) {
    let page = state.tfPic.pageNum;
    let tf = state.tfPic.currentItem;

    if (dir === 'next') {
        if (page < tf.PageNums) {
            tf.CurrentPage = ++page;

            loadImg(tf).then(() => showOnePageLayer());

            pageTurn(tf);
        }
    }
    else {
        if (page > 1) {
            tf.CurrentPage = --page;

            loadImg(tf).then(() => showOnePageLayer());

            pageTurn(tf);
        }
    }

}

// load img
function loadImg(tf) {
    return new Promise(function (resolve, reject) {
        let src;
        if (tf && tf.FileDir) {
            if (!tf.CurrentPage) {
                tf.CurrentPage = 1;
            }
            src = state.domain + tf.FileDir + "/" + tf.CurrentPage + ".jpg";

            $("#page_count").html(tf.CurrentPage + '/' + tf.PageNums);


            let itemLen = state.tfPic.list.length;
            let pageLen = tf.PageNums;


            state.tfPic.itemNum = itemLen - 1;
            state.tfPic.currentItem = tf;
            state.tfPic.pageNum = tf.CurrentPage || 1;
            state.tfPic.pageLen = pageLen;

        }
        else {
            src = 'http://eclassdoc1.qiancloud.com/IdHYwoLGnCVXctW/1.jpg';
        }

        $("<img/>").attr("src", src).load(function () {
            // img 原始尺寸
            let realWidth = this.width;
            let realHeight = this.height;

            $("#file-box").css({backgroundImage: 'url(' + src + ')'});

            // 保存状态
            state.tfPic.realWidth = realWidth;
            state.tfPic.realHeight = realHeight;
            resolve({realWidth, realHeight});
        });

    });
}

function fitScreen() {

    return new Promise((resolve, reject) => {
        //HTML 页面根元素自适应
        let whdef = 100 / 1920;// 表示1920的设计图,使用100PX的默认值
        let wH = window.innerHeight;// 当前窗口的高度
        let wW = window.innerWidth;// 当前窗口的宽度
        // if (wW < 1180) {
        //     wW = 1180;// 限制最小宽度
        // }
        let rem = wW * whdef;// 以默认比例值乘以当前窗口宽度,得到该宽度下的相应FONT-SIZE值
        $('html').css('font-size', rem + "px");


        // 处理教材与画布尺寸
        let realWidth = state.tfPic.realWidth;
        let realHeight = state.tfPic.realHeight;

        let cvs = document.getElementById("cvs"),
            cvs_cache = document.getElementById("cvs_cache"),
            $file_area = $(".file-area");

        let area_w = $file_area.css('width').slice(0, -2),
            area_h = $file_area.css('height').slice(0, -2);

        let scale_w = area_w / realWidth,
            scale_h = area_h / realHeight;

        let scale = scale_w - scale_h <= 0 ? scale_w : scale_h;
        let current_w = realWidth * scale,
            current_h = realHeight * scale;

        $("#file-box").css({
            width: current_w,
            height: current_h,
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
        });
        cvs.width = cvs_cache.width = current_w;
        cvs.height = cvs_cache.height = current_h;

        state.tfPic.scale = scale;
        state.tfPic.currentWidth = realWidth;
        state.tfPic.currentHeight = realHeight;

        resolve({scale});
    })
}


// generator objid
function generatorObjectId() {
    let objid = parseInt(Math.random() * 10000) + 10000;
    for (let i = 0; i < objidArr.length; i++) {
        if (objidArr[i] == objid) {
            return generatorObjectId();
        }
    }
    objidArr.push(objid);
    return objid;
}

// asc sort number
function ascSort(a, b) {
    return a - b;
}

// show the sticker
function cut(str, result) {
    let i = str.indexOf("</0");
    if (i < 0) {
        return result;
    }
    let em = str.slice(i, i + 7);
    result.push(em);
    str = str.slice(i + 7);
    return cut(str, result);
}

//distinct array
function distinctArray(array) {
    let r = [];
    for (let i = 0, l = array.length; i < l; i++) {
        for (let j = i + 1; j < l; j++) {
            if (array[i].id == array[j].id) {
                j = ++i;
            }
        }
        r.push(array[i]);
    }
    return r;
}

// slice array by size
function sliceArray(arr, size) {
    let newArr = [];
    for (let i = 0; i < arr.length; i = i + size) {
        if (i >= size) { // just for addobject pen
            newArr.push(arr.slice(i - 1, i + size));
        } else {
            newArr.push(arr.slice(i, i + size));
        }
    }
    return newArr;
}

// pre load
function preLoadImg() {
    let imgArr = [{id: "1_1", src: "http://eclassdoc1.qiancloud.com/IdHYwoLGnCVXctW/1.jpg"}];
    for (let j = 0; j < tfList.length; j++) {
        let tf = teachingFileList[j];
        let pageCount = parseInt(tf.PageNums);
        for (let i = 1; i <= pageCount; i++) {
            imgArr.push(
                {
                    id: tf.FileID + "_" + i,
                    src: domain + tf.FileDir + "/" + i + ".jpg"
                }
            )
        }
    }
    let imgLoadArr = distinctArray(imgArr);
    queue = new createjs.LoadQueue(true);
    queue.on("complete", handleComplete, this);
    queue.loadManifest(imgLoadArr, false);
    queue.load();
}

// complete load
function handleComplete(event) {
    let len;
    try {
        len = event.currentTarget._loadQueueBackup.length;
    } catch (e) {
        console.error("preload img error: " + e);
    } finally {
        //	$('.teaching-file-tab ul li[role="presentation"]:first').trigger('click');
        //layer.closeAll();
        //agoraInit();
        console.info("preload img success: " + len);
    }
}