var client, channelkey, localStream, camera, microphone, local_source, remote_source;
var audioSource = $("#microphone-device");
var videoSource = $("#camera-device");
// AgoraRTC.Logger.setLogLevel(AgoraRTC.Logger.NONE);
AgoraRTC.Logger.setLogLevel(AgoraRTC.Logger.ERROR);
// AgoraRTC.Logger.setLogLevel(AgoraRTC.Logger.WARNING);
// AgoraRTC.Logger.setLogLevel(AgoraRTC.Logger.INFO);  
// AgoraRTC.Logger.setLogLevel(AgoraRTC.Logger.DEBUG);
// get system audio and video devices
// create client

function agoraInit(){
	if (!AgoraRTC.checkSystemRequirements())
	{
		layer.alert("Your browser is no support WebRTC! Please try to use Chrome 58+ or Firefox 56+ etc.</br>" +
	  		"您当前使用的浏览器不支持web端上课,请更换 Chrome58+ 或 FireFox 56+ 重新尝试!");
	}
	else
	{
        client = AgoraRTC.createClient({mode: 'interop'});

		if (local_user.type == 1) {
			local_source = "teacher-source";
			remote_source = "student-source";
		} else if (local_user.type == 2) {
			remote_source = "teacher-source";
			local_source = "student-source";
		}
		getLocalDevices();

		var channel = local_group.gid+"";
		var channelKeyUrl = "/webclass/agoraAuth/getChannelKey5";
		var uid = local_user.uid;
		$.ajax({
			url : channelKeyUrl,
			type : "POST",
			dataType : "json",
			data : { 
				"channel": channel,
				"uid": uid,
			},
			error : function(XMLHttpRequest, errorInfo, e) {
				console.log("Failed to get dynamic key!error: " + errorInfo);
			},
			success : function(response) {
				if (response.Result) {
					channelkey = response.ChannelKey;
				} else {
					console.error("Failed to get Channel key!");
					return ;
				} 
//				console.log("Channel key: "+channelkey);
				
				// init client
				var appId = $("#app-id").val();
				client.init(appId, function() {
//				console.log("client initialized successfully, appId: " + appId);
					// join channel
					client.join(channelkey, channel, uid, function(uid) {
						console.log("client" + uid + "joined channel successfully");
						initLocalStream(uid);
					}, function(err) {
						console.log("client join failed ", err);
						//error handling
					});
				}, function(err) {
					console.log("client init failed ", err);
				});
			}
		});
		
		client.on('error',function(err) {
			console.log("Got error msg:",err.reason);
			if (err.reason === 'DYNAMIC_KEY_TIMEOUT') {
				client.renewChannelKey(channelKey,function() {
					console.log("Renew channel key successfully");
				},function(err) {
					console.log("Renew channel key failed: ",err);
				});
			}
		});
		client.on('stream-added', function(evt) {
			var stream = evt.stream;
			console.log("New stream added: " + stream.getId());
			console.log("Subscribe ", stream);
			client.subscribe(stream, function(err) {
				console.log("Subscribe stream failed", err);
			});
		});
		client.on('stream-subscribed',function(evt) {
			var stream = evt.stream;
			console.log("Subscribe remote stream successfully: "+ stream.getId());
			stream.play(remote_source);
		});
		client.on('stream-removed', function(evt) {
			var stream = evt.stream;
			stream.stop();
			$("#"+remote_source).remove();
			console.log("Remote stream is removed "+ stream.getId());
		});
		client.on('peer-leave', function(evt) {
			var stream = evt.stream;
			if (stream) {
				stream.stop();
				$("#"+remote_source).remove();
				console.log(evt.uid+ " leaved from this channel");
			}
		});
	}	
}


// init localstream
function initLocalStream(uid){
	microphone = audioSource.val();
	camera = videoSource.val();
	if (localStream) {
		console.log(camera);
		console.log(localStream.params.cameraId);
		console.log(microphone);
		console.log(localStream.params.microphoneId);
		if(camera == localStream.params.cameraId && microphone==localStream.params.microphoneId){
			console.log("Device doesn't change.");
			return ;
		}
		client.unpublish(localStream, function(err) {
		    console.error("stream unpublished");
		});
		//localStream.stop();
		// remove div
		$("#student-source").remove();
		console.log("localStream stoped!");
	}
	// create localStream
	localStream = AgoraRTC.createStream({
		streamID : uid,
		cameraId : camera,
		microphoneId : microphone,
		audio : true,
		video : true,
		screen : false
	});
	localStream.setVideoProfile('240p_3');
	// init localStream
	localStream.init(function() {
		console.log("getUserMedia successfully");
		if (!$("#student-source")[0]) {
			// add div
			var html = '<div id="student-source" class="video-src"></div>';
			$(".v2").prepend(html);
		}
		localStream.play(local_source);
		// pubish localStream to server
		client.publish(localStream,function(err) {
			console.log("Publish local stream error: "+ err);
		});
		// published callback
		client.on('stream-published',function(evt) {
			console.log("Publish local stream successfully");
		});
	},function(err) {
		console.log("getUserMedia failed",err);
	});

	// The user has granted access to the camera and microphone.
    localStream.on("accessAllowed", function() {
      console.log("camera and microphone accessAllowed!");
    });

    // The user has denied access to the camera and microphone.
    localStream.on("accessDenied", function() {
      console.log("camera and microphone accessDenied!");
    });
}


//get devices
function getLocalDevices() {
	AgoraRTC.getDevices(function (devices) {
		$("#microphone-device").html("");
		$("#speaker-device").html("");
		$("#camera-device").html("");
		for (var i = 0; i !== devices.length; ++i) {
			var device = devices[i];
			var d_id = device.deviceId;
			var d_name = device.label;
			if (device.kind === 'audioinput') {
				if (d_name == null || d_name == "" || d_name == undefined) {
					d_name = "microphone "+i;
 				}
				if (d_mic_id != undefined) {
					if (d_id == d_mic_id) {
						$("#microphone-device").append('<option selected="selected" value='+d_id+'>'+d_name+'</option>');
					} else {
						$("#microphone-device").append('<option value='+d_id+'>'+d_name+'</option>');
					}
				} else {
					$("#microphone-device").append('<option selected="selected" value='+d_id+'>'+d_name+'</option>');
				}
			}
			else if (device.kind === 'audiooutput') {
				if (d_name == null || d_name == "" || d_name == undefined) {
					d_name = "speaker "+i;
				}
				if (d_sp_id != undefined) {
					if (d_id == d_sp_id) {
						$("#speaker-device").append('<option selected="selected" value='+d_id+'>'+d_name+'</option>');
					} else {
						$("#speaker-device").append('<option value='+d_id+'>'+d_name+'</option>');
					}
				} else {
					$("#speaker-device").append('<option selected="selected" value='+d_id+'>'+d_name+'</option>');
				}
			}
			else if (device.kind === 'videoinput') {
				if (d_name == null || d_name == "" || d_name == undefined) {
					d_name = "camera "+i;
				}
				if (d_cam_id != undefined) {
					if (d_id == d_cam_id) {
						$("#camera-device").append('<option selected="selected" value='+d_id+'>'+d_name+'</option>');
					} else {
						$("#camera-device").append('<option value='+d_id+'>'+d_name+'</option>');
					}
				} else {
					$("#camera-device").append('<option selected="selected" value='+d_id+'>'+d_name+'</option>');
				}
			} /*else {
				console.log('Some other kind of source/device: ', device);
			}*/
		}
		var mic_len = $("#microphone-device option").length;
		if (mic_len < 1) {
			$("#microphone-device").append('<option value="microphone_0">未检测到相关麦克风设备</option>')
		}
		var sp_len = $("#speaker-device option").length;
		if (sp_len < 1) {
			$("#speaker-device").append("<option value='speaker_0'>未检测到相关扬声器设备</option>");
		}
		var cm_len = $("#camera-device option").length;
		if (cm_len < 1) {
			$("#camera-device").append("<option value='camera_0'>未检测到相关摄像头设备</option>");
		}
	});
}

function(){

}
