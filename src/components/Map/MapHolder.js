import React, {Component} from 'react';
import esriLoader from 'esri-loader';


import * as THREE from 'three';
import TWEEN from '@tweenjs/tween.js';

import styles from './MapHolder.less';

import ImageRenderer from "./Renderers/ImageRenderer";
import RouteRenderer from "./Renderers/RouteRenderer";
import CameraTrackRenderer from './Renderers/CameraTrackRenderer';

const options = {
    url: 'https://js.arcgis.com/4.9'
};

export default class MapHolder extends Component {

    constructor() {

        super();

        this.animate = this.animate.bind(this);

        this.externalRenderersContainer = [];
    }

    esriLoad() {

        var self = this;

        esriLoader.loadModules([
            "esri/core/declare",
            "esri/WebMap",
            "esri/views/SceneView",
            "esri/layers/GraphicsLayer",
            "esri/views/3d/externalRenderers",
            "esri/geometry/SpatialReference",
            "esri/geometry/geometryEngine",
            "esri/Graphic"
        ], options)
            .then(
                ([
                     declare,
                     WebMap,
                     SceneView,
                     GraphicsLayer,
                     externalRenderers,
                     SpatialReference,
                     geometryEngine,
                     Graphic
                 ]) => {

                    const map = new WebMap({
                        basemap: "satellite",
                        ground: "world-elevation",
                        // hybrid
                    });


                    var graphicsLayer = new GraphicsLayer();
                    map.add(graphicsLayer);

                    var initCam = { // autocasts as new Camera()

                        "position": {
                            "spatialReference": {"latestWkid": 3857, "wkid": 102100},
                            "x": -12326625.642966498,
                            "y": 3790704.6709845047,
                            "z": 6620.639594970271
                        }, "heading": 9.192543279901852, "tilt": 72.23390968888746
                    }

                    const view = new SceneView({
                        map: map,
                        container: "viewDiv",
                        camera: initCam,
                        zoom: 13
                    });



                    self.esriLoaderContext = {

                        declare,
                        WebMap,
                        SceneView,
                        GraphicsLayer,
                        SpatialReference,
                        externalRenderers,
                        geometryEngine,
                        Graphic,
                    };

                    const { images } = this.props;

                    var curve = new THREE.CatmullRomCurve3( [
                        new THREE.Vector3( 50, -4590, 3900 ),
                        new THREE.Vector3( 550, -4540, 3901 ),
                        new THREE.Vector3( 1550, -4540, 3901 ),
                        new THREE.Vector3( 3550, -5540, 3901 ),
                        new THREE.Vector3( 6550, 1540, 3901 )
                    ] );

                    const routeRenderer = new RouteRenderer(self.esriLoaderContext);
                    const imageRenderer = new ImageRenderer(self.esriLoaderContext, images, curve);
                    const cameraTrackRenderer = new CameraTrackRenderer(self.esriLoaderContext, images, curve);

                    this.externalRenderersContainer.push(routeRenderer);
                    this.externalRenderersContainer.push(imageRenderer);
                    this.externalRenderersContainer.push(cameraTrackRenderer);

                    externalRenderers.add(view, routeRenderer);
                    externalRenderers.add(view, imageRenderer);
                    externalRenderers.add(view, cameraTrackRenderer);

                    function getMouse(event) {

                        var canvas = view.canvas;

                        if (!canvas)
                            return;

                        let rect = canvas.getBoundingClientRect();

                        let clientX = event.clientX - rect.left;
                        let clientY = event.clientY - rect.top;

                        if (clientX < 0 || event.clientX > (canvas.clientWidth + rect.left))
                            return;
                        if (clientY < 0 || event.clientY > (canvas.clientHeight + rect.top))
                            return;

                        let mouse = new THREE.Vector2();
                        mouse.x = (clientX / canvas.clientWidth) * 2 - 1;
                        mouse.y = -(clientY / canvas.clientHeight) * 2 + 1;

                        return mouse;
                    }

                    window.addEventListener(
                        'mousemove',
                        function (event) {

                            let mouse = getMouse(event);

                            if (!mouse)
                                return;

                            for (let i = 0; i < self.externalRenderersContainer.length; i++) {
                                self.externalRenderersContainer[i].onMouseMove(mouse, event);
                            }
                        }
                    );

                    window.addEventListener(
                        'mousedown',
                        function (event) {

                            let mouse = getMouse(event);

                            if (!mouse)
                                return;

                            for (let i = 0; i < self.externalRenderersContainer.length; i++) {
                                self.externalRenderersContainer[i].onMouseDown(mouse, event);
                            }
                        }
                    );

                    window.addEventListener(
                        'mouseup',
                        function (event) {

                            let mouse = getMouse(event);

                            if (!mouse)
                                return;

                            for (let i = 0; i < self.externalRenderersContainer.length; i++) {
                                self.externalRenderersContainer[i].onMouseUp(mouse, event);
                            }
                        }
                    );

                })
            .catch(err => {
                console.error(err);
            });

    }

    componentDidMount() {

        this.esriLoad();

        window.requestAnimationFrame(this.animate);
    }

    animate(time) {

        window.requestAnimationFrame(this.animate);

        for (let i = 0; i < this.externalRenderersContainer.length; i++) {
            this.externalRenderersContainer[i].onRequestAnimationFrame && this.externalRenderersContainer[i].onRequestAnimationFrame(time);
        }

        TWEEN.update(time);
    }

    render() {

        return (
           <div id="viewDiv" className={styles.mapView}></div>
        );
    }
}


