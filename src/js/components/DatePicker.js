import {select, settings} from './settings.js';
import {BaseWidget} from './BaseWidget.js';
import {utils} from '../utils.js';

export class DatePicker extends BaseWidget {
  constructor(wrapper) {
    super(wrapper, utils.dateToStr(new Date()));

    const thisWidget = this;

    thisWidget.dom.input = thisWidget.dom.wrapper(select.widgets.datePicker.input);

    thisWidget.initPlugin();
  }

  initPlugin() {
    thisWidget.minDate = new Date(thisWidget.value);
    thisWidget.maxDate = settings.datePicker.maxDaysInFuture;
  }
}