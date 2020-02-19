import {Cart} from './components/Cart.js';
import {Product} from './components/Product.js';
import {select, settings, classNames} from './settings.js';
import {Booking} from './components/Booking.js';

const app = {
  initMenu: function() {
    const thisApp = this;
    // console.log('thisApp.data: ', thisApp.data);

    for (let productData in thisApp.data.products) {
      new Product(
        thisApp.data.products[productData].id,
        thisApp.data.products[productData]
      );
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

    // console.log('thisApp.data: ', JSON.stringify(thisApp.data));
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
    thisApp.initBooking();
  },

  initPages: function() {
    const thisApp = this;

    thisApp.pages = document.querySelector(select.containerOf.pages).children;
    thisApp.navLinks = document.querySelectorAll(select.nav.links);
    // console.log(thisApp.navLinks);
    const idFromHash = window.location.hash.replace('#/', '');

    let pageMatchingHash = thisApp.pages[0].id;

    for (let page of thisApp.pages) {
      if (page.id == idFromHash) {
        pageMatchingHash = page.id;
        break;
      }
    }

    thisApp.activatePage(pageMatchingHash);

    window.onhashchange = function(event) { 
      event.preventDefault();
      this.console.log(event.newURL, event.newURL.split('/'));
      const id = event.newURL.split('/')[3].replace('#', '');

      thisApp.activatePage(id);
    };
  },

  activatePage: function(pageId) {
    const thisApp = this;

    for (let link of thisApp.navLinks) {
      link.classList.toggle(
        classNames.nav.active,
        link.getAttribute('href') == '#' + pageId
      );
    }

    for (let link of thisApp.pages) {
      link.classList.toggle(
        classNames.nav.active,
        link.getAttribute('id') == pageId
      );
    }
  },

  initBooking() {
    const thisApp = this;

    // znajdz container widgetu do rezerwacji stron
    const reservWidgetContainer = document.querySelector(
      select.containerOf.booking
    );

    // tworzy nowa instancje klasy booking
    thisApp.booking = new Booking(reservWidgetContainer);
  }
};

app.init();
