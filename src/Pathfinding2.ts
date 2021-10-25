import GlobalVars from "./GlobalVars";
import Board from "./Board";
import INode from "./interfaces/INode";
import IPathfinding from "./interfaces/IPathfinding";
import IGetCost from "./interfaces/IGetCost";

/**
 * Directions: top, bottom, left, right (no diagonal fields)
 * 
 * Get the starting node's id (Board.idToArray(ball's position))
 * Get the end node's position (id of a field cursor's hovering on)
 * Operations on a pair of coordinates -> [y, x]
 * Then it's translated to the correct divs (path coloring)
 *      Either this is coloring divs or the 2d array of [y, x] coords is returned
 *      and the Board class colors suitable fields
 * 
 * Methods: 
 * getOpenLowestF => gets a node with the lowest F cost from the OPEN table
 * checkIfEndNode => checks, if current node is the end one
 * getneighbours => gets all neighbours {INode} of the current node
 * 
*/

export default class Pathfinding2 implements IPathfinding {
    gv: GlobalVars;

    startNode: INode;
    endNode: INode;
    current: INode;

    startCoords: number[];
    endCoords: number[];

    open: INode[];
    closed: INode[];
    neighbours: INode[];

    iterations: number;
    currIterations: number;
    interval: ReturnType<typeof setInterval>
    colorBackInterval: ReturnType<typeof setInterval>

    isFound: boolean;
    colorFind: boolean;

    getFCost: () => number;
    getHCost: IGetCost;
    getGCost: IGetCost;

    constructor(globalVars: GlobalVars) {
        console.log("class Pathfinding2 - A* created");
        this.gv = globalVars;
        this.gv.colorStartFound = false;

        this.startNode, this.endNode;
        this.open = [];
        this.closed = [];

        this.iterations = 4;
        this.currIterations = 0;
        this.isFound = false

        this.colorFind = this.gv.colorFind;
    }

    /**
     * Sets the initial values of the whole pathfinding
     * @param startId 
     * @param endId 
     */
    setValues(startId: string, endId: string) {
        console.log("setting values");

        this.startCoords = Board.idToArray(startId);
        this.endCoords = Board.idToArray(endId);
        this.startNode = this.createNode(startId);
        this.endNode = this.createNode(endId);
        this.clearColoring()
        this.prepareStart();
    }

    /**
     * Sets starting elements
     */
    prepareStart() {
        // set starting node as the current one
        let node = {
            y: this.startCoords[0],
            x: this.startCoords[1],
            stringId: Board.arrayToId(this.startCoords),
            field: document.getElementById(Board.arrayToId(this.startCoords)) as HTMLDivElement,
            g: 0,
            h: 0,
            f: 0,
            isBall: true,
            parent: undefined,
        } as INode;

        this.open.push(node);
    }

    /**
     * Main body of the A* pathfinding algorithm
     */
    start() {
        console.log("Start of the pathfinding algorithm");
        console.log(this);
        // console.clear();

        // 1) loop
        while (!this.isFound) {
            // this.interval = setInterval(function () {

            // if (this.currIterations < this.iterations) {
            // 2) current - node in OPEN with the lowest f_cost
            this.current = this.getOpenLowestF();
            // If there is a path to the end node
            if (this.current != undefined) {
                // console.log(this.current.field);
                // console.log(this.current.f);

                // console.log("1)", this.current);
                if (this.colorFind) this.current.field.style.backgroundColor = "red";
                let index: number = this.open.indexOf(this.current);
                // console.log("2.5)", index);

                // 3) + 4) Remove current from OPEN and add to CLOSED
                // console.log(this.open, this.closed);
                let node = this.open.splice(index, 1)
                this.closed.push(node[0]);
                // console.log(this.open, this.closed);

                // 5) If current is the target node
                if (this.current.y == this.endNode.y && this.current.x == this.endNode.x) {
                    console.log("End node found");
                    this.isFound = true;
                    // 6) return -> color the path (how to know which one?? -> parents??)
                    // break;
                    clearInterval(this.interval)

                    // Mark end node found
                    if (this.colorFind) this.current.field.style.backgroundColor = "orange";
                    this.goBack(this.current)
                }
                this.neighbours = this.getNeighbours();
                // 7) foreach neighbour of the current node

                for (let i: number = 0; i < this.neighbours.length; i++) {
                    let neighbour: INode = this.neighbours[i];
                    let cIncludes = this.including(this.closed, neighbour)
                    // console.log("7) CLOSED includes: ", cIncludes);

                    // 8) if neighbour is not traversable or neighbour is in CLOSED
                    if (neighbour.isBall) {
                        // 9) skip to the next neighbour
                        // console.log("Balls!");
                        continue;

                    } else if (cIncludes) {
                        // console.log("Next!");
                        continue;

                    }

                    let oIncludes = this.including(this.open, neighbour)
                    // 10) if new path to neighbour is shorter OR neighbour is not in OPEN
                    if (!oIncludes) {
                        // 11) set F cost of neighbour
                        neighbour.f = Pathfinding2.getFCost(neighbour.g, neighbour.h);

                        // 12) set parent of neighbour to current
                        neighbour.parent = [this.current.y, this.current.x];

                        // 13) if neighbour is not in OPEN
                        if (!oIncludes) {
                            // 14) add neighbour to OPEN
                            this.open.push(neighbour);
                            if (this.colorFind) neighbour.field.style.backgroundColor = "green";
                        }
                    }
                    this.currIterations++;
                }
            } else {
                console.log("koniec szmaciuro");
                this.goBack(this.findLowestF(this.closed))
                break;
            }

            // }.bind(this), 500);

        } // while brace
    }

    /**
     * checks if CLOSED list includes specified element (y, x comparison)
     * @param motherList the list to check if has the el 
     * @param el node to esarch for in the closed list
     */
    including(motherList: INode[], neighbour: INode): boolean {
        let foundList: INode[] = motherList.filter((el) => { return el.x == neighbour.x && el.y == neighbour.y })
        let found: boolean = false;
        if (foundList.length > 0) {
            found = true;
        }
        // console.log("found: ", foundList, foundList.length);

        return found;
    }

    /**
     * Finds a node with the lowest F cost in the OPEN array
     * @returns node {INode}
     */
    getOpenLowestF(): INode {
        // console.log("open: ", this.open);

        let nodeWithLowestF: INode = this.open[0];

        for (let i: number = 0; i < this.open.length; i++) {
            if (this.open[i].f < nodeWithLowestF.f) {
                nodeWithLowestF = this.open[i];
            }
        }

        // console.log(nodeWithLowestF);

        return nodeWithLowestF;
    }

    /**
     * Calculates the F cost in a node
     * @param G cost
     * @param H cost
     * @returns G cost + H cost
     */
    public static getFCost(G: number, H: number): number {
        return G + H;
    }

    /**
     * Calculates the distance from start node to the current node
     * @param startNode start node's coords [y, x]
     * @param current current node [y, x]
     * @returns G cost
     */
    public static getGCost(startNode: number[], current: number[]): number {
        let a: number = Math.abs(current[0] - startNode[0]);
        let b: number = Math.abs(current[1] - startNode[1]);
        let c: number = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
        // console.log(a, b, c);
        return c;

        // Formula to test c in the console
        // let x:number = Math.sqrt(Math.pow(Math.abs(0 - 2) + 1, 2) + Math.pow(Math.abs(0 - 3) + 1, 2))
    }

    /**
     * Calculates the distance from end node to the current node
     * @param endNode -> end node's coords [y, x]
     * @param current -> current node [y, x]
     * @returns number -> H cost
     */
    public static getHCost(endNode: number[], current: number[]): number {
        let a: number = Math.abs(current[0] - endNode[0]);
        let b: number = Math.abs(current[1] - endNode[1]);
        let c: number = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));

        return c
    }

    /**
     * Gets all node's neighbours (top, bottom, left, right)
     * @returns an :INode list of neighbours
     */
    getNeighbours(): INode[] {
        // .[next, previous]Sibling returns null if there's not one
        let sides: string[] = ["top", "bottom", "left", "right"];
        let neighbours: INode[] = []

        for (let i: number = 0; i < sides.length; i++) {
            switch (sides[i]) {
                case "top":
                    // There can be a node above
                    if (this.current.y - 1 >= 0) {
                        let idAbove: string = Board.arrayToId([this.current.y - 1, this.current.x]);
                        neighbours.push(this.createNode(idAbove));
                    }
                    break;
                case "bottom":
                    // if y parameter + 1< board height
                    if (this.current.y + 1 < this.gv.height) {
                        let idBelow: string = Board.arrayToId([this.current.y + 1, this.current.x]);
                        neighbours.push(this.createNode(idBelow));
                    }
                    break;
                case "left":
                    // previousSibling returns null if there's no such entity
                    if (this.current.field.previousSibling != null) {
                        let idLeft: string = Board.arrayToId([this.current.y, this.current.x - 1]);
                        neighbours.push(this.createNode(idLeft));
                    }
                    break;
                case "right":
                    if (this.current.field.nextSibling != null) {
                        let idRight: string = Board.arrayToId([this.current.y, this.current.x + 1]);
                        neighbours.push(this.createNode(idRight));
                    }
                    break;
                default:
                    console.log("I have no idea what am I doing");
                    break;
            }
        }

        return neighbours;
    }

    /**
     * Creates a node
     * @param id "y-x"
     * @returns node object
     */
    createNode(id: string): INode {
        let coordsArray = Board.idToArray(id);

        // Check if has a ball inside
        // console.log(id);
        let div: HTMLDivElement = document.getElementById(id) as HTMLDivElement;
        let ballInside: boolean = false;
        if (div.childElementCount > 0) {
            ballInside = true;
        }

        let node: INode = {
            y: coordsArray[0],
            x: coordsArray[1],
            stringId: id,
            field: div,
            f: undefined,
            g: Pathfinding2.getGCost(this.startCoords, coordsArray),
            h: Pathfinding2.getHCost(this.endCoords, coordsArray),
            isBall: ballInside,
            parent: undefined,
        }
        return node;
    }

    /**
     * Clears previous' pathfinding algoirthm coloring
     */
    clearColoring() {
        if (this.colorFind) {
            for (let y = 0; y < this.gv.height; y++) {
                for (let x = 0; x < this.gv.width; x++) {
                    let div = document.getElementById(Board.arrayToId([y, x]))
                    div.style.backgroundColor = "";
                }
            }
        }
    }

    /**
     * Finds node with the lowest F cost in the passed array
     * @param list target list of objects
     * @returns a whole node
     */
    findLowestF(list: INode[]): INode {
        let result: INode;
        let lowest: number = Number.POSITIVE_INFINITY;
        let tmp: number;

        for (let i: number = 0; i < list.length; i++) {
            tmp = list[i].f;
            if (tmp < lowest) {
                tmp = lowest
                result = list[i];
            }
        }
        return result;
    }

    /**
     * Colors the found path from the end to start
     * @param endNode End node
     */
    goBack(endNode: INode) {
        // console.clear();
        console.log(endNode, endNode.parent);
        endNode.field.style.backgroundColor = this.gv.pathProjectionColor;
        let parentId: string = Board.arrayToId(endNode.parent);
        let node2: INode = this.closed.find((el) => { return el.stringId == parentId })
        let parentEl: HTMLDivElement = document.getElementById(parentId) as HTMLDivElement;
        console.log("closed", this.closed);

        do {
            parentEl.style.backgroundColor = this.gv.pathProjectionColor;
            if (node2.parent != undefined) {
                parentId = Board.arrayToId(node2.parent);
                node2 = this.closed.find((el) => { return el.stringId == parentId })
                parentEl = document.getElementById(parentId) as HTMLDivElement;
                console.log(this.gv.colorStartFound, node2, node2.parent);

            } else {
                this.gv.colorStartFound = true;
            }
        } while (!this.gv.colorStartFound);
    }
}