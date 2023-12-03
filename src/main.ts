import { createBoard } from "./components/board";
import { createControlPanel } from "./components/controlPanel";
import "./index.css";
// import { getMJson } from "./modules/mJson/states";
import { createMatchSelectWindow } from "./components/matchSelectWindow";
// import { handleMJsonChanged } from "./controllers/mJsonController";

const root = document.getElementById("root");
if (root == null) throw new Error("ERROR: 'root' is not found.");

// temporary
// setMJson(sampleMJson as MJson);
// end temporary

const board = createBoard();
const controlPanel = createControlPanel();
const matchSelectWindow = createMatchSelectWindow();
root.append(board, controlPanel, matchSelectWindow);
root.classList.add("flex", "flex-wrap");

// temporary
// handleMJsonChanged(getMJson());
// end temporary
