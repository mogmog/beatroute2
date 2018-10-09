//
//
//

import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';

export default class Image3D extends THREE.Mesh {

    constructor ( config , trackcurve) { // url, position

        super();

        this.config = config;
        this.trackcurve = trackcurve;

        let texture;

        if (this.config.url)
        {

            let textureLoader = new THREE.TextureLoader(new THREE.LoadingManager());
            texture = textureLoader.load( this.config.url );
        }

        let geometry = new THREE.BoxGeometry(800, 1300, 50, 1, 1, 1);

        let material = new THREE.MeshBasicMaterial(
            {
                map: texture,
                color: 0xffffff,
                transparent : true,
                opacity : 1,
                transparent: true,
                depthTest: true,
                depthWrite: true,
                //polygonOffset: true,
                //polygonOffsetFactor: -4,
                wireframe: false,
                //blending : THREE.MultiplyBlending
            }
        );

        this.geometry = geometry;
        this.material = material;

        this.action_data = {
            mouseover : {},
            mousedown : {},
            mouseup : {}
        };
    }

    mouseover( camera ) {

        this.material.color = new THREE.Color(0x0000ff);
        this.material.needsUpdate = true;
    }

    mouseout( camera ) {

        this.material.color = new THREE.Color(0xffffff);
        this.material.needsUpdate = true;
    }

    mouseup ( camera ) {

        //i think first photo should move to this position
        //console.log(this.trackcurve.getPoint(0));

        //i think middle photo should move to this position
        //console.log(this.trackcurve.getPoint(0.5));

        //and last photo should move to this position
       // console.log(this.trackcurve.getPoint(1));


        var trackPoint = this.trackcurve.getPoint(0.1);

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
}
