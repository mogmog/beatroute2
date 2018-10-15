import React, { Component } from 'react';
import esriLoader from 'esri-loader';

import * as THREE from 'three';
import TWEEN from '@tweenjs/tween.js';

import styles from './MapHolder.less';

import ImageRenderer from './Renderers/ImageRenderer';
import RouteRenderer from './Renderers/RouteRenderer';
import CameraTrackRenderer from './Renderers/CameraTrackRenderer';
import CameraTrackRenderer2 from './Renderers/CameraTrackRenderer2';

const options = {
  url: 'https://js.arcgis.com/4.9',
};

export default class MapHolder extends Component {
  constructor() {
    super();

    this.animate = this.animate.bind(this);

    this.esriLoaderContext = null;

    this.externalRenderersContainer = [];
  }

  esriLoad() {
    var self = this;

    esriLoader
      .loadModules(
        [
          'esri/core/declare',
          'esri/request',
          'esri/WebMap',
          'esri/views/SceneView',
          'esri/layers/BaseTileLayer',
          'esri/layers/GraphicsLayer',
          'esri/geometry/Extent',
          'esri/views/3d/externalRenderers',
          'esri/geometry/SpatialReference',
          'esri/geometry/geometryEngine',
          'esri/Graphic',
        ],
        options
      )
      .then(
        ([
           declare,
           esriRequest,
           WebMap,
           SceneView,
           BaseTileLayer,
           GraphicsLayer,
           Extent,
           externalRenderers,
           SpatialReference,
           geometryEngine,
           Graphic,
         ]) => {
          // redefine base method
          var externalRenderers_base_add = externalRenderers.add.bind(externalRenderers);
          externalRenderers.add = function(view, renderer) {
            externalRenderers_base_add(view, renderer);
            self.externalRenderersContainer.push(renderer);
          };

          const GreyLayer = BaseTileLayer.createSubclass({
            properties: {
              urlTemplate: null,
            },

            // generate the tile url for a given level, row and column
            getTileUrl: function(level, row, col) {
              return this.urlTemplate
                .replace('{z}', level)
                .replace('{x}', col)
                .replace('{y}', row);
            },

            // This method fetches tiles for the specified level and size.
            // Override this method to process the data returned from the server.
            fetchTile: function(level, row, col) {
              // call getTileUrl() method to construct the URL to tiles
              // for a given level, row and col provided by the LayerView
              var url = this.getTileUrl(level, row, col);

              // request for tiles based on the generated url
              return esriRequest(url, {
                responseType: 'image',
              }).then(
                function(response) {
                  // when esri request resolves successfully
                  // get the image from the response
                  var image = response.data;
                  var width = this.tileInfo.size[0];
                  var height = this.tileInfo.size[0];

                  // create a canvas with 2D rendering context
                  var canvas = document.createElement('canvas');
                  var context = canvas.getContext('2d');
                  canvas.width = width;
                  canvas.height = height;

                  context.fillStyle = 'rgba(255, 255, 255, 1)';
                  //context.fillStyle = 'white';
                  //context.globalAlpha = 0.5;
                  context.fillRect(0, 0, width, height);
                  context.globalCompositeOperation = 'luminosity';
                  context.drawImage(image, 0, 0, width, height);

                  return canvas;
                }.bind(this)
              );
            },
          });

          // Create a new instance of the TintLayer and set its properties
          const greyTileLayer = new GreyLayer({
            urlTemplate:
              'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
            title: 'Black and White',
          });

          const map = new WebMap({
            basemap: 'satellite',
            ground: 'world-elevation',
            layers: [greyTileLayer],
          });

          var graphicsLayer = new GraphicsLayer();
          map.add(graphicsLayer);

          var initCam = {
            // autocasts as new Camera()

            position: {
              spatialReference: { latestWkid: 3857, wkid: 102100 },
              x: -12326625.642966498,
              y: 3790704.6709845047,
              z: 6620.639594970271,
            },
            heading: 9.192543279901852,
            tilt: 72.23390968888746,
          };

          const view = new SceneView({
            map: map,
            container: 'viewDiv',
            camera: initCam,
            constraints: {
              minZoom: 5,
              maxZoom: 19,
              snapToZoom: true,
            },
            viewingMode: 'local',
            zoom: 13,
            alphaCompositingEnabled: true,
            environment: {
              lighting: { date: new Date('1 January 2019 18:00') },
              background: {
                type: 'color', // autocasts as new ColorBackground()
                // set the color alpha to 0 for full transparency
                color: [0, 177, 244, 0.2],
              },
              // disable stars
              starsEnabled: false,
              //disable atmosphere
              atmosphereEnabled: false,
            },
          });

          // Set the extent on the view

          // view.on("drag", function(event){
          //   // prevents panning with the mouse drag event
          //   event.stopPropagation();
          // });

          self.esriLoaderContext = {
            declare,
            WebMap,
            SceneView,
            GraphicsLayer,
            SpatialReference,
            externalRenderers,
            geometryEngine,
            Graphic,
            view,
          };

          const { images } = self.props;

          //console.log("Tuesdays Idea");
          //for tues
          //if this was fed with Vectors based from lat longs....then wouldnt they be the mega big numbers I want?
          //ie use     externalRenderers.toRenderCoordinates(view, posEst, 0, SpatialReference.WGS84, renderPos, 0, 1);

          /*const curveGeo = [
             [-110.7322940072906, 32.33647342258334, 2500],
             [-110.7333440072906, 32.33611142258334, 2500],
             [-110.7395240072906, 32.33695242258334, 2500],
             [-110.7317340072906, 32.33646642258334, 2500],
             [-110.7344640072906, 32.33616642258334, 2500],
             [-110.7318340072906, 32.33625842258334, 2500]
          ];*/

          const curve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(50, -4590, 3900),
            new THREE.Vector3(550, -4540, 3901),
            new THREE.Vector3(1550, -4540, 3901),
            new THREE.Vector3(3550, -5540, 3901),
            new THREE.Vector3(6550, 1540, 3901),
          ]);

          const routeRenderer = new RouteRenderer(self.esriLoaderContext);
          //const imageRenderer = new ImageRenderer(self.esriLoaderContext, images, curve);


          externalRenderers.add(view, routeRenderer);
          //externalRenderers.add(view, imageRenderer);

          var xDown = null;
          var yDown = null;

          function handleTouchStart(evt) {
            xDown = evt.touches[0].clientX;
            yDown = evt.touches[0].clientY;
          }

          function handleTouchMove(evt) {
            if (!xDown || !yDown) {
              return;
            }

            var xUp = evt.touches[0].clientX;
            var yUp = evt.touches[0].clientY;

            var xDiff = xDown - xUp;
            var yDiff = yDown - yUp;

            if (Math.abs(xDiff) > Math.abs(yDiff)) {
              /*most significant*/
              if (xDiff > 0) {
                for (let i = 0; i < self.externalRenderersContainer.length; i++) {
                  self.externalRenderersContainer[i].onSwipe(true, evt);
                }
              } else {
                for (let i = 0; i < self.externalRenderersContainer.length; i++) {
                  self.externalRenderersContainer[i].onSwipe(false, evt);
                }
              }
            } else {
              if (yDiff > 0) {
                /* up swipe */
              } else {
                /* down swipe */
              }
            }
            /* reset values */
            xDown = null;
            yDown = null;
          }

          function getMouse(event) {
            var canvas = view.canvas;

            if (!canvas) return;

            let rect = canvas.getBoundingClientRect();

            let clientX = event.clientX - rect.left;
            let clientY = event.clientY - rect.top;

            if (clientX < 0 || event.clientX > canvas.clientWidth + rect.left) return;
            if (clientY < 0 || event.clientY > canvas.clientHeight + rect.top) return;

            let mouse = new THREE.Vector2();
            mouse.x = (clientX / canvas.clientWidth) * 2 - 1;
            mouse.y = -(clientY / canvas.clientHeight) * 2 + 1;

            return mouse;
          }

          document.addEventListener('touchstart', handleTouchStart, false);
          document.addEventListener('touchmove', handleTouchMove, false);

          window.addEventListener('mousemove', function(event) {
            let mouse = getMouse(event);

            if (!mouse) return;

            for (let i = 0; i < self.externalRenderersContainer.length; i++) {
              self.externalRenderersContainer[i].onMouseMove(mouse, event);
            }
          });

          window.addEventListener('mousedown', function(event) {
            let mouse = getMouse(event);

            if (!mouse) return;

            for (let i = 0; i < self.externalRenderersContainer.length; i++) {
              self.externalRenderersContainer[i].onMouseDown(mouse, event);
            }
          });

          window.addEventListener('mouseup', function(event) {
            let mouse = getMouse(event);

            if (!mouse) return;

            for (let i = 0; i < self.externalRenderersContainer.length; i++) {
              self.externalRenderersContainer[i].onMouseUp(mouse, event);
            }
          });
        }
      )
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
      this.externalRenderersContainer[i].onRequestAnimationFrame(time);
    }

    TWEEN.update(time);

    // done as ad hoc for renderer update
    // But ! renderer should be updated ONLY at some events - for example -user input, tween, map iploads etc ...
    // ( common practice, used in mapbox )

    // externalRenderers.requestRender(view);

    if (
      this.esriLoaderContext &&
      this.esriLoaderContext.externalRenderers &&
      this.esriLoaderContext.view &&
      this.esriLoaderContext.view._stage
    ) {
      this.esriLoaderContext.externalRenderers.requestRender(this.esriLoaderContext.view);
    }
  }

  render() {
    return <div id="viewDiv" className={styles.mapView} />;
  }
}
