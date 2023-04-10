<template>
  <li>
    <div class="tooltip">
      <span v-if="hasSentiment" :class="sentimentFace" class="ec emoji"></span>
      <div class="description">
        {{ article.sentiment }}な文章と判定されました
      </div>
    </div>
    <section>
      <span>投稿日:{{ new Date(article.createdAt).toLocaleString() }}</span>
      <div class="controls">
        <base-button
          :mode="isDone ? 'disable' : 'outline'"
          @click="requestAIJob(true)"
        >
          <div v-if="!isLoading">{{ buttonText }}</div>
          <div v-else class="spinner">
            <base-spinner2></base-spinner2>
          </div>
        </base-button>
      </div>
    </section>
    <strong
      style="white-space: pre-wrap; word-wrap: break-word"
      v-html="body"
    ></strong>
    <section v-if="hasImages" class="image-container">
      <div v-for="(img, i) in this.article.imagePath" :key="i">
        <img :src="img" />
      </div>
    </section>
    <div class="actions" v-if="hasJapaneseText">
      <base-button v-if="isOriginal" @click="changeText">
        日本語テキストに切り替える
      </base-button>
      <base-button v-else @click="reverseText">原文に戻す</base-button>
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
      isOriginal: true,
      body: '',
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
    hasSentiment() {
      return this.article.sentiment !== null;
    },
    hasJapaneseText() {
      return this.article.japaneseVersion !== null;
    },
    isDone() {
      return this.article.isDone;
    },
    buttonText() {
      return this.isDone ? 'リクエスト済' : 'AIリクエスト';
    },
    sentimentFace() {
      switch (this.article.sentiment) {
        case 'POSITIVE':
          return 'ec-laughing';
        case 'NEGATIVE':
          return 'ec-sob';
        case 'NEUTRAL':
          return 'ec-slightly-frowning-face';
        default:
          return 'ec-exploding-head';
      }
    },
  },
  mounted() {
    this.body = this.convertNewLineChars(
      this.textToLink(this.article.articleBody)
    );
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
    changeText() {
      this.isOriginal = !this.isOriginal;
      this.body = this.article.japaneseVersion;
    },
    reverseText() {
      this.isOriginal = !this.isOriginal;
      this.body = this.article.articleBody;
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
  position: relative;
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
.emoji {
  position: absolute;
  top: 5px;
  left: 320px;
  font-size: 69px;
}
.tooltip {
  position: relative;
  cursor: pointer;
  display: inline-block;
}
.tooltip p {
  margin: 0;
  padding: 0;
}
.description {
  display: none;
  position: absolute;
  padding: 10px;
  font-size: 12px;
  line-height: 1.6em;
  color: #fff;
  border-radius: 5px;
  background: #000;
  width: 100px;
}
.description:before {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  border: 15px solid transparent;
  border-top: 15px solid #000;
  margin-left: -15px;
}
.tooltip:hover .description {
  display: inline-block;
  top: -105px;
  left: 307px;
}
</style>
