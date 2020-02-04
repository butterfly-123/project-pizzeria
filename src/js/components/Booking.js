import {templates, select, settings} from './../settings.js';
import {utils} from './../utils.js';
import {AmountWidget} from './AmountWidget.js';
import {DatePicker} from './DatePicker.js';
import {HourPicker} from './HourPicker.js';

export class Booking{
  
  // Z kad jest wzięty ten argument w constructor i co on ma za zadanie?
  constructor(reservWidgetContainer){
    const thisBooking = this;
 
    thisBooking.render(reservWidgetContainer);
    thisBooking.initWidgets();
    thisBooking.getData();
  }

  getData(){
    const thisBooking = this;
 
    // Rozumiem, ze ta zmienna przypisuje z utils poczatkową i koncowa date?
    const startDateParam = settings.db.dateStartParamKey + '=' + utils.dateToStr(thisBooking.datePicker.minDate);
    const endDateParam = settings.db.dateEndParamKey + '=' + utils.dateToStr(thisBooking.datePicker.maxDate);
 
    // Ta zmienna ma przypisane daty rezerwacji tak? I jak je sie przypisało? Skoro w settings nie ma np. endDateParam? 
    const params = {
      booking: [
        startDateParam,      
        endDateParam,      
      ],
      eventCurrent:[
        settings.db.notRepeatParam,
        startDateParam,  
        endDateParam,
      ],
      eventsRepeat:[
        settings.db.repeatParam,
        endDateParam,
      ],
    };
 
    console.log('getData params', params);
 
    // To są adresy filtrujące dane, tak? Co to oznacza?
    const urls = {
      booking:      settings.db.url + '/' + settings.db.booking + '?' + params.booking.join('&'),
      eventCurrent: settings.db.url + '/' + settings.db.event + '?' + params.eventCurrent.join('&'),
      eventsRepeat: settings.db.url + '/' + settings.db.event + '?' + params.eventsRepeat.join('&'),
    };

    console.log('urls: ', urls);
 
    // Promise - wysyła 3 prozby o rezerwacje
    Promise.all([
      fetch(urls.booking),
      fetch(urls.eventCurrent),
      fetch(urls.eventsRepeat),
    ])
      // Tu niewiem co sie dzieje
      .then(function(allResponses){
        const bookingResponse = allResponses[0];
        const eventCurrentResponse = allResponses[1];
        const eventsRepeatResponse = allResponses[2];
        return Promise.all([
          bookingResponse.json(),
          eventCurrentResponse.json(),
          eventsRepeatResponse.json(),
        ]);
      })
      // A tutaj jest odpowiedz na prozbe, tak? 
      .then(function([booking, eventCurrent, eventsRepeat]){
        console.log(booking);
        console.log(eventCurrent);
        console.log(eventsRepeat);
        thisBooking.parseData(booking, eventCurrent, eventsRepeat);
      });
  }

  parseData(booking, eventCurrent, eventsRepeat){
    const thisBooking = this;
 
    thisBooking.booked = {};

    // Pozycja rezerwacji (data, godzina, czas trwania, stolik)
    for(let item of booking){
      thisBooking.makeBooked(item.data, item.hour, item.duration, item.table);
    }
 
    // Sprawdzenie pozycji rezerwacji, czy jest mozliwa?
    for(let item of eventCurrent){
      thisBooking.makeBooked(item.data, item.hour, item.duration, item.table);
    }
 
    // Dlaczego te mienne sa tutaj uzyte?
    const minDate = thisBooking.datePicker.minDate;
    const maxDate = thisBooking.datePicker.maxDate;
 
    // Tu nie wiem... Jesli jest codziennie to..
    for(let item of eventsRepeat){
      if(item.repeat == 'daily'){
        for(let loopDate = minDate; loopDate <= maxDate; loopDate = utils.addDays(loopDate, 1)){
          thisBooking.makeBooked(utils.dateToStr(loopDate), item.hour, item.duration, item.table);
        }
      }    
    }
    thisBooking.updateDOM();
    console.log(thisBooking.booked);
  }

  makeBooked(data, hour, duration, table) {
    
  }
 
  // Tu tez fajnie by bylo od pocztku o co chodzi :)
  render(bookingContainer){
    const thisBooking = this;
 
    const generatedHTML = templates.bookingWidget();
 
    thisBooking.dom = {};
 
    thisBooking.dom.wrapper = bookingContainer;
 
    thisBooking.dom.wrapper = utils.createDOMFromHTML(generatedHTML);
 
    bookingContainer.appendChild(thisBooking.dom.wrapper);
 
    thisBooking.dom.peopleAmount = thisBooking.dom.wrapper.querySelector(select.booking.peopleAmount);
    console.log(thisBooking.dom.peopleAmount);

    thisBooking.dom.hoursAmount = thisBooking.dom.wrapper.querySelector(select.booking.hoursAmount);
    console.log(thisBooking.dom.hoursAmount);

    thisBooking.dom.datePicker = thisBooking.dom.wrapper.querySelector(select.widgets.datePicker.wrapper);
    console.log(thisBooking.dom.datePicker);

    thisBooking.dom.hourPicker = thisBooking.dom.wrapper.querySelector(select.widgets.hourPicker.wrapper);
    console.log(thisBooking.dom.hourPicker);
  }
 
  initWidgets(){
    const thisBooking = this;
 
    thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
    thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);
    thisBooking.datePicker = new DatePicker(thisBooking.dom.datePicker);
    thisBooking.hourPicker = new HourPicker(thisBooking.dom.hourPicker);
  }
 
}


 
