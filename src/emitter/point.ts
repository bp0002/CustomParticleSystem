import { MathTool } from "../math/math";
import { Matrix4 } from "../math/matrix4";
import { Vector3 } from "../math/vector3";
import { IEmitterConfig } from "./config";
import { EArcMode, EShapeEmitterDirectionMode, EShapeEmitterMode } from "./mode";

export class Point {
    public static Config(): IEmitterConfig {
        return {
            mode: EShapeEmitterMode.Point,
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
        // 局部方向固定
        if (isLocal) {
            resultDirection.copyFromFloats(0, 0, 1);
        }
        else {
            MathTool.Vector3Tool.TransformNormalFromFloatsToRef(0, 0, 1, worldMatrix, resultDirection);
        }
    }
    public static startPositionFunction(config: IEmitterConfig, worldMatrix: Matrix4, resultPosition: Vector3, emissionLoop: number, emissionProgress: number, emissionIndex: number, emissionTotal: number, isLocal: boolean): void {
        if (isLocal) {
            resultPosition.copyFromFloats(0, 0, 0);
        }
        else {
            worldMatrix.getTranslationToRef(resultPosition);
        }
    }
}