
// draw anything
$(function(){

    // init variable
    let x,y,endX,endY,lastX,lastY,fontPositionX,fontPositionY,
        isMousePressed = false,
        objid,
        group,
        page=1,
        coordinate = [];


    // simulate  input dialog when you interact with the UI
    let fontTip =$("<textarea rows='3' cols='20' style='background:transparent;position:absolute;display:none;'></textarea>");
    $file_box.append(fontTip);


    /**
     * Every function in this web has a corresponding command code:
     * --------------------------------------------------
     * function			command code		description
     * --------------------------------------------------
     * pencil  			        1				use it as a pencil to draw
     * eraser					2				use it as a eraser to erase some spots
     * clean					3 				you can clean the whole canvas
     * line				        4				draws straight lines
     * rectangle			    5				draw rectangles
     * text				        6				you can input text on the canvas
     * circle                   7               draw circle
     * 
     */


    function handlePencil(e)
    {
        if(isMousePressed)
        {
            let strokeStyle = state.ctx.strokeColor,
                strokeWidth = state.ctx.lineWidth;

            $cvs.drawLine({
                strokeStyle: strokeStyle,
                strokeWidth: strokeWidth,
                rounded: true,
                x1: lastX,
                y1: lastY,
                x2: endX,
                y2: endY,
                layer: true,
                groups: [group]
            });

            lastX = endX;
            lastY = endY;
        }
    }


    function handleEraser(e)
    {
        let eraser_size = 24;

        if(isMousePressed)
        {
            $cvs.addLayer({
                type: 'function',
                groups: [group],
                fn: function(ctx){
                    ctx.save();
                    ctx.beginPath();
                    // ctx.moveTo(lastX,lastY);
                    // ctx.lineTo(endX,endY);
                    ctx.arc(endX, endY, eraser_size, 0, Math.PI * 2, false);
                    ctx.clip();
                    $cvs.clearCanvas();
                    // ctx.clearRect(0,0,400,400);
                    ctx.restore();

                }
            }).drawLayers();

            lastX=endX;
            lastY=endY;
        }
    }


    function handleClean(e)
    {
        $cvs.setLayers({visible: false}).drawLayers();
        state.layerStep = -1;
    }


    function handleLine(isDraw)
    {
        if(isMousePressed)
        {
            let strokeStyle = state.ctx.strokeColor,
                strokeWidth = state.ctx.lineWidth;

            if(isDraw === true)
            {
                $cvs.drawLine({
                    strokeStyle: strokeStyle,
                    strokeWidth: strokeWidth,
                    rounded: true,
                    x1: x,
                    y1: y,
                    x2: endX,
                    y2: endY,
                    layer: true,
                    groups: [group],
                });
            }
            else
            {
                $cvs_cache.clearCanvas().drawLine({
                    strokeStyle: strokeStyle,
                    strokeWidth: strokeWidth,
                    rounded: true,
                    x1: x,
                    y1: y,
                    x2: endX,
                    y2: endY
                });

            }
        }

    }


    function handleRectangle(isDraw)
    {
        if(isMousePressed)
        {
            let strokeStyle = state.ctx.strokeColor,
                strokeWidth = state.ctx.lineWidth,
                centerX = x + (endX - x)/2,
                centerY = y + (endY - y)/2,
                width = Math.abs(endX - x),
                height = Math.abs(endY - y);

            if(isDraw === true)
            {
                $cvs.drawRect({
                    strokeStyle: strokeStyle,
                    strokeWidth: strokeWidth,
                    x: centerX,
                    y: centerY,
                    width: width,
                    height: height,
                    layer: true,
                    groups: [group]
                });
            }
            else
            {
                $cvs_cache.clearCanvas().drawRect({
                    strokeStyle: strokeStyle,
                    strokeWidth: strokeWidth,
                    x: centerX,
                    y: centerY,
                    width: width,
                    height: height,
                });
            }

        }
    }

    function handleText(isDraw)
    {
        let fillStyle = state.ctx.fillColor,
            strokeStyle = state.ctx.strokeColor,
            fontSize = state.ctx.fontSize,
            fontFamily = state.ctx.fontFamily,
            text = fontTip.val(),

            centerX = x + (endX - x)/2,
            centerY = y + (endY - y)/2,
            width = Math.abs(endX - x),
            height = Math.abs(endY - y);

        if(isDraw === true)
        {
            $cvs.drawText({
                fillStyle: strokeStyle,
                x: fontPositionX,
                y: fontPositionY,
                fontSize: fontSize,
                fontFamily: fontFamily,
                text: text,
                fromCenter: false,
                layer: true,
                groups: [group]
            });
        }
        else
        {
            let left = endX > x ? x : endX;
            let top = endY > y ? y : endY;

            if(isMousePressed){
                $cvs_cache.clearCanvas().drawRect({
                    strokeStyle: '#bbb',
                    strokeWidth: 1,
                    x: centerX,
                    y: centerY,
                    width: width,
                    height: height
                });

                fontTip.css({
                    width: width,
                    height: height,
                    fontSize: fontSize,
                    color: strokeStyle,
                    left: left,
                    top: top,
                });
            }
        }
    }


    function handleCircle(isDraw)
    {
        if(isMousePressed)
        {
            let strokeStyle = state.ctx.strokeColor,
                strokeWidth = state.ctx.lineWidth,
                centerX = x + (endX - x)/2,
                centerY = y + (endY - y)/2,
                width = Math.abs(endX - x),
                height = Math.abs(endY - y);
            if(isDraw === true)
            {
                $cvs.drawEllipse({
                    strokeStyle: strokeStyle,
                    strokeWidth: strokeWidth,
                    x: centerX,
                    y: centerY,
                    width: width,
                    height: height,
                    layer: true,
                    groups: [group]
                });
            }
            else
            {
                $cvs_cache.clearCanvas().drawEllipse({
                    strokeStyle: strokeStyle,
                    strokeWidth: strokeWidth,
                    x: centerX,
                    y: centerY,
                    width: width,
                    height: height,
                });
            }

        }
    }



    /**
     * Every function has different canvas context and cursor style
     */
    function switchCanvasContext(command)
    {
        switch(state.cvs_command){
            case 1: {
                break;
            }
            case 2: {
                break;
            }
            case 3: {
                handleClean();
                removeAll(state.tfPic.currentItem);
                $(".toolbar li[data-info='pencil']").trigger("click").focus();
                break;
            }
            default:{
                break;
            }
        }
    }


    function switchCursorStyle(command)
    {
        switch(state.cvs_command){
            case 1: {
                $cvs.removeClass("cvs-eraser");
                $cvs.removeClass("cvs-cross");
                $cvs.removeClass("cvs-font");
                $cvs.addClass("cvs-pencil");
                break;
            }
            case 2: {
                $cvs.removeClass("cvs-eraser");
                $cvs.removeClass("cvs-font");
                $cvs.removeClass("cvs-cross");
                $cvs.addClass("cvs-pencil");
                break;
            }
            case 6: {
                $cvs.removeClass("cvs-eraser");
                $cvs.removeClass("cvs-pencil");
                $cvs.removeClass("cvs-cross");
                $cvs.addClass("cvs-font");
                break;
            }
            default:{
                $cvs.removeClass("cvs-eraser");
                $cvs.removeClass("cvs-font");
                $cvs.removeClass("cvs-pencil");
                $cvs.addClass("cvs-cross");
                break;
            }
        }

    }


    // therefore, we create a callback list to .....
    let commandCallbacks = $.Callbacks();

    commandCallbacks.add(switchCanvasContext);
    commandCallbacks.add(switchCursorStyle);


    // By default
    commandCallbacks.fire(state.cvs_command);


    // command emitter and tools interact
    $(".toolbar li[data-info]").on("click",e=>{
        let $that = $(e.currentTarget);
        let type = $that.attr("data-info");
            switch(type)
            {
                case "pencil"		:{state.cvs_command=1;break;}
                case "eraser"		:{state.cvs_command=2;break;}
                case "clean"		:{state.cvs_command=3;break;}
                case "line"		    :{state.cvs_command=4;break;}
                case "rectangle"	:{state.cvs_command=5;break;}
                case "text"		    :{state.cvs_command=6;break;}
                case "circle"		:{state.cvs_command=7;break;}
                default 			:{state.cvs_command=1;}
            }
            //initialize canvas context and cursor style
            commandCallbacks.fire(state.cvs_command);
    });

    $(".toolbar .tool-pen").on("click","li",e=>{
        let $that = $(e.currentTarget);
        let className = $that.children(0).attr("data-role");
        $that.parent().prev().children(0).removeClass().addClass(className);
    });

    $(".toolbar .tool-color").on("click","li",e=>{
        let $that = $(e.currentTarget);
        let color = $that.children(0).css("color");

        $that.parent().prev().css('color',color);

        // save state: '#000000'
        state.ctx.strokeColor = rgb2hex(color);

        // update ctx
        switchCanvasContext(state.cvs_command);
    });

    $(".toolbar .tool-clean").on("click","li",e=>{
        let $that = $(e.currentTarget);
        let className = $that.children(0).attr("data-role");
        $that.parent().prev().children(0).removeClass().addClass(className);
    });

    $(".toolbar .tool-lock").on("click","span",e=>{
        //只有老师才能进行此操作
        if(local_user.type == 1){
            let $that = $(e.currentTarget);
            let kw = $that.attr('data-role');
            if(kw === "locked"){
                $that.removeClass().addClass('icon-ICon-18');
                $that.attr('data-role','unlock');
                isWhiteboardLocked = 'false';
            }else if(kw === "unlock"){
                $that.removeClass().addClass('icon-ICon-12');
                $that.attr('data-role','locked');
                isWhiteboardLocked = 'true';
            }

            let userid = $(".student-name").attr('uid');
            lock(userid,isWhiteboardLocked);
        }
    });



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


    $file_box.mousedown(function(e){
            isMousePressed = true;

            // set the begin path of the brash
            let pos = getCoordinate(e,$(this));
            coordinate.push({x: pos.x, y: pos.y});
        console.log(coordinate);
            lastX = x = pos.x;
            lastY = y = pos.y;

            // for undo
            objid = generatorObjectId();
            page = state.tfPic.pageNum;
            group = page +'_'+ objid;

            state.objid = objid;
    });
    $file_box.mousemove(mouseMoveEventHandler);
    $file_box.mouseup(mouseupEventHandler);
    $file_box.mouseleave(mouseupEventHandler);
    fontTip.blur(function(){
        let text_content = fontTip.val();

        if(text_content !== '')
        {
            handleText(true);
            pushLayer(group);

            let fontSize = Number(state.ctx.fontSize);
            coordinate.push({x: fontPositionX + fontSize, y: fontPositionY + fontSize});
            let data = addObject('text',state.ctx.strokeColor,coordinate,text_content,objid);
            objArr['_'+objid] = data;
            coordinate = [];
        }

        fontTip.hide();
        fontTip.val('');
    });


    function mouseMoveEventHandler(e)
    {
        if(isMousePressed)
        {
            let pos = getCoordinate(e,$(this));
            endX = pos.x;
            endY = pos.y;

            switch(state.cvs_command)
            {
                case 1	:
                {
                    handlePencil(e);
                    coordinate.push({x: pos.x, y: pos.y});
                    break;
                }
                case 2	:
                {
                    handleEraser(e);
                    coordinate.push({x: pos.x, y: pos.y});
                    break;
                }
                case 4	:
                {
                    handleLine(false);
                    break;
                }
                case 5	:
                {
                    handleRectangle(false);
                    break;
                }
                case 6	:
                {
                    handleText(false);
                    break;
                }
                case 7	:
                {
                    handleCircle(false);
                    break;
                }
            }

        }
    }


    function mouseupEventHandler(e)
    {
        if(isMousePressed)
        {
            let pos = getCoordinate(e,$(this));
            // records operations history for undo or redo
            switch(state.cvs_command)
            {
                case 1    : {
                    pushLayer(group);

                    let data = addObject('pen', state.ctx.strokeColor, coordinate, '', objid);
                    objArr['_'+objid] = data;

                    coordinate = [];
                    break;
                }
                case 2    : {
                    pushLayer(group);

                    let data = addObject('pen', 'transparent', coordinate, '', objid);
                    objArr['_'+objid] = data;

                    coordinate = [];
                    break;
                }
                case 4    : {
                    handleLine(true);
                    coordinate.push({x: pos.x, y: pos.y});
                    pushLayer(group);
                    let data = addObject('line', state.ctx.strokeColor, coordinate, '', objid);
                    objArr['_'+objid] = data;
                    coordinate = [];
                    break;
                }
                case 5    : {
                    handleRectangle(true);
                    coordinate.push({x: pos.x, y: pos.y});
                    pushLayer(group);
                    let data = addObject('emptyrect', state.ctx.strokeColor, coordinate,'', objid);
                    objArr['_'+objid] = data;
                    coordinate = [];
                    break;
                }
                case 6    : {
                    fontTip.show().focus();

                    fontPositionX = endX > x ? x : endX;
                    fontPositionY = endY > y ? y : endY;

                    coordinate.push({x: fontPositionX, y: fontPositionY});

                    break;
                }
                case 7    : {
                    handleCircle(true);
                    coordinate.push({x: pos.x, y: pos.y});
                    pushLayer(group);
                    let data = addObject('emptyellipse', state.ctx.strokeColor, coordinate, '', objid);
                    objArr['_'+objid] = data;
                    coordinate = [];
                    break;
                }
            }

            $cvs_cache.clearCanvas();
        }

        isMousePressed=false;
    }


    // undo redo
    $("#tool_undo").click(()=>unDoLayer('undo'));
    $("#tool_redo").click(()=>unDoLayer('redo'));




    /**
     * save canvas content as image( not required now)
     */
    function saveItAsImage()
    {
        let image = $cvs.get(0).toDataURL("image/png").replace("image/png", "image/octet-stream");
        //locally save
        window.location.href=image;
    }


});



