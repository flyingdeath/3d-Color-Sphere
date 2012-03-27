  function hudClass(options){
    try{
      this.elements = {};
      this.h = new helperClass();
      this.initializeOptions(options);
      this.initialize();
    }catch(err){
      debugger;
    }
  }
  
  hudClass.prototype.constructor = hudClass;

  /*------------------------------------------------------------------------------------------------*/

  hudClass.prototype.initializeOptions = function(options){
    for( o in options){
      this[o] = options[o];
    }
  }
  
  hudClass.prototype.initialize = function(){
    this.createSlider('width',[1,this.radius*2],1,this.radius);
    this.createSlider('height',[1,this.radius*2],1,this.radius);
    this.createSlider('size',[1,this.radius*2],1,this.radius);
    this.createSlider('value',[1,50],1,10);
    var dims = this.scene.getDimsP();
    YAHOO.util.Dom.setStyle(this.outputId,'width', dims[0] - this.offSet + 'px');
    YAHOO.util.Dom.setStyle(this.hudId,'top', dims[1]*(this.heightOffset/100)  + 'px');
  }
  
  hudClass.prototype.createSlider = function(name, dRange,dTickSize, initValue){
    var slider = YAHOO.widget.Slider.getHorizSlider(name + "_bg",
                                                    name + "_thumb", 
                                                    dRange[0], 
                                                    dRange[1], 
                                                    dTickSize);
    if(initValue){
      slider.setValue(initValue, true, true, true);
    }
    
    var paramSet = {instanceObj:this,'element':{'name':      name,
                                                'dRange':    dRange,
                                                'dTickSize': dTickSize,
                                                'initValue': initValue}};
                                                
    slider.subscribe('change', this.report, paramSet);
    return slider;
    
  }
  
  hudClass.prototype.report = function(sliderObj, paramSet){
    paramSet.instanceObj.report_p(this,sliderObj,paramSet.element);
  }
        
  hudClass.prototype.report_p = function(obj, value, element){
      var valueBox = document.getElementById(element.name + "_valueBox");
      valueBox.value = value;
      valueBox = null;
      var eventObj ={};
     // this.redrawColorWheel(eventObj);
  }
  
  
  