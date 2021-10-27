import GlobalVars from "./GlobalVars";
import Pathfinding2 from "./Pathfinding2";
import Ball from "./Ball";

export default class Board {
    // Foreign classes
    gv: GlobalVars;
    pathfinding2: Pathfinding2;

    // Class parameters
    gameBoard: HTMLDivElement;
    incoming: HTMLDivElement;
    gameTable: HTMLTableElement;
    preview: HTMLDivElement;

    // HTML elements
    incomingBalls: Ball[];
    gameBalls: Ball[];

    constructor(globalVars: GlobalVars) {

        this.gv = globalVars;
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
                field.addEventListener("mouseenter", this.hoverTile.bind(this))
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
        // console.log("clickTile");
        let id: string = target.id;
        let el: HTMLDivElement = document.getElementById(id) as HTMLDivElement;
        console.log(el.parentNode);


        // Start pathfinding when an empty field is clicked
        // console.log(target.parentNode.childElementCount);
        // console.log(this.gv.width);
        // console.log(this.gv.selectedBall);
        if (el.childElementCount == 1 || el.parentNode.childElementCount == 1) {
            this.gv.validStart = true;
        }

        if (this.gv.validStart == true) {
            console.log(el.childElementCount, el.parentNode.childElementCount);

            if (this.gv.selectedBall != undefined) {
                console.log("Począteeeeek");

                this.gv.mouseOverPathfinding = true;
                this.gv.validStart = false;
            } else {
                console.log("No balls");
                this.gv.selectedBall = undefined;
                this.gv.mouseOverPathfinding = false;
                // this.gv.validStart = false;
            }
        } else {
            console.log("Koniecccc");
            this.gv.validStart = true;
            let temp: number[] = this.gv.selectedBall;
            this.gv.selectedBall = undefined;
            this.gv.mouseOverPathfinding = false;

            // Shut off the game for a second
            this.gv.ballsCanBeSelected = false;
            this.updateSelectionColor()
            setTimeout(() => {
                console.log("ez");
                this.pathfinding2.clearColoring();
                this.performMove(temp, this.pathfinding2.lastNodeCoords)
                // Scout for matches on the board

                // add new balls
                this.ballsToBoard();
                console.clear();
                // scout for matches after computer added new balls
                this.matchVertically();
                // Enable ball selection
                this.gv.ballsCanBeSelected = true;
            }, 2000);
        }

    }

    /**
     * Displays path on hover
     * @param e event
     */
    hoverTile(e: Event) {
        let target: HTMLDivElement = e.target as HTMLDivElement;
        let id: string = target.id;

        if (this.gv.mouseOverPathfinding) {
            // console.log(this.gv.validStart, id);
            if (this.gv.selectedBall != undefined) {
                if (!this.gv.pathfindingDone) {
                    if (target.parentNode.childElementCount == this.gv.width) {
                        // console.log(Board.idToArray(id));
                        this.pathfinding2.setValues(Board.arrayToId(this.gv.selectedBall), id);
                        this.pathfinding2.start();
                        this.gv.pathfindingDone = true
                    }
                } else {
                    if (target.childElementCount == 0) {
                        if (target.parentNode.childElementCount == this.gv.width) {
                            this.pathfinding2 = new Pathfinding2(this.gv)
                            this.pathfinding2.setValues(Board.arrayToId(this.gv.selectedBall), id);
                            this.pathfinding2.start();
                        }
                    }
                }
            }

        }
        // else {
        //     console.log("Nie");

        // }
    }

    /**
     * Updates the preview color of the path to the selection one
     */
    updateSelectionColor() {
        for (let y = 0; y < this.gv.height; y++) {
            for (let x = 0; x < this.gv.width; x++) {
                let div = document.getElementById(Board.arrayToId([y, x]))
                if (div.style.backgroundColor == this.gv.pathProjectionColor) {
                    div.style.backgroundColor = this.gv.pathSelectionColor;
                }
            }
        }
    }

    /**
     * Performs a move of a ball to the selected location
     * @param ballCoords original position
     */
    performMove(ballCoords: number[], target: number[]) {
        // console.log(ballCoords, target);

        let ballToMove: Ball = this.gv.ballsOnBoard.filter((el) => {
            return el.y == ballCoords[0] && el.x == ballCoords[1];
        })[0]
        let ballIndex = this.gv.ballsOnBoard.indexOf(ballToMove);
        let originEl = document.getElementById(Board.arrayToId(ballCoords))
        let targetEl = document.getElementById(Board.arrayToId(target))

        // console.log(this.gv.ballsOnBoard, ballIndex, ballToMove, originEl, targetEl);

        // change their div position 
        originEl.removeChild(ballToMove.ball);
        targetEl.appendChild(ballToMove.ball);
        // change their position in globalVars
        this.gv.ballsOnBoard[ballIndex].y = target[0];
        this.gv.ballsOnBoard[ballIndex].x = target[1];
        // Unselect the ball
        this.gv.ballsOnBoard[ballIndex].unSelect();

        // console.log(this.gv.ballsOnBoard, ballIndex, ballToMove, originEl, targetEl);
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

    matchVertically() {
        console.log("Matching vertically");
        // console.log(this.gv.ballsOnBoard);


        let ballsToDelete: Ball[][] = []
        for (let x: number = 0; x < this.gv.width; x++) {
            let sameColors: Ball[] = []
            // console.log('==================');


            for (let y: number = 0; y < this.gv.height; y++) {
                let el: HTMLDivElement = document.getElementById(Board.arrayToId([y, x])) as HTMLDivElement

                // If there is a ball inside
                if (el.childElementCount > 0) {
                    let ball: Ball = this.gv.ballsOnBoard.find((el) => { return el.y == y && el.x == x })
                    // Weird error with different ball.color attibute and actual background color
                    // ball.color = ball.ball.style.backgroundColor;
                    // console.log("test: ", ball.color, ball.ball.style.backgroundColor);
                    // Konsola przekłamuje wartości? działa, mimo, że konsola pokazuje, że nie działa

                    // If this is the first occurence
                    if (sameColors.length == 0) {
                        // console.log("1) ");
                        sameColors.push(ball)

                        // Else - There are already balls in the array
                    } else {
                        // As long as colors match with the last one, append:
                        if (sameColors[sameColors.length - 1].color == ball.color) {
                            // console.log("2) ");
                            sameColors.push(ball)
                        } else {
                            // console.log("3) ");
                            // console.log("Colors not matching");
                            // console.log("przed", ballsToDelete, sameColors, ball);
                            if (sameColors.length >= this.gv.matchingBalls) {
                                ballsToDelete.push(sameColors);
                            }
                            sameColors = [];
                            sameColors.push(ball)
                            // console.log("po", ballsToDelete, sameColors, ball);
                        }
                    }
                }
            }
            if (sameColors.length >= this.gv.matchingBalls) {
                ballsToDelete.push(sameColors);
            }
        }
        console.log(ballsToDelete);

    }
}