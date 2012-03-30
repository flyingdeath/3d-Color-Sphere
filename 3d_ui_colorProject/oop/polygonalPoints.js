
  function polygonalPoints(options){
    this.initializeOptions(options);
    this.lineColor ="black"
    this.theta = 0;
    this.dontrotate = null;
    this.storedPoints = [];
//    this.d = new debugClass({createNode:1})

  }

  polygonalPoints.prototype.constructor = polygonalPoints;


  polygonalPoints.prototype.initializeOptions = function(options){
    for( o in options){
      this[o] = options[o];
    }
  }

  polygonalPoints.prototype.update = function(pos,theta, amount){ 
    var SystemType1 = document.getElementById('SystemType_XColor');
    var SystemType = document.getElementById('SystemType');
    var width = document.getElementById('width_valueBox');
    var height = document.getElementById('height_valueBox');
    var size = document.getElementById('size_valueBox');
    var valueType1 = SystemType1.value;
    var vWidth = parseInt(width.value);
    var vHeight = parseInt(height.value);
    var vSize = parseInt(size.value);
    var valueType = SystemType.value;
    
    if(theta){
      this.theta = theta
    }
    
    if(amount && valueType !== 'Polygonal'){
      this.theta +=  amount* Math.PI / 180 ;
    }
 //   this.d.output(this.theta * (180/Math.PI) )
    
    
    if(pos){
      this.pos = pos;
    }else{
      pos = this.pos;
    }
    
    SystemType1 =null;
    SystemType =null;
    width =null;
    height =null;
    size =null;
    if(valueType1 == 'Geometric' && pos){
      switch(valueType){ 
        case 'Complementary': 
          this.drawLine_new(pos,vSize);
          break;
        case 'Analogous': 
          this.drawThreePointLine_new(pos,vSize);
          break;
        case 'Triadic': 
          this.drawTriangle_new(pos,vSize);
          break;
        case 'Split-Complementary': 
          this.drawIsoscelesTriangle_new(pos, vWidth, vHeight);
          break;
        case 'Rectangle': 
          this.drawRectangle_new(pos, vWidth, vHeight);
          break;
        case 'Square': 
          this.drawSquare_new(pos,vSize);
          break;
        case 'Polygonal': 
          this.drawPolygonal_new(pos,vSize);
          break;
      }
      return this.polygon;
    }else{
      if(this.polygon){
        this.scene.remove(this.polygon);
        this.polygon = null;
      }
      return null;
    }
  }

  polygonalPoints.prototype.drawThreePointLine_new = function(pos, size){ 
    var amount = 45;
    var points = [[pos[0], pos[1]],
                  [pos[0]+ size, pos[1]]];



    points[1] = this.rotate(amount* Math.PI / 180, points[1] , points[0]);
    points[2] = [points[1][0],points[1][1]];
    points[2][0] += size;
    points[2] = this.rotate(amount* Math.PI / 180, points[2] , points[0]);

    this.drawPolygon(points, pos, false, false,THREE.LineStrip );
  }

  polygonalPoints.prototype.drawPolygonal_new = function(pos, size){ 
    var a = [pos]
    if(this.storedPoints.length < size){
      this.storedPoints = this.storedPoints.concat(a);
    }else{
      this.storedPoints = a;
    }

    this.drawPolygon(this.storedPoints, [0,0], true, true);
  }

  polygonalPoints.prototype.drawLine_new = function( pos, size){ 

    var points = [
                  [pos[0], pos[1]],
                  [pos[0], pos[1] + size]
                 ];


    this.drawPolygon(points, pos, false);
  }

  polygonalPoints.prototype.drawIsoscelesTriangle_new = function(pos, width, height){ 
    var a1 = 95; 
    var a2 = 15;
    var points = [[pos[0], pos[1]],
                  [pos[0]+ height, pos[1]]];



    points[1] = this.rotate(a1* Math.PI / 180, points[1] , points[0]);
    points[2] = [points[1][0],points[1][1]];
    points[2][0] += width;
    points[2] = this.rotate(a2* Math.PI / 180, points[2] , points[0]);

    this.drawPolygon(points, pos, true);
  }


  polygonalPoints.prototype.drawRectangle_new = function(pos, width, height){ 

    var points = [
                  [pos[0], pos[1]],
                  [pos[0] + width, pos[1]],
                  [pos[0] + width, pos[1] + height],
                  [pos[0], pos[1] + height]
                 ];


    this.drawPolygon(points, pos, true);
  }


  polygonalPoints.prototype.drawSquare_new = function(pos, size){ 

    var points = [
                  [pos[0], pos[1]],
                  [pos[0] + size, pos[1]],
                  [pos[0] + size, pos[1] + size],
                  [pos[0], pos[1] + size]
                 ];


    this.drawPolygon(points, pos, true);
  }


  polygonalPoints.prototype.drawSquare_new = function(pos, size){ 

    var points = [
                  [pos[0], pos[1]],
                  [pos[0] + size, pos[1]],
                  [pos[0] + size, pos[1] + size],
                  [pos[0], pos[1] + size]
                 ];


    this.drawPolygon(points, pos, true);
  }

  polygonalPoints.prototype.drawTriangle_new = function(pos, size){ 

    var points = [
                  [pos[0], pos[1]],
                  [pos[0] + size, pos[1]],
                  [pos[0], pos[1] + size]
                 ];
                 
    this.drawPolygon(points, pos, true);
  }

  polygonalPoints.prototype.drawPolygon = function(points, pos, closePath, dontrotate, LineType){ 
    var line_material = new THREE.LineBasicMaterial( { color: this.options.bg , opacity:this.options.o  } );
    var geometry      = new THREE.Geometry();
    
    if(!dontrotate){
      for(var i = 0;i<points.length;i++){
        points[i] = this.rotate(this.theta + (Math.PI*4), points[i], pos)
      }
    }
    
    for(var i = 0;i<points.length;i++){
      if( points[i]){
        geometry.vertices.push( new THREE.Vertex( new THREE.Vector3( points[i][0],pos[2],points[i][1] ) ) );
      }
    }
    if(closePath){
      geometry.vertices.push( new THREE.Vertex( new THREE.Vector3( points[0][0],pos[2],points[0][1] ) ) );
    }
    if(this.polygon){
      this.scene.remove(this.polygon);
    }
    if(LineType == undefined){
      if(closePath){
        LineType = THREE.LineStrip;
      }else{
         LineType = THREE.LinePieces;
      }
    }
    
    
    this.polygon = new THREE.Line( geometry, line_material,LineType);
    this.scene.add(this.polygon);
  }
  
polygonalPoints.prototype.rotate = function(theta, p1,p2){  
  return [
  Math.cos(theta) * (p1[0]-p2[0]) - 
  Math.sin(theta) * (p1[1]-p2[1]) + p2[0],
  Math.sin(theta) * (p1[0]-p2[0]) + 
  Math.cos(theta) * (p1[1]-p2[1]) + p2[1]
  ]
}
