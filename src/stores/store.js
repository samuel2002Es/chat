import { defineStore } from "pinia";

export const useStore = defineStore("counter", {
  state: () => ({
    counter: 0,
    uidSeleccionado: "samuel",
  }),

  getters: {
    doubleCount(state) {
      return state.counter * 2;
    },
  },

  actions: {
    increment() {
      this.counter++;
    },
    uidActual(param) {
      this.uidSeleccionado = param;
    },
  },
});
