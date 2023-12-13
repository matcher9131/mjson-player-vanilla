import { updatePlayerMatchResults } from "@/components/boardContainer/closingDisplay";
import { setPositionNavigatorButtonsEnabled } from "@/components/controlPanel";
import { updateOpeningDisplayContent } from "@/components/boardContainer/openingDisplay";
import { updatePlayerNameDisplay } from "@/components/boardContainer/board/rotationBoard/playerNameDisplay";
import { resetRiichiStickAll } from "@/components/boardContainer/board/rotationBoard/riichiStickDisplay";
import { resetScoreDisplayAll } from "@/components/boardContainer/board/rotationBoard/scoreDisplay";
import { type MJson } from "@/models/mJson/types/mJson";
import { resetPositionIndex, setPositionEvents } from "@/models/positionEvent/states";
import { handleGameIndexChanged } from "./positionEventController";
import { fetchMJson, setMJson } from "@/models/mJson/states";
import { hideGameResultDisplay } from "@/components/boardContainer/board/gameResultDisplay/gameResultDisplay";
import { resetBoardRotationValue } from "@/models/boardRotationValue/states";

export const handleMJsonChanged = (newMJson: MJson | null): void => {
    // GameResultWindowを閉じる
    hideGameResultDisplay();
    // 各変数をセット・リセットする
    // BoardRotationValue
    resetBoardRotationValue();
    // PositionEvent
    setPositionEvents(newMJson);
    resetPositionIndex();
    // OpeningDisplay
    updateOpeningDisplayContent(newMJson?.players?.map(({ name }) => name) ?? []);
    // ClosingDisplay
    updatePlayerMatchResults(newMJson?.players ?? []);
    // ScoreDisplay
    resetScoreDisplayAll();
    resetRiichiStickAll();
    // PlayerNameDisplay
    updatePlayerNameDisplay(newMJson?.players?.map(({ name }) => name) ?? []);
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
