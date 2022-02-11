import { MathTool } from "../math/math";
import { Matrix4 } from "../math/matrix4";
import { Vector3 } from "../math/vector3";
import { IEmitterConfig } from "./config";
import { EArcMode, EShapeEmitterDirectionMode, EShapeEmitterMode } from "./mode";

export class Sphere {
    public static Config(): IEmitterConfig {
        return {
            mode: EShapeEmitterMode.Sphere,
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
            MathTool.Vector3Tool.TransformNormalFromFloatsToRef(resultDirection.x, resultDirection.y, resultDirection.z, worldMatrix, resultDirection);
        }
    }
    public static startPositionFunction(config: IEmitterConfig, worldMatrix: Matrix4, resultPosition: Vector3, emissionLoop: number, emissionProgress: number, emissionIndex: number, emissionTotal: number, isLocal: boolean): void {

        var randX = MathTool.ScalarTool.RandomRange(-0.5, 0.5);
        var randY = MathTool.ScalarTool.RandomRange(-0.5, 0.5);
        var randZ = 0;

        if (isLocal) {
            resultPosition.copyFromFloats(randX * config.scale[0], randY * config.scale[1], randZ * config.scale[2]);
        }
        else {
            MathTool.Vector3Tool.TransformCoordinatesFromFloatsToRef(randX * config.scale[0], randY * config.scale[1], randZ * config.scale[2], worldMatrix, resultPosition);
        }
    }
}