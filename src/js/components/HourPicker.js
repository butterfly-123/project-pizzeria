import {BaseWidget} from './BaseWidget.js';
import {settings} from '../settings.js';
import {utils} from '../utils.js';

export class HourPicker extends BaseWidget {
  constructor(wrapper) {
    super(wrapper, settings.hours.open);

    const thisWidget = this;

    thisWidget.dom.input = thisWidget.input;
    thisWidget.dom.output = thisWidget.output;

    thisWidget.parseValue();
    thisWidget.isValid();
    thisWidget.renderValue();
    thisWidget.initPlugin();

    thisWidget.dom.value = thisWidget.value;

  }

  parseValue() {
    const numberToHour = utils.numberToHour(settings.hours.open);
    return numberToHour;
  }

  isValid() {
    return true;
  }

  renderValue() {
    thisWidget.dom.output = thisWidget.dom.input;

    thisWidget.dom.input.addEventListener('imput', thisWidget.value);
  }

  initPlugin() {

  }
  
}