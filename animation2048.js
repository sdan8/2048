function showNumberWithAnimation(x, y, randNumber){
    var numberCell = $("#number_cell_" + x + "_" + y);

    numberCell.css("background-color",getNumberBackgroundColor(randNumber));
    numberCell.css("color",getNumberColor(randNumber));
    numberCell.css("font-size",getNumberFontSize(randNumber));
    numberCell.text(getNumberText(randNumber));

    numberCell.animate({
        width:cellSideLength + "px",
        height:cellSideLength + "px",
        top:getPosTop(x, y),
        left:getPosLeft(x, y)
    },50);
}

function showMoveAnimation(fromX, fromY, toX, toY){
    var numberCell = $("#number_cell_" + fromX + "_" + fromY);
    numberCell.animate({
        top: getPosTop(toX,toY),
        left: getPosLeft(toX,toY)
    },200);
}

function updateScore(score){
    $("#score").text(score);
}

function updateStep(step){
    $("#step").text(step);
}