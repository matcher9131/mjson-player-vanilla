import { setPlayerMatchResults } from "@/components/closingDisplay";
import { setPositionNavigatorButtonsEnabled } from "@/components/controlPanel";
import { setPlayerNames } from "@/components/openingDisplay";
import { updatePlayerNames } from "@/components/playerNameDisplay";
import { resetRiichiStickAll } from "@/components/riichiStickDisplay";
import { resetScoreDisplayAll } from "@/components/scoreDisplay";
import { type MJson } from "@/models/mJson/types/mJson";
import { resetPositionIndex, setPositionEvents } from "@/models/positionEvent/states";
import { handleGameIndexChanged } from "./positionEventController";
import { fetchMJson, setMJson } from "@/models/mJson/states";
import { hideGameResultDisplay } from "@/components/gameResultDisplay/gameResultDisplay";

export const handleMJsonChanged = (newMJson: MJson | null): void => {
    // GameResultWindowを閉じる
    hideGameResultDisplay();
    // 各変数をセット
    // PositionEvent
    setPositionEvents(newMJson);
    resetPositionIndex();
    // OpeningDisplay
    setPlayerNames(newMJson?.players?.map(({ name }) => name) ?? []);
    // ClosingDisplay
    setPlayerMatchResults(newMJson?.players ?? []);
    // ScoreDisplay
    resetScoreDisplayAll();
    resetRiichiStickAll();
    // PlayerNameDisplay
    updatePlayerNames(newMJson?.players?.map(({ name }) => name) ?? []);
    // ControlPanel
    setPositionNavigatorButtonsEnabled(newMJson != null);
    // あとはhandleGameIndexChangedに任せる
    handleGameIndexChanged("pre");
};

export const loadNewMJson = async (id: string): Promise<void> => {
    const newMJson = await fetchMJson(id);
    setMJson(newMJson);
    handleMJsonChanged(newMJson);
};
