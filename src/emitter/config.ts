import { Matrix4 } from "../math/matrix4";
import { Vector3 } from "../math/vector3";
import { EArcMode, EShapeEmitterDirectionMode, EShapeEmitterMode } from "./mode";

type T = number;

export interface IEmitterConfig {
    mode: EShapeEmitterMode;
    radius: T;
    angle: T;
    radiusThickness: T;
    baseHeight: T;
    height: T;
    heightRange: T;
    arcMode: EArcMode;
    arcValue: T;
    arcSpread: T;
    arcSpeed: T;
    scale: [T, T, T];
    directionMode?: EShapeEmitterDirectionMode;
    emitFromSpawnPointOnly?: boolean;
    directionRandomizer?: number;
}

export let SpreadLimit = 0.0001;

export function computeRadians(
    emission_loop: number, 
    emission_progress: number,
    emission_index: number,
    emission_total: number,
    arc_total_value: number,
    arc_value: number,
    arc_spread: number,
    arc_speed: number,
    arc_mode: EArcMode
) {
    let s: number;
    emission_progress = emission_progress * arc_speed;

    switch (arc_mode) {
        case (EArcMode.Loop):{
            let radians = (emission_loop + emission_progress) * arc_total_value;
            s = radians % arc_value;

            if (SpreadLimit < arc_spread) {
                arc_spread = arc_spread * arc_value;
                s = Math.round(s / arc_spread) * arc_spread;
            }

            break;
        }
        case (EArcMode.PingPong):{
            let radians = (emission_loop + emission_progress) * arc_total_value;
            let loop_count = Math.floor(radians / arc_value);
            s = radians % arc_value;

            if (SpreadLimit < arc_spread) {
                arc_spread = arc_spread * arc_value;
                s = Math.round(s / arc_spread) * arc_spread;
            }

            if (loop_count % 2 == 1) {
                s = arc_value;
            }

            break;
        }
        case (EArcMode.BurstsDpread):{
            emission_progress = emission_index / emission_total;

            if (SpreadLimit < arc_spread) {
                arc_spread = arc_spread * arc_value;
                emission_progress = Math.round(emission_progress / arc_spread) * arc_spread;
            }

            s = arc_value * emission_progress;
            break;
        }
        default:{
            s = Math.random() * arc_value;
            break;
        }
    }

    return s;
}