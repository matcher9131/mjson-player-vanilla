import { setPlayerMatchResults } from "@/components/closingDisplay";
import { enablePositionNavigatorButtons } from "@/components/controlPanel";
import { setPlayerNames } from "@/components/openingDisplay";
import { updatePlayerNames } from "@/components/playerNameDisplay";
import { resetRiichiStickAll } from "@/components/riichiStickDisplay";
import { resetScoreDisplayAll } from "@/components/scoreDisplay";
import { type MJson } from "@/modules/mJson/types/mJson";
import { resetPositionIndex, setPositionEvents } from "@/modules/positionEvent/states";
import { handleGameIndexChanged } from "./positionEventController";
import { fetchMJson, setMJson } from "@/modules/mJson/states";

export const handleMJsonChanged = (newMJson: MJson): void => {
    // PositionEvent
    setPositionEvents(newMJson);
    resetPositionIndex();
    // OpeningDisplay
    setPlayerNames(newMJson.players.map(({ name }) => name));
    // ClosingDisplay
    setPlayerMatchResults(newMJson.players);
    // ScoreDisplay
    resetScoreDisplayAll();
    resetRiichiStickAll();
    // PlayerNameDisplay
    updatePlayerNames(newMJson.players.map(({ name }) => name));
    // ControlPanel
    enablePositionNavigatorButtons();
    // あとはhandleGameIndexChangedに任せる
    handleGameIndexChanged("pre");
};

export const loadNewMJson = async (id: string): Promise<void> => {
    const newMJson = await fetchMJson(id);
    setMJson(newMJson);
    handleMJsonChanged(newMJson);
};
