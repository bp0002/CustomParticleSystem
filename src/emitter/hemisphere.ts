import { MathTool } from "../math/math";
import { Matrix4 } from "../math/matrix4";
import { Vector3 } from "../math/vector3";
import { computeRadians, IEmitterConfig } from "./config";
import { EArcMode, EShapeEmitterDirectionMode, EShapeEmitterMode } from "./mode";

export class Hemisphere {
    public static Config(): IEmitterConfig {
        return {
            mode: EShapeEmitterMode.Hemisphere,
            radius: 1,
            angle: Math.PI,
            radiusThickness: 1,
            baseHeight: 0,
            height: 1,
            heightRange: 0,
            arcMode: EArcMode.Random,
            arcValue: Math.PI * 2,
            arcSpread: 0,
            arcSpeed: 1,
            scale: [1, 1, 1],
            directionMode: EShapeEmitterDirectionMode.Unity,
            emitFromSpawnPointOnly: false,
            directionRandomizer: 0,
        };
    }
    public static computeDirection(
        config: IEmitterConfig,
        worldMatrix: Matrix4,
        resultDirection: Vector3,
        localPosition: Vector3,
        isLocal: boolean
    ) {
        // 局部方向为 局部原点指向 局部点
        resultDirection.copyFrom(localPosition).normalize();

        if (isLocal) {
            //
        }
        else {
            // 转换到全局方向
            MathTool.Vector3Tool.TransformNormalFromFloatsToRef(resultDirection.x, resultDirection.y, resultDirection.z, worldMatrix, resultDirection);
        }

        var randX = MathTool.ScalarTool.RandomRange(0, config.directionRandomizer || 0);
        var randY = MathTool.ScalarTool.RandomRange(0, config.directionRandomizer || 0);
        var randZ = MathTool.ScalarTool.RandomRange(0, config.directionRandomizer || 0);
        resultDirection.x += randX;
        resultDirection.y += randY;
        resultDirection.z += randZ;
        resultDirection.normalize();

        // if (isLocal) {
        //     //
        // }
        // else {
        //     MathTool.Vector3Tool.TransformNormalFromFloatsToRef(resultDirection.x, resultDirection.y, resultDirection.z, worldMatrix, resultDirection);
        // }
    }
    public static startPositionFunction(config: IEmitterConfig, worldMatrix: Matrix4, resultPosition: Vector3, emissionLoop: number, emissionProgress: number, emissionIndex: number, emissionTotal: number, isLocal: boolean): void {
        let s = computeRadians(emissionLoop, emissionProgress, emissionIndex, emissionTotal, Math.PI * 2, config.arcValue, config.arcSpread, config.arcSpeed, config.arcMode);

        var range = MathTool.ScalarTool.RandomRange(0, config.radiusThickness);
        var randRadius = config.radius - config.radius * range * range;
        var v = MathTool.ScalarTool.RandomRange(0, 1.0);
        var phi = s;
        var theta = Math.acos(2 * v - 1);
        var randX = randRadius * Math.cos(phi) * Math.sin(theta);
        var randZ = Math.abs(randRadius * v);
        var randY = randRadius * Math.sin(phi) * Math.sin(theta);

        if (isLocal) {
            resultPosition.copyFromFloats(randX, randY, randZ);
        }
        else {
            MathTool.Vector3Tool.TransformCoordinatesFromFloatsToRef(randX, randY, randZ, worldMatrix, resultPosition);
        }
    }
}