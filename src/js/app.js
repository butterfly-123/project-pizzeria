import {Cart} from './components/Cart.js';
import {Product} from './components/Product.js';
import {select, settings, classNames} from './settings.js';

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

  initPages: function() {
    const thisApp = this;

    thisApp.pages = Array.from(document.querySelector(select.containerOf.pages).children);
    thisApp.navLinks = Array.from(document.querySelectorAll(select.nav.links));

    thisApp.activatePage(thisApp.pages[0].id);

    for (let link of thisApp.navLinks) {
      link.addEventListener('click', function(event) {
        let clickedElement = this;
        event.preventDefault();

        /* TODO: get page id from href */
        clickedElement = thisApp.pages.id.getAttribute('href');
        clickedElement.thisApp.pages.id.classList('');
        /* TODO: active pages */
        thisApp.activatePage();
      });
    }
  },

  activatePage: function(pageId) {
    const thisApp = this;

    for(let link of thisApp.navLinks) {
      link.classList.toggle(classNames.nav.active, link.getAttribute('href') == '#' + pageId);
    }

    for (let link of thisApp.pages) {
      link.classList.toggle(classNames.nav.active, link.thisApp.pages.id == pageId);
    }
  }


};

app.init();
