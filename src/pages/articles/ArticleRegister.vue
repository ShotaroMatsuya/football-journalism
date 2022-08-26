<template>
  <section>
    <base-card>
      <h2>Register Your Article now !</h2>
      <article-form
        :user-id="id"
        :username="username"
        :account-name="accountName"
        @save-data="saveData"
      ></article-form>
    </base-card>
  </section>
</template>

<script>
import ArticleForm from '../../components/articles/ArticleForm.vue';
export default {
  props: ['id'],
  components: {
    ArticleForm,
  },
  data() {
    return {
      selectedJournalist: null,
    };
  },
  computed: {
    username() {
      return this.selectedJournalist.username;
    },
    accountName() {
      return this.selectedJournalist.accountName;
    },
  },
  created() {
    this.selectedJournalist = this.$store.getters[
      'journalists/journalists'
    ].find((journalist) => journalist.id === this.id);
  },
  methods: {
    saveData(data) {
      this.$store.dispatch('articles/postArticle', data);
      this.$router.replace('/');
    },
  },
};
</script>
