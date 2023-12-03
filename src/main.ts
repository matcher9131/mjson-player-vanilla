import { createBoard } from "./components/board";
import { createControlPanel } from "./components/controlPanel";
import "./index.css";
import { createMatchSelectWindow } from "./components/matchSelectWindow";

const root = document.getElementById("root");
if (root == null) throw new Error("ERROR: 'root' is not found.");

root.appendChild(document.createTextNode("Loading..."));

const board = createBoard();
const controlPanel = createControlPanel();
const matchSelectWindow = await createMatchSelectWindow();
root.firstChild?.remove();
root.append(board, controlPanel, matchSelectWindow);
root.classList.add("flex", "flex-wrap");
