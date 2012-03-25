  function hudPanels(options){
    try{
      this.elements = {};
      this.h = new helperClass();
      this.d = (new debugClass({createNode:1, nodeId: 'test2'}))
      this.initializeOptions(options);
      this.initialize();
      this.time = 0;
    }catch(err){
      debugger;
    }
  }
  
  hudPanels.prototype.constructor = hudPanels;

  /*------------------------------------------------------------------------------------------------*/

  hudPanels.prototype.initializeOptions = function(options){
    for( o in options){
      this[o] = options[o];
    }
  }
  
  hudPanels.prototype.initialize = function(){
    var rezStep = 20;
    this.panel1 = this.init_plain({ width:this.size, height:this.size, 
                                    sHeight:rezStep, sWidth:rezStep});
   this.panel1.position.set( this.initipos.x, this.initipos.y, this.initipos.z );
   //this.panel1.rotation.x = Math.PI*(3/4);
   this.panel1.rotation.y = Math.PI*(0.5);
   this.scene.add(this.panel1);
    this.mapOneColor(this.panel1.geometry,new THREE.Color( 0xffffff ));
  }
  
  hudPanels.prototype.init_plain = function(options){
    var geometry = new THREE.PlaneGeometry( options.width, options.height, options.sWidth, options.sHeight  );
    
    
  //  this.mapOneColor(geometry,new THREE.Color( 0x000000 ));
    var m = new THREE.MeshLambertMaterial( { color: 0xffffff, shading: THREE.FlatShading, vertexColors: THREE.VertexColors } )
    //m.vertexColors = true;
    var object = new THREE.Mesh(geometry, m ) ;
   // 
                             
    object.geometry.doubleSided = true;
    object.geometry.filpSided = true;
    object.geometry.overdraw = true;
    
    return object ;
  }
  
  hudPanels.prototype.changeColorOfPanel = function(color){
 //   this.mapOneColor(this.panel1.geometry,color);
    var rezStep = 20;
    this.scene.remove(this.panel1);
    this.panel1 = null;
    
    this.panel1 = this.init_plain({ width:this.size, height:this.size, 
                                    sHeight:rezStep, sWidth:rezStep});
    if(color){
      this.mapOneColor(this.panel1.geometry,color);
    }
   this.scene.add(this.panel1);
  }
  
  hudPanels.prototype.mapOneColor = function(geometry, newColor){
    var len = geometry.vertices.length;
    var faceIndices = [ 'a', 'b', 'c', 'd' ];
    var color, f, p, n, vertexIndex;
    for ( var i = 0; i < geometry.faces.length; i ++ ) {
      f  = geometry.faces[ i ];
      n = ( f instanceof THREE.Face3 ) ? 3 : 4;
      for( var j = 0; j < n; j++ ) {
        vertexIndex = f[ faceIndices[ j ] ];
        p = geometry.vertices[ vertexIndex ].position;
        color = new THREE.Color( 0xffffff );
        color.setRGB(newColor.r,newColor.g, newColor.b);
        f.vertexColors[ j ] = color;
       /*
       this.d.append("("+  f.vertexColors[ j ].r + ","+ 
                             f.vertexColors[ j ].g+ ","+ 
                             f.vertexColors[ j ].b+ ")");
      */
      }
    }
  }
  
  hudPanels.prototype.updatePosition = function(camera){
    var pos =  owl.deepCopy(camera.getTarget());
    pos.z += 10;
    pos.x += 50;
    pos.y -= 20;
    
    var vector = new THREE.Vector3( pos.x, pos.y, pos.z );
    var normalizedPosition = vector.normalize()
    var final = vector.add(normalizedPosition,pos);
      
    this.changePosition(final);
    this.changeRotation(camera.rotation)
    
  }
  
  hudPanels.prototype.changePosition = function(pos){
   this.panel1.position.set( pos.x, pos.y, pos.z );
  }
  
  hudPanels.prototype.changeRotation = function(rot){
    this.changeRotation_p(this.panel1,rot);
  }
  
  hudPanels.prototype.changeRotation_p = function(panel,rot){
   panel.rotation.x = rot.x;
   panel.rotation.y = rot.y;
   panel.rotation.z = rot.z;
  }
  
  
  