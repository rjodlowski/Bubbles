/**
 * Interface as Type
 */
export default interface INode {
    x: number,
    y: number,
    stringId: string,
    field: HTMLDivElement,
    f: number,
    g: number,
    h: number,
    isBall: boolean,
    parent: number[]; // Node, which the pathfinding came from
    // [k: string]: any, // New properties can be added
}