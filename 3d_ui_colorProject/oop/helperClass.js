  function helperClass(){
  
  }
  
  helperClass.prototype.constructor = helperClass;
  
  /*------------------------------------------------------------------------------------------------*/ 
  /*------------------------------------------------------------------------------------------------*/ 
   
  helperClass.prototype.addlistenersSet = function(eventSet){
    if(this.isArray(eventSet.refList)){
      for(var i = 0;i < eventSet.refList.length;i++){
        this.addListenersList(eventSet.refList[i], eventSet.eventList);
      }
    }else{
      for(var i in eventSet.refList){
        this.addListenersList(eventSet.refList[i], eventSet.eventList);
      }
    }
  }
  
  helperClass.prototype.addListenersList = function(ref, evList){
    for(var ev in evList){
      YAHOO.util.Event.addListener(ref, ev, evList[ev].func, evList[ev].param);
    }
  }
  
  helperClass.prototype.removelistenersSet = function(eventSet){
    if(this.isArray(eventSet.refList)){
      for(var i = 0;i < eventSet.refList.length;i++){
        this.removeListenerList(eventSet.refList[i], eventSet.eventList);
      }
    }else{
      for(var i in eventSet.refList){
        this.removeListenerList(eventSet.refList[i], eventSet.eventList);
      }
    }
  }
  
  helperClass.prototype.removeListenerList = function(ref, evList){
    for(var ev in evList){
      YAHOO.util.Event.removeListener(ref, ev, evList[ev].func);
    }
  }
  
/*------------------------------------------------------------------------------------------------*/ 
      
  helperClass.prototype.getFieldValue = function(id){
    var ret = -1, domObj = document.getElementById(id);
    if(domObj){
      ret = domObj.value;
    }
    this.deleteDomElement(domObj);
    domObj = null;
    return ret;
  
  }
  
  helperClass.prototype.getSelectValue = function(id){
    var ret = -1, domObj = document.getElementById(id);
    if(domObj){
      ret = domObj.options[domObj.selectedIndex].value;
    }
    this.deleteDomElement(domObj);
    domObj = null;
    return ret;
  
  }
  
  helperClass.prototype.setSelectValue = function(id,index){
    var ret = -1, domObj = document.getElementById(id);
    if(domObj){
      domObj.selectedIndex = index;
    }
    this.deleteDomElement(domObj);
    domObj = null;
    return ret;
  
  }
  
  helperClass.prototype.getSelectOptionsValues = function(id){
    var ret = [], domObj = document.getElementById(id);
    if(domObj){
      for(var e =0; e < domObj.options.length;e++){
        ret[e] = domObj.options[e].value;
      }
    }
    this.deleteDomElement(domObj);
    domObj = null;
    return ret;
  
  }
  
/*------------------------------------------------------------------------------------------------*/ 
    
  helperClass.prototype.updateHTML = function(id, html){
    var ret = false, domObj = document.getElementById(id);
    
    if(domObj){
      domObj.innerHTML = html;
      ret = true;
    }
    this.deleteDomElement(domObj);
    domObj = null;
    return ret;
  }
/*------------------------------------------------------------------------------------------------*/ 
    
  helperClass.prototype.clearElement = function(id){
    var ret = false, domObj = document.getElementById(id);
    
    if(domObj){
      domObj.innerHTML = "";
      ret = true;
    }
    this.deleteDomElement(domObj);
    domObj = null;
    return ret;
  
  }
  
  helperClass.prototype.updateInnerHtml = function(element, updateId, newHTML){
   if(newHTML){
      if(element.count){
        newHTML = '<p>' + element.count + '</p>' + newHTML;
        element.count++;
      }
      var domRef = document.getElementById(updateId);
      if(domRef){
        this.removeChildren(updateId);
        domRef.innerHTML = newHTML;
      }
      
      this.deleteDomElement(domRef);
      domRef = null;
    } 
  }
/*------------------------------------------------------------------------------------------------*/ 
  
  helperClass.prototype.getCurrentListPosition = function(id){
    var domRef = document.getElementById(id);
    var children = YAHOO.util.Dom.getChildren(domRef.parentNode);
    for(var i = 0;i< children.length;i ++){
      if(children[i].id == domRef.id){
        ret = i + 1;
        break;
      }
    }
    this.deleteDomElement(domRef);
    domRef = null;
    this.deleteDomArray(children);
    children = null;
    return ret;
  }
  
  helperClass.prototype.setListNodeToPosition = function(id, position,className){
    var domRef = document.getElementById(id);
    var children = YAHOO.util.Dom.getChildren(domRef.parentNode);
    domRef.parentNode.insertBefore(domRef, children[position]); 
    this.deleteDomElement(domRef);
    domRef = null;
    this.deleteDomArray(children);
    children = null;
    if(className){
      this.setIndexeByClassName(id, position,className);
    }
    return ret;
  }
  
  helperClass.prototype.setIndexeByClassName = function(id, position, className){
    var domRef = document.getElementById(id);
    var list = YAHOO.util.Dom.getElementsByClassName(className,'',domRef.parentNode);
    for(var i = 0 ;i< list.length; i++){
      list[i].innerHTML = (i+1);
    }
    this.deleteDomArray(list);
    list = null;
  }
  
  
/*------------------------------------------------------------------------------------------------*/ 
  helperClass.prototype.appendInnerHtml = function(element, updateId, newHTML){
    this.appendInnerHtml_core(element, updateId, newHTML);
  }
  
  helperClass.prototype.appendDomAfter = function(element, updateId, newHTML){
    this.appendInnerHtml_core(element, updateId, newHTML,element.paramSet.domId,
                                                         element.paramSet.bgSurfix);
  }
    
  helperClass.prototype.appendInnerHtml_core = function(element, updateId, newHTML, aId, abgsurfix){
   if(newHTML){
      if(element.count){
        newHTML = '<p>' + element.count + '</p>' + newHTML;
        element.count++;
      }
      var conatiner;
      
      var aNode = document.getElementById(aId);
          
      if(element.paramSet){
        if(element.paramSet.conatinerId){
          conatiner = document.getElementById(element.paramSet.conatinerId);
          conatinerScrollTop =  conatiner.scrollTop;
        }
      }
      var domRef = document.getElementById(updateId);
      try{
        if(domRef){  
          var tempEl = this.createDomObject('div',{id:'tempEl',style:'display:none;'});
          tempEl.innerHTML += newHTML;
            //document.body.appendChild(tempEl); 'tempEl'
            var children = YAHOO.util.Dom.getChildren(tempEl);
            var elementCheck = null;
            if(aId && children.length > 0){
              var firstElementCheck = document.getElementById(children[0].id);
              if(!firstElementCheck){
                if(aNode){
                  var pagebgId = this.removeSurfix(aId) + abgsurfix;
                  this.colorAnimation({obj:pagebgId, run:true, seconds:3, 
                                         eColorBG: 'rgb(34,34,34)', sColorBG: 'rgb(81,82,129)',fColorBG:'rgba(34,34,34,0.85)'});

                  if(aNode.nextSibling){
                    domRef.insertBefore(children[0], aNode.nextSibling);
                  }else{
                    domRef.insertBefore(children[0], aNode);
                  }
                }else{
                  domRef.appendChild(children[0]);
                }
                for(var i = 1 ;i< children.length; i++){
                  elementCheck = document.getElementById(children[i].id);
                  if(!elementCheck){
                    if(children[i - 1].nextSibling){
                      domRef.insertBefore(children[i], children[i - 1].nextSibling);
                    }
                  }
                }
              }
            }else{
              for(var i =0 ;i< children.length; i++){
                  elementCheck = document.getElementById(children[i].id);
                  if(!elementCheck){
                    domRef.appendChild(children[i]);
          }
              }
            }
        }
      }catch(error){
        debugger;
      }  
      this.deleteDomElement(elementCheck);
      elementCheck = null;
      
      this.deleteDomArray(children);
      children = null;
      //document.body.removeChild(tempEl);
      this.deleteDomElement(tempEl);
      tempEl = null;
      this.deleteDomElement(firstElementCheck);
      firstElementCheck = null;
        
      this.deleteDomElement(domRef);
      domRef = null;
      this.deleteDomElement(aNode);
      aNode = null;
      if(conatiner){
        conatiner.scrollTop  =  conatinerScrollTop ;
      }
      this.deleteDomElement(conatiner);
      conatiner = null;
    } 
  }
  
  helperClass.prototype.deleteDomElement = function(ref){
    var a = [ref];
    delete a[0];
    ref = null;
    a = null;
  }
  
  
  helperClass.prototype.deleteDomArray = function(a){
    for(var i in a){
      a[i] = null;
      delete a[i];
    }
    a = null;
  }
  
  helperClass.prototype.renderError = function(panelsObj, errorPanel, errorDiv){
    try{
      this.clearHTMLTag(errorDiv, 'style');
      if(panelsObj){
        panelsObj.showPanel(errorPanel);
      }
    }catch(err){
     debugger;
    }
  }
  
//  this.colorAnimation({obj:'obj' , eColorBG: 'transparent', sColorBG: '#FFF',run:true});
  
   helperClass.prototype.colorAnimation = function(options){
     var sec = 1;
     var method = YAHOO.util.Easing.easeNone;

     if(options.seconds){
      sec = options.seconds
     }
     if(options.method){
       method = options.method;
     }
     var att = {};
     
     if(options.eColor){
       att.color = {to:options.eColor};
     }
     if(options.eColorBG){
       att.backgroundColor = {to:options.eColorBG};
     }
     
     var anim = new YAHOO.util.ColorAnim(options.obj, att,sec,method);
     var params = {instanceObj : this, element: options}
     
     if(options.onStart){ 
       anim.onStart.subscribe(options.onStart,params);
     }
     if(options.onTween){
       anim.onTween.subscribe(options.onTween,params);
     }
     if(options.onComplete){
       anim.onComplete.subscribe(options.onComplete,params);
     }
   
     anim.onComplete.subscribe(this.setColor,{instanceObj : this, element:  {obj:options.obj,
                                         Color:options.fColor, 
                                       ColorBG:options.fColorBG}}); 
     if(options.run){
       this.setColor_p({obj:options.obj, Color:options.sColor, ColorBG:options.sColorBG});
       anim.animate();
     }else if(options.reg){
       anim.onStart.subscribe(this.setColor,{instanceObj : this, element:  {obj:options.obj,
                                        Color:options.sColor, 
                                      ColorBG:options.sColorBG}});
       YAHOO.util.AnimMgr.registerElement(anim);
     }

     return anim;
  }
  
  
   helperClass.prototype.fadeAnimation = function(options){
     var sec = 1;
     var method = YAHOO.util.Easing.easeNone;

     if(options.seconds){
      sec = options.seconds
     }
     
     if(options.method){
       method = options.method;
     }
     var att = {};
     
     if(!(isNaN(parseFloat(options.start)) || 
          isNaN(parseFloat(options.finish)))){
       att.opacity = {from : options.start,to : options.finish };
     }
     
     var anim = new YAHOO.util.Anim(options.obj, att,sec,method);
     var params = {instanceObj : this, element: options}
     
     if(options.onStart){ 
       anim.onStart.subscribe(options.onStart,params);
     }
     if(options.onTween){
       anim.onTween.subscribe(options.onTween,params);
     }
     if(options.onComplete){
       anim.onComplete.subscribe(options.onComplete,params);
     }

     if(options.run){
       anim.animate();
     }else if(options.reg){
       YAHOO.util.AnimMgr.registerElement(anim);
     }

     return anim;
  }
  
   helperClass.prototype.scrollAnimationYUI = function(options){
     var sec = 1;
     var method = YAHOO.util.Easing.easeNone;

     if(options.seconds){
      sec = options.seconds
     }
     
     if(options.method){
       method = options.method;
     }
     var att = {};
     
     if(!(isNaN(parseFloat(options.to)))){
       att.scroll = {to : options.to };
     }
     if(options.obj){
      var domRef = document.getElementById(options.obj)
      var anim = new YAHOO.util.Scroll(domRef, att,sec,method);
      this.deleteDomElement(domRef);
      domRef = null;
     }
     
     if(options.onStart){ 
       anim.onStart.subscribe(options.onStart,options.params);
     }
     if(options.onTween){
       anim.onTween.subscribe(options.onTween,options.params);
     }
     if(options.onComplete){
       anim.onComplete.subscribe(options.onComplete,options.params);
     }

     if(options.run){
       anim.animate();
     }else if(options.reg){
       YAHOO.util.AnimMgr.registerElement(anim);
     }

     return anim;
  }
 helperClass.prototype.setColor = function(eventName, event, paramSet){
 
 }
  
 helperClass.prototype.setColor = function(eventName, event, paramSet){
    paramSet.instanceObj.setColor_p( paramSet.element);
 }
 
 helperClass.prototype.setColor_p = function(options){
    
    if(options.ColorBG){
      YAHOO.util.Dom.setStyle(options.obj,"background-color",options.ColorBG);
    }
    if(options.Color){
      YAHOO.util.Dom.setStyle(options.obj,"color",options.Color);
    } 
  }
  
  helperClass.prototype.setBGtransparent = function(eventName, event, paramSet){
    paramSet.instanceObj.setBGtransparent_p(paramSet.element.obj);
  }
  
  helperClass.prototype.setBGtransparent_p = function(obj){
    YAHOO.util.Dom.setStyle(obj,"background-color",'transparent');
    this.deleteDomElement(obj);
    obj = null;
  }

  helperClass.prototype.getResults_p = function(results){
    var ret = {s: results.details.start_index,
               p: results.details.results_per_page,
               n: results.details.number_of_results};
    ret.t   = Math.ceil(ret.n/ret.p);
    ret.cp  = Math.ceil(ret.s/ret.p) + 1; 
    if(ret.t < 1){
      ret.t = 1;
    }
    return ret;
  }
  
  /*------------------------------------------------------------------------------------------------*/
   helperClass.prototype.getResultsDisplay = function(element, results){
    var output = "";
    if(results){
      if(results.details){
    var r = this.getResults_p(results);
        output = 'Results: ['+ r.s+ ','+ r.p+ ',' + r.n +'] Pages:['+ r.cp + ',' + r.t + ']';
      }
    
      if(!output){
        if(element.paramSet.conatinerId){
        
          var list = YAHOO.util.Dom.getElementsByClassName("flimItem",'',element.conatinerId);
          len = list.length;
          this.deleteDomArray(list);
          list = null;
        }else{
          len = results.titlesLength;
        }
        var len;
        if(len){
          output = 'Results: ['+len +']';
        }
      }
      if(results.paginationVars){
      //  output += " Pagination: ["+ results.paginationVars.pageIndex + ","
      //                            + results.paginationVars.perPage + "]";
      }
      if(results.status){
        output += " Status: ["+ results.status.message + "]";
      }
      if(results.totalItemCount){
        output += " Item Count: ["+ results.totalItemCount + "]";
      }
      
     }
     return output;
  }  

  /*------------------------------------------------------------------------------------------------*/
  
  helperClass.prototype.getResultsVariable = function(o){
    var ret;
    var r = this.innerHTMLSplit(o.responseText,{endTag:   'resultsData-->', 
                                             startTag: '<!--resultsData'});
    if(r){
      eval((r)); 
      return results;
    }else{
      return undefined;
    }
  }    

  /*------------------------------------------------------------------------------------------------*/
  helperClass.prototype.clearHTMLTag = function(updateId, name){
    var domRef = document.getElementById(updateId);
    if(domRef){
      domRef.innerHTML = this.replaceHTMLTag(domRef.innerHTML, 'style','');
    }
    this.deleteDomElement(domRef);
    domRef = null;
  }

  
  helperClass.prototype.replaceHTMLTag = function(text, name, replacement){
    var rText = this.innerHTMLSplit(text, {startTag: "<"+name+">", endTag:"<\/"+name+">"})
    return text.replace( rText, replacement);
  }
  
  helperClass.prototype.replaceHTMLTag = function(text, replacement, element){
    var rText = this.innerHTMLSplit(text, element)
    return text.replace( rText, replacement);
  }
  
  helperClass.prototype.innerHTMLSplit = function(text, tagSet){
    if(text){
      var rs = text.split(tagSet.startTag);
      var r = ""; 
      if(rs.length > 1){
        var r = rs[1].split(tagSet.endTag)[0];
      }
    }
    return r;
  }
  
  /*------------------------------------------------------------------------------------------------*/   
    
   helperClass.prototype.toggleShowCollection = function(newKeyShown ,sufix, set, styleType){
      var id = newKeyShown + sufix;
      var currentShow = this.toggleShowCore(id,styleType);
      this.hideCollection(sufix, set, styleType);
      this.showByFlag(id,currentShow,styleType)   
    }
    
   helperClass.prototype.hideCollection = function(sufix, set, styleType){
      for( var name in set){
        this.hide(name + sufix, styleType);   
      }
    }
 /*------------------------------------------------------------------------------------------------*/  
    
    helperClass.prototype.toggleShow = function(id,styleType){  
      var set = this.getShowSet(styleType);
      this.handelShow(id,this.toggleShowCore(id,styleType,set), set);
    }
    
    helperClass.prototype.toggleShowCore = function(id,styleType,set){  
      if(!set){
        set = this.getShowSet(styleType);
      }
      if(YAHOO.util.Dom.getStyle(id,set[0]) !== set[1][1]){
        return false;
      }else{
        return true;
      }
    }
    
 /*------------------------------------------------------------------------------------------------*/   
    
    helperClass.prototype.showByFlag = function(id,flag,styleType){  
      this.handelShow(id,flag,this.getShowSet(styleType));
    }
    
    helperClass.prototype.hide = function(id,styleType){
      this.handelShow(id,false,this.getShowSet(styleType));
    }
    
    helperClass.prototype.show = function(id,styleType){  
      this.handelShow(id,true,this.getShowSet(styleType));
    }
  /*------------------------------------------------------------------------------------------------*/ 
    
    helperClass.prototype.handelShow = function(id,show,set){ 
      if(show){
         YAHOO.util.Dom.setStyle(id,set[0],set[1][0]);
      }else{
         YAHOO.util.Dom.setStyle(id,set[0],set[1][1]);
      }
    }
    
    helperClass.prototype.getShowSet = function(styleType){
      var set;
      switch(styleType){
        case 'v':
          set = ["visibility", ["visible","hidden"]];
          break;
        case 'ib':
          set = ["display", ["inline-block","none"]];
          break;
        case 'b':
          set = ["display", ["block","none"]];
          break;
        default:
          set = ["display", ["inline","none"]];
          break;
      }
      return set;
    }
    /*------------------------------------------------------------------------------------------------*/ 
     
      helperClass.prototype.toggleClassName_P = function(eventObj, paramSet){
        new helperClass().toggleClassName(paramSet);
      }
      
      helperClass.prototype.toggleClassName = function(element){
        var ret = false, domObj = document.getElementById(element.id);
        if(domObj){
          if(domObj.className == element.classNames[0]){
            domObj.className = element.classNames[1];
          }else{
            domObj.className = element.classNames[0];
          }
          ret = true;
        }
        this.deleteDomElement(domObj);
        domObj = null;
        return ret;
      }
      
     helperClass.prototype.changeClassName = function(id,newClassName){
        var ret = false, domObj = document.getElementById(id);
        if(domObj){
          domObj.className = newClassName;
          ret = true;
        }
        this.deleteDomElement(domObj);
        domObj = null;
        return ret;
      } 
    /*------------------------------------------------------------------------------------------------*/ 
      
     helperClass.prototype.getClassName = function(id){
        var ret, domObj = document.getElementById(id);
        if(domObj){
          ret = domObj.className;
        }
        this.deleteDomElement(domObj);
        domObj = null;
        return ret;
      } 
      
     helperClass.prototype.updateTitle = function(id,title){
        var ret, domObj = document.getElementById(id);
        if(domObj){
          domObj.title = title;
        }
        this.deleteDomElement(domObj);
        domObj = null;
        return ret;
      } 
      
     helperClass.prototype.getTitle = function(id){
        var ret, domObj = document.getElementById(id);
        if(domObj){
          ret = domObj.title;
        }
        this.deleteDomElement(domObj);
        domObj = null;
        return ret;
      } 
      
    /*------------------------------------------------------------------------------------------------*/ 
  
     helperClass.prototype.changeClassNameCell = function(id,newClassName,prefix){
        var ret = false, domObj = document.getElementById(id);
        if(domObj){
          domObj.className = this.insertCellPrefix(domObj.className,newClassName,prefix," ");
          ret = true;
        }
        this.deleteDomElement(domObj);
        domObj = null;
        return ret;
      }
    /*------------------------------------------------------------------------------------------------*/ 
      
    helperClass.prototype.insertCellPrefix = function(str,newstr,prefix,delimit){
        var classSet = str.split(delimit);
        for(var i=0;i<classSet.length;i++){
          if(classSet[i].indexOf(prefix) !== -1){
            classSet[i] = newstr
            break;
          }
        }
        return classSet.join(delimit);
    }
    
    /*------------------------------------------------------------------------------------------------*/ 
      
      
    helperClass.prototype.concatJson = function(jA, jB){
      if(jA){
        var ret = this.dcopyJson(jA);
        if(jB){
          for(var l in jB){
           ret[l] = jB[l];
          }
        }
      }else{ 
        var ret = {};
      }
      return ret;
    }

    helperClass.prototype.dcopyJson = function(list){
      var ret = {};
      for(var l in list){
         ret[l] = list[l];
      }
      return ret;
    }
/*------------------------------------------------------------------------------------------------*/ 
      
    helperClass.prototype.evalKeys = function(obj,keys,args){
      for(var o in obj){
        if(keys.indexOf(o) !== -1){
          obj[o] = eval((obj[o]));
        }
        if((this.isObject(obj[o])) || (this.isArray(obj[o])) ){
          this.evalKeys(obj[o], keys, args);
        }
      }
      return obj;
    }
/*------------------------------------------------------------------------------------------------*/ 
    
    helperClass.prototype.getHookId = function(id){
      var ret = ""
      if(id){
        var domRef = document.getElementById(id); 
        if(domRef){ 
           ret =  id;
        }
        this.deleteDomElement(domRef);
        domRef = null;
      }
      if(!ret){ 
        if (document.body.id){
          ret = document.body.id;
        }else{
          ret = YAHOO.util.Dom.generateId(document.body);
        }
      }
      return ret;
    }
/*------------------------------------------------------------------------------------------------*/ 
  
    helperClass.prototype.createHookObj = function(id){
      var domRef = document.getElementById(id)
      if(domRef){
        return domRef;
      }else{
        return document.body;
      }
      this.deleteDomElement(domRef);
      domRef = null;
    }
    
    helperClass.prototype.getDims = function(id){
      var domRef = document.getElementById(id);
      if(domRef){
        var set = {width  : domRef.clientWidth,
                   height : domRef.clientHeight};
      }
      return set;
    }
    
    
   helperClass.prototype.generateId = function(domRef){
     var ret;
     if (domRef.id){
       ret = domRef.id;
     }else{
       ret = YAHOO.util.Dom.generateId(domRef);
     }
     return ret;
   }
        
/*------------------------------------------------------------------------------------------------*/ 
      
   helperClass.prototype.createAppendDomObject = function(hook, tag, params){
     var domRef = this.createDomObject(tag,params);
     hook.appendChild(domRef);
     this.deleteDomElement(domRef);
     this.deleteDomElement(hook);
     domRef = null;
     hook = null;
   }
/*------------------------------------------------------------------------------------------------*/ 
     
    helperClass.prototype.createDomObject = function(tag,params){
      var domRef= document.createElement(tag);
      for(var p in params){
        domRef.setAttribute(p, params[p]);
      }
      return domRef;
    }
    
    helperClass.prototype.div = function(className,id, innerHTML){
      return this.htmlTag('div', className, id, innerHTML);
    }
    
    helperClass.prototype.span = function(className,id, innerHTML){
      return this.htmlTag('span', className, id, innerHTML);
    }
    
    helperClass.prototype.htmlTag = function(tag, className, id, innerHTML){
      return '<'+tag + this.getStrAtt('id',id) + 
                       this.getStrAtt('class',className) + '>' + 
                       this.getValue(innerHTML) + 
             '</'+tag+'>';
    }
    
    helperClass.prototype.getStrAtt = function(att, value){
      return value ? ' ' + att + '="'+value + '"':' ';
    }
    
    helperClass.prototype.getValue = function(value){
      return value ? ' '+value :' ';
    }
    
/*------------------------------------------------------------------------------------------------*/ 
      
    helperClass.prototype.removeChildren = function(id){
       var domObj = document.getElementById(id);
       var childrenLength = domObj.childNodes.length;
       for(var i = childrenLength;i>0;i--){
          domObj.removeChild(domObj.childNodes[0]);
          delete domObj.childNodes[0];
       }
       this.deleteDomElement(domObj);
       domObj = null;
    }
/*------------------------------------------------------------------------------------------------*/ 
      
    helperClass.prototype.getContianerNodeLength = function(id){
       var domObj = document.getElementById(id);
       var ret;
       var tagName = domObj.tagName.toLowerCase();
       var tagSet = {table:'td', ul:'li',ol:'li'};
       if(tagSet[tagName]){
         var tds = domObj.getElementsByTagName(tagSet[tagName]);
         ret = tds.length;
         this.deleteDomElement(tds);
         tds = null;
       }else{
         ret = domObj.childNodes.length;
       }
       this.deleteDomElement(domObj);
       domObj = null;
       return ret;
    }
/*------------------------------------------------------------------------------------------------*/ 
      
    helperClass.prototype.isRegionEqual = function(r1,r2){
      return Boolean(r1.top    == r2.top && 
                     r1.right  == r2.right && 
                     r1.left   == r2.left && 
                     r1.bottom == r2.bottom)
    }
/*------------------------------------------------------------------------------------------------*/ 
      
    helperClass.prototype.checkSides = function(r1,r2){
      var ret = ""
      if(r1.top > r2.top){
        ret += "top,"
      } 
      if(r1.right < r2.right){
        ret += "right,"
      } 
      if(r1.left > r2.left){
        ret += "left,"
      } 
      if(r1.bottom < r2.bottom){
        ret += "bottom,"
      }
      if(ret !== ""){
        ret = ret.substring(0, ret.length - 1);
      }
      return ret;
    }
/*------------------------------------------------------------------------------------------------*/ 
      
    helperClass.prototype.getComputedOffsetRegion = function(r, dims){
      var offSetDims = [4];
      dims[0] ? offSetDims[0] = r.x      + dims: offSetDims[0] = r.x;
      dims[1] ? offSetDims[1] = r.y      + dims: offSetDims[1] = r.y;
      dims[2] ? offSetDims[2] = r.width  + dims: offSetDims[2] = r.width;
      dims[3] ? offSetDims[3] = r.height + dims: offSetDims[3] = r.Height;
      return this.getComputedRegion(offSetDims);
    }
/*------------------------------------------------------------------------------------------------*/ 
      
    helperClass.prototype.getComputedRegionDom = function(dims){
      var rId= 'regionDummy';
      var ret;
      this.createAppendDomObject(document.body,'div',{id:rId});
      YAHOO.util.Dom.setXY(rId,[dims[0],dims[1]]);
      YAHOO.util.Dom.setStyle(rId,'height',dims[2] +'px');
      YAHOO.util.Dom.setStyle(rId,'width',dims[3] +'px');
      var domObj = document.getElementById(rId);
      ret = YAHOO.util.Region.getRegion(domObj);
      document.body.removeChild(domObj)
      this.deleteDomElement(domObj);
      domObj = null;
      return ret;
    }
    
    helperClass.prototype.getComputedRegion = function(dims){
     var ret =  {x: dims[0], 
                y: dims[1], 
                height:dims[2], 
                width: dims[3],
                left: dims[0],
                right: parseInt(dims[0] + dims[3]),
                top: dims[1],
                bottom: parseInt(dims[1] + dims[2])}
     return ret;
    }
    
/*------------------------------------------------------------------------------------------------*/ 
      
    helperClass.prototype.jsonLen = function(list){
      var len = 0;
      for(var l in list){if(list[l] !== undefined){len++}}
      return len;
    }

    helperClass.prototype.jsonKeys = function(list){
     var keys =[],i = 0;
     for(var l in list){
      keys[i] = l;
      i++;
     }
     return keys;
    } 
    
/*------------------------------------------------------------------------------------------------*/ 
      
    helperClass.prototype.getPrefix = function(str){
      return str.split('_')[0];
    }
/*------------------------------------------------------------------------------------------------*/ 
      
    helperClass.prototype.removeSurfix = function(str){
      var set = str.split('_');
      set.pop();
      return set.join('_');
    }
 /*------------------------------------------------------------------------------------------------*/ 
  
    helperClass.prototype.removePrefix = function(str){
      var set = str.split('_');
      set.shift();
      return set.join('_');
    }
 /*------------------------------------------------------------------------------------------------*/ 
     
    
    helperClass.prototype.arrayIndex = function(a, i) {
      var list = a.join(',')
      var ret = list.indexOf(i) !== -1;
      return ret;
    }
    
    helperClass.prototype.arrayRemoveValue = function(a, v) {
      var ret = [], n = 0;
      for(var i = 0;i<a.length;i++){
        if(v !== a[i]){
          ret[n] = a[i];
          n++;
        }
      }
      return ret;
    }
    
  /*------------------------------------------------------------------------------------------------*/   
    helperClass.prototype.isArray = function(obj) {
      if (obj instanceof Array)
        return true;
      else
        return false;
    }   
    
    helperClass.prototype.isString = function(obj) {
      if (typeof obj == "string")
        return true;
      else
        return false;
    }
    
    helperClass.prototype.isObject = function(obj) {
      if (typeof obj == "object")
        return true;
      else
        return false;
    }
    
    helperClass.prototype.isPrimtive = function(obj) {
      var vartype = (typeof obj);
      var primtives = "boolean,number,string";
      
      if (primtives.indexOf(vartype) !== -1)
        return true;
      else
        return false;
    }

  /*------------------------------------------------------------------------------------------------*/ 
 //https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/indexOf
 
 if (!Array.prototype.indexOf)
  {
    Array.prototype.indexOf = function(searchElement /*, fromIndex */)
    {
      "use strict";

      if (this === void 0 || this === null)
        throw new TypeError();

      var t = Object(this);
      var len = t.length >>> 0;
      if (len === 0)
        return -1;

      var n = 0;
      if (arguments.length > 0)
      {
        n = Number(arguments[1]);
        if (n !== n) // shortcut for verifying if it's NaN
          n = 0;
        else if (n !== 0 && n !== (1 / 0) && n !== -(1 / 0))
          n = (n > 0 || -1) * Math.floor(Math.abs(n));
      }

      if (n >= len)
        return -1;

      var k = n >= 0
            ? n
            : Math.max(len - Math.abs(n), 0);

      for (; k < len; k++)
      {
        if (k in t && t[k] === searchElement)
          return k;
      }
      return -1;
    };
  }
  

/*------------------------------------------------------------------------------------------------*/   
/**
 * Provides requestAnimationFrame in a cross browser way.
 * http://paulirish.com/2011/requestanimationframe-for-smart-animating/
 */

if ( !window.requestAnimationFrame ) {

  window.requestAnimationFrame = ( function() {

    return window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function( /* function FrameRequestCallback */ callback, /* DOMElement Element */ element ) {

      window.setTimeout( callback, 1000 / 30 );

    };

  } )();

}



  /*------------------------------------------------------------------------------------------------*/ 
  /*------------------------------------------------------------------------------------------------*/   
