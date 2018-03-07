<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<title>webclass-test</title>
<link href="/css/bootstrap.min.css" rel="stylesheet">
<link href="/css/main.css" rel="stylesheet">
</head>
<body>
	<div class="web-class">
		<div class="content">
			<div class="left">
				<div class="top">
					<div class="roominfo top-content">
						<img alt="" src="/img/class-title.png">
						<span class="room-name">1484278473057_Talk915-Maddie:2017-01-13 12:00-12:25</span>&nbsp;/&nbsp;
						<span class="room-time">19:00-19:50</span>&nbsp;/&nbsp;
						教室号∶<span class="room-id">RM-dasdhajdhasdhjkasdajhdjahadasd</span>
					</div>
<!-- 					<div class="systime top-content"> -->
<!-- 						<img alt="" src="/img/sys_time.png"> -->
<!-- 						<span class="sys-time">12月1日 11:29:04</span> -->
<!-- 					</div> -->
					<div class="settings top-content">
						<img id="video-record" cs-recording="0" alt="" src="/img/record-start.png">
						<span class="record-time">00:00:00</span>
						<img id="sys-setting" alt="" src="/img/setting-default.png">
					</div>
				</div>
				<div class="whiteboard">
					<div class="teaching-file-tab" role="navigation">
						<ul class="nav nav-tabs">
<!-- 							<li cs-fid="1" role="presentation" class="active"><a href="#">空白页</a></li> -->
<!-- 							<li role="presentation"><a href="#">teaching-file-title-1</a></li> -->
<!-- 							<li role="presentation"><a href="#">ST_level2_U9_L1_The_Farmer_in_The_Dell</a></li> -->
<!-- 							<li role="presentation"><a href="#">you are not prepared,now we are one</a></li> -->
<!-- 							<li class="dropdown"> -->
<!-- 								<button type="button" id="more-file" class="btn btn-link btn-info dropdown-toggle" style="margin-top: 3px;" data-toggle="dropdown"> -->
<!-- 									more...... -->
<!-- 									<b class="caret"></b> -->
<!-- 								</button> -->
<!-- 								<ul class="dropdown-menu" role="menu" aria-labelledby="more-file"> -->
<!-- 									<li><a href="#" tabindex="0" data-toggle="tab">one</a></li> -->
<!-- 									<li><a href="#" tabindex="1" data-toggle="tab">two</a></li> -->
<!-- 									<li><a href="#" tabindex="1" data-toggle="tab">three</a></li> -->
<!-- 								</ul> -->
<!-- 							</li> -->
						</ul>
					</div>
					
					<div class="page-left">
						<div class="page-pre">
							<img src="/img/page-pre.png" >
						</div>
					</div>
					<div class="page-right">
						<div class="page-refresh">
							<samp>刷新</samp>
						</div>
						<div class="page-next">
							<img src="/img/page-next.png" >
						</div>
					</div>
					<div class="teaching-file-content">
						<canvas id="cvs-cache"  width="960px" height="600px" ></canvas>
						<canvas id="cvs"  width="960px" height="600px" ></canvas>
						<div id="cvs-text" contenteditable="true"></div>
						<input id="webclass-id" type="hidden" value="${id }">
					</div>
					<div class="page-count"><samp>1</samp>/<samp>10</samp></div>
				</div>
				<div class="bottom">
					<div class="tools-menu" style="display: none;">
					  <img src="/img/menu/upload-default.png" id="upload-file" >
					</div>
					<div class="dropup tools-menu"  style="margin-left: 322px;">
					  <img src="/img/menu/pen-default.png" class="dropdown-toggle" id="pen-selection" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
					  <ul class="dropdown-menu" aria-labelledby="pen-selection">
					    <li cs-role="1"><img src="/img/menu/point.png" ><span>涂鸦</span></li>
					    <li cs-role="2"><img src="/img/menu/line.png" ><span>直线</span></li>
					    <li cs-role="3"><img src="/img/menu/circle.png" ><span>圆形</span></li>
					    <li cs-role="4"><img src="/img/menu/rectangle.png" ><span>矩形</span></li>
<!-- 					    <li cs-role="5"><img src="/img/menu/text.png" ><span>文字</span></li> -->
					  </ul>
					</div>
					<div class="dropup tools-menu">
					  <img src="/img/menu/color-default.png" class="dropdown-toggle" id="color-selection" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
					  <ul class="dropdown-menu" aria-labelledby="color-selection">
				     	<li cs-role="#303030"><img src="/img/menu/color-black.png" ><span>黑色</span></li>
					    <li cs-role="#FE6D28"><img src="/img/menu/color-orange.png" ><span>橙色</span></li>
					    <li cs-role="#FF354E"><img src="/img/menu/color-red.png" ><span>红色</span></li>
					    <li cs-role="#53B9FA"><img src="/img/menu/color-blue.png" ><span>蓝色</span></li>
					  </ul>
					</div>
					<div class="tools-menu" style="display: none;">
					  <img src="/img/menu/delete-default.png" id="delete-cvs" >
					</div>
					<div class="tools-menu" style="display: none;">
					  <img src="/img/menu/recover-default.png" id="recover-cvs" >
					</div>
					<div class="dropup tools-menu">
					  <img src="/img/menu/remove-all-default.png" id="remove-all" >
					  
<!-- 					  <img src="/img/menu/remove-default.png" class="dropdown-toggle" id="remove-selection" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> -->
<!-- 					  <ul class="dropdown-menu dropdown-menu-right" aria-labelledby="remove-selection"> -->
<!-- 					    <li><a href="#">Action</a></li> -->
<!-- 					    <li><a href="#">Another action</a></li> -->
<!-- 					    <li><a href="#">Something else here</a></li> -->
<!-- 					    <li><a href="#">Separated link</a></li> -->
<!-- 					  </ul> -->
					</div>
					<div class="tools-menu">
					  <img cs-lock="1" src="/img/menu/lock-locked.png" id="lock-whiteboard" >
					</div>
				</div>
			</div>
			
			<div class="right">
				<div class="video">
					<div id="teacher-source" class="video-src"></div>
					<div class="video-tools">
						<span class="user-name">teacherName</span>
						<img class="user-prise" src="/img/video/prise-no.png" >
						<span id="teacher-prise" class="user-prise-count">0</span>
<!-- 						<img class="user-audio" src="/img/video/audio-close.png" > -->
<!-- 						<img class="user-video" src="/img/video/video-close.png" > -->
					</div>
				</div>
				<div class="video">
					<div id="student-source" class="video-src"></div>
					<div class="video-tools">
						<span class="user-name">studentName</span>
						<img class="user-prise" src="/img/video/prise-no.png" >
						<span id="student-prise" class="user-prise-count">0</span>
<!-- 						<img class="user-audio" src="/img/video/audio-close.png" > -->
<!-- 						<img class="user-video" src="/img/video/video-close.png" > -->
					</div>
				</div>
				<div class="im-record">
					<div class="im-history">
<!-- 						<img src="/img/im/im-history.png" > -->
<!-- 						<a href="#">查看更多消息</a> -->
					</div>
					<div class="im-current"></div>
				</div>
				<div class="im-chat">
					<div class="dropup">
					  <img src="/img/im/sticker-default.png" class="dropdown-toggle im-sticker" id="sticker-selection" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
					  <ul class="dropdown-menu im-sticker-menu" aria-labelledby="sticker-selection">
				     	<li>
				     		<span><img cs-role="001" src="/img/im/sticker/001.png"></span>
				     		<span><img cs-role="002" src="/img/im/sticker/002.png"></span>
				     		<span><img cs-role="003" src="/img/im/sticker/003.png"></span>
				     		<span><img cs-role="004" src="/img/im/sticker/004.png"></span>
				     		<span><img cs-role="005" src="/img/im/sticker/005.png"></span>
				     		<span><img cs-role="006" src="/img/im/sticker/006.png"></span>
				     		<span><img cs-role="007" src="/img/im/sticker/007.png"></span>
				     		<span><img cs-role="008" src="/img/im/sticker/008.png"></span>
				     		<span><img cs-role="009" src="/img/im/sticker/009.png"></span>
				     		<span><img cs-role="010" src="/img/im/sticker/010.png"></span>
				     	</li>
				     	<li>
				     		<span><img cs-role="011" src="/img/im/sticker/011.png"></span>
				     		<span><img cs-role="012" src="/img/im/sticker/012.png"></span>
				     		<span><img cs-role="013" src="/img/im/sticker/013.png"></span>
				     		<span><img cs-role="014" src="/img/im/sticker/014.png"></span>
				     		<span><img cs-role="015" src="/img/im/sticker/015.png"></span>
				     		<span><img cs-role="016" src="/img/im/sticker/016.png"></span>
				     		<span><img cs-role="017" src="/img/im/sticker/017.png"></span>
				     		<span><img cs-role="018" src="/img/im/sticker/018.png"></span>
				     		<span><img cs-role="019" src="/img/im/sticker/019.png"></span>
				     		<span><img cs-role="020" src="/img/im/sticker/020.png"></span>
				     	</li>
				     	<li>
				     		<span><img cs-role="021" src="/img/im/sticker/021.png"></span>
				     		<span><img cs-role="022" src="/img/im/sticker/022.png"></span>
				     		<span><img cs-role="023" src="/img/im/sticker/023.png"></span>
				     		<span><img cs-role="024" src="/img/im/sticker/024.png"></span>
				     		<span><img cs-role="025" src="/img/im/sticker/025.png"></span>
				     		<span><img cs-role="026" src="/img/im/sticker/026.png"></span>
				     		<span><img cs-role="027" src="/img/im/sticker/027.png"></span>
				     		<span><img cs-role="028" src="/img/im/sticker/028.png"></span>
				     		<span><img cs-role="029" src="/img/im/sticker/029.png"></span>
				     		<span><img cs-role="030" src="/img/im/sticker/030.png"></span>
				     	</li>
					  </ul>
					</div>
					
					<div class="dropup">
					  <img src="/img/im/constant-default.png" class="dropdown-toggle im-constant" id="constant-selection" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
					  <ul class="dropdown-menu im-constant-menu" aria-labelledby="constant-selection">
				     	<li><span>你可以听到我说话吗？ Can you hear me?</span></li>
					    <li><span>老师可以重复一遍吗？ Pardon?</span></li>
					    <li><span>抱歉，我没听明白。Sorry,I don't understand.</span></li>
					    <li><span>我听不清楚。Sorry,I can't hear you well.</span></li>
					  </ul>
					</div>
					
					
					<div class="im-text" contenteditable="true" ></div>
					<div class="im-send"><img src="/img/im/send-msg.png"></div>
				</div>
			</div>
		</div>
	</div>
	
	<div id="sys-setting-div">
		<div class="form-horizontal">
		  <div class="form-group">
		    <label class="col-sm-3 control-label">麦克风:</label>
		    <div class="col-sm-8">
		      	<select id="microphone-device" class="form-control">
				</select>
		    </div>
		  </div>
		  <div class="form-group">
		    <label class="col-sm-3 control-label">扬声器:</label>
		    <div class="col-sm-8">
		      	<select id="speaker-device" class="form-control">
				</select>
		    </div>
		  </div>
		  <div class="form-group">
		    <label class="col-sm-3 control-label">摄像头:</label>
		    <div class="col-sm-8">
		      	<select id="camera-device" class="form-control">
				</select>
				<video id="camera-test" src="" style="width: 160px; height: 120px; margin:10px 0 5px 0;"></video>
		    </div>
		  </div>
		  <input id="app-id" type="hidden" value="${appId }">
<!-- 		  <div class="form-group"> -->
<!-- 		    <label class="col-sm-3 control-label">锁定账号:</label> -->
<!-- 		    <div class="col-sm-8"> -->
<!-- 		    	<div class="radio lock-user"> -->
<!-- 					<label><input type="radio" name="lock-user" value="0" checked="checked"> 未锁定  </label> -->
<!-- 				</div> -->
<!-- 				<div class="radio lock-user"> -->
<!-- 					<label><input type="radio" name="lock-user" value="1"> 锁定  </label> -->
<!-- 				</div> -->
<!-- 		    </div> -->
<!-- 		  </div> -->
		  <button id="cfm-check-device" type="button" class="btn btn-success col-sm-offset-2">确定</button>
		  <button id="re-check-device" type="button" class="btn btn-danger col-sm-offset-3">重新检测</button>
		</div>
	</div>
	
</body>
<script src="/js/common/jquery.min.js"></script>
<script src="/js/common/preloadjs-0.4.1.min.js"></script>
<script src="/js/common/bootstrap.min.js"></script>
<script src="/js/common/layer/layer.js"></script>
<script src="/js/AgoraRTCSDK/AgoraRTCSDK-2.0.0.js"></script>
<script src="/js/main.js"></script>
<!-- <script src="/js/agora-init.js"></script> -->
<script src="/js/im.js"></script>
<script src="/js/interact-init_bak.js"></script>
<script src="/js/agora-init_bak.js"></script>
<!-- <script src="/js/init_bak.js"></script> -->
<!-- <script src="/js/all.js"></script> -->
</html>
