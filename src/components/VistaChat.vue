<template>
  <q-layout>
    <div class="q-pa-md row justify-center">
      <div style="width: 100%; max-width: 600px">
        <q-chat-message name="me" :text="['hey, how are you?']" sent />
        <q-chat-message name="Jane" :text="['doing fine, how r you?']" />
      </div>
    </div>
    <q-footer>
      <q-form @submit.prevent="enviarMensaje">
        <q-toolbar class="bg-grey-3 text-black row">
          <q-btn round flat icon="insert_emoticon" class="q-mr-sm" />
          <q-input
            rounded
            outlined
            dense
            class="WAL__field col-grow q-mr-sm"
            bg-color="white"
            v-model="message"
            placeholder="Type a message"
          />
          <q-btn round flat icon="send" type="submit" />
        </q-toolbar>
      </q-form>
    </q-footer>
    {{ message }}
  </q-layout>
</template>

<script>
import { mapState } from "pinia";
import { useStore } from "../stores/store";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { marcaTiempo } from "src/boot/firebase";
import { db } from "src/boot/firebase";
import { collection, doc, setDoc, addDoc } from "firebase/firestore";
export default {
  data() {
    return {
      message: "",
      userActive: null,
    };
  },
  computed: {
    ...mapState(useStore, ["uidSeleccionado"]),
  },
  created() {
    this.obtenerUsuarioActivo();
  },
  methods: {
    obtenerUsuarioActivo() {
      const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        if (user) {
          this.userActive = user;
          console.log(this.userActive.email);
        } else {
          console.log("hay un error en el usuario");
        }
      });
    },
    async enviarMensaje() {
      try {
        /* const objetoMensaje = {
          user: this.userActive.email,
          texto: this.message,
          fecha: marcaTiempo(),
          uid: this.userActive.uid,
        }; */
        const chatRef = collection(db, "chat");
        await addDoc(
          collection(chatRef, this.userActive.uid, this.uidSeleccionado),
          {
            seleccionado: this.uidSeleccionado,
            user: this.userActive.email,
            texto: this.message,
            uid: this.userActive.uid,
          }
        );
        /* await addDoc(
          collection(db, "chat", this.uidSeleccionado, this.userActive.uid),
          objetoMensaje
        ); */
        this.message = "";
      } catch (error) {
        console.log("no funciona");
        console.log(error);
      }
    },
  },
};
</script>

<style></style>
