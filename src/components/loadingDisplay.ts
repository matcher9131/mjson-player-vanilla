export const loadingDisplayId = "loading_display";

export const createLoadingDisplay = (): HTMLDivElement => {
    const container = document.createElement("div");
    container.setAttribute("id", loadingDisplayId);
    container.classList.add(
        "w-full",
        "h-screen",
        "bg-white/50",
        "transition-opacity-visibility",
        "flex",
        "justify-center",
        "items-center",
    );

    const circle = document.createElement("div");
    circle.classList.add(
        "h-[min(25vw,25vh)]",
        "w-[min(25vw,25vh)]",
        "border-blue-500",
        "border-[min(2.5vw,2.5vh)]",
        "border-t-transparent",
        "animate-spin",
    );

    container.appendChild(circle);

    return container;
};
