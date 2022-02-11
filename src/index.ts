import { EMeshParticleSpaceMode, ParticleSystemTool } from "./compute";
import { Box, Circle, Cone, EArcMode, Edge, Hemisphere, Point, Rectangle, Sphere } from "./emitter";
import { Float3Interpolation, Float4Interpolation, FloatInterpolation } from "./interpolation";
import { EInterpolationCurveMode } from "./iparticle_system_config";
import { MathTool } from "./math";
import { TextureSheet } from "./texture_sheet";

(<any>window).BPPS = {
    Box,
    Cone,
    Circle,
    Edge,
    Hemisphere,
    Point,
    Rectangle,
    Sphere,
    ParticleSystemTool,
    MathTool,
    EArcMode,
    EInterpolationCurveMode,
    TextureSheet,
    EMeshParticleSpaceMode,
    FloatInterpolation,
    Float3Interpolation,
    Float4Interpolation
};