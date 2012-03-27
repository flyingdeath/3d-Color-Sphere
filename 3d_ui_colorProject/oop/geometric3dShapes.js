  function geometric3dShapes(options){
    try{
      this.elements = {};
      this.h = new helperClass();
      this.initializeOptions(options);
      //this.size = 200;
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
    var shapeType = 'sphere'
    var shape =  this.init_model_shape(shapeType, rezStep);
    
    this.inside = this.init_plain({ width:this.size, height:this.size, 
                                  sHeight:rezStep, sWidth:rezStep, 
                                  'shape': shape, scaler: -1, 'shapeType':shapeType});
    this.outside = this.init_plain({ width:this.size, height:this.size, 
                                    sHeight:rezStep, sWidth:rezStep, 
                                  'shape': shape, scaler: 1,  'shapeType':shapeType });
    
    // this.inside.rotation.x = Math.PI;
    this.outside.rotation.x = -Math.PI*2;
    //this.inside.rotation.y = Math.PI*(3/4);
  
   this.inside.position.set( this.initipos.x, this.initipos.y, this.initipos.z );
   this.outside.position.set( this.initipos.x, this.initipos.y, this.initipos.z );

    
    
    //this.mapPlain(inside,shape, -1);
    
  this.scene.add(this.inside);
   this.scene.add(this.outside);
 //  this.scene.add(shape);
    
  }
  geometric3dShapes.prototype.getViewableObjects = function(){
    return [this.outside];
  }
  
  geometric3dShapes.prototype.init_model_shape = function(sType,rezStep){
   var ret;
    switch(sType){
      case 'cone':   
        ret = this.init_cone({radiusBottom:this.size, height:this.size*(2/3), sHeight:rezStep, sRadius:rezStep });
        break;
      case 'sphere':   
        ret = this.init_sphere({radius:this.size, sHeight:rezStep, sWidth:rezStep });
        break;
      case 'tube':   
        ret = this.init_cylinder({radius:this.size, height:this.size*(3), sHeight:rezStep, sRadius:rezStep });
        break;
    }
    return ret;
  }
  
  geometric3dShapes.prototype.init_plain = function(options){
    var geometry = new THREE.PlaneGeometry( options.width, options.height, options.sWidth, options.sHeight  );
    
    if(options.shape){
      this.mapPlain(geometry,options.shape,options.scaler);
    }
    
    switch(options.shapeType){
      default:
        this.mapColorWheel(geometry,options.scaler, this.scaleColor);
        break;
    }
    
    
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
  
  geometric3dShapes.prototype.mapColorWheel = function(geometry,scaler, scalcerFunc){
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
        f.vertexColors[ j ] = this.calculateColor_p(p,scaler, 0);
      }
    }
  }
  geometric3dShapes.prototype.getFaceColor = function(face){
    var pos = this.getFaceColor_p(this.outside.geometry, 1,face);
    return this.calculateColor(pos);
  }
  
  geometric3dShapes.prototype.getFaceColor_p = function(geometry,scaler,f){
    var colors = []
    var faceIndices = [ 'a', 'b', 'c', 'd' ];
    var p, n, vertexIndex;
    n = ( f instanceof THREE.Face3 ) ? 3 : 4;
    for( var j = 0; j < n; j++ ) {
      vertexIndex = f[ faceIndices[ j ] ];
      p = geometry.vertices[ vertexIndex ].position;
      break;
    }
    return p;
  }
  
  
  
  
    geometric3dShapes.prototype.calculateColor= function(pos){
      return this.calculateColor_p(pos, -1, 0)
    }
    
    geometric3dShapes.prototype.calculateColor_p = function(pos, scaler, rawDiff){
      var value = this.scaleColor(pos.y,scaler, this.size);
      var color = new THREE.Color( 0xffffff );
      var color2d = this.postionColor(this.size, [pos.x + rawDiff,
                                                  pos.z + rawDiff]);
      var phi = this.phi(pos, this.rho(pos));
      var theta = this.theta(pos);                    
      color.setHSV(color2d[0],color2d[1] ,value );
      return color;
    }

 
 geometric3dShapes.prototype.postionColor = function(radius,point) {
   var currentX =  point[0];
   var currentY =  point[1];
    
    var theta    = Math.atan2(currentY, currentX);
    var d      = currentX * currentX + currentY * currentY;
         
    if (d > this.radiusSquared) {
       currentX = radius * Math.cos(theta);
       currentY = radius * Math.sin(theta);
       theta = Math.atan2(currentY, currentX);
       d = currentX * currentX + currentY * currentY;
    } 
    return [(theta + Math.PI) / (Math.PI * 2), 
            Math.sqrt(d) / radius];
  }
     
  
  geometric3dShapes.prototype.scaleColorSphere_old = function(v,scaler,size){
    var ret = (-1*scaler*v+ size)/(size*2);
    if(isNaN(parseInt(ret))){ 
      ret = 1.0;
    }else if((ret >= 1.0 || ret <= 0)){
      ret = 1.0
    }
    return ret;
  }
  
  geometric3dShapes.prototype.scaleColor = function(v,scaler,size){
    return this.clipColor((-1*scaler*v+ size)/(size*2));
  }
  
  geometric3dShapes.prototype.clipColor = function(v){
    var ret = v;
    if(isNaN(parseInt(ret))){ 
      ret = 1.0;
    }else if(ret >= 1.0 ){
      ret = 1.0;
    }else if(ret <= 0){
      ret = 0.0;
    }
    return ret;
  }
  
  
  geometric3dShapes.prototype.init_cone = function(options){
    
    var object = new THREE.Mesh( new THREE.CylinderGeometry( 0 , 
                                                         options.radiusBottom , 
                                                         options.height, 
                                                         options.sRadius, 
                                                         options.sHeight, true), 
                             new THREE.MeshBasicMaterial( { color: 0x000000, wireframe: true, transparent: true, opacity: 1 } )) ;
    return object ;
  }
  
  geometric3dShapes.prototype.init_cylinder = function(options){
    
    var object = new THREE.Mesh( new THREE.CylinderGeometry( options.radius, 
                                                             options.radius , 
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

   geometric3dShapes.prototype.rho = function(pos){
     var r = Math.sqrt(Math.pow(pos.x,2) + Math.pow(pos.y,2) + Math.pow(pos.z,2));
     return r;
   }
   
   geometric3dShapes.prototype.phi = function(pos, rho){
      return Math.acos(pos.y/ rho);
   }
   
   geometric3dShapes.prototype.theta = function(pos){
      var s = this.s(pos)
      var ret = 0;
      if(0 <= pos.x){
         ret = Math.asin(pos.z/ s);
      }else{
         ret = Math.PI - Math.asin(pos.z/ s);
      }
      return ret;
    }
    
   geometric3dShapes.prototype.s = function(pos){
     var r = Math.sqrt(Math.pow(pos.x,2) + Math.pow(pos.z,2));
     return r;
   }
   
 geometric3dShapes.prototype.getCartesian = function(phi, theta, p){
   var targetPosition =  new THREE.Vector3(0, 0, 0);
   targetPosition.x = p * Math.sin( phi ) * Math.cos( theta );
   targetPosition.y = p * Math.cos( phi );
   targetPosition.z = p * Math.sin( phi ) * Math.sin( theta );
   return targetPosition;
}
    
    
  
    
  
  