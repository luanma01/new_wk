let state = {};

state.cvs_command = 1;
state.cvs_command_type = {
    'pencil': 1,
    'eraser': 2,
    'clean': 3,
    'line': 4,
    'rectangle': 5,
    'text': 6,
    'circle': 7,
};

state.tfPic = {
    realWidth: '',
    realHeight: '',
    currentWidth: '',
    currentHeight: '',
    scale: 1, // currentSize / realSize
    list: [
        {
            "FileID": 1,
            "PageNums": 10,
            "FileName": "空白页",
            "FileDir": "IdHYwoLGnCVXctW",
            "CurrentPage": 1,
        }
    ], // teaching file list
    itemNum: 0,
    currentItem: {},
    pageNum: 1,
    fileDir:'',
};

state.ctx = {
    strokeColor: '#000000',
    fillColor: '',
    lineWidth: 3,
    fontSize: 24,
    fontFamily: 'arial,sans-serif',
    command: 1,
};

state.layerGroup = [];
state.layerStep = -1;

state.domain = 'http://eclassdoc1.qiancloud.com/';


let domain = 'http://eclassdoc1.qiancloud.com/',
    objidArr = [],
    objArr = [];


let d_mic_id,d_sp_id,d_cam_id;


let client, channelkey, localStream, camera, microphone, local_source, remote_source;



let isWhiteboardLocked = 'true';



// 保存会话数据 sessionStorage
let saveData = (key,data)=>{
    data=JSON.stringify(data);
    sessionStorage.setItem(key,data);
}

let getData = (key)=>{
    let data = sessionStorage.getItem(key);
    if(!data) data = null;
    data = JSON.parse(data);
    return data;
}

let initData = (key,data)=>{
    if(!getData(key)) saveData(key,data);
}


(function initStorage(){
    initData('isWhiteboardLocked','true');// 白板是否已锁定
    initData('isMicPlay','true');// 音频是否开启
    initData('isCameraPlay','true');// 视频是否开启
    initData('teacher',[]);// 老师列表
    initData('student',[]);// 学生列表
})();
