

      window.onload = function(){
        if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
        init();
      }
      
      function init() {
        var scene    = createScene();
        var dims     = getDims();
        var renderer = createRenderer(dims);
        var camera   = createCamera(scene, dims);
        var controls = createControls(camera);
        var stats    = createStats();
        
        var piontLight = createPiontLight(scene);
        
        createBaseGrid(scene);
        
        var element = { 'scene':scene, 
                        'camera':camera, 
                        'renderer':renderer, 
                        'controls':controls, 
                        'stats':stats, 
                        'pointLight': piontLight, 
                        current: 10,
                        cutoff: false};
         
         setupMouseControls(element);
        // 'models/film_case.dae' 
        // 'three_js/examples/models/monster.dae'
         var loader = new THREE.ColladaLoader();
         loader.load('models/film_case.dae' , colladaReady_C(element));
      }
      
      function getDims(){
        var dims = [window.innerWidth,
                    window.innerHeight];
        dims[0] = dims[0] - parseInt(dims[0]* 5/100);
        dims[1] = dims[1] - parseInt(dims[1]* 15/100) ;
        return dims;
      }
      
      function createScene(){
        return new THREE.Scene();
      }
      
      function createRenderer(dims){
        var renderer = new THREE.WebGLRenderer( { antialias: false } );
        renderer.setClearColorHex( 0xffffff, 1 );
        renderer.setSize( dims[0], dims[1] );

        var container = document.getElementById( 'container' );
        container.appendChild( renderer.domElement );
        container = null;
        return renderer;
      }
      
      function createCamera(scene, dims){
         var viewAngle = 45,
             aspect = dims[0] / dims[1],
             near = 1,
             far = 10000;
             
         var camera = new THREE.PerspectiveCamera(viewAngle,aspect,near,far);
         
         scene.add(camera);
         return camera;
      }
      
      function createControls(camera){
        var controls = new THREE.FirstPersonControls( camera );
        controls.lookSpeed = 0.125;
        controls.movementSpeed = 10.0
      //  controls..mouseDragOn = true;
        /*

                controls.rotateSpeed = 1.0;
                controls.zoomSpeed = 1.2;
                controls.panSpeed = 0.8;

                controls.noZoom = false;
                controls.noPan = false;

                controls.staticMoving = true;
                controls.dynamicDampingFactor = 0.3;

                controls.keys = [ 65, 83, 68 ];
                //controls.autoForward = true;
        */
        return controls;
      
      }
      function colladaReady_C(element){
        //var instanceObj = this;
        var iElement = element;
        return function( collada ) {
          colladaReady_p(iElement, collada);
        }
      }
      
      function colladaReady_p(element, collada){
        try{
          var dae = collada.scene;
          
          dae.scale.x = dae.scale.y = dae.scale.z = 0.02;
          
          dae.rotation.x = -Math.PI/2;
          dae.rotation.z = -Math.PI/4;
          
          //  dae.rotation.y = Math.PI/4;
          //  camera.lookAt(new THREE.Vector3(4,0,0 ) );
        
          element.camera.position.set( 10, 10, -2 );
          element.camera.lookAt(dae.position);
          
          dae.updateMatrix();
          
          element.scene.add(dae);
          element.renderer.render(element.scene, element.camera);
          
          element.camera.position.set( 0, 10, -10  );

          render_animate(element);
        }catch(err){
          debugger;
        }
      }
       
      function render_animate(element){
        (function animate(){
          requestAnimationFrame( animate );
          render(element);
          element.stats.update();
         })();
       }
              
       function render(element) {
         if(!element.cutoff){
           element.controls.update();
         }
         element.renderer.render( element.scene, element.camera );
       }
      
      function createPiontLight(scene){

        // lights
/*
        light = new THREE.DirectionalLight( 0xffffff );
        light.position.set( 1, 1, 1 );
        scene.add( light );

        light = new THREE.DirectionalLight( 0x002288 );
        light.position.set( -1, -1, -1 );
        scene.add( light );

        light = new THREE.AmbientLight( 0x222222 );
        scene.add( light );
*/
        var pointLight = new THREE.PointLight( 0xffffff, 0.75 );
        //pointLight.position.x = 1000;
        pointLight.position.set(-25,-25,-25);
        scene.add( pointLight );
        return pointLight;
      }
      
      function createBaseGrid(scene){
        var line_material = new THREE.LineBasicMaterial( { color: 0x000000, opacity: 1 } );
        var geometry = new THREE.Geometry();
        var floor = -0.04, step = 1, size = 14;
      
        for ( var i = 0; i <= size / step * 2; i ++ ) {
          geometry.vertices.push( new THREE.Vertex( new THREE.Vector3( - size, floor, i * step - size ) ) );
          geometry.vertices.push( new THREE.Vertex( new THREE.Vector3(   size, floor, i * step - size ) ) );
          geometry.vertices.push( new THREE.Vertex( new THREE.Vector3( i * step - size, floor, -size ) ) );
          geometry.vertices.push( new THREE.Vertex( new THREE.Vector3( i * step - size, floor,  size ) ) );
        }
      
        var line = new THREE.Line( geometry, line_material, THREE.LinePieces );
        scene.add( line );
      }
      
      function createStats(){
        var stats = new Stats();
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.top = '0px';
        stats.domElement.style.zIndex = 100;
        var container = document.getElementById( 'container' );
        container.appendChild( stats.domElement );
        container = null;
        return stats;
      }
      
      function setupMouseControls(element){
        var container = document.getElementById( 'container' );
        container.onmouseout = mouseCut_C(element);
        container.onmouseover = mouseGue_C(element);
        container =null;
        
        document.body.onmousewheel = mousePage_C(element);
        document.body.addEventListener("DOMMouseScroll", mousePage_C(element), true);
      }
      
      function mouseCut_C(element){
        var iElement = element;
        return function(){
          iElement.cutoff = true;
        }
      }
      
      function mouseGue_C(element){
        var iElement = element;
        return function(){
          iElement.cutoff = false;
        }
      }

      
      function mousePage_C(element){
        var iElement = element;
        return function(eventObj){
          var delta = eventObj.detail ? eventObj.detail*(-120) : eventObj.wheelDelta;
          var direction = (delta > 0) ? 'up' : 'down';
          var amount = 1;
          if(direction == 'up'){
            amount *= -1;
          }
          iElement.current = iElement.current + amount;
        }
      }
      