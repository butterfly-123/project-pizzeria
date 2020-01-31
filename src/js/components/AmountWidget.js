import {settings, select} from '../settings.js';
import {BaseWidget} from './BaseWidget.js';

export class AmountWidget extends BaseWidget {
  constructor(wrapper) {
    super(wrapper, settings.amountWidget.defaultValue);

    const thisWidget = this;

    thisWidget.getElements(element);
    thisWidget.initActions();

    // console.log('amountWidget: ', thisWidget);
    // console.log('constructor argument: ', element);
  }

  getElements() {
    const thisWidget = this;
  
    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.amount.input);
    thisWidget.dom.linkDecrease = thisWidget.dom.wrapper.querySelector(select.widgets.amount.linkDecrease);
    thisWidget.ldom.inkIncrease = thisWidget.dom.wrapper.querySelector(select.widgets.amount.linkIncrease);
  }

  setValue(value) {
    const thisWidget = this;

    const newValue = parseInt(value);
    // console.log('newValue: ', newValue);

    /* TODO: Add validation */

    if (newValue != thisWidget.correctValue && thisWidget.isValid(newValue)) {
      thisWidget.correctValue = newValue;
      thisWidget.announce();
    } 

    thisWidget.input.value = thisWidget.value;
  }

  initActions() {
    const thisWidget = this;

    thisWidget.dom.input.addEventListener('change', function() {
      thisWidget.value = thisWidget.dom.input.value;
    });

    thisWidget.linkDecrease.addEventListener('click', function() {
      thisWidget.value = thisWidget.dom.input.value--;
    });

    thisWidget.linkIncrease.addEventListener('click', function() {
      thisWidget.value = thisWidget.dom.input.value++;
    });
  }
}
