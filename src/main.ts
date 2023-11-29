import { createBoard } from "./components/board";
import { createControlPanel, handleMJsonChanged } from "./components/controlPanel";
import "./index.css";
import { getMJson, setMJson } from "./modules/mJson/states";
import sampleMJson from "@/data/sample1.json";
import { type MJson } from "./modules/mJson/types/mJson";
import { createMatchSelectWindow } from "./components/matchSelectWindow";

const root = document.getElementById("root");
if (root == null) throw new Error("ERROR: 'root' is not found.");

// temporary
setMJson(sampleMJson as MJson);
// end temporary

const board = createBoard();
const controlPanel = createControlPanel();
const matchSelectWindow = createMatchSelectWindow();
root.append(board, controlPanel, matchSelectWindow);
root.classList.add("flex", "flex-wrap");

// temporary
handleMJsonChanged(getMJson());
// end temporary
