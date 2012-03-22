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
    var initipos = new THREE.Vector3( 100, 600, 0 ) 
    var shape =  this.init_model_shape('sphere', rezStep);
    
    var inside = this.init_plain({ width:200, height:200, 
                                  sHeight:rezStep, sWidth:rezStep, 
                                  'shape': shape, scaler: 1  });
    var outside = this.init_plain({ width:200, height:200, 
                                    sHeight:rezStep, sWidth:rezStep, 
                                  'shape': shape, scaler: -1 });
    
    inside.rotation.x = Math.PI;
    outside.rotation.x = -Math.PI*2 ;
  //  inside.position.set( initipos.x, initipos.y, initipos.z );
//    outside.position.set( initipos.x, initipos.y, initipos.z );
 //   shape.position.set( initipos.x, initipos.y, initipos.z );
    
    
    //this.mapPlain(inside,shape, -1);
    
    this.scene.add(inside);
    this.scene.add(outside);
  //  this.scene.add(shape);
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
    var geometry = new THREE.PlaneGeometry( options.width, options.height, options.sWidth, options.sHeight  );
    
        this.mapPlain(geometry,options.shape,options.scaler);
        this.mapColorWheel(geometry);
    var m = new THREE.MeshLambertMaterial( { color: 0xffffff, shading: THREE.FlatShading, vertexColors: THREE.VertexColors } )
        //m.vertexColors = true;
    var object = new THREE.Mesh(geometry, m ) ;
                             
    object.geometry.doubleSided = true;
   // object.position.set( -200, 0, 0 );
      object.rotation.x = -Math.PI/2;
    return object ;
  }
  
  geometric3dShapes.prototype.mapPlain = function(geometry,s, scaler){
    for ( var i = 0, l = s.geometry.vertices.length; i < l; i ++ ) {
      if(geometry.vertices.length > i){
         geometry.vertices[ i ].position.x = scaler*s.geometry.vertices[ i ].position.x;
         geometry.vertices[ i ].position.y = scaler*s.geometry.vertices[ i ].position.y;
         geometry.vertices[ i ].position.z = scaler*s.geometry.vertices[ i ].position.z;
      }
    }
  }
  
  geometric3dShapes.prototype.mapColorWheel = function(geometry){
    var colors = []
    var len = geometry.vertices.length;
    /*
    for ( i = 0; i < len; i ++ ) {
      colors[ i ] = new THREE.Color( 0xffffff );
      colors[ i ].setHSV( geometry.vertices[ i ].position.x/200, 
                           geometry.vertices[ i ].position.y/200 , 
                           geometry.vertices[ i ].position.z );
    }
    geometry.colors = colors;
    */
            var faceIndices = [ 'a', 'b', 'c', 'd' ];
    
            var color, f, p, n, vertexIndex;
    
    
            for ( var i = 0; i < geometry.faces.length; i ++ ) {
    
              f  = geometry.faces[ i ];
    
              n = ( f instanceof THREE.Face3 ) ? 3 : 4;
    
              for( var j = 0; j < n; j++ ) {
    
                vertexIndex = f[ faceIndices[ j ] ];
    
                p = geometry.vertices[ vertexIndex ].position;
    
                color = new THREE.Color( 0xffffff );
                //color.setHSV( (j + i) /geometry.vertices.length, 1.0, 1.0 );
                var hue = (p.x + 200)/400 ;
                var value = (p.y+ 200)/400 ;
                var Sat = (p.z+ 200)/400 ;
                
                if(value >= 1.0 || value <= 0){
                  value = 1.0
                }
                if(Sat >= 1.0 || Sat <= 0){
                  Sat = 1.0
                }
                
                color.setHSV( hue , Sat  ,value );
    
                f.vertexColors[ j ] = color;
    
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
    
    
  
    
  
  