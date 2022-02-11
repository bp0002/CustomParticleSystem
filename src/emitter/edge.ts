import { MathTool } from "../math/math";
import { Matrix4 } from "../math/matrix4";
import { Vector3 } from "../math/vector3";
import { computeRadians, IEmitterConfig } from "./config";
import { EArcMode, EShapeEmitterDirectionMode, EShapeEmitterMode } from "./mode";

export class Edge {
    public static Config(): IEmitterConfig {
        return {
            mode: EShapeEmitterMode.Edge,
            radius: 0,
            angle: Math.PI,
            radiusThickness: 1,
            baseHeight: 0,
            height: 1,
            heightRange: 0,
            arcMode: EArcMode.Random,
            arcValue: 1.0,
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
        resultDirection.copyFromFloats(0, 1, 0);
        
        // var randX = BABYLON.Scalar.RandomRange(0, this.directionRandomizer);
        // var randY = BABYLON.Scalar.RandomRange(0, this.directionRandomizer);
        // var randZ = BABYLON.Scalar.RandomRange(0, this.directionRandomizer);
        // direction.x += randX;
        // direction.y += randY;
        // direction.z += randZ;
        // direction.normalize();
        
        if (isLocal) {
            //
        }
        else {
            MathTool.Vector3Tool.TransformNormalFromFloatsToRef(resultDirection.x, resultDirection.y, resultDirection.z, worldMatrix, resultDirection);
        }
    }
    public static startPositionFunction(config: IEmitterConfig, worldMatrix: Matrix4, resultPosition: Vector3, emissionLoop: number, emissionProgress: number, emissionIndex: number, emissionTotal: number, isLocal: boolean): void {

        let s = computeRadians(emissionLoop, emissionProgress, emissionIndex, emissionTotal, 1.0, config.arcValue, config.arcSpread, config.arcSpeed, config.arcMode);

        var randX = config.radius * (s / config.arcValue * 2 - 1);

        resultPosition.copyFromFloats(randX, 0, 0);

        if (isLocal) {
            //
        }
        else {
            MathTool.Vector3Tool.TransformCoordinatesFromFloatsToRef(resultPosition.x, resultPosition.y, resultPosition.z, worldMatrix, resultPosition);
        }
    }
}