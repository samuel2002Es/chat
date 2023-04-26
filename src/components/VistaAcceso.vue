<template>
  <div class="row justify-center items-center" style="height: 80vh">
    <div class="q-pa-md" style="width: 500px">
      <q-card>
        <q-form
          @submit="onSubmit"
          @reset="onReset"
          class="q-gutter-md q-pa-xl text-center"
        >
          <div class="text-h4 q-mb-lg">
            {{ acceder ? "Login" : "Registro" }}
          </div>
          <q-input
            filled
            v-model="email"
            label="Email"
            hint="email"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || 'Please type something',
            ]"
          />
          <q-input
            filled
            type:password
            v-model="password"
            label="Password"
            hint="password"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || 'Please type something',
            ]"
          />

          <div>
            <q-btn label="Submit" type="submit" color="primary" />
            <q-btn
              label="Reset"
              type="reset"
              color="primary"
              flat
              class="q-ml-sm"
            />
            <q-btn
              label="No tienes cuenta?"
              @click="acceder = false"
              color="negative"
              flat
              class="q-ml-sm"
              v-if="acceder"
            />
            <q-btn
              label="Ya tienes cuenta?"
              @click="acceder = true"
              color="positive"
              flat
              class="q-ml-sm"
              v-if="!acceder"
            />
          </div>
        </q-form>
      </q-card>
    </div>
  </div>
</template>
<script>
import useQuasar from "quasar/src/composables/use-quasar.js";
import { ref } from "vue";

//acceso y registro desde correo y contraseña
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { signInWithEmailAndPassword } from "firebase/auth";

//base de datos
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../boot/firebase";
export default {
  setup() {
    const $q = useQuasar();
    const password = ref("");
    const email = ref("");
    const acceder = ref(true);
    return {
      password,
      email,
      acceder,
      onReset() {
        password.value = null;
        email.value = null;
      },
      async onSubmit() {
        try {
          if (acceder.value) {
            //login
            const auth = getAuth();
            signInWithEmailAndPassword(auth, email.value, password.value)
              .then(async (userCredential) => {
                // Signed in
                const user = userCredential.user;
                const update = doc(db, "usuarios", user.uid);
                await updateDoc(update, {
                  estado: true,
                });
                // ...
              })
              .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
              });
          } else {
            //registro
            const auth = getAuth();
            createUserWithEmailAndPassword(auth, email.value, password.value)
              .then(async (userCredential) => {
                const user = userCredential.user;
                console.log(user);

                //bd
                // Add a new document in collection "cities"
                await setDoc(doc(db, "usuarios", user.uid), {
                  email: email.value,
                  estado: true,
                  uid: user.uid,
                });
                // ...
                this.onReset();
              })
              .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                // ..
              });
            console.log("registrando");
          }
        } catch (error) {
          console.log(error);
        }
      },
    };
  },
};
</script>
