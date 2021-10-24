import Board from "./Board";
import Pathfinding from "./Pathfinding";
import GlobalVars from "./GlobalVars";
import Ball from "./Ball";

class Main {
    private _board: Board;
    private _pathfinding: Pathfinding;
    private gameData: Object = {};
    gv: GlobalVars;

    constructor(globalVars: GlobalVars) {
        console.log("class Main created");

        this._pathfinding = new Pathfinding(globalVars);
        this._board = new Board(globalVars, this._pathfinding);
        this.gv = globalVars;
    }

    setIncoming() {
        for (let i: number = 0; i < this.gv.ballsPerRound; i++) {

            // let ball:Ball = new Ball(this.gv, );
        }
    }

    main() {
        // console.log(this._board);
        // console.log(this._pathfinding);

        this._board.generate();
        this._board.generateIncoming();
        this._board.ballsToBoard();
        // this._board.setWalls();
    }
}

;
new Main(new GlobalVars()).main();

