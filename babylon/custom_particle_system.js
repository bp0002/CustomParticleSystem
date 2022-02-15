
// import BABYLON
let BABYLON = window.BABYLON;
// import BPPS
let BPPS = window.BPPS;



BPPS.MathTool.ScalarTool        = window.BABYLON.Scalar;
BPPS.MathTool.Vector3Tool       = BABYLON.Vector3;
BPPS.MathTool.Vector4Tool       = BABYLON.Vector4;
BPPS.MathTool.Matrix4Tool       = BABYLON.Matrix;
BPPS.MathTool.QuaternionTool    = BABYLON.Quaternion;
BPPS.ParticleSystemTool.init();

export class MeshParticleSystem extends BABYLON.TransformNode {
    get alwaysSelectAsActive() {
        return this._alwaysSelectAsActive;
    }
    set alwaysSelectAsActive(v) {
        this._alwaysSelectAsActive = v;
        if (this.source) {
            this.source.alwaysSelectAsActiveMesh = v;
        }
    }

    constructor(name, scene, isPure) {

        super(name, scene, isPure);

        this.psTool = null;

        this.source = null;
        this._isMPPlaying = false;
        this._mpDirty = true;

        this._alwaysSelectAsActive = true;
        if (this._scene.getEngine().getCaps().instancedArrays) {
            this.psTool = new BPPS.ParticleSystemTool();
            this.psTool.getParentWorldMatrix = () => {
                return this.parent ? this.parent.getWorldMatrix() : undefined;
            };

            this.psTool.getCameraPosition = () => {
                return this._scene.activeCamera.globalPosition;
            };

            this.psTool.getWorldMatrix = () => {
                return this.worldMatrixFromCache;
            };

            this.psTool.getLocalMatrix = () => {
                return this._localMatrix;
            };
        } else {
            console.error(`Can not use instancedArrays`);
        }

        this._recycleCall = () => {
            this.psTool.recycle();
        }
        this._updateCall = () => {
            if (this._mpDirty) {
                const count = this.psTool.mpUpdate();

                this.source.thinInstanceBufferUpdated("matrix");
                this.source.thinInstanceBufferUpdated("instanceColor");
                this.source.thinInstanceCount = count;

                this.source.setEnabled(count > 0 && this.isEnabled());

                this._mpDirty = false;
            }
        }
    }

    setSourceMesh(mesh) {
        this.source = mesh;
        if (!this.psTool) {
            mesh.setEnabled(false);
            return;
        }

        mesh.renderAsMeshParticle = true;
        mesh.useVertexColors = true;
        if (mesh.alphaIndex >= 3000) {
            mesh.hasVertexAlpha  = true;
        }
        mesh.alwaysSelectAsActiveMesh = this.alwaysSelectAsActive;
        this.build();
    }

    dispose(doNotRecurse, disposeMaterialAndTextures) {
        if (this.isDisposed()) {
            return;
        }
        this.stop();

        this.source.dispose();

        super.dispose(doNotRecurse, disposeMaterialAndTextures);
    }

    build() {

        this.psTool.build();

        this.source.thinInstanceSetBuffer("matrix", this.psTool.mpMatrixList, 16, false);
        this.source.thinInstanceSetBuffer("instanceColor", this.psTool.mpColorData, 4, false);
    }

    start() {
        if (!this._isMPPlaying && this.psTool) {
            this.psTool.start();

            this._scene.getEngine().onBeginFrameObservable.add(this._computeCall);
            this._scene.getEngine().onBeginFrameObservable.add(this._recycleCall);
            this._scene.onBeforeRenderObservable.add(this._updateCall);

            this._isMPPlaying = true;
        }
    }

    _computeCall = () => {
        this.computeWorldMatrix();
        this.psTool.varCompute();
        this._mpDirty = true;
    }

    stop() {
        if (this._isMPPlaying && this.psTool) {
            this.psTool.stop();

            this._scene.getEngine().onBeginFrameObservable.removeCallback(this._computeCall);
            this._scene.getEngine().onBeginFrameObservable.removeCallback(this._recycleCall);
            this._scene.onBeforeRenderObservable.removeCallback(this._updateCall);

            this._isMPPlaying = false;
        }
    }

    reset() {
        this.stop();
    }
}