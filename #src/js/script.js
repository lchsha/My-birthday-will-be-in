'use strict';
// Переменные Select
let selectDays = document.querySelector('.select_days');
let selectMonths = document.querySelector('.select_months');
let selects = document.querySelectorAll('.select');
let dropdowns = document.querySelectorAll('.select__dropdown');
let labelDays = document.getElementById('label-days');
let labelMonths = document.getElementById('label-months');
let arrMonths = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];

// Переменные Countdown
let btn = document.querySelector('[data-btn]');
let intervalId;

init();

document.addEventListener('click', openSelect);
document.addEventListener('keydown', closeSelects);
btn.addEventListener('click', updateCountdown);

// Открыть селект
function openSelect({ target }) {
	if (target.closest('.select')) {
		let select = target.closest('.select');
		let dropdown = select.querySelector('.select__dropdown');
		if (!select.classList.contains('active')) {
			selects.forEach(select => select.classList.remove('active'));
			select.classList.add('active');
			let height = parseInt(window.getComputedStyle(dropdown).maxHeight);
			dropdowns.forEach(elem => elem.style.height = '0px');
			dropdown.style.height = height + 'px';
		} else {
			if (target.closest('li')) {
				chooseItem(target);
			}
			select.classList.remove('active');
			dropdown.style.height = 0 + 'px';
		}
	} else {
		selects.forEach(select => select.classList.remove('active'));
		dropdowns.forEach(elem => elem.style.height = '0px');
	}
}
// Закрыть все селекты нажатием клавишы Escape
function closeSelects(e) {
	if (e.key === 'Escape') {
		selects.forEach(select => select.classList.remove('active'));
		dropdowns.forEach(elem => elem.style.height = '0px');
	}
}
// Заполнить селекты по умолчанию 
function init() {
	let days = getArrDays(0);
	selects.forEach(select => {
		if (select.closest('.select_days')) {
			fillSelects(days, select);
			labelDays.innerHTML = days[0];
		} else if (select.closest('.select_months')) {
			fillSelects(arrMonths, select);
			labelMonths.innerHTML = arrMonths[0];
		}
	});
}
// Выбрать элемента селекта
function chooseItem(item) {
	if (isNaN(+item.innerHTML)) {
		let indexMonth = arrMonths.indexOf(item.innerHTML);
		updateQuantityDays(indexMonth);
		labelMonths.innerHTML = item.innerHTML;
	} else {
		labelDays.innerHTML = item.innerHTML;
	}
}
// Обновить количество дней, в зависимости от месяца
function updateQuantityDays(monthId) {
	let items = selectDays.querySelector('.select__items');
	let days = getArrDays(monthId);
	createOptions(days, items);
	let numLabel = labelDays.innerHTML;
	if (+numLabel > days.length) {
		labelDays.innerHTML = 1;
	}
}
// Заполнить селект элементами
function fillSelects(arr, selectEl) {
	if (!selectEl) return;
	let items = selectEl.querySelector('.select__items');
	createOptions(arr, items);
}
// Получить массив дней
function getArrDays(month) {
	let date = new Date();
	let now = new Date(date.getFullYear(), month + 1, 0);
	let arr = [];
	for (let i = 1; i <= now.getDate(); i++) {
		arr.push(i);
	}
	return arr;
}
// Создать элементы кастомного селекта
function createOptions(arr, list) {
	list.innerHTML = '';
	for (let i = 0; i < arr.length; i++) {
		let li = document.createElement('li');
		li.append(arr[i]);
		list.append(li);
	}
}
// Обновить обратный отсчет 
function updateCountdown() {
	let daysEl = document.getElementById('days');
	let hoursEl = document.getElementById('hours');
	let minutesEl = document.getElementById('minutes');
	let secondsEl = document.getElementById('seconds');
	let timerCongrat = document.getElementById('timer-congrat');
	let timerBody = document.getElementById('timer-body');
	let date = new Date();
	let month = arrMonths.indexOf(labelMonths.innerHTML);
	let day = +labelDays.innerHTML;
	let deadline = new Date(date.getFullYear(), month, day);
	let diff = Math.ceil((deadline.getTime() - Date.now()) / 1000 / 60 / 60 / 24);
	if (diff < 0) {
		deadline = new Date((date.getFullYear() + 1), month, day);
	}

	if (timerCongrat.classList.contains('show') && timerBody.classList.contains('hide')) {
		timerCongrat.classList.remove('show');
		timerBody.classList.remove('hide');
	}

	if (diff === 0) {
		timerCongrat.classList.add('show');
		timerBody.classList.add('hide');
	} else {
		clearInterval(intervalId);
		getCountdownNums(deadline, daysEl, hoursEl, minutesEl, secondsEl);
		intervalId = setInterval(() => {
			getCountdownNums(deadline, daysEl, hoursEl, minutesEl, secondsEl);
		}, 1000);

	}
}
// Получить единицы и количество(дни, часы, минуты, секунды)
function getCountdownNums(deadline, daysEl, hoursEl, minutesEl, secondsEl) {
	let measureDays = daysEl.nextElementSibling;
	let measureHours = hoursEl.nextElementSibling;
	let measureMinutes = minutesEl.nextElementSibling;
	let measureSeconds = secondsEl.nextElementSibling;

	let res = deadline.getTime() - Date.now();
	let days = Math.floor(res / 1000 / 60 / 60 / 24);
	let hours = Math.floor(res / 1000 / 60 / 60 % 24);
	let minutes = Math.floor(res / 1000 / 60 % 60);
	let seconds = Math.floor(res / 1000 % 60);


	daysEl.innerHTML = addZero(days);
	hoursEl.innerHTML = addZero(hours);
	minutesEl.innerHTML = addZero(minutes);
	secondsEl.innerHTML = addZero(seconds);

	measureDays.innerHTML = getRightNameDate(days, ['день', 'дня', 'дней']);
	measureHours.innerHTML = getRightNameDate(hours, ['час', 'часа', 'часов']);
	measureMinutes.innerHTML = getRightNameDate(minutes, ['минута', 'минуты', 'минут']);
	measureSeconds.innerHTML = getRightNameDate(seconds, ['секунда', 'секунды', 'секунд']);
}
// Добавить ноль, если число меньше 10
function addZero(num) {
	if (num < 10) {
		return '0' + num;
	} else {
		return num;
	}
}
// Получить правильное склонение единиц
function getRightNameDate(num, arr) {
	let remHundred = num % 100;
	let remTen = num % 10;
	return arr[remHundred > 4 && remHundred < 20 ? 2 : remTen > 1 && remTen < 5 ? 1 : remTen === 1 ? 0 : 2];
}



