<template>
  <form @submit.prevent="submitForm">
    <div>
      <label for="username">ハンドルネーム</label>
      <input type="text" id="username" v-model.trim="username" />
    </div>
    <div>
      <label for="message">リクエストメッセージ</label>
      <textarea id="message" rows="5" v-model.trim="message"></textarea>
    </div>
    <p class="errors" v-if="!formIsValid">
      Please enter a valid name and non-empty message.
    </p>
    <div class="actions">
      <base-button>Send Message</base-button>
    </div>
  </form>
</template>

<script>
export default {
  data() {
    return {
      username: '',
      message: '',
      formIsValid: true,
    };
  },
  methods: {
    submitForm() {
      this.formIsValid = true;
      if (this.username === '' || this.message === '') {
        this.formIsValid = false;
        return;
      }
      this.$store.dispatch('requests/contactJournalist', {
        username: this.username,
        message: this.message,
        journalistId: this.$route.params.id,
      });
      this.$router.replace('/journalists');
    },
  },
};
</script>

<style scoped>
form {
  margin: 1rem;
  border: 1px solid #ccc;
  border-radius: 12px;
  padding: 1rem;
}

.form-control {
  margin: 0.5rem 0;
}

label {
  font-weight: bold;
  margin-bottom: 0.5rem;
  display: block;
}

input,
textarea {
  display: block;
  width: 100%;
  font: inherit;
  border: 1px solid #ccc;
  padding: 0.15rem;
}

input:focus,
textarea:focus {
  border-color: #008d50;
  background-color: #faf6ff;
  outline: none;
}

.errors {
  font-weight: bold;
  color: red;
}

.actions {
  text-align: center;
}
</style>
