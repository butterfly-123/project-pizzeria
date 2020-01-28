
export class Product {
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

    const event = new CustomEvent('add-to-cart', {
      bubbles: true,
      detail: {
        product: thisProduct,
      },
    });
    thisProduct.element.dispatchEvent(event);
  }
}