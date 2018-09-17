/*
    this will not work when you try to access the translated paragraph elements,
    however I found url format used to query for translations


*/
/*this code  handles xml files,easy to add support for translating
  more filetypes though
*/

let parsed;//the file after it has been parsed
//this is for xml its how the node's attribute which is used to match it to the correct p element
let unique_key='name';//change the writeHTMLToXML logic if you use something else since there might not be a

/*
  this is triggered when the files are selected
*/
function loadFiles(files) { //maybe make it one file at a time sodon't have to deal with which file each
  document.getElementById("translate").innerHTML="";
  for (let i=0;i<files.length;i++){
    let reader = new FileReader();
    reader.onload = function() {
      //XML specific starts here:(change this section if you want to use other filetypes)
      parsed = new DOMParser().parseFromString(this.result, "text/xml");
      writeXMLToHTML(parsed.children);
      //ends here.
    };
    reader.readAsText(files[i]);
  }
}

/*create p element with innerHTML property of anything with no children and else pass its children recursivly
  (could check childNodes instead of children and if it is nodeType3(text) then createTextNode with its wholeText property)
  (this way is easier though and servesmy purpose also more checks to make that way)*/
function writeXMLToHTML(xmlChildren){//recursive function
  for (let i=0;i<xmlChildren.length;i++){
    let child=xmlChildren[i];
    let children=child.children;
    if(children.length==0){//no children
      let para=document.createElement('p');
      //make sure your childless xmlnodes have a unique attribuite
      para.id=child.getAttribute(unique_key);
      //maybe add some of the xmlNode's attribuites to the p element
      para.appendChild(document.createTextNode(child.innerHTML));
      document.getElementById('translate').appendChild(para);
    }
    else{//it has children
      writeXMLToHTML(children);
    }
  }
}

/*
  this is triggered after the page is translated to a new language
 */
function writeHTMLToFile(){
  let langcode=document.getElementsByClassName('goog-te-combo')[0].value;//2 letter language code for language translated into
  writeHTMLToXML(parsed.children);
  console.log(langcode);

  /*can let user enter list of languages and change value to next one in list or cycle through
  all the given options
  document.getElementsByClassName('goog-te-combo')[0].value='fr';
  console.log(document.getElementsByClassName('goog-te-combo')[0].children[0].value);*/
}

/*
  might as well just copy writeXMLToHTML function and just change what happens when you reach it
*/

function writeHTMLToXML(xmlChildren){
  for (let i=0;i<xmlChildren.length;i++){
    let child=xmlChildren[i];
    let children=child.children;
    if(children.length==0){//no children so change its value to translated one
      //if i do this it gives me untranslated original i think google has thought about this
      console.log(document.getElementById(child.getAttribute(unique_key)));
    }
    else{//it has children
      writeHTMLToXML(children);
    }
  }
}


/*This function will let you pass in a blob and name to save it as a file,
  it will then add a link to download the file or autodownload the file
*/
/*function saveBlob (blob,fileName,auto) {
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
}*/
