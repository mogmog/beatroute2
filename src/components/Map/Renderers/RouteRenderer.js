//
//
//

import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';

import AbstractRenderer from "./AbstractRenderer"

export default class RouteRenderer extends AbstractRenderer {

    constructor(esriLoaderContext) {

        super();

        this.esriLoaderContext = esriLoaderContext;

        this.renderer = null;     // three.js renderer
        this.camera = null;       // three.js camera
        this.scene = null;        // three.js scene
        this.vertexIdx = 0;
        this.ambient = null;      // three.js ambient light source
    }

    /**
     * Setup function, called once
     */
    setup(context) {

        var self = this;

        var externalRenderers = this.esriLoaderContext.externalRenderers;
        var SpatialReference = this.esriLoaderContext.SpatialReference;

        var view = context.view; //this.esriLoaderContext.view;

        const pts = [];

        var curve = new THREE.CatmullRomCurve3( [
            new THREE.Vector3( -5, -5, 1 ),
            new THREE.Vector3( -1000, -5, 1 ),
            new THREE.Vector3( -3000, -10, 1),
            new THREE.Vector3( -3000, -4000, 1 )
        ] );


      var geometry = new THREE.TubeGeometry(curve, 100, 100, 2, false);

        this.tubematerial = new THREE.MeshPhongMaterial({
            transparent : true,
            opacity : 0.5,
            side : THREE.FrontSide,
            color: 0xffdb58
        });

       this.route = new THREE.Mesh(geometry, this.tubematerial);

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

        this.renderer.setRenderTarget = function (target) {
            originalSetRenderTarget(target);
            if (target == null) {
                context.bindRenderTarget();
            }
        }

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

        const posEst = [
            -110.7395240072906,
            32.32625842258334,
            1500
        ];

        var renderPos = [0, 0, 0];

        externalRenderers.toRenderCoordinates(view, posEst, 0, SpatialReference.WGS84, renderPos, 0, 1);

        self.route.position.set(renderPos[0], renderPos[1], renderPos[2]);

        var transform = new THREE.Matrix4();
        transform.fromArray(externalRenderers.renderCoordinateTransformAt(view, posEst, SpatialReference.WGS84, new Array(16)));
        transform.decompose(self.route.position, self.route.quaternion, self.route.scale);
    }

    onRequestAnimationFrame (time) {
        //nothing to animate route
        // wrote you code that update object on requestAnimationFrame
        // because it will be much smooth that in render callback
    }

    onSwipe (isLeft, event) {

    }

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

        this.renderer.state.setBlending( THREE.NoBlending ); // 0.97 fix !

        this.renderer.render(this.scene, this.camera);

        externalRenderers.requestRender(view);

        // cleanup
        context.resetWebGLState();
    }

    start() {
        this.scene.add(this.route);
        this.scene.add(new THREE.AmbientLight(0xeeeeee));
    }
}
