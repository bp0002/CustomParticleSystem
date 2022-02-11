import { IEmitterConfig } from "./emitter/config";
import { ShapeEmitterTool } from "./emitter/shape_emitter";
import { IInterpolation } from "./interpolation";
import { EInterpolationCurveMode } from "./iparticle_system_config";
import { directionToQuaternion, MathTool } from "./math/math";
import { Matrix4 } from "./math/matrix4";
import { Quaternion } from "./math/quaternion";
import { Vector3 } from "./math/vector3";
import { Vector4 } from "./math/vector4";
import { TextureSheet } from "./texture_sheet";

export enum EMeshParticleSpaceMode {
    Local = 0,
    /**
     * 发射在世界空间时, 父级尽量不要有旋转动画, 因为 动画 与 粒子动画的衔接有误差，无法完美适配
     */
    World = 1,
}

export enum EMeshParticleScaleMode {
    Hierarchy = 0,
    Local = 1,
    Shape = 2,
}

export enum ERenderAlignment {
    View    = 0,
    World   = 1,
    /**
     * Local 无需额外适配
     */
    Local   = 2,
}

/**
 * 对接 Unity ParticleSystem Mesh Mode
 */
export class ParticleSystemTool {

    public static TempVector3_0: Vector3;
    public static TempVector3_1: Vector3;
    public static TempQuaternion_0: Quaternion;
    public static TempMatrix_1: Matrix4;

    public static sqrt3 = Math.sqrt(3);

    public static init() {
        ParticleSystemTool.TempVector3_0        = MathTool.Vector3Tool.Zero();
        ParticleSystemTool.TempVector3_1        = MathTool.Vector3Tool.Zero();
        ParticleSystemTool.TempQuaternion_0     = MathTool.QuaternionTool.Zero();
        ParticleSystemTool.TempMatrix_1         = MathTool.Matrix4Tool.Zero();
        ParticleSystemTool.sqrt3                = Math.sqrt(3);
    }
    /**
     * 最大粒子数
     */
    public maxParticles: number = 100;
    /**
     * 是否循环
     */
    public looping: boolean = true;
    /**
     * 是否预热
     */
    public prewarm: boolean = false;
    /**
     * 粒子系统发射持续时间
     */
    public duration: number = 5.0;
    private _loopCount: number = 0;
    /**
     * 延时时间 - 毫秒
     */
    public startDelay: number = 0;
    public emitterShape: IEmitterConfig;
    /**
     * 一次发射循环的时间 - 毫秒
     */
    public emissionTime: number = 1000;
    /**
     * 当前已循环次数
     */
    public emissionLoop: number = 0;
    /**
     * 当前发射循环的进度
     */
    public emissionProgress: number = 0;
    /**
     * 每秒发射的粒子数目
     */
    public rateOverTime: number = 10;
    /**
     * 指定时间点 开始 持续 指定时间内 发射指定数目
     * [开始时间, 发射数目, 循环次数, 间隔]
     * @tip 需要按 开始时间从小到大排序
     */
    public bursts: [number, number, number, number][] = [];
    private _burstsLoopCount: number[] = [];

    /**
     * 发射空间
     * * Local - 本地: 发射开始时的方向受父级影响, 发射后的位置也受父级影响
     * * World - 世界空间: 发射开始时的方向受父级影响, 发射后的位置不再受父级影响
     */
    public simulationSpace: EMeshParticleSpaceMode = EMeshParticleSpaceMode.Local;
    public scalingSpace: EMeshParticleScaleMode = EMeshParticleScaleMode.Hierarchy;
    public renderAlignment: ERenderAlignment = ERenderAlignment.Local;

    public startLifetimeInterpolation: IInterpolation<number> | undefined;
    public startSpeedInterpolation: IInterpolation<number> | undefined;
    public startSizeInterpolation: IInterpolation<[number, number, number]> | undefined;
    public startRotationInterpolation: IInterpolation<[number, number, number]> | undefined;
    public startColorInterpolation: IInterpolation<[number, number, number, number]> | undefined;

    public gravityInterpolation: IInterpolation<[number, number, number]> | undefined;
    /**
     * 位移速度
     * @tip 默认模式 - ConstantsUnite - XYZ 共用一个随机数
     * @tip 为 Constants | ConstantsUnite 模式应用插值时, 仅创建时使用, 意义为: 创建时速度基础上附加速度
     * @tip 为 Curves 模式时, 运行过程中使用, 意义为: 创建时速度基础上附加速度 - 每次循环累加 此次循环 与 上次循环 速度值的差值
     */
    public velocityOverLifetimeInterpolation: IInterpolation<[number, number, number]> | undefined;
    public velocityOverLifetimeIsLocal: boolean = true;
    public limitVelocityOverLifetimeDampen: number = 0;
    public limitVelocityOverLifetimeInterpolation: IInterpolation<number> | undefined;
    public forceOverLifetimeInterpolation: IInterpolation<[number, number, number]> | undefined;
    public forceSpaceIsLocal: boolean = true;
    public colorOverLifetimeInterpolation: IInterpolation<[number, number, number, number]> | undefined;
    /**
     * 缩放
     * @tip 默认模式 - ConstantsUnite - XYZ 共用一个随机数
     * @tip 为 Constants | ConstantsUnite 模式应用插值时, 仅创建时使用, 意义为: 仅对创建时大小的影响倍数
     * @tip 为 Curves 模式时, 运行过程中使用, 意义为: 创建时大小的影响倍数
     */
    public sizeOverLifetimeInterpolation: IInterpolation<[number, number, number]> | undefined;
    /**
     * 旋转
     * @tip 默认模式 - ConstantsUnite - XYZ 共用一个随机数
     * @tip Unity 中单一 Angle 对应 只处理 Y 轴
     * @tip 与 Unity 编辑时不同, 此处单位为 弧度
     * @tip 为 Constants | ConstantsUnite 模式时, 仅创建时使用, 意义为: 每秒旋转速度
     * @tip 为 Curves 模式时, 运行过程中使用, 意义为: 每秒旋转速度
     */
    public rotationOverLifetimeInterpolation: IInterpolation<[number, number, number]> | undefined;
    /**
     * Texture Sheet Animation
     */
    public textureSheetInterpolation: TextureSheet | undefined;

    // 局部空间数据 - 每粒子
    /**
     * 已持续生命
     */
    private _ageList: number[] = [];
    private _ratioList: number[] = [];
    /**
     * 生命限制
     */
    private _lifeTimeList: number[] = [];
    private _activeTimeList: number[] = [];
    private _startGravityList: Vector3[] = [];
    private _startLocalPositionList: Vector3[] = [];
    private _startPositionList: Vector3[] = [];
    private _startSizeList: Vector3[] = [];
    private _startColorList: Vector4[] = [];
    private _realtimeLocalPositionList: Vector3[] = [];
    private _realtimeRotationList: [number, number, number][] = [];
    private _realtimeSizeList: Vector3[] = [];
    private _realtimeColorList: Vector4[] = [];
    private _velocityLastList: Vector3[] = [];
    private _limitVelocityFlagList: boolean[] = [];
    private _limitVelocityList: number[] = [];
    private _realtimeForceList: Vector3[] = [];
    private _startDirectionList: Vector3[] = [];
    private _realtimeVelocityDirectionList: Vector3[] = [];
    private _activeIdList: number[] = [];
    private _activeFlagList: number[] = [];
    private _waitIdList: number[] = [];
    private _startWorldMatrixList: Matrix4[] = [];
    private _startWorldRIMList: Matrix4[] = [];
    private _realStartWMList: Matrix4[] = [];
    private _uvSheetList: [number, number, number, number][] = [];

    public enableForceOverLifeTime = false;
    public enableVelocityOverLifeTime = false;
    public enableLimitVelocityOverLifeTime = false;
    public enableColorOverLifeTime = false;
    public enableSizeOverLifeTime = false;
    public enableRotationOverLifeTime = false;

    private _particleSystemAge: number = 0;

    private _tempVector3: Vector3 = MathTool.Vector3Tool.Zero();
    private _tempVector4: Vector4 = MathTool.Vector4Tool.Zero();

    private _lastTime: number = 0;
    private _deltaTime: number = 0;
    private _lastCreateTime: number = 0;

    private _isPlaying: boolean = false;
    private _isComputeable: boolean = false;

    public getParentWorldMatrix: () => Matrix4 = MathTool.Matrix4Tool.Identity;
    public getWorldMatrix: () => Matrix4 = MathTool.Matrix4Tool.Identity;
    public getLocalMatrix: () => Matrix4 = MathTool.Matrix4Tool.Identity;
    public getCameraPosition: () => Vector3 = MathTool.Vector3Tool.Zero;

    private _isDisposed: boolean = false;

    public dispose() {
        if (this._isDisposed) {
            return;
        }
        this.stop();

        this._mpMatrixList = undefined;
        this._mpColorData = undefined;

        this.startLifetimeInterpolation             && this.startLifetimeInterpolation            .dispose();
        this.startSpeedInterpolation                && this.startSpeedInterpolation               .dispose();
        this.startSizeInterpolation                 && this.startSizeInterpolation                .dispose();
        this.startRotationInterpolation             && this.startRotationInterpolation            .dispose();
        this.startColorInterpolation                && this.startColorInterpolation               .dispose();
        this.gravityInterpolation                   && this.gravityInterpolation                  .dispose();
        this.velocityOverLifetimeInterpolation      && this.velocityOverLifetimeInterpolation     .dispose();
        this.limitVelocityOverLifetimeInterpolation && this.limitVelocityOverLifetimeInterpolation.dispose();
        this.forceOverLifetimeInterpolation         && this.forceOverLifetimeInterpolation        .dispose();
        this.colorOverLifetimeInterpolation         && this.colorOverLifetimeInterpolation        .dispose();
        this.sizeOverLifetimeInterpolation          && this.sizeOverLifetimeInterpolation         .dispose();
        this.rotationOverLifetimeInterpolation      && this.rotationOverLifetimeInterpolation     .dispose();

        this.bursts                 .length = 0,    // this.bursts                 = undefined;
        this._activeIdList          .length = 0,    // this._activeIdList          = undefined;
        this._activeFlagList        .length = 0,    // this._activeFlagList        = undefined;
        this._waitIdList            .length = 0,    // this._waitIdList            = undefined;
        this._ageList               .length = 0,    // this._ageList               = undefined;
        this._ratioList             .length = 0,    // this._ratioList             = undefined;
        this._lifeTimeList          .length = 0,    // this._lifeTimeList          = undefined;
        this._activeTimeList        .length = 0,    // this._activeTimeList        = undefined;
        this._startGravityList      .length = 0,    // this._startGravityList      = undefined;
        this._startLocalPositionList.length = 0,    // this._startLocalPositionList= undefined;
        this._startPositionList     .length = 0,    // this._startPositionList     = undefined;
        this._startSizeList         .length = 0,    // this._startSizeList         = undefined;
        this._startColorList        .length = 0,    // this._startColorList        = undefined;
        this._realtimeLocalPositionList     .length = 0,    // this._localPositionList     = undefined;
        this._realtimeRotationList          .length = 0,    // this._rotationList          = undefined;
        this._realtimeSizeList              .length = 0,    // this._sizeList              = undefined;
        this._realtimeColorList             .length = 0,    // this._colorList             = undefined;
        this._velocityLastList      .length = 0,    // this._velocityLastList      = undefined;
        this._limitVelocityFlagList .length = 0,    // this._limitVelocityFlagList = undefined;
        this._limitVelocityList     .length = 0,    // this._limitVelocityList = undefined;
        this._realtimeForceList             .length = 0,    // this._forceList             = undefined;
        this._startDirectionList    .length = 0,    // this._startDirectionList    = undefined;
        this._realtimeVelocityDirectionList     .length = 0;
        this._startWorldMatrixList  .length = 0,    // this._startWorldMatrixList  = undefined;
        this._startWorldRIMList     .length = 0,    // this._startWorldRIMList     = undefined;
        this._realStartWMList       .length = 0;
        this._uvSheetList                   .length = 0,
        this._isDisposed = true;
        return;
    }

    private _mpMatrixList: Float32Array | undefined;
    private _mpColorData: Float32Array | undefined;

    public get mpMatrixList() {
        return this._mpMatrixList;
    }
    public get mpColorData() {
        return this._mpColorData;
    }

    private _maxId: number = 0;
    public build() {
        this._mpMatrixList = new Float32Array(16 * this.maxParticles);
        this._mpColorData = new Float32Array(4 * this.maxParticles);
        // this._mpUVSheetData = new Float32Array(4 * this.maxParticles);

        for (let i = this._maxId; i < this.maxParticles; i++) {
            this._waitIdList.push(i);

            this._activeFlagList        [i] = 0;
            this._ageList               [i] = 0;
            this._ratioList             [i] = 0;
            this._lifeTimeList          [i] = Number.MAX_VALUE;
            this._activeTimeList        [i] = 0;
            this._startGravityList      [i] = MathTool.Vector3Tool.Zero();
            this._startLocalPositionList[i] = MathTool.Vector3Tool.Zero();
            this._startPositionList     [i] = MathTool.Vector3Tool.Zero();
            this._startSizeList         [i] = MathTool.Vector3Tool.One();
            this._startColorList        [i] = MathTool.Vector4Tool.Zero();
            this._realtimeLocalPositionList     [i] = MathTool.Vector3Tool.Zero();
            this._realtimeRotationList          [i] = [0, 0, 0];
            this._realtimeSizeList              [i] = MathTool.Vector3Tool.One();
            this._realtimeColorList             [i] = MathTool.Vector4Tool.One();
            this._velocityLastList      [i] = MathTool.Vector3Tool.Zero();
            this._limitVelocityFlagList [i] = false;
            this._limitVelocityList [i]     = 0;
            this._realtimeForceList             [i] = MathTool.Vector3Tool.Zero();
            this._startDirectionList    [i] = MathTool.Vector3Tool.Zero();
            this._realtimeVelocityDirectionList [i] = MathTool.Vector3Tool.Zero();
            this._startWorldMatrixList  [i] = MathTool.Matrix4Tool.Identity();
            this._startWorldRIMList     [i] = MathTool.Matrix4Tool.Identity();
            this._realStartWMList       [i] = MathTool.Matrix4Tool.Identity();
            this._uvSheetList           [i] = [1, 1, 0, 0];
        }
        this._maxId = this.maxParticles;
    }

    public start() {
        if (!this._isPlaying) {
            if (this.startDelay > 0 && !this.prewarm) {
                setTimeout(this._startCall, this.startDelay);
            }
            else {
                this._startCall();
            }
        }

        this._isPlaying = true;
    }

    private _startCall = () => {
        this._isComputeable = true;
        this._particleSystemAge = 0;
        this._lastTime = Date.now();
        this._lastCreateTime = this._lastTime;

        if (this.prewarm) {
            for (let i = this.rateOverTime - 1; i >= 0; i--) {
                this._lastTime -= i * this.duration / this.rateOverTime;
                this.varCompute();
            }
        }
    }

    public stop() {
        this._isComputeable = false;

        if (!this._isDisposed) {
            this._stop();
        }

        this._isPlaying = false;
    }

    private _stop() {
        if (this._isPlaying) {
            this._burstsLoopCount.length = 0;

            const count = this._activeIdList.length;
            for (let i = count - 1; i >= 0; i--) {
                const index = <number>this._activeIdList.pop();

                this._activeFlagList[index] = 0;
                this._waitIdList.push(index);
            }
        }

        this._isPlaying = false;
    }

    public mpUpdate(): number {
        return this._update();
    }

    private _mpTempMatrix = MathTool.Matrix4Tool.Identity();
    private _cameraInvertMatrix = MathTool.Matrix4Tool.Identity();

    private _startWorldRIM = MathTool.Matrix4Tool.Identity();
    private _startWorldP = MathTool.Vector3Tool.Zero();
    private _startWorldRM = MathTool.Matrix4Tool.Identity();
    private _startWorldS = MathTool.Vector3Tool.Zero();
    private _startLocalS = MathTool.Vector3Tool.Zero();

    private _start_parent_m = MathTool.Matrix4Tool.Identity();
    private _start_wm = MathTool.Matrix4Tool.Identity();
    private _start_local_m = MathTool.Matrix4Tool.Identity();

    private _start_p_s = MathTool.Vector3Tool.Zero();
    private _start_p_r = MathTool.QuaternionTool.Identity();
    private _start_p_p = MathTool.Vector3Tool.Zero();

    private _start_l_s = MathTool.Vector3Tool.Zero();
    private _start_l_r = MathTool.QuaternionTool.Identity();
    private _start_l_p = MathTool.Vector3Tool.Zero();

    private _maxLifetimeOverage = 0;
    public get maxLifetimeOverage() {
        return this._maxLifetimeOverage;
    }

    private _formatStartInfo(parentWM: Matrix4, localWM: Matrix4, resultStartMatrix: Matrix4) {
        // 分解出 TRS
        if (parentWM) {
            parentWM.decompose(this._start_p_s, this._start_p_r, this._start_p_p);
        }
        else {
            this._start_p_p.x = 0, this._start_p_p.y = 0, this._start_p_p.z = 0;
            this._start_p_r.x = 0, this._start_p_r.y = 0, this._start_p_r.z = 0, this._start_p_r.w = 1;
            this._start_p_s.x = 1, this._start_p_s.y = 1, this._start_p_s.z = 1;
        }
        localWM.decompose(this._start_l_s, this._start_l_r, this._start_l_p);

        if (this.renderAlignment == ERenderAlignment.View) {
            this._start_p_r.copyFromFloats(0, 0, 0, 1);
            this._start_l_r.copyFromFloats(0, 0, 0, 1);
        }
        // 忽略粒子节点上的本地旋转 - 仅发射后的位移受此影响
        else if (this.renderAlignment == ERenderAlignment.World) {
            this._start_l_r.copyFromFloats(0, 0, 0, 1);
        }
        else {
            //
        }
        if (this.scalingSpace == EMeshParticleScaleMode.Hierarchy) {
            //
        }
        else if (this.scalingSpace == EMeshParticleScaleMode.Local) {
            this._start_p_s.copyFromFloats(1, 1, 1);
        }
        else {
            this._start_p_s.copyFromFloats(1, 1, 1);
            this._start_l_s.copyFromFloats(1, 1, 1);
        }
        MathTool.Matrix4Tool.ComposeToRef(this._start_p_s, this._start_p_r, this._start_p_p, resultStartMatrix);
        MathTool.Matrix4Tool.ComposeToRef(this._start_l_s, this._start_l_r, this._start_l_p, ParticleSystemTool.TempMatrix_1);
        ParticleSystemTool.TempMatrix_1.multiplyToRef(resultStartMatrix, resultStartMatrix);
    }

    private _update(): number {

        if (!this._mpColorData || !this._mpMatrixList) {
            return 0;
        }

        const camraGlobalPos = this.getCameraPosition();
        let lookCameraDirection = camraGlobalPos.scale(-1);
        this._start_parent_m = this.getParentWorldMatrix();
        this._start_local_m = this.getLocalMatrix();
        let _start_w_m = this.getWorldMatrix().clone();

        let tempStartMatrix = MathTool.Matrix4Tool.Identity();
        this._formatStartInfo(this._start_parent_m, this._start_local_m, tempStartMatrix);
        let realStartMatrix = MathTool.Matrix4Tool.Identity();

        let vec3_zero = MathTool.Vector3Tool.Zero();

        let activeCount = 0;
        const len = this._activeFlagList.length;
        for (let i = 0; i < len; i++) {
            if (this._activeFlagList[i] != 1) {
                continue;
            }
            const index             = i;
            const _startLocalPos    = this._startLocalPositionList[index];
            const _localPosition    = this._realtimeLocalPositionList[index];
            const _rotation         = this._realtimeRotationList[index];
            const _scaling          = this._realtimeSizeList[index];
            const _color            = this._realtimeColorList[index];
            const _uvSheet          = this._uvSheetList[index];

            const ii = activeCount * 4;
            /**
             * 仅 Pi/Simple 导出为 带纹理动画的粒子
             */
            this._mpColorData[ii + 0] = _color.x; // + _uvSheet[0] * 10;
            this._mpColorData[ii + 1] = _color.y; // + _uvSheet[1] * 10;
            this._mpColorData[ii + 2] = _color.z; // + _uvSheet[2] * 10;
            this._mpColorData[ii + 3] = _color.w; // + _uvSheet[3] * 10;

            if (this.simulationSpace == EMeshParticleSpaceMode.Local) {
                realStartMatrix.copyFrom(tempStartMatrix);
            }
            else {
                // realStartMatrix.copyFrom(tempStartMatrix);
                realStartMatrix.copyFrom(this._realStartWMList[index]);
                _start_w_m.copyFrom(this._startWorldMatrixList[index]);
            }

            let localrotx = _rotation[0];
            let localroty = _rotation[1];
            let localrotz = _rotation[2];

            MathTool.Vector3Tool.TransformCoordinatesFromFloatsToRef(_startLocalPos.x + _localPosition.x, _startLocalPos.y + _localPosition.y, _startLocalPos.z + _localPosition.z, _start_w_m, ParticleSystemTool.TempVector3_1);

            if (this.renderAlignment == ERenderAlignment.View) {
                realStartMatrix.decompose(ParticleSystemTool.TempVector3_0, undefined, undefined);

                // lookCameraDirection.copyFrom(camraGlobalPos);
                // lookCameraDirection.subtractInPlace(ParticleSystemTool.TempVector3_1);
                _start_w_m.getTranslationToRef(lookCameraDirection);
                lookCameraDirection.subtractInPlace(camraGlobalPos);

                directionToQuaternion(lookCameraDirection, ParticleSystemTool.TempQuaternion_0);
                // ParticleSystemTool.TempQuaternion_0.toRotationMatrix().
                MathTool.Matrix4Tool.ComposeToRef(ParticleSystemTool.TempVector3_0, ParticleSystemTool.TempQuaternion_0, vec3_zero, realStartMatrix);
            }
            else {
                realStartMatrix.setTranslationFromFloats(0, 0, 0);
            }

            // ParticleSystemTool.TempVector3_1.copyFromFloats(0, 0, 0);
            MathTool.QuaternionTool.RotationYawPitchRollToRef(localroty, localrotx, localrotz, ParticleSystemTool.TempQuaternion_0);
            MathTool.Matrix4Tool.ComposeToRef(_scaling, ParticleSystemTool.TempQuaternion_0, vec3_zero, ParticleSystemTool.TempMatrix_1);
            ParticleSystemTool.TempMatrix_1.multiplyToRef(realStartMatrix, realStartMatrix);
            realStartMatrix.setTranslation(ParticleSystemTool.TempVector3_1);

            // const tempMatrix = this._mpTempMatrix;
            realStartMatrix.copyToArray(this._mpMatrixList, activeCount * 16);

            activeCount++;
        }

        return activeCount;
    }

    // 变量计算 - 异步计算
    public varCompute = () => {
        if (this._isPlaying && this._isComputeable) {

            const now = Date.now();
            const delta = now - this._lastTime;
            this._lastTime = now;
            this._particleSystemAge += delta;
            this._deltaTime = delta / 1000;

            const scaleUpdateSpeed = Math.min(this._deltaTime, 50 / 1000);

            const createDelta = now - this._lastCreateTime;

            // this.emitRate / this.duration;
            const tempLoop = Math.floor(this._particleSystemAge / this.duration);

            let canNew = true;
            let check = this._particleSystemAge - (this.prewarm ? this.duration : 0) - this.duration;
            if (check > 0 && !this.looping) {
                // 等待已发射粒子的消失
                if (check > this._maxLifetimeOverage) {
                    this.stop();
                    return;
                }
                canNew = false;
            }
            else {
                this._maxLifetimeOverage = 0;
            }

            const localTimeDiff = this._particleSystemAge % this.duration;
            let burstCreateCount = 0;

            this.emissionLoop = Math.floor(this._particleSystemAge / this.emissionTime);
            this.emissionProgress = this._particleSystemAge % this.emissionTime / this.emissionTime;

            const burstsCount = this.bursts.length;
            // 新的一轮循环
            if (this._loopCount < tempLoop) {
                // 剩余 Bursts 全部激活
                for (let i = 0 ; i < burstsCount; i++) {
                    const [burstTime, burstCount, burstLoop, interval] = this.bursts[i];

                    if (this.duration > burstTime) {
                        if (!this._burstsLoopCount[i]) {
                            this._burstsLoopCount[i] = 0;
                        }

                        const tempBurstLoop = Math.ceil((this.duration - burstTime) / interval);

                        // 预估爆发次数 大于 已爆发次数
                        if (tempBurstLoop > this._burstsLoopCount[i]) {
                            // 可爆发次数 大于 已爆发次数
                            while (burstLoop > this._burstsLoopCount[i]) {
                                this._burstsLoopCount[i] += 1;
                                burstCreateCount += burstCount;
                            }
                        }
                    }

                    this._burstsLoopCount[i] = 0;
                }

                this._loopCount = tempLoop;
            }

            for (let i = 0 ; i < burstsCount; i++) {
                const [burstTime, burstCount, burstLoop, interval] = this.bursts[i];
                if (localTimeDiff > burstTime) {
                    if (!this._burstsLoopCount[i]) {
                        this._burstsLoopCount[i] = 0;
                    }

                    const tempBurstLoop = Math.ceil((localTimeDiff - burstTime) / interval);

                    // 预估爆发次数 大于 已爆发次数
                    if (tempBurstLoop > this._burstsLoopCount[i]) {
                        // 可爆发次数 大于 已爆发次数
                        if (burstLoop > this._burstsLoopCount[i]) {
                            this._burstsLoopCount[i] += 1;
                            burstCreateCount += burstCount;
                        }
                    }

                    // else {
                    //     burstCreateCount += 0;
                    // }

                    // this._burstsLoopCount[i] += 1;
                    // this._burstsIndex += 1;

                    // if (this._burstsLoopCount[i] > burstLoop) {
                    //     burstCreateCount += 0;
                    // }
                    // else {
                    //     burstCreateCount += burstCount;
                    // }
                    // break;
                }
            }

            let newCount = Math.round(createDelta / 1000 * this.rateOverTime) + burstCreateCount;
            if (newCount > 0) {
                this._lastCreateTime = now;
            }

            if (!canNew) {
                newCount = 0;
            }

            this.varInit(newCount);

            let worldRotateIM = this._startWorldRIM;
            this.varPre(scaleUpdateSpeed, worldRotateIM);
        }
    }

    /**
     * 初始化
     */
    public varInit(newCount: number) {
        const waitCount = this._waitIdList.length;
        newCount = Math.min(waitCount, newCount);

        const progress = this._particleSystemAge % this.duration / this.duration;

        const tempStartMatrix = MathTool.Matrix4Tool.Identity();

        let parentWorldMatrix = this.getParentWorldMatrix();
        let worldMatrix = this.getWorldMatrix();
        let localMatrix = this.getLocalMatrix();

        worldMatrix.decompose(this._startWorldS, null, this._startWorldP);
        worldMatrix.getRotationMatrixToRef(this._startWorldRM);
        this._startWorldRM.invertToRef(this._startWorldRIM);

        this._formatStartInfo(parentWorldMatrix, localMatrix, tempStartMatrix);

        for (let i = 0; i < newCount; i++) {
            const index: number = <number>this._waitIdList.pop();

            this._startWorldMatrixList[index].copyFrom(worldMatrix);
            this._startWorldRIMList[index].copyFrom(this._startWorldRIM);
            this._realStartWMList[index].copyFrom(tempStartMatrix);

            this.initNew(index, this._startWorldRIM, progress, this.emissionLoop, this.emissionProgress, i, newCount);

            this._activeTimeList[index] = this._particleSystemAge;

            this._activeIdList.push(index);
            this._activeFlagList[index] = 1;
        }
    }

    public initNew(index: number, worldRotateIM: Matrix4, progress: number, emissionLoop: number, emissionProgress: number, emissionIndex: number, emissionTotal: number) {

        if (this.textureSheetInterpolation) {
            this.textureSheetInterpolation.initNew(index);
        }

        const _worldMatrix = this._startWorldMatrixList[index];
        if (this.startLifetimeInterpolation) {
            this._lifeTimeList[index] = this.startLifetimeInterpolation.interpolate(progress);
        }

        let result: number[];
        if (this.startColorInterpolation) {
            result = this.startColorInterpolation.interpolate(progress);
            this._startColorList[index].copyFromFloats(result[0], result[1], result[2], result[3]);
        }

        if (this.gravityInterpolation) {
        result = this.gravityInterpolation.interpolate(progress);
        this._startGravityList[index].copyFromFloats(result[0], result[1], result[2]);
        }

        let startRotation: [number, number, number] = [0, 0, 0];

        if (this.startRotationInterpolation) {
            startRotation = this.startRotationInterpolation.interpolate(progress);
        }
        this._realtimeRotationList[index][0] = startRotation[0];
        this._realtimeRotationList[index][1] = startRotation[1];
        this._realtimeRotationList[index][2] = startRotation[2];

        const startSize = this._startSizeList[index];

        if (this.startSizeInterpolation) {
        result = this.startSizeInterpolation.interpolate(progress);
        startSize.copyFromFloats(result[0], result[1], result[2]);
        }

        let startSpeed = 0;
        if (this.startSpeedInterpolation) {
        startSpeed = this.startSpeedInterpolation.interpolate(progress);
        }

        const startLocalPosition = this._startLocalPositionList[index];
        ShapeEmitterTool.startPositionFunction(this.emitterShape, _worldMatrix, startLocalPosition, emissionLoop, emissionProgress, emissionIndex, emissionTotal, true);
        const startDirection = this._startDirectionList[index];
        ShapeEmitterTool.startDirectionFunction(this.emitterShape, _worldMatrix, startDirection, startLocalPosition, true);
        startDirection.scaleInPlace(startSpeed);

        if (this.enableVelocityOverLifeTime && this.velocityOverLifetimeInterpolation) {
            if (this.velocityOverLifetimeInterpolation.mode == EInterpolationCurveMode.Constant || this.velocityOverLifetimeInterpolation.mode == EInterpolationCurveMode.TwoConstants) {
                result = this.velocityOverLifetimeInterpolation.interpolate(progress);
                this._tempVector3.copyFromFloats(result[0], result[1], result[2]);
                this._tempVector3.subtractToRef(this._velocityLastList[index], this._tempVector3);
                // velocity 为全局空间
                if (!this.velocityOverLifetimeIsLocal) {
                    // 全局转换为局部
                    MathTool.Vector3Tool.TransformCoordinatesFromFloatsToRef(this._tempVector3.x, this._tempVector3.y, this._tempVector3.z, worldRotateIM, this._tempVector3);
                }
                startDirection.addInPlace(this._tempVector3);
                this._velocityLastList[index].copyFromFloats(result[0], result[1], result[2]);
            }
        }

        if (this.enableLimitVelocityOverLifeTime && this.limitVelocityOverLifetimeInterpolation) {
            this._limitVelocityList[index] = Number.MAX_SAFE_INTEGER;
            if (this.limitVelocityOverLifetimeInterpolation.mode == EInterpolationCurveMode.Constant || this.limitVelocityOverLifetimeInterpolation.mode == EInterpolationCurveMode.TwoConstants) {
                this._limitVelocityList[index] = this.limitVelocityOverLifetimeInterpolation.interpolate(0.0);
            }
        }

        this._realtimeVelocityDirectionList[index].copyFrom(startDirection);
        this._velocityLastList[index].copyFromFloats(0, 0, 0);
        this._realtimeLocalPositionList[index].copyFromFloats(0, 0, 0);
        this._realtimeSizeList[index].copyFrom(startSize);

        this._limitVelocityFlagList[index] = false;
    }

    /**
     * 变量预处理
     * @param index
     */
    public varPre(scaleUpdateSpeed: number, worldRotateIM: Matrix4) {
        // scaleUpdateSpeed = scaleUpdateSpeed * 60 / 100;
        const count = this._activeFlagList.length;
        let result: number[];
        for (let i = 0; i < count; i++) {
            if (this._activeFlagList[i] != 1) {
                continue;
            }

            let index = i;

            if (this.simulationSpace == EMeshParticleSpaceMode.World) {
                worldRotateIM = this._startWorldRIMList[index];
            }

            let startTime = this._activeTimeList[index];
            let age = this._particleSystemAge - startTime;

            this._ageList[index] = age;
            this._ratioList[index] = Math.min(1.0, age / this._lifeTimeList[index]);

            let ratio = this._ratioList[index];
            let ratioRate = Math.min(1.0, age / 1000);

            if (this.textureSheetInterpolation) {
                this.textureSheetInterpolation.interpolate(ratio, this._uvSheetList, index);
            }

            // realtime color - 插值结果乘以初始值
            if (this.enableColorOverLifeTime && this.colorOverLifetimeInterpolation) {
                result = this.colorOverLifetimeInterpolation.interpolate(ratio);
                this._tempVector4.copyFromFloats(result[0], result[1], result[2], result[3]);

                this._tempVector4.multiplyInPlace(this._startColorList[index]);
                this._realtimeColorList[index].copyFrom(this._tempVector4);
            }
            else {
                this._realtimeColorList[index].copyFrom(this._startColorList[index]);
            }

            // realtime size - 插值结果乘以初始值
            if (this.enableSizeOverLifeTime && this.sizeOverLifetimeInterpolation) {
                // 尺寸  - 尺寸值 - 插值结果乘以初始尺寸
                result = this.sizeOverLifetimeInterpolation.interpolate(ratio);
                this._realtimeSizeList[index].copyFromFloats(result[0], result[1], result[2]);
                this._realtimeSizeList[index].multiplyInPlace(this._startSizeList[index]);
            }
            else {
                this._realtimeSizeList[index].copyFrom(this._startSizeList[index]);
            }

            // realtime rotation - 插值结果 计算出帧间隔变化量 累加到 上一帧的实时值
            if (this.enableRotationOverLifeTime && this.rotationOverLifetimeInterpolation) {
                // 旋转 - 旋转速度 - 当前帧变化量累加到实时旋转量
                result = this.rotationOverLifetimeInterpolation.interpolate(ratioRate);
                // this._tempVector3.copyFromFloats(result[0], result[1], result[2]);
                // this._tempVector3.scaleToRef(scaleUpdateSpeed, this._tempVector3);
                // this._realtimeRotationList[index].addInPlace(this._tempVector3);
                this._realtimeRotationList[index][0] += result[0] * scaleUpdateSpeed;
                this._realtimeRotationList[index][1] += result[1] * scaleUpdateSpeed;
                this._realtimeRotationList[index][2] += result[2] * scaleUpdateSpeed;
            }

            let realtimeDirection = this._realtimeVelocityDirectionList[index];

            // overlife velocity - 插值结果为实际瞬时值
            if (this.enableVelocityOverLifeTime && this.velocityOverLifetimeInterpolation) {
                // 速度 - 位移速度向量 - 瞬时值
                if (this.velocityOverLifetimeInterpolation.mode == EInterpolationCurveMode.Constant || this.velocityOverLifetimeInterpolation.mode == EInterpolationCurveMode.TwoConstants) {
                    // result = this.velocityOverLifetimeInterpolation.interpolate(ratio);
                } else {
                    result = this.velocityOverLifetimeInterpolation.interpolate(ratio);
                    this._tempVector3.copyFromFloats(result[0], result[1], result[2]);
                    this._tempVector3.subtractToRef(this._velocityLastList[index], this._tempVector3);
                    // velocity 为全局空间
                    if (!this.velocityOverLifetimeIsLocal) {
                        // 全局转换为局部
                        MathTool.Vector3Tool.TransformCoordinatesFromFloatsToRef(this._tempVector3.x, this._tempVector3.y, this._tempVector3.z, worldRotateIM, this._tempVector3);
                    }
                    realtimeDirection.addInPlace(this._tempVector3);
                    this._velocityLastList[index].copyFromFloats(result[0], result[1], result[2]);
                }
            }

            // 计算位置变化量 Δp = v * Δt
            realtimeDirection.scaleToRef(scaleUpdateSpeed, this._deltaPosition);
            // 应用此次偏移结果
            this._realtimeLocalPositionList[index].addInPlace(this._deltaPosition);

            // gravity -> F = g + f -> 重力 + 局部力
            let gravity = this._startGravityList[index];
            // 全局转换为局部
            MathTool.Vector3Tool.TransformCoordinatesFromFloatsToRef(gravity.x, gravity.y, gravity.z, worldRotateIM, this._tempVector3);
            // 增加的速度 -> Δv = F/m * Δt -> m 质量为单位质量1
            this._tempVector3.scaleToRef(scaleUpdateSpeed, this._tempVector3);
            // 更新实时速度 -> v' = v + Δv
            realtimeDirection.addInPlace(this._tempVector3);

            // realtime force - 插值结果为实际瞬时值
            if (this.enableForceOverLifeTime && this.forceOverLifetimeInterpolation) {
                // Force
                result = this.forceOverLifetimeInterpolation.interpolate(ratio);
                this._tempVector3.copyFromFloats(result[0], result[1], result[2]);
                // force 为全局空间
                if (!this.forceSpaceIsLocal) {
                    // 全局转换为局部
                    MathTool.Vector3Tool.TransformCoordinatesFromFloatsToRef(this._tempVector3.x, this._tempVector3.y, this._tempVector3.z, worldRotateIM, this._tempVector3);
                }
                // 增加的速度 -> Δv = F/m * Δt -> m 质量为单位质量1
                this._tempVector3.scaleToRef(scaleUpdateSpeed, this._tempVector3);
                // 更新实时速度 -> v' = v + Δv
                realtimeDirection.addInPlace(this._tempVector3);
            }

            // realtime limit velocity - 插值结果为实际瞬时值
            if (this.enableLimitVelocityOverLifeTime && this.limitVelocityOverLifetimeInterpolation) {
                let limitVelocity = Number.MAX_SAFE_INTEGER;
                if (this.limitVelocityOverLifetimeInterpolation.mode == EInterpolationCurveMode.Constant || this.limitVelocityOverLifetimeInterpolation.mode == EInterpolationCurveMode.TwoConstants) {
                    limitVelocity = this._limitVelocityList[index];
                }
                else {
                    limitVelocity = this.limitVelocityOverLifetimeInterpolation.interpolate(ratio);
                }
                let currLength = realtimeDirection.length();
                if (currLength > limitVelocity) {
                    realtimeDirection.scaleInPlace(1.0 - this.limitVelocityOverLifetimeDampen * (currLength - limitVelocity) / currLength * (0.66));
                    // const len = limitVelocity + (currLength - limitVelocity) * Math.pow(Math.E, -this.limitVelocityOverLifetimeDampen);
                    // realtimeDirection.scaleInPlace(len / currLength);
                }
            }
        }
    }

    private _deltaPosition: Vector3 = MathTool.Vector3Tool.Zero();

    /**
     * 渲染结束后回收
     */
    public recycle = () => {
        const count = this._activeIdList.length;
        const tempList = [];
        for (let i = count - 1; i >= 0; i--) {
            const index = this._activeIdList[i];
            const age = this._ageList[index];
            const life = this._lifeTimeList[index];

            let overage = life - age;
            this._maxLifetimeOverage = Math.max(this._maxLifetimeOverage, overage);
            if (overage <= 0) {
                // this._activeIdList.splice(i, 1);
                this._activeFlagList[index] = 0;
                this._waitIdList.push(index);
                this._ageList[index] = 0;
                this._lifeTimeList[index] = Number.MAX_VALUE;
                this._realtimeLocalPositionList[index].copyFromFloats(0, 0, 0);
                // this._positionList[index].copyFromFloats(0, 0, 0);
                this._realtimeRotationList[index][0] = 0;
                this._realtimeRotationList[index][1] = 0;
                this._realtimeRotationList[index][2] = 0;
                this._realtimeSizeList[index].copyFromFloats(1, 1, 1);
            }
            else {
                tempList.push(index);
            }
        }
        this._activeIdList.length = 0;
        this._activeIdList = tempList;
    }

    /**
     * 粒子排序 - 在变量计算之后
     * 对 _activeIdList 排序
     */
    public activeParticlesSort() {

    }

    private _updateIndex: number = 0;
}