
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
                                                       percentageOffSet: [0,0],
                                                       viewAngle:(45)* (180/Math.PI) ,
                                                       cameraCtype:'perspective',
                                                       near: 1, far: 1000000,
                                                       renderCallBack:renderCallBack}
                                             });
                                                      // dims: [1000,625],
                                             
    var userControlObj = new userControlsClass({'element': element, 
                                                'containerId': containerId,
                                                'mouseDownCallBack':mouseDownCallBack,
                                                'mouseMoveCallBack':mouseMoveCallBack,
                                                'mouseUpCallBack':mouseUpCallBack });
    var controlRadius = 250;
    
    var controls = userControlObj.createControls(sceneObj.camera, 
                                                  {conType:'firstPerson',
                                                   lookSpeed: 0.095,
                                                   movementSpeed:60.0, 
                                                   rotateSpeed: 1.0,
                                                   zoomSpeed: 1.2,
                                                   panSpeed: 0.2,
                                                   noZoom: false,
                                                   noPan: false,
                                                   staticMoving: false,
                                                   dynamicDampingFactor: 0.3,
                                                   minDistance: controlRadius * 1.1,
                                                   maxDistance: controlRadius * 100,
                                                   keys: [ 65, 83, 68 ], // [ rotateKey, zoomKey, panKey ]
                                                   initPos:       new THREE.Vector3(0,0,0),
                                                   initLookAtPos: new THREE.Vector3(1,0,1)
                                                 //  initPos:       new THREE.Vector3(752,431,-48),
                                                 //  initLookAtPos: new THREE.Vector3(653,445,-44)
                                                  },sceneObj.renderer);
                                                   
    
   //var wp = new waterPsychicsClass({'scene':sceneObj.scene, 'containerId': containerId,
   //                                 options: { bg: 0x0c2734, o: 1, width:20000, height:20000, sHeight:5, sWidth:5}});
   
   
   
        

    var sd = new screenDebuggerClass({'scene':sceneObj.scene, 'containerId': containerId});
 // sd.createBaseGridStd();
 //  sd.createOrthogonalLines(10000);
 // element.cameraLines = sd.createOrthogonalLines(100);

    element.stats      = sd.createStats();
//    element.pointLight = new lightControllerClass({'scene':sceneObj.scene}).createPiontLight({ bg: 0xffffff, o:0.75,
//                                                                                               x:300,y:300,z:0});
                                                                                               
   var step = 1;
   var i = 0.1
   element.pointLight4 = new lightControllerClass({'scene':sceneObj.scene}).createAmbientLight({ bg: 0xffffff, o:i,
                                                                                              x: step,
                                                                                              y:0,
                                                                                              z:0});
  
   element.pointLight4.intensity = i;
   //100, 600, 0
    var geo = new geometric3dShapes({'scene':sceneObj.scene, size: 200,initipos: new THREE.Vector3(  0, 0, 0  )});
    
   
    var hud = new hudPanels({'scene':sceneObj.scene,'size':10,initipos: new THREE.Vector3(  0, 0, 0  )});
    var  hudHTML = new hudClass({'scene':sceneObj, radius: 200, hudId: 'htmlHud', heightOffset:75, outputId: 'output',offSet: 520 });
   

    element.sceneObj   = sceneObj;
    element.scene      = sceneObj.scene;
    element.camera     = sceneObj.camera;
    element.renderer   = sceneObj.renderer;
    element.controls   = controls;
    //element.wp       = wp;
    element.geo        = geo;
    element.hud        = hud;
    element.hudHTML    = hudHTML;
      element.d = (new debugClass({createNode:1, nodeId: 'test2'}))
    element.containerId = containerId;
    element.renderCallBack = sceneObj.options.renderCallBack;
/*
element.mouseMoveCallBack = sceneObj.options.mouseMoveCallBack;
    element.mouseDownCallBack = sceneObj.options.mouseDownCallBack;
    element.mouseUpCallBack = sceneObj.options.mouseUpCallBack;
  */
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
    return 0;// 
  // return element.wp.waterMovementStep(element);
  }
  
  var mouseMoveCallBack = function(pos,element){
    var objects = element.geo.getViewableObjects();
    element.hud.updatePosition(element.camera);
  /*
    if(intersects.length > 0){
        YAHOO.util.Dom.setStyle(element.containerId,'cursor', 'pointer');
    }else{
      YAHOO.util.Dom.setStyle(element.containerId,'cursor', 'auto');
    }
    return 0;
    */
    
  }
  
  var mouseDownCallBack = function(element){
  /*
    
    return 0;
    */
  }
  
  var mouseUpCallBack = function(ray,element){
      var direction = new THREE.Vector3( ray.direction.x, ray.direction.y, ray.direction.z );
    
   //   var vector = origin.sub(origin, direction);
      var vector = direction;
      
      var origin =  owl.deepCopy(ray.origin).normalize();
      
      var rho = element.geo.rho(vector);
      var phi = element.geo.phi(vector, rho);
      var theta = element.geo.theta(vector);
      var point = element.geo.getCartesian(phi,theta, rho * 200);
      point = origin.sub(point, origin);
      var color = element.geo.calculateColor(point) 
      
      element.hud.changeColorOfPanel(color);
      element.hud.updatePosition(element.camera);
      element.hudHTML.updateXColor(color);
      
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
       mesh.translateY(850)
       mesh.translateX(-700)
       mesh.translateZ(200)
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