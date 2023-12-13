let selectedMatchId: string | null = null;

export const setSelectedMatchId = (id: string | null): void => {
    selectedMatchId = id;
};

export const getSelectedMatchId = (): string | null => {
    return selectedMatchId;
};
