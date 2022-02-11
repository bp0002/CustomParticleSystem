import { Matrix4Tool } from "./matrix4";
import { QuaternionTool } from "./quaternion";
import { ScalarTool } from "./scalar";
import { Vector3Tool } from "./vector3";
import { Vector4Tool } from "./vector4";

export class MathTool {
    public static ScalarTool: ScalarTool;
    public static Vector3Tool: Vector3Tool;
    public static Vector4Tool: Vector4Tool;
    public static QuaternionTool: QuaternionTool;
    public static Matrix4Tool: Matrix4Tool;
}

export function directionToQuaternion(direction: {x: number, y: number, z: number}, result: {x: number, y: number, z: number, w: number}) {
    const xAxis = direction.x;
    const yAxis = direction.y;
    const zAxis = direction.z;

    let yaw = -Math.atan2(zAxis, xAxis) + Math.PI / 2;
    let len = Math.sqrt(xAxis * xAxis + zAxis * zAxis);
    let pitch = -Math.atan2(yAxis, len);

    RotationYawPitchRollToRef(yaw, pitch, 0, result);

}

export function RotationYawPitchRollToRef(yaw: number, pitch: number, roll: number, result: {x: number, y: number, z: number, w: number}) {
    // Produces a quaternion from Euler angles in the z-y-x orientation (Tait-Bryan angles)
    var halfRoll    = roll   * 0.5;
    var halfPitch   = pitch  * 0.5;
    var halfYaw     = yaw    * 0.5;

    var sinRoll     = Math.sin(halfRoll);
    var cosRoll     = Math.cos(halfRoll);
    var sinPitch    = Math.sin(halfPitch);
    var cosPitch    = Math.cos(halfPitch);
    var sinYaw      = Math.sin(halfYaw);
    var cosYaw      = Math.cos(halfYaw);

    result.x        = (cosYaw * sinPitch * cosRoll) + (sinYaw * cosPitch * sinRoll);
    result.y        = (sinYaw * cosPitch * cosRoll) - (cosYaw * sinPitch * sinRoll);
    result.z        = (cosYaw * cosPitch * sinRoll) - (sinYaw * sinPitch * cosRoll);
    result.w        = (cosYaw * cosPitch * cosRoll) + (sinYaw * sinPitch * sinRoll);
}