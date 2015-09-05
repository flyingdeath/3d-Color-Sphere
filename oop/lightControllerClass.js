function lightControllerClass(options){
    try{
      this.elements = {};
    //  this.h = new helperClass();
      this.initializeOptions(options);
      this.initialize();
    }catch(err){
      debugger;
    }
  }
  
  lightControllerClass.prototype.constructor = lightControllerClass;

  /*------------------------------------------------------------------------------------------------*/

  lightControllerClass.prototype.initializeOptions = function(options){
    for( o in options){
      this[o] = options[o];
    }
  }
  
  lightControllerClass.prototype.initialize = function(){
  
  }
  
  lightControllerClass.prototype.createPiontLight = function(options){
    var pointLight = new THREE.PointLight(options.bg, options.o);
    //pointLight.position.x = 1000;
    pointLight.position.set(options.x,options.y,options.z);
    this.scene.add( pointLight );
    return pointLight;
  }
  
  lightControllerClass.prototype.createDirectionalLight = function(options){
    var pointLight = new THREE.DirectionalLight(options.bg, options.o);
    //pointLight.position.x = 1000;
    pointLight.position.set(options.x,options.y,options.z);
    this.scene.add( pointLight );
    return pointLight;
  }
  
  lightControllerClass.prototype.createAmbientLight = function(options){
    var pointLight = new THREE.AmbientLight(options.bg, options.o);
    //pointLight.position.x = 1000;
    pointLight.position.set(options.x,options.y,options.z);
    this.scene.add( pointLight );
    return pointLight;
  }