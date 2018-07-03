// imported spechelper.js via an external script
describe('Test the linkMaker shorten method', () => {

  it('should create a link using the original (long) url from the provided data, and another link using the shortened (bitly) url from the provided data, both with the correct attributes', () => {
    linkMaker.shorten(result, originalLink, shortenedLink); 
  
    expect(originalLink.href).toBe(result.long_url); 
    expect(originalLink.className).toBe('original'); 
    expect(originalLink.innerHTML).toBe(result.long_url); 

    expect(shortenedLink.href).toBe(result.url); 
    expect(shortenedLink.className).toBe('shortened'); 
    expect(shortenedLink.innerHTML).toBe(result.url); 
  })

})

describe('Test the linkMaker info method', () => {

  it('should create a link using the title from the provided data and with the correct attributes', () => {
    linkMaker.info(titleResult, longUrl, titleLink); 

    expect(titleLink.href).toBe(longUrl); 
    expect(titleLink.className).toBe('title'); 
    expect(titleLink.innerHTML).toBe(titleResult.title); 
  })

  it('should create a link using the long url from the provided data when the title property is null and with the correct attributes', () => {
    linkMaker.info(nullTitleResult, longUrl, titleLink);     
  
    expect(titleLink.href).toBe(longUrl); 
    expect(titleLink.className).toBe('title'); 
    expect(titleLink.innerHTML).toBe(longUrl); 
  })

  it('should create a link using the long url from the provided data when the title property is false and with the correct attributes', () => {
    linkMaker.info(falseTitleResult, longUrl, titleLink); 

    expect(titleLink.href).toBe(longUrl); 
    expect(titleLink.className).toBe('title'); 
    expect(titleLink.innerHTML).toBe(longUrl); 
  })

  it('should create a link using the long url from the provided data when the title property is undefined and with the correct attributes', () => {
    linkMaker.info(undefinedTitleResult, longUrl, titleLink); 

    expect(titleLink.href).toBe(longUrl); 
    expect(titleLink.className).toBe('title'); 
    expect(titleLink.innerHTML).toBe(longUrl); 
  })

})

describe('Test the linkMaker clicks method', () => {

  it('should create a link using the global_clicks from the provided data and with the correct attributes', () => {
    linkMaker.clicks(countsResult, countsLink, clickIcon); 
    
    expect(countsLink.href).toBe(countsResult[0].short_url); 
    expect(countsLink.className).toBe('count'); 
    expect(countsLink.innerText).toBe(String(countsResult[0].global_clicks)); 
  })

  it('should append the click-icon div as the first child of the counts anchor', () => {
    linkMaker.clicks(countsResult, countsLink, clickIcon); 
    
    expect(countsLink.children[0]).toBe(clickIcon); 
  })

})

describe('Test the linkMaker makeLink method', () => {

  it('should append 4 links to the DOM', () => {
    var list = document.getElementById('list'); 
    var li = document.createElement('li');
    var shortenedContainer = document.createElement('div'); 
    var clickIcon = document.createElement('div');
    var form = document.getElementById('link-submit'); 

    var docFragment = document.createDocumentFragment();
    li.appendChild(titleLink);
    li.appendChild(originalLink);
    li.appendChild(shortenedContainer); 
    shortenedContainer.appendChild(shortenedLink);
    shortenedContainer.appendChild(countsLink);
    docFragment.appendChild(li);
    list.appendChild(docFragment); 
    
    linkMaker.shorten(result, originalLink, shortenedLink); 
    linkMaker.info(titleResult, longUrl, titleLink); 
    linkMaker.clicks(countsResult, countsLink, clickIcon); 
    
    expect(li.children[0]).toBe(titleLink); 
    expect(li.children[1]).toBe(originalLink); 
    expect(shortenedContainer.children[0]).toBe(shortenedLink); 
    expect(shortenedContainer.children[0]).toBe(shortenedLink); 
    expect(list.children[0]).toBe(li); 
  })

})

describe('Test the storage methods', () => {
  it('pushToStorage should store an array with a single string in local storage', () => {
    var spy = spyOn(localStorage, 'setItem').and.callFake((key, value) => {
      store[key] = value;
      return store[key]; 
    });
    var result = spy("bitlyViewedLinks", ["http://www.yahoo.com"]); 
    expect(spy).toHaveBeenCalled(); 
    expect(result).toEqual(jasmine.arrayContaining(["http://www.yahoo.com"]));
  })

  it('getFromStorage should retrieve an array with a single string from local storage', () => {
    store["bitlyViewedLinks"] = ["http://www.yahoo.com"]; 
    var spy = spyOn(window.localStorage, 'getItem').and.callFake((key) => {
      return store[key];
    });
    var result = spy("bitlyViewedLinks");
    expect(spy).toHaveBeenCalled();
    expect(result).toEqual(jasmine.arrayContaining(["http://www.yahoo.com"]));
  })
})

describe('Test the copytext method', () => {
  it('should trigger upon the click of a link and copy the shortenedLink href', () => {
    var clickEvent = new Event('click'); 
    shortenedLink.href = "https://yhoo.it/2MrPONd"; 
   var result; 
    shortenedLink.addEventListener('click', (event) => {
      event.preventDefault(); 
      return result = utility.copyText(shortenedLink.href); 
    });
    shortenedLink.dispatchEvent(clickEvent);
    expect(result).toBe(shortenedLink.href); 
  })
})
