
function translate(sl,tl,text){
  let query='https://translate.googleapis.com/translate_a/single?client=gtx&sl='+sl+'&tl='+tl+'&dt=t&q='+encodeURI(text);
  let Http = new XMLHttpRequest();
  Http.open("GET", query,false);
  Http.send();
  return JSON.parse(Http.responseText)[0][0][0];
}


function getSelectedLanguageCodes(selector){
  let selected=[];
  let options=selector.options;
  for(let i=0;i<options.length;i++){
    let option=options[i];
    if(option.selected){
      selected.push(option.value);
    }
  }
  return selected;
}

 function loadFiles() {
   let files=document.getElementById('translateInfo').elements['ogFiles'].files;
   let languageCodes=getSelectedLanguageCodes(document.getElementById('translateInfo').elements['targetLanguages']);
   for (let i=0;i<files.length;i++){
     let reader = new FileReader();
     reader.onload = function() {
       //cycle through all languages, shouldn't need to set parsed back to originalfile(just use auto as source language)
       //setting xmlDoc back to original language each time anyway though should give better translations?
       for(let j=0;j<languageCodes.length;j++){
         let tl=languageCodes[j];
         let fname=files[i].name
         fname=fname.substring(0,fname.indexOf('.'))+'-'+tl;//remove file extension and add language code
         //XML specific starts here:(change this section if you want to use other filetypes)
         let parsed = new DOMParser().parseFromString(this.result, "text/xml");
         translateXML(parsed.children,tl);
         saveXML(parsed,fname);
         //ends here.
      }
     };
     reader.readAsText(files[i]);
   }
 }

 function translateXML(xmlChildren,tl){//recursive function
   for (let i=0;i<xmlChildren.length;i++){
     let child=xmlChildren[i];
     let children=child.children;
     if(children.length==0){//no children other than textNode as child
       child.childNodes[0].nodeValue=translate('auto',tl,child.childNodes[0].nodeValue);
     }
     else{//it has children
       translateXML(children,tl);
     }
   }
 }

 function saveXML(xmlDoc,filename){//find way to save xml file
   let stringXML=new XMLSerializer().serializeToString(xmlDoc);
   let xmlBlob=new Blob([stringXML],{type: 'text/xml'});
   saveBlob(xmlBlob, filename+'.xml', true);
 }

 function saveBlob (blob,fileName,auto) {
   let downloadElement = document.createElement('a');
   let url = window.URL.createObjectURL(blob);
   downloadElement.href=url;
   downloadElement.download = fileName;
   if(!auto){
     downloadElement.appendChild(document.createTextNode(fileName));
     document.body.appendChild(downloadElement);
   }else{
     downloadElement.style = "display: none";
     downloadElement.click();
     window.URL.revokeObjectURL(url);
   }
 }
