
  /*----------Main--------------------------------------------------------------------------*/
  window.onload = function(){
  
    var containerId = 'container';
    var film_case   = './models/film_case.dae';
    var room        = './models/glass_room_0.js'
    var sky         = './models/sky_1.js'
    
    var element = {current: 1, 
                   cutoff: false,
                   clock: new THREE.Clock()};

    var sceneObj = new sceneControllerClass({'containerId':containerId, 
                                             options: {backgroundColor: 0xffffff,
                                                       backgroundOpacity: 1, 
                                                       percentageOffSet: [5,17],
                                                       cameraCtype:'perspective',
                                                       near: 1, far: 1000000,
                                                       renderCallBack:renderCallBack}
                                             });
                                             
    var userControlObj = new userControlsClass({'element': element, 
                                                'containerId': containerId});
                                                
    var controls = userControlObj.createControls(sceneObj.camera, 
                                                  {conType:'firstPerson',
                                                   lookSpeed: 0.095,
                                                   movementSpeed:40.0, 
                                                   initPos:new THREE.Vector3( 10, 10, 10 ), 
                                                   initLookAtPos: new THREE.Vertex(0, 0, 0) });
                                                   
    
   //var wp = new waterPsychicsClass({'scene':sceneObj.scene, 'containerId': containerId});
   //wp.createWaterBase({  bg: 0x0c2734, o: 1, width:20000, height:20000, sHeight:5, sWidth:5  });
        

    var sd = new screenDebuggerClass({'scene':sceneObj.scene, 'containerId': containerId});
    sd.createBaseGridStd();
    sd.createOrthogonalLines(10000);

    element.stats      = sd.createStats();
    element.pointLight = new lightControllerClass({'scene':sceneObj.scene}).createPiontLight({ bg: 0xffffff, o:0.75,
                                                                                               x:300,y:300,z:0});
                                                 

    element.scene      = sceneObj.scene;
    element.camera     = sceneObj.camera;
    element.renderer   = sceneObj.renderer;
    element.controls   = controls;
   // element.wp         = wp;
    element.renderCallBack = sceneObj.options.renderCallBack;
  
    userControlObj.regKeyAction('DOM_VK_M', function(eventObj){
      var pos = owl.deepCopy(modelObj.getModelPosition(film_case));
     // pos.y = -1*pos.y
      if(eventObj.type == "keydown"){
        element.cutoff = true;
         controls.updateCords(pos, element.current);
      //   controls.update();
      }else{
        element.cutoff = false;
      }
      
    });
    
    var modelObj = new modelLoaderClass();
   // modelObj.loadModels([room], element, {mType:'json', fn: room_ready});
   // modelObj.loadModels([sky], element, {mType:'json', fn: sky_ready});
   // modelObj.loadModels([film_case], element, {mType:'collada', fn: film_case_ready});
    
    sceneObj.render_animate(element);
    
    
  }
  /*---------------------------------------------------------------------------------------*/
  
  var renderCallBack = function(element){
    return 0;// return element.wp.waterMovementStep(element);
  }
  
  /*---------------------------------------------------------------------------------------*/
  
  var sky_ready = function(element, geometry, fname){
     try{
      var material1 = new THREE.MeshPhongMaterial( { shininess: 30, 
                                                     shading: THREE.SmoothShading, 
                                                     map: THREE.ImageUtils.loadTexture( 
                                                    "models/maps/SkyDome-Cloud-Few-Early.png" ) } ) 
       

       var mesh = new THREE.Mesh( geometry, material1);
       mesh.scale.x = mesh.scale.y = mesh.scale.z = 1;
       mesh.rotation.x = -Math.PI/2;
       mesh.rotation.y = -Math.PI/2;
       mesh.rotation.z = -Math.PI/2;
       mesh.translateY(-500);
      return mesh;
     }catch(err){
       debugger;
       return null;
     }
  }
  /*---------------------------------------------------------------------------------------*/
  
  var room_ready = function(element, geometry, fname){
     try{
       var material = new THREE.MeshPhongMaterial({opacity: 0.4, color: 0x222222, ambient:   0xFFFFFF, 
                        specular:  0x000000});
        var mGlass = new THREE.MeshLambertMaterial( {
                color: 0x222222,
                opacity: 0.3,
                transparent: true,  shininess: 800, 
                                specular:  0xFFFFFF
            } );
       var mesh = new THREE.Mesh( geometry, mGlass);
       mesh.scale.x = mesh.scale.y = mesh.scale.z = 1;
       mesh.rotation.x = -Math.PI;
       mesh.rotation.y = -Math.PI/2;
       mesh.rotation.z = -Math.PI/2;
       mesh.translateY(560)
      return mesh;
     }catch(err){
       debugger;
       return null;
     }
  }
  /*---------------------------------------------------------------------------------------*/
  
  var film_case_ready =  function(element, collada, fname){
    try{
      var dae = collada.scene;
      
      dae.scale.x = dae.scale.y = dae.scale.z = 0.2;
      
      dae.rotation.x = -Math.PI/2;
      dae.rotation.z = -Math.PI/4;
      
      dae.translateZ(1);
      dae.translateX(12);
      dae.translateY(123);
      
      dae.updateMatrix();
      return dae;
    }catch(err){
      debugger;
    }
  }
  /*---------------------------------------------------------------------------------------*/