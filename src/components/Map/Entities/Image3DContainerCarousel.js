//
//
//

import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';

import Image3D from "./Image3D";
import Image3DContainer from "./Image3DContainer";

export default class Image3DContainerCarousel extends Image3DContainer 
{
  constructor() {

    super();

    var self = this;

    self.groupImage = new Image3D({
      color : 0x4648A2,
      opacity : 1
    });

    self.add(self.groupImage);

    var sprite = new THREE.Sprite();
    sprite.position.set(140, 180, 0);
    sprite.scale.set(100,100,100);

    var canvas = document.createElement("canvas");
    canvas.style.position = "absolute";
    canvas.width = 64;
    canvas.height = 64;

    sprite.material = new THREE.SpriteMaterial({
        map: new THREE.CanvasTexture(canvas),
        transparent: true,
        depthTest: true,
        depthWrite: true
    });

    self.groupImage.add(sprite);

    function drawNumber(num){

      let ctx = canvas.getContext("2d");

      let x = 32;
      let y = 32;
      let radius = 30;
      let startAngle = 0;
      let endAngle = Math.PI * 2;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "rgb(0, 0, 0)";
      ctx.beginPath();
      ctx.arc(x, y, radius, startAngle, endAngle);
      ctx.fill();

      ctx.strokeStyle = "rgb(255, 255, 255)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(x, y, radius, startAngle, endAngle);
      ctx.stroke();

      ctx.fillStyle = "rgb(255, 255, 255)";
      ctx.font = "32px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText( num, x, y);

      sprite.material.map.needsUpdate = true;
    }

    drawNumber(0);

    function makeGrid()
    {
      let objectCount = self.children.length - 1; // -1, because self.groupImage is not used for calc

      let width = 750; // TODO  - remove static size - 750;

      let pos_x = -width / 2 * objectCount; 

      let step = 2 * width;

      for ( let i = 0; i < self.children.length; i++)
      {
        let object = self.children[i];

        if (self.groupImage === object)
          continue;

        object.position.x = pos_x;

        pos_x += step;
      }
    }

    // now override the base class

    var add_base = this.add.bind(self);

    self.add = function(object) {

      add_base(object);

      object.visible = false;

      let objectCount = self.children.length - 1; // -1, because self.groupImage is not used for calc

      makeGrid();

      drawNumber(objectCount);
    };

    var remove_base = this.remove.bind(self);

    self.remove = function(object) {

      remove_base(object);

      let objectCount = self.children.length - 1;

      makeGrid();

      drawNumber(objectCount);
    };
  }

  mouseover(event) 
  {
    return true;
  }

  mouseout(event) 
  {
    return true;
  }

  mouseup(event) 
  {
    var self = this;

    var camera = event.camera;

    var picked_object = event.path[event.path.length - 2]; // because last - is this object

    if (picked_object == self.groupImage)
    {
      for ( let i = 0; i < self.children.length; i++)
      {
        let object = self.children[i];

        if (self.groupImage === object)
          continue;

        object.visible = true;
      }

      self.groupImage.visible = false;

      Image3D.zoomToCamera(this, camera);
    }
    else
    {

      Image3D.zoomToCamera(this, camera, function(){

          for ( let i = 0; i < self.children.length; i++)
          {
            let object = self.children[i];

            object.visible = false;
          }

          self.groupImage.visible = true;
      });
    }

    // self.groupImage.material.color = new THREE.Color(Math.floor(Math.random() * Math.floor(0xffffff)));

    /*for ( let i = 0; i < this.children.length; i++)
    {
      let object = this.children[i];

      if (picked_object === object)
        continue;

      if (object.action_data && 
          object.action_data.mouseup &&
          object.action_data.mouseup.state &&
          object.action_data.mouseup.state.isFitToCamera) 
      {
        Image3D.zoomToCamera(object, camera);
      }
    }

    Image3D.zoomToCamera(picked_object, camera);
    */

    return true;
  }
}