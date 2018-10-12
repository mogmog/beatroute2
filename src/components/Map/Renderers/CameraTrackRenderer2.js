//
//
//

import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';

import AbstractRenderer from './AbstractRenderer';

export default class CameraTrackRenderer2 extends AbstractRenderer {
  constructor(esriLoaderContext) {
    super();

    this.esriLoaderContext = esriLoaderContext;

    this.renderer = null; // three.js renderer
    this.camera = null; // three.js camera
    this.scene = null; // three.js scene
    this.vertexIdx = 0;
    this.ambient = null; // three.js ambient light source




    this.geo = [
      [-110.7395240072906, 32.33625842258334, 2500],
      [-110.7395240072906, 32.33625842258334, 2500],
      [-110.7395240072906, 32.33625842258334, 2500]
    ].map((x) => {
      x[0] = x[0] + ((Math.random() / 10));
      x[1] = x[1] + ((Math.random() / 10));
      return x;
    });

  }

  /**
   * Setup function, called once
   */
  setup(context) {
    var self = this;

    var externalRenderers = this.esriLoaderContext.externalRenderers;
    var SpatialReference = this.esriLoaderContext.SpatialReference;

    var view = context.view; //this.esriLoaderContext.view;

    var curve = undefined;

    //
    //  you apply position to the route - it the same
    //
    //curve using three coordinates does work
    /*curve = new THREE.CatmullRomCurve3(
      [
        new THREE.Vector3( -5, -5, 3 ),    // < - - - here is you local coord sys
        new THREE.Vector3( -1000, -5, 3 ),
        new THREE.Vector3( -13000, -18000, 10 )
      ]
    );*/

    //lat longs
    const curve_path = [];

    this.geo.forEach(x => {
      let pos = [0, 0, 0];
      externalRenderers.toRenderCoordinates(view, x, 0, SpatialReference.WGS84, pos, 0, 1);
      curve_path.push(new THREE.Vector3(pos[0], pos[1], pos[2])); // we make all coords in global world coord sys !
    });

    curve = new THREE.CatmullRomCurve3(curve_path);

    var pointsCount = 500;
    var pointsCount1 = pointsCount + 1;
    var points = curve.getPoints(pointsCount);

    var pts = curve.getPoints(pointsCount);
    var width = 600;
    var widthSteps = 1;
    let pts2 = curve.getPoints(pointsCount);
    pts2.forEach(p => {
      p.z += width;
    });
    pts = pts.concat(pts2);

    var ribbonGeom = new THREE.BufferGeometry().setFromPoints(pts);

    var indices = [];
    for (let iy = 0; iy < widthSteps; iy++) {
      // the idea taken from PlaneBufferGeometry
      for (let ix = 0; ix < pointsCount; ix++) {
        var a = ix + pointsCount1 * iy;
        var b = ix + pointsCount1 * (iy + 1);
        var c = ix + 1 + pointsCount1 * (iy + 1);
        var d = ix + 1 + pointsCount1 * iy;
        // faces
        indices.push(a, b, d);
        indices.push(b, c, d);
      }
    }
    ribbonGeom.setIndex(indices);
    ribbonGeom.computeVertexNormals();

    this.route = new THREE.Mesh(
      ribbonGeom,
      new THREE.MeshNormalMaterial({
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.5,
      })
    );

    // initialize the three.js renderer
    //////////////////////////////////////////////////////////////////////////////////////
    this.renderer = new THREE.WebGLRenderer({
      context: context.gl,
      //premultipliedAlpha: false
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(context.camera.fullWidth, context.camera.fullHeight);

    // prevent three.js from clearing the buffers provided by the ArcGIS JS API.
    this.renderer.autoClear = false;
    this.renderer.autoClearDepth = false;
    this.renderer.autoClearStencil = false;
    this.renderer.autoClearColor = false;

    // The ArcGIS JS API renders to custom offscreen buffers, and not to the default framebuffers.
    // We have to inject this bit of code into the three.js runtime in order for it to bind those
    // buffers instead of the default ones.

    var originalSetRenderTarget = this.renderer.setRenderTarget.bind(this.renderer);

    this.renderer.setRenderTarget = function(target) {
      originalSetRenderTarget(target);
      if (target == null) {
        context.bindRenderTarget();
      }
    };

    ///////////////////////////////////////////////////////////////////////////////////////

    self.scene = new THREE.Scene();

    // setup the camera
    var cam = context.camera;
    this.camera = new THREE.PerspectiveCamera(cam.fovY, cam.aspect, cam.near, cam.far);
    this.camera.position.set(cam.eye[0], cam.eye[1], cam.eye[2]);
    this.camera.up.set(cam.up[0], cam.up[1], cam.up[2]);
    this.camera.lookAt(new THREE.Vector3(cam.center[0], cam.center[1], cam.center[2]));
    // Projection matrix can be copied directly
    this.camera.projectionMatrix.fromArray(cam.projectionMatrix);

    this.start();

    // cleanup after ourselfs
    context.resetWebGLState();

    // set frame ----------------

    // !  self.route already in world coordinates !

    /*
    const posEst = [
      -110.7395240072906,
      32.32625842258334,
      1500
    ];

    var renderPos = [0, 0, 0];

    //externalRenderers.toRenderCoordinates(view, posEst, 0, SpatialReference.WGS84, renderPos, 0, 1);
    //self.route.position.set(renderPos[0], renderPos[1], renderPos[2]);

    //var transform = new THREE.Matrix4();
    //transform.fromArray(externalRenderers.renderCoordinateTransformAt(view, posEst, SpatialReference.WGS84, new Array(16)));
    //transform.decompose(self.route.position, self.route.quaternion, self.route.scale);

    */
  }

  onRequestAnimationFrame(time) {
    //nothing to animate route
    // wrote you code that update object on requestAnimationFrame
    // because it will be much smooth that in render callback
  }

  onSwipe(isLeft, event) {}

  render(context) {
    var externalRenderers = this.esriLoaderContext.externalRenderers;
    var SpatialReference = this.esriLoaderContext.SpatialReference;

    var view = context.view; //this.esriLoaderContext.view;

    // update camera parameters
    ///////////////////////////////////////////////////////////////////////////////////
    var cam = context.camera;
    this.camera = new THREE.PerspectiveCamera(cam.fov, cam.aspect, cam.near, cam.far);
    this.camera.position.set(cam.eye[0], cam.eye[1], cam.eye[2]);
    this.camera.up.set(cam.up[0], cam.up[1], cam.up[2]);
    this.camera.lookAt(new THREE.Vector3(cam.center[0], cam.center[1], cam.center[2]));
    // Projection matrix can be copied directly
    this.camera.projectionMatrix.fromArray(cam.projectionMatrix);

    // draw the scene
    /////////////////////////////////////////////////////////////////////////////////////////////////////

    this.renderer.state.reset();

    this.renderer.state.setBlending(THREE.NoBlending); // 0.97 fix !

    this.renderer.render(this.scene, this.camera);

    // externalRenderers.requestRender(view); - this is bad practice - endless recursion
    //
    // check the MapHolder - animation frame

    // cleanup
    context.resetWebGLState();
  }

  start() {
    this.scene.add(this.route);
    this.scene.add(new THREE.AmbientLight(0xeeeeee));
  }
}
