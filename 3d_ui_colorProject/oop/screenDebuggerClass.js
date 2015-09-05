  function screenDebuggerClass(options){
    try{
      this.elements = {};
    //  this.h = new helperClass();
      this.initializeOptions(options);
      this.initialize();
    }catch(err){
      debugger;
    }
  }
  
  screenDebuggerClass.prototype.constructor = screenDebuggerClass;

  /*------------------------------------------------------------------------------------------------*/

  screenDebuggerClass.prototype.initializeOptions = function(options){
    for( o in options){
      this[o] = options[o];
    }
  }
  
  screenDebuggerClass.prototype.initialize = function(){
  }
  
  screenDebuggerClass.prototype.updateObjects = function(obj){
    this.obj = obj;
    
  }
  screenDebuggerClass.prototype.createBaseGridStd = function(){
    this.createBaseGrid({ bg: 0x000000, o: 1, floor: -0.04, step: 1, size: 14 } );
  }
      
  screenDebuggerClass.prototype.createBaseGrid = function(options){
    var line_material = new THREE.LineBasicMaterial( { color: options.bg , opacity:options.o  } );
    var geometry = new THREE.Geometry();
    var floor = options.floor, step = options.step, size = options.size;
    for ( var i = 0; i <= size / step * 2; i ++ ) {
      geometry.vertices.push( new THREE.Vertex( new THREE.Vector3( - size, floor, i * step - size ) ) );
      geometry.vertices.push( new THREE.Vertex( new THREE.Vector3(   size, floor, i * step - size ) ) );
      geometry.vertices.push( new THREE.Vertex( new THREE.Vector3( i * step - size, floor, -size ) ) );
      geometry.vertices.push( new THREE.Vertex( new THREE.Vector3( i * step - size, floor,  size ) ) );
    }
    var line = new THREE.Line( geometry, line_material, THREE.LinePieces );
    this.scene.add( line );
  }
      
  screenDebuggerClass.prototype.createOrthogonalLines = function(s){
    var lines =  [this.createLine(0xFF0000, 1, new THREE.Vector3(s,0,0)),
                  this.createLine(0x00FF00, 1, new THREE.Vector3(0,s,0)),
                  this.createLine(0x0000FF, 1, new THREE.Vector3(0,0,s))];
    return lines;
  }
  
  screenDebuggerClass.prototype.createLine = function(color, opacity, vector){
    var geometry = new THREE.Geometry();
    var line_material = new THREE.LineBasicMaterial( { color: color , opacity:opacity  } );
    
    geometry.vertices.push( new THREE.Vertex(vector));
    geometry.vertices.push( new THREE.Vertex(owl.deepCopy(vector).multiplyScalar(-1)));
  
    var line = new THREE.Line( geometry, line_material, THREE.LinePieces );
    this.scene.add( line );
    return line;
  }
  
  screenDebuggerClass.prototype.createStats = function(scene){
    var stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    stats.domElement.style.zIndex = 100;
    var container = document.getElementById( this.containerId );
    container.appendChild( stats.domElement );
    container = null;
    return stats;
  }
      
  
 
