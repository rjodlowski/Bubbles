import Ball from "./Ball";

export default class GlobalVars {
    // HTML elements
    table: HTMLTableElement;
    main: HTMLDivElement;

    // Game data
    gameData: Object = {};
    readonly height: number = 10;
    readonly width: number = 10;
    wallAmount: number = 4;
    sfClicked: number = 0; // start-finish-Clicked
    wallCoords: number[][];
    sCoords: number[]; // Start field coordinates
    fCoords: number[]; // Finish field coordinates
    finalPath: number[][]; // Path from start to finish
    area: number = this.height * this.width; // Total area of a map

    ballColors: string[] = [
        "red",
        "green",
        "blue",
        "orange",
        "yellow",
        "black",
    ];
    incomingBalls: Ball[] = [];
    ballsOnBoard: Ball[] = [];
    ballsPerRound: number = 3;
    ballCount: number = 0; // Amount of all balls in the game (incoming + on board)
    ballsCanBeSelected: boolean = true; // Enables click event on every ball
    selectedBall: number[] = undefined;


    pathfindingDone: boolean = false;
    colorStartFound: boolean = false;

    // Colors
    colorFind: boolean = false; // [R, G]
    pathProjectionColor: string = "red";
    pathSelectionColor: string = "grey";

    mouseOverPathfinding: boolean = false;
    validStart: boolean = true;


    constructor() {
        // Something
        this.main = document.getElementById("main") as HTMLDivElement;
    }

}