<template>
  <div>
    <base-dialog
      :show="!!error"
      title="An error occurred!"
      @close="handleError"
    >
      <p>{{ error }}</p>
    </base-dialog>
    <div v-if="isLoading" class="spinner">
      <base-spinner></base-spinner>
    </div>
    <div v-else>
      <section>
        <base-card>
          <h2>{{ username }}</h2>
          <h3>@{{ accountName }}</h3>
          <base-badge
            v-for="area in areas"
            :key="area"
            :type="area"
            :title="area"
          ></base-badge>
          <p>{{ description }}</p>
        </base-card>
      </section>
      <section v-if="!isRequestPage">
        <base-card>
          <ul v-if="hasArticles">
            <article-item
              v-for="art in articles"
              :key="art.articleId"
              :article="art"
            ></article-item>
          </ul>
          <h3 v-else>No Journalist found.</h3>
        </base-card>
      </section>
      <section v-else>
        <base-card>
          <header>
            <h2>気に入った記者に欲しい情報をリクエストしてみよう</h2>
            <base-button link :to="contactLink" @click="openForm"
              >Request!</base-button
            >
          </header>
        </base-card>
        <base-dialog :show="isOpen" title="リクエストを送る" @close="closeForm">
          <router-view></router-view>
        </base-dialog>
      </section>
    </div>
  </div>
</template>

<script>
import ArticleItem from '../../components/articles/ArticleItem.vue';

export default {
  components: {
    ArticleItem,
  },
  props: ['id'],
  data() {
    return {
      isLoading: false,
      error: null,
      selectedJournalist: null,
      isOpen: false,
      articles: [],
    };
  },
  computed: {
    username() {
      if (this.selectedJournalist !== null) {
        return this.selectedJournalist.username;
      } else {
        return '';
      }
    },
    accountName() {
      if (this.selectedJournalist !== null) {
        return this.selectedJournalist.accountName;
      } else {
        return '';
      }
    },
    areas() {
      if (this.selectedJournalist !== null) {
        return this.selectedJournalist.areas;
      } else {
        return [];
      }
    },
    description() {
      if (this.selectedJournalist !== null) {
        return this.selectedJournalist.description;
      } else {
        return '';
      }
    },
    contactLink() {
      return `/journalists/${this.id}/contact`;
    },
    hasArticles() {
      return this.$store.getters['articles/hasArticles'];
    },
    isRequestPage() {
      return this.$route.path.indexOf('contact') !== -1;
    },
  },
  async created() {
    await this.fetchJournalist();
    await this.loadArticles();
  },
  methods: {
    openForm() {
      this.isOpen = true;
    },
    closeForm() {
      this.isOpen = false;
    },
    async fetchJournalist() {
      try {
        await this.$store.dispatch('journalists/loadJournalists', {
          forceRefresh: false,
        });
        this.selectedJournalist = this.$store.getters[
          'journalists/journalists'
        ].find((journalist) => journalist.id === this.id);
      } catch (error) {
        this.error = error.message || 'Something went wrong!';
      }
    },
    async loadArticles(refresh = false) {
      this.isLoading = true;
      try {
        await this.$store.dispatch('articles/loadArticles', {
          forceRefresh: refresh,
          journalistId: this.id,
        });
        this.articles = this.$store.getters['articles/articles'];
      } catch (error) {
        this.error = error.message || 'Something went wrong!';
      }

      this.isLoading = false;
    },
    handleError() {
      this.error = null;
    },
  },
};
</script>

<style scoped>
.spinner {
  margin-top: 3.5rem;
}
ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.controls {
  display: flex;
  justify-content: space-between;
}
</style>
