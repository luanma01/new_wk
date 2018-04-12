/**
 * 初始化页面交互效果
 */
var itv_register,
	hh = 0,
	mm = 0,
	ss = 0,
	seconds = 0,
	layer_setting_index,
	d_mic_id,
	d_sp_id,
	d_cam_id,
	canvas = document.getElementById("cvs"),
	canvas_cache = document.getElementById("cvs-cache"),
	ctx,
	shape_type,
	shape_color,
	default_color = "#FF354E",
	default_line_width = 1,
	send_line_width = 3,
	default_font_size = "16px",
	default_font_family = "Open Sans",
	SHAPE = {
		POINT : "1",
		LINE : "2",
		CIRCLE : "3",
		RECTANGLE : "4",
		TEXT : "5",
	},
	coordinate = [],
	text_data = {},
	objidArr = [],
	
	domain = $("#domain").val(),
	queue,
	teachingFileList = [],
	uploadFileIds = [],
	empty_teaching_file = {
		"FileID": 1,
		"PageNums": 10,
		"FileName": "空白页",
		"FileDir": "IdHYwoLGnCVXctW",
		"CurrentPage": 1,
	},
	scale,
	div_wd = $(".teaching-file-content").width(),
	div_ht = $(".teaching-file-content").height(),
	teacher_prise = 0,
	student_prise = 0;

$(function(){
	var bv = IEVersion();
	if (bv >= 0 && bv <= 12) {
		layer.alert("Your browser is no support WebRTC! Please try to use Chrome 58+ or Firefox 56+ etc.</br>" +
  		"您当前使用的浏览器不支持web端上课,请更换 Chrome58+ 或 FireFox 56+ 重新尝试!");
		return ;
	}
	if (canvas.getContext){
	  	ctx = canvas.getContext('2d');
	  	ctx_cache = document.getElementById("cvs-cache").getContext('2d');
	  	$.ajax({
			url : "/webclass/main/enterRoom",
			type : "POST",
			dataType : "json",
			data : {"webclass": $("#webclass").val()},
			error : function(XMLHttpRequest, errorInfo, e) {
				console.error("Failed to get enterRoom data! error: " + errorInfo);
			},
			success : function(resp) {
				if (resp.success) {
					$(".room-name").html(resp.data.RoomInfo.RoomName);
					$(".room-time").html(resp.data.RoomInfo.StartTime+"—"+resp.data.RoomInfo.StopTime);
					$(".room-id").html(resp.data.RoomInfo.RoomExID);
					$("#student-name").html(resp.data.UserName);
					// local_user
					local_user.uid = parseInt(resp.data.UserID);
					local_user.name = resp.data.UserName;
					local_user.type = parseInt(resp.data.UserType);
					local_user.token = resp.data.IMToken;
					// local_group
					local_group.gid = parseInt(resp.data.RoomInfo.RoomID);
					local_group.title = resp.data.RoomInfo.RoomName;
					local_group.orgname = resp.data.GroupID;
					// load teaching file
					teachingFileList.push(empty_teaching_file);
					var fileList = resp.data.FileInfo;
					if (fileList && fileList != "" && fileList != null) {
						teachingFileList = teachingFileList.concat(fileList);
					}
					var tflen = teachingFileList.length;
					var tfhtml = "";
					for (var i = 0; i < tflen; i++) {
						var tfile = teachingFileList[i];
						var tname = tfile.FileName;
						if (tname.length > 40) {
							tname = tname.slice(0,40);
						}
						tfhtml += '<li cs-fid="'+tfile.FileID+'" role="presentation"><a>'+tname+'</a></li>';
					}
					$(".teaching-file-tab ul").append(tfhtml);
					preLoadImg();
					JoinGroup(local_user.token, local_group.title);
					/*layer.msg('正在加载...', 
		  				{ icon: 16,
		  				  shade: 0.2,
		  				  time: 0
		  				}
					);*/
					// init agora
					agoraInit();
					// load last img
					var lastTf = teachingFileList[teachingFileList.length-1];
					lastTf.CurrentPage = 1;
					loadImg(lastTf);
				} else {
					layer.msg(resp.message, {time: 3000});
				}
			}
		});
	} else {
		layer.alert("Your browser is no support canvas! Please try to use Chrome 58+ or Firefox 56+ etc.</br>" +
  		"您当前使用的浏览器不支持画笔功能,请更换 Chrome58+ 或 FireFox 56+ 重新尝试!");
		return ;
	}
})

// count record time
/*function recordCount(){
	var cs_val = $("#video-record").attr("cs-recording");
	if (cs_val == 0) {
		// start record
		// turn img and start time 
		$("#video-record").attr("cs-recording", "1");
		$("#video-record").attr("src", "/img/record-pause.png");
		interval = window.setInterval("changeRecordTime()", 1000);
		// start
	} else {
		// pause record
		// turn img and pause time 
		$("#video-record").attr("cs-recording", "0");
		$("#video-record").attr("src", "/img/record-start.png");
		window.clearInterval(interval);
		// pause 
	}
};*/

// show record time
/*function changeRecordTime(){
	$(".record-time").html("");
	seconds++ ;
	hh = Math.floor(seconds/60/60);
    mm = Math.floor(seconds/60%60);
    ss = Math.floor(seconds%60);
    if (hh < 10) {
		hh = "0"+hh;
	}
    if (mm < 10) {
    	mm = "0"+mm;
    }
    if (ss < 10) {
    	ss = "0"+ss;
    }
    var t = hh+":"+mm+":"+ss;
    $(".record-time").html(t);
    //console.info(11);
}*/

$(function(){
	itv_register = window.setInterval(itvReg, 3000);
})


function itvReg(){
	if (isInGroup) {
		showSysMsg("您已进入教室!");
		if (itv_register) {
			clearInterval(itv_register);
			console.log("itv reg removed!");
		}
	} else {
		JoinGroup(local_user.token, local_group.title);
		console.log("itv reg start!");
	}
}
/*$("#sys-setting").on('mouseover', function(){
	$(this).attr("src", "/img/setting-float.png");
});
$("#sys-setting").on('mouseout', function(){
	$(this).attr("src", "/img/setting-default.png");
});*/

// alert setting div
$("#sys-setting").on('click', function(){
	getLocalDevices();
	layer_setting_index = layer.open({
		type: 1,
		title: ['设置', 'font-size:16px; color: blanchedalmond; padding-left: 75px; letter-spacing: 10px;'],
		content: $("#sys-setting-div"),
		shade: 0.2,
		area: ['500px', '400px'],
		skin: 'layui-layer-lan',
		/*shadeClose: true,*/
		cancel: function(index, layero){ 
			layer.close(index);
			$("#sys-setting").attr("src", "/img/setting-default.png");
		}
	});
	$(this).attr("src", "/img/setting-click.png");
	$("#camera-device").trigger('change');
});

// confirm device selection
$("#cfm-check-device").on('click', function(){
	d_mic_id = $("#microphone-device option:selected").val();
	d_sp_id = $("#speaker-device option:selected").val();
	d_cam_id = $("#camera-device option:selected").val();
	layer.close(layer_setting_index);
	initLocalStream(local_user.uid);
});

// reload devices
$("#re-check-device").on('click', function(){
	getLocalDevices();
});

// 
$("#camera-device").on('change', function(){
	navigator.getUserMedia({
		video: true,
		audio: true
	}, function(stream){
		var video = document.getElementById('camera-test');
		if (window.URL) {
			video.src = window.URL.createObjectURL(stream);
		} else {
			video.src = stream;
		}
		video.autoplay = true;
	}, function(){
		console.info("other unknown camera");
	});
})

// tools-pen
$("#pen-selection").on('mouseover', function(){
	$(this).attr("src", "/img/menu/pen-click.png");
});
$("#pen-selection").on('mouseout', function(){
	$(this).attr("src", "/img/menu/pen-default.png");
});
$("ul[aria-labelledby='pen-selection'] li").on('click', function(){
	shape_type = $(this).attr("cs-role");
	if (shape_type == SHAPE.POINT) {
		$("canvas").css("cursor", "url('/img/menu/pen.ico'),crosshair");
	} else {
		$("canvas").css("cursor", "crosshair");
	}
	// console.info(shape_type);
})
// tools-color
$("#color-selection").on('mouseover', function(){
	$(this).attr("src", "/img/menu/color-click.png");
});
$("#color-selection").on('mouseout', function(){
	$(this).attr("src", "/img/menu/color-default.png");
});
$("ul[aria-labelledby='color-selection'] li").on('click', function(){
	shape_color = $(this).attr("cs-role");
	// console.info(shape_color);
})
// tools-removeall
$("#remove-all").on('mouseover', function(){
	$(this).attr("src", "/img/menu/remove-all-click.png");
});
$("#remove-all").on('mouseout', function(){
	$(this).attr("src", "/img/menu/remove-all-default.png");
});
$("#remove-all").on('click', function(){
	layer.confirm('确定清空画板吗?', function(index){
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx_cache.clearRect(0, 0, canvas.width, canvas.height);
		layer.close(index);
	}); 
	shape_type = null;
	// hide and clear text div
	$("#cvs-text").css({
		"display": "none",
		"margin-left": "0",
		"margin-top": "0",
	});
	$("#cvs-text").html("");
	$("canvas").css("cursor", "");
});
// tools-lock
/*$("#lock-whiteboard").on('click', function(){
	var cs_val = $(this).attr("cs-lock");
	if (cs_val == 0) {
		// open --> lock
		$(this).attr("cs-lock", "1");
		$(this).attr("src", "/img/menu/lock-locked.png");
		//$("#cvs").css("cursor", "");
		// send im lock command
	} else {
		// lock --> open
		$(this).attr("cs-lock", "0");
		$(this).attr("src", "/img/menu/lock-open.png");
		// send im open command
	}
})*/









// draw something
$("#cvs").on('mousedown', function(e){
	if (ctx == undefined || ctx == "" || ctx == null) {
		layer.alert("Your browser is no support canvas! Please try to use Chrome 58+ or Firefox 56+ etc.</br>" +
  		"您当前使用的浏览器不支持画笔功能,请更换 Chrome58+ 或 FireFox 56+ 重新尝试!");
		return ;
	}
	var isLocked = $("#lock-whiteboard").attr("cs-lock");
	if (isLocked == "1") {
		shape_type == undefined;
		shape_color == undefined;
		return ;
	}
	if (shape_type == undefined || shape_type == "" || shape_type == null) {
		//shape_type = SHAPE.POINT;
		return ;
	}
	if (shape_color == undefined || shape_color == "" || shape_color == null) {
		shape_color = default_color; // default color
	}

	coordinate = [];
	var cdt = getCoordinate(e, $(this));
	coordinate.push({x: cdt.x, y: cdt.y});
	switch (shape_type) {
	case SHAPE.POINT:
		ctx.beginPath();
		ctx.strokeStyle = shape_color;
		ctx.lineWidth = default_line_width;
		ctx.moveTo(coordinate[0].x, coordinate[0].y);
        $(this).on('mousemove', function(e){
        	// ctx_cache.clearRect(0, 0, canvas.width, canvas.height);
        	ctx.moveTo(coordinate[coordinate.length-1].x, coordinate[coordinate.length-1].y);
        	var cdt_move = getCoordinate(e, $(this));
        	/*if (coordinate.length > 200) {
        		cdt_move = coordinate[199];
        	} else {
        		coordinate.push({x: cdt_move.x, y: cdt_move.y});
        	}*/
        	coordinate.push({x: cdt_move.x, y: cdt_move.y});
    		ctx.lineTo(cdt_move.x, cdt_move.y);
    		ctx.closePath();
    		ctx.stroke();
        })
        $(this).on('mouseout', function(){
        	$(this).unbind('mousemove');
        	if (coordinate.length > 0) {
        		// addobj
        		var cdnLen = coordinate.length;
        		if (cdnLen > 150) {
        			var sliceCdnArray = sliceArray(coordinate, 150);
        			for (var k = 0; k < sliceCdnArray.length; k++) {
        				addObject(shape_type, shape_color, sliceCdnArray[k], "");
        			}
        		} else {
        			addObject(shape_type, shape_color, coordinate, "");
        		}
			}
    		coordinate = [];
        });
		break;
	case SHAPE.LINE:
		// use canvas-cache, when the mouse moving, clear canvas-cache, then draw the shape
		// when mouse up, clear canvas-cache too, at last draw a same shape in canvas
        $(this).on('mousemove', function(e){
        	var coordinate_mv = getCoordinate(e, $(this));
        	ctx_cache.clearRect(0, 0, canvas.width, canvas.height);
        	ctx_cache.beginPath();
        	ctx_cache.strokeStyle = shape_color;
        	ctx_cache.lineWidth = default_line_width;
        	ctx_cache.moveTo(coordinate[0].x, coordinate[0].y);
        	ctx_cache.lineTo(coordinate_mv.x, coordinate_mv.y);
        	ctx_cache.closePath();
        	ctx_cache.stroke();
        })
        $(this).on('mouseout', function(){
        	$(this).unbind('mousemove');
        	ctx_cache.clearRect(0, 0, canvas.width, canvas.height);
        	coordinate = [];
        });
		break;
	case SHAPE.CIRCLE:
		$(this).on('mousemove', function(e){
        	var coordinate_mv = getCoordinate(e, $(this));
        	ctx_cache.clearRect(0, 0, canvas.width, canvas.height);
        	var x_len = Math.abs(coordinate_mv.x - coordinate[0].x)/2;
        	var y_len = Math.abs(coordinate_mv.y - coordinate[0].y)/2;
        	ctx_cache.strokeStyle = shape_color;
        	ctx_cache.lineWidth = default_line_width;
        	if (coordinate_mv.x >= coordinate[0].x) {
				if (coordinate_mv.y >= coordinate[0].y) {
					drawEllipse(ctx_cache, coordinate[0].x+x_len, coordinate[0].y+y_len, x_len, y_len);
				} else {
					drawEllipse(ctx_cache, coordinate[0].x+x_len, coordinate[0].y-y_len, x_len, y_len);
				}
			} else {
				if (coordinate_mv.y >= coordinate[0].y) {
					drawEllipse(ctx_cache, coordinate[0].x-x_len, coordinate[0].y+y_len, x_len, y_len);
				} else {
					drawEllipse(ctx_cache, coordinate[0].x-x_len, coordinate[0].y-y_len, x_len, y_len);
				}
			}
        })
        $(this).on('mouseout', function(){
        	$(this).unbind('mousemove');
        	ctx_cache.clearRect(0, 0, canvas.width, canvas.height);
        	coordinate = [];
        });
		break;
	case SHAPE.RECTANGLE:
		$(this).on('mousemove', function(e){
        	var coordinate_mv = getCoordinate(e, $(this));
        	ctx_cache.clearRect(0, 0, canvas.width, canvas.height);
        	var rect_width = Math.abs(coordinate_mv.x - coordinate[0].x);
        	var rect_height = Math.abs(coordinate_mv.y - coordinate[0].y);
        	ctx_cache.strokeStyle = shape_color;
        	ctx_cache.lineWidth = default_line_width;
        	if (coordinate_mv.x >= coordinate[0].x) {
				if (coordinate_mv.y >= coordinate[0].y) {
					ctx_cache.strokeRect(coordinate[0].x, coordinate[0].y, rect_width, rect_height);
				} else {
					ctx_cache.strokeRect(coordinate[0].x, coordinate_mv.y, rect_width, rect_height);
				}
			} else {
				if (coordinate_mv.y >= coordinate[0].y) {
					ctx_cache.strokeRect(coordinate_mv.x, coordinate[0].y, rect_width, rect_height);
				} else {
					ctx_cache.strokeRect(coordinate_mv.x, coordinate_mv.y, rect_width, rect_height);
				}
			}
        })
        $(this).on('mouseout', function(){
        	$(this).unbind('mousemove');
        	ctx_cache.clearRect(0, 0, canvas.width, canvas.height);
        	coordinate = [];
        });
		break;
	case SHAPE.TEXT:
		// draw text
		var text = $("#cvs-text").html().trim();
		if (text == "" || text == null || text == undefined) {
			return ;
		}
		text = text.replace(/&nbsp;/g, "");
		/*.replace("<div>", "\r").replace("</div>", "")*/
		text = text.replace(/<div>/g, "\r\n");
		text = text.replace(/<br>/g, "");
		text = text.replace(/<\/div>/g, "");
		var text_width = $("#cvs-text").width();
		var text_height = $("#cvs-text").height();
		//ctx.moveTo(coordinate_up.x, coordinate_up.y);
		ctx.fillStyle = shape_color;
    	ctx.lineWidth = default_line_width;
    	ctx.font = text_data.font;
		ctx.fillText(text, text_data.x, text_data.y)
		break;

	default:
		break;
	}
	// hide and clear text div
	$("#cvs-text").css({
		"display": "none",
		"margin-left": "0",
		"margin-top": "0",
	});
	$("#cvs-text").html("");
});

$("#cvs").on('mouseup', function(e){
	var isLocked = $("#lock-whiteboard").attr("cs-lock");
	if (isLocked == "1") {
		shape_type == undefined;
		shape_color == undefined;
		return ;
	}
	if (coordinate.length == 0) {
		return ;
	}
	if (shape_type == undefined || shape_type == "" || shape_type == null) {
		return ;
	}
	if (shape_color == undefined || shape_color == "" || shape_color == null) {
		shape_color = default_color; // default color
	}
	switch (shape_type) {
	case SHAPE.POINT:
		// addobj
		var cdnLen = coordinate.length;
		if (cdnLen > 150) {
			var sliceCdnArray = sliceArray(coordinate, 150);
			for (var k = 0; k < sliceCdnArray.length; k++) {
				addObject(shape_type, shape_color, sliceCdnArray[k], "");
			}
		} else {
			addObject(shape_type, shape_color, coordinate, "");
		}
		break;
	case SHAPE.LINE:
		// when mouse up, clear canvas-cache too, at last draw a same shape in canvas
    	var coordinate_up = getCoordinate(e, $(this));
    	coordinate.push({x: coordinate_up.x, y: coordinate_up.y});
    	ctx_cache.clearRect(0, 0, canvas.width, canvas.height);
    	ctx.beginPath();
		ctx.strokeStyle = shape_color;
		ctx.lineWidth = default_line_width;
    	ctx.moveTo(coordinate[0].x, coordinate[0].y);
    	ctx.lineTo(coordinate_up.x, coordinate_up.y);
    	ctx.closePath();
    	ctx.stroke();
    	// addobj
    	addObject(shape_type, shape_color, coordinate, "");
    	
		break;
	case SHAPE.CIRCLE:
		var coordinate_up = getCoordinate(e, $(this));
		coordinate.push({x: coordinate_up.x, y: coordinate_up.y});
		var x_len = Math.abs(coordinate_up.x - coordinate[0].x)/2;
    	var y_len = Math.abs(coordinate_up.y - coordinate[0].y)/2;
    	ctx.strokeStyle = shape_color;
    	ctx.lineWidth = default_line_width;
    	if (coordinate_up.x >= coordinate[0].x) {
			if (coordinate_up.y >= coordinate[0].y) {
				drawEllipse(ctx, coordinate[0].x+x_len, coordinate[0].y+y_len, x_len, y_len);
			} else {
				drawEllipse(ctx, coordinate[0].x+x_len, coordinate[0].y-y_len, x_len, y_len);
			}
		} else {
			if (coordinate_up.y >= coordinate[0].y) {
				drawEllipse(ctx, coordinate[0].x-x_len, coordinate[0].y+y_len, x_len, y_len);
			} else {
				drawEllipse(ctx, coordinate[0].x-x_len, coordinate[0].y-y_len, x_len, y_len);
			}
		}
    	// addobj
    	addObject(shape_type, shape_color, coordinate, "");
    	
		break;
	case SHAPE.RECTANGLE:
		var coordinate_up = getCoordinate(e, $(this));
    	coordinate.push({x: coordinate_up.x, y: coordinate_up.y});
    	ctx_cache.clearRect(0, 0, canvas.width, canvas.height);
    	var rect_width = Math.abs(coordinate_up.x - coordinate[0].x);
    	var rect_height = Math.abs(coordinate_up.y - coordinate[0].y);
    	ctx.strokeStyle = shape_color;
    	ctx.lineWidth = default_line_width;
    	if (coordinate_up.x >= coordinate[0].x) {
			if (coordinate_up.y >= coordinate[0].y) {
				ctx.strokeRect(coordinate[0].x, coordinate[0].y, rect_width, rect_height);
			} else {
				ctx.strokeRect(coordinate[0].x, coordinate_up.y, rect_width, rect_height);
			}
		} else {
			if (coordinate_up.y >= coordinate[0].y) {
				ctx.strokeRect(coordinate_up.x, coordinate[0].y, rect_width, rect_height);
			} else {
				ctx.strokeRect(coordinate_up.x, coordinate_up.y, rect_width, rect_height);
			}
		}
    	// addobj
    	addObject(shape_type, shape_color, coordinate, "");
    	
		break;
	case SHAPE.TEXT:
		var coordinate_up = getCoordinate(e, $(this));
		// show the text div
		$("#cvs-text").css({
			"display": "block",
			"margin-left": coordinate_up.x+"px",
			"margin-top": coordinate_up.y+"px",
			"color": shape_color,
		});
		// trigger text div focus
		$("#cvs-text").trigger("focus");
		text_data = {
				x: coordinate_up.x,
				y: coordinate_up.y,
				font: default_font_size+" "+default_font_family,
		}
		/*// when the text div blur, draw the txet into canvas
		$("#cvs-text").on('blur', function(){
			var text = $("#cvs-text").html();
			var text_width = $("#cvs-text").width();
			var text_height = $("#cvs-text").height();
			//ctx.moveTo(coordinate_up.x, coordinate_up.y);
			ctx.strokeStyle = shape_color;
	    	ctx.lineWidth = default_line_width;
			ctx.strokeText(text, coordinate_up.x, coordinate_up.y)
		});
		
		$("#cvs-text").unbind('blur');*/
		
		// addobj
    	// addObject(shape_type, shape_color, coordinate, text_data);
		break;

	default:
		break;
	}
	$(this).unbind('mousemove');
	coordinate = [];
});


// http://blog.csdn.net/qq_22944825/article/details/74019674
// get coordinate relative to dom
function getCoordinate(e, $obj){
	var e = e || window.event;
	// get X relative to dom
	var positionX = e.pageX - $obj.offset().left;
	// get X relative to dom
    var positionY = e.pageY - $obj.offset().top;
    // console.info(positionX + ' ' + positionY);
    return {x: positionX, y: positionY};
}

// draw ellipse 
// x,y: ellipse center coordinate 
// a: x length, b: y length
function drawEllipse(ctx, x, y, a, b) {
	ctx.save();
    var r = (a > b) ? a : b;
    var ratioX = a / r;
    var ratioY = b / r;
    ctx.scale(ratioX, ratioY);
    ctx.beginPath();
    ctx.arc(x / ratioX, y / ratioY, r, 0, 2 * Math.PI, false);
    ctx.closePath();
    ctx.restore();
    ctx.stroke();
}

// page turn pre
$(".page-pre").on('click', function(){
	var cur = parseInt($(".page-count samp:first").html());
	var tot = parseInt($(".page-count samp:last").html());
	if (cur == 1) {
		return ;
	} else {
		var tf = getCurrentTF();
		tf.CurrentPage = cur-1;
		loadImg(tf);
		// page turn
		// pageTurn(tf);
	}
});
//page turn next 
$(".page-next").on('click', function(){
	var cur = parseInt($(".page-count samp:first").html());
	var tot = parseInt($(".page-count samp:last").html());
	if (tot == 1 || cur == tot) {
		return ;
	} else {
		var tf = getCurrentTF();
		tf.CurrentPage = cur+1;
		loadImg(tf);
		// page turn
		// pageTurn(tf);
	}
});
//page refresh 
$(".page-refresh").on('click', function(){
	var tf = getCurrentTF();
	loadImg(tf);
	// removeall 
	// removeAll(tf);
});

















// sticker
$("#sticker-selection").on('mouseover', function(){
	$(this).attr('src', '/img/im/sticker-float.png');
})
$("#sticker-selection").on('click', function(){
	$(this).attr('src', '/img/im/sticker-click.png');
})
$("#sticker-selection").on('mouseover', function(){
	$(this).attr('src', '/img/im/sticker-default.png');
})
$(".im-sticker-menu li span").on('click', function(){
	var sk_img = $(this).html();
	var img_no = sk_img.slice(14, 17);
	// console.info(img_no);
	$(".im-text").append(sk_img);
	//$("#im-info").append('&lt;\/'+img_no+'\/&gt;');
})




// constant
$("#constant-selection").on('mouseover', function(){
	$(this).attr('src', '/img/im/constant-float.png');
})
$("#constant-selection").on('click', function(){
	$(this).attr('src', '/img/im/constant-click.png');
})
$("#constant-selection").on('mouseover', function(){
	$(this).attr('src', '/img/im/constant-default.png');
})
$(".im-constant-menu li").on('click', function(){
	var ct = $(this).html();
	if (ct == "" || ct == null || ct == undefined) {
		return ;
	}
	ct = ct.replace(/<span>/g, "");
	ct = ct.replace(/<\/span>/g, "");
	var htm = "";
	var date = new Date().formate("yyyy/MM/dd hh:mm:ss");
	htm += '<p class="im-user-p"><span class="im-user">'+'我'+'</span><span class="im-time">'+date+'</span><br>'+ct+'</p>';
	$(".im-current").append(htm);
	$(".im-current").scrollTop($(".im-current")[0].scrollHeight);
	//$(".im-text").html("");
	sendChatMsg("", ct);
})

// send im-text
$(".im-send").on('click', function(){
	var text_val = $(".im-text").html().trim();
	if (text_val == "" || text_val == null || text_val == undefined) {
		record(true);
		return ;
	}
	text_val = text_val.replace(/<div>/g, "<br>");
	text_val = text_val.replace(/<\/div>/g, "");
	text_val = text_val.replace(/&nbsp;/g, " ");
	var reg = /\<img cs-role\=\"[0-9]{3}\" src\=\"\/img\/im\/sticker\/[0-9]{3}.png\"\>/g;
	var im_text = text_val.replace(reg,
			function(a){
				return "</"+a.slice(14, 17)+"/>";
			});
	im_text = im_text.replace(/<br>/g, "\r\n");
	if(im_text.length > 1000) {
		layer.msg("发送内容最大不能超过1000", {time: 2000});
		return ;
	}
	var htm = "";
	var date = new Date().formate("yyyy/MM/dd hh:mm:ss");
	htm += '<p class="im-user-p"><span class="im-user">'+'我'+'</span><span class="im-time">'+date+'</span><br>'+text_val+'</p>';
	$(".im-current").append(htm);
	$(".im-current").scrollTop($(".im-current")[0].scrollHeight);
	$(".im-text").html("");
	sendChatMsg("", im_text);
	// console.info(im_text);
	
	//RegisterForce(parseInt(text_val), text_val, 2, "asdsadasd");
});

/*$(".im-text").on('input', function(){
	var text_val = $(".im-text").html().trim();
	if (text_val == "" || text_val == null || text_val == undefined) {
		return ;
	}
	text_val = text_val.replace(/<div>/g, " ");
	text_val = text_val.replace(/<\/div>/g, "");
	text_val = text_val.replace(\<img cs-role\=\"[0-9]{3}\" src\=\"\/img\/im\/sticker\/[0-9]{3}.png\"\>, function(a){
		return a.slice(13,16)
	});
	text_val = text_val.replace(/&nbsp;/g, " ");
	$("#im-info").html(text_val);
	//$("#im-info").html("");
	//console.info($("#im-info").html());
	console.info(text_val);
})*/




//gen active teaching file 
function getCurrentTF(){
	var fid = $('.teaching-file-tab ul li[class="active"]').attr("cs-fid");
	for (var i = 0; i < teachingFileList.length; i++) {
		var tf = teachingFileList[i];
		if (tf.FileID == fid) {
			return tf;
		}
	}
}
// load img
function loadImg(tf){
	var img = new Image(); // 设置背景图
	img.addEventListener('load', function() {
		//document.body.appendChild(img);
	    if (tf.CurrentPage == undefined) {
	    	tf.CurrentPage = 1;
	    }
	    var scale_wd = parseInt((div_wd/img.width)*100)/100;
	    var scale_ht = parseInt((div_ht/img.height)*100)/100;
	    if (scale_wd > 1 && scale_ht > 1) {
	    	scale = 1;
	    }else if (scale_wd < scale_ht) {
	    	scale = scale_wd;
	    }else {
	    	scale = scale_ht;
	    }
	    if (scale > 0.80) {
			scale = 0.80;
		}
	    if (tf.FileID == "1") {
	    	scale = 0.55;
	    }
	    $('.teaching-file-tab ul li[cs-fid="'+tf.FileID+'"]').tab('show');
	    img_wd = parseInt(scale * (img.width));
	    img_ht = parseInt(scale * (img.height));
	    $(".teaching-file-content").css({	
	    	"background-image": "url("+img.src+")",
	    	"background-size": img_wd+"px"+" "+img_ht+"px",
	    });
	    $(".page-count samp:first").html(tf.CurrentPage);
	    $(".page-count samp:last").html(tf.PageNums);
	    var spcx = (div_wd-img_wd)/2;
	    var spcy = (div_ht-img_ht)/2;
	    ctx.translate(spcx, spcy);
	    canvas.width = img_wd;
	    canvas.height = img_ht;
	    canvas_cache.width = img_wd;
	    canvas_cache.height = img_ht;
	    $("canvas").css({
	    	"left": spcx,
	    	"top": spcy
	    });
	}, false);
	img.src = domain+tf.FileDir+"/"+tf.CurrentPage+".jpg";
}

// add object
function addObject(shape, color, local_cod, text){
	//console.log(cod.length);
	var wb_msg;
	var objtype;
	var rct = {};
	var cod = [];
	var tf = getCurrentTF();
	var x_cod = [];
	var y_cod = [];
	var len = local_cod.length;
	for (var i = 0; i < len; i++) {
		var x = (local_cod[i].x)/scale;
		var y = (local_cod[i].y)/scale;
		cod.push({"x": x, "y": y});
		x_cod.push(x);
		y_cod.push(y);
	}
	x_cod.sort(ascSort);
	y_cod.sort(ascSort);
	var min_x = x_cod[0];
	var max_x = x_cod[len-1];
	var min_y = y_cod[0];
	var max_y = y_cod[len-1];
	rct = {
		"top": min_y,
		"left": min_x,
		"right": max_x,
		"bottom": max_y,
	}
	switch (shape) {
	case SHAPE.POINT:
		objtype = "pen";
		wb_msg = {
			"message": {
				"type": "whiteboard",
				"whiteboard": {
					"colour": color.replace("#","0X"),
					"currentpage": tf.CurrentPage,
					"docserver": domain,
					"filedir": tf.FileDir,
					"fileid": tf.FileID,
					"filename": tf.FileName,
					"imageurl": "",
					"linewidth": send_line_width,
					"objdata": cod,
					"objtype": objtype,
					"objid": generatorObjectId(),
					"pagenum": tf.PageNums,
					"pointcount": cod.length,
					"rect": rct,
					"sqlid": "",
					"subcommand": "addobject",
				}
			}	
		}
		break;
	case SHAPE.LINE:
		objtype = "line";
		if (cod[0].x > cod[1].x) {
			if (cod[0].y > cod[1].y) {
				rct = {
						"top": max_y,
						"left": max_x,
						"right": min_x,
						"bottom": min_y,
				}
			} else{
				rct = {
						"top": min_y,
						"left": max_x,
						"right": min_x,
						"bottom": max_y,
				}
			}
		} else {
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
					"colour": color.replace("#","0X"),
					"currentpage": tf.CurrentPage,
					"docserver": domain,
					"filedir": tf.FileDir,
					"fileid": tf.FileID,
					"filename": tf.FileName,
					"imageurl": "",
					"linewidth": send_line_width,
					"objdata": null,
					"objtype": "shape",
					"objid": generatorObjectId(),
					"pagenum": tf.PageNums,
					"rect": rct,
					"shapetype": objtype,
					"sqlid": "",
					"subcommand": "addobject",
				}
			}	
		}
		break;
	case SHAPE.CIRCLE:
		objtype = "emptyellipse";
		wb_msg = {
			"message": {
				"type": "whiteboard",
				"whiteboard": {
					"colour": color.replace("#","0X"),
					"currentpage": tf.CurrentPage,
					"docserver": domain,
					"filedir": tf.FileDir,
					"fileid": tf.FileID,
					"filename": tf.FileName,
					"imageurl": "",
					"linewidth": send_line_width,
					"objdata": null,
					"objtype": "shape",
					"objid": generatorObjectId(),
					"pagenum": tf.PageNums,
					"rect": rct,
					"shapetype": objtype,
					"sqlid": "",
					"subcommand": "addobject",
				}
			}	
		}
		break;
	case SHAPE.RECTANGLE:
		objtype = "emptyrect";
		wb_msg = {
			"message": {
				"type": "whiteboard",
				"whiteboard": {
					"colour": color.replace("#","0X"),
					"currentpage": tf.CurrentPage,
					"docserver": domain,
					"filedir": tf.FileDir,
					"fileid": tf.FileID,
					"filename": tf.FileName,
					"imageurl": "",
					"linewidth": send_line_width,
					"objdata": null,
					"objtype": "shape",
					"objid": generatorObjectId(),
					"pagenum": tf.PageNums,
					"rect": rct,
					"shapetype": objtype,
					"sqlid": "",
					"subcommand": "addobject",
				}
			}	
		}
		break;
	case SHAPE.TEXT:
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
					"objtype": "shape",
					"shapetype": objtype,
					"objid": generatorObjectId(),
					"objdata": {
						"string": text,
						"colour": color.replace("#","0X"),
						"fontlib": "Open Sans",
						"fontsize": 16,
					},
					"colour": color.replace("#","0X"),
					"linewidth": send_line_width,
					"rect": rct,
				}
			}	
		}
		break;

	default:
		break;
	}
	SendGMessage("", wb_msg);
}
// pageturn
function pageTurn(tf){
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx_cache.clearRect(0, 0, canvas.width, canvas.height);
	var wb_msg = {
		"message": {
			"type": "whiteboard",
			"whiteboard": {
				"subcommand": "pageturn",
				"fileid": tf.FileID,
				"filename": tf.FileName,
				"filedir": tf.FileDir,
				"docserver": domain,
				"sqlid": "",
				"pagenum": tf.PageNums,
				"currentpage": tf.CurrentPage,
			}
		}	
	}
	SendGMessage("", wb_msg);
}

// remove all
function removeAll(tf){
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx_cache.clearRect(0, 0, canvas.width, canvas.height);
	var wb_msg = {
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

// send chat
function sendChatMsg(gCode, msg){
	var fromid = local_user.uid;
	var toid = local_group.gid;
	var chat_msg = {
			"message": {
				"from": fromid,
				"to": toid,
				"type": "chat",
				"authorization": "public",
				"body": {
					"text": msg,
					"time": new Date().formate("hh:mm:ss"),
					"user": local_user.name,
				}
			}
	}
	SendGMessage("", chat_msg);
}



// onrecive group message, parse data
function parseData(im_data){
	// im_data = JSON.parse(toUTF8(im_data, false));
	im_data = JSON.parse(im_data);
	console.info(im_data);
	var data = im_data.message;
	var type = data.type;
	switch (type) {
	case "chat":
		var chat_message = data.body;
		var text_val = chat_message.text;
		var htm = "";
		if (text_val != null && text_val != undefined) {
			var ret = "";
			ret = cut(text_val, ret);
			var emArr = ret.split("S");
			if (emArr.length > 1) {
				for (var j = 0; j < emArr.length-1; j++) {                                                
					var emName = emArr[j].slice(2, 5);
					var emPath = "/img/im/sticker/"+emName+".png";
					var em = "<img src='"+emPath+"'>";
					text_val = text_val.replace(emArr[j], em);
				}
			}
		}
		var date = new Date().formate("yyyy/MM/dd");
		date += " "+chat_message.time;
		htm += '<p><span class="im-user">'+chat_message.user+'</span><span class="im-time">'+date+'</span><br>'+text_val+'</p>';
		$(".im-current").append(htm);
		$(".im-current").scrollTop($(".im-current")[0].scrollHeight);
		break;
	case "whiteboard":
		var wb = data.whiteboard;
		if (wb != undefined && wb != "" && wb != null) {
			parseWb(wb);
		}
		break;
	case "member":
		var sbc = data.subcommand;
		if (sbc != undefined && sbc != "" && sbc != null) {
			switch (sbc) {
			case "like":
				var user_id = parseInt(data.userid);
				var actor_userid = data.actoruserid;
				if (user_id == local_user.uid) {
					// 那么到这里我们就发现了 客户端还需要存一份老师和学生的信息...
					student_prise ++;
					$("#student-prise").prev().attr("src", "/img/video/prise-yes.png");
					$("#student-prise").html(student_prise);
				}
				break;

			default:
				break;
			}
		}
		break;
	case "timer":
		var sbc = data.subcommand;
		if (sbc == "sync") {
			$("#video-record").attr("src", "/img/record-start.png");
			seconds = data.secondcounts;
			window.setInterval(function(){
				seconds ++;
				hh = Math.floor(seconds/60/60);
				mm = Math.floor(seconds/60%60);
				ss = Math.floor(seconds%60);
				if (hh < 10) {
					hh = "0"+hh;
				}
				if (mm < 10) {
					mm = "0"+mm;
				}
				if (ss < 10) {
					ss = "0"+ss;
				}
				var t = hh+":"+mm+":"+ss;
				$(".record-time").html(t);
			}, 1000);
		} else if (sbc == "start") {
			$("#video-record").attr("src", "/img/record-start.png");
			seconds = 1;
			window.setInterval(function(){
				seconds ++;
				hh = Math.floor(seconds/60/60);
				mm = Math.floor(seconds/60%60);
				ss = Math.floor(seconds%60);
				if (hh < 10) {
					hh = "0"+hh;
				}
				if (mm < 10) {
					mm = "0"+mm;
				}
				if (ss < 10) {
					ss = "0"+ss;
				}
				var t = hh+":"+mm+":"+ss;
				$(".record-time").html(t);
			}, 1000);
		}
		break;
	case "media":
		var sbc = data.subcommand;
		if (sbc == "switchToAudio") {
			localStream.disableVideo();
			$(".audio-bg").show();
			showSysMsg("您已切换至音频通话模式!");
		} else if (sbc == "switchToVideo") {
			localStream.enableVideo();
			$(".audio-bg").hide();
			showSysMsg("您已切换至视频通话模式!");
		}
		break;
	case "camera":
		var sbc = data.subcommand;
		if (sbc == "switchToAudio") {
			localStream.disableVideo();
			$(".audio-bg").show();
			showSysMsg("您已切换至音频通话模式!");
		} else if (sbc == "switchToVideo") {
			localStream.enableVideo();
			$(".audio-bg").hide();
			showSysMsg("您已切换至视频通话模式!");
		}
		break;

	default:
		break;
	}
	
	
	
	
}


function parseWb(wb){
	var cmd = wb.subcommand;
	switch (cmd) {
	case "openfile":
		var fileId = wb.fileid;
		var flag = false;
		for (var i = 0; i < teachingFileList.length; i++) {
			if (teachingFileList[i].FileID == fileId) {
				flag = true ;
				break ;
			} 
		}
		if (!flag) {
			$.ajax({
				url : "/webclass/main/getFileStatus",
				type : "POST",
				dataType : "json",
				data : { "fileId": wb.docid,
						 "groupId": local_group.orgname,
					   },
				error : function(XMLHttpRequest, errorInfo, e) {
					console.error("Failed to get enterRoom data! error: " + errorInfo);
				},
				success : function(resp) {
					if (resp.success) {
						var tf = {
								"FileID": fileId,
								"FileName": wb.filename,
								"PageNums": wb.pagenums,
								"FileDir": wb.filedir,
								"CurrentPage": 1,	
						};
						teachingFileList.push(tf);
						var tname = tf.FileName;
						if (tname.length > 40) {
							tname = tname.slice(0,40);
						}
						var tfhtml = '<li cs-fid="'+tf.FileID+'" role="presentation"><a>'+tname+'</a></li>';
						$(".teaching-file-tab ul").append(tfhtml);
						loadImg(tf);
					} else {
						console.error(resp.message);
					}
				}
			});
		}
		break;
	case "closefile":
		var fileId = wb.fileid;
		for (var i = 0; i < teachingFileList.length; i++) {
			if (teachingFileList[i].FileID == fileId) {
				var tf = teachingFileList[i];
				teachingFileList.remove(tf);
				$(".teaching-file-tab ul").children("li[cs-fid='"+tf.FileID+"']").prev().tab("show");
				$(".teaching-file-tab ul").children("li[cs-fid='"+tf.FileID+"']").remove();
				break ;
			}
		}
		break;
	case "pageturn":
	case "removeall":
		var fileId = wb.fileid;
		var tf;
		for (var i = 0; i < teachingFileList.length; i++) {
			if (teachingFileList[i].FileID == fileId) {
				tf = teachingFileList[i];
				tf.CurrentPage = wb.currentpage;
				break ;
			}
		}
		if (tf) {
			loadImg(tf);
		}
		break;
	case "addobject":
		/*var fileId = wb.fileid;
		var tf;
		for (var i = 0; i < teachingFileList.length; i++) {
			if (teachingFileList[i].FileID == fileId) {
				tf = teachingFileList[i];
				break ;
			}
		}
		if (tf) {
			loadImg(tf);
		}*/
		var ot = wb.objtype;
		switch (ot) {
		case "text":
			var od = wb.objdata;
			var lf = scale * wb.rect.left;
			var bt = scale * wb.rect.bottom;
			var rt = scale * wb.rect.right;
			var tp = scale * wb.rect.top;
			var content = od.string;
			var clr = "#"+od.colour.slice(2);
			var font_size = parseInt(scale * od.fontsize);
	        ctx.font = font_size + " " +default_font_family;
	        ctx.fillStyle = clr;
	        ctx.fillText(content, lf, tp);
			break;
		case "pen":
			var od = wb.objdata;
			var clr = "#"+wb.colour.slice(2);
			
			ctx.beginPath();
			ctx.strokeStyle = clr;
			ctx.lineWidth = default_line_width;
	        ctx.moveTo(od[0].x*scale, od[0].y*scale);
	        for (var i = 1; i < od.length; i++) {
	        	ctx.lineTo(od[i].x*scale, od[i].y*scale);
			}
	        ctx.stroke();
			break;
		case "shape":
			var st = wb.shapetype;
			switch (st) {
			case "filledrect":
			case "emptyrect":
				var lf = scale * wb.rect.left;
				var rt = scale * wb.rect.right;
				var bt = scale * wb.rect.bottom;
				var tp = scale * wb.rect.top;
				var clr = "#"+wb.colour.slice(2);
				ctx.strokeStyle = clr;
				ctx.lineWidth = default_line_width;
		        ctx.strokeRect(lf, tp, (rt-lf), (bt-tp));
				break;
			case "filledellipse":
			case "emptyellipse":
				var lf = scale * wb.rect.left;
				var rt = scale * wb.rect.right;
				var bt = scale * wb.rect.bottom;
				var tp = scale * wb.rect.top;
				var clr = "#"+wb.colour.slice(2);
				ctx.strokeStyle = clr;
				ctx.lineWidth = default_line_width;
				drawEllipse(ctx, (rt+lf)/2, (bt+tp)/2, (rt-lf)/2, (bt-tp)/2);
				break;
			case "line":
				var lf = scale * wb.rect.left;
				var bt = scale * wb.rect.bottom;
				var rt = scale * wb.rect.right;
				var tp = scale * wb.rect.top;
				var clr = "#"+wb.colour.slice(2);
				ctx.strokeStyle = clr;
				ctx.lineWidth = default_line_width;
				ctx.beginPath();
		        ctx.moveTo(lf, tp);
		        ctx.lineTo(rt, bt);
		        ctx.stroke();
				break;

			default:
				break;
			}
			break;

		default:
			break;
		}
		break;
	case "removeobject":
		break;
	case "lock":
		var status = wb.status;
		var sys_message;
		if (status == "true") { // lock whiteboard
			// open --> lock
			$("#lock-whiteboard").attr("cs-lock", "1");
			$("#lock-whiteboard").attr("src", "/img/menu/lock-locked.png");
			$(".bottom").css({'pointer-events': "none"});
			$("canvas").css({"cursor": "default"});
			sys_message = "您的白板已被锁定!";
		} else { // open whiteboard
			// lock --> open
			$("#lock-whiteboard").attr("cs-lock", "0");
			$("#lock-whiteboard").attr("src", "/img/menu/lock-open.png");
			$(".bottom").css({'pointer-events': "auto"});
			sys_message = "您的白板已被解锁!";
		}
		showSysMsg(sys_message);
		break;
	default:
		break;
	}
}

// show some sysmsg
function showSysMsg(text){
	var date = new Date().formate("yyyy/MM/dd hh:mm:ss");
	var htm = '<p class="im-sys-p"><span class="im-sys">系统消息</span><span class="im-time">'+date+'</span><br>'+text+'</p>';
	$(".im-current").append(htm);
	$(".im-current").scrollTop($(".im-current")[0].scrollHeight);
}

// refresh page
function reload(){
	if (client) {
		// stop record
		// agoraRecord(false);
		client.leave(function() {
			console.log("client leaves channel");
			//……
		}, function(err) {
			console.log("client leave failed ", err);
			//error handling
		});
	}
	layer.confirm('您已断开连接,是否刷新重试？',{
			btn: ['确定','取消'], //按钮
		}, function(){
			window.location.reload(true);
		}, function(){
			return true;
		}
	);
}

// show offline msg
function getOfflineMsg(){
	
}

// record
function agoraRecord(isStart){
	var record_url;
	if (isStart) {
		record_url = "/webclass/main/startRecord";
	} else {
		record_url = "/webclass/main/stopRecord";
	}
	$.ajax({
		url : record_url,
		type : "POST",
		dataType : "json",
		data : { "userId": local_user.uid,
				 "groupId": local_group.orgname,
				 "roomId": local_group.gid,
			   },
		error : function(XMLHttpRequest, errorInfo, e) {
			console.error("Failed to record! error: " + errorInfo);
		},
		success : function(resp) {
			if (!resp.success) {
				console.error(resp.message);
			}
		}
	});
}



// generator objid
function generatorObjectId(){
	var objid = parseInt(Math.random()*10000) + 10000;
	for (var i = 0; i < objidArr.length; i++) {
		if (objidArr[i] == objid) {
			return generatorObjectId();
		}
	}
	objidArr.push(objid);
	return objid;
}
// asc sort number
function ascSort(a, b){
	return a-b;
}
// show the sticker
function cut(str, result){
	var i = str.indexOf("</0");
	if(i < 0){
		return result;
	}
	var em = str.slice(i, i+7);
	result += em+"S";
	str = str.slice(i+7);
	return cut(str, result);
}
//distinct array
function distinctArray(array) {
	var r = [];
	for (var i = 0, l = array.length; i < l; i++) {
		for (var j = i + 1; j < l; j++){
			if (array[i].id == array[j].id){
				j = ++i;
			}                                                       
		}
		r.push(array[i]);
	}
	return r;
}
// slice array by size
function sliceArray(arr, size){
	var newArr = [];
	for (var i = 0; i < arr.length; i = i+size) {
		if (i >= size) { // just for addobject pen
			newArr.push(arr.slice(i-1, i+size));
		} else {
			newArr.push(arr.slice(i, i+size));
		}
	}
	return newArr;
}
// pre load
function preLoadImg(){
	var imgArr = [{id: "1_1", src: "http://eclassdoc1.qiancloud.com/IdHYwoLGnCVXctW/1.jpg"}];
	for (var j = 0; j < teachingFileList.length; j++) {
		var tf = teachingFileList[j];
		var pageCount = parseInt(tf.PageNums);
		for (var i = 1; i <= pageCount; i++) {
			imgArr.push(
					{	id: tf.FileID+"_"+i,
						src: domain+tf.FileDir+"/"+i+".jpg"
					}
				)
		}
	}
	var imgLoadArr = distinctArray(imgArr);
	queue = new createjs.LoadQueue(true);
	queue.on("complete", handleComplete, this);
	queue.loadManifest(imgLoadArr, false);
	queue.load();
}
// complete load
function handleComplete(event) {
    var len;
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
$(document).keydown(function(e){
	var keycode = e.keyCode || e.which;       
	if(e.ctrlKey && keycode == 82){	// Ctrl + R
		e.preventDefault();   
		window.event.returnValue= false;   
    }
	if (keycode == 116) {	// F5
		e.preventDefault();   
		window.event.returnValue= false;   
	}
})
document.oncontextmenu = function(){
    return false;
}
