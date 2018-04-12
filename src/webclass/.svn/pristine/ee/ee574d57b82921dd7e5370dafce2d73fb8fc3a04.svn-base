//var ws_url = "ws://10.204.42.108:8088/ws";
var ws_url = "ws://10.45.172.102:5080";
var ws = new WebSocket(ws_url);
var version = "Web SDK 1.0";
var ack;
var disconn;
var isInGroup = false;
var local_userList = [];
// im msg jsondata
function imMsg(command, data){
	this.command = command;
	this.data = data;
}
// local user info
function userInfo(uid, name, type, orgname, account){
	this.uid = uid;
	this.name = name;
	this.type = type;
	this.orgname = orgname;
	this.account = account;
}
// local group info
function groupInfo(gid, title, orgname, gCode){
	this.gid = gid;
	this.title = title;
	this.orgname = orgname;
	this.gCode = gCode;
}
var local_user = new userInfo(null, null, null, null, null, null);
var local_group = new groupInfo(null, null, null, null);
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

// register 
function Register(uid, name, type, key){
	if (ws.readyState == 1) {
		_extRegister(MESSAGE_TYPE.IM_COMMAND_REGISTER, uid, name, type, key);
	}
}
// force register 
function RegisterForce(uid, name, type, key){
	if (ws.readyState == 1) {
		_extRegister(MESSAGE_TYPE.IM_COMMAND_REGISTERFORCE, uid, name, type, key);
	}
}
// ext-register 
function _extRegister(command, uid, name, type, key){
	try{
		if (typeof(uid) == "number") {
			uid = parseInt(uid);
		} else {
			uid = 0;
		}
		if (typeof(type) == "number") {
			type = parseInt(type);
		} else {
			type = 0;
		}
		var data = {
				"uid" : uid,
				"name" : name,
				"type" : type,
				"key" : key,
				"ua" : version,
		}
		var register = new imMsg(command, data);
		ws.send(JSON.stringify(register));
		console.info("send Register success. data: "+JSON.stringify(data));
		local_user.name = name;
		local_user.type = type;
		return ERROR_CODE.RESULT_SUCCESS;
	}catch(e){
		console.error("send Register error:"+e+", data: "
				+JSON.stringify({
					"uid" : uid,
					"name" : name,
					"type" : type,
					"key" : key,
					"ua" : version,
				})
		);
		return ERROR_CODE.ERR_SEND_FAIL;
	}
}

// OnRegister --> Register callback 
function _OnRegister(errorCode, account){
	if (errorCode === ERROR_CODE.RESULT_SUCCESS) {
		console.log("register success. account: "+account);
		// /vip scared send ack
		ack = window.setInterval(function(){
			if (ws.readyState === 1) {
				var data = {"uid": local_user.uid};
				var ack_msg = new imMsg(MESSAGE_TYPE.IM_COMMAND_ACK, data); 
				ws.send(JSON.stringify(ack_msg));
				console.info("send ack success! uid: "+local_user.uid);
			}
		}, 5000);
		// join group
		JoinGroup(local_group.gid, local_group.title);
	}
}
// UnRegister 
function UnRegister(uid, _OnUnRegister){
	try {
		if (!uid) {
			uid = local_user.uid;
		}
		var data = {
			"uid" : uid,
		}
		var unRegister = new imMsg(MESSAGE_TYPE.IM_COMMAND_UNREGISTER, data);
		ws.send(JSON.stringify(unRegister));
		console.info("send UnRegister success. uid: "+uid);
		return ERROR_CODE.RESULT_SUCCESS;
	} catch (e) {
		console.error("send UnRegister success. uid: "+uid);
		return ERROR_CODE.ERR_SEND_FAIL;
	}
}
// OnUnRegister --> UnRegister callback
function _OnUnRegister(errorCode){
	if (errorCode === ERROR_CODE.RESULT_SUCCESS) {
		
	}
}
// JoinGroup 
function JoinGroup(gid, title){
	try{
		var data = {
				"gid" : gid,
				"title" : title,
		}
		var joinGroup = new imMsg(MESSAGE_TYPE.IM_COMMAND_JOINGROUP, data);
		ws.send(JSON.stringify(joinGroup));
		local_group.title = title;
		console.info("send JoinGroup success. gid: "+gid);
		return ERROR_CODE.RESULT_SUCCESS;
	}catch(e){
		console.error("send JoinGroup error: "+e+", gid: "+gid);
		return ERROR_CODE.ERR_SEND_FAIL;
	}
}
// OnJoinGroup --> JoinGroup callback
function _OnJoinGroup(errorCode, gCode, userList){
	if (errorCode === ERROR_CODE.RESULT_SUCCESS) {
		//console.info("gCode: "+gCode);
		//console.info("userList: "+userList);
		if (local_user.type == 2) {
			$("#student-name").html(local_user.name);
		}
		for (var k = 0; k < userList.length; k++) {
			if (userList[k].type == 1) {
				$("#teacher-name").html(userList[k].name);
				showSysMsg(userList[k].name+"进入了教室!");
				break ;
			}
		}
		isInGroup = true;
		//JoinAgora();
	}
}
// OnGroupUserList --> JoinGroup callback ( > 50 user )
function _OnGroupUserList(gCode, userList){
	// dosomething
}
//OnUserJoinGroup --> other user join group callback
function _OnUserJoinGroup(gCode, account, name, type){
	if (type == 1) {
		$("#teacher-name").html(name);
		showSysMsg(name+" 进入了教室!")
	}
	// dosomething
}
// LeaveGroup
function LeaveGroup(gCode, _OnLeaveGroup, _OnUserLeaveGroup){
	try{
		var data = {
			"gid" : gid,
		}
		var leaveGroup = new imMsg(MESSAGE_TYPE.IM_COMMAND_LEAVEGROUP, data);
		ws.send(JSON.stringify(leaveGroup));
		console.info("send LeaveGroup success. gid: "+gid);
		return ERROR_CODE.RESULT_SUCCESS;
	}catch(e){
		console.log("send LeaveGroup error: "+e+", gid: "+gid);
		return ERROR_CODE.ERR_SEND_FAIL;
	}
}
// OnLeaveGroup --> LeaveGroup callback
function _OnLeaveGroup(errorCode, gCode){
	if (errorCode === ERROR_CODE.RESULT_SUCCESS) {
		
	}
}
// OnUserLeaveGroup --> other user leave group callback
function _OnUserLeaveGroup(gCode, account, name, type){
	// dosomething
}
// SendMessage
function SendMessage(account, data){
	try{
		if (account == null || account == "" || account == undefined) {
			account = local_user.account;
		}
		var fromid = local_user.uid;
		var toid = account.split(":")[0];
		var msg_data = {
				"fromid" : fromid,
				"toid" : toid,
				"data" : data,
		}
		var sendMessage = new imMsg(MESSAGE_TYPE.IM_COMMAND_MESSAGE, msg_data);
		console.info("send 1v1 Message success. account: "+account);
		ws.send(JSON.stringify(sendMessage));
		return ERROR_CODE.RESULT_SUCCESS;
	}catch(e){
		console.error("send 1v1 Message success error: "+e+", account: "+account);
		return ERROR_CODE.ERR_SEND_FAIL;
	}
}
// OnReceiveMessage 
function _OnReceiveMessage(account, name, type, data){
	// dosomething
}
// SendGMessage
function SendGMessage(gCode, data){
	try{
		if (gCode == null || gCode == "" || gCode == undefined) {
			gCode = local_group.gCode;
		}
		var fromid = local_user.uid;
		// var toid = gCode.split("@")[0].slice(3);
		var toid = local_group.gid;
		var msg_data = {
				"fromid" : fromid,
				"toid" : toid,
				"data" : JSON.stringify(data),
		}
		var sendGMessage = new imMsg(MESSAGE_TYPE.IM_COMMAND_GMESSAGE, msg_data);
		console.info("send Group Message success. sendGMessage: "+JSON.stringify(sendGMessage));
		ws.send(JSON.stringify(sendGMessage));
		return ERROR_CODE.RESULT_SUCCESS;
	}catch(e){
		console.error("send Group Message success error: "+e+", gCode: "+gCode);
		return ERROR_CODE.ERR_SEND_FAIL;
	}
}
// OnReceiveGMessage 
function _OnReceiveGMessage(gCode, data){
	// dosomething
	parseData(data);
}

// FetchOfflineMessage 
function FetchOfflineMessage(){
	try{
		var fetchOfflineMessage = new imMsg(MESSAGE_TYPE.IM_COMMAND_GETOFFLINEMESSAGE, {});
		ws.send(JSON.stringify(fetchOfflineMessage));
		return ERROR_CODE.RESULT_SUCCESS;
	}catch(e){
		console.log("FetchOfflineMessage error:" + e);
		return ERROR_CODE.ERR_SEND_FAIL;
	}
}
// OnOfflineMessage --> FetchOfflineMessage callback
function _OnOfflineMessage(account, name, type, data){
	// dosomething
}
// FetchOffineGMessage (string gCode)
function FetchOffineGMessage(gCode){
	try{
		var msg_data = {
				"gCode" : gCode,
		}
		var fetchOffineGMessage = new imMsg(MESSAGE_TYPE.IM_COMMAND_GETOFFLINEGMESSAGE, msg_data);
		ws.send(JSON.stringify(fetchOffineGMessage));
		return ERROR_CODE.RESULT_SUCCESS;
	}catch(e){
		console.log("FetchOffineGMessage error:" + e);
		return ERROR_CODE.ERR_SEND_FAIL;
	}
}
// OnOfflineGMessage --> FetchOffineGMessage callback
function _OnOfflineGMessage(gCode, data){
	// dosomething
}
// OnServerNotification 
function _OnOfflineGMessage(errorCode){
	if (errorCode == ERROR_CODE.ERR_UID_REGISTED_RENEW) {
		// user sign in in other sapce, your conn disconn
	} else if (errorCode == ERROR_CODE.ERR_ACK_TIMEOUT) {
		// > 30s no heart ack
	} else if (errorCode == ERROR_CODE.ERR_LIMITTALK) {
		// limit talk
	} else {
		// dosomething
		
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
	case MESSAGE_TYPE.IM_COMMAND_ONREGISTER:
		// uid:name@GroupName.AgencyName
		var uid = callbackData.uid;
		var agname = callbackData.agname;
		// var orgname = callbackData.orgname;
		var account = uid+":"+local_user.name+"@"+local_user.orgname+"."+agname;
		local_user.uid = uid;
		// local_user.orgname = orgname;
		local_user.account = account;
		_OnRegister(errorCode, account);
		break;
	case MESSAGE_TYPE.IM_COMMAND_ONUNREGISTER:
		var uid = callbackData.uid;
		_OnUnRegister(errorCode);
		break;
	case MESSAGE_TYPE.IM_COMMAND_ONJOINGROUP:
		var gid = callbackData.gid;
		var agname = callbackData.agname;
		// var orgname = callbackData.orgname;
		var usercount = callbackData.usercount;
		local_group.gid = gid;
		var userList = callbackData.userlist;
		local_userList = userList;
		// g:gid@OrgName.AgencyName
		var gCode = "g:"+gid+"@"+local_group.orgname+"."+agname;
		// local_group.orgname = orgname;
		local_group.gCode = gCode;
		_OnJoinGroup(errorCode, gCode, userList);
		break;
	case MESSAGE_TYPE.IM_COMMAND_ONUSERJOINGROUP:
		var gid = callbackData.gid;
		var uid = callbackData.uid;
		var type = callbackData.type;
		var uname = callbackData.name;
		var agname = callbackData.agname;
		// var orgname = callbackData.orgname;
		// g:gid@OrgName.AgencyName
		var gCode = "g:"+gid+"@"+local_group.orgname+"."+agname;
		var account = uid+":"+uname+"@"+local_group.orgname+"."+agname;
		_OnUserJoinGroup(gCode, account, uname, type);
		break;
	case MESSAGE_TYPE.IM_COMMAND_GROUPUSERLIST:
		var gid = callbackData.gid;
		var agname = callbackData.agname;
		var orgname = callbackData.orgname;
		var usercount = callbackData.usercount;
		var userList = callbackData.userList;
		// local_userList = JSON.parse(userList); push all userList into local_userList
		// g:gid@OrgName.AgencyName
		var gCode = "g:"+gid+"@"+orgname+"."+agname;
		_OnGroupUserList(gCode, userList);
		break;
	case MESSAGE_TYPE.IM_COMMAND_ONLEAVEGROUP:
		var gid = callbackData.gid;
		var agname = callbackData.agname;
		var orgname = callbackData.orgname;
		// g:gid@OrgName.AgencyName
		var gCode = "g:"+gid+"@"+orgname+"."+agname;
		_OnLeaveGroup(errorCode, gCode);
		break;
	case MESSAGE_TYPE.IM_COMMAND_ONUSERLEAVEGROUP:
		var gid = callbackData.gid;
		var uid = callbackData.uid;
		var type = callbackData.type;
		var uname = callbackData.uname;
		var agname = callbackData.agname;
		var orgname = callbackData.orgname;
		// g:gid@OrgName.AgencyName
		var gCode = "g:"+gid+"@"+orgname+"."+agname;
		var account = uid+":"+uname+"@"+orgname+"."+agname;
		_OnUserLeaveGroup(gCode, account, name, type);
		break;
	case MESSAGE_TYPE.IM_COMMAND_MESSAGE:
		var fromid = callbackData.fromid;
		var toid = callbackData.toid;
		var data = callbackData.data;
		// local_userList
		_OnReceiveMessage(account, name, type, data);
		break;
	case MESSAGE_TYPE.IM_COMMAND_GMESSAGE:
		var fromid = callbackData.fromid;
		var toid = callbackData.toid;
		var data = callbackData.data;
		// local_group
		_OnReceiveGMessage(gCode, data);
		break;
	case MESSAGE_TYPE.IM_COMMAND_OFFLINEMESSAGE:
		OnOfflineMessage(callbackData.account, callbackData.name, callbackData.type, callbackData.data);
		break;
	case MESSAGE_TYPE.IM_COMMAND_OFFLINEGMESSAGE:
		OnOfflineGMessage(callbackData.gCode, callbackData.data);
		break;

	default:
		break;
	}
};
