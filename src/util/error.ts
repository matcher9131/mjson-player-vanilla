export const assertNonNull: <T>(value: T | null | undefined, name?: string) => asserts value is NonNullable<T> = (
    value,
    name?,
) => {
    if (value == null) throw new Error(`'${name ?? ""}' should not be nullish.`);
};
