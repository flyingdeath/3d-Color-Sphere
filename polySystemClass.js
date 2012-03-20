
function polySystemClass(options){
  this.initializeOptions(options);
  this.lineColor ="black"
  this.radiusSquared = this.radius * this.radius;
  this.setupMouseControls({});
  this.theta = 0;
  this.dontrotate = null;
  this.storedPoints = [];
  this.createSlider('width',[1,this.radius*2],1,this.radius);
  this.createSlider('height',[1,this.radius*2],1,this.radius);
  this.createSlider('size',[1,this.radius*2],1,this.radius);
  this.createSlider('value',[1,50],1,10);
  
}

polySystemClass.prototype.constructor = polySystemClass;


polySystemClass.prototype.initializeOptions = function(options){
  for( o in options){
    this[o] = options[o];
  }
}

polySystemClass.prototype.updateObjects = function(redrawColorWheel){
  this.redrawColorWheel = redrawColorWheel;
}

polySystemClass.prototype.update = function(rawPos, pos){ 
  var SystemType = document.getElementById('SystemType');
  var width = document.getElementById('width_valueBox');
  var height = document.getElementById('height_valueBox');
  var size = document.getElementById('size_valueBox');
  if(width){
    var vWidth = parseInt(width.value);
    var vHeight = parseInt(height.value);
    var vSize = parseInt(size.value);
    var valueType = SystemType.value;
    var rDiff = [rawPos[0] - pos[0], 
                 rawPos[1] - pos[1]];
      //this.dontrotate = Boolean(SystemType !== 'Polygonal')
               
    switch(valueType){ 
      case 'Complementary': 
        this.drawLine_new(rDiff,pos,vSize);
        break;
      case 'Analogous': 
        this.drawThreePointLine_new(rDiff,pos,vSize);
        break;
      case 'Triadic': 
        this.drawTriangle_new(rDiff,pos,vSize);
        break;
      case 'Split-Complementary': 
        this.drawIsoscelesTriangle_new(rDiff,pos, vWidth, vHeight);
        break;
      case 'Rectangle': 
        this.drawRectangle_new(rDiff,pos, vWidth, vHeight);
        break;
      case 'Square': 
        this.drawSquare_new(rDiff,pos,vSize);
        break;
      case 'Polygonal': 
        this.drawPolygonal_new(rDiff,pos,vSize);
        break;
    }
  }
  this.appendOutput('Theta = '+ this.theta);
  width =null;
  height =null;
  size =null;
}

polySystemClass.prototype.drawThreePointLine_new = function(rDiff, pos, size){ 
  var amount = 45;
  var points = [[pos[0], pos[1]],
                [pos[0]+ size, pos[1]]];
                
  
  
  points[1] = this.rotate(amount* Math.PI / 180, points[1] , points[0]);
  points[2] = [points[1][0],points[1][1]];
  points[2][0] += size;
  points[2] = this.rotate(amount* Math.PI / 180, points[2] , points[0]);

  this.drawPolygon(rDiff, points, pos, false);
}

polySystemClass.prototype.drawPolygonal_new = function(rDiff, pos, size){ 
  var a = [pos]
  if(this.storedPoints.length < size){
    this.storedPoints = this.storedPoints.concat(a);
  }else{
    this.storedPoints = a;
  }
                
  this.drawPolygon(rDiff, this.storedPoints, [0,0], true, true);
}

polySystemClass.prototype.drawLine_new = function(rDiff, pos, size){ 

  var points = [
                [pos[0], pos[1]],
                [pos[0], pos[1] + size]
               ];

                
  this.drawPolygon(rDiff, points, pos, false);
}

polySystemClass.prototype.drawIsoscelesTriangle_new = function(rDiff, pos, width, height){ 
  var a1 = 95; 
  var a2 = 15;
  var points = [[pos[0], pos[1]],
                [pos[0]+ height, pos[1]]];
                
  
  
  points[1] = this.rotate(a1* Math.PI / 180, points[1] , points[0]);
  points[2] = [points[1][0],points[1][1]];
  points[2][0] += width;
  points[2] = this.rotate(a2* Math.PI / 180, points[2] , points[0]);

  this.drawPolygon(rDiff, points, pos, true);
}

polySystemClass.prototype.drawIsoscelesTriangle_old = function(rDiff, pos, width, height){ 

  var ax=pos[0];
  var ay=pos[1];
  
  var bx=pos[0];
  var by=width;
  
  var dx=bx-ax
  var dy=by-ay;
  
  var dangle = Math.atan2(dy, dx) - Math.PI / 3;
  var sideDist = Math.sqrt(dx * dx + dy * dy);
  
  var cx = sideDist*Math.cos(dangle) +  ax;
  var cy =  sideDist*Math.sin(dangle) + ay;
  
  var points = [
                [ax,ay],
                [bx,by],
                [cx,cy]
               ];  


  this.drawPolygon(rDiff, points, pos, true);
}

polySystemClass.prototype.drawRectangle_new = function(rDiff, pos, width, height){ 

  var points = [
                [pos[0], pos[1]],
                [pos[0] + width, pos[1]],
                [pos[0] + width, pos[1] + height],
                [pos[0], pos[1] + height]
               ];

                
  this.drawPolygon(rDiff, points, pos, true);
}


polySystemClass.prototype.drawSquare_new = function(rDiff, pos, size){ 

  var points = [
                [pos[0], pos[1]],
                [pos[0] + size, pos[1]],
                [pos[0] + size, pos[1] + size],
                [pos[0], pos[1] + size]
               ];

                
  this.drawPolygon(rDiff, points, pos, true);
}


polySystemClass.prototype.drawSquare_new = function(rDiff, pos, size){ 

  var points = [
                [pos[0], pos[1]],
                [pos[0] + size, pos[1]],
                [pos[0] + size, pos[1] + size],
                [pos[0], pos[1] + size]
               ];

                
  this.drawPolygon(rDiff, points, pos, true);
}

polySystemClass.prototype.drawTriangle_new = function(rDiff, pos, size){ 
  
  var points = [
                [pos[0], pos[1]],
                [pos[0] + size, pos[1]],
                [pos[0], pos[1] + size]
               ];

                
  this.drawPolygon(rDiff, points, pos, true);
}

polySystemClass.prototype.drawPolygon = function(rawDiff, points, pos, closePath, dontrotate){ 
    this.ctx.strokeStyle = this.lineColor;
    this.ctx.beginPath();
    var primePoints = [];
    // Start from the top-left point.
    if(dontrotate){
      primePoints = points;
    }else{
      for(var i = 0;i<points.length;i++){
        primePoints[i] = [];
        primePoints[i] = this.rotate(this.theta, points[i], pos)
      }
    }
    this.ctx.moveTo(primePoints[0][0], primePoints[0][1]); // give the (x,y) coordinates
    for(var i = 0;i<primePoints.length;i++){
      this.ctx.lineTo(primePoints[i][0], primePoints[i][1]);
    }
    if(closePath){
      this.ctx.lineTo(primePoints[0][0], primePoints[0][1]);
    }
    this.ctx.stroke();
    this.ctx.closePath();
    this.output('');
    var value = document.getElementById('value_valueBox');
    var v = parseInt(value.value);
    value = null;
    var range = 100;
    var step = 10/(v*0.1);
    if(v > 0){
      for(var i =  (0) ;i<(range);i += step){
          this.appendOutput(this.colorOfPoints(rawDiff,primePoints,i*0.01 ));
       //   this.appendOutput(this.colorOfPoints(rawDiff,primePoints,1 - i*0.01 ));
      }
    }
}

polySystemClass.prototype.rotate = function(theta, p1,p2){  
  return [
  Math.cos(theta) * (p1[0]-p2[0]) - 
  Math.sin(theta) * (p1[1]-p2[1]) + p2[0],
  Math.sin(theta) * (p1[0]-p2[0]) + 
  Math.cos(theta) * (p1[1]-p2[1]) + p2[1]
  ]
}

polySystemClass.prototype.appendOutput = function(text){  
    var output = document.getElementById('output');
    var oText =  output.innerHTML ;
    this.deleteDomElement(output);
    output = null;
    this.updateInnerHtml('output', oText+text);
}

polySystemClass.prototype.output = function(text){  
  this.updateInnerHtml('output', text);
}

polySystemClass.prototype.updateInnerHtml = function(updateId, newHTML){
    var domRef = document.getElementById(updateId);
    if(domRef){
      this.removeChildren(updateId);
      domRef.innerHTML = newHTML;
    }
    this.deleteDomElement(domRef);
    domRef = null;
 }

polySystemClass.prototype.deleteDomElement = function(ref){
  var a = [ref];
  delete a[0];
  ref = null;
  a = null;
}
  
polySystemClass.prototype.removeChildren = function(id){
   var domObj = document.getElementById(id);
   var childrenLength = domObj.childNodes.length;
   for(var i = childrenLength;i>0;i--){
      domObj.removeChild(domObj.childNodes[0]);
      delete domObj.childNodes[0];
   }
   this.deleteDomElement(domObj);
   domObj = null;
}

 
 polySystemClass.prototype.colorOfPoints = function(rawDiff,points,value) {
    var set = [];
    var ret = "";
    for(var i = 0;i < points.length;i++){
      set[i] = this.postionColor(rawDiff,points[i],value)
    }
    
    for(var i = 0;i < set.length;i++){
      ret += '<div class="colorUnit"><div style="background-color:'+set[i][3]+';"class="color">'+
            '</div><div>'+this.colorToHex(set[i][0],set[i][1],set[i][2])+'</div></div>&nbsp;'
    }
    return ret + "&nbsp;&nbsp;|&nbsp;&nbsp;";
 }
 
 polySystemClass.prototype.colorToHex = function colorToHex(red,green,blue) {
       var red = parseInt(red);
       var green = parseInt(green);
       var blue = parseInt(blue);

       var rgb = blue | (green << 8) | (red << 16);
       return '#' + rgb.toString(16);
 };

 
 polySystemClass.prototype.postionColor = function(rawDiff,point,value) {
   var currentX = rawDiff[0] + point[0];
   var currentY = rawDiff[1] + point[1];
   // var currentX = rawPoint[0];
  //  var currentY = rawPoint[1];
    
    
    var theta    = Math.atan2(currentY, currentX);
    var d      = currentX * currentX + currentY * currentY;
         
    if (d > this.radiusSquared) {
       currentX = this.radius * Math.cos(theta);
       currentY = this.radius * Math.sin(theta);
       theta = Math.atan2(currentY, currentX);
       d = currentX * currentX + currentY * currentY;
    } 
    
    

    return this.hsvToRgb( (theta + Math.PI) / (Math.PI * 2), 
                           Math.sqrt(d) / this.radius,
                           value );
  }
        

 // Created a shorter version of the HSV to RGB conversion function in TinyColor
 // https://github.com/bgrins/TinyColor/blob/master/tinycolor.js
 polySystemClass.prototype.hsvToRgb = function(h, s, v) {
   h*=6;
   var i = ~~h,
       f = h - i,
       p = v * (1 - s),
       q = v * (1 - f * s),
       t = v * (1 - (1 - f) * s),
       mod = i % 6,
       r = [v, q, p, p, t, v][mod] * 255,
       g = [t, v, v, q, p, p][mod] * 255,
       b = [p, p, t, v, v, q][mod] * 255;
   
   return [r, g, b, "rgb("+ ~~r + "," + ~~g + "," + ~~b + ")"];
 }
 
   
 polySystemClass.prototype.setupMouseControls = function(element){
   var paramSet = {instanceObj: this, 'element':element};
   YAHOO.util.Event.addListener('c', "mousewheel", this.mousePage, paramSet);
   YAHOO.util.Event.addListener('c', "DOMMouseScroll", this.mousePage, paramSet);
 }
 
  polySystemClass.prototype.mousePage = function(eventObj, paramSet){
    paramSet.instanceObj.mousePage_p(eventObj, paramSet.element);
  }
  
  polySystemClass.prototype.mousePage_p = function(eventObj, element){
    var delta = eventObj.detail ? eventObj.detail*(-120) : eventObj.wheelDelta;
    var direction = (delta > 0) ? 'up' : 'down';
    var amount = 1;
    if(direction == 'up'){
      amount *= -1;
    }
    var SystemType = document.getElementById('SystemType');
    if( Boolean(SystemType.value !== 'Polygonal')){
      this.theta += amount* Math.PI / 180 ;
      this.redrawColorWheel(eventObj);
    }    
    SystemType == null;
  }
  
  polySystemClass.prototype.createSlider = function(name, dRange,dTickSize, initValue){
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
    
    
  }
  
  polySystemClass.prototype.report = function(sliderObj, paramSet){
    paramSet.instanceObj.report_p(this,sliderObj,paramSet.element);
  }
        
  polySystemClass.prototype.report_p = function(obj, value, element){
      var valueBox = document.getElementById(element.name + "_valueBox");
      valueBox.value = value;
      valueBox = null;
      var eventObj ={};
      this.redrawColorWheel(eventObj);
  }
  
        