import { MathTool } from "../math/math";
import { Matrix4 } from "../math/matrix4";
import { Vector3 } from "../math/vector3";
import { IEmitterConfig } from "./config";
import { EArcMode, EShapeEmitterDirectionMode, EShapeEmitterMode } from "./mode";

export class Box {
    public static Config(): IEmitterConfig {
        return {
            mode: EShapeEmitterMode.Box,
            radius: 1,
            angle: 0,
            radiusThickness: 1,
            baseHeight: 0,
            height: 5,
            heightRange: 1,
            arcMode: EArcMode.Random,
            arcValue: 1,
            arcSpread: 1,
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

        var randX = MathTool.ScalarTool.RandomRange(-config.radiusThickness, config.radiusThickness);
        var randY = MathTool.ScalarTool.RandomRange(-config.radiusThickness, config.radiusThickness);
        var randZ = MathTool.ScalarTool.RandomRange(-config.radiusThickness, config.radiusThickness);

        randX = (randX > 0 ? 1 : -1) - randX;
        randY = (randY > 0 ? 1 : -1) - randY;
        randZ = (randZ > 0 ? 1 : -1) - randZ;

        let sx = (config.scale[0] || 1) / 2;
        let sy = (config.scale[1] || 1) / 2;
        let sz = (config.scale[2] || 1) / 2;

        if (isLocal) {
            resultPosition.copyFromFloats(randX * sx, randY * sy, randZ * sz);
        }
        else {
            MathTool.Vector3Tool.TransformCoordinatesFromFloatsToRef(randX * sx, randY * sy, randZ * sz, worldMatrix, resultPosition);
        }
    }
}