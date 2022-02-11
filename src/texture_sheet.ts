import { FloatInterpolation } from "./interpolation";

export enum RowMode {
    Custom = 0,
    Random = 1,
}

export enum TimeMode {
    Liftime = 0,
    Speed = 1,
}

export enum AnimationMode {
    WholeSheet = 0,
    SingleRow = 1,
}

export const ATTRIBUTE_PS_UV_SHEET = 'uv_sheet';

export class TextureSheet {
    public rowList: number[] = [];
    public startFrameList: number[] = [];
    public rowMode: RowMode = RowMode.Random;
    public customRow: number = 0;
    public timeMode: TimeMode = TimeMode.Liftime;
    public animMode: AnimationMode = AnimationMode.WholeSheet;
    private _tilesX: number = 1;
    private _tilesY: number = 1;
    // private _tilesXY: number = 1;
    private _uScale: number = 1;
    private _vScale: number = 1;
    public set tilesX(v: number) {
        this._tilesX = v;
        this._uScale = 1 / v;
        // this._tilesXY = this._tilesX * this._tilesY;
    }
    public set tilesY(v: number) {
        this._tilesY = v;
        this._vScale = 1 / v;
        // this._tilesXY = this._tilesX * this._tilesY;
    }
    public frameOverTime: FloatInterpolation | undefined;
    public startFrame: FloatInterpolation | undefined;
    public cycles: number = 1;
    public active: boolean = true;
    public initNew(index: number) {
        this.startFrameList[index]  = this.startFrame.interpolate(0);
        this.rowList[index]         = Math.round(Math.random() * this._tilesY) % this._tilesY;
    }
    public interpolate(amount: number, data: [number, number, number, number][], index: number) {
        if (this.active && this.frameOverTime) {
            const interpolation = this.frameOverTime.interpolate((amount * this.cycles) % 1);
            let start = this.startFrameList[index];
            let cellId = 0;
            let cellX = 0;
            let cellY = 0;

            if (this.animMode == AnimationMode.SingleRow) {
                if (this.rowMode == RowMode.Custom) {
                    cellY = this.customRow;
                }
                else {
                    cellY = this.rowList[index];
                }

                cellX = Math.floor(((start + interpolation) * this._tilesX) % this._tilesX);
            }
            else {
                cellId = start + interpolation * this._tilesX * this._tilesY;
                cellX = Math.floor(cellId % this._tilesX);
                cellY = Math.floor(cellId / this._tilesX);
            }

            data[index][0] = this._tilesX,
            data[index][1] = this._tilesY,
            data[index][2] = cellX,
            // �������� invetY
            data[index][3] = (this._tilesY - cellY - 1);
        }
        else {
            data[index][0] = this._tilesX,
            data[index][1] = this._tilesY,
            data[index][2] = 0,
            // �������� invetY
            data[index][3] = (this._tilesY - 0 - 1);
        }
    }
}