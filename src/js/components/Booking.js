import {select, templates } from './settings.js';

export class Booking {
  constructor() {
    const thisBooking = this;

    thisBooking.render(conteinerWidget);
    thisBooking.initWidgets();
  }

  render() {
    const thisBooking = this;

    thisBooking.dom = {};

    thisBooking.dom = thisBooking.dom.element.querySelector(templates.bookingWidget);

    thisBooking.dom.wrapper = conteinerWidget;
  }
}