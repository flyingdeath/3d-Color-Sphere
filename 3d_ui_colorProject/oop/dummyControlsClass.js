function dummyControlsClass(options){
    try{
      this.elements = {};
    //  this.h = new helperClass();
      this.initializeOptions(options);
      this.initialize();
    }catch(err){
      debugger;
    }
  }
  
  dummyControlsClass.prototype.constructor = dummyControlsClass;

  /*------------------------------------------------------------------------------------------------*/

  dummyControlsClass.prototype.initializeOptions = function(options){
    for( o in options){
      this[o] = options[o];
    }
  }
  
  dummyControlsClass.prototype.initialize = function(){
  
  }
  