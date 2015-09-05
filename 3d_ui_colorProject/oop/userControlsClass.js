function userControlsClass(options){
    try{
      this.elements = {};
    //  this.h = new helperClass();
      this.initializeOptions(options);
      this.initialize();
      this.keyActions = {};
      
      this.projector = new THREE.Projector();
    }catch(err){
      debugger;
    }
  }
  
  userControlsClass.prototype.constructor = userControlsClass;

  /*------------------------------------------------------------------------------------------------*/

  userControlsClass.prototype.initializeOptions = function(options){
    for( o in options){
      this[o] = options[o];
    }
  }
  
  userControlsClass.prototype.initialize = function(){
    this.setupMouseControls(this.element);
    this.setupKeyboardControls(this.element);
  }
  
  userControlsClass.prototype.updateObjects = function(obj){
    this.obj = obj;
    
  }
  
  userControlsClass.prototype.setupMouseControls = function(element){
    var paramSet = {instanceObj: this, 'element':element};
    
    YAHOO.util.Event.addListener(document.body, "mousewheel", this.mousePage, paramSet);
    YAHOO.util.Event.addListener(document.body, "DOMMouseScroll", this.mousePage, paramSet);
    
    YAHOO.util.Event.addListener(this.containerId, "mouseout", this.mouseCut, paramSet);
    YAHOO.util.Event.addListener(this.containerId, "mouseover", this.mouseGue, paramSet);
    
    
    YAHOO.util.Event.addListener(this.containerId, 'mousemove', this.mouseMove, paramSet );
    
    YAHOO.util.Event.addListener(this.containerId, 'mousedown', this.mouseDown, paramSet );
    YAHOO.util.Event.addListener(this.containerId, 'mouseup', this.mouseUp, paramSet );
    
  }
  
  
  userControlsClass.prototype.mouseMove = function( eventObj, paramSet) {
    paramSet.instanceObj.mouseMove_p(eventObj, paramSet.element);
  }
  
  userControlsClass.prototype.mouseMove_p = function( event,element ) {
   // event.preventDefault();
    this.mouse ={};
    this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    this.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
  
  /* 
  var camera = element.camera;
  
  
    var vector = new THREE.Vector3( this.mouse.x, this.mouse.y, 0.5 );
    this.projector.unprojectVector( vector, camera );
  
    var ray = new THREE.Ray( camera.position, vector.subSelf( camera.position ).normalize() );
 */
    if(this.mouseMoveCallBack){
      this.mouseMoveCallBack(this.mouse,element);//,ray);
    }
  }
  
  userControlsClass.prototype.mouseDown = function(eventObj, paramSet) {
    paramSet.instanceObj.mouseDown_p(eventObj, paramSet.element);
  }
  
  userControlsClass.prototype.mouseDown_p = function( event,element ) {
  
  //  event.preventDefault();
  
    if(this.mouseDownCallBack){
      this.mouseDownCallBack(element);
    }
  }
  
  userControlsClass.prototype.mouseUp = function( eventObj, paramSet) {
    paramSet.instanceObj.mouseUp_p(eventObj, paramSet.element);
  }
  
  userControlsClass.prototype.mouseUp_p = function( event,element ) {
  //  event.preventDefault();
    var camera = element.camera;
     this.mouse ={};
    this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    this.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    var vector = new THREE.Vector3( this.mouse.x, this.mouse.y, 0.5 );
    this.projector.unprojectVector( vector, camera );
  
    var ray = new THREE.Ray( camera.position, vector.subSelf( camera.position ).normalize() );
    
    if(this.mouseUpCallBack){
      this.mouseUpCallBack(ray,element);
    }
  }
  
  userControlsClass.prototype.mouseCut = function(eventObj, paramSet){
    paramSet.instanceObj.mouseCut_p(eventObj, paramSet.element);
  }
  
  userControlsClass.prototype.mouseCut_p = function(eventObj, element){
    element.cutoff = true;
  }
  
  userControlsClass.prototype.mouseGue = function(eventObj, paramSet){
    paramSet.instanceObj.mouseGue_p(eventObj, paramSet.element);
  }
  
  userControlsClass.prototype.mouseGue_p = function(eventObj, element){
    element.cutoff = false;
  }
  
  userControlsClass.prototype.mousePage = function(eventObj, paramSet){
    paramSet.instanceObj.mousePage_p(eventObj, paramSet.element);
  }
  
  userControlsClass.prototype.mousePage_p = function(eventObj, element){
    var delta = eventObj.detail ? eventObj.detail*(-120) : eventObj.wheelDelta;
    var direction = (delta > 0) ? 'up' : 'down';
    var amount = 1;
    if(direction == 'up'){
      amount *= -1;
    }
    element.current = amount;
    if(this.mousewheelCallBack){
      this.mousewheelCallBack(element);
    }
    
  }
  
  userControlsClass.prototype.createSlider = function(name, dRange,dTickSize, initValue){
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
                                                'initValue': initValue},
                                      el:this.element};
                                                
    slider.subscribe('change', this.report, paramSet);
    return slider;
    
  }
  
  userControlsClass.prototype.report = function(sliderObj, paramSet){
    paramSet.instanceObj.report_p(this,sliderObj,paramSet.element,paramSet.el);
  }
        
  userControlsClass.prototype.report_p = function(obj, value, element,el){
    var valueBox = document.getElementById(element.name + "_valueBox");
    valueBox.value = value;
    valueBox = null;
    var eventObj ={};
    if(this.sliderCallBack){
      this.sliderCallBack(el,eventObj);
    }
  }
      
    
  userControlsClass.prototype.createControls = function(camera, options, ren){
    var controls;
    
     switch(options.conType){
       case 'firstPerson':
         controls = new THREE.FirstPersonControls(camera, ren.domElement);
         break;
       case 'trackball':                  
         controls = new THREE.TrackballControls(camera, ren.domElement);  
         break;
       case 'roll':                     
         controls = new THREE.RollControls(camera, ren.domElement);   
         break;
       case 'path':                  
         controls = new THREE.PathControls( camera , ren.domElement);
         controls.init();
         break;
       case 'fly':                   
         controls = new THREE.FlyControls(camera, ren.domElement);       
         break;
     }
     
     camera.position.setX(options.initPos.x);
     camera.position.setY(options.initPos.y);
     camera.position.setZ(options.initPos.z);
     
     if(options.initLookAtPos){
      controls.updateCords(options.initLookAtPos);
     }
     
     this.initiControlOptions(controls,options);
     
     
     return controls;
  
  }
  
  userControlsClass.prototype.initiControlOptions = function(controls,options){
    for( o in options){
      controls[o] = options[o];
    }
  }
  
  userControlsClass.prototype.setupKeyboardControls = function(element){
    var paramSet = {instanceObj: this, 'element':element};
    YAHOO.util.Event.on(document, "keyup", this.mainHook, paramSet);
    YAHOO.util.Event.on(document, "keydown", this.mainHook, paramSet);
    
    // YAHOO.util.Event.on(document, "keypress", this.mainHook);
  
    //document.onkeydown = this.mainHook;
    //document.onkeyup = this.mainHook;
    
   // YAHOO.util.KeyListener(document.body,{}, this.keyHook, paramSet);
    
  }
  
  userControlsClass.prototype.mainHook = function(eventObj, paramSet){
    paramSet.instanceObj.mainHook_p(eventObj, paramSet.element);
  }
  
  userControlsClass.prototype.mainHook_p = function(eventObj, element){
    var key = this.getKeyName(eventObj);
    for(var action in this.keyActions){
       if(key == action){
         this.keyActions[action](eventObj);
       }
    }
  }
  
  userControlsClass.prototype.regKeyAction = function(key,func){ 
    this.keyActions[key] = func;
  }
  
  userControlsClass.prototype.unregKeyAction = function(key,func){ 
    this.keyActions[key] = null;
  }
  
  userControlsClass.prototype.getKeyName = function(eventObj){ 
    var key = eventObj.keyCode || eventObj.which;
    var table = this.getReverseKeyTable();
    return table[key];
  }
  
   userControlsClass.prototype.getReverseKeyTable = function(){ 
     return {
            "3":"DOM_VK_CANCEL",
            "6":"DOM_VK_HELP",
            "8":"DOM_VK_BACK_SPACE",
            "9":"DOM_VK_TAB",
            "12":"DOM_VK_CLEAR",
            "13":"DOM_VK_RETURN",
            "14":"DOM_VK_ENTER",
            "16":"DOM_VK_SHIFT",
            "17":"DOM_VK_CONTROL",
            "18":"DOM_VK_ALT",
            "19":"DOM_VK_PAUSE",
            "20":"DOM_VK_CAPS_LOCK",
            "21":"DOM_VK_HANGUL",
            "23":"DOM_VK_JUNJA",
            "24":"DOM_VK_FINAL",
            "25":"DOM_VK_KANJI",
            "27":"DOM_VK_ESCAPE",
            "28":"DOM_VK_CONVERT",
            "29":"DOM_VK_NONCONVERT",
            "30":"DOM_VK_ACCEPT",
            "31":"DOM_VK_MODECHANGE",
            "32":"DOM_VK_SPACE",
            "33":"DOM_VK_PAGE_UP",
            "34":"DOM_VK_PAGE_DOWN",
            "35":"DOM_VK_END",
            "36":"DOM_VK_HOME",
            "37":"DOM_VK_LEFT",
            "38":"DOM_VK_UP",
            "39":"DOM_VK_RIGHT",
            "40":"DOM_VK_DOWN",
            "41":"DOM_VK_SELECT",
            "42":"DOM_VK_PRINT",
            "43":"DOM_VK_EXECUTE",
            "44":"DOM_VK_PRINTSCREEN",
            "45":"DOM_VK_INSERT",
            "46":"DOM_VK_DELETE",
            "48":"DOM_VK_0",
            "49":"DOM_VK_1",
            "50":"DOM_VK_2",
            "51":"DOM_VK_3",
            "52":"DOM_VK_4",
            "53":"DOM_VK_5",
            "54":"DOM_VK_6",
            "55":"DOM_VK_7",
            "56":"DOM_VK_8",
            "57":"DOM_VK_9",
            "59":"DOM_VK_SEMICOLON",
            "61":"DOM_VK_EQUALS",
            "65":"DOM_VK_A",
            "66":"DOM_VK_B",
            "67":"DOM_VK_C",
            "68":"DOM_VK_D",
            "69":"DOM_VK_E",
            "70":"DOM_VK_F",
            "71":"DOM_VK_G",
            "72":"DOM_VK_H",
            "73":"DOM_VK_I",
            "74":"DOM_VK_J",
            "75":"DOM_VK_K",
            "76":"DOM_VK_L",
            "77":"DOM_VK_M",
            "78":"DOM_VK_N",
            "79":"DOM_VK_O",
            "80":"DOM_VK_P",
            "81":"DOM_VK_Q",
            "82":"DOM_VK_R",
            "83":"DOM_VK_S",
            "84":"DOM_VK_T",
            "85":"DOM_VK_U",
            "86":"DOM_VK_V",
            "87":"DOM_VK_W",
            "88":"DOM_VK_X",
            "89":"DOM_VK_Y",
            "90":"DOM_VK_Z",
            "93":"DOM_VK_CONTEXT_MENU",
            "95":"DOM_VK_SLEEP",
            "96":"DOM_VK_NUMPAD0",
            "97":"DOM_VK_NUMPAD1",
            "98":"DOM_VK_NUMPAD2",
            "99":"DOM_VK_NUMPAD3",
            "100":"DOM_VK_NUMPAD4",
            "101":"DOM_VK_NUMPAD5",
            "102":"DOM_VK_NUMPAD6",
            "103":"DOM_VK_NUMPAD7",
            "104":"DOM_VK_NUMPAD8",
            "105":"DOM_VK_NUMPAD9",
            "106":"DOM_VK_MULTIPLY",
            "107":"DOM_VK_ADD",
            "108":"DOM_VK_SEPARATOR",
            "109":"DOM_VK_SUBTRACT",
            "110":"DOM_VK_DECIMAL",
            "111":"DOM_VK_DIVIDE",
            "112":"DOM_VK_F1",
            "113":"DOM_VK_F2",
            "114":"DOM_VK_F3",
            "115":"DOM_VK_F4",
            "116":"DOM_VK_F5",
            "117":"DOM_VK_F6",
            "118":"DOM_VK_F7",
            "119":"DOM_VK_F8",
            "120":"DOM_VK_F9",
            "121":"DOM_VK_F10",
            "122":"DOM_VK_F11",
            "123":"DOM_VK_F12",
            "124":"DOM_VK_F13",
            "125":"DOM_VK_F14",
            "126":"DOM_VK_F15",
            "127":"DOM_VK_F16",
            "128":"DOM_VK_F17",
            "129":"DOM_VK_F18",
            "130":"DOM_VK_F19",
            "131":"DOM_VK_F20",
            "132":"DOM_VK_F21",
            "133":"DOM_VK_F22",
            "134":"DOM_VK_F23",
            "135":"DOM_VK_F24",
            "144":"DOM_VK_NUM_LOCK",
            "145":"DOM_VK_SCROLL_LOCK",
            "188":"DOM_VK_COMMA",
            "190":"DOM_VK_PERIOD",
            "191":"DOM_VK_SLASH",
            "192":"DOM_VK_BACK_QUOTE",
            "219":"DOM_VK_OPEN_BRACKET",
            "220":"DOM_VK_BACK_SLASH",
            "221":"DOM_VK_CLOSE_BRACKET",
            "222":"DOM_VK_QUOTE",
            "224":"DOM_VK_META"};
}
      
   userControlsClass.prototype.getKeyTable = function(){    
      return {
              "DOM_VK_CANCEL":3,
              "DOM_VK_HELP":6,
              "DOM_VK_BACK_SPACE":8,
              "DOM_VK_TAB":9,
              "DOM_VK_CLEAR":12,
              "DOM_VK_RETURN":13,
              "DOM_VK_ENTER":14,
              "DOM_VK_SHIFT":16,
              "DOM_VK_CONTROL":17,
              "DOM_VK_ALT":18,
              "DOM_VK_PAUSE":19,
              "DOM_VK_CAPS_LOCK":20,
              "DOM_VK_KANA":21,
              "DOM_VK_HANGUL":21,
              "DOM_VK_JUNJA":23,
              "DOM_VK_FINAL":24,
              "DOM_VK_HANJA":25,
              "DOM_VK_KANJI":25,
              "DOM_VK_ESCAPE":27,
              "DOM_VK_CONVERT":28,
              "DOM_VK_NONCONVERT":29,
              "DOM_VK_ACCEPT":30,
              "DOM_VK_MODECHANGE":31,
              "DOM_VK_SPACE":32,
              "DOM_VK_PAGE_UP":33,
              "DOM_VK_PAGE_DOWN":34,
              "DOM_VK_END":35,
              "DOM_VK_HOME":36,
              "DOM_VK_LEFT":37,
              "DOM_VK_UP":38,
              "DOM_VK_RIGHT":39,
              "DOM_VK_DOWN":40,
              "DOM_VK_SELECT":41,
              "DOM_VK_PRINT":42,
              "DOM_VK_EXECUTE":43,
              "DOM_VK_PRINTSCREEN":44,
              "DOM_VK_INSERT":45,
              "DOM_VK_DELETE":46,
              "DOM_VK_0":48,
              "DOM_VK_1":49,
              "DOM_VK_2":50,
              "DOM_VK_3":51,
              "DOM_VK_4":52,
              "DOM_VK_5":53,
              "DOM_VK_6":54,
              "DOM_VK_7":55,
              "DOM_VK_8":56,
              "DOM_VK_9":57,
              "DOM_VK_SEMICOLON":59,
              "DOM_VK_EQUALS":61,
              "DOM_VK_A":65,
              "DOM_VK_B":66,
              "DOM_VK_C":67,
              "DOM_VK_D":68,
              "DOM_VK_E":69,
              "DOM_VK_F":70,
              "DOM_VK_G":71,
              "DOM_VK_H":72,
              "DOM_VK_I":73,
              "DOM_VK_J":74,
              "DOM_VK_K":75,
              "DOM_VK_L":76,
              "DOM_VK_M":77,
              "DOM_VK_N":78,
              "DOM_VK_O":79,
              "DOM_VK_P":80,
              "DOM_VK_Q":81,
              "DOM_VK_R":82,
              "DOM_VK_S":83,
              "DOM_VK_T":84,
              "DOM_VK_U":85,
              "DOM_VK_V":86,
              "DOM_VK_W":87,
              "DOM_VK_X":88,
              "DOM_VK_Y":89,
              "DOM_VK_Z":90,
              "DOM_VK_CONTEXT_MENU":93,
              "DOM_VK_SLEEP":95,
              "DOM_VK_NUMPAD0":96,
              "DOM_VK_NUMPAD1":97,
              "DOM_VK_NUMPAD2":98,
              "DOM_VK_NUMPAD3":99,
              "DOM_VK_NUMPAD4":100,
              "DOM_VK_NUMPAD5":101,
              "DOM_VK_NUMPAD6":102,
              "DOM_VK_NUMPAD7":103,
              "DOM_VK_NUMPAD8":104,
              "DOM_VK_NUMPAD9":105,
              "DOM_VK_MULTIPLY":106,
              "DOM_VK_ADD":107,
              "DOM_VK_SEPARATOR":108,
              "DOM_VK_SUBTRACT":109,
              "DOM_VK_DECIMAL":110,
              "DOM_VK_DIVIDE":111,
              "DOM_VK_F1":112,
              "DOM_VK_F2":113,
              "DOM_VK_F3":114,
              "DOM_VK_F4":115,
              "DOM_VK_F5":116,
              "DOM_VK_F6":117,
              "DOM_VK_F7":118,
              "DOM_VK_F8":119,
              "DOM_VK_F9":120,
              "DOM_VK_F10":121,
              "DOM_VK_F11":122,
              "DOM_VK_F12":123,
              "DOM_VK_F13":124,
              "DOM_VK_F14":125,
              "DOM_VK_F15":126,
              "DOM_VK_F16":127,
              "DOM_VK_F17":128,
              "DOM_VK_F18":129,
              "DOM_VK_F19":130,
              "DOM_VK_F20":131,
              "DOM_VK_F21":132,
              "DOM_VK_F22":133,
              "DOM_VK_F23":134,
              "DOM_VK_F24":135,
              "DOM_VK_NUM_LOCK":144,
              "DOM_VK_SCROLL_LOCK":145,
              "DOM_VK_COMMA":188,
              "DOM_VK_PERIOD":190,
              "DOM_VK_SLASH":191,
              "DOM_VK_BACK_QUOTE":192,
              "DOM_VK_OPEN_BRACKET":219,
              "DOM_VK_BACK_SLASH":220,
              "DOM_VK_CLOSE_BRACKET":221,
              "DOM_VK_QUOTE":222,
              "DOM_VK_META":224};
   }

