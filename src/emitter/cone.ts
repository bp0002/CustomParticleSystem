import { MathTool } from "../math/math";
import { Matrix4 } from "../math/matrix4";
import { Vector3 } from "../math/vector3";
import { computeRadians, IEmitterConfig } from "./config";
import { EArcMode, EShapeEmitterDirectionMode, EShapeEmitterMode } from "./mode";

export class Cone {
    public static Config(): IEmitterConfig {
        return {
            mode: EShapeEmitterMode.Cone,
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
    public static MAX_Z = 999999999;
    public static computeDirection(
        config: IEmitterConfig,
        worldMatrix: Matrix4,
        resultDirection: Vector3,
        localPosition: Vector3,
        isLocal: boolean
    ) {
        // 局部方向为 圆锥顶点指向局部点
        resultDirection.copyFrom(localPosition!).addInPlaceFromFloats(0, 0, config.baseHeight).normalize();

        if (isLocal) {
            //
        }
        else {
            // MathTool.Vector3Tool.TransformCoordinatesFromFloatsToRef(resultDirection.x, resultDirection.y, resultDirection.z, worldMatrix, resultDirection);
            // resultDirection.subtractToRef(worldMatrix.getTranslation(), resultDirection).normalize();
            // 转换到全局方向
            MathTool.Vector3Tool.TransformNormalFromFloatsToRef(resultDirection.x, resultDirection.y, resultDirection.z, worldMatrix, resultDirection);
        }

        // var randX = MathTool.ScalarTool.RandomRange(0, this.directionRandomizer);
        // var randY = MathTool.ScalarTool.RandomRange(0, this.directionRandomizer);
        // var randZ = MathTool.ScalarTool.RandomRange(0, this.directionRandomizer);
        var randX = 0;
        var randY = 0;
        var randZ = 0;

        resultDirection.x = resultDirection.x + randX;
        resultDirection.y = resultDirection.y + randY;
        resultDirection.z = resultDirection.z + randZ;
        resultDirection.normalize();
    }
    public static startPositionFunction(config: IEmitterConfig, worldMatrix: Matrix4, resultPosition: Vector3, emissionLoop: number, emissionProgress: number, emissionIndex: number, emissionTotal: number, isLocal: boolean): void {

        let s = computeRadians(emissionLoop, emissionProgress, emissionIndex, emissionTotal, Math.PI * 2, config.arcValue, config.arcSpread, config.arcSpeed, config.arcMode);

        var h: number;

        if (config.angle !== 0) {
            config.baseHeight = config.radius / Math.tan(config.angle / 2);
        }
        else {
            config.baseHeight = Cone.MAX_Z;
        }

        if (!config.emitFromSpawnPointOnly) {
            h = MathTool.ScalarTool.RandomRange(0, config.heightRange);
        } else {
            h = 0.0;
        }
        h = Math.max(0.00001, h);

        var radius = config.radius - MathTool.ScalarTool.RandomRange(0, config.radius * config.radiusThickness);
        if (config.baseHeight > 0) {
            radius = radius * (h * config.height + config.baseHeight) / config.baseHeight;
        }

        var randX = 0;
        var randZ = 0;
        var randY = 0;

        if (config.directionMode == EShapeEmitterDirectionMode.Unity) {
            randX = radius * Math.sin(s);
            randY = radius * Math.cos(s);
            randZ = h * config.height;
        }
        else {
            randX = radius * Math.sin(s);
            randZ = radius * Math.cos(s);
            randY = h * config.height;
        }

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