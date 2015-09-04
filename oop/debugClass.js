
function debugClass(options){
  this.initializeOptions(options);
  if(!this.nodeId){
    this.nodeId = "debugNode";
  }
  if(this.createNode){
    this.createAppendDomObject( this.createHookObj(this.hookId),'div', {id:this.nodeId});
  }
}
  debugClass.prototype.constructor = debugClass;


  debugClass.prototype.initializeOptions = function(options){
    for( o in options){
      this[o] = options[o];
    }
  }
  
  debugClass.prototype.createAppendDomObject = function(hook, tag, params){
    var domRef = this.createDomObject(tag,params);
    hook.appendChild(domRef);
    domRef = null;
    hook = null;
  }
  
  debugClass.prototype.createDomObject = function(tag,params){
    var domRef= document.createElement(tag);
    for(var p in params){
      domRef.setAttribute(p, params[p]);
    }
    return domRef;
  }
  
  
  debugClass.prototype.createHookObj = function(id){
    var domRef = document.getElementById(id);
    if(domRef){
      return domRef;
    }else{
      return document.body;
    }
    domRef = null;
  }
  
  debugClass.prototype.output = function(text){
    var domRef = document.getElementById(this.nodeId);
    if(domRef){
      domRef.innerHTML = text
    }
    domRef = null;
  }
  
  debugClass.prototype.append = function(text){
    var domRef = document.getElementById(this.nodeId);
    if(domRef){
      domRef.innerHTML += text
    }
    domRef = null;
  }
  
  debugClass.prototype.position = function(){
    var ret = [];
    if(YAHOO){
      ret = YAHOO.util.Dom.getXY(this.nodeId);
    }
    return ret; 
  }
  
  debugClass.prototype.setPosition = function(pos){
    if(YAHOO){
      YAHOO.util.Dom.setXY(this.nodeId,pos);
    };
  }

  /*
      this.d = new debugClass({createNode:1});
      this.d_scrollHeight   = new debugClass({createNode:1, nodeId: 'scrollHeight' });
      this.d_Elposition     = new debugClass({createNode:1, nodeId: 'Elposition' });
      this.d_offsetHeight   = new debugClass({createNode:1, nodeId: 'offsetHeight' });
      this.d_scrollposition = new debugClass({createNode:1, nodeId: 'scrollposition' });
      */
    /*
    pos = YAHOO.util.Dom.getXY(element.name);
    
          this.s1sh = new debugClass({createNode:1, nodeId: 's1sh' });
          this.s1f  = new debugClass({createNode:1, nodeId: 's1f' });
          this.s1h  = new debugClass({createNode:1, nodeId: 's1h' });
          this.s1p  = new debugClass({createNode:1, nodeId: 's1p' });
          this.s2sh = new debugClass({createNode:1, nodeId: 's2sh' });
          this.s2h  = new debugClass({createNode:1, nodeId: 's2h' });
      this.s2p  = new debugClass({createNode:1, nodeId: 's2p' });
    var pos = YAHOO.util.Dom.getXY(element.name);
  //  pos[0] = 0
    this.s1f.setPosition([pos[0],  pos[1] + vData.pagePos]);
    this.s1p.setPosition([pos[0],  pos[1] + vData.dPos]);
    this.s1h.setPosition([pos[0],  pos[1] + vData.pSHeight]);
   // this.s1sh.setPosition([pos[0], pos[1] + vData.pHeight]);
    */
    