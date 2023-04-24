<template>
  <q-layout>
    <div class="q-pa-md row justify-center">
      <div style="width: 100%; max-width: 400px">
        <q-chat-message name="me" :text="['hey, how are you?']" sent />
        <q-chat-message name="Jane" :text="['doing fine, how r you?']" />
      </div>
      {{ uidSeleccionado }}
    </div>
    <q-footer>
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
    </q-footer>
  </q-layout>
</template>

<script>
export default {
  data() {
    return {
      uidSeleccionado: "",
    };
  },
  beforeMount() {
    this.$root.$on("uidSend", (data) => {
      this.uidSeleccionado = data;
    });
  },
};
</script>

<style></style>
