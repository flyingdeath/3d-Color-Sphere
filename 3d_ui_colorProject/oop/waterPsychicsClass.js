  function waterPsychicsClass(options){
    try{
      this.elements = {};
    //  this.h = new helperClass();
 this.d = (new debugClass({createNode:1}))
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
        
    var texture = THREE.ImageUtils.loadTexture( "three_js/examples/textures/water.jpg" );
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set( 5, 5 );
    material = new THREE.MeshBasicMaterial( { color: 0x1c5075, map: texture } );
    
    var water = new THREE.MeshBasicMaterial({color: options.bg , opacity:options.o});
    var object = new THREE.Mesh( new THREE.PlaneGeometry( options.width, options.height, 
                                                          options.sWidth, options.sHeight ), material );
    object.rotation.x = -Math.PI/2;
    
    this.waterBase  = object;
    this.scene.add( object );
   // this.waterBase.geometry.vertices[0].position.z = 100
  }

  
  //http://aerotwist.com/lab/an-introduction-to-shaders-part-1/
  waterPsychicsClass.prototype.waterMovementStep = function(element){
    var delta = element.clock.getDelta();
    this.d.output("("+ delta + ","+ element.time + "),<br/>")
    
    element.time = element.clock.getElapsedTime() * 10;
    
    for ( var i = 0, l = this.waterBase.geometry.vertices.length; i < l; i ++ ) {
      this.waterBase.geometry.vertices[ i ].position.z = 360 * Math.sin( i / 5 + ( element.time  + i ) / 7 );
    }
    this.waterBase.geometry.__dirtyVertices = true;
    return delta;
  }
    