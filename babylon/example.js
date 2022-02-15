import { MeshParticleSystem } from "./custom_particle_system";

function test(scene) {
    const mp = new MeshParticleSystem(name, scene);
    _interval = setInterval(() => {
        let diff = Date.now() % 5000 / 5000;
        mp.position.copyFromFloats(diff * 10, 0, 0);
        // mp.scaling.copyFromFloats(diff + 0.1, diff + 0.1, 1);
        mp.computeWorldMatrix();
        // mp.setEnabled(true)
    }, 16);
    mp.position.x = 5;

    let box = BABYLON.MeshBuilder.CreateBox('nn', {size: 1}, scene);

    _particle = mp;

    _particle.psTool.simulationSpace = BPPS.EMeshParticleSpaceMode.World;
    _particle.psTool.rateOverTime = 10000;
    _particle.psTool.maxParticles = 20000;
    _particle.psTool.duration = 5000;

    box.material = new BABYLON.StandardMaterial("meshparticle", scene);
    (box.material).disableLighting = true;
    (box.material).emissiveColor = BABYLON.Color3.White();

    _particle.psTool.enableForceOverLifeTime = true;
    _particle.psTool.enableVelocityOverLifeTime = true;
    _particle.psTool.enableLimitVelocityOverLifeTime = false;
    _particle.psTool.enableColorOverLifeTime = false;
    _particle.psTool.enableSizeOverLifeTime = false;
    _particle.psTool.enableRotationOverLifeTime = false;

    // TODO
    _particle.psTool.looping = true;
    let shape = BPPS.Cone.Config();
    shape.radius = 0.1;
    shape.angle = 90 / 180 * Math.PI;
    _particle.psTool.emitterShape = shape;
    shape.directionRandomizer = 0;
    shape.radiusThickness = 0.5;
    shape.arcMode = BPPS.EArcMode.Random;
    shape.arcSpread = 0;

    let temp = new BPPS.Float3Interpolation();
    temp.constant0 = [0, 0, 0];
    _particle.psTool.gravityInterpolation = temp;

    temp = new BPPS.Float3Interpolation();
    temp.mode = BPPS.EInterpolationCurveMode.TwoConstants;
    temp.constant0 = [.1, .1, 4];
    temp.constant1 = [.1, .1, 4];
    _particle.psTool.startSizeInterpolation = temp;

    let temp4 = new BPPS.Float4Interpolation();
    temp4.mode = BPPS.EInterpolationCurveMode.TwoConstants;
    temp4.constant0 = [1, 0, 0, 1];
    temp4.constant1 = [1, 0.5, 0, 0.5];
    _particle.psTool.startColorInterpolation = temp4;

    let temp1 = new BPPS.FloatInterpolation();
    temp1.mode = BPPS.EInterpolationCurveMode.TwoConstants;
    temp1.constant0 = 10;
    temp1.constant1 = 10;
    _particle.psTool.startSpeedInterpolation = temp1;

    temp1 = new BPPS.FloatInterpolation();
    temp1.constant0 = 2000;
    temp1.constant0 = 2000;
    _particle.psTool.startLifetimeInterpolation = temp1;

    temp = new BPPS.Float3Interpolation();
    temp.mode = BPPS.EInterpolationCurveMode.TwoConstants;
    temp.constant0 = [0, 0, 0];
    temp.constant1 = [0, 0, 0];
    _particle.psTool.startRotationInterpolation = temp;

    temp = new BPPS.Float3Interpolation();
    temp.constant0 = [1, 1, 1];
    _particle.psTool.sizeOverLifetimeInterpolation = temp;

    temp4 = new BPPS.Float4Interpolation();
    temp4.mode = BPPS.EInterpolationCurveMode.TwoConstants;
    temp4.constant0 = [1, 0, 0, 1];
    temp4.constant1 = [1, 0.5, 0, 0.5];
    _particle.psTool.colorOverLifetimeInterpolation = temp4;

    temp = new BPPS.Float3Interpolation();
    temp.mode = BPPS.EInterpolationCurveMode.Curve;
    // temp.constant0 = [0, 20, 0];
    // temp.constant1 =  [0, 20, 0];
    temp.minCurves = [
        [
            [
                [0, 0, 1, 1],
                [1, 1, 1, 1]
            ],
            1,
        ],
        [
            [
                [0, 0, 1, 1],
                [1, 1, 1, 1]
            ],
            1,
        ],
        [
            [
                [0, 0, 1, 1],
                [1, 1, 0, 1]
            ],
            40,
        ],
    ];
    _particle.psTool.forceOverLifetimeInterpolation = temp;

    temp = new BPPS.Float3Interpolation();
    temp.constant0 = [0 / 180 * Math.PI, 0 / 180 * Math.PI, 0 / 180 * Math.PI];
    temp.constant1 = [0 / 180 * Math.PI, 0 / 180 * Math.PI, 0 / 180 * Math.PI];
    _particle.psTool.rotationOverLifetimeInterpolation = temp;

    temp = new BPPS.Float3Interpolation();
    temp.mode = BPPS.EInterpolationCurveMode.Curve;
    temp.minCurves = [
        [
            [
                [0, 0, 0, 0],
                [1, 0, 0, 0]
            ],
            0,
        ],
        [
            [
                [0, 0, 1, 1],
                [1, 1, 1, 1]
            ],
            0,
        ],
        [
            [
                [0, 0, 0, 0],
                [1, 0, 0, 0]
            ],
            10,
        ],
    ];
    _particle.psTool.velocityOverLifetimeInterpolation = temp;

    temp1 = new BPPS.FloatInterpolation();
    temp1.mode = BPPS.EInterpolationCurveMode.Curve;
    temp1.minCurve = 
        [
            [
                [0, 1, 1, 1],
                [1, 0, 1, 1]
            ],
            2,
        ];
    _particle.psTool.limitVelocityOverLifetimeInterpolation = temp1;
    _particle.psTool.limitVelocityOverLifetimeDampen = 0.01;

    mp.setSourceMesh(box);
    mp.start();

    (window)._meshp = _particle;
}