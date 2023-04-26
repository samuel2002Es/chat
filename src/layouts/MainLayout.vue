<template>
  <q-layout view="lHh Lpr lFf">
    <q-header bordered>
      <q-toolbar>
        <q-btn flat round dense icon="favorite" class="q-mr-sm" />

        <q-toolbar-title>{{ user ? email : "Chat" }}</q-toolbar-title>

        <q-btn flat round dense icon="logout" @click="salir" v-if="user" />
      </q-toolbar>
    </q-header>
    <vista-acceso-vue v-if="!user"></vista-acceso-vue>
    <div v-else>
      <vista-usuarios-activos></vista-usuarios-activos>
      <vista-chat-vue></vista-chat-vue>
    </div>
  </q-layout>
</template>
<script>
import VistaAccesoVue from "src/components/VistaAcceso.vue";
import VistaUsuariosActivos from "src/components/VistaUsuariosActivos.vue";
import VistaChatVue from "src/components/VistaChat.vue";

import { getAuth, signOut } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";

//base de datos salir
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../boot/firebase";

export default {
  name: "MainLayout",
  data() {
    return {
      user: false,
      email: "",
      uid: "",
    };
  },
  components: {
    VistaAccesoVue,
    VistaUsuariosActivos,
    VistaChatVue,
  },
  created() {
    this.isAutenticated();
  },
  methods: {
    async salir() {
      const auth = getAuth();
      const update = doc(db, "usuarios", this.uid);
      await updateDoc(update, {
        estado: false,
      });
      signOut(auth)
        .then(() => {
          // Sign-out successful.
          this.user = false;
        })
        .catch((error) => {
          // An error happened.
          console.log(error);
        });
    },
    isAutenticated() {
      const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        if (user) {
          // User is signed in, see docs for a list of available properties
          // https://firebase.google.com/docs/reference/js/firebase.User
          this.uid = user.uid;
          this.email = user.email;
          this.user = true;
          console.log("logeado");
          // ...
        } else {
          // User is signed out
          // ...
          console.log("sin logear");
        }
      });
    },
  },
};
</script>
<style scoped></style>
