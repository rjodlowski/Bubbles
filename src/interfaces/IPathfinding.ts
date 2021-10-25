import GlobalVars from "../GlobalVars";
import IGetCost from "./IGetCost";
import INode from "./iNode";

/**
 * Interface
 */
export default interface IPathfinding {
	gv: GlobalVars,
	startNode: INode;
	endNode: INode;
	current: INode;

	startCoords: number[];
	endCoords: number[];

	open: INode[];
	closed: INode[];
	neighbours: INode[];

	setValues: (startId: string, endId: string) => void;
	prepareStart: () => void;
	start: () => void;

	getFCost: (G: number, H: number) => number;

	getHCost: IGetCost;
	getGCost: IGetCost;

	getOpenLowestF: () => INode;
	createNode: (id: string) => INode;

	getNeighbours: () => INode[]

	including: (motherList: INode[], neighbour: INode) => boolean
}