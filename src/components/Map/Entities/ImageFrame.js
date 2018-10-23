//
//
//

import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';

import Image3D from './Image3D';

export default class ImageFrame extends THREE.Group {

  constructor ( config , trackcurve) { // url, position

    super();

    this.config = config;
    this.trackcurve = trackcurve;

    //test
    let texture;

    if (this.config.url)
    {

      let textureLoader = new THREE.TextureLoader(new THREE.LoadingManager());
      texture = textureLoader.load( this.config.url, function() {
        console.log("loaded");
      })
    }

    this.width = 750;
    this.height = 750;

    let framegeometry = new THREE.BoxGeometry(this.width, this.height, 12, 1, 1, 1);
    let photogeometry = new THREE.BoxGeometry(this.width - 150, this.height - 150, 13, 1, 1, 1);

    var framematerial = [
      new THREE.MeshBasicMaterial({  color: 0xffffff, transparent:true, opacity: 0.8, side: THREE.FrontSide,  depthTest: true, depthWrite: true }),
      new THREE.MeshBasicMaterial({ color: 0xffffff, transparent:true,  opacity: 0.8, side: THREE.FrontSide,  depthTest: true, depthWrite: true }),
      new THREE.MeshBasicMaterial({ color: 0xffffff, transparent:true,  opacity: 0.8, side: THREE.FrontSide,  depthTest: true, depthWrite: true }),
      new THREE.MeshBasicMaterial({ color: 0xffffff, transparent:true,  opacity: 0.8, side: THREE.FrontSide,  depthTest: true, depthWrite: true }),
      new THREE.MeshBasicMaterial({ color: 0xffffff, transparent:true,  opacity: 0.7, side: THREE.FrontSide,  depthTest: true, depthWrite: true }),
      new THREE.MeshBasicMaterial({ color: 0xffffff, transparent:true,  opacity: 0.7, side: THREE.FrontSide,  depthTest: true, depthWrite: true }),
    ];

    var photomaterial = new THREE.MeshBasicMaterial( {color: 0xffffff,
      map : texture,
      transparent : true,
      opacity : 0.9,
      depthTest: true,
      depthWrite: true,} );

    var cubeA = new THREE.Mesh( framegeometry, framematerial );
    //cubeA.position.set( 100, 100, 0 );

    var cubeB = new THREE.Mesh( photogeometry, photomaterial );
    cubeB.position.set( 0, 0, 0 );

    //this.geometry = geometry;
    //this.material = material;

    this.action_data = {
      mouseover : {},
      mousedown : {},
      mouseup : {}
    };

    this.add(cubeA);
    this.add(cubeB);
  }

  mouseover( event ) {

    //this.material.color = new THREE.Color(0x0000ff);
    //this.material.needsUpdate = true;

    return true;
  }

  mouseout( event ) {

    //this.material.color = new THREE.Color(0xffffff);
    //this.material.needsUpdate = true;

    return true;
  }

  mouseup(event) {

    var camera = event.camera;

    Image3D.zoomToCamera(this, camera);

    return true;
  }
}
