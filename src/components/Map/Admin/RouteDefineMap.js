import React, { Component } from 'react';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'
import ReactMapboxGl from 'react-mapbox-gl';

import MapboxDraw from '@mapbox/mapbox-gl-draw';

const Map = ReactMapboxGl({
  accessToken: "pk.eyJ1IjoibW9nbW9nIiwiYSI6ImNpZmI2eTZuZTAwNjJ0Y2x4a2g4cDIzZTcifQ.qlITXIamvfVj-NCTtAGylw"
});

const Draw = new MapboxDraw({
  displayControlsDefault: false,
  controls: {
    line_string: true,
    trash: true
  }
});

export default class RouteDefineMap extends Component {
  constructor() {
    super();
  }

  render() {


    return (
      <Map
        style="mapbox://styles/mapbox/outdoors-v9"
        containerStyle={{
          height: "300px",
          width: "100%",
          position: 'absolute',
        }}

        onStyleLoad={(map) => {

          const updateArea = (e)=> {
            const data = Draw.getAll();
            console.log(data);
          }

          this.map = map;
          map.addControl(Draw, 'top-left');
          map.on('draw.create', updateArea);
          map.on('draw.update', updateArea);
        }}
      />
    );
  }
}
