if (!AgoraRTC.checkSystemRequirements()) {
	layer.alert("Your browser is no support WebRTC! Please try to use Chrome 58+ or Firefox 56+ etc.</br>" +
  		"您当前使用的浏览器不支持web端上课,请更换 Chrome58+ 或 FireFox 56+ 重新尝试!");
} else {
	var client, channelkey, localStream, camera, microphone;
	var audioSource = $("#microphone-device");
	var videoSource = $("#camera-device");
	// AgoraRTC.Logger.setLogLevel(AgoraRTC.Logger.NONE);
	AgoraRTC.Logger.setLogLevel(AgoraRTC.Logger.ERROR);
	// AgoraRTC.Logger.setLogLevel(AgoraRTC.Logger.WARNING);
	// AgoraRTC.Logger.setLogLevel(AgoraRTC.Logger.INFO);  
	// AgoraRTC.Logger.setLogLevel(AgoraRTC.Logger.DEBUG);
	// get system audio and video devices
	getDevices();
	// create client
	client = AgoraRTC.createClient({mode: 'interop'});
	// join channel
	$("#join").click(function(){
		// get channelKey
		var channel = $("#channel").val();
		var channelKeyUrl = "/webclass/agoraAuth/getChannelKey5";
		var uid = parseInt($("#uid").val());
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
					console.log("Failed to get Channel key!");
					return ;
				} 
				console.log(channelkey);
				
				// init client
				var appId = $("#key").val();
				client.init(appId, function() {
					console.log("client initialized successfully, appId: " + appId);
					// join channel
					client.join(channelkey, channel, uid, function(uid) {
						console.log("client" + uid + "joined channel successfully");
						// create localStream
						camera = videoSource.val();
						microphone = audioSource.val();
						localStream = AgoraRTC.createStream({
							streamID : uid,
							cameraId : camera,
							microphoneId : microphone,
							audio : true,
							video : true,
							screen : false
						});
						localStream.setVideoProfile('240p_3');

						// The user has granted access to the camera and microphone.
				        localStream.on("accessAllowed", function() {
				          console.log("camera and microphone accessAllowed!");
				        });

				        // The user has denied access to the camera and microphone.
				        localStream.on("accessDenied", function() {
				          console.log("camera and microphone accessDenied!");
				        });

						// init localStream
						localStream.init(function() {
							console.log("getUserMedia successfully");
							localStream.play('teacher-source');
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
					}, function(err) {
						console.log("client join failed ", err);
						//error handling
					});
				}, function(err) {
					console.log("client init failed ", err);
				});
			}
		});
	})
	
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
		stream.play('student-source');
	});
	client.on('stream-removed', function(evt) {
		var stream = evt.stream;
		stream.stop();
		$('#student-source').remove();
		console.log("Remote stream is removed "+ stream.getId());
	});
	client.on('peer-leave', function(evt) {
		var stream = evt.stream;
		if (stream) {
			stream.stop();
			$('#student-source').remove();
			console.log(evt.uid+ " leaved from this channel");
		}
	});
	
	
	function getDevices() {
		AgoraRTC.getDevices(function(devices) {
			$("#microphone-device").html("");
			$("#speaker-device").html("");
			$("#camera-device").html("");
			for (var i = 0; i < devices.length; i++) {
				/*var device = devices[i];
				if (device.kind === 'audioinput') {
					$("#speaker-device").append('<option value='+device.deviceId+'>'+device.label+'</option>')
				} else if (device.kind === 'videoinput') {
					$("#camera-device").append('<option value='+device.deviceId+'>'+device.label+'</option>')
				} else {
					console.log('Some other kind of source/device: ', device);
				}*/
				var device = devices[i];
				var d_id = device.deviceId;
				var d_name = device.label;
				if (device.kind === 'audioinput') {
					if (d_name == null || d_name == "" || d_name == undefined) {
						d_name = "microphone "+i;
	 				}
					$("#microphone-device").append('<option value='+d_id+'>'+d_name+'</option>');
				} else if (device.kind === 'audiooutput') {
					if (d_name == null || d_name == "" || d_name == undefined) {
						d_name = "speaker "+i;
					}
					$("#speaker-device").append('<option value='+d_id+'>'+d_name+'</option>');
				} else if (device.kind === 'videoinput') {
					if (d_name == null || d_name == "" || d_name == undefined) {
						d_name = "camera "+i;
					}
					$("#camera-device").append('<option value='+d_id+'>'+d_name+'</option>');
				} 
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
}
