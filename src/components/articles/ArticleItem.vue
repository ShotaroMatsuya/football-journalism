<template>
  <li>
    <section>
      <span>{{ article.articleId }}</span>
      <div class="controls">
        <base-button mode="outline" @click="loadArticle(true)">
          <div v-if="!isLoading">Refresh</div>
          <div v-else class="spinner">
            <base-spinner2></base-spinner2>
          </div>
        </base-button>
      </div>
    </section>
    <p>{{ article.articleBody }}</p>

    <div class="actions">
      <base-button v-if="!isPrepared" @click="requestTranslation">
        自動翻訳する
      </base-button>
      <base-button v-else @click="requestTranslation"
        >翻訳された音声を取得</base-button
      >
    </div>
  </li>
</template>

<script>
export default {
  props: ['article'],
  data() {
    return {
      isLoading: false,
      error: null,
      selectedJournalist: null,
      isPrepared: false,
    };
  },
  computed: {
    journalistId() {
      return this.$route.params.id;
    },
  },
  created() {
    this.loadArticle();
  },
  methods: {
    async loadArticle(refresh = false) {
      this.isLoading = true;
      try {
        await this.$store.dispatch('articles/loadArticles', {
          forceRefresh: refresh,
          journalistId: this.journalistId,
        });
        this.selectedJournalist = this.$store.getters['articles/journalistId'];
      } catch (error) {
        this.error = error.message || 'Something went wrong!';
      }

      this.isLoading = false;
    },
    async requestTranslation() {
      this.isPrepared = !this.isPrepared;
    },
    handleError() {
      this.error = null;
    },
  },
};
</script>

<style scoped>
li {
  margin: 1rem 0;
  border: 1px solid #424242;
  border-radius: 12px;
  padding: 1rem;
}
section {
  display: flex;
  justify-content: space-between;
}
h3 {
  font-size: 1.5rem;
}

h3,
h4 {
  margin: 0.5rem 0;
}

div {
  margin: 0.5rem 0;
}
.controls {
  display: flex;
  justify-content: space-between;
}
.actions {
  display: flex;
  justify-content: flex-end;
}
</style>
