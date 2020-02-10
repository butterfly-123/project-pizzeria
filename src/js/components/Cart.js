import {settings, select, classNames, templates} from '../settings.js';
import {utils} from '../utils.js';
import {CartProduct} from './CartProduct.js';

export class Cart {
  constructor(element) {
    const thisCart = this;

    thisCart.products = [];

    thisCart.deliveryFee = settings.cart.defaultDeliveryFee;

    thisCart.getElements(element);
    thisCart.initActions();

    // console.log('thisCart: ', thisCart);
  }

  update() {
    const thisCart = this;

    thisCart.totalNumber = 0;
    thisCart.subtotalPrice = 0;

    for (let product of thisCart.products) {
      thisCart.subtotalPrice = thisCart.subtotalPrice + product.price;

      thisCart.totalNumber = thisCart.totalNumber + product.amount;
    }

    thisCart.totalPrice = thisCart.subtotalPrice + thisCart.deliveryFee;

    //console.log('totalNumber: ', thisCart.totalNumber);
    //console.log('subtotalPrice: ', thisCart.subtotalPrice);
    //console.log('thisCart.totalPrice: ', thisCart.totalPrice);

    for (let key of thisCart.renderTotalsKeys) {
      for (let elem of thisCart.dom[key]) {
        elem.innerHTML = thisCart[key];
      }
    }
  }

  getElements(element) {
    const thisCart = this;

    thisCart.dom = {};

    thisCart.dom.wrapper = element;

    thisCart.dom.productList = thisCart.dom.wrapper.querySelector(select.cart.productList);

    // console.log('thisCart.dom.wrapper: ', thisCart.dom.wrapper);

    thisCart.dom.form = thisCart.dom.wrapper.querySelector(select.cart.form);

    thisCart.dom.phone = thisCart.dom.wrapper.querySelector(select.cart.phone);
    thisCart.dom.address = thisCart.dom.wrapper.querySelector(select.cart.address);

    // console.log(thisCart.dom.phone);

    thisCart.dom.toggleTrigger = thisCart.dom.wrapper.querySelector(select.cart.toggleTrigger);

    thisCart.renderTotalsKeys = [
      'totalNumber',
      'totalPrice',
      'subtotalPrice',
      'deliveryFee'
    ];

    for (let key of thisCart.renderTotalsKeys) {
      thisCart.dom[key] = thisCart.dom.wrapper.querySelectorAll(select.cart[key]);
    }
  }

  initActions() {
    const thisCart = this;

    thisCart.dom.toggleTrigger.addEventListener('click', function() {
      event.preventDefault();

      thisCart.dom.wrapper.classList.toggle(classNames.cart.wrapperActive);
    });

    thisCart.dom.productList.addEventListener('updated', function() {
      thisCart.update();
    });

    thisCart.dom.productList.addEventListener('remove', function() {
      thisCart.remove(event.detail.cartProduct);
    });

    thisCart.dom.form.addEventListener('submit', function() {
      event.preventDefault();

      thisCart.sendOrder();
    });
  }

  sendOrder() {
    const thisCart = this;
    console.log('send');

    const url = settings.db.url + '/' + settings.db.order;

    const payload = {
      address: thisCart.dom.address.value,
      totalPrice: thisCart.totalPrice,
      totalNumber: thisCart.totalNumber,
      subtotalPrice: thisCart.subtotalPrice,
      deliveryFee: thisCart.deliveryFee,
      phone: thisCart.dom.phone.value,

      products: []
    };

    for (let product of thisCart.products) {
      payload.products.push(product.getData());
    }
    
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    };

    fetch(url, options)
      .then(function(response) {
        return response.json();
      })
      .then(function(parsedResponse) {
        console.log('parsedResponse', parsedResponse);
      });
  }

  remove(cartProduct) {
    const thisCart = this;

    const index = thisCart.products.indexOf(cartProduct);

    console.log('index: ', index);

    thisCart.products.splice(index, 1);

    cartProduct.dom.wrapper.remove(cartProduct);

    thisCart.update();
  }

  add(menuProduct) {
    const thisCart = this;

    // new code start

    const generatedHTML = templates.cartProduct(menuProduct);

    //console.log('generatedHTML: ', generatedHTML);

    const generatedDOM = utils.createDOMFromHTML(generatedHTML);

    //console.log('generatedDOM: ', generatedDOM);

    thisCart.dom.productList.appendChild(generatedDOM);

    // new code end

    //console.log('adding product', menuProduct);

    thisCart.products.push(new CartProduct(menuProduct, generatedDOM));

    //console.log('thisCart.products', thisCart.products);

    thisCart.update();
  }
}