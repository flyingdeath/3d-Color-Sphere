window.onload = function(){
  try{
  // set the scene size
      
  // set some camera attributes
  /*---------------------------------------------------------------------------------------*/

  // get the DOM element to attach to

  // create a WebGL renderer, camera
  // and a scene
  var WIDTH  = window.innerWidth,
      HEIGHT = window.innerHeight;
  
  
  WIDTH = WIDTH - parseInt(WIDTH* 5/100);
  HEIGHT = HEIGHT - parseInt(HEIGHT* 15/100) ;
  
  var VIEW_ANGLE = 45,
      ASPECT = WIDTH / HEIGHT,
      NEAR = 1,
      FAR = 2000;

  var stats = new Stats();
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.top = '0px';
  stats.domElement.style.zIndex = 100;                     
  
      
  var container = document.getElementById('container');
  var renderer  = new THREE.WebGLRenderer();
  renderer.setSize(WIDTH, HEIGHT);        
  renderer.setClearColorHex( 0x000000, 1 );

  container.appendChild(renderer.domElement);
  container.appendChild(stats.domElement );
  container = null;
  //var controls;
  
  var scene     = new THREE.Scene();

  var camera = new THREE.PerspectiveCamera( 120, window.innerWidth / window.innerHeight, 1, 2000 );

var controls = new THREE.RollControls( camera );

        controls.movementSpeed = 100;
        controls.lookSpeed = 3;
        controls.constrainVertical = [ -0.5, 0.5 ];

  /*---------------------------------------------------------------------------------------*/

   var line_material = new THREE.LineBasicMaterial( { color: 0xFFFFFF, opacity: 1 } ),
     geometry = new THREE.Geometry(),
     floor = -0.04, step = 1, size = 14;

   for ( var i = 0; i <= size / step * 2; i ++ ) {

     geometry.vertices.push( new THREE.Vertex( new THREE.Vector3( - size, floor, i * step - size ) ) );
     geometry.vertices.push( new THREE.Vertex( new THREE.Vector3(   size, floor, i * step - size ) ) );

     geometry.vertices.push( new THREE.Vertex( new THREE.Vector3( i * step - size, floor, -size ) ) );
     geometry.vertices.push( new THREE.Vertex( new THREE.Vector3( i * step - size, floor,  size ) ) );

   }

   var line = new THREE.Line( geometry, line_material, THREE.LinePieces );
   scene.add( line );
  renderer.render(scene, camera);
  
  /*---------------------------------------------------------------------------------------*/

    // create a point light
//    particleLight = new THREE.Mesh( new THREE.SphereGeometry( 4, 8, 8 ), new THREE.MeshBasicMaterial( { color: 0xFF0000} ) );
//    scene.add( particleLight );
/*
    // Lights

    scene.add( new THREE.AmbientLight( 0xcccccc ) );/*Math.random() * 0xffffff*/
    var directionalLight = new THREE.DirectionalLight(0xeeeeee );
    directionalLight.position.x = Math.random() - 0.5;
    directionalLight.position.y = Math.random() - 0.5;
    directionalLight.position.z = Math.random() - 0.5;
    directionalLight.position.normalize();
    scene.add( directionalLight );

/*
    var pointLight = new THREE.PointLight( 0xffffff, 4 );
    pointLight.position.x = 10000;
    scene.add( pointLight );
*/    
    var pointLight = new THREE.PointLight( 0xffffff, 0.75 );
    pointLight.position.x = 10000;
    scene.add( pointLight );
    stats.update();
    renderer.render(scene, camera);
  
  /*---------------------------------------------------------------------------------------*/
   var loader = new THREE.ColladaLoader();
  // 'models/film_case.dae' //'three_js/examples/models/monster.dae'
   loader.load('models/film_case.dae' , colladaReady_C(scene, camera, renderer, controls, stats));
  
  /*---------------------------------------------------------------------------------------*/
  }catch(err){
    debugger;
  }
}
  
  /*---------------------------------------------------------------------------------------*/
  

function colladaReady_C(sen, cam, ren, con, st){
  var scene = sen, camera = cam, renderer = ren, controls = con, stats = st;
  return function colladaReady( collada ) {
    try{
        var dae = collada.scene;
        dae.scale.x = dae.scale.y = dae.scale.z = 0.02;
        dae.rotation.x = -Math.PI/2;
        dae.rotation.z = -Math.PI/4;
    //    dae.rotation.y = Math.PI/4;
        dae.updateMatrix();
        scene.add(dae);
        renderer.render(scene, camera);
        
        function render() {
          controls.update();
          renderer.render( scene, camera );
        }
       (function animate(){
         requestAnimationFrame( animate );
         render();
         stats.update();
        })();
    }catch(err){
      debugger;
    }
  }
}
  
    
  
  /*---------------------------------------------------------------------------------------*/
  
  /*---------------------------------------------------------------------------------------*/
  
  /*---------------------------------------------------------------------------------------*/
  
  /*---------------------------------------------------------------------------------------*/
