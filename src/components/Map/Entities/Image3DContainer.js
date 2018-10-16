//
//
//

import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';

export default class Image3DContainer extends THREE.Group {
  constructor(trackcurve) {
    // url, position

    super();

    var add_base = this.add.bind(this);

    var self = this;

    self.add = function(object) {
      add_base(object);

      if (object.mouseover) {
        var mouseover_base = object.mouseover.bind(object);

        object.mouseover = function(camera) {
          if (!self.mouseover) mouseover_base(camera);
          else if (!self.mouseover(camera, object)) mouseover_base(camera);
        };
      }

      if (object.mouseout) {
        var mouseout_base = object.mouseout.bind(object);

        object.mouseout = function(camera) {
          if (!self.mouseout) mouseout_base(camera);
          else if (self.mouseout && !self.mouseout(camera, object)) mouseout_base(camera);
        };
      }

      if (object.mousedown) {
        var mousedown_base = object.mousedown.bind(object);

        object.mousedown = function(camera) {
          if (!self.mousedown) mousedown_base(camera);
          else if (self.mousedown && !self.mousedown(camera, object)) mousedown_base(camera);
        };
      }

      if (object.mouseup) {
        var mouseup_base = object.mouseup.bind(object);

        object.mouseup = function(camera) {
          if (!self.mouseup) mouseup_base(camera);
          else if (self.mouseup && !self.mouseup(camera, object)) mouseup_base(camera);
        };
      }
    };

    self.trackcurve = trackcurve;
  }

  mouseover(camera, picked_object) {}

  mouseout(camera, picked_object) {}

  mouseup(camera, picked_object) {
    let count = this.children.length;

    if (!this.trackcurve) return false;

    var step = 1.0 / count,
      j = 0;

    for (
      let i = 0;
      i < count;
      i++ //
    ) {
      let object = this.children[i];

      move_objects_to_path(object, this.trackcurve.getPointAt(j));

      j += step;
    }

    function move_objects_to_path(in_object, point) {
      var action_timeout = 400;

      var object = in_object;

      if (!object.action_data)
        object.action_data = {
          mouseover: {},
          mousedown: {},
          mouseup: {},
        };

      var action_data = object.action_data;

      if (action_data.mouseup.action) return;

      if (!action_data.mouseup.state) {
        action_data.mouseup.state = {
          isMovedToPath: true,
        };
      } else if (action_data.mouseup.state.isMovedToPath) {
        //
        action_data.mouseup.state.isMovedToPath = false;
      } else if (!action_data.mouseup.state.isMovedToPath) {
        //
        action_data.mouseup.state.isMovedToPath = true;
      }

      var to = {
        pos_x: point.x,
        pos_y: point.y,
        pos_z: point.z,
        /*up_x : parameters.up.x,
                up_y : parameters.up.y,
                up_z : parameters.up.z,
                rot_x : parameters.rotation.x,
                rot_y : parameters.rotation.y,
                rot_z : parameters.rotation.z*/
      };

      if (action_data.mouseup.state.isMovedToPath) {
        //
        action_data.mouseup.state.originalPosition =
          //
          {
            pos_x: object.position.x,
            pos_y: object.position.y,
            pos_z: object.position.z,
            /*up_x : object.up.x,
                    up_y : object.up.y,
                    up_z : object.up.z,
                    rot_x : object.rotation.x,
                    rot_y : object.rotation.y,
                    rot_z : object.rotation.z*/
          };
      } else to = action_data.mouseup.state.originalPosition;

      action_data.mouseup.action = new TWEEN.Tween({
        pos_x: object.position.x,
        pos_y: object.position.y,
        pos_z: object.position.z,
        /*up_x : object.up.x,
                up_y : object.up.y,
                up_z : object.up.z,
                rot_x : object.rotation.x,
                rot_y : object.rotation.y,
                rot_z : object.rotation.z*/
      })
        .to(to, action_timeout)
        .onUpdate(function(obj) {
          var tween_object = {
            position: {
              x: obj.pos_x,
              y: obj.pos_y,
              z: obj.pos_z,
            },
            /*up : {
                        x : obj.up_x,
                        y : obj.up_y,
                        z : obj.up_z
                    },
                    rotation : new THREE.Vector3(
                        obj.rot_x,
                        obj.rot_y,
                        obj.rot_z
                    )*/
          };

          object.position.set(
            tween_object.position.x,
            tween_object.position.y,
            tween_object.position.z
          );
          //object.up.set(tween_object.up.x, tween_object.up.y, tween_object.up.z);
          //object.rotation.set(tween_object.rotation.x, tween_object.rotation.y, tween_object.rotation.z);
        })
        .easing(TWEEN.Easing.Quadratic.Out)
        .onComplete(function() {
          delete action_data.mouseup.action;
        })
        .start();
    }

    return true;
  }
}
