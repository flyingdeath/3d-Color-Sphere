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

  hudClass.prototype.updateXColor = function(color){ 

    var SystemType = document.getElementById('SystemType_XColor');
    var valueType = SystemType.value;
    SystemType = null;
    var ret;
    switch(valueType){ 
      case 'Monochromatic': 
        ret = tinycolor.triad(color);
        break;
      case 'Complementary': 
        ret = tinycolor.complement(color);
        break;
      case 'Split-Complementary': 
        ret = tinycolor.splitcomplement(color);
        break;
      case 'Analogous': 
        ret = tinycolor.analogous(color);
        break;
      case 'Triad': 
        ret = tinycolor.triad(color);
        break;
      case 'Tetrad': 
        ret = tinycolor.tetrad(color);
        break;
    }
    if(ret){
      this.output(this.outputXColor(ret));
    }else{
      this.output(this.getColorUnit(new tinycolor(color).toHexString()));
    }
  }
  
  hudClass.prototype.outputXColor = function(set){ 
    var value = document.getElementById('value_valueBox');
    var v = parseInt(value.value);
    value = null;
    var range = 100;
    var step = 10/(v*0.1);
    var newSet, ret = "";
    
    if(v > 0){
      for(var i = 0;i<range;i += step){
        newSet =  owl.deepCopy(set);
        for(var x = 0;x<newSet.length;x++){
          temp = newSet[x].toHsv()
          temp.v = i
          newSet[x] = new tinycolor(temp)
        }
        ret += this.outputXColorSet(newSet);
      }
    }
    return ret;
  }
  
  hudClass.prototype.outputXColorSet = function(set){ 
    var ret = "";
    for(var i = 0;i < set.length;i++){
      ret += this.getColorUnit(set[i].toHexString());
    }
    return ret;
  }
 
 hudClass.prototype.getColorUnit = function(colorStr){  
    return '<div class="colorUnit"><div style="background-color:'+colorStr+';"class="color">'+
            '</div><div>'+colorStr+'</div></div>&nbsp;';
  }

  hudClass.prototype.appendOutput = function(text){  
      var output = document.getElementById('output');
      var oText =  output.innerHTML ;
      this.deleteDomElement(output);
      output = null;
      this.updateInnerHtml('output', oText+text);
  }

  hudClass.prototype.output = function(text){  
    this.updateInnerHtml('output', text);
  }

  hudClass.prototype.updateInnerHtml = function(updateId, newHTML){
      var domRef = document.getElementById(updateId);
      if(domRef){
        this.removeChildren(updateId);
        domRef.innerHTML = newHTML;
      }
      this.deleteDomElement(domRef);
      domRef = null;
   }

  hudClass.prototype.deleteDomElement = function(ref){
    var a = [ref];
    delete a[0];
    ref = null;
    a = null;
  }

  hudClass.prototype.removeChildren = function(id){
     var domObj = document.getElementById(id);
     var childrenLength = domObj.childNodes.length;
     for(var i = childrenLength;i>0;i--){
        domObj.removeChild(domObj.childNodes[0]);
        delete domObj.childNodes[0];
     }
     this.deleteDomElement(domObj);
     domObj = null;
  }

  
  