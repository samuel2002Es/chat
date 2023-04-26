<template>
  <q-page-sticky position="top" expand class="tabs-zindex">
    <q-tabs
      v-model="vari"
      inline-label
      outside-arrows
      mobile-arrows
      class="bg-primary text-white shadow-2 full-width"
    >
      <q-tab
        v-for="user of arraySinUser()"
        :key="user.uid"
        :name="user.uid"
        icon="account_circle"
        :label="user.email"
        :class="user.estado ? 'text-white' : 'text-grey'"
      />
    </q-tabs>
  </q-page-sticky>
  <!-- <q-btn @click="obtenerDatos">obtener</q-btn> -->
</template>

<script>
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "src/boot/firebase";
import { onAuthStateChanged, getAuth } from "firebase/auth";

import { mapState, mapActions } from "pinia";
import { useStore } from "../stores/store";
export default {
  data() {
    return {
      users: [],
      vari: "",
      uid: null,
    };
  },
  computed: {
    ...mapState(useStore, ["uidSeleccionado"]),
  },
  watch: {
    // whenever question changes, this function will run
    vari: function () {
      this.uidActual(this.vari);
    },
  },
  mounted() {
    this.obtenerDatos();
  },
  methods: {
    ...mapActions(useStore, ["uidActual"]),
    async obtenerDatos() {
      const q = query(collection(db, "usuarios"));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            /* console.log("usuario nuevo ", change.doc.data()); */
            this.users = [...this.users, change.doc.data()];
            //filtrando para que al final aparezcan los usuarios no logueados
            this.users = this.users.sort((a, b) => b.estado - a.estado);
          }
          if (change.type === "modified") {
            /* console.log("modified user ", change.doc.data()); */
            this.users = this.users.map((user) =>
              user.uid === change.doc.data().uid
                ? { ...user, estado: change.doc.data().estado }
                : user
            );
            this.users = this.users.sort((a, b) => b.estado - a.estado);
          }
          if (change.type === "removed") {
            console.log("Removed user: ", change.doc.data());
          }
        });
      });
    },
    arraySinUser() {
      const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        if (user) {
          // User is signed in, see docs for a list of available properties
          // https://firebase.google.com/docs/reference/js/firebase.User
          this.uid = user.uid;
          // ...
        } else {
          // User is signed out
          // ...
        }
      });
      return this.users.filter((item) => item.uid != this.uid);
    },
  },
};
</script>

<style scoped>
.tabs-zindex {
  z-index: 2000;
}
</style>
