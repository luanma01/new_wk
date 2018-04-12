
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

// browser version
function IEVersion() {
	var userAgent = navigator.userAgent; 
    var isOpera = userAgent.indexOf("Opera") > -1; 
    var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera; 
    var isIE11 = userAgent.indexOf("Trident/7.0;") > -1 && userAgent.indexOf("rv:") && !isOpera; 
    var isEdge = userAgent.indexOf("Edge") > -1 && !isIE; 
    var isFF = userAgent.indexOf("Firefox") > -1; 
    var isSafari = userAgent.indexOf("Safari") > -1 && userAgent.indexOf("Chrome") == -1; 
    var isChrome = userAgent.indexOf("Chrome") > -1 && userAgent.indexOf("Safari") > -1; 
	if (isIE11) {
		return 11;
	} else if (isIE) {
		var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
		reIE.test(userAgent);
		var fIEVersion = parseFloat(RegExp["$1"]);
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