import React, { Component } from 'react';
import esriLoader from 'esri-loader';

import * as THREE from 'three';
import TWEEN from '@tweenjs/tween.js';

import styles from './LocationDefineMap.less';

const options = {
  url: 'https://js.arcgis.com/4.9',
};

export default class LocationDefineMap extends Component {
  constructor() {
    super();
  }

  esriLoad() {
    var self = this;

    esriLoader
      .loadModules(
        [
          "esri/Map",
          "esri/views/MapView"
        ],
        options
      )
      .then(
        ([
           Map, MapView
         ]) => {


          var map = new Map({
            basemap: "topo"
          });

          var view = new MapView({
            container: "locationDefine",
            map: map,
            zoom: 4,
            center: [15, 65] // longitude, latitude
          });
        }
      )
      .catch(err => {
        console.error(err);
      });
  }

  componentDidMount() {
    this.esriLoad();
  }

  render() {
    return <div id="locationDefine" className={styles.mapView} />;
  }
}
