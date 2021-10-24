import GlobalVars from "./GlobalVars";
import Board from "./Board";

export default class Pathfinding {
    gv: GlobalVars;

    constructor(globalVars: GlobalVars) {
        console.log("class Pathfinding created");
        this.gv = globalVars;
    }

    public find(array: number[][], iteration: number) {
        console.log("pathfinding start");
        console.log("given array", array);

        let newArray: number[][] = [];
        let endFound: boolean = false;

        for (let i: number = 0; i < array.length; i++) {
            let currField: number[] = array[i];
            console.log(currField);

            // Search above
            if (currField[0] != 0) {
                let a: HTMLTableCellElement = document.getElementById(`${currField[0] - 1}-${currField[1]}`) as HTMLTableCellElement;
                console.log("top", a.id);
                if (a.innerText == "M") {
                    endFound = true;
                } else if (a.innerText == (0).toString()) {
                    a.innerText = iteration.toString();
                    newArray[newArray.length] = Board.idToArray(a.id);
                }
            }
            // Search below
            if (currField[0] < this.gv.height - 1) {
                let a: HTMLTableCellElement = document.getElementById(`${currField[0] + 1}-${currField[1]}`) as HTMLTableCellElement;
                console.log("bot", a);
                if (a.innerText == "M") {
                    endFound = true;
                } else if (a.innerText == (0).toString()) {
                    a.innerText = iteration.toString();
                    newArray[newArray.length] = Board.idToArray(a.id);

                }

            }
            // Search left
            if (currField[1] != 0) {
                let a: HTMLTableCellElement = document.getElementById(`${currField[0]}-${currField[1] - 1}`) as HTMLTableCellElement;
                console.log("left", a);
                if (a.innerText == "M") {
                    endFound = true;
                } else if (a.innerText == (0).toString()) {
                    a.innerText = iteration.toString();
                    newArray[newArray.length] = Board.idToArray(a.id);

                }

            }
            // Search below
            if (currField[1] < this.gv.width - 1) {
                let a: HTMLTableCellElement = document.getElementById(`${currField[0]}-${currField[1] + 1}`) as HTMLTableCellElement;
                console.log("right", a);
                if (a.innerText == "M") {
                    endFound = true;
                } else if (a.innerText == (0).toString()) {
                    a.innerText = iteration.toString();
                    newArray[newArray.length] = Board.idToArray(a.id);

                }
            }
        }

        iteration++
        console.log(newArray, iteration);
        if (!endFound && newArray.length > 0) {
            this.find(newArray, iteration);
        } else {
            this.drawPath()
        }

    }

    drawPath() {
        console.log("end found!");
        let a: HTMLTableCellElement = document.getElementById(Board.arrayToId(this.gv.fCoords)) as HTMLTableCellElement;
        console.log(a);
        this.findSiblingWithLowestNumber(this.gv.fCoords, [])
        console.log("outside");

        // console.log(this.gv.finalPath);
        let fp: number[][] = this.gv.finalPath;
        if (this.checkIfFinishAccessible()) {
            for (let i: number = 0; i < fp.length; i++) {
                document.getElementById(`${fp[i][0]}-${fp[i][1]}`).style.backgroundColor = "red";
            }
            document.getElementById(`${this.gv.sCoords[0]}-${this.gv.sCoords[1]}`).style.backgroundColor = "red";
            document.getElementById(`${this.gv.fCoords[0]}-${this.gv.fCoords[1]}`).style.backgroundColor = "red";
        } else {
            console.log("Nie dla psa");
        }
    }

    checkIfFinishAccessible() {
        let finishPosition: number[] = this.gv.fCoords;
        let sidesAccessible: number = 4;

        if (finishPosition[0] != 0) {
            if (document.getElementById(`${finishPosition[0] - 1}-${finishPosition[1]}`).innerHTML == "X") {
                sidesAccessible--;
            }
        } else {
            sidesAccessible--;
        }
        if (finishPosition[0] < this.gv.width - 1) {
            if (document.getElementById(`${finishPosition[0] + 1}-${finishPosition[1]}`).innerHTML == "X") {
                sidesAccessible--;
            }
        } else {
            sidesAccessible--;
        }
        if (finishPosition[1] != 0) {
            if (document.getElementById(`${finishPosition[0]}-${finishPosition[1] - 1}`).innerHTML == "X") {
                sidesAccessible--;
            }
        } else {
            sidesAccessible--;
        }
        if (finishPosition[1] < this.gv.height - 1) {
            if (document.getElementById(`${finishPosition[0]}-${finishPosition[1] + 1}`).innerHTML == "X") {
                sidesAccessible--;
            }
        } else {
            sidesAccessible--;
        }

        console.log("sides");
        console.log(sidesAccessible);
        if (sidesAccessible != 0) {
            return true;
        } else {
            return false;
        }
    }

    findSiblingWithLowestNumber(fieldId: number[], path: number[][]) {
        let startFound: boolean = false;
        let numberArray: number[] = [];
        let positionArray: number[][] = [];

        // Search top
        if (fieldId[0] != 0) {
            let a: HTMLTableCellElement = document.getElementById(`${fieldId[0] - 1}-${fieldId[1]}`) as HTMLTableCellElement;
            if (a.innerText != "S") {
                if (a.innerText != "0") {
                    if (a.innerText == "X" || a.innerText == "M") {
                        numberArray.push(this.gv.area);
                    } else {
                        numberArray.push(parseInt(a.innerText))
                    }
                    positionArray[positionArray.length] = Board.idToArray(a.id);
                }
            } else {
                startFound = true;
            }
        }
        // Search bot
        if (fieldId[0] < this.gv.height - 1) {
            let a: HTMLTableCellElement = document.getElementById(`${fieldId[0] + 1}-${fieldId[1]}`) as HTMLTableCellElement;
            if (a.innerText != "S") {
                if (a.innerText != "0") {
                    if (a.innerText == "X" || a.innerText == "M") {
                        numberArray.push(this.gv.area);
                    } else {
                        numberArray.push(parseInt(a.innerText))
                    }
                    positionArray[positionArray.length] = Board.idToArray(a.id);
                }
            } else {
                startFound = true;
            }
        }
        // Search left
        if (fieldId[1] != 0) {
            let a: HTMLTableCellElement = document.getElementById(`${fieldId[0]}-${fieldId[1] - 1}`) as HTMLTableCellElement;
            if (a.innerText != "S") {
                if (a.innerText != "0") {
                    if (a.innerText == "X" || a.innerText == "M") {
                        numberArray.push(this.gv.area);
                    } else {
                        numberArray.push(parseInt(a.innerText))
                    }
                    positionArray[positionArray.length] = Board.idToArray(a.id);
                }
            } else {
                startFound = true;
            }
        }
        // Search right
        if (fieldId[1] < this.gv.width - 1) {
            let a: HTMLTableCellElement = document.getElementById(`${fieldId[0]}-${fieldId[1] + 1}`) as HTMLTableCellElement;
            if (a.innerText != "S") {
                if (a.innerText != "0") {
                    if (a.innerText == "X" || a.innerText == "M") {
                        numberArray.push(this.gv.area);
                    } else {
                        numberArray.push(parseInt(a.innerText))
                    }
                    positionArray[positionArray.length] = Board.idToArray(a.id);
                }
            } else {
                startFound = true;
            }
        }

        console.log("results:");
        console.log(numberArray);
        console.log(positionArray);
        console.log(Math.min(...numberArray));

        let s: number = Math.min(...numberArray);
        let index: number = numberArray.indexOf(s);
        // console.log(index);
        let fieldWithLowestNumber = positionArray[index]

        console.log("path:");
        console.log(path);
        console.log(startFound);

        if (!startFound) {
            path[path.length] = fieldWithLowestNumber;

            console.log("next step");
            console.log(fieldWithLowestNumber, path);

            this.findSiblingWithLowestNumber(fieldWithLowestNumber, path)

        } else {
            console.log("Koniecccccccccc");
            console.log(path);
            this.gv.finalPath = path;
            console.log("inside:");
            console.log(this.gv.finalPath);
        }
    }
}