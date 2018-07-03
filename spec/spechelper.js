//should be imported via a module, import or require as spechelper.js

var originalLink = document.createElement('a');
var shortenedLink = document.createElement('a');
var titleLink = document.createElement('a');
var countsLink = document.createElement('a');
var clickIcon = document.createElement('div');
clickIcon.className = "click-icon"; 


var result = {
  url:"https://yhoo.it/2MrPONd",
  hash:"2MrPONd",
  global_hash: "4bYAV2",
  long_url: "http://www.yahoo.com/",
  new_hash: 0
}

var titleResult = {
  title: "Yahoo",
  short_url: "https://yhoo.it/2MrPONd",
  created_at:1530017321,
  created_by:"dakhtar6",
  global_hash:"4bYAV2",
  user_hash:"2MrPONd",
  brand_guid:"Bi6pdkSOuhN"
}

var nullTitleResult = {
  title: null,
  short_url: "https://yhoo.it/2MrPONd",
  created_at:1530017321,
  created_by:"dakhtar6",
  global_hash:"4bYAV2",
  user_hash:"2MrPONd",
  brand_guid:"Bi6pdkSOuhN"
}

var falseTitleResult = {
  title: "",
  short_url: "https://yhoo.it/2MrPONd",
  created_at:1530017321,
  created_by:"dakhtar6",
  global_hash:"4bYAV2",
  user_hash:"2MrPONd",
  brand_guid:"Bi6pdkSOuhN"
}

var undefinedTitleResult = {
  title: undefined,
  short_url: "https://yhoo.it/2MrPONd",
  created_at:1530017321,
  created_by:"dakhtar6",
  global_hash:"4bYAV2",
  user_hash:"2MrPONd",
  brand_guid:"Bi6pdkSOuhN"
}

var longUrl = "http://www.yahoo.com/";

var countsResult = [{short_url:"https://cnn.it/2tylo4Y",user_hash:"2tylo4Y",global_hash:"2EEjBl",user_clicks:0,global_clicks:3727547}]; 

var viewedLinks = []; 

var store = {}

//should be imported via a module, import or require as spechelper.js

var storage = {
  pushToStorage: (data) => {
    window.localStorage.setItem("bitlyViewedLinks", data);
  }, 
  getFromStorage: () => {
    let links = window.localStorage.getItem("bitlyViewedLinks").split(",");
    return links; 
  }
}

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


var linkMaker = {
  shorten: (result, originalLink, shortenedLink) => {
    originalLink.href = result.long_url; 
    originalLink.className = "original"; 
    originalLink.innerHTML = result.long_url;
    shortenedLink.href = result.url; 
    shortenedLink.className = "shortened"; 
    shortenedLink.innerHTML = result.url; 
    viewedLinks.push(result.long_url); 
    storage.pushToStorage(viewedLinks); 
  },
  info: (result, longUrl, titleLink) => { 
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
    countsLink.href = result[0].short_url; 
    countsLink.className = "count";
    if(result[0].global_clicks === null || result[0].global_clicks === undefined || result[0].global_clicks === "") {
      console.error("Clicks Property Faulty");  
    }
    else {
      countsLink.innerHTML = result[0].global_clicks;
      countsLink.appendChild(clickIcon); 
    }
  }, 
  makeListItem: (bitlySDK, inputUrl, titleLink, countsLink, originalLink, shortenedLink, list, li, shortenedContainer, clickIcon) => {
    bitlySDK.shorten(inputUrl).then(result => {
      linkMaker.shorten(result, originalLink, shortenedLink) 
      return result; 
    })
    .then(result => {
      let longUrl = result.long_url; 
      bitlySDK.info(result.url).then(result => { 
        linkMaker.info(result, longUrl, titleLink); 
      }); 
      return result; 
    })
    .then(result => {
      bitlySDK.clicks(result.url).then(result => { 
        linkMaker.clicks(result, countsLink, clickIcon) 
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
    .catch(err => {
      alert("Your URL is incorrect - please try again! Make sure you preface with 'http://'! \n" + err); 
    })
  }
};
