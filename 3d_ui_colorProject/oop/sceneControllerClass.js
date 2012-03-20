function sceneControllerClass(options){
    try{
      this.elements = {};
    //  this.h = new helperClass();
      this.initializeOptions(options);
      this.initialize();
    }catch(err){
      debugger;
    }
  }
  
  sceneControllerClass.prototype.constructor = sceneControllerClass;

  /*------------------------------------------------------------------------------------------------*/

  sceneControllerClass.prototype.initializeOptions = function(options){
    for( o in options){
      this[o] = options[o];
    }
  }
  
  sceneControllerClass.prototype.initialize = function(){
  
                   
    this.scene     = new THREE.Scene();
    this.dims      = this.getDims();
    this.renderer  = this.createRenderer();
    this.camera    = this.createCamera({cType: this.options.cameraCtype, 
                                        near: this.options.near, 
                                        far: this.options.far, 
                                        dims: this.dims});
  }
  
  sceneControllerClass.prototype.updateObjects = function(obj){
    this.obj = obj;
    
  }
  
  sceneControllerClass.prototype.getDims = function(){
    var dims = [window.innerWidth,
                window.innerHeight];
    var wOffSet = this.options.percentageOffSet[0];
    var hOffSet = this.options.percentageOffSet[1];
    dims[0] = dims[0] - parseInt(dims[0]* wOffSet/100);
    dims[1] = dims[1] - parseInt(dims[1]* hOffSet/100) ;
    return dims;
  }
  
  sceneControllerClass.prototype.createRenderer = function(){
    var renderer = new THREE.WebGLRenderer( { clearColor: 0xaaccff, clearAlpha: 1 } );
    renderer.setClearColorHex( this.options.backgroundColor, this.options.backgroundOpacity );
    renderer.setSize( this.dims[0], this.dims[1] );

    var container = document.getElementById( this.containerId );
    container.appendChild( renderer.domElement );
    container = null;
    return renderer;
  }
  
  sceneControllerClass.prototype.render_animate = function(element){
    (function animate(){
      requestAnimationFrame( animate );
      var delta = element.renderCallBack(element);
      if(!element.cutoff){
       element.controls.update(delta);
      }
      element.renderer.render( element.scene, element.camera );
      element.stats.update();
     })();
   }
   
   sceneControllerClass.prototype.lookAt = function(postion){
      this.camera.lookAt(postion);
   }
   
  sceneControllerClass.prototype.createCamera = function(options){
     var aspect = this.dims[0] / this.dims[1];
     var camera;
     switch(options.cType){
       case 'perspective':
         camera = new THREE.PerspectiveCamera(options.viewAngle, aspect, options.near, options.far);
         break;
       case 'orthographic':                     
         camera = new THREE.OrthographicCamera(options.left, options.right, 
                                               options.top,  options.bottom, 
                                               options.near, options.far);
         break;
     }
     
     this.scene.add(camera);
     return camera;
  }