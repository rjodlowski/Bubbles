import Ball from "./Ball";
import INode from "./iNode";

export default class GlobalVars {
    // HTML elements
    table: HTMLTableElement;
    main: HTMLDivElement;

    // Game data
    gameData: Object = {};
    height: number = 10;
    width: number = 10;
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

    constructor() {
        // Something
        this.main = document.getElementById("main") as HTMLDivElement;
    }

}