import GlobalVars from "./GlobalVars";
import Pathfinding from "./Pathfinding";
import Pathfinding2 from "./Pathfinding2";
import Ball from "./Ball";

export default class Board {
    // Foreign classes
    gv: GlobalVars;
    pathfinding: Pathfinding
    pathfinding2: Pathfinding2;

    // Class parameters
    gameBoard: HTMLDivElement;
    incoming: HTMLDivElement;
    gameTable: HTMLTableElement;
    preview: HTMLDivElement;

    // HTML elements
    incomingBalls: Ball[];
    gameBalls: Ball[];

    constructor(globalVars: GlobalVars, pathfindingClass: Pathfinding) {
        console.log("class Board created");

        this.gv = globalVars;
        this.pathfinding = pathfindingClass;
        this.pathfinding2 = new Pathfinding2(this.gv);

        this.gameBoard = document.getElementById("main") as HTMLDivElement;
        this.incoming = document.getElementById("incoming") as HTMLDivElement;
        this.gameTable = document.getElementById("gametable") as HTMLTableElement
        this.preview = document.getElementById("preview") as HTMLDivElement;
        // console.log(this.gv);

        this.incomingBalls = []
        this.gameBalls = [];
    }

    /**
     * Generates the main table of divs,
     * temporarily also the "More button"
     */
    generate() {
        let table: HTMLDivElement = document.createElement("div");
        table.id = "gameTable";

        for (let i: number = 0; i < this.gv.height; i++) {
            let row: HTMLDivElement = document.createElement("div");
            row.classList.add("row");

            for (let j: number = 0; j < this.gv.width; j++) {
                let field: HTMLDivElement = document.createElement("div");
                field.classList.add("field")
                field.id = `${i}-${j}`;
                field.classList.add("flex-center")
                field.addEventListener("click", this.clickTile.bind(this))
                // field.innerText = "0";
                // field.addEventListener("click", this.setStartFinish.bind(this));
                row.appendChild(field);
            }
            table.appendChild(row);
        }
        this.gv.main.appendChild(table);

        // add balls btn - delete later
        let a: HTMLButtonElement = document.createElement("button")
        a.addEventListener("click", this.ballsToBoard.bind(this));
        a.innerText = "More";
        this.preview.appendChild(a);
    };

    clickTile(e: Event) {
        let target: HTMLDivElement = e.target as HTMLDivElement;
        // console.log(target);
        console.log("clickTile");
        let id: string = target.id;

        // Start pathfinding when an empty field is clicked
        console.log(target.parentNode.childElementCount);
        console.log(this.gv.width);
        console.log(this.gv.selectedBall);


        if (this.gv.selectedBall != undefined) {
            if (!this.gv.pathfindingDone) {
                if (target.parentNode.childElementCount == this.gv.width) {
                    console.log(Board.idToArray(id));
                    this.pathfinding2.setValues(Board.arrayToId(this.gv.selectedBall), id);
                    this.pathfinding2.start();
                    this.gv.pathfindingDone = true
                }
            } else {
                if (target.parentNode.childElementCount == this.gv.width) {
                    this.pathfinding2 = new Pathfinding2(this.gv)
                    this.pathfinding2.setValues(Board.arrayToId(this.gv.selectedBall), id);
                    this.pathfinding2.start();
                }
            }
        }
    }

    /**
     * Function converting string div id to a table of coords
     * @param id string id -> "y-x"
     * @returns coords -> [y, x]
     */
    public static idToArray(id: string) {
        // console.log("conversion", id);
        let splitTable: string[] = id.split("-");
        let Y = parseInt(splitTable[0]);
        let X = parseInt(splitTable[1]);

        return [Y, X];
    };

    /**
     * Generates balls and places them in the incoming box;
     * Those have no ability to be selected;
     */
    generateIncoming() {
        console.log("Generating incoming balls");

        for (let i: number = 0; i < this.gv.ballsPerRound; i++) {
            let ball = new Ball(this.gv, this);
            this.incomingBalls.push(ball);
            ball.addTo("incoming");
        }
    }

    /**
     * Moves balls from incoming box to the gameboard
     */
    ballsToBoard() {
        console.log("Moving balls");

        for (let i: number = 0; i < this.gv.ballsPerRound; i++) {
            // console.log(this.incomingBalls);
            // Remove from incoming
            let ball = this.incomingBalls.pop();
            this.incoming.removeChild(ball.ball);

            // Append to gameTable
            ball.addTo("main");
        }

        // console.log(this.incomingBalls);
        this.generateIncoming();
    }

    /**
     * Converts array of coords to string div id
     * @param array [y, x]
     * @returns id: "y-x"
     */
    public static arrayToId(array: number[]) {
        return `${array[0]}-${array[1]}`
    };

    /**
     * Checks if the desired ball's position is occupied
     * @param fieldId string "y-x"
     * @returns bool ifOccupied
     */
    public static checkIfFieldOccupied(fieldId: string) {
        let field: HTMLDivElement = document.getElementById(fieldId) as HTMLDivElement;

        if (field.childElementCount > 0) {
            // Field has a ball in it
            return false;
        } else {
            // Field has no children - is free
            return true;
        }
    }



    // setWalls() {
    //     let xCoords: number[][] = []

    //     for (let i: number = 0; i < this.gv.wallAmount; i++) {
    //         let randomY: number = Math.floor(Math.random() * this.gv.height);
    //         let randomX: number = Math.floor(Math.random() * this.gv.width);
    //         let field: HTMLTableCellElement = document.getElementById(`${randomY}-${randomX}`) as HTMLTableCellElement;
    //         if (field.innerText == "X") {
    //             i--;
    //         } else {
    //             field.innerText = "X";
    //             xCoords.push([randomY, randomX])
    //         }
    //     }
    //     this.gv.wallCoords = xCoords;
    //     // console.log(this.gv);
    // };

    // setStartFinish(event: Event) {
    //     // console.log(this.gv);

    //     let target: HTMLTableElement = event.target as HTMLTableElement
    //     let cell: HTMLTableCellElement = document.getElementById(target.id) as HTMLTableCellElement;

    //     if (cell.innerText == "X") {
    //         console.log("No");
    //     } else if (cell.innerText != "S" && cell.innerText != "T") {
    //         switch (this.gv.sfClicked) {
    //             case 0:
    //                 cell.innerText = "S";
    //                 this.gv.sCoords = Board.idToArray(cell.id);
    //                 break;

    //             case 1:
    //                 cell.innerText = "M";
    //                 this.gv.fCoords = Board.idToArray(cell.id);
    //                 console.log(this);
    //                 this.pathfinding.find([this.gv.sCoords], 1);
    //                 break;

    //             default:
    //                 console.log("No more clicking");
    //                 console.log(this.gv);
    //                 break;
    //         }
    //         this.gv.sfClicked++;
    //     } else {
    //         console.log("Field already occupied!");
    //     }
    // };

}