import { MathTool } from "../math/math";
import { Matrix4 } from "../math/matrix4";
import { Vector3 } from "../math/vector3";
import { computeRadians, IEmitterConfig } from "./config";
import { EArcMode, EShapeEmitterDirectionMode, EShapeEmitterMode } from "./mode";

export class Circle {
    public static Config(): IEmitterConfig {
        return {
            mode: EShapeEmitterMode.Circle,
            radius: 1,
            angle: 0,
            radiusThickness: 1,
            baseHeight: 0,
            height: 5,
            heightRange: 1,
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
        
        // var randX = BABYLON.Scalar.RandomRange(0, this.directionRandomizer);
        // var randY = BABYLON.Scalar.RandomRange(0, this.directionRandomizer);
        // var randZ = BABYLON.Scalar.RandomRange(0, this.directionRandomizer);
        // direction.x += randX;
        // direction.y += randY;
        // direction.z += randZ;
        // direction.normalize();
    }
    public static startPositionFunction(config: IEmitterConfig, worldMatrix: Matrix4, resultPosition: Vector3, emissionLoop: number, emissionProgress: number, emissionIndex: number, emissionTotal: number, isLocal: boolean): void {
        let s = computeRadians(emissionLoop, emissionProgress, emissionIndex, emissionTotal, Math.PI * 2, config.arcValue, config.arcSpread, config.arcSpeed, config.arcMode);

        var randRadius = config.radius - MathTool.ScalarTool.RandomRange(0, config.radius * config.radiusThickness);
        var randX = randRadius * Math.cos(s);
        var randY = randRadius * Math.sin(s);
        var randZ = 0;

        if (isLocal) {
            resultPosition.x = randX;
            resultPosition.y = randY;
            resultPosition.z = randZ;
        }
        else {
            MathTool.Vector3Tool.TransformCoordinatesFromFloatsToRef(randX, randY, randZ, worldMatrix, resultPosition);
        }
    }
}