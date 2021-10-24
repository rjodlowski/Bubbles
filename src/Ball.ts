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
        this.ball.style.backgroundColor = this.color;
        this.ball.setAttribute("color", this.color);

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
        console.log("Ball selected");
        // console.log(`Balls can be selected: ${this.gv.ballsCanBeSelected}`);

        if (this.gv.ballsCanBeSelected) {
            if (!this.selected) {
                if (this.gv.selectedBall == undefined) {
                    this.selected = !this.selected
                    this.ball.classList.add("ball-selected");
                    this.gv.selectedBall = [this.y, this.x]
                } else {
                    console.log("You have a ball selected!");
                }
            } else {
                this.selected = !this.selected
                this.ball.classList.remove("ball-selected")
                this.gv.selectedBall = undefined;
            }

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

}