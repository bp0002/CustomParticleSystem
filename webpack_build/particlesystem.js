(()=>{"use strict";class t{static ScalarTool;static Vector3Tool;static Vector4Tool;static QuaternionTool;static Matrix4Tool}function i(t,i){const e=t.x,o=t.y,s=t.z;let a=-Math.atan2(s,e)+Math.PI/2,r=Math.sqrt(e*e+s*s);!function(t,i,e,o){var s=.5*e,a=.5*i,r=.5*t,n=Math.sin(s),l=Math.cos(s),h=Math.sin(a),c=Math.cos(a),m=Math.sin(r),_=Math.cos(r);o.x=_*h*l+m*c*n,o.y=m*c*l-_*h*n,o.z=_*c*n-m*h*l,o.w=_*c*l+m*h*n}(a,-Math.atan2(o,r),0,i)}var e,o,s;!function(t){t[t.Box=1]="Box",t[t.Cone=2]="Cone",t[t.Hemisphere=3]="Hemisphere",t[t.Sphere=4]="Sphere",t[t.Point=5]="Point",t[t.Edge=6]="Edge",t[t.Circle=7]="Circle",t[t.Rectangle=8]="Rectangle"}(e||(e={})),function(t){t[t.Random=0]="Random",t[t.Loop=1]="Loop",t[t.PingPong=2]="PingPong",t[t.BurstsDpread=3]="BurstsDpread"}(o||(o={})),function(t){t[t.Unity=0]="Unity"}(s||(s={}));class a{static Config(){return{mode:e.Box,radius:1,angle:0,radiusThickness:1,baseHeight:0,height:5,heightRange:1,arcMode:o.Random,arcValue:1,arcSpread:1,arcSpeed:1,scale:[1,1,1],directionMode:s.Unity,emitFromSpawnPointOnly:!1,directionRandomizer:0}}static computeDirection(i,e,o,s,a){a?o.copyFromFloats(0,0,1):t.Vector3Tool.TransformNormalFromFloatsToRef(0,0,1,e,o)}static startPositionFunction(i,e,o,s,a,r,n,l){var h=t.ScalarTool.RandomRange(-i.radiusThickness,i.radiusThickness),c=t.ScalarTool.RandomRange(-i.radiusThickness,i.radiusThickness),m=t.ScalarTool.RandomRange(-i.radiusThickness,i.radiusThickness);h=(h>0?1:-1)-h,c=(c>0?1:-1)-c,m=(m>0?1:-1)-m;let _=(i.scale[0]||1)/2,p=(i.scale[1]||1)/2,d=(i.scale[2]||1)/2;l?o.copyFromFloats(h*_,c*p,m*d):t.Vector3Tool.TransformCoordinatesFromFloatsToRef(h*_,c*p,m*d,e,o)}}let r=1e-4;function n(t,i,e,s,a,n,l,h,c){let m;switch(i*=h,c){case o.Loop:m=(t+i)*a%n,r<l&&(l*=n,m=Math.round(m/l)*l);break;case o.PingPong:{let e=(t+i)*a,o=Math.floor(e/n);m=e%n,r<l&&(l*=n,m=Math.round(m/l)*l),o%2==1&&(m=n);break}case o.BurstsDpread:i=e/s,r<l&&(l*=n,i=Math.round(i/l)*l),m=n*i;break;default:m=Math.random()*n}return m}class l{static Config(){return{mode:e.Circle,radius:1,angle:0,radiusThickness:1,baseHeight:0,height:5,heightRange:1,arcMode:o.Random,arcValue:2*Math.PI,arcSpread:0,arcSpeed:1,scale:[1,1,1],directionMode:s.Unity,emitFromSpawnPointOnly:!1,directionRandomizer:0}}static computeDirection(i,e,o,s,a){o.copyFrom(s).normalize(),a||t.Vector3Tool.TransformNormalFromFloatsToRef(o.x,o.y,o.z,e,o)}static startPositionFunction(i,e,o,s,a,r,l,h){let c=n(s,a,r,l,2*Math.PI,i.arcValue,i.arcSpread,i.arcSpeed,i.arcMode);var m=i.radius-t.ScalarTool.RandomRange(0,i.radius*i.radiusThickness),_=m*Math.cos(c),p=m*Math.sin(c);h?(o.x=_,o.y=p,o.z=0):t.Vector3Tool.TransformCoordinatesFromFloatsToRef(_,p,0,e,o)}}class h{static Config(){return{mode:e.Cone,radius:1,angle:Math.PI,radiusThickness:1,baseHeight:0,height:1,heightRange:0,arcMode:o.Random,arcValue:2*Math.PI,arcSpread:0,arcSpeed:1,scale:[1,1,1],directionMode:s.Unity,emitFromSpawnPointOnly:!1,directionRandomizer:0}}static MAX_Z=999999999;static computeDirection(i,e,o,s,a){o.copyFrom(s).addInPlaceFromFloats(0,0,i.baseHeight).normalize(),a||t.Vector3Tool.TransformNormalFromFloatsToRef(o.x,o.y,o.z,e,o);o.x=o.x+0,o.y=o.y+0,o.z=o.z+0,o.normalize()}static startPositionFunction(i,e,o,a,r,l,c,m){let _=n(a,r,l,c,2*Math.PI,i.arcValue,i.arcSpread,i.arcSpeed,i.arcMode);var p;0!==i.angle?i.baseHeight=i.radius/Math.tan(i.angle/2):i.baseHeight=h.MAX_Z,p=i.emitFromSpawnPointOnly?0:t.ScalarTool.RandomRange(0,i.heightRange),p=Math.max(1e-5,p);var d=i.radius-t.ScalarTool.RandomRange(0,i.radius*i.radiusThickness);i.baseHeight>0&&(d=d*(p*i.height+i.baseHeight)/i.baseHeight);var u=0,L=0,T=0;i.directionMode==s.Unity?(u=d*Math.sin(_),T=d*Math.cos(_),L=p*i.height):(u=d*Math.sin(_),L=d*Math.cos(_),T=p*i.height),m?(o.x=u,o.y=T,o.z=L):t.Vector3Tool.TransformCoordinatesFromFloatsToRef(u,T,L,e,o)}}class c{static Config(){return{mode:e.Edge,radius:0,angle:Math.PI,radiusThickness:1,baseHeight:0,height:1,heightRange:0,arcMode:o.Random,arcValue:1,arcSpread:0,arcSpeed:1,scale:[1,1,1],directionMode:s.Unity,emitFromSpawnPointOnly:!1,directionRandomizer:0}}static computeDirection(i,e,o,s,a){o.copyFromFloats(0,1,0),a||t.Vector3Tool.TransformNormalFromFloatsToRef(o.x,o.y,o.z,e,o)}static startPositionFunction(i,e,o,s,a,r,l,h){let c=n(s,a,r,l,1,i.arcValue,i.arcSpread,i.arcSpeed,i.arcMode);var m=i.radius*(c/i.arcValue*2-1);o.copyFromFloats(m,0,0),h||t.Vector3Tool.TransformCoordinatesFromFloatsToRef(o.x,o.y,o.z,e,o)}}class m{static Config(){return{mode:e.Hemisphere,radius:1,angle:Math.PI,radiusThickness:1,baseHeight:0,height:1,heightRange:0,arcMode:o.Random,arcValue:2*Math.PI,arcSpread:0,arcSpeed:1,scale:[1,1,1],directionMode:s.Unity,emitFromSpawnPointOnly:!1,directionRandomizer:0}}static computeDirection(i,e,o,s,a){o.copyFrom(s).normalize(),a||t.Vector3Tool.TransformNormalFromFloatsToRef(o.x,o.y,o.z,e,o);var r=t.ScalarTool.RandomRange(0,i.directionRandomizer||0),n=t.ScalarTool.RandomRange(0,i.directionRandomizer||0),l=t.ScalarTool.RandomRange(0,i.directionRandomizer||0);o.x+=r,o.y+=n,o.z+=l,o.normalize()}static startPositionFunction(i,e,o,s,a,r,l,h){let c=n(s,a,r,l,2*Math.PI,i.arcValue,i.arcSpread,i.arcSpeed,i.arcMode);var m=t.ScalarTool.RandomRange(0,i.radiusThickness),_=i.radius-i.radius*m*m,p=t.ScalarTool.RandomRange(0,1),d=c,u=Math.acos(2*p-1),L=_*Math.cos(d)*Math.sin(u),T=Math.abs(_*p),v=_*Math.sin(d)*Math.sin(u);h?o.copyFromFloats(L,v,T):t.Vector3Tool.TransformCoordinatesFromFloatsToRef(L,v,T,e,o)}}class _{static Config(){return{mode:e.Point,radius:1,angle:Math.PI,radiusThickness:1,baseHeight:0,height:1,heightRange:0,arcMode:o.Random,arcValue:2*Math.PI,arcSpread:0,arcSpeed:1,scale:[1,1,1],directionMode:s.Unity,emitFromSpawnPointOnly:!1,directionRandomizer:0}}static computeDirection(i,e,o,s,a){a?o.copyFromFloats(0,0,1):t.Vector3Tool.TransformNormalFromFloatsToRef(0,0,1,e,o)}static startPositionFunction(t,i,e,o,s,a,r,n){n?e.copyFromFloats(0,0,0):i.getTranslationToRef(e)}}class p{static Config(){return{mode:e.Rectangle,radius:1,angle:Math.PI,radiusThickness:1,baseHeight:0,height:1,heightRange:0,arcMode:o.Random,arcValue:2*Math.PI,arcSpread:0,arcSpeed:1,scale:[1,1,1],directionMode:s.Unity,emitFromSpawnPointOnly:!1,directionRandomizer:0}}static computeDirection(i,e,o,s,a){a?o.copyFromFloats(0,0,1):t.Vector3Tool.TransformNormalFromFloatsToRef(0,0,1,e,o)}static startPositionFunction(i,e,o,s,a,r,n,l){var h=t.ScalarTool.RandomRange(-.5,.5),c=t.ScalarTool.RandomRange(-.5,.5);l?o.copyFromFloats(h*i.scale[0],c*i.scale[1],0*i.scale[2]):t.Vector3Tool.TransformCoordinatesFromFloatsToRef(h*i.scale[0],c*i.scale[1],0*i.scale[2],e,o)}}class d{static Config(){return{mode:e.Sphere,radius:1,angle:Math.PI,radiusThickness:1,baseHeight:0,height:1,heightRange:0,arcMode:o.Random,arcValue:2*Math.PI,arcSpread:0,arcSpeed:1,scale:[1,1,1],directionMode:s.Unity,emitFromSpawnPointOnly:!1,directionRandomizer:0}}static computeDirection(i,e,o,s,a){o.copyFrom(s).normalize(),a||t.Vector3Tool.TransformNormalFromFloatsToRef(o.x,o.y,o.z,e,o)}static startPositionFunction(i,e,o,s,a,r,n,l){var h=t.ScalarTool.RandomRange(-.5,.5),c=t.ScalarTool.RandomRange(-.5,.5);l?o.copyFromFloats(h*i.scale[0],c*i.scale[1],0*i.scale[2]):t.Vector3Tool.TransformCoordinatesFromFloatsToRef(h*i.scale[0],c*i.scale[1],0*i.scale[2],e,o)}}class u{static startDirectionFunction(t,i,o,s,r){switch(t.mode){case e.Box:a.computeDirection(t,i,o,s,r);break;case e.Cone:h.computeDirection(t,i,o,s,r);break;case e.Hemisphere:m.computeDirection(t,i,o,s,r);break;case e.Sphere:d.computeDirection(t,i,o,s,r);break;case e.Edge:c.computeDirection(t,i,o,s,r);break;case e.Circle:l.computeDirection(t,i,o,s,r);break;case e.Rectangle:p.computeDirection(t,i,o,s,r);break;default:_.computeDirection(t,i,o,s,r)}}static startPositionFunction(t,i,o,s,r,n,u,L){switch(t.mode){case e.Box:a.startPositionFunction(t,i,o,s,r,n,u,L);break;case e.Cone:h.startPositionFunction(t,i,o,s,r,n,u,L);break;case e.Hemisphere:m.startPositionFunction(t,i,o,s,r,n,u,L);break;case e.Sphere:d.startPositionFunction(t,i,o,s,r,n,u,L);break;case e.Edge:c.startPositionFunction(t,i,o,s,r,n,u,L);break;case e.Circle:l.startPositionFunction(t,i,o,s,r,n,u,L);break;case e.Rectangle:p.startPositionFunction(t,i,o,s,r,n,u,L);break;default:_.startPositionFunction(t,i,o,s,r,n,u,L)}}}var L,T,v,f,g;!function(t){t[t.Constant=1]="Constant",t[t.TwoConstants=2]="TwoConstants",t[t.Curve=4]="Curve",t[t.TwoCurves=8]="TwoCurves"}(L||(L={})),function(t){t[t.Color=1]="Color",t[t.TwoColors=2]="TwoColors",t[t.Gradient=4]="Gradient",t[t.TwoGradients=8]="TwoGradients",t[t.Random=16]="Random"}(T||(T={})),function(t){t[t.Local=0]="Local",t[t.World=1]="World"}(v||(v={})),function(t){t[t.Hierarchy=0]="Hierarchy",t[t.Local=1]="Local",t[t.Shape=2]="Shape"}(f||(f={})),function(t){t[t.View=0]="View",t[t.World=1]="World",t[t.Local=2]="Local"}(g||(g={}));class y{static TempVector3_0;static TempVector3_1;static TempQuaternion_0;static TempMatrix_1;static sqrt3=Math.sqrt(3);static init(){y.TempVector3_0=t.Vector3Tool.Zero(),y.TempVector3_1=t.Vector3Tool.Zero(),y.TempQuaternion_0=t.QuaternionTool.Zero(),y.TempMatrix_1=t.Matrix4Tool.Zero(),y.sqrt3=Math.sqrt(3)}maxParticles=100;looping=!0;prewarm=!1;duration=5;_loopCount=0;startDelay=0;emitterShape;emissionTime=1e3;emissionLoop=0;emissionProgress=0;rateOverTime=10;bursts=[];_burstsLoopCount=[];simulationSpace=v.Local;scalingSpace=f.Hierarchy;renderAlignment=g.Local;startLifetimeInterpolation;startSpeedInterpolation;startSizeInterpolation;startRotationInterpolation;startColorInterpolation;gravityInterpolation;velocityOverLifetimeInterpolation;velocityOverLifetimeIsLocal=!0;limitVelocityOverLifetimeDampen=0;limitVelocityOverLifetimeInterpolation;forceOverLifetimeInterpolation;forceSpaceIsLocal=!0;colorOverLifetimeInterpolation;sizeOverLifetimeInterpolation;rotationOverLifetimeInterpolation;textureSheetInterpolation;_ageList=[];_ratioList=[];_lifeTimeList=[];_activeTimeList=[];_startGravityList=[];_startLocalPositionList=[];_startPositionList=[];_startSizeList=[];_startColorList=[];_realtimeLocalPositionList=[];_realtimeRotationList=[];_realtimeSizeList=[];_realtimeColorList=[];_velocityLastList=[];_limitVelocityFlagList=[];_limitVelocityList=[];_realtimeForceList=[];_startDirectionList=[];_realtimeVelocityDirectionList=[];_activeIdList=[];_activeFlagList=[];_waitIdList=[];_startWorldMatrixList=[];_startWorldRIMList=[];_realStartWMList=[];_uvSheetList=[];enableForceOverLifeTime=!1;enableVelocityOverLifeTime=!1;enableLimitVelocityOverLifeTime=!1;enableColorOverLifeTime=!1;enableSizeOverLifeTime=!1;enableRotationOverLifeTime=!1;_particleSystemAge=0;_tempVector3=t.Vector3Tool.Zero();_tempVector4=t.Vector4Tool.Zero();_lastTime=0;_deltaTime=0;_lastCreateTime=0;_isPlaying=!1;_isComputeable=!1;getParentWorldMatrix=t.Matrix4Tool.Identity;getWorldMatrix=t.Matrix4Tool.Identity;getLocalMatrix=t.Matrix4Tool.Identity;getCameraPosition=t.Vector3Tool.Zero;_isDisposed=!1;dispose(){this._isDisposed||(this.stop(),this._mpMatrixList=void 0,this._mpColorData=void 0,this.startLifetimeInterpolation&&this.startLifetimeInterpolation.dispose(),this.startSpeedInterpolation&&this.startSpeedInterpolation.dispose(),this.startSizeInterpolation&&this.startSizeInterpolation.dispose(),this.startRotationInterpolation&&this.startRotationInterpolation.dispose(),this.startColorInterpolation&&this.startColorInterpolation.dispose(),this.gravityInterpolation&&this.gravityInterpolation.dispose(),this.velocityOverLifetimeInterpolation&&this.velocityOverLifetimeInterpolation.dispose(),this.limitVelocityOverLifetimeInterpolation&&this.limitVelocityOverLifetimeInterpolation.dispose(),this.forceOverLifetimeInterpolation&&this.forceOverLifetimeInterpolation.dispose(),this.colorOverLifetimeInterpolation&&this.colorOverLifetimeInterpolation.dispose(),this.sizeOverLifetimeInterpolation&&this.sizeOverLifetimeInterpolation.dispose(),this.rotationOverLifetimeInterpolation&&this.rotationOverLifetimeInterpolation.dispose(),this.bursts.length=0,this._activeIdList.length=0,this._activeFlagList.length=0,this._waitIdList.length=0,this._ageList.length=0,this._ratioList.length=0,this._lifeTimeList.length=0,this._activeTimeList.length=0,this._startGravityList.length=0,this._startLocalPositionList.length=0,this._startPositionList.length=0,this._startSizeList.length=0,this._startColorList.length=0,this._realtimeLocalPositionList.length=0,this._realtimeRotationList.length=0,this._realtimeSizeList.length=0,this._realtimeColorList.length=0,this._velocityLastList.length=0,this._limitVelocityFlagList.length=0,this._limitVelocityList.length=0,this._realtimeForceList.length=0,this._startDirectionList.length=0,this._realtimeVelocityDirectionList.length=0,this._startWorldMatrixList.length=0,this._startWorldRIMList.length=0,this._realStartWMList.length=0,this._uvSheetList.length=0,this._isDisposed=!0)}_mpMatrixList;_mpColorData;get mpMatrixList(){return this._mpMatrixList}get mpColorData(){return this._mpColorData}_maxId=0;build(){this._mpMatrixList=new Float32Array(16*this.maxParticles),this._mpColorData=new Float32Array(4*this.maxParticles);for(let i=this._maxId;i<this.maxParticles;i++)this._waitIdList.push(i),this._activeFlagList[i]=0,this._ageList[i]=0,this._ratioList[i]=0,this._lifeTimeList[i]=Number.MAX_VALUE,this._activeTimeList[i]=0,this._startGravityList[i]=t.Vector3Tool.Zero(),this._startLocalPositionList[i]=t.Vector3Tool.Zero(),this._startPositionList[i]=t.Vector3Tool.Zero(),this._startSizeList[i]=t.Vector3Tool.One(),this._startColorList[i]=t.Vector4Tool.Zero(),this._realtimeLocalPositionList[i]=t.Vector3Tool.Zero(),this._realtimeRotationList[i]=[0,0,0],this._realtimeSizeList[i]=t.Vector3Tool.One(),this._realtimeColorList[i]=t.Vector4Tool.One(),this._velocityLastList[i]=t.Vector3Tool.Zero(),this._limitVelocityFlagList[i]=!1,this._limitVelocityList[i]=0,this._realtimeForceList[i]=t.Vector3Tool.Zero(),this._startDirectionList[i]=t.Vector3Tool.Zero(),this._realtimeVelocityDirectionList[i]=t.Vector3Tool.Zero(),this._startWorldMatrixList[i]=t.Matrix4Tool.Identity(),this._startWorldRIMList[i]=t.Matrix4Tool.Identity(),this._realStartWMList[i]=t.Matrix4Tool.Identity(),this._uvSheetList[i]=[1,1,0,0];this._maxId=this.maxParticles}start(){this._isPlaying||(this.startDelay>0&&!this.prewarm?setTimeout(this._startCall,this.startDelay):this._startCall()),this._isPlaying=!0}_startCall=()=>{if(this._isComputeable=!0,this._particleSystemAge=0,this._lastTime=Date.now(),this._lastCreateTime=this._lastTime,this.prewarm)for(let t=this.rateOverTime-1;t>=0;t--)this._lastTime-=t*this.duration/this.rateOverTime,this.varCompute()};stop(){this._isComputeable=!1,this._isDisposed||this._stop(),this._isPlaying=!1}_stop(){if(this._isPlaying){this._burstsLoopCount.length=0;for(let t=this._activeIdList.length-1;t>=0;t--){const t=this._activeIdList.pop();this._activeFlagList[t]=0,this._waitIdList.push(t)}}this._isPlaying=!1}mpUpdate(){return this._update()}_mpTempMatrix=t.Matrix4Tool.Identity();_cameraInvertMatrix=t.Matrix4Tool.Identity();_startWorldRIM=t.Matrix4Tool.Identity();_startWorldP=t.Vector3Tool.Zero();_startWorldRM=t.Matrix4Tool.Identity();_startWorldS=t.Vector3Tool.Zero();_startLocalS=t.Vector3Tool.Zero();_start_parent_m=t.Matrix4Tool.Identity();_start_wm=t.Matrix4Tool.Identity();_start_local_m=t.Matrix4Tool.Identity();_start_p_s=t.Vector3Tool.Zero();_start_p_r=t.QuaternionTool.Identity();_start_p_p=t.Vector3Tool.Zero();_start_l_s=t.Vector3Tool.Zero();_start_l_r=t.QuaternionTool.Identity();_start_l_p=t.Vector3Tool.Zero();_maxLifetimeOverage=0;get maxLifetimeOverage(){return this._maxLifetimeOverage}_formatStartInfo(i,e,o){i?i.decompose(this._start_p_s,this._start_p_r,this._start_p_p):(this._start_p_p.x=0,this._start_p_p.y=0,this._start_p_p.z=0,this._start_p_r.x=0,this._start_p_r.y=0,this._start_p_r.z=0,this._start_p_r.w=1,this._start_p_s.x=1,this._start_p_s.y=1,this._start_p_s.z=1),e.decompose(this._start_l_s,this._start_l_r,this._start_l_p),this.renderAlignment==g.View?(this._start_p_r.copyFromFloats(0,0,0,1),this._start_l_r.copyFromFloats(0,0,0,1)):this.renderAlignment==g.World&&this._start_l_r.copyFromFloats(0,0,0,1),this.scalingSpace==f.Hierarchy||(this.scalingSpace==f.Local?this._start_p_s.copyFromFloats(1,1,1):(this._start_p_s.copyFromFloats(1,1,1),this._start_l_s.copyFromFloats(1,1,1))),t.Matrix4Tool.ComposeToRef(this._start_p_s,this._start_p_r,this._start_p_p,o),t.Matrix4Tool.ComposeToRef(this._start_l_s,this._start_l_r,this._start_l_p,y.TempMatrix_1),y.TempMatrix_1.multiplyToRef(o,o)}_update(){if(!this._mpColorData||!this._mpMatrixList)return 0;const e=this.getCameraPosition();let o=e.scale(-1);this._start_parent_m=this.getParentWorldMatrix(),this._start_local_m=this.getLocalMatrix();let s=this.getWorldMatrix().clone(),a=t.Matrix4Tool.Identity();this._formatStartInfo(this._start_parent_m,this._start_local_m,a);let r=t.Matrix4Tool.Identity(),n=t.Vector3Tool.Zero(),l=0;const h=this._activeFlagList.length;for(let c=0;c<h;c++){if(1!=this._activeFlagList[c])continue;const h=c,m=this._startLocalPositionList[h],_=this._realtimeLocalPositionList[h],p=this._realtimeRotationList[h],d=this._realtimeSizeList[h],u=this._realtimeColorList[h],L=(this._uvSheetList[h],4*l);this._mpColorData[L+0]=u.x,this._mpColorData[L+1]=u.y,this._mpColorData[L+2]=u.z,this._mpColorData[L+3]=u.w,this.simulationSpace==v.Local?r.copyFrom(a):(r.copyFrom(this._realStartWMList[h]),s.copyFrom(this._startWorldMatrixList[h]));let T=p[0],f=p[1],F=p[2];t.Vector3Tool.TransformCoordinatesFromFloatsToRef(m.x+_.x,m.y+_.y,m.z+_.z,s,y.TempVector3_1),this.renderAlignment==g.View?(r.decompose(y.TempVector3_0,void 0,void 0),s.getTranslationToRef(o),o.subtractInPlace(e),i(o,y.TempQuaternion_0),t.Matrix4Tool.ComposeToRef(y.TempVector3_0,y.TempQuaternion_0,n,r)):r.setTranslationFromFloats(0,0,0),t.QuaternionTool.RotationYawPitchRollToRef(f,T,F,y.TempQuaternion_0),t.Matrix4Tool.ComposeToRef(d,y.TempQuaternion_0,n,y.TempMatrix_1),y.TempMatrix_1.multiplyToRef(r,r),r.setTranslation(y.TempVector3_1),r.copyToArray(this._mpMatrixList,16*l),l++}return l}varCompute=()=>{if(this._isPlaying&&this._isComputeable){const t=Date.now(),i=t-this._lastTime;this._lastTime=t,this._particleSystemAge+=i,this._deltaTime=i/1e3;const e=Math.min(this._deltaTime,.05),o=t-this._lastCreateTime,s=Math.floor(this._particleSystemAge/this.duration);let a=!0,r=this._particleSystemAge-(this.prewarm?this.duration:0)-this.duration;if(r>0&&!this.looping){if(r>this._maxLifetimeOverage)return void this.stop();a=!1}else this._maxLifetimeOverage=0;const n=this._particleSystemAge%this.duration;let l=0;this.emissionLoop=Math.floor(this._particleSystemAge/this.emissionTime),this.emissionProgress=this._particleSystemAge%this.emissionTime/this.emissionTime;const h=this.bursts.length;if(this._loopCount<s){for(let t=0;t<h;t++){const[i,e,o,s]=this.bursts[t];if(this.duration>i){this._burstsLoopCount[t]||(this._burstsLoopCount[t]=0);if(Math.ceil((this.duration-i)/s)>this._burstsLoopCount[t])for(;o>this._burstsLoopCount[t];)this._burstsLoopCount[t]+=1,l+=e}this._burstsLoopCount[t]=0}this._loopCount=s}for(let t=0;t<h;t++){const[i,e,o,s]=this.bursts[t];if(n>i){this._burstsLoopCount[t]||(this._burstsLoopCount[t]=0);Math.ceil((n-i)/s)>this._burstsLoopCount[t]&&o>this._burstsLoopCount[t]&&(this._burstsLoopCount[t]+=1,l+=e)}}let c=Math.round(o/1e3*this.rateOverTime)+l;c>0&&(this._lastCreateTime=t),a||(c=0),this.varInit(c);let m=this._startWorldRIM;this.varPre(e,m)}};varInit(i){const e=this._waitIdList.length;i=Math.min(e,i);const o=this._particleSystemAge%this.duration/this.duration,s=t.Matrix4Tool.Identity();let a=this.getParentWorldMatrix(),r=this.getWorldMatrix(),n=this.getLocalMatrix();r.decompose(this._startWorldS,null,this._startWorldP),r.getRotationMatrixToRef(this._startWorldRM),this._startWorldRM.invertToRef(this._startWorldRIM),this._formatStartInfo(a,n,s);for(let t=0;t<i;t++){const e=this._waitIdList.pop();this._startWorldMatrixList[e].copyFrom(r),this._startWorldRIMList[e].copyFrom(this._startWorldRIM),this._realStartWMList[e].copyFrom(s),this.initNew(e,this._startWorldRIM,o,this.emissionLoop,this.emissionProgress,t,i),this._activeTimeList[e]=this._particleSystemAge,this._activeIdList.push(e),this._activeFlagList[e]=1}}initNew(i,e,o,s,a,r,n){this.textureSheetInterpolation&&this.textureSheetInterpolation.initNew(i);const l=this._startWorldMatrixList[i];let h;this.startLifetimeInterpolation&&(this._lifeTimeList[i]=this.startLifetimeInterpolation.interpolate(o)),this.startColorInterpolation&&(h=this.startColorInterpolation.interpolate(o),this._startColorList[i].copyFromFloats(h[0],h[1],h[2],h[3])),this.gravityInterpolation&&(h=this.gravityInterpolation.interpolate(o),this._startGravityList[i].copyFromFloats(h[0],h[1],h[2]));let c=[0,0,0];this.startRotationInterpolation&&(c=this.startRotationInterpolation.interpolate(o)),this._realtimeRotationList[i][0]=c[0],this._realtimeRotationList[i][1]=c[1],this._realtimeRotationList[i][2]=c[2];const m=this._startSizeList[i];this.startSizeInterpolation&&(h=this.startSizeInterpolation.interpolate(o),m.copyFromFloats(h[0],h[1],h[2]));let _=0;this.startSpeedInterpolation&&(_=this.startSpeedInterpolation.interpolate(o));const p=this._startLocalPositionList[i];u.startPositionFunction(this.emitterShape,l,p,s,a,r,n,!0);const d=this._startDirectionList[i];u.startDirectionFunction(this.emitterShape,l,d,p,!0),d.scaleInPlace(_),this.enableVelocityOverLifeTime&&this.velocityOverLifetimeInterpolation&&(this.velocityOverLifetimeInterpolation.mode!=L.Constant&&this.velocityOverLifetimeInterpolation.mode!=L.TwoConstants||(h=this.velocityOverLifetimeInterpolation.interpolate(o),this._tempVector3.copyFromFloats(h[0],h[1],h[2]),this._tempVector3.subtractToRef(this._velocityLastList[i],this._tempVector3),this.velocityOverLifetimeIsLocal||t.Vector3Tool.TransformCoordinatesFromFloatsToRef(this._tempVector3.x,this._tempVector3.y,this._tempVector3.z,e,this._tempVector3),d.addInPlace(this._tempVector3),this._velocityLastList[i].copyFromFloats(h[0],h[1],h[2]))),this.enableLimitVelocityOverLifeTime&&this.limitVelocityOverLifetimeInterpolation&&(this._limitVelocityList[i]=Number.MAX_SAFE_INTEGER,this.limitVelocityOverLifetimeInterpolation.mode!=L.Constant&&this.limitVelocityOverLifetimeInterpolation.mode!=L.TwoConstants||(this._limitVelocityList[i]=this.limitVelocityOverLifetimeInterpolation.interpolate(0))),this._realtimeVelocityDirectionList[i].copyFrom(d),this._velocityLastList[i].copyFromFloats(0,0,0),this._realtimeLocalPositionList[i].copyFromFloats(0,0,0),this._realtimeSizeList[i].copyFrom(m),this._limitVelocityFlagList[i]=!1}varPre(i,e){const o=this._activeFlagList.length;let s;for(let a=0;a<o;a++){if(1!=this._activeFlagList[a])continue;let o=a;this.simulationSpace==v.World&&(e=this._startWorldRIMList[o]);let r=this._activeTimeList[o],n=this._particleSystemAge-r;this._ageList[o]=n,this._ratioList[o]=Math.min(1,n/this._lifeTimeList[o]);let l=this._ratioList[o],h=Math.min(1,n/1e3);this.textureSheetInterpolation&&this.textureSheetInterpolation.interpolate(l,this._uvSheetList,o),this.enableColorOverLifeTime&&this.colorOverLifetimeInterpolation?(s=this.colorOverLifetimeInterpolation.interpolate(l),this._tempVector4.copyFromFloats(s[0],s[1],s[2],s[3]),this._tempVector4.multiplyInPlace(this._startColorList[o]),this._realtimeColorList[o].copyFrom(this._tempVector4)):this._realtimeColorList[o].copyFrom(this._startColorList[o]),this.enableSizeOverLifeTime&&this.sizeOverLifetimeInterpolation?(s=this.sizeOverLifetimeInterpolation.interpolate(l),this._realtimeSizeList[o].copyFromFloats(s[0],s[1],s[2]),this._realtimeSizeList[o].multiplyInPlace(this._startSizeList[o])):this._realtimeSizeList[o].copyFrom(this._startSizeList[o]),this.enableRotationOverLifeTime&&this.rotationOverLifetimeInterpolation&&(s=this.rotationOverLifetimeInterpolation.interpolate(h),this._realtimeRotationList[o][0]+=s[0]*i,this._realtimeRotationList[o][1]+=s[1]*i,this._realtimeRotationList[o][2]+=s[2]*i);let c=this._realtimeVelocityDirectionList[o];this.enableVelocityOverLifeTime&&this.velocityOverLifetimeInterpolation&&(this.velocityOverLifetimeInterpolation.mode==L.Constant||this.velocityOverLifetimeInterpolation.mode==L.TwoConstants||(s=this.velocityOverLifetimeInterpolation.interpolate(l),this._tempVector3.copyFromFloats(s[0],s[1],s[2]),this._tempVector3.subtractToRef(this._velocityLastList[o],this._tempVector3),this.velocityOverLifetimeIsLocal||t.Vector3Tool.TransformCoordinatesFromFloatsToRef(this._tempVector3.x,this._tempVector3.y,this._tempVector3.z,e,this._tempVector3),c.addInPlace(this._tempVector3),this._velocityLastList[o].copyFromFloats(s[0],s[1],s[2]))),c.scaleToRef(i,this._deltaPosition),this._realtimeLocalPositionList[o].addInPlace(this._deltaPosition);let m=this._startGravityList[o];if(t.Vector3Tool.TransformCoordinatesFromFloatsToRef(m.x,m.y,m.z,e,this._tempVector3),this._tempVector3.scaleToRef(i,this._tempVector3),c.addInPlace(this._tempVector3),this.enableForceOverLifeTime&&this.forceOverLifetimeInterpolation&&(s=this.forceOverLifetimeInterpolation.interpolate(l),this._tempVector3.copyFromFloats(s[0],s[1],s[2]),this.forceSpaceIsLocal||t.Vector3Tool.TransformCoordinatesFromFloatsToRef(this._tempVector3.x,this._tempVector3.y,this._tempVector3.z,e,this._tempVector3),this._tempVector3.scaleToRef(i,this._tempVector3),c.addInPlace(this._tempVector3)),this.enableLimitVelocityOverLifeTime&&this.limitVelocityOverLifetimeInterpolation){let t=Number.MAX_SAFE_INTEGER;t=this.limitVelocityOverLifetimeInterpolation.mode==L.Constant||this.limitVelocityOverLifetimeInterpolation.mode==L.TwoConstants?this._limitVelocityList[o]:this.limitVelocityOverLifetimeInterpolation.interpolate(l);let i=c.length();i>t&&c.scaleInPlace(1-this.limitVelocityOverLifetimeDampen*(i-t)/i*.66)}}}_deltaPosition=t.Vector3Tool.Zero();recycle=()=>{const t=[];for(let i=this._activeIdList.length-1;i>=0;i--){const e=this._activeIdList[i],o=this._ageList[e];let s=this._lifeTimeList[e]-o;this._maxLifetimeOverage=Math.max(this._maxLifetimeOverage,s),s<=0?(this._activeFlagList[e]=0,this._waitIdList.push(e),this._ageList[e]=0,this._lifeTimeList[e]=Number.MAX_VALUE,this._realtimeLocalPositionList[e].copyFromFloats(0,0,0),this._realtimeRotationList[e][0]=0,this._realtimeRotationList[e][1]=0,this._realtimeRotationList[e][2]=0,this._realtimeSizeList[e].copyFromFloats(1,1,1)):t.push(e)}this._activeIdList.length=0,this._activeIdList=t};activeParticlesSort(){}_updateIndex=0}var F;!function(t){t[t.STEP=1]="STEP"}(F||(F={}));function C(t,i,e){return t===i?t:e*(i-t)+t}function M(t,i,e,o,s,a){e[0]=C(t[0],i[0],o),e[1]=C(t[1],i[1],s),e[2]=C(t[2],i[2],a)}function I(t,i,e,o,s,a,r){e[0]=C(t[0],i[0],o),e[1]=C(t[1],i[1],s),e[2]=C(t[2],i[2],a),e[3]=C(t[3],i[3],r)}function R(){return Math.random()}function S(t,i){let e=i[0].length;if(0==e)return i[1];let o=0,s=e-1,a=i[0][o],r=i[0][s];if(1==e)return a[1]*i[1];for(let n=0;n<e-1;n++){if(o=n,s=n+1,a=i[0][o],r=i[0][s],0==o&&t<=a[0]){s=o,r=a;break}if(a[0]<t&&t<r[0])break;if(s==e-1&&r[0]<=t){o=s,a=r;break}}return o==s?a[1]*i[1]:(t=(t-a[0])/(r[0]-a[0]),function(t,i,e,o,s){var a=s*s,r=s*a;return t*(2*r-3*a+1)+e*(-2*r+3*a)+i*(r-2*a+s)+o*(r-a)}(a[1],a[3],r[1],r[2],t)*i[1])}const V=[0,0,0],x=[0,0,0,0],P=[0,0,0],O=[0,0,0,0];class b{mode=L.Constant;constant0;constant1;minCurve;maxCurve;interpolate(t){switch(this.mode){case L.TwoConstants:return C(this.constant0||0,this.constant1||0,R());case L.Curve:return S(t,this.minCurve||this.maxCurve);case L.TwoCurves:return C(S(t,this.minCurve),S(t,this.maxCurve),R());default:return this.constant0||this.constant1||0}}dispose(){this.constant0=void 0,this.constant1=void 0,this.minCurve=void 0,this.maxCurve=void 0}}class w{mode=L.Constant;constant0;constant1;minCurves;maxCurves;interpolate(t){switch(this.mode){case L.TwoConstants:return M(this.constant0,this.constant1,V,R(),R(),R()),V;case L.Curve:{const i=this.minCurves[0]||this.maxCurves[0],e=this.minCurves[1]||this.maxCurves[1],o=this.minCurves[2]||this.maxCurves[2];return V[0]=S(t,i),V[1]=S(t,e),V[2]=S(t,o),V}case L.TwoCurves:{const i=this.minCurves[0],e=this.minCurves[1],o=this.minCurves[2],s=this.maxCurves[0],a=this.maxCurves[1],r=this.maxCurves[2];return V[0]=S(t,i),V[1]=S(t,e),V[2]=S(t,o),P[0]=S(t,s),P[1]=S(t,a),P[2]=S(t,r),M(V,P,V,R(),R(),R()),V}default:return this.constant0||this.constant1}}dispose(){this.constant0=void 0,this.constant1=void 0,this.minCurves=void 0,this.maxCurves=void 0}}class z{mode=L.Constant;constant0;constant1;minCurves;maxCurves;interpolate(t){switch(this.mode){case L.TwoConstants:return I(this.constant0,this.constant1,x,R(),R(),R(),R()),x;case L.Curve:{const i=this.minCurves[0]||this.maxCurves[0],e=this.minCurves[1]||this.maxCurves[1],o=this.minCurves[2]||this.maxCurves[2],s=this.minCurves[3]||this.maxCurves[3];return x[0]=S(t,i),x[1]=S(t,e),x[2]=S(t,o),x[3]=S(t,s),x}case L.TwoCurves:{const i=this.minCurves[0],e=this.minCurves[1],o=this.minCurves[2],s=this.minCurves[3],a=this.maxCurves[0],r=this.maxCurves[1],n=this.maxCurves[2],l=this.maxCurves[3];return x[0]=S(t,i),x[1]=S(t,e),x[2]=S(t,o),x[3]=S(t,s),O[0]=S(t,a),O[1]=S(t,r),O[2]=S(t,n),O[3]=S(t,l),I(x,O,x,R(),R(),R(),R()),x}default:return this.constant0||this.constant1}}dispose(){this.constant0=void 0,this.constant1=void 0,this.minCurves=void 0,this.maxCurves=void 0}}var D,W,k;!function(t){t[t.Custom=0]="Custom",t[t.Random=1]="Random"}(D||(D={})),function(t){t[t.Liftime=0]="Liftime",t[t.Speed=1]="Speed"}(W||(W={})),function(t){t[t.WholeSheet=0]="WholeSheet",t[t.SingleRow=1]="SingleRow"}(k||(k={}));window.BPPS={Box:a,Cone:h,Circle:l,Edge:c,Hemisphere:m,Point:_,Rectangle:p,Sphere:d,ParticleSystemTool:y,MathTool:t,EArcMode:o,EInterpolationCurveMode:L,TextureSheet:class{rowList=[];startFrameList=[];rowMode=D.Random;customRow=0;timeMode=W.Liftime;animMode=k.WholeSheet;_tilesX=1;_tilesY=1;_uScale=1;_vScale=1;set tilesX(t){this._tilesX=t,this._uScale=1/t}set tilesY(t){this._tilesY=t,this._vScale=1/t}frameOverTime;startFrame;cycles=1;active=!0;initNew(t){this.startFrameList[t]=this.startFrame.interpolate(0),this.rowList[t]=Math.round(Math.random()*this._tilesY)%this._tilesY}interpolate(t,i,e){if(this.active&&this.frameOverTime){const o=this.frameOverTime.interpolate(t*this.cycles%1);let s=this.startFrameList[e],a=0,r=0,n=0;this.animMode==k.SingleRow?(n=this.rowMode==D.Custom?this.customRow:this.rowList[e],r=Math.floor((s+o)*this._tilesX%this._tilesX)):(a=s+o*this._tilesX*this._tilesY,r=Math.floor(a%this._tilesX),n=Math.floor(a/this._tilesX)),i[e][0]=this._tilesX,i[e][1]=this._tilesY,i[e][2]=r,i[e][3]=this._tilesY-n-1}else i[e][0]=this._tilesX,i[e][1]=this._tilesY,i[e][2]=0,i[e][3]=this._tilesY-0-1}},EMeshParticleSpaceMode:v,FloatInterpolation:b,Float3Interpolation:w,Float4Interpolation:z}})();
//# sourceMappingURL=particlesystem.js.map