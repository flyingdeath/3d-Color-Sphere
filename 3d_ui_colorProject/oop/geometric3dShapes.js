  function geometric3dShapes(options){
    try{
      this.elements = {};
      this.h = new helperClass();
      this.initializeOptions(options);
      this.initialize();
      this.time = 0;
    }catch(err){
      debugger;
    }
  }
  
  geometric3dShapes.prototype.constructor = geometric3dShapes;

  /*------------------------------------------------------------------------------------------------*/

  geometric3dShapes.prototype.initializeOptions = function(options){
    for( o in options){
      this[o] = options[o];
    }
  }
  
  geometric3dShapes.prototype.initialize = function(){
  var rezStep = 200;
    var inside = this.init_plain({ width:200, height:200, sHeight:rezStep, sWidth:rezStep });
    var outside = this.init_plain({ width:200, height:200, sHeight:rezStep, sWidth:rezStep });
    var shape =  this.init_model_shape('sphere', rezStep);
    
    inside.rotation.x = Math.PI;
    outside.rotation.x = -Math.PI*2 ;
    inside.position.set( 0, 200, 0 );
    outside.position.set( 0, 200, 0 );
    shape.position.set( 0, 200, 0 );
    this.mapPlain(inside,shape, -1);
    this.mapPlain(outside,shape, 1);
    
    this.scene.add(inside);
    this.scene.add(outside);
    this.scene.add(shape);
  }
  
  geometric3dShapes.prototype.init_model_shape = function(sType,rezStep){
   var ret;
    switch(sType){
      case 'cone':   
        ret = this.init_cone({ radiusBottom:200, height:300, sHeight:rezStep, sRadius:rezStep });
        break;
      case 'sphere':   
        ret = this.init_sphere({ radius:200, sHeight:rezStep, sWidth:rezStep });
        break;
    }
    return ret;
  }
  
  geometric3dShapes.prototype.init_plain = function(options){
    
    var object = new THREE.Mesh( new THREE.PlaneGeometry( options.width, options.height, options.sWidth, options.sHeight  ), 
                             new THREE.MeshNormalMaterial( { overdraw: true } )) ;
    object.geometry.doubleSided = true;
   // object.position.set( -200, 0, 0 );
      object.rotation.x = -Math.PI/2;
    return object ;
  }
  
  geometric3dShapes.prototype.mapPlain = function(p,s, scaler){
    for ( var i = 0, l = s.geometry.vertices.length; i < l; i ++ ) {
      if(p.geometry.vertices.length > i){
        p.geometry.vertices[ i ].position.x = scaler*s.geometry.vertices[ i ].position.x;
        p.geometry.vertices[ i ].position.y = scaler*s.geometry.vertices[ i ].position.y;
        p.geometry.vertices[ i ].position.z = scaler*s.geometry.vertices[ i ].position.z;
      }
    }
  }
  
  geometric3dShapes.prototype.init_cone = function(options){
    
    var object = new THREE.Mesh( new THREE.CylinderGeometry( 1 , 
                                                         options.radiusBottom , 
                                                         options.height, 
                                                         options.sRadius, 
                                                         options.sHeight, false), 
                             new THREE.MeshBasicMaterial( { color: 0x000000, wireframe: true, transparent: true, opacity: 1 } )) ;
    return object ;
  }
  
   geometric3dShapes.prototype.init_sphere = function(options){
     
     var object = new THREE.Mesh( new THREE.SphereGeometry(options.radius , 
                                                          options.sHeight, 
                                                          options.sWidth), 
                              new THREE.MeshBasicMaterial( { color: 0x000000, wireframe: true, transparent: true, opacity: 1 } )) ;
     return object ;
   }
    
    
  
    
  
  