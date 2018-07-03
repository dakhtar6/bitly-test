(function() {  

'use strict'; 

//Array that will be used to store urls of viewed links
let viewedLinks = []; 
 
//a series of methods to help store and retrieve viewed links from local storage
const storage = {
  pushToStorage: (data) => {
    window.localStorage.setItem("bitlyViewedLinks", data);
  }, 
  getFromStorage: () => {
    let links = window.localStorage.getItem("bitlyViewedLinks").split(",");
    return links; 
  }
}
// a method that enables the copying of a url
const utility = {
  copyText: (url) => {
    // Create a <textarea> element
    const el = document.createElement('textarea');  
    // Set its value to the string that you want copied
    el.value = url;                                 
    // Make it readonly to be tamper-proof
    el.setAttribute('readonly', '');                
    // Move outside the screen to make it invisible
    el.style.position = 'absolute';                 
    el.style.left = '-9999px';   
    // Append the <textarea> element to the HTML document                  
    document.body.appendChild(el);   
    // Check if there is any content selected previously               
    const selected =            
      document.getSelection().rangeCount > 0   
      // Store selection if found,  mark as false to know no selection existed before
        ? document.getSelection().getRangeAt(0)     
        : false;                                    
    el.select();     
    // Copy url                               
    document.execCommand('copy');  
    console.log("link copied!"); 
    // Remove the <textarea> element                 
    document.body.removeChild(el);   
    // If a selection existed before copying, Unselect everything on the HTML document, Restore the original selection               
    if (selected) {                                 
      document.getSelection().removeAllRanges();    
      document.getSelection().addRange(selected);  
    }
    return el.value; 
  }
}

//a series of methods to help us process and create links from data provided by the Bitly SDK
const linkMaker = {
  bitlySDK: new BitlySDK({login: 'dakhtar6', apiKey: 'R_41487c4da8364f0183056d94beb560c9'}), 
  shorten: (result, originalLink, shortenedLink) => {
    //populate the original (long) link
    originalLink.href = result.long_url; 
    originalLink.className = "original"; 
    originalLink.innerHTML = result.long_url;
    //populate the shortened (bitly) link
    shortenedLink.href = result.url; 
    shortenedLink.className = "shortened"; 
    shortenedLink.innerHTML = result.url;
    //add long url to an array of viewed links
    viewedLinks.push(result.long_url); 
    //add viewed links to local storage so they can persist
    storage.pushToStorage(viewedLinks); 
    //shortened link copy functionality added on click
    shortenedLink.addEventListener('click', (event) => {
      //prevent anchor from triggering
      event.preventDefault();
      console.log("A", utility.copyText(result.url)); 
      utility.copyText(result.url); 
    })
  },
  info: (result, longUrl, titleLink) => { 
    //populate the title link
    titleLink.href = longUrl; 
    titleLink.className = "title"; 
    if(result.title === null || result.title === undefined || result.title === "") {
      titleLink.innerHTML = longUrl;
    }
    else {
      titleLink.innerHTML = result.title;
    }
  }, 
  clicks: (result, countsLink, clickIcon) => {
    //populate the count (global_clicks) link
    countsLink.href = result[0].short_url; 
    countsLink.className = "count";
    if(result[0].global_clicks === null || result[0].global_clicks === undefined || result[0].global_clicks === "") {
      console.error("Clicks Property Faulty");  
    }
    else {
      countsLink.innerHTML = result[0].global_clicks;
      //append click-icon as child of the countsLink anchor
      countsLink.appendChild(clickIcon); 
    }
  }, 
  makeListItem: (bitlySDK, inputUrl, titleLink, countsLink, originalLink, shortenedLink, list, li, shortenedContainer, clickIcon) => {
    bitlySDK.shorten(inputUrl).then(result => {//fire shorten SDK call
      linkMaker.shorten(result, originalLink, shortenedLink) //create a shortened link from the resulting data of the promise returned by the SDK call
      return result; 
    })
    .then(result => {
      let longUrl = result.long_url; //capture a reference to the long url provided by the result belonging to the previous promise 
      bitlySDK.info(result.url).then(result => { //fire info SDK call
        linkMaker.info(result, longUrl, titleLink); //create a link with the title from the resulting data of the promise returned by the SDK call
      }); 
      return result; 
    })
    .then(result => {
      bitlySDK.clicks(result.url).then(result => { //fire clicks SDK call
        linkMaker.clicks(result, countsLink, clickIcon) //create a link with the title from the resulting data of the promise returned by the SDK call
      });
    })
    .then(() => { 
      //append to DOM 
      let docFragment = document.createDocumentFragment();
      li.appendChild(titleLink);
      li.appendChild(originalLink);
      li.appendChild(shortenedContainer); 
      shortenedContainer.appendChild(shortenedLink);
      shortenedContainer.appendChild(countsLink);
      docFragment.appendChild(li);
      list.appendChild(docFragment); 
    })
    //error handling - not ideal but serves as a general validation of user submitted link input - not a precise error message or methodology
    .catch(err => {
      alert("Your URL is incorrect - please try again! Make sure you preface with 'http://'! \n" + err); 
    })
  }
};

//grab html elements
let input = document.getElementById('input'); 
let list = document.getElementById('list'); 
let form = document.getElementById('link-submit'); 

//submit event listener
form.addEventListener('submit', function(event) {
  event.preventDefault(); 
  //grab user provided url
  let inputUrl = input.value; 
  //create HTML elements
  let titleLink = document.createElement('a'); 
  let countsLink = document.createElement('a'); 
  let originalLink = document.createElement('a'); 
  let shortenedLink = document.createElement('a'); 
  let shortenedContainer = document.createElement('div'); 
  let li = document.createElement('li');
  let clickIcon = document.createElement('div');
  //provide classnames to html elements
  shortenedContainer.className = "shortened-container"; 
  clickIcon.className = "click-icon"; 
  //call to construct and append list item containing all 4 links 
  linkMaker.makeListItem(linkMaker.bitlySDK, inputUrl, titleLink, countsLink, originalLink, shortenedLink, list, li, shortenedContainer, clickIcon);  
}); 

//populate previously viewed links
window.addEventListener('load', function() {
  if(localStorage.bitlyViewedLinks) {
    //get links from local storage
    let links = storage.getFromStorage(); 
    //iterate through the collection of viewed links and make a list item for each one 
    links.forEach(function(link) {
      //create HTML elements
      let titleLink = document.createElement('a'); 
      let countsLink = document.createElement('a'); 
      let originalLink = document.createElement('a'); 
      let shortenedLink = document.createElement('a'); 
      let shortenedContainer = document.createElement('div'); 
      let li = document.createElement('li');
      let clickIcon = document.createElement('div');
      //provide classnames to html elements
      shortenedContainer.className = "shortened-container"; 
      clickIcon.className = "click-icon"; 
      //construct link
      linkMaker.makeListItem(linkMaker.bitlySDK, link, titleLink, countsLink, originalLink, shortenedLink, list, li, shortenedContainer, clickIcon); 
    }); 
  } 
})

})(); 