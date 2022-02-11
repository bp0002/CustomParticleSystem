
export interface Quaternion {
    x: number;
    y: number;
    z: number;
    w: number;
    /**
     * Copy a quaternion to the current one
     * @param other defines the other quaternion
     * @returns the updated current quaternion
     */
    copyFrom(other: Quaternion): Quaternion;
    /**
     * Updates the current quaternion with the given float coordinates
     * @param x defines the x coordinate
     * @param y defines the y coordinate
     * @param z defines the z coordinate
     * @param w defines the w coordinate
     * @returns the updated current quaternion
     */
    copyFromFloats(x: number, y: number, z: number, w: number): Quaternion;
}

export interface QuaternionTool {
    /**
     * Creates a new rotation from the given Euler float angles (y, x, z) and stores it in the target quaternion
     * @param yaw defines the rotation around Y axis
     * @param pitch defines the rotation around X axis
     * @param roll defines the rotation around Z axis
     * @param result defines the target quaternion
     */
    RotationYawPitchRollToRef(yaw: number, pitch: number, roll: number, result: Quaternion): void;
    /**
     * Creates an identity quaternion
     * @returns the identity quaternion
     */
    Identity(): Quaternion;
    /**
     * Creates an empty quaternion
     * @returns a new quaternion set to (0.0, 0.0, 0.0)
     */
    Zero(): Quaternion;
}