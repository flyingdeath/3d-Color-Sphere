  function hudPanels(options){
    try{
      this.elements = {};
      this.h = new helperClass();
      this.initializeOptions(options);
      this.initialize();
    }catch(err){
      debugger;
    }
  }
  
  hudPanels.prototype.constructor = hudPanels;

  /*------------------------------------------------------------------------------------------------*/

  hudPanels.prototype.initializeOptions = function(options){
    for( o in options){
      this[o] = options[o];
    }
  }
  
  hudPanels.prototype.initialize = function(){
    var rezStep = 200;
    this.panel1 = this.init_plain({ width:this.size, height:this.size, 
                                    sHeight:rezStep, sWidth:rezStep});
   this.panel1.position.set( this.initipos.x, this.initipos.y, this.initipos.z );
 //  this.panel1.rotation.x = Math.PI*(0.5);
   this.panel1.rotation.y = Math.PI*(0.5);
   this.scene.add(this.panel1);
    this.mapOneColor(this.panel1.geometry,new THREE.Color( 0xffffff ));
  }
  
  hudPanels.prototype.init_plain = function(options){
    var geometry = new THREE.PlaneGeometry( options.width, options.height, options.sWidth, options.sHeight  );
    
    
  //  this.mapOneColor(geometry,new THREE.Color( 0x000000 ));
    var m = new THREE.MeshLambertMaterial( { color: 0xffffff, shading: THREE.FlatShading, vertexColors: THREE.VertexColors } )
    //m.vertexColors = true;
    var object = new THREE.Mesh(geometry, m ) ;
   // 
                             
    object.geometry.doubleSided = true;
    object.geometry.filpSided = true;
    object.geometry.overdraw = true;
    
    return object ;
  }
  
  hudPanels.prototype.changeColorOfPanel = function(color){
 //   this.mapOneColor(this.panel1.geometry,color);
    var rezStep = 20;
    this.scene.remove(this.panel1);
    this.panel1 = null;
    
    this.panel1 = this.init_plain({ width:this.size, height:this.size, 
                                    sHeight:rezStep, sWidth:rezStep});
    if(color){
      this.mapOneColor(this.panel1.geometry,color);
    }
   this.scene.add(this.panel1);
  }
  
  hudPanels.prototype.mapOneColor = function(geometry, newColor){
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
        color.setRGB(newColor.r,newColor.g, newColor.b);
        f.vertexColors[ j ] = color;
       /*
       this.d.append("("+  f.vertexColors[ j ].r + ","+ 
                             f.vertexColors[ j ].g+ ","+ 
                             f.vertexColors[ j ].b+ ")");
      */
      }
    }
  }
  
  hudPanels.prototype.updatePosition = function(camera){
      var target =  owl.deepCopy(camera.getTarget());
      var pos =  owl.deepCopy(camera.position);
    var far = 30; 
    var r = 50;
    var offSet = 30;
    var direction = new THREE.Vector3( target.x, target.y, target.z ).normalize();
    var origin = new THREE.Vector3(  pos.x ,   pos.y  , pos.z );
    
    if(direction.z > 0 ){
        origin.z += far;
    }else{
        origin.z -= far;
    }
    
    if(direction.x > 0 ){
        origin.x += offSet;
    }else{
        origin.x -= offSet;
    }
    if(direction.y > 0 ){
        origin.y += offSet;
    }else{
        origin.y -= offSet;
    }/**/
    
    
    origin = origin.sub(origin, direction);
    this.changePosition(origin);
    this.changeRotation(camera.rotation);
    
  }
  
  hudPanels.prototype.changePosition = function(pos){
   this.panel1.position.set( pos.x, pos.y, pos.z );
  }
  
  hudPanels.prototype.changeRotation = function(rot){
    this.changeRotation_p(this.panel1,rot);
  }
  
  hudPanels.prototype.changeRotation_p = function(panel,rot){
   panel.rotation.x = rot.x;
   panel.rotation.y = rot.y;
   panel.rotation.z = rot.z;
  }
  
  hudPanels.prototype.rho = function(pos){
    var r = Math.sqrt(Math.pow(pos.x,2) + Math.pow(pos.y,2) + Math.pow(pos.z,2));
    return r;
  }
  
  hudPanels.prototype.phi = function(pos, rho){
     return Math.acos(pos.y/ rho);
  }
  
  hudPanels.prototype.theta = function(pos){
    var s = this.s(pos)
    var ret = 0;
    if(0 <= pos.x){
       ret = Math.asin(pos.z/ s);
    }else{
       ret = Math.PI - Math.asin(pos.z/ s);
    }
    return ret;
  }
    
  hudPanels.prototype.s = function(pos){
    var r = Math.sqrt(Math.pow(pos.x,2) + Math.pow(pos.z,2));
    return r;
  }
   
  hudPanels.prototype.getCartesian = function(phi, theta, p){
    var targetPosition =  new THREE.Vector3(0, 0, 0);
    targetPosition.x = p * Math.sin( phi ) * Math.cos( theta );
    targetPosition.y = p * Math.cos( phi );
    targetPosition.z = p * Math.sin( phi ) * Math.sin( theta );
    return targetPosition;
  }
    
    
  
  
  