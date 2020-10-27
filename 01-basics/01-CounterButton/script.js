import Vue from './vue.esm.browser.js';

const app = new Vue({
  el: '#app',

  data() {
    return {
      count: 0,
    };
  },

  methods: {
    handleCountClick() {
      this.count += 1;
    },
  },
});

window.app = app; // на сколько я понял - это нужно исключительно для отладки?
