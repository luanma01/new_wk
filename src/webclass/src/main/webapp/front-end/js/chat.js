
// 聊天表情
$("#chat_emoji ul li img").on("click",e=>{
    let $that = $(e.currentTarget);
    let src = $that.attr('src');
    let alt = $that.attr('alt');
    $("#chat_editor").focus();
    let img = `<img alt="${alt}" src="${src}">`;
    _insertimg('chat_editor',img);
});

// 常用语句
$("#chat_word ul li").on("click",e=>{
    let wordhtml = $(e.currentTarget).html();

    handleSendChat('chat_editor',wordhtml);
});

// 发送按钮
$("#chat_send_btn").on("click",e=>{
    e.preventDefault();
    handleSendChat('chat_editor');

    $('#chat_editor').html('');

});

$("#chat_editor").on("keydown",e=>{
    if(e.ctrlKey){
        if(e.keyCode === 13){ //Ctrl + Enter
            // e.preventDefault();
            handleSendChat('chat_editor');

            $('#chat_editor').html('');}
    }
});


function _insertimg(elID,str){
    let selection= window.getSelection ? window.getSelection() : document.selection;
    let range= selection.createRange ? selection.createRange() : selection.getRangeAt(0);
    if (!window.getSelection){
        document.getElementById(elID).focus();

        range.pasteHTML(str);
        range.collapse(false);
        range.select();
    }
    else{
        document.getElementById(elID).focus();
        range.collapse(false);
        let hasR = range.createContextualFragment(str);
        let hasR_lastChild = hasR.lastChild;
        while (hasR_lastChild && hasR_lastChild.nodeName.toLowerCase() === "br" && hasR_lastChild.previousSibling && hasR_lastChild.previousSibling.nodeName.toLowerCase() === "br") {
            let e = hasR_lastChild;
            hasR_lastChild = hasR_lastChild.previousSibling;
            hasR.removeChild(e)
        }
        range.insertNode(hasR);
        if (hasR_lastChild) {
            range.setEndAfter(hasR_lastChild);
            range.setStartAfter(hasR_lastChild)
        }
        selection.removeAllRanges();
        selection.addRange(range)
    }
}

function handleSendChat(elID,text){
    let $editor = $("#"+elID);
    // by default
    if(!text) text = $editor.html().trim();
    if(!text && text.length === 0) return;

    let role = local_user.type === 1 ? 'teacher' : local_user.type === 2 ? 'student' : 'system' ;
    showChatMsg(role,local_user.name,text,true);

    text = transText(text);
    sendChatMsg(text);

}

/**
 * for chat: editor content transform to html or str
 *
 * @param text
 * @returns {text}
 */
function transText(text){
    let isHtml = text.indexOf('<div>') > -1 || text.indexOf('<img') > -1;
    if(isHtml)
    {
        text = text.replace(/<div>/g,"<br>");
        text = text.replace(/<\/div>/g,"");
        // text = text.replace(/<div>/g,"");
        text = text.replace(/&nbsp;/," ");
        let reg = new RegExp(/<img alt="[0-9]{3}" [^>]*>/g);
        text = text.replace(reg,function(a){
            let alt = a.slice(10,13);
            return `</${alt}/>`;
        });
        text = text.replace(/<br>/g,"\r\n");
    }
    else
    {
        let emjArr = text.match(/<\/[0-9]{3}\/>/g);
        if (emjArr && emjArr.length > 0) {
            for (let j = 0; j <= emjArr.length - 1; j++) {
                let alt = emjArr[j].slice(2, 5);
                let src = "../img/im/sticker/" + alt + ".png";
                let img = `<img alt="${alt}" src="${src}">`;
                text = text.replace(emjArr[j], img);
            }
        }
        text = text.replace(/\r\n/g,"<br>");
    }

    return text;
}