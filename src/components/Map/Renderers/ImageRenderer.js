//
//
//

import * as THREE from 'three';

import AbstractRenderer from './AbstractRenderer';

import Image3D from '../Image3D';

export default class ImageRenderer extends AbstractRenderer {
  constructor(esriLoaderContext, images, trackcurve) {
    super();

    this.esriLoaderContext = esriLoaderContext;

    this.renderer = null; // three.js renderer
    this.camera = null; // three.js camera
    this.scene = null; // three.js scene
    this.vertexIdx = 0;
    this.ambient = null; // three.js ambient light source
    this.images3dArray = [];

    console.log(images);
    this.images3dArray = images.map(image => new Image3D(image, trackcurve));
  }

  /**
   * Setup function, called once by the ArcGIS JS API.
   */
  setup(context) {
    var self = this;

    var externalRenderers = this.esriLoaderContext.externalRenderers;
    var SpatialReference = this.esriLoaderContext.SpatialReference;

    var view = context.view; //this.esriLoaderContext.view;

    // initialize the three.js renderer
    //////////////////////////////////////////////////////////////////////////////////////
    this.renderer = new THREE.WebGLRenderer({
      context: context.gl,
      //premultipliedAlpha: true,
      //alpha : true
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

    this.scene = new THREE.Scene();

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

    // set positions ----------------

    for (let i = 0; i < this.images3dArray.length; i++) {
      let image3d = this.images3dArray[i];

      let pos = [0, 0, 0];

      externalRenderers.toRenderCoordinates(
        view,
        image3d.config.position,
        0,
        SpatialReference.WGS84,
        pos,
        0,
        1
      );
      image3d.position.set(pos[0], pos[1], pos[2]);

      let transform = new THREE.Matrix4();
      let arr = externalRenderers.renderCoordinateTransformAt(
        view,
        image3d.config.position,
        SpatialReference.WGS84,
        new Array(16)
      );
      transform.fromArray(arr);
      transform.decompose(image3d.position, image3d.quaternion, image3d.scale);

      let rotation = transform;
      let m2 = new THREE.Matrix4();
      m2.makeRotationX(THREE.Math.degToRad(90));
      rotation.multiply(m2);
      image3d.setRotationFromMatrix(rotation);
    }
  }

  onRequestAnimationFrame(time) {
    //nothing to animate
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
    for (let i = 0; i < this.images3dArray.length; i++) {
      this.scene.add(this.images3dArray[i]);
    }
  }
}
