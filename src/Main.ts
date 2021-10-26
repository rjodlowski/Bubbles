import Board from "./Board";
import GlobalVars from "./GlobalVars";
import Ball from "./Ball";

class Main {
    private _board: Board;
    private gameData: Object = {};
    gv: GlobalVars;

    constructor(globalVars: GlobalVars) {
        this._board = new Board(globalVars);
        this.gv = globalVars;
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

