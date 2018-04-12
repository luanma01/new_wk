<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<title>webclass-agora-testwb</title>
<link href="/css/bootstrap.min.css" rel="stylesheet">
<link href="/css/agora-test-wb.css" rel="stylesheet">
</head>
<body>
	<div class="web-class">
		<div class="content">
			<div class="left">
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
						<input id="webclass" type="hidden" value="${webclass }">
						<input id="domain" type="hidden" value="${domain }">
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
					<div class="dropup tools-menu" style="display: none;">
					  <img src="/img/menu/remove-all-default.png" id="remove-all" >
					</div>
					<div class="tools-menu">
					  <img cs-lock="0" src="/img/menu/lock-open.png" id="lock-whiteboard" >
					</div>
				</div>
			</div>
		</div>
	</div>
</body>
<script src="/js/common/jquery.min.js"></script>
<script src="/js/common/preloadjs-0.4.1.min.js"></script>
<script src="/js/common/bootstrap.min.js"></script>
<script src="/js/common/layer/layer.js"></script>
<script src="/js/main.js"></script>
<script src="/js/im.js"></script>
<script src="/js/init-agora-testwb.js"></script>
</html>
