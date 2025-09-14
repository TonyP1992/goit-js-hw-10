import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css'; // база
// (по желанию тема)
// import "flatpickr/dist/themes/material_blue.css";

// Описаний у документації
import iziToast from 'izitoast';
// Додатковий імпорт стилів
import 'izitoast/dist/css/iziToast.min.css';

// ошибка
iziToast.error({
  title: 'Error',
  message: 'Please choose a date in the future',
  position: 'topRight',
});

// успех
iziToast.success({
  title: 'OK',
  message: 'Timer started!',
  position: 'topRight',
});

flatpickr('#datetime-picker', {
  enableTime: true,
  dateFormat: 'Y-m-d H:i',
});

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    console.log(selectedDates[0]);
  },
};

const refs = {
  input: document.querySelector('#datetime-picker'),
  start: document.querySelector('[data-start]'),
  days: document.querySelector('[data-days]'),
  hours: document.querySelector('[data-hours]'),
  minutes: document.querySelector('[data-minutes]'),
  seconds: document.querySelector('[data-seconds]'),
};

refs.start.disabled = true;

// --------- state
let userSelectedDate = null;
let timerId = null;

// --------- flatpickr init
flatpickr(refs.input, {
  enableTime: true,
  time_24hr: true,
  dateFormat: 'Y-m-d H:i',
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const picked = selectedDates[0];
    if (!picked || picked <= new Date()) {
      iziToast.error();
    }
    userSelectedDate = picked;
    refs.start.disabled = false;
  },
});

// --------- handlers
refs.start.addEventListener('click', () => {
  if (!userSelectedDate || timerId) return;

  refs.start.disabled = true;
  refs.input.disabled = true;

  tick();
  timerId = setInterval(tick, 1000);
});

// --------- timer logic
function tick() {
  const ms = userSelectedDate - new Date();

  if (ms <= 0) {
    clearInterval(timerId);
    timerId = null;
    updateTimer({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    refs.input.disabled = false;
    refs.start.disabled = true;
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

// --------- helpers
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
