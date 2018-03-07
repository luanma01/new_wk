<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<title>webclass-index</title>
<link href="/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
	<div id="div-device">
		<div>
			<label>Audio source: </label>
			<select id="audio-source"></select>
		</div>
		<div>
			<label>Video source: </label>
			<select id="video-source"></select>
		</div>
	</div>

	<div id="div-join" class="panel panel-default">
		<div class="panel-body">
			Key: <input id="key" type="text" value="11f6429ce82e44c8889e860096d975ba" ></input> 
			Channel:<input id="channel" type="text" value="98567" de="10033499"></input> 
			Host:<input id="video" type="checkbox" checked></input>
			<button id="join" class="btn btn-primary" >Join</button>
			<button id="leave" class="btn btn-primary" >Leave</button>
			<input id="uid" type="hidden" value="407784" >
		</div>
	</div>

	<div id="video-remote" style="margin: 0 auto;">
		<div id="agora-remote" style="float: right; width: 200px; height: 200px; display: inline-block;"></div>
	</div>
	<div id="video-local" style="margin: 0 auto;">
		<div id="agora-local" style="float: right; width: 200px; height: 200px; display: inline-block;"></div>
	</div>
</body>
<script src="/js/common/jquery.min.js"></script>
<script src="/js/common/bootstrap.min.js"></script>
<script src="/js/common/layer/layer.js"></script>
<script src="/js/AgoraRTCSDK/AgoraRTCSDK-2.0.0.js"></script>
<script src="/js/init.js"></script>
</html>
