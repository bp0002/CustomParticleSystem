export interface Vector4 {
    x: number;
    y: number;
    z: number;
    w: number;
    /**
     * Updates the current Vector4 with the given one coordinates.
     * @param source the source vector to copy from
     * @returns the updated Vector4.
     */
    copyFrom(source: Vector4): Vector4;
    /**
     * Updates the current Vector4 coordinates with the given floats.
     * @param x float to copy from
     * @param y float to copy from
     * @param z float to copy from
     * @param w float to copy from
     * @returns the updated Vector4.
     */
    copyFromFloats(x: number, y: number, z: number, w: number): Vector4;
    /**
     * Multiplies in place the current Vector4 by the given one.
     * @param otherVector vector to multiple with
     * @returns the updated Vector4.
     */
    multiplyInPlace(otherVector: Vector4): Vector4;
}

export interface Vector4Tool {
    /**
     * Returns a new Vector3 set to (0.0, 0.0, 0.0)
     * @returns a new empty Vector3
     */
    Zero(): Vector4;
    /**
     * Returns a new Vector3 set to (1.0, 1.0, 1.0)
     * @returns a new unit Vector3
     */
    One(): Vector4;
}