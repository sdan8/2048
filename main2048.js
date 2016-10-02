var board = new Array();
var score = 0;
var step = 0;
var hasConflicted = new Array();

var startX = 0;
var startY = 0;
var endX = 0;
var endY = 0;

$(document).ready(function () {
    prepareForMobile();
    //开始新的游戏
    newgame();
});

function prepareForMobile(){
    if(documentWidth > 500){
        gridWidth = 500;
        cellSideLength = 100;
        cellSpace = 20;
    }

    var grid = $("#grid");
    var gridCell = $(".grid_cell");
    grid.css("width",gridWidth - 2*cellSpace);
    grid.css("height",gridWidth - 2*cellSpace);
    grid.css("padding",cellSpace);
    grid.css("border-radius",0.02*gridWidth);

    gridCell.css("width",cellSideLength);
    gridCell.css("height",cellSideLength);
    gridCell.css("border-radius",0.02*cellSideLength);
}

function newgame(){
    //初始化网格
    init();
    //随机的两个格子生成数字
    generateOneNumber();
    generateOneNumber();
    //分数清零
    score = 0;
    //步数清零
    step = 0;
}

function init(){
    //建立网格
    for(var i = 0; i < 4; i++){
        for(var j = 0; j < 4; j++){
            $("#grid_cell_" + i + "_" + j).css({top:getPosTop(i, j),left:getPosLeft(i, j)});
        }
    }

    for(var i = 0; i < 4; i++){
        board[i] = new Array();
        hasConflicted[i] = new Array();
        for(var j = 0; j < 4; j++){
            board[i][j] = 0;
            hasConflicted[i][j] = false;
        }
    }

    updateBoardView();

}

function updateBoardView(){
    $(".number_cell").remove();

    for(var i = 0; i < 4; i++){
        for (var j = 0; j < 4; j++){
            $("#grid").append('<div class="number_cell" id="number_cell_' + i + '_' + j + '"></div>');
            var theNumberCell = $("#number_cell_" + i + "_" + j);
            if(board[i][j] == 0){
                theNumberCell.css("width","0px");
                theNumberCell.css("height","0px");
                theNumberCell.css("top",getPosTop(i,j) + cellSideLength/2);
                theNumberCell.css("left",getPosLeft(i,j) + cellSideLength/2);
            }
            else{
                theNumberCell.css("width",cellSideLength);
                theNumberCell.css("height",cellSideLength);
                theNumberCell.css("top",getPosTop(i,j));
                theNumberCell.css("left",getPosLeft(i,j));
                theNumberCell.css("background-color",getNumberBackgroundColor(board[i][j]));
                theNumberCell.css("color",getNumberColor(board[i][j]));
                theNumberCell.css("font-size",getNumberFontSize(board[i][j]));
                //theNumberCell.css("font-size","40px");
                //theNumberCell.text(board[i][j]);
                theNumberCell.text(getNumberText(board[i][j]));

            }
            hasConflicted[i][j] = false;
        }
    }
    $(".number_cell").css("line-height",cellSideLength + "px");
}

function generateOneNumber(){
    //是否有位置
    if(noSpace(board)){
        return false;
    }
    else{
        //随机一个位置
        var randX = parseInt(Math.floor(Math.random() *4));
        var randY = parseInt(Math.floor(Math.random() *4));

        var times = 0;
        while(times < 50){
            if(board[randX][randY] == 0){
                break;
            }
            else{
                randX = parseInt(Math.floor(Math.random() *4));
                randY = parseInt(Math.floor(Math.random() *4));
            }
        }
        if(times == 50){
            for(var i = 0; i < 4; i++){
                for(var j = 0; j < 4; j++){
                    if(board[i][j] == 0){
                        randX = i;
                        randY = j;
                    }
                }
            }
        }

        //随机一个数字
        var randNumber = Math.random() < 0.5 ? 2 : 4;

        board[randX][randY] = randNumber;
        showNumberWithAnimation(randX, randY, randNumber);

        return true;
    }
}

$(document).keydown(function (event) {

    switch (event.keyCode){
        case 37:    //left
            event.preventDefault();
            if(moveLeft()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isGameOver()",300);
            }
            break;
        case 38:    //up
            event.preventDefault();
            if(moveUp()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isGameOver()",300);
            }
            break;
        case 39:    //right
            event.preventDefault();
            if(moveRight()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isGameOver()",300);
            }
            break;
        case 40:    //down
            event.preventDefault();
            if(moveDown()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isGameOver()",300);
            }
            break;
        default :
            break;
    }
});

document.addEventListener("touchstart",function(event){
    startX = event.touches[0].pageX;
    startY = event.touches[0].pageY;

});

document.addEventListener("touchmove",function(event){
   event.preventDefault();
});

document.addEventListener("touchend", function (event) {
    endX = event.changedTouches[0].pageX;
    endY = event.changedTouches[0].pageY;

    var deltaX = endX - startX;
    var deltaY = endY - startY;

    if(Math.abs(deltaX) < 0.2*documentWidth && Math.abs(deltaY) < 0.2*documentWidth){
        return;
    }

    //x
    if(Math.abs(deltaX) >= Math.abs(deltaY)){
        if(deltaX > 0){
            //moveRight
            if(moveRight()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isGameOver()",300);
            }
        }
        else{
            //moveLeft
            if(moveLeft()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isGameOver()",300);
            }
        }
    }
    //y
    else{
        if(deltaY > 0){
            //moveDown
            if(moveDown()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isGameOver()",300);
            }
        }
        else{
            //moveUp
            if(moveUp()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isGameOver()",300);
            }
        }
    }
});

function isGameOver(){
    if(noSpace(board) && noMove(board)){
        gameOver();
    }
}

function gameOver(){
    alert("Game Over!");
}

function moveLeft(){
    if(!canMoveLeft(board)){
        return false;
    }
    else{
        //moveLeft
        for(var i = 0; i < 4; i++){
            for(var j = 1; j < 4; j++){
                if(board[i][j] != 0){
                    for(var k = 0; k < j; k++){
                        if(board[i][k] == 0 && noBlockHorizontal(i, k, j, board)){
                            //move
                            showMoveAnimation(i, j, i, k);
                            board[i][k] = board[i][j];
                            board[i][j] = 0;
                            continue;
                        }
                        else if(board[i][k] == board[i][j] && noBlockHorizontal(i, k, j, board) && !hasConflicted[i][k]){
                            //move
                            showMoveAnimation(i, j, i, k);
                            //add
                            board[i][k] += board[i][j];
                            board[i][j] = 0;

                            score += board[i][k];
                            updateScore(score);

                            hasConflicted[i][k] = true;
                            continue;
                        }
                    }
                }
            }
        }
    }

    step++;
    updateStep(step);
    setTimeout("updateBoardView()",200);
    return true;
}

function moveUp(){
    if(!canMoveUp(board)){
        return false;
    }
    else{
        //moveUp
        for(var j = 0; j < 4; j++){
            for(var i = 1; i < 4; i++){
                if(board[i][j] != 0){
                    for(var k = 0; k < i; k++){
                        if(board[k][j] == 0 && noBlockVertical(k, i, j, board)){
                            showMoveAnimation(i, j, k, j);
                            board[k][j] = board[i][j];
                            board[i][j] = 0;
                            continue;
                        }
                        else if(board[k][j] == board[i][j] && noBlockVertical(k, i, j, board) && !hasConflicted[k][j]){
                            showMoveAnimation(i, j, k, j);
                            board[k][j] += board[i][j];
                            board[i][j] = 0;

                            score += board[k][j];
                            updateScore(score);

                            hasConflicted[k][j] = true;
                            continue;
                        }
                    }
                }
            }
        }
    }

    step++;
    updateStep(step);
    setTimeout("updateBoardView()",200);
    return true;
}

function moveRight(){
    if(!canMoveRight(board)){
        return false;
    }
    else{
        //moveRight
        for(var i = 0; i < 4; i++){
            for(var j = 2; j >= 0; j--){
                if(board[i][j] != 0){
                    for(var k = 3; k > j; k--){
                        if(board[i][k] == 0 && noBlockHorizontal(i, j, k, board)){
                            showMoveAnimation(i, j, i, k);
                            board[i][k] = board[i][j];
                            board[i][j] = 0;
                            continue;
                        }
                        else if(board[i][k] == board[i][j] && noBlockHorizontal(i, j, k, board) && !hasConflicted[i][k]){
                            showMoveAnimation(i, j, i, k);
                            board[i][k] += board[i][j];
                            board[i][j] = 0;

                            score += board[i][k];
                            updateScore(score);

                            hasConflicted[i][k] = true;
                            continue;
                        }
                    }
                }
            }
        }
    }

    step++;
    updateStep(step);
    setTimeout("updateBoardView()",200);
    return true;
}

function moveDown(){
    if(!canMoveDown(board)){
        return false;
    }
    else{
        //moveDown
        for(var j = 0; j < 4; j++){
            for(var i = 2; i >= 0; i--){
                if(board[i][j] != 0){
                    for(var k = 3; k > i; k--){
                        if(board[k][j] == 0 && noBlockVertical(i, k, j, board)){
                            showMoveAnimation(i, j, k, j);
                            board[k][j] = board[i][j];
                            board[i][j] = 0;
                            continue;
                        }
                        else if(board[k][j] == board[i][j] && noBlockVertical(i, k, j, board) && !hasConflicted[k][j]){
                            showMoveAnimation(i, j, k, j);
                            board[k][j] += board[i][j];
                            board[i][j] = 0;

                            score += board[k][j];
                            updateScore(score);

                            hasConflicted[k][j] = true;
                            continue;
                        }
                    }
                }
            }
        }
    }

    step++;
    updateStep(step);
    setTimeout("updateBoardView()",200);
    return true;
}