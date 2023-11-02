import { createBoard } from "./components/board";
import { createControlPanel } from "./components/controlPanel";
import "./index.css";

const root = document.getElementById("root");
if (root == null) throw new Error("ERROR: 'root' is not found.");

const board = createBoard();
const controlPanel = createControlPanel();
root.append(board, controlPanel);
