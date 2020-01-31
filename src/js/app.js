import {Cart} from './components/Cart.js';
import {Product} from './components/Product.js';
import {select, settings, classNames} from './settings.js';
import {Booking} from './components/Booking.js';

const app = {
  
  initMenu: function() {

    const thisApp = this;
    // console.log('thisApp.data: ', thisApp.data);

    for (let productData in thisApp.data.products) {
      new Product(thisApp.data.products[productData].id, thisApp.data.products[productData]);
    }
  },

  initData: function() {
    const thisApp = this;

    thisApp.data = [];

    const url = settings.db.url + '/' + settings.db.product;

    fetch(url)
      .then(function(rawResponse) {
        return rawResponse.json();
      })
      .then(function(parsedResponse) {
        console.log('parsedResponse: ', parsedResponse);

        /* save parsetResponse as thisApp.data.product */

        thisApp.data.products = parsedResponse;

        /* execute initMenu method */

        thisApp.initMenu();
      });

    console.log('thisApp.data: ', JSON.stringify(thisApp.data));

  },

  initCart: function() {
    const thisApp = this;

    const cartElem = document.querySelector(select.containerOf.cart);
    thisApp.cart = new Cart(cartElem);

    thisApp.productList = document.querySelector(select.containerOf.menu);

    thisApp.productList.addEventListener('add-to-cart', function(event) {
      app.cart.add(event.detail.product);
    });
  },

  init: function() {
    const thisApp = this;   
  
    // console.log('*** App starting ***');
    // console.log('thisApp:', thisApp);
    // console.log('classNames:', classNames);
    // console.log('settings:', settings);
    // console.log('templates:', templates);

    thisApp.initCart();
    thisApp.initPages();
    thisApp.initData();
  },

  initPages: function(){
    const thisApp = this;
 
    thisApp.pages = document.querySelector(select.containerOf.pages).children;
    thisApp.navLinks = document.querySelectorAll(select.nav.links);
 
    const idFromHash = window.location.hash.replace('#/', '');
 
    let pageMatchingHash = thisApp.pages[0].id;

    let pagesMatchingHash = [];

    if(window.location.hash.length > 2) {
      const idFromHash = window.location.hash.replace('#/', ' ');

      pagesMatchingHash = thisApp.pages.filter(function(page) {
        return page.id == idFromHash;
      });
    }

    thisApp.activatePage(pagesMatchingHash.length ? pagesMatchingHash[0].id : thisApp.pages[0].id);
 
 
    for(let page of thisApp.pages){
      if(page.id == idFromHash){
        pageMatchingHash = page.id;
        break;
      }
    }
 
    thisApp.activatePage(pageMatchingHash);
 
    for(let link of thisApp.navLinks){
      link.addEventListener('click', function(event){
        const clickedElement = this;
        event.preventDefault();
 
        /* get id from href attribute */
 
        const id = clickedElement.getAttribute('href').replace('#', '');
 
        /* run thisApp.activatePage with that id */
 
        thisApp.activatePage(id);
 
        /* change URL hash */
 
        window.location.hash = '#/' + id;
 
      });
 
    }
  },

  activatePage: function(pageId) {
    const thisApp = this;

    for(let link of thisApp.navLinks) {
      link.classList.toggle(classNames.nav.active, link.getAttribute('href') == '#' + pageId);
    }

    for (let link of thisApp.pages) {
      link.classList.toggle(classNames.nav.active, link.getAttribute('id') == pageId);
      console.log('link: ', link);
      console.log('thisApp.pages: ', thisApp.pages);
    }

    window.location.hash = '#/' + pageId;
    
  },

  initBooking: function() {
    const thisApp = this;

    const bookingWidgetElem = document.querySelector(select.containerOf.booking);
    thisApp.bookingWidgetElem = new Booking(bookingWidgetElem);
  }
};

app.init();
