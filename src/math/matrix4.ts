import { Quaternion } from "./quaternion";
import { Vector3 } from "./vector3";

export type Matrix4Data = [
    number, number, number, number,
    number, number, number, number,
    number, number, number, number,
    number, number, number, number
];

export interface Matrix4 {
    // /**
    //  * Inverts the current matrix in place
    //  * @returns the current inverted matrix
    //  */
    // invert(): Matrix4;
    /**
     * Sets the given matrix to the current inverted Matrix
     * @param other defines the target matrix
     * @returns the unmodified current matrix
     */
    invertToRef(other: Matrix4): Matrix4;
    /**
     * Decomposes the current Matrix into a translation, rotation and scaling components
     * @param scale defines the scale vector3 given as a reference to update
     * @param rotation defines the rotation quaternion given as a reference to update
     * @param translation defines the translation vector3 given as a reference to update
     * @returns true if operation was successful
     */
    decompose(scale?: Vector3, rotation?: Quaternion, translation?: Vector3): boolean;
    /**
     * Inserts the translation vector (using 3 floats) in the current matrix
     * @param x defines the 1st component of the translation
     * @param y defines the 2nd component of the translation
     * @param z defines the 3rd component of the translation
     * @returns the current updated matrix
     */
    setTranslationFromFloats(x: number, y: number, z: number): Matrix4;
    /**
     * Gets the translation value of the current matrix
     * @returns a new Vector3 as the extracted translation from the matrix
     */
    getTranslation(): Vector3;
    /**
     * Fill a Vector3 with the extracted translation from the matrix
     * @param result defines the Vector3 where to store the translation
     * @returns the current matrix
     */
    getTranslationToRef(result: Vector3): Matrix4;
    /**
     * Extracts the rotation matrix from the current one and sets it as the given "result"
     * @param result defines the target matrix to store data to
     * @returns the current matrix
     */
    getRotationMatrixToRef(result: Matrix4): Matrix4;
    /**
     * Sets the given matrix "result" with the multiplication result of the current Matrix and the given one
     * @param other defines the second operand
     * @param result defines the matrix where to store the multiplication
     * @returns the current matrix
     */
    multiplyToRef(other: Matrix4, result: Matrix4): Matrix4;
    /**
     * Inserts the translation vector in the current matrix
     * @param vector3 defines the translation to insert
     * @returns the current updated matrix
     */
    setTranslation(vector3: Vector3): Matrix4;
    /**
     * Copy the current matrix from the given one
     * @param other defines the source matrix
     * @returns the current updated matrix
     */
    copyFrom(other: Matrix4): Matrix4;
    /**
     * Populates the given array from the starting index with the current matrix values
     * @param array defines the target array
     * @param offset defines the offset in the target array where to start storing values
     * @returns the current matrix
     */
    copyToArray(array: Float32Array | Array<number>, offset?: number): Matrix4;
    /**
     * Clone the current matrix
     * @returns a new matrix from the current matrix
     */
    clone(): Matrix4;
}

export interface Matrix4Tool {
    /**
     * Creates a new identity matrix
     * @returns a new identity matrix
     */
    Identity(): Matrix4;
    /**
     * Creates a new zero matrix
     * @returns a new zero matrix
     */
    Zero(): Matrix4;
    /**
     * Sets a matrix to a value composed by merging scale (vector3), rotation (quaternion) and translation (vector3)
     * @param scale defines the scale vector3
     * @param rotation defines the rotation quaternion
     * @param translation defines the translation vector3
     * @param result defines the target matrix
     */
    ComposeToRef(scale: Vector3, rotation: Quaternion, translation: Vector3, result: Matrix4): void;
}