function modelLoaderClass(options){
    try{
      this.elements = {};
    //  this.h = new helperClass();
      this.initializeOptions(options);
      this.initialize();
     this.fileList = {}
    }catch(err){
      debugger;
    }
  }
  
  modelLoaderClass.prototype.constructor = modelLoaderClass;

  /*------------------------------------------------------------------------------------------------*/

  modelLoaderClass.prototype.initializeOptions = function(options){
    for( o in options){
      this[o] = options[o];
    }
  }
  
  modelLoaderClass.prototype.initialize = function(){
  }
  
  modelLoaderClass.prototype.updateObjects = function(obj){
    this.obj = obj;
    
  }
  
  modelLoaderClass.prototype.loadModels = function(models, element, options){
    for(var i in models){
      this.loadModel(element, this.concatJson(options,{'filename':models[i]}));
    }
 //   this.checkLoaded();
  }
  
  modelLoaderClass.prototype.checkLoaded = function(){
    var instanceObj = this;
    (function checkLoaded_p(){
      var loaded = instanceObj.filesLoaded();
      if(!loaded){
        setTimeout(checkLoaded_p, 1000);
      }
     })();
  }
  
  modelLoaderClass.prototype.filesLoaded = function(){
    var ret = true;
    for(var e in this.fileList){
      if(!this.fileList[e]){
        ret = false
        break;
      }
    }
    return ret;
  }
  
  modelLoaderClass.prototype.loadModel = function(element, options){
     switch(options.mType){
       case 'collada':
         var loader = new THREE.ColladaLoader();
         this.fileList[options.filename] = false;
         loader.load(options.filename,  this.ModelReady_C(element, options.filename, options.fn));
         break;
       case 'json':
         var loader = new THREE.JSONLoader();
         this.fileList[options.filename] = false;
         loader.load(  options.filename,this.ModelReady_C(element, options.filename, options.fn, options.text));
         break;
       case 'scene':
         var loader = new THREE.SceneLoader();
         this.fileList[options.filename] = false;
         loader.load(options.filename,  this.ModelReady_C(element, options.filename, options.fn));
         break;
     }
     return loader;
  }
  
  modelLoaderClass.prototype.ModelReady_C = function(element, fname, fn){
    var instanceObj = this;
    var iElement = element;
    var iFn = fn;
    return function( obj ) {
      instanceObj.ModelReady_p(iElement, iFn(iElement, obj, fname), fname);
    }
  }
  
  modelLoaderClass.prototype.ModelReady_p = function(element, obj, fname){
    try{
      element.scene.add(obj);
      this.fileList[fname] = obj;
    }catch(err){
      debugger;
    }
  }
  
  modelLoaderClass.prototype.getModelPosition = function(fname){
   return this.fileList[fname].position;
  }
  
  
  modelLoaderClass.prototype.concatJson = function(jA, jB){
    if(jA){
      var ret = this.dcopyJson(jA);
      if(jB){
        for(var l in jB){
         ret[l] = jB[l];
        }
      }
    }else{ 
      var ret = {};
    }
    return ret;
  }
  
  modelLoaderClass.prototype.dcopyJson = function(list){
    var ret = {};
    for(var l in list){
       ret[l] = list[l];
    }
    return ret;
  }

  
