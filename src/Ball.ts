import GlobalVars from "./GlobalVars";
import Board from "./Board";

export default class Ball {
    // Foreign classes
    gv: GlobalVars;
    _board: Board;

    // Class parameters
    x: number;
    y: number;
    color: string;
    selected: boolean;
    toDelete: boolean;

    // HTML elements
    ball: HTMLDivElement;

    constructor(globalVars: GlobalVars, board: Board) {
        // console.log("Ball created");

        this.gv = globalVars;
        this._board = board;

        this.selected = false;
        this.color = this.gv.ballColors[Math.floor(Math.random() * this.gv.ballColors.length)];

        this.generateBall();
    }

    /**
     * Generates this ball's template
     */
    generateBall() {
        // Create element
        this.ball = document.createElement("div");
        this.ball.className = "ball";
        // this.ball.setAttribute("color", this.color);
        this.ball.style.backgroundColor = this.color;
        console.log(this.color, this.ball.style.backgroundColor);

        // Assign id
        this.ball.id = `ball${this.gv.ballCount}`;
        this.gv.ballCount++;
    }

    /**
     * Add a ball to the desired destination
     * @param destination "main" or "incoming"
     */
    addTo(destination: string) {
        switch (destination) {
            case "main":
                // console.log("Appending ball to the gameboard");

                // Modify ball's properties
                this.ball.addEventListener("click", this.selectBall.bind(this));
                this.ball.classList.remove("ball-preview");

                let fieldId: string;
                do {
                    this.x = Math.floor(Math.random() * this.gv.width);
                    this.y = Math.floor(Math.random() * this.gv.height);

                    fieldId = Board.arrayToId([this.y, this.x]);

                } while (!Board.checkIfFieldOccupied(fieldId))

                let fieldToAddTo: HTMLDivElement = document.getElementById(fieldId) as HTMLDivElement;
                // console.log("Ball to table, coords: ", this.y, this.x);

                fieldToAddTo.appendChild(this.ball);
                this.gv.ballsOnBoard.push(this)

                break;

            case "incoming":
                let incomingDiv: HTMLDivElement = document.getElementById("incoming") as HTMLDivElement;
                this.ball.classList.add("ball-preview");
                incomingDiv.appendChild(this.ball);

                break;

            default:
                console.log(`Unknown destination: ${destination}`);
                break;
        }
    }

    /**
     * Selects a ball.
     * Adds/removes "ball-selected" class.
     */
    selectBall() {
        // console.log("Ball selected");
        // console.log(`Balls can be selected: ${this.gv.ballsCanBeSelected}`);

        if (this.gv.ballsCanBeSelected) {
            // console.log("balls can be selected")
            // console.log(this.selected);
            // console.log(this.gv.selectedBall);
            // console.log(this.gv.ballsOnBoard);


            if (!this.selected) {
                // console.log("selecting ball");
                // Remove all selected classes
                let a = this.gv.ballsOnBoard.filter((el) => { return el.selected == true })
                if (a.length > 0) {
                    a[0].ball.classList.remove("ball-selected");
                    a[0].selected = false;
                    this._board.pathfinding2.clearColoring();
                }

                // Select ball
                this.selected = true;
                this.gv.selectedBall = [this.y, this.x];
                this.ball.classList.add("ball-selected");
            } else {
                // console.log("Unselect ball");
                this.selected = false;
                this.gv.selectedBall = undefined;
                this.ball.classList.remove("ball-selected");
                this._board.pathfinding2.clearColoring();
            }
            // console.log("sel after: ", this.gv.ballsOnBoard, this.gv.selectedBall);
        }
    }

    /**
     * @param to destination's id
     */
    moveBall(to: string) {
        let destinationField: HTMLDivElement = document.getElementById(to) as HTMLDivElement;
        let currParent: HTMLDivElement = this.ball.parentNode as HTMLDivElement;

        currParent.removeChild(this.ball);
        destinationField.appendChild(this.ball)
    }

    unSelect() {
        this.selected = false;
        this.gv.selectedBall = undefined;
        this.ball.classList.remove("ball-selected");
        this._board.pathfinding2.clearColoring();
    }

}