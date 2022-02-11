import { DefaultValue, EInterpolationCurveMode, EInterpolationGradienMode, FourGradientInfo, FourParamInfo, OneParamInfo, ThreeParamInfo, TInterpolateColor, TInterpolateConstant, TInterpolateCurve, TInterpolateGradient, TInterpolateRandom, TInterpolateTwoColors, TInterpolateTwoConstants, TInterpolateTwoCurves, TInterpolateTwoGradients, TParamColorOverLifetime, TParamForceOverLifetime, TParamGravity, TParamLimitVelocityOverLifetime, TParamRotationOverLifetime, TParamSizeOverLifetime, TParamStartColor, TParamStartLifetime, TParamStartRotation, TParamStartSize, TParamStartSpeed, TParamTextureSheet, TParamType, TParamVelocityOverLifetime } from "./iparticle_system_config";

//#region 曲线数据属性值类型
/**
 * 时间点
 */
type TCurveTime = number;
/**
 * 当前时间点对应值
 */
type TCurveValue = number;
/**
 * 当前时间点的进入时切线斜率
 */
type TCurveInTangent = number;
/**
 * 当前时间点的离开时切线斜率
 */
type TCurveOutTangent = number;
/**
 * 曲线模式
 */
type TCurveMode = number;
//#endregion

//#region 曲线关键帧 各属性数据在 数组中的序号描述
/**
 * 关键帧 时间信息 的数组序号
 */
const KeyIndexFrame = 0;
/**
 * 关键帧 值信息 的数组序号
 */
const KeyIndexValue = 1;
/**
 * 关键帧 InTangent 的数组序号
 */
const KeyIndexInTangent = 2;
/**
 * 关键帧 OutTangent 的数组序号
 */
const KeyIndexOutTangent = 3;
/**
 * 关键帧 曲线模式 的数组序号
 */
const KeyIndexMode = 4;
/**
 * 曲线 关键帧信息 - 数组形式
 */
export type ICurveKey  = [TCurveTime, TCurveValue, TCurveInTangent?, TCurveOutTangent?, TCurveMode?];
//#endregion

/**
 * Enum for the animation key frame interpolation type
 */
export enum AnimationKeyInterpolation {
    /**
     * Do not interpolate between keys and use the start key value only. Tangents are ignored
     */
    STEP = 1
}

/**
 * 插值工具模块描述
 */
export interface IInterpolation<T> {
    /**
     * 插值模式
     */
    mode: EInterpolationCurveMode | EInterpolationGradienMode;
    /**
     * 插值接口
     * @param progress 插值因子
     */
    interpolate(progress: number): T;
    /**
     * 销毁
     */
    dispose(): void;
}

//#region 曲线信息描述
/**
 * 曲线 关键帧信息数组 在曲线信息 数据中的序号
 */
const CurveIndexKeys = 0;
/**
 * 曲线 值域缩放数据 在曲线信息 数据中的序号
 */
const CurveIndexScalar = 1;
/**
 * 曲线 值域缩放数据 值类型
 */
type TCurveScalar = number;
/**
 * 曲线信息 数据 - 数组形式
 */
export type ICurve = [ICurveKey[], TCurveScalar];
//#endregion

//#region 可插值数据 值类型描述
/**
 * 一维插值 数据类型
 */
export type InterpolationData1 = number;
/**
 * 二维插值 数据类型
 */
export type InterpolationData2 = [number, number];
/**
 * 三维插值 数据类型
 */
export type InterpolationData3 = [number, number, number];
/**
 * 四维插值 数据类型
 */
export type InterpolationData4 = [number, number, number, number];
//#endregion

//#region 随机处理
/**
 * 一维数据间的随机
 * @param min
 * @param max
 * @param random 随机因子
 * @returns
 */
export function RandomRange(min: InterpolationData1, max: InterpolationData1, random: number): InterpolationData1 {
    if (min === max) { return min; }
    return ((random * (max - min)) + min);
}

/**
 * 二维数据间的随机
 * @param min
 * @param max
 * @param result
 * @param random0 第一随机因子
 * @param random1 第二随机因子
 */
export function RandomRange2(min: InterpolationData2, max: InterpolationData2, result: InterpolationData2, random0: number, random1: number) {
    result[0] = RandomRange(min[0], max[0], random0),
    result[1] = RandomRange(min[1], max[1], random1);
}
/**
 * 三维数据间的随机
 * @param min
 * @param max
 * @param result
 * @param random0 第一随机因子
 * @param random1 第二随机因子
 * @param random2 第三随机因子
 */
export function RandomRange3(min: InterpolationData3, max: InterpolationData3, result: InterpolationData3, random0: number, random1: number, random2: number) {
    result[0] = RandomRange(min[0], max[0], random0),
    result[1] = RandomRange(min[1], max[1], random1),
    result[2] = RandomRange(min[2], max[2], random2);
}
/**
 * 四维数据间的随机
 * @param min
 * @param max
 * @param result
 * @param random0 第一随机因子
 * @param random1 第二随机因子
 * @param random2 第三随机因子
 * @param random3 第四随机因子
 */
export function RandomRange4(min: InterpolationData4, max: InterpolationData4, result: InterpolationData4, random0: number, random1: number, random2: number, random3: number) {
    result[0] = RandomRange(min[0], max[0], random0),
    result[1] = RandomRange(min[1], max[1], random1),
    result[2] = RandomRange(min[2], max[2], random2),
    result[3] = RandomRange(min[3], max[3], random3);
}
function random() {
    return Math.random();
}
//#endregion

//#region 插值方法
/**
 * Hermite 插值
 * @param value1 第一控制点值
 * @param tangent1 第一控制点 切线斜率
 * @param value2 第二控制点值
 * @param tangent2 第二控制点 切线斜率
 * @param amount 插值因子
 * @returns
 */
export function Hermite(value1: number, tangent1: number, value2: number, tangent2: number, amount: number): number {
    var squared = amount * amount;
    var cubed = amount * squared;
    var part1 = ((2.0 * cubed) - (3.0 * squared)) + 1.0;
    var part2 = (-2.0 * cubed) + (3.0 * squared);
    var part3 = (cubed - (2.0 * squared)) + amount;
    var part4 = cubed - squared;

    return (((value1 * part1) + (value2 * part2)) + (tangent1 * part3)) + (tangent2 * part4);
}
/**
 * 曲线插值
 * @param amount 插值因子
 * @param curve 曲线描述
 * @returns
 */
export function InterpolationCurve(amount: number, curve: ICurve) {
    let keyCount = curve[CurveIndexKeys].length;

    if (keyCount == 0) {
        return curve[CurveIndexScalar];
    }

    let preIndex = 0;
    let nextIndex = keyCount - 1;

    let pre = curve[CurveIndexKeys][preIndex];
    let next = curve[CurveIndexKeys][nextIndex];

    if (keyCount == 1) {
        return pre[KeyIndexValue] * curve[CurveIndexScalar];
    }

    for (let i = 0; i < keyCount - 1; i++) {
        preIndex = i;
        nextIndex = i + 1;

        pre     = curve[CurveIndexKeys][preIndex];
        next    = curve[CurveIndexKeys][nextIndex];

        if (preIndex == 0 && amount <= pre[KeyIndexFrame]) {
            nextIndex = preIndex;
            next = pre;
            break;
        }

        if (pre[KeyIndexFrame] < amount && amount < next[KeyIndexFrame]) {
            break;
        }

        if (nextIndex == keyCount - 1 && next[KeyIndexFrame] <= amount) {
            preIndex = nextIndex;
            pre = next;
            break;
        }
    }

    if (preIndex == nextIndex) {
        return pre[KeyIndexValue] * curve[CurveIndexScalar];
    }

    amount = (amount - pre[KeyIndexFrame]) / (next[KeyIndexFrame] - pre[KeyIndexFrame]);

    return Hermite(pre[KeyIndexValue], <any>pre[KeyIndexOutTangent], next[KeyIndexValue], <any>next[KeyIndexInTangent], amount) * (curve[CurveIndexScalar]);
}
/**
 * 渐变插值
 * @param amount 插值因子
 * @param gradient 渐变控制点数组
 * @returns
 */
export function InterpolationGradient(amount: number, gradient: IGradient[]): number {
    let keyCount = gradient.length;

    if (keyCount == 0) {
        return 1;
    }

    let preIndex = 0;
    let nextIndex = keyCount - 1;

    let pre = gradient[preIndex];
    let next = gradient[nextIndex];

    if (keyCount == 1) {
        return pre[GradientIndexValue];
    }

    for (let i = 0; i < keyCount - 1; i++) {
        preIndex = i;
        nextIndex = i + 1;

        pre     = gradient[preIndex];
        next    = gradient[nextIndex];

        if (preIndex == 0 && amount <= pre[GradientIndexFrame]) {
            nextIndex = preIndex;
            next = pre;
            break;
        }

        if (pre[GradientIndexFrame] < amount && amount < next[GradientIndexFrame]) {
            break;
        }

        if (nextIndex == keyCount - 1 && next[GradientIndexFrame] <= amount) {
            preIndex = nextIndex;
            pre = next;
            break;
        }
    }

    if (preIndex == nextIndex) {
        return pre[GradientIndexValue];
    }

    amount = (amount - pre[GradientIndexFrame]) / (next[GradientIndexFrame] - pre[GradientIndexFrame]);

    return pre[GradientIndexValue] + (next[GradientIndexValue] - pre[GradientIndexValue]) * amount;
}
//#endregion

//#region 可插值数据类型的公共临时实例 - 用于计算过程中作为临时变量复用
const TempResult1: InterpolationData1 = 0;
const TempResult2: InterpolationData2 = [0, 0];
const TempResult3: InterpolationData3 = [0, 0, 0];
const TempResult4: InterpolationData4 = [0, 0, 0, 0];
const TempResult1B: InterpolationData1 = 0;
const TempResult2B: InterpolationData2 = [0, 0];
const TempResult3B: InterpolationData3 = [0, 0, 0];
const TempResult4B: InterpolationData4 = [0, 0, 0, 0];
//#endregion

//#region 曲线插值实现 - 一维 - 三维 - 四维
/**
 * 一维曲线插值
 */
export class FloatInterpolation implements IInterpolation<InterpolationData1> {
    mode: EInterpolationCurveMode = EInterpolationCurveMode.Constant;
    public constant0: InterpolationData1 | undefined;
    public constant1: InterpolationData1 | undefined;
    public minCurve: ICurve | undefined;
    public maxCurve: ICurve | undefined;
    interpolate(amount: number): InterpolationData1 {
        switch (this.mode) {
            case(EInterpolationCurveMode.TwoConstants):
            {
                return RandomRange(this.constant0 || 0, this.constant1 || 0, random());
            }
            case(EInterpolationCurveMode.Curve): {
                const curve = this.minCurve || this.maxCurve;
                return InterpolationCurve(amount, <any>curve);
            }
            case(EInterpolationCurveMode.TwoCurves): {
                const min = InterpolationCurve(amount, <ICurve>this.minCurve);
                const max = InterpolationCurve(amount, <ICurve>this.maxCurve);
                return RandomRange(min, max, random());
            }
            default: {
                return this.constant0 || this.constant1 || 0;
            }
        }
    }
    dispose() {
        this.constant0 = undefined;
        this.constant1 = undefined;

        this.minCurve = undefined;
        this.maxCurve = undefined;
    }
}
/**
 * 三维曲线插值
 */
export class Float3Interpolation implements IInterpolation<InterpolationData3> {
    mode: EInterpolationCurveMode = EInterpolationCurveMode.Constant;
    public constant0: InterpolationData3 | undefined;
    public constant1: InterpolationData3 | undefined;
    public minCurves: [ICurve, ICurve, ICurve] | undefined;
    public maxCurves: [ICurve, ICurve, ICurve] | undefined;
    interpolate(amount: number): InterpolationData3 {
        switch (this.mode) {
            case(EInterpolationCurveMode.TwoConstants):
            {
                RandomRange3(this.constant0, this.constant1, TempResult3, random(), random(), random());
                return TempResult3;
            }
            case(EInterpolationCurveMode.Curve): {
                const curve0 = (<[ICurve, ICurve, ICurve]>(<[ICurve, ICurve, ICurve]>this.minCurves))[0] || (<[ICurve, ICurve, ICurve]>this.maxCurves)[0];
                const curve1 = (<[ICurve, ICurve, ICurve]>this.minCurves)[1] || (<[ICurve, ICurve, ICurve]>this.maxCurves)[1];
                const curve2 = (<[ICurve, ICurve, ICurve]>this.minCurves)[2] || (<[ICurve, ICurve, ICurve]>this.maxCurves)[2];

                TempResult3[0] = InterpolationCurve(amount, curve0);
                TempResult3[1] = InterpolationCurve(amount, curve1);
                TempResult3[2] = InterpolationCurve(amount, curve2);

                return TempResult3;
            }
            case(EInterpolationCurveMode.TwoCurves): {
                const minCurve0 = (<[ICurve, ICurve, ICurve]>this.minCurves)[0];
                const minCurve1 = (<[ICurve, ICurve, ICurve]>this.minCurves)[1];
                const minCurve2 = (<[ICurve, ICurve, ICurve]>this.minCurves)[2];

                const maxCurve0 = (<[ICurve, ICurve, ICurve]>this.maxCurves)[0];
                const maxCurve1 = (<[ICurve, ICurve, ICurve]>this.maxCurves)[1];
                const maxCurve2 = (<[ICurve, ICurve, ICurve]>this.maxCurves)[2];

                TempResult3[0] = InterpolationCurve(amount, minCurve0);
                TempResult3[1] = InterpolationCurve(amount, minCurve1);
                TempResult3[2] = InterpolationCurve(amount, minCurve2);

                TempResult3B[0] = InterpolationCurve(amount, maxCurve0);
                TempResult3B[1] = InterpolationCurve(amount, maxCurve1);
                TempResult3B[2] = InterpolationCurve(amount, maxCurve2);

                RandomRange3(TempResult3, TempResult3B, TempResult3, random(), random(), random());

                return TempResult3;
            }
            default: {
                return this.constant0 || <InterpolationData3>this.constant1;
            }
        }
    }
    dispose() {
        this.constant0 = undefined;
        this.constant1 = undefined;

        this.minCurves = undefined;
        this.maxCurves = undefined;
    }
}
/**
 * 四维曲线插值
 */
export class Float4Interpolation implements IInterpolation<InterpolationData4> {
    mode: EInterpolationCurveMode = EInterpolationCurveMode.Constant;
    public constant0: InterpolationData4 | undefined;
    public constant1: InterpolationData4 | undefined;
    public minCurves: [ICurve, ICurve, ICurve, ICurve] | undefined;
    public maxCurves: [ICurve, ICurve, ICurve, ICurve] | undefined;
    interpolate(amount: number): InterpolationData4 {
        switch (this.mode) {
            case(EInterpolationCurveMode.TwoConstants):
            {
                RandomRange4(this.constant0, this.constant1, TempResult4, random(), random(), random(), random());
                return TempResult4;
            }
            case(EInterpolationCurveMode.Curve): {
                const curve0 = (<[ICurve, ICurve, ICurve, ICurve]>this.minCurves)[0] || (<[ICurve, ICurve, ICurve, ICurve]>this.maxCurves)[0];
                const curve1 = (<[ICurve, ICurve, ICurve, ICurve]>this.minCurves)[1] || (<[ICurve, ICurve, ICurve, ICurve]>this.maxCurves)[1];
                const curve2 = (<[ICurve, ICurve, ICurve, ICurve]>this.minCurves)[2] || (<[ICurve, ICurve, ICurve, ICurve]>this.maxCurves)[2];
                const curve3 = (<[ICurve, ICurve, ICurve, ICurve]>this.minCurves)[3] || (<[ICurve, ICurve, ICurve, ICurve]>this.maxCurves)[3];

                TempResult4[0] = InterpolationCurve(amount, curve0);
                TempResult4[1] = InterpolationCurve(amount, curve1);
                TempResult4[2] = InterpolationCurve(amount, curve2);
                TempResult4[3] = InterpolationCurve(amount, curve3);

                return TempResult4;
            }
            case(EInterpolationCurveMode.TwoCurves): {
                const minCurve0 = (<[ICurve, ICurve, ICurve, ICurve]>this.minCurves)[0];
                const minCurve1 = (<[ICurve, ICurve, ICurve, ICurve]>this.minCurves)[1];
                const minCurve2 = (<[ICurve, ICurve, ICurve, ICurve]>this.minCurves)[2];
                const minCurve3 = (<[ICurve, ICurve, ICurve, ICurve]>this.minCurves)[3];

                const maxCurve0 = (<[ICurve, ICurve, ICurve, ICurve]>this.maxCurves)[0];
                const maxCurve1 = (<[ICurve, ICurve, ICurve, ICurve]>this.maxCurves)[1];
                const maxCurve2 = (<[ICurve, ICurve, ICurve, ICurve]>this.maxCurves)[2];
                const maxCurve3 = (<[ICurve, ICurve, ICurve, ICurve]>this.maxCurves)[3];

                TempResult4[0] = InterpolationCurve(amount, minCurve0);
                TempResult4[1] = InterpolationCurve(amount, minCurve1);
                TempResult4[2] = InterpolationCurve(amount, minCurve2);
                TempResult4[3] = InterpolationCurve(amount, minCurve3);

                TempResult4B[0] = InterpolationCurve(amount, maxCurve0);
                TempResult4B[1] = InterpolationCurve(amount, maxCurve1);
                TempResult4B[2] = InterpolationCurve(amount, maxCurve2);
                TempResult4B[3] = InterpolationCurve(amount, maxCurve3);

                RandomRange4(TempResult4, TempResult4B, TempResult4, random(), random(), random(), random());

                return TempResult4;
            }
            default: {
                return this.constant0 || <InterpolationData4>this.constant1;
            }
        }
    }
    dispose() {
        this.constant0 = undefined;
        this.constant1 = undefined;

        this.minCurves = undefined;
        this.maxCurves = undefined;
    }
}
//#endregion

//#region 从 json 描述创建曲线插值模块
export const ZeroInterpolateConstant: InterpolationData1 = 0;
export const ZeroInterpolateCurve: ICurve = [[], 1];
export const OneInterpolateConstant: InterpolationData1 = 1;
export const OneInterpolateCurve: ICurve = [[], 0];
/**
 * 一维 - 根据目标数据使用场景 创建对应 默认插值模块
 * @param ptype 使用场景标识
 * @returns
 */
function defaultFloatInterpolation(ptype: TParamType): FloatInterpolation | undefined  {
    let interpolate: FloatInterpolation | undefined = undefined;
    switch (ptype) {
        case TParamStartSpeed: {
            interpolate = new FloatInterpolation();
            interpolate.mode = EInterpolationCurveMode.Constant;
            interpolate.constant0 = DefaultValue.startSpeed;
            break;
        }
        case TParamStartLifetime: {
            interpolate = new FloatInterpolation();
            interpolate.mode = EInterpolationCurveMode.Constant;
            interpolate.constant0 = DefaultValue.startLifetime;
            break;
        }
        case TParamTextureSheet: {
            interpolate = new FloatInterpolation();
            interpolate.mode = EInterpolationCurveMode.Constant;
            interpolate.constant0 = DefaultValue.textureSheetFrame;
            break;
        }
    }

    return interpolate;
}
/**
 * 一维 - 从 json 描述创建曲线插值模块
 * @param interpolation 目标插值模块 - 如果外部传入则逻辑为应用json配置到该模块
 * @param config json 描述
 * @param ptype 数据应用场景描述
 * @param scale 数据值域缩放 - 如角度转弧度，秒转毫秒，重力因子转重力值
 * @returns
 */
export function parseFloatInterpolation(interpolation: FloatInterpolation | undefined, config: undefined | OneParamInfo, ptype: TParamType, scale: number = 1): FloatInterpolation | undefined {

    if (config) {
        if (!interpolation) {
            interpolation = new FloatInterpolation();
        }

        switch (config[1]) {
            case TInterpolateConstant: {
                interpolation.mode = EInterpolationCurveMode.Constant;
                interpolation.constant0 = config[2] * scale;
                break;
            }
            case TInterpolateTwoConstants: {
                interpolation.mode = EInterpolationCurveMode.TwoConstants;
                interpolation.constant0 = config[2] * scale;
                interpolation.constant1 = config[3] * scale;
                break;
            }
            case TInterpolateCurve: {
                interpolation.mode = EInterpolationCurveMode.Curve;
                interpolation.minCurve = scaleCurve(config[2], scale);
                break;
            }
            case TInterpolateTwoCurves: {
                interpolation.mode = EInterpolationCurveMode.Curve;
                interpolation.minCurve = scaleCurve(config[2], scale);
                interpolation.maxCurve = scaleCurve(config[3], scale);
                break;
            }
        }
    }
    else {
        interpolation = defaultFloatInterpolation(ptype);
    }

    return interpolation;
}

function scaleCurve(curve: ICurve, scale: number): ICurve {
    curve[1] *= scale;
    return curve;
}

function extendThreeParamConstant(constant: number, ptype: TParamType): InterpolationData3 {
    switch (ptype) {
        case TParamGravity: {
            return [0, constant, 0];
        }
        case TParamRotationOverLifetime:
        case TParamStartRotation: {
            return [0, 0, constant];
        }
        default:
            return [constant, constant, constant];
    }
}

function extendThreeParamCurve(curve: ICurve, ptype: TParamType): [ICurve, ICurve, ICurve] {
    switch (ptype) {
        case TParamGravity: {
            return [ZeroInterpolateCurve, curve, ZeroInterpolateCurve];
        }
        case TParamRotationOverLifetime:
        case TParamStartRotation: {
            return [ZeroInterpolateCurve, ZeroInterpolateCurve, curve];
        }
        default:
            return [curve, curve, curve];
    }
}
/**
 * 三维 - 一维 json 描述 转换为 三维 json 描述
 * @example 默认 Y 旋转转换 XYZ 旋转
 * @param one 一维 json 描述
 * @param ptype 数据应用场景描述
 * @param scale 数据值域缩放 - 如角度转弧度，秒转毫秒，重力因子转重力值
 * @returns
 */
export function formatThreeParam(one: OneParamInfo | ThreeParamInfo, ptype: TParamType, scale: number): ThreeParamInfo {
    let three: ThreeParamInfo = <ThreeParamInfo>one;
    if (one[0] == 1) {
        switch (one[1]) {
            case TInterpolateConstant: {
                three = [
                    3,
                    TInterpolateConstant,
                    extendThreeParamConstant(one[2] * scale, ptype)
                ];
                break;
            }
            case TInterpolateTwoConstants: {
                three = [
                    3,
                    TInterpolateTwoConstants,
                    extendThreeParamConstant(one[2] * scale, ptype),
                    extendThreeParamConstant(one[3] * scale, ptype)
                ];
                break;
            }
            case TInterpolateCurve: {
                three = [
                    3,
                    TInterpolateCurve,
                    extendThreeParamCurve(scaleCurve(one[2], scale), ptype)
                ];
                break;
            }
            case TInterpolateTwoCurves: {
                three = [
                    3,
                    TInterpolateTwoCurves,
                    extendThreeParamCurve(scaleCurve(one[2], scale), ptype),
                    extendThreeParamCurve(scaleCurve(one[3], scale), ptype)
                ];
                break;
            }
        }
    }

    return three;
}

/**
 * 三维 - 根据目标数据使用场景 创建对应 默认插值模块
 * @param ptype 使用场景标识
 * @returns
 */
function defaultFloat3Interpolation(ptype: TParamType): Float3Interpolation | undefined {
    let interpolate: Float3Interpolation | undefined = undefined;
    switch (ptype) {
        case TParamStartSize: {
            interpolate = new Float3Interpolation();
            interpolate.mode = EInterpolationCurveMode.Constant;
            interpolate.constant0 = DefaultValue.startSize;
            break;
        }
        case TParamStartRotation: {
            interpolate = new Float3Interpolation();
            interpolate.mode = EInterpolationCurveMode.Constant;
            interpolate.constant0 = DefaultValue.startRotation;
            break;
        }
        case TParamGravity: {
            interpolate = new Float3Interpolation();
            interpolate.mode = EInterpolationCurveMode.Constant;
            interpolate.constant0 = DefaultValue.gravity;
            break;
        }
        case TParamVelocityOverLifetime: {
            // interpolate = new Float3Interpolation();
            // interpolate.mode = EInterpolationMode.Constant;
            // interpolate.constant0 = DefaultValue.velocityOverLifetime;
            break;
        }
        case TParamLimitVelocityOverLifetime: {
            // interpolate = new Float3Interpolation();
            // interpolate.mode = EInterpolationMode.Constant;
            // interpolate.constant0 = DefaultValue.limitVelocityOverLifetime;
            break;
        }
        case TParamForceOverLifetime: {
            // interpolate = new Float3Interpolation();
            // interpolate.mode = EInterpolationMode.Constant;
            // interpolate.constant0 = DefaultValue.forceOverLifetime;
            break;
        }
        case TParamSizeOverLifetime: {
            // interpolate = new Float3Interpolation();
            // interpolate.mode = EInterpolationMode.Constant;
            // interpolate.constant0 = DefaultValue.sizeOverLifetime;
            break;
        }
        case TParamRotationOverLifetime: {
            // interpolate = new Float3Interpolation();
            // interpolate.mode = EInterpolationMode.Constant;
            // interpolate.constant0 = DefaultValue.rotationOverLifetime;
            break;
        }
    }

    return interpolate;
}

/**
 * 三维 - 从 json 描述创建曲线插值模块
 * @param interpolation 目标插值模块 - 如果外部传入则逻辑为应用json配置到该模块
 * @param config json 描述
 * @param ptype 数据应用场景描述
 * @param scale 数据值域缩放 - 如角度转弧度，秒转毫秒，重力因子转重力值
 * @returns
 */
export function parseFloat3Interpolation(interpolation: Float3Interpolation | undefined, config: OneParamInfo | ThreeParamInfo, ptype: TParamType, scale: number = 1): Float3Interpolation | undefined {

    if (config) {
        if (!interpolation) {
            interpolation = new Float3Interpolation();
        }

        config = <ThreeParamInfo>formatThreeParam(config, ptype, scale);
        switch (config[1]) {
            case TInterpolateConstant: {
                interpolation.mode = EInterpolationCurveMode.Constant;
                interpolation.constant0 = config[2];
                interpolation.constant1 = config[2];
                break;
            }
            case TInterpolateTwoConstants: {
                interpolation.mode = EInterpolationCurveMode.TwoConstants;
                interpolation.constant0 = config[2];
                interpolation.constant1 = config[3];
                break;
            }
            case TInterpolateCurve: {
                interpolation.mode = EInterpolationCurveMode.Curve;
                interpolation.minCurves = config[2];
                interpolation.maxCurves = config[2];
                break;
            }
            case TInterpolateTwoCurves: {
                interpolation.mode = EInterpolationCurveMode.Curve;
                interpolation.minCurves = config[2];
                interpolation.maxCurves = config[3];
                break;
            }
        }
    }
    else {
        interpolation = defaultFloat3Interpolation(ptype);
    }

    return interpolation;
}

/**
 * 四维 - 根据目标数据使用场景 创建对应 默认插值模块
 * @param ptype 使用场景标识
 * @returns
 */
function defaultFloat4Interpolation(ptype: TParamType): Float4Interpolation | undefined {
    let interpolate: Float4Interpolation | undefined;
    switch (ptype) {
        case TParamStartColor: {
            interpolate = new Float4Interpolation();
            interpolate.mode = EInterpolationCurveMode.Constant;
            interpolate.constant0 = DefaultValue.startColor;
            break;
        }
        case TParamColorOverLifetime: {
            // interpolate = new Float4Interpolation();
            // interpolate.mode = EInterpolationMode.Constant;
            // interpolate.constant0 = DefaultValue.colorOverLifetime;
            break;
        }
    }

    return interpolate;
}

/**
 * 四维 - 从 json 描述创建曲线插值模块
 * @param interpolation 目标插值模块 - 如果外部传入则逻辑为应用json配置到该模块
 * @param config json 描述
 * @param ptype 数据应用场景描述
 * @param scale 数据值域缩放 - 如角度转弧度，秒转毫秒，重力因子转重力值
 * @returns
 */
export function parseFloat4Interpolation(interpolation: Float4Interpolation | undefined, config: FourParamInfo, ptype: TParamType): Float4Interpolation | undefined {

    if (config) {
        if (!interpolation) {
            interpolation = new Float4Interpolation();
        }
        switch (config[1]) {
            case TInterpolateConstant: {
                interpolation.mode = EInterpolationCurveMode.Constant;
                interpolation.constant0 = config[2];
                interpolation.constant1 = config[2];
                break;
            }
            case TInterpolateTwoConstants: {
                interpolation.mode = EInterpolationCurveMode.TwoConstants;
                interpolation.constant0 = config[2];
                interpolation.constant1 = config[3];
                break;
            }
            case TInterpolateCurve: {
                interpolation.mode = EInterpolationCurveMode.Curve;
                interpolation.minCurves = config[2];
                interpolation.maxCurves = config[2];
                break;
            }
            case TInterpolateTwoCurves: {
                interpolation.mode = EInterpolationCurveMode.Curve;
                interpolation.minCurves = config[2];
                interpolation.maxCurves = config[3];
                break;
            }
        }
    }
    else {
        interpolation = defaultFloat4Interpolation(ptype);
    }

    return interpolation;
}
//#endregion

//#region 渐变信息描述
/**
 * 渐变控制点 时间 数据类型
 */
 type TGradientTime = number;
 /**
  * 渐变控制点 值 数据类型
  */
 type TGradientValue = number;
 /**
  * 渐变控制点 时间 数据在渐变信息中的序号
  */
 const GradientIndexFrame = 0;
 /**
  * 渐变控制点 值 数据在渐变信息中的序号
  */
 const GradientIndexValue = 1;
 /**
  * 渐变控制点数据 - 数组形式
  */
 export type IGradient = [TGradientTime, TGradientValue];
 export type IGradient4 = [IGradient[], IGradient[], IGradient[], IGradient[]];
 //#endregion

//#region 渐变插值
export class Color4Gradient implements IInterpolation<[number, number, number, number]> {
    mode: EInterpolationGradienMode = EInterpolationGradienMode.Random;
    constant0: [number, number, number, number] | undefined;
    constant1: [number, number, number, number] | undefined;
    minGradients: IGradient4 | undefined;
    maxGradients: IGradient4 | undefined;
    interpolate(amount: number): [number, number, number, number] {
        switch (this.mode) {
            case(EInterpolationGradienMode.Color): {
                return this.constant0 || <[number, number, number, number]>this.constant1;
            }
            case(EInterpolationGradienMode.TwoColors):
            {
                RandomRange4(this.constant0 || <[number, number, number, number]>this.constant1, this.constant1 || <[number, number, number, number]>this.constant0, TempResult4, random(), random(), random(), random());
                return TempResult4;
            }
            case(EInterpolationGradienMode.Gradient): {
                const gradient0 = (<IGradient4>this.minGradients)[0] || (<IGradient4>this.maxGradients)[0];
                const gradient1 = (<IGradient4>this.minGradients)[1] || (<IGradient4>this.maxGradients)[1];
                const gradient2 = (<IGradient4>this.minGradients)[2] || (<IGradient4>this.maxGradients)[2];
                const gradient3 = (<IGradient4>this.minGradients)[3] || (<IGradient4>this.maxGradients)[3];

                TempResult4[0] = InterpolationGradient(amount, gradient0);
                TempResult4[1] = InterpolationGradient(amount, gradient1);
                TempResult4[2] = InterpolationGradient(amount, gradient2);
                TempResult4[3] = InterpolationGradient(amount, gradient3);

                return TempResult4;
            }
            case(EInterpolationGradienMode.TwoGradients): {
                const minGradient0 = (<IGradient4>this.minGradients)[0];
                const minGradient1 = (<IGradient4>this.minGradients)[1];
                const minGradient2 = (<IGradient4>this.minGradients)[2];
                const minGradient3 = (<IGradient4>this.minGradients)[3];

                const maxGradient0 = (<IGradient4>this.maxGradients)[0];
                const maxGradient1 = (<IGradient4>this.maxGradients)[1];
                const maxGradient2 = (<IGradient4>this.maxGradients)[2];
                const maxGradient3 = (<IGradient4>this.maxGradients)[3];

                TempResult4[0] = InterpolationGradient(amount, minGradient0);
                TempResult4[1] = InterpolationGradient(amount, minGradient1);
                TempResult4[2] = InterpolationGradient(amount, minGradient2);
                TempResult4[3] = InterpolationGradient(amount, minGradient3);

                TempResult4B[0] = InterpolationGradient(amount, maxGradient0);
                TempResult4B[1] = InterpolationGradient(amount, maxGradient1);
                TempResult4B[2] = InterpolationGradient(amount, maxGradient2);
                TempResult4B[3] = InterpolationGradient(amount, maxGradient3);

                RandomRange4(TempResult4, TempResult4B, TempResult4, random(), random(), random(), random());

                return TempResult4;
            }
            default: {
                TempResult4[0] = random();
                TempResult4[1] = random();
                TempResult4[2] = random();
                TempResult4[3] = random();
                return TempResult4;
            }
        }
    }
    dispose() {
        this.constant0 = undefined;
        this.constant1 = undefined;

        // (<IGradient4>this.minGradients) = undefined;
        // (<IGradient4>this.maxGradients) = undefined;
    }

}
/**
 * 根据json表达创建渐变插值模块
 * @param interpolation
 * @param config
 * @param ptype
 * @returns
 */
export function parseColor4Gradient(interpolation: Color4Gradient | undefined, config: FourGradientInfo, ptype: TParamType): Color4Gradient | undefined {

    if (config) {
        if (!interpolation) {
            interpolation = new Color4Gradient();
        }

        switch (config[1]) {
            case TInterpolateRandom: {
                interpolation.mode = EInterpolationGradienMode.Random;
                break;
            }
            case TInterpolateColor: {
                interpolation.mode = EInterpolationGradienMode.Color;
                interpolation.constant0 = config[2];
                interpolation.constant1 = config[2];
                break;
            }
            case TInterpolateTwoColors: {
                interpolation.mode = EInterpolationGradienMode.TwoColors;
                interpolation.constant0 = config[2];
                interpolation.constant1 = config[3];
                break;
            }
            case TInterpolateGradient: {
                interpolation.mode = EInterpolationGradienMode.Gradient;
                interpolation.minGradients = config[2];
                interpolation.maxGradients = config[2];
                break;
            }
            case TInterpolateTwoGradients: {
                interpolation.mode = EInterpolationGradienMode.TwoGradients;
                interpolation.minGradients = config[2];
                interpolation.maxGradients = config[3];
                break;
            }
        }
    }
    else {
        // interpolation = defaultFloat4Interpolation(ptype);
    }

    return interpolation;
}
//#endregion