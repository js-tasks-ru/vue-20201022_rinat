import Vue from './vue.esm.browser.js';

/** URL адрес API */
const API_URL = 'https://course-vue.javascript.ru/api';

/** ID митапа для примера; используйте его при получении митапа */
const MEETUP_ID = 6;

/**
 * Словарь заголовков по умолчанию для всех типов элементов программы
 */
const agendaItemTitles = {
  registration: 'Регистрация',
  opening: 'Открытие',
  break: 'Перерыв',
  coffee: 'Coffee Break',
  closing: 'Закрытие',
  afterparty: 'Afterparty',
  talk: 'Доклад',
  other: 'Другое',
};

/**
 * Словарь иконок для для всех типов элементов программы.
 * Соответствует имени иконок в директории /assets/icons
 */
const agendaItemIcons = {
  registration: 'key',
  opening: 'cal-sm',
  talk: 'tv',
  break: 'clock',
  coffee: 'coffee',
  closing: 'key',
  afterparty: 'cal-sm',
  other: 'cal-sm',
};

export const app = new Vue({
  el: '#app',

  data: {
    rawMeetup: null,
  },

  mounted() {
    this.getMeetup();
  },

  computed: {
    meetup() {
      const { rawMeetup } = this;

      if (!rawMeetup) {
        return { agenda: [] };
      }

      const date = new Date(rawMeetup.date);

      return {
        ...this.rawMeetup,
        cover: getMeetupCoverLink(rawMeetup),
        agenda: getNormalizedAgenda(rawMeetup),
        date: getFormattedDate(date),
        dateOnlyString: getDateOnlyString(date),
      };
    },
  },

  methods: {
    async getMeetup() {
      this.rawMeetup = await fetchMeetup('meetups', MEETUP_ID);
    },
  },
});

/**
 * Возвращает ссылку на изображение митапа для митапа
 * @param meetup - объект с описанием митапа (и параметром meetupId)
 * @return {string} - ссылка на изображение митапа
 */
function getMeetupCoverLink(meetup) {
  return `${API_URL}/images/${meetup.imageId}`;
}

/**
 * Компоновщик AJAX запросов
 *
 * @param {string} path
 * @param {Number} params
 * @returns {Promise<any>}
 */
async function fetchApiRequest(path, params) {
  const fetchResult = await fetch(`${API_URL}/${path}/${params}`, {
    method: 'GET',
    credentials: 'same-origin',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  if (!fetchResult.ok) {
    throw new Error(fetchResult.statusText);
  }

  const response = await fetchResult.json();

  if (response.error) {
    throw response.error;
  }

  return response;
}

/**
 * Получить данные митапа по API
 *
 * @param {string} path
 * @param {Number} params
 * @returns {Promise<any>}
 */
function fetchMeetup(path, params) {
  return fetchApiRequest(path, params);
}

/**
 * Нормализует данные программы
 *
 * @param {Object} rawMeetup
 * @param {Array} [rawMeetup.agenda = []]
 * @returns {Object}
 */
function getNormalizedAgenda({ agenda = [] }) {
  return agenda.map((item) => {
    return {
      ...item,
      icon: agendaItemIcons[item.type] || '',
      title: item.title || agendaItemTitles[item.type] || '',
      isSpeakerShown: item.type === 'talk',
    };
  });
}

/**
 * Форматирует время к строке
 *
 * @param {Object} date
 * @returns {string}
 */
function getDateOnlyString(date) {
  const YYYY = date.getFullYear();
  const MM = (date.getMonth() + 1).toString().padStart(2, '0');
  const DD = date.getDate().toString().padStart(2, '0');

  return `${YYYY}-${MM}-${DD}`;
}

/**
 * Форматирует время
 *
 * @param {Object} date
 * @returns {string}
 */
function getFormattedDate(date) {
  return date.toLocaleString(navigator.language, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

window.app = app;
