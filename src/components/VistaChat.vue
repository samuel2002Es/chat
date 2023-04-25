<template>
  <!-- para que haga escroll automatico -->
  <div v-if="uidSeleccionado != ''" ref="RefChat">
    <q-layout>
      <div class="q-pa-md row justify-center">
        <div style="width: 100%; max-width: 600px">
          <q-chat-message
            v-for="chat in chats"
            :key="chat.id"
            :name="chat.user"
            :text="[chat.texto]"
            :sent="chat.uid == userActive.uid"
          />
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
    </q-layout>
    <q-btn @click="obtenerData()">obtener</q-btn>
  </div>
  <div v-else>
    <h5>Selecciona un usuario para escribirle un mensaje</h5>
  </div>
</template>

<script>
import { mapState } from "pinia";
import { useStore } from "../stores/store";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { marcaTiempo } from "src/boot/firebase";
import { db } from "src/boot/firebase";
import {
  collection,
  doc,
  setDoc,
  addDoc,
  Timestamp,
  getDocs,
  query,
} from "firebase/firestore";
import { onSnapshot, orderBy } from "firebase/firestore";
export default {
  data() {
    return {
      message: "",
      userActive: "",
      chats: [],
      unsuscribe: null,
      RefChat: null,
    };
  },
  watch: {
    // whenever question changes, this function will run
    uidSeleccionado(newUid) {
      this.obtenerData();
      if (this.unsuscribe) {
        this.unsuscribe();
        if (newUid) {
          this.obtenerData();
        }
      } else {
        this.obtenerData();
      }
    },
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
    async obtenerData() {
      const q = query(
        collection(db, "chat", this.userActive.uid, this.uidSeleccionado),
        orderBy("fecha")
      );
      const querySnapshot = await getDocs(q);
      this.chats = [];
      try {
        unsuscribe = querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          console.log(doc.id, " => ", doc.data());
          this.chats.push({ ...doc.data(), id: doc.id });
          window.scrollTo(0, this.RefChat.scrollHeight);
        });
      } catch (error) {
        console.log(error);
      }
    },
    async enviarMensaje() {
      if (!this.message.trim()) {
        return;
      }
      try {
        const objetoMensaje = {
          user: this.userActive.email,
          fecha: Timestamp.fromDate(new Date()),
          texto: this.message,
          uid: this.userActive.uid,
        };
        const chatRef = collection(db, "chat");
        const docRef = await addDoc(
          collection(chatRef, this.userActive.uid, this.uidSeleccionado),
          objetoMensaje
        );
        await addDoc(
          collection(chatRef, this.uidSeleccionado, this.userActive.uid),
          objetoMensaje
        );

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
