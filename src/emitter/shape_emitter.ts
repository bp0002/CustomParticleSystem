import { Matrix4 } from "../math/matrix4";
import { Vector3 } from "../math/vector3";
import { Box } from "./box";
import { Circle } from "./circle";
import { Cone } from "./cone";
import { IEmitterConfig } from "./config";
import { Edge } from "./edge";
import { Hemisphere } from "./hemisphere";
import { EShapeEmitterMode } from "./mode";
import { Point } from "./point";
import { Rectangle } from "./rectangle";
import { Sphere } from "./sphere";

export class ShapeEmitterTool {
    /**
     * Called by the particle System when the direction is computed for the created particle.
     */
    public static startDirectionFunction(config: IEmitterConfig, worldMatrix: Matrix4, directionToUpdate: Vector3, localPosition: Vector3, isLocal: boolean) {
        switch (config.mode) {
            case (EShapeEmitterMode.Box         ): {
                Box.computeDirection        (config, worldMatrix, directionToUpdate, localPosition, isLocal);
                break;
            }
            case (EShapeEmitterMode.Cone        ): {
                Cone.computeDirection       (config, worldMatrix, directionToUpdate, localPosition, isLocal);
                break;
            }
            case (EShapeEmitterMode.Hemisphere  ): {
                Hemisphere.computeDirection (config, worldMatrix, directionToUpdate, localPosition, isLocal);
                break;
            }
            case (EShapeEmitterMode.Sphere      ): {
                Sphere.computeDirection     (config, worldMatrix, directionToUpdate, localPosition, isLocal);
                break;
            }
            case (EShapeEmitterMode.Edge        ): {
                Edge.computeDirection       (config, worldMatrix, directionToUpdate, localPosition, isLocal);
                break;
            }
            case (EShapeEmitterMode.Circle      ): {
                Circle.computeDirection     (config, worldMatrix, directionToUpdate, localPosition, isLocal);
                break;
            }
            case (EShapeEmitterMode.Rectangle   ): {
                Rectangle.computeDirection  (config, worldMatrix, directionToUpdate, localPosition, isLocal);
                break;
            }
            default: {
                Point.computeDirection      (config, worldMatrix, directionToUpdate, localPosition, isLocal);
                break;
            }
        }
    }

    /**
     * Called by the particle System when the position is computed for the created particle.
     * @param config 
     * @param worldMatrix 
     * @param positionToUpdate 
     * @param localPosition 
     * @param emissionLoop 当前发射事件所属的发射循环数
     * @param emissionProgress 当前发射事件的时间进度
     * @param emissionIndex 目标在此次发射中的序号
     * @param esmissionTotal 此次发射的总量
     */
    public static startPositionFunction(config: IEmitterConfig, worldMatrix: Matrix4, positionToUpdate: Vector3, emissionLoop: number, emissionProgress: number, emissionIndex: number, emissionTotal: number, isLocal: boolean) {

        switch (config.mode) {
            case (EShapeEmitterMode.Box         ): {
                Box.startPositionFunction       (config, worldMatrix, positionToUpdate, emissionLoop, emissionProgress, emissionIndex, emissionTotal, isLocal);
                break;
            }
            case (EShapeEmitterMode.Cone        ): {
                Cone.startPositionFunction      (config, worldMatrix, positionToUpdate, emissionLoop, emissionProgress, emissionIndex, emissionTotal, isLocal);
                break;
            }
            case (EShapeEmitterMode.Hemisphere  ): {
                Hemisphere.startPositionFunction(config, worldMatrix, positionToUpdate, emissionLoop, emissionProgress, emissionIndex, emissionTotal, isLocal);
                break;
            }
            case (EShapeEmitterMode.Sphere      ): {
                Sphere.startPositionFunction    (config, worldMatrix, positionToUpdate, emissionLoop, emissionProgress, emissionIndex, emissionTotal, isLocal);
                break;
            }
            case (EShapeEmitterMode.Edge        ): {
                Edge.startPositionFunction      (config, worldMatrix, positionToUpdate, emissionLoop, emissionProgress, emissionIndex, emissionTotal, isLocal);
                break;
            }
            case (EShapeEmitterMode.Circle      ): {
                Circle.startPositionFunction    (config, worldMatrix, positionToUpdate, emissionLoop, emissionProgress, emissionIndex, emissionTotal, isLocal);
                break;
            }
            case (EShapeEmitterMode.Rectangle   ): {
                Rectangle.startPositionFunction (config, worldMatrix, positionToUpdate, emissionLoop, emissionProgress, emissionIndex, emissionTotal, isLocal);
                break;
            }
            default: {
                Point.startPositionFunction     (config, worldMatrix, positionToUpdate, emissionLoop, emissionProgress, emissionIndex, emissionTotal, isLocal);
                break;
            }
        }
    }
}