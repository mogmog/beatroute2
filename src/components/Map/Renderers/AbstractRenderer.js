//
//
//

import * as THREE from 'three';

function AbstractRenderer () {

  this.camera = new THREE.PerspectiveCamera();
  this.scene = new THREE.Scene();
}

AbstractRenderer.prototype.setup = function(){throw "AbstractRenderer.prototype.setup"};

AbstractRenderer.prototype.onRequestAnimationFrame = function(time){throw "AbstractRenderer.prototype.onRequestAnimationFrame"};

AbstractRenderer.prototype.start = function(){throw "AbstractRenderer.prototype.start"};

AbstractRenderer.prototype.render = function(){throw "AbstractRenderer.prototype.render"};

AbstractRenderer.prototype.onSwipe = function(isLeft, event) {
  throw "AbstractRenderer.prototype.onSwipe"
}

AbstractRenderer.prototype.onMouseMove = function(mouse, event){

  var camera = this.camera;

  if (!camera)
    return;

  var raycaster = new THREE.Raycaster();

  raycaster.setFromCamera( mouse, camera );

  var intersects = raycaster.intersectObjects( this.scene.children || [] , true );

  if ( intersects.length > 0 ) {

    let object = intersects[0].object;

    if (this.onMouseMove.current !== object) //
    {
      if (this.onMouseMove.current &&
        this.onMouseMove.current.mouseout) //
      {
        this.onMouseMove.current.mouseout(camera);
      }

      if ( object.mouseover ) //
      {
        object.mouseover(camera);
      }

      this.onMouseMove.current = object
    }
  }
  else {

    if (this.onMouseMove.current &&
      this.onMouseMove.current.mouseout) //
    {
      this.onMouseMove.current.mouseout(camera);
    }

    this.onMouseMove.current = null;
  }
};

AbstractRenderer.prototype.onMouseDown = function(mouse, event){

  var camera = this.camera;

  if (!camera)
    return;

  if (event.which === 1)
  {
    var raycaster = new THREE.Raycaster();

    raycaster.setFromCamera( mouse, camera );

    var intersects = raycaster.intersectObjects( this.scene.children, true );

    if ( intersects.length > 0 ) {

      let object = intersects[0].object;

      if ( object.mousedown )
      {
        object.mousedown(camera);
      }
    }
  }
};

AbstractRenderer.prototype.onMouseUp = function(mouse, event){

  var camera = this.camera;

  if (!camera)
    return;

  if (event.which === 1)
  {
    var raycaster = new THREE.Raycaster();

    raycaster.setFromCamera( mouse, camera );

    var intersects = raycaster.intersectObjects( this.scene.children, true );

    if ( intersects.length > 0 ) {

      let object = intersects[0].object;

      if ( object.mouseup )
      {
        object.mouseup(camera);
      }
    }
  }
};

export default AbstractRenderer;
