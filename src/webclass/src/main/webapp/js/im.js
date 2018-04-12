//var ws_url = "wss://webclass.qiancloud.com/2d4a66f2";
var ws_url = "ws://10.45.172.100:5000";
var ws = new WebSocket(ws_url);
var version = "Web SDK 1.0";
var ack;
var disconn;
var isInGroup = false;
// im msg jsondata
function imMsg(command, data){
	this.command = command;
	this.data = data;
}
// local user info
function userInfo(uid, name, type, token){
	this.uid = uid;
	this.name = name;
	this.type = type;
	this.token = token;
}
// local group info
function groupInfo(gid, title, usercount, agname, userlist, orgname){
	this.gid = gid;
	this.title = title;
	this.usercount = usercount;
	this.agname = agname;
	this.userlist = userlist;
	this.orgname = orgname;
}
var local_user = new userInfo(null, null, null, null);
var local_group = new groupInfo(null, null, 0, null, [], null);
// msg type enum
var MESSAGE_TYPE = {
	IM_COMMAND_MIN : 2016049,
	
	IM_COMMAND_REGISTER : 2016100,
	IM_COMMAND_UNREGISTER : 2016101,
	IM_COMMAND_REGISTERFORCE : 2016102,
	IM_COMMAND_JOINGROUP : 2016103,
	IM_COMMAND_LEAVEGROUP : 2016104,
	IM_COMMAND_MESSAGE : 2016105,
	IM_COMMAND_GMESSAGE : 2016106,
	IM_COMMAND_ACK : 2016107,
	IM_COMMAND_FETCHAGINFO : 2016108,
	IM_COMMAND_GETOFFLINEMESSAGE : 2016109,
	IM_COMMAND_GETOFFLINEGMESSAGE : 2016110,
	IM_COMMAND_GDATA : 2016111,
	IM_COMMAND_SETTALKSTATUS : 2016112,
	IM_COMMAND_LOCKUSER : 2016113,
	
	IM_COMMAND_ONREGISTER : 2016200,
	IM_COMMAND_ONUNREGISTER : 2016201,
	IM_COMMAND_ONJOINGROUP : 2016202,
	IM_COMMAND_ONLEAVEGROUP : 2016203,
	IM_COMMAND_ONUSERJOINGROUP : 2016204,
	IM_COMMAND_ONUSERLEAVEGROUP : 2016205,
	IM_COMMAND_SERVERNOTIFICATION : 2016206,
	IM_COMMAND_OFFLINEMESSAGE : 2016207,
	IM_COMMAND_OFFLINEGMESSAGE : 2016208,
	IM_COMMAND_GROUPUSERLIST : 2016209,
	IM_COMMAND_ONSETTALKSTATUS : 2016210,
	IM_COMMAND_ONLOCKUSER : 2016211,
	IM_COMMAND_LIMITTALKLIST : 2016212,
	
	IM_COMMAND_MAX : 2016300
};
// error code enum
var ERROR_CODE = {
	RESULT_SUCCESS : 0,				// 成功
	ERR_INVALID : -400,				// 初始化失败
	ERR_SEND_FAIL : -401,			// 发送失败
	ERR_UID_REGISTED : -402,		// uid已被占用
	ERR_UID_RENEW : -403,			// uid已被重新登记
	ERR_CONNECTION_LOST : -404,		// 网络连接中断
	ERR_CONNECTION_CLOSE : -405,	// 网络连接被服务端断开
	ERR_UID_UNFOUND : -406,			// 未找到uid
	ERR_GID_UNFOUND : -407,			// 未找到gid
	ERR_KEY : -408,					// Key错误
	ERR_MAXMEMBER : -409,			// 机构用户超过上限
	ERR_ACK_TIMEOUT : -410,			// 超时，服务端未收到心跳包
	ERR_VERSION : -411,				// 该版本号已过期
	ERR_LIMITTALK : -412,			// 当前处于禁言状态，发送消息对方不会收到
	ERR_OTHER : -413,				// 其他系统错误
}

ws.onopen = function(evt){
	isInGroup = false;
	console.info("ws conn success");
	if (disconn) {
		clearInterval(disconn);
	}
}
ws.onerror = function(evt){
	isInGroup = false;
	console.error("ws error: " + evt);
	if (ack) {
		clearInterval(ack);
	}
};
ws.onclose = function(evt){
	isInGroup = false;
	console.error("ws closed: " + evt);
	if (ack) {
		clearInterval(ack);
	}
	/*disconn = window.setInterval(function(){
		if (!ws || ws.readyState === 3 || ws.onopen == null) {
			ws = new WebSocket(ws_url);
			ws.onopen = wsOpen(e);
			ws.onError = wsError(e);
			ws.onclose = wsClose(e);
			ws.onmessage = wsMessage(e);
		} else if (ws.readyState === 1 && ws.onopen != null) {
			clearInterval(disconn);
		}
		console.info("disconn");
	}, 5000);*/
	// reload
	reload();
};

function sendAck(){
	// /vip scared send ack
	ack = window.setInterval(function(){
		if (ws.readyState === 1) {
			var data = {"token": local_user.token};
			var ack_msg = new imMsg(MESSAGE_TYPE.IM_COMMAND_ACK, data); 
			ws.send(JSON.stringify(ack_msg));
			console.info("send ack success! token: ", local_user.token);
		} else {
			console.error("send ack error! ws'state is not ready, state: ", ws.readyState);
		}
	}, 5000);
}

// JoinGroup 
function JoinGroup(token, title){
	try{
		if (isEmpty(token)) {
			token = local_user.token;
			if (isEmpty(token)) {
				console.error("JoinGroup error! token can not be empty!");
				return ERROR_CODE.ERR_SEND_FAIL;
			}
		}
		var data = {
				"token": token,
				"title" : title,
				"ua" : version,
		}
		var joinGroup = new imMsg(MESSAGE_TYPE.IM_COMMAND_JOINGROUP, data);
		var joinGroupStr = JSON.stringify(joinGroup);
		ws.send(joinGroupStr);
		console.info("send JoinGroup success. data: ", joinGroupStr);
		return ERROR_CODE.RESULT_SUCCESS;
	}catch(e){
		console.error("send JoinGroup error! token: ", token, e);
		return ERROR_CODE.ERR_SEND_FAIL;
	}
}
// OnJoinGroup --> JoinGroup callback
function _OnJoinGroup(errorCode, userList){
	if (errorCode === ERROR_CODE.RESULT_SUCCESS) {
		sendAck();
		if (local_user.type == 2) {
			$("#student-name").html(local_user.name);
		}
		for (var k = 0; k < userList.length; k++) {
			if (userList[k].type == 1) {
				$("#teacher-name").html(userList[k].name);
				showSysMsg(userList[k].name+"进入了教室!");
				// start record
				agoraRecord(true);
				break ;
			}
		}
		isInGroup = true;
	} else {
		console.error("JoinGroup error! errorCode: ", errorCode);
	}
}
// OnUserJoinGroup --> other user join group callback
function _OnUserJoinGroup(errorCode, uid, type, name){
	if (errorCode === ERROR_CODE.RESULT_SUCCESS) {
		if (type == 1) {
			$("#teacher-name").html(name);
			showSysMsg(name+" 进入了教室!")
		}
		// dosomething
		// start record
		agoraRecord(true);
	} else {
		console.error("UserJoinGroup error! errorCode: ", errorCode);
	}
}

// LeaveGroup
function LeaveGroup(token){
	try{
		if (isEmpty(token)) {
			token = local_user.token;
			if (isEmpty(token)) {
				console.error("LeaveGroup error! token can not be empty!");
				return ERROR_CODE.ERR_SEND_FAIL;
			}
		}
		var data = {
			"token" : token,
		}
		var leaveGroup = new imMsg(MESSAGE_TYPE.IM_COMMAND_LEAVEGROUP, data);
		var leaveGroupStr = JSON.stringify(leaveGroup);
		ws.send(leaveGroupStr);
		console.info("send LeaveGroup success. data: ", leaveGroupStr);
		return ERROR_CODE.RESULT_SUCCESS;
	}catch(e){
		console.log("send LeaveGroup error! token: ", token);
		return ERROR_CODE.ERR_SEND_FAIL;
	}
}
// OnLeaveGroup --> LeaveGroup callback
function _OnLeaveGroup(errorCode){
	if (errorCode === ERROR_CODE.RESULT_SUCCESS) {
		// dosomething
		showSysMsg("您已离开教室!");
	} else {
		console.error("LeaveGroup error! errorCode: ", errorCode);
	}
}
// OnUserLeaveGroup --> other user leave group callback
function _OnUserLeaveGroup(errorCode, uid, type, name){
	if (errorCode === ERROR_CODE.RESULT_SUCCESS) {
		// dosomething
		showSysMsg(name+"离开了教室!");
	} else {
		console.error("UserLeaveGroup error! errorCode: ", errorCode);
	}
}

// SendGMessage
function SendGMessage(token, message){
	try{
		if (isEmpty(token)) {
			token = local_user.token;
			if (isEmpty(token)) {
				console.error("SendGMessage error! token can not be empty!");
				return ERROR_CODE.ERR_SEND_FAIL;
			}
		}
		var data = {
				"token" : token,
				"message" : JSON.stringify(message),
		}
		var sendGMessage = new imMsg(MESSAGE_TYPE.IM_COMMAND_GMESSAGE, data);
		var sendGMessageStr = JSON.stringify(sendGMessage);
		ws.send(sendGMessageStr);
		console.info("send Group Message success. data: ", sendGMessageStr);
		return ERROR_CODE.RESULT_SUCCESS;
	}catch(e){
		console.error("send Group Message success error! token: ", token, e);
		return ERROR_CODE.ERR_SEND_FAIL;
	}
}
// OnReceiveGMessage 
function _OnReceiveGMessage(fromid, message){
	// dosomething
	parseData(message);
}

// _OnGroupUserList 
function _OnGroupUserList(errorCode){
	// dosomething
	if (errorCode === ERROR_CODE.RESULT_SUCCESS) {
		
	}
}

// OnServerNotification 
function _OnServerNotification(errorCode){
	if (errorCode == ERROR_CODE.ERR_UID_RENEW) {
		// user sign in in other sapce, your conn disconn
		showSysMsg("您已在其他地方登入!");
		reload();
	} else if (errorCode == ERROR_CODE.ERR_CONNECTION_LOST) {
		// lost conn
		showSysMsg("您已断开连接!");
		reload();
	} else if (errorCode == ERROR_CODE.ERR_LIMITTALK) {
		// limit talk
	} else {
		// dosomething
		console.error("ServerNotification error! errorCode: ", errorCode);
	}
}

// OnSetTalkStatus
function _OnSetTalkStatus(errorCode, uid, status){
	// dosomething
	if (errorCode === ERROR_CODE.RESULT_SUCCESS) {
		if (status == 1) { // limit talk
			
		} else if (status == 0) { // cancel limit talk 
			
		}
	}
}

// onmessage callback
ws.onmessage = function(e) { 
	var imMsg = JSON.parse(e.data);
	console.log(imMsg);
	var command = parseInt(imMsg.command);
	var errorCode = parseInt(imMsg.errorcode);
	if (imMsg.errorcode === null || imMsg.errorcode === "" || imMsg.errorcode === undefined) {
		errorCode = ERROR_CODE.ERR_OTHER;
	}
	var callbackData = imMsg.data;
	switch (command) {
	case MESSAGE_TYPE.IM_COMMAND_ONJOINGROUP:
		var usercount = parseInt(callbackData.usercount);
		var userList = callbackData.userlist;
		var agname = callbackData.agname;
		local_group.usercount = usercount;
		local_group.agname = agname;
		local_group.userlist = userList;
		_OnJoinGroup(errorCode, userList);
		break;
	case MESSAGE_TYPE.IM_COMMAND_ONUSERJOINGROUP:
		var uid = callbackData.uid;
		var utype = callbackData.type;
		var uname = callbackData.name;
		_OnUserJoinGroup(errorCode, uid, utype, uname);
		break;
	case MESSAGE_TYPE.IM_COMMAND_ONLEAVEGROUP:
		_OnLeaveGroup(errorCode);
		break;
	case MESSAGE_TYPE.IM_COMMAND_ONUSERLEAVEGROUP:
		var uid = callbackData.uid;
		var utype = callbackData.type;
		var uname = callbackData.name;
		_OnUserLeaveGroup(errorCode, uid, utype, uname);
		break;
	case MESSAGE_TYPE.IM_COMMAND_GMESSAGE:
		var fromid = callbackData.fromid;
		var message = callbackData.message;
		_OnReceiveGMessage(fromid, message);
		break;
	case MESSAGE_TYPE.IM_COMMAND_GROUPUSERLIST:
		var usercount = parseInt(callbackData.usercount);
		var userList = callbackData.userlist;
		var agname = callbackData.agname;
		local_group.usercount = usercount;
		local_group.agname = agname;
		local_group.userlist = userList;
		_OnGroupUserList(errorCode);
		break;
	case MESSAGE_TYPE.IM_COMMAND_SERVERNOTIFICATION:
		_OnServerNotification(errorCode);
		break;
	case MESSAGE_TYPE.IM_COMMAND_ONSETTALKSTATUS:
		var uid = callbackData.uid;
		var status = callbackData.status;
		_OnSetTalkStatus(errorCode, uid, status);
		break;

	default:
		break;
	}
};
