/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

{
  'use strict';

  const select = {
    templateOf: {
      menuProduct: '#template-menu-product',
      cartProduct: '#template-cart-product',
    },
    containerOf: {
      menu: '#product-list',
      cart: '#cart',
    },
    all: {
      menuProducts: '#product-list > .product',
      menuProductsActive: '#product-list > .product.active',
      formInputs: 'input, select',
    },
    menuProduct: {
      clickable: '.product__header',
      form: '.product__order',
      priceElem: '.product__total-price .price',
      imageWrapper: '.product__images',
      amountWidget: '.widget-amount',
      cartButton: '[href="#add-to-cart"]',
    },
    widgets: {
      amount: {
        input: 'input.amount',
        linkDecrease: 'a[href="#less"]',
        linkIncrease: 'a[href="#more"]',
      },
    },
    cart: {
      productList: '.cart__order-summary',
      toggleTrigger: '.cart__summary',
      totalNumber: `.cart__total-number`,
      totalPrice: '.cart__total-price strong, .cart__order-total .cart__order-price-sum strong',
      subtotalPrice: '.cart__order-subtotal .cart__order-price-sum strong',
      deliveryFee: '.cart__order-delivery .cart__order-price-sum strong',
      form: '.cart__order',
      formSubmit: '.cart__order [type="submit"]',
      phone: '[name="phone"]',
      address: '[name="address"]',
    },
    cartProduct: {
      amountWidget: '.widget-amount',
      price: '.cart__product-price',
      edit: '[href="#edit"]',
      remove: '[href="#remove"]',
    },
  };

  const classNames = {
    menuProduct: {
      wrapperActive: 'active',
      imageVisible: 'active',
    },
    cart: {
      wrapperActive: 'active',
    },
  };

  const settings = {
    amountWidget: {
      defaultValue: 1,
      defaultMin: 1,
      defaultMax: 9,
    },
    cart: {
      defaultDeliveryFee: 20,
    },
    db: {
      url: '//localhost:3131',
      product: 'product',
      order: 'order',
    },
  };

  const templates = {
    menuProduct: Handlebars.compile(document.querySelector(select.templateOf.menuProduct).innerHTML),
    cartProduct: Handlebars.compile(document.querySelector(select.templateOf.cartProduct).innerHTML),
  };


  class Product {
    constructor(id, data) {
      const thisProduct = this;

      thisProduct.id = id;
      thisProduct.data = data;

      thisProduct.renderInMenu();
      thisProduct.getElements();
      thisProduct.initAccordion();
      thisProduct.initOrderForm();
      thisProduct.initAmountWidget();
      thisProduct.processOrder();

      // console.log('newProduct: ', thisProduct);
    }

    renderInMenu() {
      const thisProduct = this;
 
      /* [done] generate HTML based on template */
 
      const generatedHTML = templates.menuProduct(thisProduct.data);
 
      /* [done] create element using utils.createElementFromHTML */
 
      thisProduct.element = utils.createDOMFromHTML(generatedHTML);
 
      /* [done] find menu container */
 
      const menuContainer = document.querySelector(select.containerOf.menu);
 
      /* [done] add element to menu */
 
      menuContainer.appendChild(thisProduct.element);
    }

    getElements() {
      const thisProduct = this;
    
      thisProduct.accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
      thisProduct.form = thisProduct.element.querySelector(select.menuProduct.form);
      thisProduct.formInputs = thisProduct.form.querySelectorAll(select.all.formInputs);
      thisProduct.cartButton = thisProduct.element.querySelector(select.menuProduct.cartButton);
      thisProduct.priceElem = thisProduct.element.querySelector(select.menuProduct.priceElem);
      thisProduct.imageWrapper = thisProduct.element.querySelector(select.menuProduct.imageWrapper);
      thisProduct.amountWidgetElem = thisProduct.element.querySelector(select.menuProduct.amountWidget);
    }

    initAccordion() {
      const thisProduct = this;
 
      /* [done] find the clickable trigger (the element that should react to clicking) */
 
      const trigger = thisProduct.accordionTrigger;
 
      /* [done] START: click event listener to trigger */
 
      trigger.addEventListener('click', function() {

        /* [done] prevent default action for event */
 
        event.preventDefault();
 
        /* [done] toggle active class on element of thisProduct */
 
        thisProduct.element.classList.toggle('active');
 
        /* [done] find all active products */
 
        const activeProducts = document.querySelectorAll(
          '.product-list article.active'
        );
 
        /* [done] START LOOP: for each active product */
 
        for (let activeProduct of activeProducts) {

          /* [done] START: if the active product isn't the element of thisProduct */
 
          if (activeProduct != thisProduct.element) {

            /* [done] remove class active for the active product */
 
            activeProduct.classList.remove('active');
 
            /* [done] END: if the active product isn't the element of thisProduct */
          }
 
          /* [done] END LOOP: for each active product */
        }
 
        /* [DONE] END: click event listener to trigger */
      });
    }

    initOrderForm() {
      const thisProduct = this;
 
      thisProduct.form.addEventListener('submit', function(event) {
        event.preventDefault();
        thisProduct.processOrder();
      });
 
      for (let input of thisProduct.formInputs) {
        input.addEventListener('change', function() {
          thisProduct.processOrder();
        });
      }
 
      thisProduct.cartButton.addEventListener('click', function(event) {
        event.preventDefault();
        thisProduct.processOrder();
        thisProduct.addToCart();
      });
    }

    processOrder() {
      const thisProduct = this;
 
      /* [done] read all data from the form (using utils.serializeFormToObject) and save it to const formData */
 
      const formData = utils.serializeFormToObject(thisProduct.form);

      thisProduct.params = {};

      /* [done] set variable price to equal thisProduct.data.price */

      let price = thisProduct.data.price;
 
      /* [done] START LOOP: for each paramId in thisProduct.data.params */
 
      for (let paramId in thisProduct.data.params) {

        /* [done] save the element in thisProduct.data.params with key paramId as const param */
 
        const param = thisProduct.data.params[paramId];
 
        /* [done] START LOOP: for each optionId in param.options */
 
        for (let optionId in param.options) {

          /* [done] save the element in param.options with key optionId as const option */
 
          const option = param.options[optionId];
 
          const optionSelected = 
            formData.hasOwnProperty(paramId) && 
            formData[paramId].indexOf(optionId) > -1;
 
          /* [done] START IF: if option is selected and option is not default */
 
          if (optionSelected && !option.default) {

            /* [done] add price of option to variable price */
 
            price = price + option.price;
 
            /* [done] END IF: if option is selected and option is not default */

          } else if (!optionSelected && option.default) {

            /* [done] START ELSE IF: if option is not selected and option is default */
            /* [done] deduct price of option from price */
 
            price = price - option.price;
 
            // console.log('option.price: ', option.price);
 
            /* [done] END ELSE IF: if option is not selected and option is default */
          }
 
          const optionImages = thisProduct.imageWrapper.querySelectorAll('.' + paramId + '-' + optionId);
 
          // console.log('optionImages: ', optionImages);
 
          if (optionSelected) {

            if(!thisProduct.params[paramId]) {
              thisProduct.params[paramId] = {
                label: param.label,
                options: {},
              };
            }

            thisProduct.params[paramId].options[optionId] = option.label;

            for (let image of optionImages) {
              image.classList.add(classNames.menuProduct.imageVisible);
            }
          } else {
            for (let image of optionImages) {
              image.classList.remove(classNames.menuProduct.imageVisible);
            }
          }
 
          /* [done] END LOOP: for each optionId in param.options */
        }
 
        /* [done] END LOOP: for each paramId in thisProduct.data.params */
      }
 
      /* [done] set the contents of thisProduct.priceElem to be the value of variable price */

      thisProduct.priceSingle = price;
      thisProduct.price = thisProduct.priceSingle * thisProduct.amountWidget.value;

      thisProduct.priceElem.innerHTML = thisProduct.price;

      // console.log('thisProduct.params: ', thisProduct.params);
    }

    initAmountWidget() {
      const thisProduct = this;

      thisProduct.amountWidget = new AmountWidget(thisProduct.amountWidgetElem);

      thisProduct.amountWidgetElem.addEventListener('updated', thisProduct.processOrder());
    }

    addToCart() {
      const thisProduct = this; 

      thisProduct.name = thisProduct.data.name;
      thisProduct.amount = thisProduct.amountWidget.value;

      app.cart.add(thisProduct);
    }

  }
  
  class AmountWidget {
    constructor(element){
      const thisWidget = this;

      thisWidget.getElements(element);
      thisWidget.value = settings.amountWidget.defaultValue;
      thisWidget.setValue(thisWidget.input.value);
      thisWidget.initActions();

      // console.log('amountWidget: ', thisWidget);
      // console.log('constructor argument: ', element);
    }

    getElements(element) {
      const thisWidget = this;
    
      thisWidget.element = element;
      thisWidget.input = thisWidget.element.querySelector(select.widgets.amount.input);
      thisWidget.linkDecrease = thisWidget.element.querySelector(select.widgets.amount.linkDecrease);
      thisWidget.linkIncrease = thisWidget.element.querySelector(select.widgets.amount.linkIncrease);
    }

    setValue(value) {
      const thisWidget = this;

      const newValue = parseInt(value);
      // console.log('newValue: ', newValue);

      /* TODO: Add validation */

      if (
        newValue.value !== thisWidget.value && 
        newValue >= settings.amountWidget.defaultMin && 
        newValue <= settings.amountWidget.defaultMax
      ) {
        thisWidget.value = newValue;
        thisWidget.announce();
      } 

      thisWidget.input.value = thisWidget.value;
    }

    initActions() {
      const thisWidget = this;
 
      thisWidget.input.addEventListener('change', function() {
        thisWidget.setValue(thisWidget.input.value);
      });
 
      thisWidget.linkDecrease.addEventListener('click', function() {
        thisWidget.setValue(thisWidget.value - 1);
      });

      thisWidget.linkIncrease.addEventListener('click', function() {
        thisWidget.setValue(thisWidget.value + 1);
      });
    }

    announce() {
      const thisWidget = this;

      const event = new CustomEvent('updated', {
        bubbles: true
      });
      thisWidget.element.dispatchEvent(event); 
    }
  }

  class Cart {
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
 
      thisCart.dom.productList = thisCart.dom.wrapper.querySelector(
        select.cart.productList
      );
 
      // console.log('thisCart.dom.wrapper: ', thisCart.dom.wrapper);
 
      thisCart.dom.form = thisCart.dom.wrapper.querySelector(select.cart.form);
 
      thisCart.dom.phone = thisCart.dom.wrapper.querySelector(
        select.cart.phone
      );
      thisCart.dom.address = thisCart.dom.wrapper.querySelector(
        select.cart.address
      );
 
      console.log(thisCart.dom.phone);
 
      thisCart.dom.toggleTrigger = thisCart.dom.wrapper.querySelector(
        select.cart.toggleTrigger
      );
 
      thisCart.renderTotalsKeys = [
        "totalNumber",
        "totalPrice",
        "subtotalPrice",
        "deliveryFee"
      ];
 
      for (let key of thisCart.renderTotalsKeys) {
        thisCart.dom[key] = thisCart.dom.wrapper.querySelectorAll(
          select.cart[key]
        );
      }
    }

    initActions() {
      const thisCart = this;
 
      thisCart.dom.toggleTrigger.addEventListener("click", function() {
        event.preventDefault();
 
        thisCart.dom.wrapper.classList.toggle(classNames.cart.wrapperActive);
      });
 
      thisCart.dom.productList.addEventListener("updated", function() {
        thisCart.update();
      });
 
      thisCart.dom.productList.addEventListener("remove", function() {
        thisCart.remove(event.detail.cartProduct);
      });
 
      thisCart.dom.form.addEventListener("submit", function() {
        event.preventDefault();
 
        thisCart.sendOrder();
      });
    }

    sendOrder() {
      const thisCart = this;
      console.log("send");
 
      const url = settings.db.url + "/" + settings.db.order;
 
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
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      };
 
      fetch(url, options)
        .then(function(response) {
          return response.json();
        })
        .then(function(parsedResponse) {
          console.log("parsedResponse", parsedResponse);
        });
    }

    remove(cartProduct) {
      const thisCart = this;
 
      const index = thisCart.products.indexOf(cartProduct);
 
      console.log("index: ", index);
 
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

  class CartProduct {
    constructor(menuProduct, element) {
      const thisCartProduct = this;
 
      thisCartProduct.id = menuProduct.id;
      thisCartProduct.name = menuProduct.name;
      thisCartProduct.price = menuProduct.price;
      thisCartProduct.priceSingle = menuProduct.priceSingle;
      thisCartProduct.amount = menuProduct.amount;
 
      thisCartProduct.params = JSON.parse(JSON.stringify(menuProduct.params));
 
      thisCartProduct.getElements(element);
 
      thisCartProduct.initAmountWidget();
      thisCartProduct.initActions();
 
      //console.log('new CartProduct: ', thisCartProduct);
      //console.log('productData: ',menuProduct);
    }

    getElements(element) {
      const thisCartProduct = this;
 
      thisCartProduct.dom = {};
 
      thisCartProduct.dom.wrapper = element;
      thisCartProduct.dom.amountWidget = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.amountWidget);
      thisCartProduct.dom.price = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.price);
      thisCartProduct.dom.edit = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.edit);
      thisCartProduct.dom.remove = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.remove);
    }

    getData() {
      const thisCartProduct = this;
 
      const orderObject = {
        id: thisCartProduct.id,
        amount: thisCartProduct.amount,
        price: thisCartProduct.price,
        priceSingle: thisCartProduct.priceSingle,
        params: thisCartProduct.params
      };
 
      console.log("orderObject", orderObject);
 
      return orderObject;
    }

    initAmountWidget() {
      const thisCartProduct = this;
 
      thisCartProduct.amountWidget = new AmountWidget(
        thisCartProduct.dom.amountWidget
      );

      thisCartProduct.dom.amountWidget.addEventListener("updated", function() {
        thisCartProduct.amount = thisCartProduct.amountWidget.value;
        thisCartProduct.price = thisCartProduct.priceSingle * thisCartProduct.amount;
 
        thisCartProduct.dom.price = thisCartProduct.price;
      });
    }

    remove() {
      const thisCartProduct = this;
 
      const event = new CustomEvent("remove", {
        bubbles: true,
        detail: {
          cartProduct: thisCartProduct
        }
      });
 
      thisCartProduct.dom.wrapper.dispatchEvent(event);
 
      console.log("thisCartProduct.remove", thisCartProduct.remove);
    }

    initActions() {
      const thisCartProduct = this;
 
      thisCartProduct.dom.edit.addEventListener("click", function() {
        event.preventDefault();
      });
 
      thisCartProduct.dom.remove.addEventListener("click", function() {
        event.preventDefault();
 
        thisCartProduct.remove();
      });
    }
  }

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
    },

    init: function() {
      const thisApp = this;   
    
      // console.log('*** App starting ***');
      // console.log('thisApp:', thisApp);
      // console.log('classNames:', classNames);
      // console.log('settings:', settings);
      // console.log('templates:', templates);

      thisApp.initCart();
      thisApp.initData();
    },
  };

  app.init();
}
