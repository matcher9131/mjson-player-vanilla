export const lowerBound = (arr: readonly number[], x: number): number => {
    let ng = -1;
    let ok = arr.length;
    while (Math.abs(ok - ng) > 1) {
        const mid = Math.floor((ok + ng) / 2);
        if (arr[mid] >= x) ok = mid;
        else ng = mid;
    }
    return ok;
};

export const insertTo = (arr: number[], x: number): number => {
    const index = lowerBound(arr, x);
    arr.splice(index, 0, x);
    return index;
};

export const removeFrom = (arr: number[], x: number): number => {
    const index = lowerBound(arr, x);
    if (arr[index] !== x) return -1;
    arr.splice(index, 1);
    return index;
};

export const maxBy = <T>(arr: readonly T[], predicate: (item: T) => number): T | null => {
    let target: T | null = null;
    let maxValue = Number.NEGATIVE_INFINITY;
    for (let i = 0; i < arr.length; ++i) {
        const value = predicate(arr[i]);
        if (value > maxValue) {
            maxValue = value;
            target = arr[i];
        }
    }
    return target;
};
