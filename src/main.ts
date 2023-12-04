import { createBoard } from "./components/board";
import { createControlPanel } from "./components/controlPanel";
import "./index.css";
import { createMatchSelectWindow, setMatchSelectWindowVisibility } from "./components/matchSelectWindow";
import { getAllMatchIds } from "./modules/mJsonIndex/states";
import { loadNewMJson } from "./controllers/mJsonController";

const root = document.getElementById("root");
if (root == null) throw new Error("ERROR: 'root' is not found.");

root.appendChild(document.createTextNode("Loading..."));

const board = createBoard();
const controlPanel = createControlPanel();
const matchSelectWindow = await createMatchSelectWindow();
root.firstChild?.remove();
root.append(board, controlPanel, matchSelectWindow);
root.classList.add("flex", "flex-wrap");

const getMatchId = async (): Promise<string | null> => {
    const searchParams = new URLSearchParams(window.location.search);
    if (!searchParams.has("id")) return null;
    const matchId = searchParams.get("id");
    if (matchId == null) return null;
    const allMatchIds = await getAllMatchIds();
    return allMatchIds.includes(matchId) ? matchId : null;
};

const matchId = await getMatchId();
if (matchId != null) {
    await loadNewMJson(matchId);
} else {
    setMatchSelectWindowVisibility(true);
}
