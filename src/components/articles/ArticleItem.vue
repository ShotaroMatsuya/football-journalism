<template>
  <li>
    <section>
      <span>投稿日:{{ new Date(article.createdAt).toLocaleString() }}</span>
      <div class="controls">
        <base-button mode="outline" @click="loadArticle(true)">
          <div v-if="!isLoading">Refresh</div>
          <div v-else class="spinner">
            <base-spinner2></base-spinner2>
          </div>
        </base-button>
      </div>
    </section>
    <strong
      style="white-space: pre-wrap; word-wrap: break-word"
      v-html="convertToLink"
    ></strong>
    <section v-if="hasImages" class="image-container">
      <div v-for="(img, i) in this.article.imagePath" :key="i">
        <img :src="img" />
      </div>
    </section>
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
    convertToLink() {
      return this.convertNewLineChars(
        this.textToLink(this.article.articleBody)
      );
    },
    hasImages() {
      return this.article.imagePath.length > 0;
    },
  },
  created() {
    this.loadArticle();
  },
  methods: {
    async requestAIJob(refresh = false) {
      this.isLoading = true;
      try {
        // JOBをリクエスト
        if (this.isDone) {
          console.log('実行済み');
          return;
        }
        await this.$store.dispatch('articles/triggerAI', {
          articleId: this.article.articleId,
          journalistId: this.journalistId,
          forceRefresh: refresh,
          isDone: this.isDone,
          lastFetch: this.article.lastFetch ? this.article.lastFetch : 0,
        });
        await this.checkStatus();
        // jobが完了したらarticlesを再度get
        await this.updateArticle();
        console.log(this.article);
      } catch (error) {
        this.error = error.message || 'Something went wrong!';
      } finally {
        this.isLoading = false;
      }
    },
    async checkStatus() {
      return await this.$store.dispatch('articles/getStatus', {
        jobId: this.article.jobId,
        articleId: this.article.articleId,
        journalistId: this.journalistId,
      });
    },
    async updateArticle() {
      return await this.$store.dispatch('articles/updateArticle', {
        articleId: this.article.articleId,
        isDone: this.isDone,
        lastFetch: this.article.lastFetch ? this.article.lastFetch : 0,
        journalistId: this.journalistId,
      });
    },
    },
    async requestTranslation() {
      this.isPrepared = !this.isPrepared;
    },
    handleError() {
      this.error = null;
    },
    textToLink(target) {
      // 正規表現でURLを抽出
      const regexp_url = /(https?:\/\/[\w/:%#$&?()~.=+-]+)/g;
      let linkedComment = target.replace(regexp_url, '<br><a href="$1">$1</a>');
      return linkedComment;
    },
    convertNewLineChars(target) {
      return target.replace(/\\n/g, '<br>');
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
.image-container {
  display: flex;
  flex-flow: column;
}
.image-container img {
  width: 100%;
}
</style>
