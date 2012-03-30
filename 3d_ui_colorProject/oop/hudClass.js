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
    this.ui.createSlider('width',[1,this.radius*2],1,this.radius);
    this.ui.createSlider('height',[1,this.radius*2],1,this.radius);
    this.ui.createSlider('size',[1,this.radius*2],1,this.radius);
    this.ui.createSlider('value',[1,50],1,10);
    var dims = this.scene.getDimsP();
  //  YAHOO.util.Dom.setStyle(this.outputId,'width', dims[0] - this.offSet + 'px');
 //   YAHOO.util.Dom.setStyle(this.hudId,'top', dims[1]*(this.heightOffset/100)  + 'px');
  }

  hudClass.prototype.updateXColor = function(color, polyColors){ 

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
      this.output(this.outputGraph(ret));
    }else{
      this.output(this.outputGraph(polyColors));
    }
  }
  
  hudClass.prototype.outputGraph = function(set){ 
    var output_text = document.getElementById('output_text');
    output_text.value = this.getStaticColorSet(set).join(' ');
    output_text = null;
    var SystemType = document.getElementById('GraphType');
    var valueType = SystemType.value;
    SystemType = null;
    var ret;
    switch(valueType){ 
      case 'ValueGradient': 
        ret = this.ValueGradient(set);
        break;
      case 'Random': 
        ret = this.RandomValues(set);
        break;
      case 'RandomValue': 
        ret = this.RandomValue_output(set);
        break;
      case 'Pattern1': 
        ret = this.createColorPattern1(set);
        break;
      case 'Pattern2': 
        ret = this.createColorPattern2(set);
        break;
      case 'Pattern3': 
        ret = this.createColorPattern3(set);
        break;
      case 'Pattern4': 
        ret = this.createColorPattern4(set);
        break;
      case 'Pattern5': 
        ret = this.createColorPattern5(set);
        break;
    }
    return ret;
  }
  
  hudClass.prototype.RandomValues = function(set){ 
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
          newSet[x] = this.adjustColor(newSet[this.ran(0,(newSet.length -1))],
                                      null,null, Math.random());
        }
        ret += this.outputXColorSet(newSet);
      }
    }
    return ret;
  }
  hudClass.prototype.RandomValue_output = function(set){ 
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
          newSet[x] = this.adjustColor(newSet[x],null,null,Math.random());
        }
        ret += this.outputXColorSet(newSet);
      }
    }
    return ret;
  }
  
  hudClass.prototype.ran = function(minVal,maxVal,floatVal){
    var randVal = minVal+(Math.random()*(maxVal-minVal));
    return typeof floatVal=='undefined'?Math.round(randVal):randVal.toFixed(floatVal);
  }

  
  hudClass.prototype.ValueGradient = function(set){ 
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
          newSet[x] = this.adjustColor(newSet[x],null,null,i)
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
  
 hudClass.prototype.createColorPattern5 = function(set){
  return this.getColorPattern5(this.getStaticColorSet(set));
 }
 
 hudClass.prototype.getColorPattern5 = function(colors){  
   return '<div class="Pattern5">'+
              '<div class="box1">'+this.getColorDiv('#000000') +'</div>'+
              '<div class="box2">'+this.getColorDiv(colors[0]) +'</div>'+
              '<div class="box3">'+this.getColorDiv(colors[1]) +'</div>'+
              '<div class="box4">'+this.getColorDiv(colors[2]) +'</div>'+
              '<div class="box5">'+this.getColorDiv(colors[3]) +'</div>'+
            '</div>';   
 }
  
 hudClass.prototype.createColorPattern4 = function(set){
  return this.getColorPattern4(this.getStaticColorSet(set));
 }
 
 hudClass.prototype.getColorPattern4 = function(colors){  
   return '<div class="Pattern4">'+
              '<div class="bar">'+this.getColorDiv('#000000', true) +'</div>'+
              '<div class="bar">'+this.getColorDiv(colors[0], true) +'</div>'+
              '<div class="bar">'+this.getColorDiv(colors[1], true) +'</div>'+
              '<div class="bar">'+this.getColorDiv(colors[2], true) +'</div>'+
              '<div class="bar">'+this.getColorDiv(colors[3], true) +'</div>'+
            '</div>';   
 }
  
 hudClass.prototype.createColorPattern3 = function(set){
  return this.getColorPattern3(this.getStaticColorSet(set));
 }
 
 hudClass.prototype.getColorPattern3 = function(colors){  
   return '<div class="Pattern3">'+
              '<div class="tl">'+this.getColorDiv('#000000', true) +'</div>'+
              '<div class="tr">'+this.getColorDiv(colors[0], true) +'</div>'+
              '<div class="c">'+this.getColorDiv(colors[1], true) +'</div>'+
              '<div class="bl">'+this.getColorDiv(colors[2], true) +'</div>'+
              '<div class="br">'+this.getColorDiv(colors[3], true) +'</div>'+
            '</div>';   
 }
 
 hudClass.prototype.createColorPattern2 = function(set){
  return this.getColorPattern2(this.getStaticColorSet(set));
 }
 
 hudClass.prototype.getColorPattern2 = function(colors){  
   return '<div class="Pattern2"><div class="square">'+
              this.getColorDiv(colors[0], true) +
              this.getColorDiv(colors[1], true) +
              this.getColorDiv(colors[2], true) +
              this.getColorDiv(colors[3], true) +
            '</div>'+
            '<div class="centerSwatch">'+this.getColorDiv('#000000', true) +'</div></div>';   
 }
 
 
 hudClass.prototype.getStaticColorSet = function(set){
 
  var newSet =  owl.deepCopy(set);
  var colors = [];
  var offset = 0;
  if(newSet.length < 4){
    colors = ['#000000']
    offset = 1;
  }
  
  for(var i = 0 ;i<newSet.length;i++){
      colors[i + offset] = new tinycolor(newSet[i]).toHexString();
  }
  return colors;
 }
 
  
 hudClass.prototype.createColorPattern1 = function(set){
 
  var newSet =  owl.deepCopy(set);
  var colors = [];
  for(var i = 0 ;i<newSet.length;i++){
   // if(i == 0){
      colors[i] = [ 
                   this.adjustColor(newSet[i],null,1,0.5).toHexString(),
                   this.adjustColor(newSet[i],null,0.5,0.5).toHexString(),
                   this.adjustColor(newSet[i],null,1,1).toHexString(),
                   this.adjustColor(newSet[i],null,0.7,0.7).toHexString(),
                   this.adjustColor(newSet[i],null,1,0.7).toHexString(),
                  ];
   // }else{
   // }
  }
  return this.getColorPattern1(colors);
 }
 
 hudClass.prototype.getColorPattern1 = function(colors){  
  var ret = "";
  for(var i = 0 ;i<colors.length;i++){
    ret += '<div class="row"><div class="Left'+(i+1)+'">'+
          this.getColorDiv(colors[i][0]) +
          this.getColorDiv(colors[i][1]) +
        '</div>'+
        '<div class="Mid'+(i+1)+'">'+
          this.getColorDiv(colors[i][2]) +
        '</div>'+
        '<div class="Right'+(i+1)+'">'+
          this.getColorDiv(colors[i][3]) +
          this.getColorDiv(colors[i][4]) +
        '</div>'+ colors[i].join('&nbsp;')+'</div>';
    }
    return '<div class="Pattern1">'+ret+'</div>';   
 }
 
 hudClass.prototype.adjustColor = function(obj,h,s,v){  
  var temp = new tinycolor(obj).toHsv()
  if(!(h == undefined || h == null)){
    temp.h = h;
  }
  if(!(s == undefined || s == null)){
    temp.s = s;
  }
  if(!(v == undefined || v == null)){
    temp.v = v;
  }
  return new tinycolor(temp)
  
  
 }
 
 
 
 hudClass.prototype.getColorDiv = function(colorStr, extDims){
    var dims = !extDims ? 'width:100%;height:100%;': '';
    return '<div class="swatch" style="'+dims+'background-color:'+colorStr+';"></div>';
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

  
  