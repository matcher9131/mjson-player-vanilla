type Vector2D = {
    readonly x: number;
    readonly y: number;
};

export const rotateVector2D = ({ x, y }: Vector2D, degree: number): Vector2D => {
    const radian = (degree / 180.0) * Math.PI;
    const a11 = Math.cos(radian);
    const a12 = -Math.sin(radian);
    const a21 = Math.sin(radian);
    const a22 = Math.cos(radian);
    return {
        x: x * a11 + y * a12,
        y: x * a21 + y * a22,
    };
};
