export const assertNonNull: <T>(value: T | null | undefined, name?: string) => asserts value is NonNullable<T> = (
    value,
    name?,
) => {
    if (value == null) throw new Error(`'${name ?? ""}' should not be nullish.`);
};

export const assertFiniteNumber = (value: number, name?: string): void => {
    if (!isFinite(value)) throw new Error(`'${name ?? "value"}' should be a finite number.`);
};
