var gameId = 0;
var puzzle = [];
var solution = [];
var remaining = [9, 9, 9, 9, 9, 9, 9, 9, 9];
var timer = 0;
var pauseTimer = false;
var intervalId;
var gameOn = false;


function startGame() {
    var difficulties = document.getElementsByName('difficulty');
    var difficulty = 5;
    for (var i = 0; i < difficulties.length; i++) {
        if (difficulties[i].checked) {
            newGame(4 - i);
            difficulty = i;
            break;
        }
    }
    if (difficulty > 4)
        newGame(5);

    hideDialog();
    gameId++;
    document.getElementById("game-number").innerText = "game #" + gameId;
    document.getElementById("game-difficulty").innerText = difficulty < difficulties.length ? difficulties[difficulty].value : "solved";
}



function newGame(difficulty) {
    /*var k = document.getElementById("sudoku");
    var p = document.createElement("p");
    


    //var PRow = generatePossibleRows(psNum);

    /*p.innerText = grid + "\n" + sol + "\n" + puzzle;
    k.appendChild(p);*/
    var grid = getGridInit();
    var rows = grid;
    var cols = getColomns(grid);
    var blks = getBlocks(grid);

    var psNum = generatePossibleNumber(rows, cols, blks);
    solution = solveGrid(psNum, rows);

    timer = 0;
    for (var i in remaining)
        remaining[i] = 9;

    puzzle = makeItPuzzle(solution, difficulty);
    gameOn = true;
    ViewPuzzle(puzzle);
    updateRemainingTable();
    startTimer();
}

function getColomns(grid) {
    var result = ["", "", "", "", "", "", "", "", ""];
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++)
            result[j] += grid[i][j];
    }
    return result;
}

function getBlocks(grid) {
    var result = ["", "", "", "", "", "", "", "", ""];
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++)
            result[Math.floor(i / 3) * 3 + Math.floor(j / 3)] += grid[i][j];
    }
    return result;
}

function getGridInit() {
    //var log = "";
    var rand = [];
    for (var i = 1; i <= 9; i++) {
        //var num = Math.floor(Math.random() * 9 + 1);
        var row = Math.floor(Math.random() * 9);
        var col = Math.floor(Math.random() * 9);
        //log += "num is " + num + ". in ( " + row + ", " + col + " )\n";
        var accept = true;
        //log += "result contains " + result.length + " numbers\n";
        for (var j = 0; j < rand.length; j++) {
            //log += "result [" + j + "] = " + result[j] + ".";
            //log += "result [" + j + ", 0] = " + result[j, 0] + ". and num = " + num + "\n";
            //log += "result [" + j + ", 0] row = " + result[j, 1] + ". and num row = " + row + "\n";
            //log += "result [" + j + ", 0] col = " + result[j, 1] + ". and num col = " + col + "\n";
            if (rand[j][0] == i | (rand[j][1] == row & rand[j][2] == col)) {
                //log += "result of result[" + j + ", 0] == " + num + " is " + result[j, 0] == num + "\n";
                //log += "result of result[" + j + ", 1] == " + row + " is " + result[j, 1] == row + "\n";
                //log += "result of result[" + j + ", 2] == " + col + " is " + result[j, 2] == col + "\n";
                accept = false;
                i--;
                break;
            }
        }
        if (accept) {
            //log += "number [" + num + "," + row + "," + col + "] is accepted \n";
            rand.push([i, row, col]);
        }
        /*else {
            log += "number [" + num + "," + row + "," + col + "] is not accepted \n";
        }*/

    }
    //var k = document.getElementById("sudoku");
    //var p = document.createElement("p");
    //p.innerText = log;
    //k.appendChild(p);

    var result = [];
    for (var i = 0; i < 9; i++) {
        var row = "000000000";
        result[i] = row;
    }

    for (var i = 0; i < rand.length; i++) {
        result[rand[i][1]] = replaceCharAt(result[rand[i][1]], rand[i][2], rand[i][0]);
    }

    return result;
}

function replaceCharAt(string, index, char) {
    if (index > string.length - 1) return string;
    return string.substr(0, index) + char + string.substr(index + 1);
}

function generatePossibleNumber(rows, colomns, blocks) {
    var psb = [];
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            psb[i * 9 + j] = "";
            if (rows[i][j] != 0) {
                psb[i * 9 + j] += rows[i][j];
            } else {
                for (var k = '1'; k <= '9'; k++) {
                    if (!rows[i].includes(k))
                        if (!colomns[j].includes(k))
                            if (!blocks[Math.floor(i / 3) * 3 + Math.floor(j / 3)].includes(k))
                                psb[i * 9 + j] += k;
                }
            }
        }
    }
    return psb;
}

function generatePossibleRows(possibleNumber) {
    var result = [];

    function step(level, PossibleRow) {
        if (level == 9) {
            result.push(PossibleRow);
            return;
        }

        for (var i in possibleNumber[level]) {
            if (PossibleRow.includes(possibleNumber[level][i]))
                continue;
            step(level + 1, PossibleRow + possibleNumber[level][i]);
        }
    }

    step(0, "");

    return result;
}

function nextStep(level, possibleNumber, rows, solotion) {
    var x = possibleNumber.slice(level * 9, (level + 1) * 9);
    var y = generatePossibleRows(x);
    if (y.length == 0)
        return 0;
    for (var num in y) {
        for (var i = level + 1; i < 9; i++)
            solotion[i] = rows[i];
        solotion[level] = y[num];
        if (level < 8) {
            var cols = getColomns(solotion);
            var blocks = getBlocks(solotion);

            var poss = generatePossibleNumber(solotion, cols, blocks);
            if (nextStep(level + 1, poss, rows, solotion) == 1)
                return 1;
        }
        if (level == 8)
            return 1;
    }
    return -1;
}

function solveGrid(possibleNumber, rows) {
    var solotion = [];
    //var s1 = DateTime.UtcNow.Ticks;
    var result = nextStep(0, possibleNumber, rows, solotion);
    if (result == 1)
        return solotion;
    //var time = DateTime.UtcNow.Ticks - s1;

    /*switch (result) {
        case 0:
            MessageBox.Show("Can not Solve , Invalid Input\nTotal time : {0} ms");
            break;
        case 1:
            for (var i = 0; i < 9; i++)
                for (var j = 0; j < 9; j++)
                    (grd_container.Children[i * 9 + j] as TextBox).Text = solotion[i][j].ToString();
            switch (CheckInput()) {
                case MatrexState.Invalid:
                case MatrexState.Chalange:
                    MessageBox.Show("Can not Solve , Invalid Input\nTotal time : {0} ms");
                    break;
                case MatrexState.Solved:
                    alert("SOLVED\nTotal time : {0} ms");
                    break;
            }
            break;

        case -1:
            alert("Can not Solve , Invalid Input\nTotal time : {0} ms");
            break;
    }*/
}

/*
    difficulty:
    // expert   : 0;
    // hard     : 1;
    // Normal   : 2;
    // easy     : 3;
    // very easy: 4;
*/
function makeItPuzzle(grid, difficulty) {
    if (!(difficulty < 5 && difficulty > -1))
        difficulty = 13;
    var remainedValues = 81;
    var puzzle = grid.slice(0);
    while (remainedValues > (difficulty * 5 + 20)) {
        var x = Math.floor(Math.random() * 9);
        var y = Math.floor(Math.random() * 9);
        remainedValues = clearValue(puzzle, x, y, remainedValues);
    }
    return puzzle;
}

function clearValue(grid, x, y, remainedValues) {
    var sym = getSymmetry(x, y);    //Symmetry
    if (grid[y][x] != 0) {
        grid[y] = replaceCharAt(grid[y], x, "0")
        remainedValues--;
        if (x != sym[0] && y != sym[1]) {
            grid[sym[1]] = replaceCharAt(grid[sym[1]], sym[0], "0")
            remainedValues--;
        }
    }
    return remainedValues;
}



function getSymmetry(x, y) {
    var symX = 8 - x;  //Symmetry
    var symY = 8 - y;
    return [symX, symY];
}

function ViewPuzzle(grid) {
    var table = document.getElementById("puzzle-grid");
    for (var i = 0; i < grid.length; i++) {
        for (var j = 0; j < grid[i].length; j++) {
            var input = table.rows[i].cells[j].getElementsByTagName('input')[0];
            input.classList.remove("right-cell");
            input.classList.remove("worning-cell");
            input.classList.remove("wrong-cell");
            if (grid[i][j] == "0") {
                input.disabled = false;
                input.value = "";
            }
            else {
                input.disabled = true;
                input.value = grid[i][j];
                remaining[grid[i][j] - 1]--;
            }
        }
    }
}

function checkInput(input) {
    if (input.value[0] < '1' || input.value[0] > '9') {
        if (input.value != "?" && input.value != "؟") {
            input.value = "";
            alert("only numbers [1-9] and question mark '?' are allowed!!");
            input.focus()
        }
    }

}

//newGame();


// Material Design Ripple Buttons

window.onload = function () {
    var rippleButtons = document.getElementsByClassName("button");
    for (var i = 0; i < rippleButtons.length; i++) {
        rippleButtons[i].onmousedown = function (e) {
            var x = e.pageX - this.offsetLeft;
            var y = e.pageY - this.offsetTop;
            var rippleItem = document.createElement("div");
            rippleItem.classList.add('ripple');
            rippleItem.setAttribute("style", "left: " + x + "px; top: " + y + "px");
            var rippleColor = this.getAttribute('ripple-color');
            if (rippleColor)
                rippleItem.style.background = rippleColor;
            this.appendChild(rippleItem);
            setTimeout(function () {
                rippleItem.parentElement.removeChild(rippleItem);
            }, 1500);
        };
    }
    var table = document.getElementById("puzzle-grid");
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            var input = table.rows[i].cells[j].getElementsByTagName('input')[0];
            input.onchange = function () {
                this.classList.remove("right-cell");
                this.classList.remove("worning-cell");
                this.classList.remove("wrong-cell");
                checkInput(this);
                if (this.value > 0 && this.value < 10)
                    remaining[this.value - 1]--;
                if (this.oldvalue !== "") {
                    if (this.oldvalue > 0 && this.oldvalue < 10)
                        remaining[this.oldvalue - 1]++;
                }
                updateRemainingTable();
            };
            input.onfocus = function () {
                this.oldvalue = this.value;
            };
        }
    }

}


//End of Material Design Ripple Buttons

function showHamburgerMenu() {
    var div = document.getElementById("hamburger-menu");
    var menu = document.getElementById("nav-menu");
    div.style.display = "block";
    div.style.visibility = "visible";
    setTimeout(function () {
        div.style.opacity = 1;
        menu.style.left = 0;
    }, 50);
}

function hideHamburgerMenu() {
    var div = document.getElementById("hamburger-menu");
    var menu = document.getElementById("nav-menu");
    menu.style.left = "-256px";

    setTimeout(function () {
        div.style.opacity = 0;
        //divstyle.display = "none";
        div.style.visibility = "collapse";
    }, 200);
}


function showDialog() {
    hideHamburgerMenu();
    var dialog = document.getElementById("dialog");
    var dialogBox = document.getElementById("dialog-box");
    dialog.style.opacity = 0;
    dialogBox.style.marginTop = "-500px";
    dialog.style.display = "block";
    dialog.style.visibility = "visible";

    setTimeout(function () {
        dialog.style.opacity = 1;
        dialogBox.style.marginTop = "64px";
    }, 200);
}

function hideDialog() {
    var dialog = document.getElementById("dialog");
    var dialogBox = document.getElementById("dialog-box");
    dialog.style.opacity = 0;
    dialogBox.style.marginTop = "-500px";

    setTimeout(function () {
        dialog.style.visibility = "collapse";
        //dialog.style.display = "none";
    }, 500);
}


/////// Check region

function checkButtonClick() {
    if (gameOn) {
        timer += 60;
        var currentGrid = [];
        var table = document.getElementById("puzzle-grid");
        for (var i = 0; i < 9; i++) {
            currentGrid.push("");
            for (var j = 0; j < 9; j++) {
                var input = table.rows[i].cells[j].getElementsByTagName('input')[0];
                if (input.value == "" || input.value.length > 1 || input.value == "0") {
                    input.value = ""
                    currentGrid[i] += "0";
                }
                else
                    currentGrid[i] += input.value;
            }
        }
        var columns = getColomns(currentGrid);
        var blocks = getBlocks(currentGrid);

        var errors = 0;
        var rights = 0;
        for (var i = 0; i < currentGrid.length; i++) {
            for (var j = 0; j < currentGrid[i].length; j++) {
                if (currentGrid[i][j] == "0")
                    continue;
                var result = checkValue(i, j, currentGrid, columns, blocks);
                var input = table.rows[i].cells[j].getElementsByTagName('input')[0];
                input.classList.remove("right-cell");
                input.classList.remove("worning-cell");
                input.classList.remove("wrong-cell");
                if (result === 1) {
                    input.classList.add("right-cell");
                    rights++;
                } else if (result === 2) {
                    input.classList.add("worning-cell");
                } else if (result === 3) {
                    input.classList.add("wrong-cell");
                    errors++;
                } else if (result == 0) {
                    rights++;
                }
            }
        }
        if (rights === 81) {
            gameOn = false;
            pauseTimer = true;
            ocument.getElementById("game-difficulty").innerText = "Solved";
            clearInterval(intervalId);
            alert("Congrats, You solved it.");
        }
        if (errors === 0 && rights === 0) {
            alert("Congrats, You solved it, but this is not the solution that I want.");
        }
    }
}

function checkValue(i, j, rows, columns, blocks) {
    if (!(rows[i][j] > '0' && rows[i][j] < ':'))
        return 3;
    if (puzzle[i][j] === rows[i][j])
        return 0;
    if ((rows[i].indexOf(rows[i][j]) != rows[i].lastIndexOf(rows[i][j]))
        || (columns[j].indexOf(rows[i][j]) != columns[j].lastIndexOf(rows[i][j]))
        || (blocks[Math.floor(i / 3) * 3 + Math.floor(j / 3)].indexOf(rows[i][j]) != blocks[Math.floor(i / 3) * 3 + Math.floor(j / 3)].lastIndexOf(rows[i][j]))) {
        return 3;
    }
    if (solution[i][j] !== rows[i][j])
        return 2;
    return 1;
}


function updateRemainingTable() {
    for (var i = 1; i < 10; i++) {
        var item = document.getElementById("remain-" + i);
        item.innerText = remaining[i - 1];
        item.classList.remove("red");
        item.classList.remove("gray");
        if (remaining[i - 1] === 0)
            item.classList.add("gray");
        else if (remaining[i - 1] < 0 || remaining[i - 1] > 9)
            item.classList.add("red");
    }
}

function startTimer() {
    var timerDiv = document.getElementById("timer");
    clearInterval(intervalId);
    intervalId = setInterval(function () {
        if (!pauseTimer) {
            timer++;
            var min = Math.floor(timer / 60);
            var sec = timer % 60;
            timerDiv.innerText = (("" + min).length < 2 ? ("0" + min) : min) + ":" + (("" + sec).length < 2 ? ("0" + sec) : sec);
        }
    }, 1000);
}
function pauseGameButtonClick() {
    var icon = document.getElementById("pauseIcon");
    var text = document.getElementById("pauseText");
    var table = document.getElementById("puzzle-grid");
    if (pauseTimer) {
        icon.innerText = "pause";
        text.innerText = "Pause";
        table.style.opacity = 1;
    }
    else {
        icon.innerText = "play_arrow";
        text.innerText = "Continue";
        table.style.opacity = 0;
    }

    pauseTimer = !pauseTimer;
}