function newGame() {
    var k = document.getElementById("sudoku");
    var p = document.createElement("p");
    var grid = getGridInit();

    var rows = grid;
    var cols = getColomns(grid);
    var blks = getBlocks(grid);

    var psNum = generatePossibleNumber(rows, cols, blks);
    var sol = solveGrid(psNum, rows);

    var puzzle = makeItPuzzle(sol, 3);
    //var PRow = generatePossibleRows(psNum);

    p.innerText = grid + "\n" + sol + "\n" + puzzle;
    k.appendChild(p);
}

function getColomns(grid) {
    var result = [];
    for (var i in grid) {
        for (var j in grid[i]) {
            result[j] += grid[i][j];
        }
    }
    return result;
}

function getBlocks(grid) {
    var result = [];
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++)
            result[(i / 3) * 3 + (j / 3)] += grid[i][j];
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
                    if (!rows[i].includes(k) && !colomns[j].includes(k) && !blocks[((i / 3) * 3) + (j / 3) % 3].includes(k))
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
            var col = ["", "", "", "", "", "", "", "", ""];
            for (var i = 0; i < 9; i++)
                for (var j = 0; j < 9; j++)
                    col[i] += solotion[j][i];
            var sub_arr = [];
            for (var i = 0; i < 9; i++)
                for (var j = 0; j < 9; j++)
                    sub_arr[(i / 3) * 3 + (j / 3)] += solotion[i][j];
            var poss = generatePossibleNumber(solotion, col, sub_arr);
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

newGame();