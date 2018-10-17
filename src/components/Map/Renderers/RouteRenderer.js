//
//
//

import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';
import * as turf from '@turf/turf';

import AbstractRenderer from './AbstractRenderer';

export default class RouteRenderer extends AbstractRenderer {
  constructor(esriLoaderContext) {
    super();

    this.esriLoaderContext = esriLoaderContext;

    this.renderer = null; // three.js renderer
    this.camera = null; // three.js camera
    this.scene = null; // three.js scene
    this.vertexIdx = 0;
    this.ambient = null; // three.js ambient light source

    this.geo_curve_path = [
      [121.6330941952765, 25.06334876641631, 19.799999237060547],
      [121.63292722776532, 25.06322412751615, 19],
      [121.63276956416667, 25.063085993751884, 19.799999237060547],
      [121.63261651061475, 25.062967473641038, 21.600000381469727],
      [121.63244836963713, 25.062837218865752, 21.799999237060547],
      [121.63230814039707, 25.06270512007177, 24.399999618530273],
      [121.63216346874833, 25.062573524191976, 23.600000381469727],
      [121.63202122785151, 25.062446538358927, 23.399999618530273],
      [121.63186809048057, 25.0623011123389, 25],
      [121.63173724897206, 25.0621578656137, 25.600000381469727],
      [121.63159877993166, 25.06202258169651, 25.200000762939453],
      [121.63145410828292, 25.061879167333245, 27.399999618530273],
      [121.63132854737341, 25.061717564240098, 29.399999618530273],
      [121.63120281882584, 25.061573646962643, 29.200000762939453],
      [121.63106937892735, 25.061426712200046, 28.200000762939453],
      [121.63093627430499, 25.061274329200387, 26],
      [121.63082580082119, 25.06111959926784, 24.399999618530273],
      [121.63071834482253, 25.060943327844143, 23.799999237060547],
      [121.63059387356043, 25.060796476900578, 24.399999618530273],
      [121.63046043366194, 25.06065339781344, 23.600000381469727],
      [121.63034199737012, 25.060491459444165, 22.799999237060547],
      [121.63024216890335, 25.06032709032297, 22.200000762939453],
      [121.63015013560653, 25.06014972925186, 21.600000381469727],
      [121.63006388582289, 25.05998007953167, 21.399999618530273],
      [121.62997679784894, 25.05979785695672, 21.200000762939453],
      [121.62990052253008, 25.05961957387626, 21.399999618530273],
      [121.6298255044967, 25.059450678527355, 22],
      [121.62973623722792, 25.05926921032369, 19.799999237060547],
      [121.62966281175613, 25.059095453470945, 19.799999237060547],
      [121.62957170046866, 25.058910213410854, 19.799999237060547],
      [121.6294795833528, 25.058736205101013, 19.600000381469727],
      [121.629390232265, 25.058566890656948, 20.200000762939453],
      [121.6293054074049, 25.05839992314577, 19.200000762939453],
      [121.62923659197986, 25.05822985433042, 17.600000381469727],
      [121.62918915040791, 25.058032711967826, 17.600000381469727],
      [121.62912963889539, 25.057844538241625, 16.600000381469727],
      [121.62907456979156, 25.05765133537352, 15.199999809265137],
      [121.62902109324932, 25.057461988180876, 14.600000381469727],
      [121.62897122092545, 25.057280100882053, 13.600000381469727],
      [121.62892470136285, 25.05709963850677, 12.399999618530273],
      [121.62887600250542, 25.056903921067715, 16],
      [121.62880836054683, 25.056726140901446, 17.399999618530273],
      [121.62873937748373, 25.056537799537182, 17.600000381469727],
      [121.62869034335017, 25.056349458172917, 21.799999237060547],
      [121.6286299098283, 25.056188190355897, 25.799999237060547],
      [121.62862664088607, 25.056180395185947, 25.799999237060547],
      [121.62861440330744, 25.05612432025373, 35.400001525878906],
      [121.62853142246604, 25.056030275300145, 35.79999923706055],
      [121.62849085405469, 25.055957939475775, 35.599998474121094],
      [121.62838758900762, 25.055796671658754, 38.20000076293945],
      [121.62827912718058, 25.05563087761402, 40.20000076293945],
      [121.62826638668776, 25.055610593408346, 40.400001525878906],
      [121.62813453935087, 25.05547011271119, 40],
      [121.62799707613885, 25.05533767864108, 41.20000076293945],
      [121.62781619466841, 25.05523357540369, 40.20000076293945],
      [121.6276237461716, 25.055144811049104, 38.79999923706055],
      [121.62741771899164, 25.055079935118556, 38],
      [121.62720968015492, 25.055059734731913, 33.79999923706055],
      [121.62715938873589, 25.05507532507181, 32.20000076293945],
      [121.627043383196, 25.055096363648772, 30],
      [121.62687281146646, 25.055104745551944, 30.600000381469727],
      [121.61177122280002, 25.055074654519558, 200.799999237060547],
    ];
  }

  /**
   * Setup function, called once
   */
  setup(context) {
    function addProgressFunctionToRouteToMesh(mesh, extrudePath) {
      function setClipPlanes(planes, materials) {
        function setMaterial(material) {
          material.clippingPlanes = planes;
          material.clipShadows = planes ? true : false;
          material.needsUpdate = true;
        }

        if (Array.isArray(materials)) {
          for (var i = 0; i < materials.length; i++) {
            let material = materials[i];
            setMaterial(material);
          }
        } else {
          let material = materials;
          setMaterial(material);
        }
      }

      var clipplane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);

      mesh.setProgress = function(persentage) {
        if (persentage >= 1.0 || persentage < 0.0) {
          setClipPlanes([], mesh.material);

          mesh.setProgress.bPlanesSet - false;

          return;
        } else if (!mesh.setProgress.bPlanesSet) {
          setClipPlanes([clipplane], mesh.material);

          mesh.setProgress.bPlanesSet = true;
        }

        var point = extrudePath.getPointAt(persentage);

        persentage = persentage + persentage * 0.001;

        if (persentage >= 1.0) persentage = 1.0;

        var normal = extrudePath
          .getPointAt(persentage)
          .sub(point)
          .normalize()
          .negate();

        clipplane.setFromNormalAndCoplanarPoint(normal, point);
      };

      mesh.setProgress(1.0);
    }

    var self = this;

    var externalRenderers = this.esriLoaderContext.externalRenderers;
    var SpatialReference = this.esriLoaderContext.SpatialReference;

    var view = context.view; //this.esriLoaderContext.view;

    const pts = [];

    //lat longs
    const curve_path = [];
    const simplificationTolerance = 0.0001;

    let geojson = turf.lineString(this.geo_curve_path);
    let options = { tolerance: simplificationTolerance, highQuality: true };
    let simplified = turf.simplify(geojson, options);

    simplified.geometry.coordinates.forEach(x => {
      let pos = [0, 0, 0];
      externalRenderers.toRenderCoordinates(view, x, 0, SpatialReference.WGS84, pos, 0, 1);
      curve_path.push(new THREE.Vector3(pos[0], pos[1], pos[2])); // we make all coords in global world coord sys !
    });

    const curve = new THREE.CatmullRomCurve3(curve_path);

    var extrudeSettings = {
      steps: 30,
      bevelEnabled: false,
      extrudePath: curve,
    };

    const squareShape = new THREE.Shape();
    squareShape.moveTo(0, 0);
    squareShape.lineTo(0, 20);
    squareShape.lineTo(4, 20);
    squareShape.lineTo(4, 0);
    squareShape.lineTo(0, 0);

    const geometry = new THREE.ExtrudeBufferGeometry(squareShape, extrudeSettings);

    var material = new THREE.MeshPhongMaterial({
      side: THREE.FrontSide,
      transparent: true,
      opacity: 0.1,
      color: 0xffdb58,
    });

    this.route = new THREE.Mesh(geometry, material);

    var geometryAnim = new THREE.ExtrudeBufferGeometry(squareShape, extrudeSettings); // new THREE.TubeGeometry( path, pathSegments, tubeRadius, radiusSegments, closed );

    // material
    var materialAnim = new THREE.MeshPhongMaterial({
      color: 0xffdb58,
      side: THREE.FrontSide,
      transparent: true,
      opacity: 0.6,
    });

    // mesh
    this.mesh = new THREE.Mesh(geometryAnim, materialAnim);

    addProgressFunctionToRouteToMesh(this.mesh, extrudeSettings.extrudePath);

    this.currentStep = 0.0;

    this.mesh.setProgress(this.currentStep);

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

    this.renderer.localClippingEnabled = true; // need fo clipping plane usage

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
  }

  onRequestAnimationFrame(time) {
    if (this.mesh) {
      this.currentStep += 0.001;

      //if (this.currentStep > 1.0) this.currentStep = 0.0;

      this.mesh.setProgress(this.currentStep);
    }
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
    this.scene.add(this.mesh);
    this.scene.add(new THREE.AmbientLight(0xeeeeee));
  }
}
