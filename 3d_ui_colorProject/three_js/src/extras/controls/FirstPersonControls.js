/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 * @author paulirish / http://paulirish.com/
 */

THREE.FirstPersonControls = function ( object, domElement ) {
  this.object = object;
  //this.d = (new debugClass({createNode:1, nodeId: 'test1'}))
  this.target = new THREE.Vector3( 0, 0, 0 );

  this.domElement = ( domElement !== undefined ) ? domElement : document;

  this.movementSpeed = 1.0;
  this.lookSpeed = 0.005;
  
  this.ext_update = false;

  this.noFly = false;
  this.lookVertical = true;
  this.autoForward = false;

  this.activeLook = true;

  this.heightSpeed = false;
  this.heightCoef = 1.0;
  this.heightMin = 0.0;

  this.constrainVertical = false;
  this.verticalMin = 0;
  this.verticalMax = Math.PI;

  this.lastUpdate = new Date().getTime();
  this.tdiff = 0;

  this.autoSpeedFactor = 0.0;

  this.mouseX = 0;
  this.mouseY = 0;

  this.lat = 0;
  this.lon = 0;
  this.phi = 0;
  this.theta = 0;

  this.moveForward = false;
  this.moveBackward = false;
  this.moveLeft = false;
  this.moveRight = false;
  this.freeze = false;

  this.mouseDragOn = false;

  if ( this.domElement === document ) {

    this.viewHalfX = window.innerWidth / 2;
    this.viewHalfY = window.innerHeight / 2;

  } else {

    this.viewHalfX = this.domElement.offsetWidth / 2;
    this.viewHalfY = this.domElement.offsetHeight / 2;
    this.domElement.setAttribute( 'tabindex', -1 );

  }

  this.onMouseDown = function ( event ) {

    if ( this.domElement !== document ) {

      this.domElement.focus();

    }

 //   event.preventDefault();
//    event.stopPropagation();

    if ( this.activeLook ) {

      switch ( event.button ) {

   //     case 0: this.moveForward = true; break;
   //     case 2: this.moveBackward = true; break;

      }

    }

    this.mouseDragOn = true;

  };

  this.onMouseUp = function ( event ) {

 //   event.preventDefault();
 //   event.stopPropagation();

    if ( this.activeLook ) {

      switch ( event.button ) {

   //     case 0: this.moveForward = false; break;
   //     case 2: this.moveBackward = false; break;

      }

    }

    this.mouseDragOn = false;

  };

  this.onMouseMove = function ( event ) {

    if ( this.domElement === document ) {

      this.mouseX = event.pageX - this.viewHalfX;
      this.mouseY = event.pageY - this.viewHalfY;

    } else {

      this.mouseX = event.pageX - this.domElement.offsetLeft - this.viewHalfX;
      this.mouseY = event.pageY - this.domElement.offsetTop - this.viewHalfY;

    }

  };

  this.onKeyDown = function ( event ) {

    switch( event.keyCode ) {

      case 38: /*up*/
      case 87: /*W*/ this.moveForward = true; break;

      case 37: /*left*/
      case 65: /*A*/ this.moveLeft = true; break;

      case 40: /*down*/
      case 83: /*S*/ this.moveBackward = true; break;

      case 39: /*right*/
      case 68: /*D*/ this.moveRight = true; break;

      case 82: /*R*/ this.moveUp = true; break;
      case 70: /*F*/ this.moveDown = true; break;

      case 81: this.freeze = !this.freeze; break;

    }

  };

  this.onKeyUp = function ( event ) {

    switch( event.keyCode ) {

      case 38: /*up*/
      case 87: /*W*/ this.moveForward = false; break;

      case 37: /*left*/
      case 65: /*A*/ this.moveLeft = false; break;

      case 40: /*down*/
      case 83: /*S*/ this.moveBackward = false; break;

      case 39: /*right*/
      case 68: /*D*/ this.moveRight = false; break;

      case 82: /*R*/ this.moveUp = false; break;
      case 70: /*F*/ this.moveDown = false; break;

    }

  };

  this.update = function() {
/*********************************************************************************************/
    
      
    var now = new Date().getTime();
    this.tdiff = ( now - this.lastUpdate ) / 1000;
    this.lastUpdate = now;
/*********************************************************************************************/

    if ( !this.freeze ) {

/*********************************************************************************************/

      if ( this.heightSpeed ) {

        var y = clamp( this.object.position.y, this.heightMin, this.heightMax );
        var delta = y - this.heightMin;

        this.autoSpeedFactor = this.tdiff * ( delta * this.heightCoef );

      } else {

        this.autoSpeedFactor = 0.0;

      }
/*********************************************************************************************/
/*
      var actualMoveSpeed = this.tdiff * this.movementSpeed;

      if ( this.moveForward || ( this.autoForward && !this.moveBackward ) ) this.object.translateZ( - ( actualMoveSpeed + this.autoSpeedFactor ) );
      if ( this.moveBackward ) this.object.translateZ( actualMoveSpeed );

      if ( this.moveLeft ) this.object.translateX( - actualMoveSpeed );
      if ( this.moveRight ) this.object.translateX( actualMoveSpeed );

      if ( this.moveUp ) this.object.translateY( actualMoveSpeed );
      if ( this.moveDown ) this.object.translateY( - actualMoveSpeed );
      
      */
/*********************************************************************************************/
// 1st.
/*********************************************************************************************/
      var ver = new THREE.Vector3(0, 0, 0);
      var targetPosition = this.target;
      var camPos = owl.deepCopy(this.object.position);
      p = 100;

      var actualLookSpeed = this.tdiff * this.lookSpeed;

      if ( !this.activeLook ) {

        actualLookSpeed = 0;

      }

      this.lon   += this.mouseX * actualLookSpeed;
      if( this.lookVertical ) {
        this.lat -= this.mouseY * actualLookSpeed;
      }
      
      this.lat = Math.max( - 85, Math.min( 85, this.lat ) );
      this.phi = ( 90 - this.lat ) * Math.PI / 180;
      this.theta = this.lon * Math.PI / 180;


      targetPosition.x = p * Math.sin( this.phi ) * Math.cos( this.theta );
      targetPosition.y = p * Math.cos( this.phi );
      targetPosition.z = p * Math.sin( this.phi ) * Math.sin( this.theta );
      targetPosition = new THREE.Vector3(0, 0, 0).add(camPos,targetPosition);
      
/*********************************************************************************************/
// 2nd.
/*********************************************************************************************/

      var verticalLookRatio = 1;

      if ( this.constrainVertical ) {

        verticalLookRatio = Math.PI / ( this.verticalMax - this.verticalMin );

      }
/*********************************************************************************************/

      this.lon += this.mouseX * actualLookSpeed;
      if( this.lookVertical ) this.lat -= this.mouseY * actualLookSpeed * verticalLookRatio;
      this.lat = Math.max( - 85, Math.min( 85, this.lat ) );


      this.phi = ( 90 - this.lat ) * Math.PI / 180;
      this.theta = this.lon * Math.PI / 180;
      

      if ( this.constrainVertical ) {
        this.phi = map_linear( this.phi, 0, Math.PI, this.verticalMin, this.verticalMax );
      }
/*********************************************************************************************/

      targetPosition.x = p * Math.sin( this.phi ) * Math.cos( this.theta );
      targetPosition.y = p * Math.cos( this.phi );
      targetPosition.z = p * Math.sin( this.phi ) * Math.sin( this.theta );
      targetPosition = new THREE.Vector3(0, 0, 0).add(camPos,targetPosition);
/*********************************************************************************************/
      
      this.object.lookAt( targetPosition );
      /*
     this.d.output("("+  targetPosition.x + ","+ 
                         targetPosition.y + ","+ 
                         targetPosition.z + "),<br/>" +
                   "("+  camPos.x + ","+ 
                         camPos.y + ","+ 
                         camPos.z + "),<br/>");
      */
      
       this.ext_update = false;
/*********************************************************************************************/
/*********************************************************************************************/
    
    }
    
  };
  
  this.translate = function(pos){
    this.object.translateZ(pos.z);
    this.object.translateX(pos.x);
    this.object.translateY(pos.y);
  }
  
  this.cloneCamera = function(){
   return owl.deepCopy(this.object);
  }
  
  this.setCamera = function(position){
    this.object.position.copy(position);
  }
  
  
   /*********************************************************************************************/
  this.updateCords = function(pos){
    var camPos = owl.deepCopy(this.object.position);
    var ver  = new THREE.Vector3(pos.x, pos.y, pos.z); 
    ver   = ver.sub(ver, camPos);
  
    var r = this.getRadius(ver)
    var p = 100;
    
    var tmpGeo         = this.getGeoCords(ver,r);
    var tmpSpherical   = this.getSpherical(tmpGeo[0],tmpGeo[1]);
    var targetPosition = this.getCartesian(tmpSpherical[0], tmpSpherical[1], r);
      targetPosition    = new THREE.Vector3(0, 0, 0).add(targetPosition, camPos);
    
    this.lon   = tmpGeo[0];
    this.lat   = tmpGeo[1];
    
    this.object.lookAt( targetPosition );
    this.ext_update = true;
 }
    
 this.getRadius = function(pos){
   var r = Math.sqrt(Math.pow(pos.x,2) + Math.pow(pos.y,2) + Math.pow(pos.z,2));
   return r;
 }
  /*********************************************************************************************/
    
   
 this.getGeoCords = function(pos,r){
   var lon = -1*((90 + (Math.atan2(pos.x , pos.z)) * 180 / Math.PI) % 360) -180;
   var lat = 90 - (Math.acos(pos.y / r)) * 180 / Math.PI;
   
  //  this.lat = Math.max( - 85, Math.min( 85, this.lat ) );

   return [lon,lat];
    }
  /*********************************************************************************************/
  
    
 this.getGeoCordsSpherical = function(phi, theta){
    var lon = theta * (180/Math.PI);
    var lat = (90 + phi) * (180/Math.PI);
   return [lon, lat];
    }
  /*********************************************************************************************/
  
 this.getSpherical = function(lon, lat){
   var theta = lon * Math.PI / 180;
   var phi   = ( 90 - lat) * Math.PI / 180;
   return [phi, theta];
 }
  /*********************************************************************************************/
    
 this.getCartesian = function(phi, theta, p){
   var targetPosition =  new THREE.Vector3(0, 0, 0);
   targetPosition.x = p * Math.sin( phi ) * Math.cos( theta );
   targetPosition.y = p * Math.cos( phi );
   targetPosition.z = p * Math.sin( phi ) * Math.sin( theta );
   return targetPosition;
}
  /*********************************************************************************************/
    

  this.domElement.addEventListener( 'contextmenu', function ( event ) { event.preventDefault(); }, false );

  this.domElement.addEventListener( 'mousemove', bind( this, this.onMouseMove ), false );
  this.domElement.addEventListener( 'mousedown', bind( this, this.onMouseDown ), false );
  this.domElement.addEventListener( 'mouseup', bind( this, this.onMouseUp ), false );
  this.domElement.addEventListener( 'keydown', bind( this, this.onKeyDown ), false );
  this.domElement.addEventListener( 'keyup', bind( this, this.onKeyUp ), false );

  function bind( scope, fn ) {

    return function () {

      fn.apply( scope, arguments );

    };

  };

  function map_linear( x, sa, sb, ea, eb ) {

    return ( x  - sa ) * ( eb - ea ) / ( sb - sa ) + ea;

  };

  function clamp_bottom( x, a ) {

    return x < a ? a : x;

  };

  function clamp( x, a, b ) {

    return x < a ? a : ( x > b ? b : x );

  };

};
