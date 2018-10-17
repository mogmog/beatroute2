//
//
//

import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';

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

    let framegeometry = new THREE.BoxGeometry(750, 750, 12, 1, 1, 1);
    let photogeometry = new THREE.BoxGeometry(600, 600, 13, 1, 1, 1);

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

  mouseover( camera ) {

    //this.material.color = new THREE.Color(0x0000ff);
    //this.material.needsUpdate = true;
  }

  mouseout( camera ) {

    //this.material.color = new THREE.Color(0xffffff);
    //this.material.needsUpdate = true;
  }

  zoomToCamera ( camera ) {

    var action_timeout = 300;

    var self = this;

    var action_data = this.action_data;

    if (action_data.mouseup.action)
      return;

    if (!action_data.mouseup.state)
    {
      action_data.mouseup.state = {

        isFitToCamera : true
      };
    }
    else if (action_data.mouseup.state.isFitToCamera) //
    {
      action_data.mouseup.state.isFitToCamera = false;
    }
    else if (!action_data.mouseup.state.isFitToCamera) //
    {
      action_data.mouseup.state.isFitToCamera = true;
    }

    var fitObjectToCamera = function ( camera, object, parameters ) {

      function visibleBox(camera, z) {
        var t = Math.tan( THREE.Math.degToRad( camera.fov ) / 2 )
        var h = t * 2 * z;
        var w = h * camera.aspect;
        return new THREE.Box2(new THREE.Vector2(-w, h), new THREE.Vector2(w, -h));
      }

      let boundingBox = new THREE.Box3().setFromObject( object );

      var boundingSphere = new THREE.Sphere();

      boundingBox.getBoundingSphere(boundingSphere);

      let center = boundingSphere.center;

      let radius = boundingSphere.radius;

      let dist = 1.0;

      let box = visibleBox( camera, radius / 2);

      var f = radius * box.min.y / 2;

      let vector = new THREE.Vector3();
      camera.getWorldDirection( vector );
      vector.multiplyScalar( f );
      vector.add(camera.position);

      var tmp_obj = new THREE.Object3D(); // simplest way to get rotation
      tmp_obj.position.set(vector.x, vector.y, vector.z);
      tmp_obj.up.set(camera.up.x, camera.up.y, camera.up.z);
      tmp_obj.lookAt(camera.position);

      parameters.position = tmp_obj.position;
      parameters.up = tmp_obj.up;
      parameters.rotation = tmp_obj.rotation;
    };

    var parameters = {};
    fitObjectToCamera( camera, self, parameters );

    var to = {
      pos_x : parameters.position.x,
      pos_y : parameters.position.y,
      pos_z : parameters.position.z,
      up_x : parameters.up.x,
      up_y : parameters.up.y,
      up_z : parameters.up.z,
      rot_x : parameters.rotation.x,
      rot_y : parameters.rotation.y,
      rot_z : parameters.rotation.z
    };

    if (action_data.mouseup.state.isFitToCamera) //
    {
      action_data.mouseup.state.originalPosition = //
        {
          pos_x : self.position.x,
          pos_y : self.position.y,
          pos_z : self.position.z,
          up_x : self.up.x,
          up_y : self.up.y,
          up_z : self.up.z,
          rot_x : self.rotation.x,
          rot_y : self.rotation.y,
          rot_z : self.rotation.z
        };
    }
    else
      to = action_data.mouseup.state.originalPosition;

    action_data.mouseup.action = new TWEEN.Tween(
      {
        pos_x : self.position.x,
        pos_y : self.position.y,
        pos_z : self.position.z,
        up_x : self.up.x,
        up_y : self.up.y,
        up_z : self.up.z,
        rot_x : self.rotation.x,
        rot_y : self.rotation.y,
        rot_z : self.rotation.z
      })
      .to( to, action_timeout)
      .onUpdate( function(obj) {

        var tween_object = {
          position : {
            x : obj.pos_x,
            y : obj.pos_y,
            z : obj.pos_z
          },
          up : {
            x : obj.up_x,
            y : obj.up_y,
            z : obj.up_z
          },
          rotation : new THREE.Vector3(
            obj.rot_x,
            obj.rot_y,
            obj.rot_z
          )
        };

        self.position.set(tween_object.position.x, tween_object.position.y, tween_object.position.z);
        self.up.set(tween_object.up.x, tween_object.up.y, tween_object.up.z);
        self.rotation.set(tween_object.rotation.x, tween_object.rotation.y, tween_object.rotation.z);
      })
      .onComplete(function(){

        delete  action_data.mouseup.action;
      })
      .start();
  }

  mouseup(camera) {
    this.zoomToCamera(camera);
  }
}