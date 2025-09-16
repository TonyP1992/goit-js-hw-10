


import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const refs = {
  input: document.querySelector('#datetime-picker'),
  start: document.querySelector('[data-start]'),
  days: document.querySelector('[data-days]'),
  hours: document.querySelector('[data-hours]'),
  minutes: document.querySelector('[data-minutes]'),
  seconds: document.querySelector('[data-seconds]'),
};

refs.start.disabled = true;


let userSelectedDate = null;
let timerId = null;


flatpickr(refs.input, {
  enableTime: true,
  time_24hr: true,
  dateFormat: 'Y-m-d H:i',
  defaultDate: new Date(),
  minuteIncrement: 1,
  
  minDate: new Date(),
  onClose([picked]) {
    validatePickedDate(picked);
  },
  onChange([picked]) {
    
    validatePickedDate(picked, { silent: true });
  },
});

function validatePickedDate(picked, { silent = false } = {}) {
  const now = Date.now();
  if (!picked || picked.getTime() <= now) {
    userSelectedDate = null;
    refs.start.disabled = true;
    if (!silent) {
      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
        position: 'topRight',
      });
    }
    return false;
  }
  userSelectedDate = picked;
  refs.start.disabled = false;
  return true;
}


refs.start.addEventListener('click', () => {

  if (!userSelectedDate || userSelectedDate.getTime() <= Date.now()) {
    iziToast.error({
      title: 'Error',
      message: 'Please choose a valid future date',
      position: 'topRight',
    });
    return;
  }

  
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  }

  refs.start.disabled = true;
  refs.input.disabled = true;

  iziToast.success({
    title: 'OK',
    message: 'Timer started!',
    position: 'topRight',
  });

  tick();
  timerId = setInterval(tick, 1000);
});


function tick() {
  const ms = userSelectedDate.getTime() - Date.now();

  if (ms <= 0) {
    clearInterval(timerId);
    timerId = null;
    updateTimer({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    refs.input.disabled = false;
    refs.start.disabled = true;

    iziToast.success({
      title: 'Done',
      message: 'Time is up!',
      position: 'topRight',
    });
    return;
  }

  updateTimer(convertMs(ms));
}

function updateTimer({ days, hours, minutes, seconds }) {
  refs.days.textContent = String(days).padStart(2, '0');
  refs.hours.textContent = addLeadingZero(hours);
  refs.minutes.textContent = addLeadingZero(minutes);
  refs.seconds.textContent = addLeadingZero(seconds);
}


function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}