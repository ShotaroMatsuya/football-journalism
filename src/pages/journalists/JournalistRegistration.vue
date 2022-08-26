<template>
  <section>
    <base-card>
      <h2>Register as a Journalist now !</h2>
      <journalist-form @save-data="saveData"></journalist-form>
    </base-card>
  </section>
</template>

<script>
import JournalistForm from '../../components/journalists/JournalistForm.vue';
export default {
  components: {
    JournalistForm,
  },
  methods: {
    saveData(data) {
      this.$store.dispatch('journalists/registerJournalist', data);
      this.$router.replace('/journalists');
    },
  },
};
</script>
