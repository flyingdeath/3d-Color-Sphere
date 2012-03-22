  function geometric3dShapes(options){
    try{
      this.elements = {};
      this.h = new helperClass();
      this.initializeOptions(options);
      this.size = 200;
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
    var shape =  this.init_model_shape('sphere', rezStep);
    
    var inside = this.init_plain({ width:this.size, height:this.size, 
                                  sHeight:rezStep, sWidth:rezStep, 
                                  'shape': shape, scaler: -1 });
    var outside = this.init_plain({ width:this.size, height:this.size, 
                                    sHeight:rezStep, sWidth:rezStep, 
                                  'shape': shape, scaler: 1 });
    
    inside.rotation.x = Math.PI;
    outside.rotation.x = -Math.PI*2;
  
  //  inside.position.set( this.initipos.x, this.initipos.y, this.initipos.z );
   // outside.position.set( this.initipos.x, this.initipos.y, this.initipos.z );

    
    
    //this.mapPlain(inside,shape, -1);
    
    this.scene.add(inside);
    this.scene.add(outside);
  //  this.scene.add(shape);
    
  }
  
  geometric3dShapes.prototype.init_model_shape = function(sType,rezStep){
   var ret;
    switch(sType){
      case 'cone':   
        ret = this.init_cone({ radiusBottom:this.size, height:this.size*(2/3), sHeight:rezStep, sRadius:rezStep });
        break;
      case 'sphere':   
        ret = this.init_sphere({ radius:this.size, sHeight:rezStep, sWidth:rezStep });
        break;
    }
    return ret;
  }
  
  geometric3dShapes.prototype.init_plain = function(options){
    var geometry = new THREE.PlaneGeometry( options.width, options.height, options.sWidth, options.sHeight  );
    
    if(options.shape){
      this.mapPlain(geometry,options.shape,options.scaler);
    }
    this.mapColorWheel(geometry,options.scaler);
    var m = new THREE.MeshLambertMaterial( { color: 0xffffff, shading: THREE.FlatShading, vertexColors: THREE.VertexColors } )
    //m.vertexColors = true;
    var object = new THREE.Mesh(geometry, m ) ;
                             
    object.geometry.doubleSided = true;
    //object.position.set( -200, 0, 0 );
    
    //object.rotation.x = -Math.PI/2;
    
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
  
  geometric3dShapes.prototype.mapColorWheel = function(geometry,scaler){
    var colors = []
    var len = geometry.vertices.length;
    var faceIndices = [ 'a', 'b', 'c', 'd' ];
    var color, f, p, n, vertexIndex;
    for ( var i = 0; i < geometry.faces.length; i ++ ) {
      f  = geometry.faces[ i ];
      n = ( f instanceof THREE.Face3 ) ? 3 : 4;
      for( var j = 0; j < n; j++ ) {
        vertexIndex = f[ faceIndices[ j ] ];
        p = geometry.vertices[ vertexIndex ].position;
        color = new THREE.Color( 0xffffff );
        var hue   = this.scaleColor(p.x,scaler);
        var value = this.scaleColor(p.y,scaler);
        var Sat   = this.scaleColor(p.z,scaler);
        color.setHSV( hue , Sat  ,value );
        f.vertexColors[ j ] = color;
      }
    }
  }
  
  
  geometric3dShapes.prototype.scaleColor = function(v,scaler){
    var ret = (-1*scaler*v+ this.size)/(this.size*2);
    if(isNaN(parseInt(ret))){ 
      ret = 1.0;
    }else if((ret >= 1.0 || ret <= 0)){
      ret = 1.0
    }
    return ret;
  }
  
  geometric3dShapes.prototype.init_cone = function(options){
    
    var object = new THREE.Mesh( new THREE.CylinderGeometry( 0 , 
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
    
    
  
    
  
  