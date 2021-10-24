import GlobalVars from "./GlobalVars";
import Board from "./Board";
import INode from "./iNode";


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

export default class Pathfinding2 {
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

    constructor(globalVars: GlobalVars) {
        console.log("class Pathfinding2 - A* created");
        this.gv = globalVars;

        this.startNode, this.endNode;
        this.open = [];
        this.closed = [];

        this.iterations = 2;
        this.currIterations = 0;
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

        // 1) loop
        setInterval(function () {

            if (this.currIterations < this.iterations) {
                console.clear();

                // 2) current - node in OPEN with the lowest f_cost
                this.current = this.getOpenLowestF();
                console.log(this.current);

                // Coloring 
                this.current.field.style.backgroundColor = "red";

                let index: number = this.open.indexOf(this.current);

                // 3) + 4) Remove current from OPEN and add to CLOSED
                console.log("b4", this.open, this.closed);
                this.closed.push(this.open.splice(index, 1)[0]);
                console.log("after", this.open, this.closed);

                // 5) If current is the target node
                console.log(this.startNode, this.current, this.endNode);

                if (this.current.y == this.endNode.y && this.current.x == this.endNode.x) {
                    console.log("End node found");
                    // 6) return -> color the path (how to know which one?? -> parents??)
                    // break;
                }

                this.neighbours = this.getNeighbours();
                console.log(this.neighbours);
                // 7) foreach neighbour of the current node
                for (let i: number = 0; i < this.neighbours.length; i++) {
                    let neighbour: INode = this.neighbours[i];
                    neighbour.field.style.backgroundColor = "green";
                    console.log(neighbour);

                    // 8) if neighbour is not traversable or neighbour is in CLOSED
                    if (neighbour.isBall || this.closed.includes(neighbour)) {
                        // 9) skip to the next neighbour
                        console.log("Next!");
                        continue;
                    }

                    // 10) if new path to neighbour is shorter OR neighbour is not in OPEN
                    // console.log(!this.closed.includes(neighbour));
                    if (!this.closed.includes(neighbour)) {
                        console.log("does not include");
                        // console.log(this.open, this.closed);
                        // ------------- works to here 

                        // 11) set F cost of neighbour
                        neighbour.f = Pathfinding2.getFCost(neighbour.g, neighbour.h);
                        console.log(neighbour.f);


                        // 12) set parent of neighbour to current
                        neighbour.parent = [this.current.y, this.current.x];

                        // 13) if neighbour is not in OPEN

                        console.log(this.open);
                        console.log(neighbour);
                        console.log(this.open.includes(neighbour));

                        if (!this.open.includes(neighbour)) {
                            // 14) add neighbour to OPEN
                            console.log("Adding neighbour");
                            this.open.push(neighbour);
                        }
                        console.log(this.open);
                    }
                }
                this.currIterations++;
            }

        }.bind(this), 5000);

        // change the loop after its confirmed working properly
        // while (true) {
        // }
    }

    /**
     * Finds a node with the lowest F cost in the OPEN array
     * @returns node {INode}
     */
    getOpenLowestF(): INode {
        console.log("open: ", this.open);

        let nodeWithLowestF: INode = this.open[0];

        for (let i: number = 0; i < this.open.length; i++) {
            if (this.open[i].f < nodeWithLowestF.f) {
                nodeWithLowestF = this.open[i];
            }
        }

        console.log(nodeWithLowestF);

        return nodeWithLowestF;
    }

    /**
     * Calculates the F cost in a node
     * @returns G cost + H cost
     */
    public static getFCost(G: number, H: number): number {
        return G + H;
    }

    /**
     * Calculates the distance from end node (H cost) or start node (G cost).
     * @param current -> current node [y, x]
     * @param target -> first (G) or end (H) node's coords [y, x]
     * @returns number -> H cost or G cost
     */
    public static getHCostOrGCost(current: number[], target: number[]): number {
        let a: number = Math.abs(target[0] - current[0]) + 1;
        let b: number = Math.abs(target[1] - current[1]) + 1;
        let c: number = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
        // console.log(a, b, c);
        return c;

        // Formula to test c in the console
        // let x:number = Math.sqrt(Math.pow(Math.abs(0 - 2) + 1, 2) + Math.pow(Math.abs(0 - 3) + 1, 2))
    }

    /**
     * Gets all node's neighbours
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
                    if (this.current.y + 1 <= this.gv.height) {
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

    createNode(id: string): INode {
        let coordsArray = Board.idToArray(id);

        // Check if has a ball inside
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
            g: Pathfinding2.getHCostOrGCost(coordsArray, this.startCoords),
            h: Pathfinding2.getHCostOrGCost(coordsArray, this.endCoords),
            isBall: ballInside,
            parent: undefined,
        }
        return node;
    }
}