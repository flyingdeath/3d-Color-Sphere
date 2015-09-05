  function waterPsychicsClass(options){
    try{
      this.elements = {};
    //  this.h = new helperClass();
// this.d = (new debugClass({createNode:1}))
      this.initializeOptions(options);
      this.initialize();
      this.time = 0;
    }catch(err){
      debugger;
    }
  }
  
  waterPsychicsClass.prototype.constructor = waterPsychicsClass;

  /*------------------------------------------------------------------------------------------------*/

  waterPsychicsClass.prototype.initializeOptions = function(options){
    for( o in options){
      this[o] = options[o];
    }
  }
  
  waterPsychicsClass.prototype.initialize = function(){
    
    this.insideWaterBase = this.createWaterBase(this.options);
    this.outsideWaterBase = this.createWaterBase(this.options);
    this.insideWaterBase.rotation.x = Math.PI/2 ;
    this.outsideWaterBase.rotation.x = -Math.PI/2 ;
    
     this.scene.add(this.insideWaterBase);
    this.scene.add(this.outsideWaterBase);
  }
  
      
  waterPsychicsClass.prototype.createWaterBase = function(options){
//    var vert = ocean_vert(), frag =  ocean_frag()
  
//    var shaderMaterial = new THREE.MeshShaderMaterial({vertexShader: vert, fragmentShader: frag}); 
  
    
      var geometry = new THREE.PlaneGeometry( options.width, options.height, 
                                              options.sWidth, options.sHeight );
      geometry.dynamic = true;
    
      var i, j, il, jl;
    
      for ( i = 0, il = geometry.vertices.length; i < il; i ++ ) {
    
        geometry.vertices[ i ].position.z = 35 * Math.sin( i/2 );
    
      }
      geometry.computeFaceNormals();
      geometry.computeVertexNormals();
  
          
      var texture = THREE.ImageUtils.loadTexture( "three_js/examples/textures/water.jpg" );
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set( 5, 5 );
      material = new THREE.MeshBasicMaterial( { color: 0x1c5075, map: texture } );
      
      var water = new THREE.MeshBasicMaterial({color: options.bg , opacity:options.o});
      var object = new THREE.Mesh(geometry, material );
    
    return object;
  }
  
  //http://aerotwist.com/lab/an-introduction-to-shaders-part-1/
  waterPsychicsClass.prototype.waterMovementStep = function(element){
    var delta = element.clock.getDelta();
    this.d.output("("+ delta + ","+ element.time + "),<br/>")
    element.time = element.clock.getElapsedTime() * 10;
     this.waterPlainStep(element.time,this.insideWaterBase);
     this.waterPlainStep(element.time, this.outsideWaterBase);
    return delta;
    
  }
  waterPsychicsClass.prototype.waterPlainStep = function(time, plain){
    for ( var i = 0, l = plain.geometry.vertices.length; i < l; i ++ ) {
      plain.geometry.vertices[ i ].position.z = 150 * Math.sin( i / 5 + (time  + i ) / 7 );
    }
    plain.geometry.__dirtyVertices = true;
  }
    