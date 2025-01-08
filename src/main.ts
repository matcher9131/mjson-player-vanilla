import { createControlPanel } from "./components/controlPanel";
import "./index.css";
import {
    createMatchSelectWindow,
    setMatchSelectWindowVisibility,
} from "./components/matchSelectWindow/matchSelectWindow";
import { getAllMatchIds } from "./models/mJsonIndex/states";
import { loadNewMJson } from "./controllers/mJsonController";
import { assertNonNull } from "./util/error";
import { createBoardContainer } from "./components/boardContainer/boardContainer";
import {
    handleGoToNextGame,
    handleGoToNextPosition,
    handleGoToPreviousGame,
    handleGoToPreviousPosition,
    handleShowMatchSelectWindow,
} from "./controllers/positionEventController";
import { handleRotateClockwise, handleRotateCounterClockwise } from "./controllers/boardRotationController";
import { createLoadingDisplay, loadingDisplayId } from "./components/loadingDisplay";

const root = document.getElementById("root");
assertNonNull(root);

const setResources = async (): Promise<void> => {
    const resourceContainer = document.getElementById("resource_container");
    assertNonNull(resourceContainer);

    const responses = await Promise.all([
        fetch(`resources/sticks.svg`),
        fetch(`resources/tiles.svg`),
        fetch(`resources/winds.svg`),
    ]);
    if (responses.some((response) => !response.ok)) throw new Error("Failed loading resources.");
    const contents = await Promise.all(responses.map(async (response) => await response.text()));
    resourceContainer.innerHTML = contents.join("");
};

const createComponents = async (): Promise<void> => {
    const boardContainer = createBoardContainer();
    const controlPanel = createControlPanel({
        handleGoToPreviousGame,
        handleGoToPreviousPosition,
        handleGoToNextPosition,
        handleGoToNextGame,
        handleRotateClockwise,
        handleRotateCounterClockwise,
        handleShowMatchSelectWindow,
    });
    const matchSelectWindow = await createMatchSelectWindow(loadNewMJson);
    root.append(boardContainer, controlPanel, matchSelectWindow);
    root.classList.add("flex", "flex-wrap");
};

const loadMJsonOrShowMatchSelectWindow = async (): Promise<void> => {
    const matchId = await (async (): Promise<string | null> => {
        const searchParams = new URLSearchParams(window.location.search);
        if (!searchParams.has("id")) return null;
        const matchId = searchParams.get("id");
        if (matchId == null) return null;
        const allMatchIds = await getAllMatchIds();
        return allMatchIds.includes(matchId) ? matchId : null;
    })();
    if (matchId != null) {
        await loadNewMJson(matchId);
    } else {
        setMatchSelectWindowVisibility(true);
    }
};

const showLoadingDisplay = (): void => {
    const loadingDisplay = createLoadingDisplay();
    root.appendChild(loadingDisplay);
};

const hideLoadingDisplay = (): void => {
    const loadingDisplay = document.getElementById(loadingDisplayId);
    loadingDisplay?.remove();
};

const initializeMainPage = async (): Promise<void> => {
    showLoadingDisplay();

    try {
        await setResources();
    } catch {
        const span = document.createElement("span");
        span.innerText = "リソースの読み込みに失敗しました。しばらく時間をおいてからリロードしてください。";
        root.appendChild(span);
        hideLoadingDisplay();
        return;
    }

    await createComponents();
    await loadMJsonOrShowMatchSelectWindow();

    hideLoadingDisplay();
};

await initializeMainPage();
