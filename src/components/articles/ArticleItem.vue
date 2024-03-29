<template>
  <li>
    <div class="controls">
      <span>投稿日:{{ new Date(article.createdAt).toLocaleString() }}</span>
      <div class="tooltip">
        <span
          v-if="hasSentiment"
          :class="sentimentFace"
          class="ec emoji"
        ></span>
        <div class="description">
          AIにより {{ article.sentiment }}な文章と判定されました
        </div>
      </div>
      <base-button
        :mode="isDone ? 'disable' : 'outline'"
        @click="requestAIJob()"
      >
        <div v-if="!isLoading">{{ buttonText }}</div>
        <div v-else class="spinner">
          <base-spinner2></base-spinner2>
        </div>
      </base-button>
    </div>
    <section>
      <div class="tag-area">
        <div class="org-tag" v-if="hasKeyOrgs">
          テキストから解析されたクラブ：
          <base-badge
            v-for="(k, i) in article.keyOrgs"
            type="orgs"
            :key="i"
            :title="k"
          ></base-badge>
        </div>
        <div class="person-tag" v-if="hasKeyPersons">
          テキストから解析された人物：
          <base-badge
            v-for="(k, i) in article.keyPersons"
            :key="i"
            :title="k"
            type="persons"
          ></base-badge>
        </div>
        <div class="face-tag" v-if="hasFaces">
          画像から解析された人物：
          <base-badge
            v-for="(k, i) in article.faces"
            :key="i"
            :title="k"
            type="faces"
          ></base-badge>
        </div>
      </div>
    </section>
    <hr />
    <strong
      style="white-space: pre-wrap; word-wrap: break-word"
      v-html="convertToLink"
    ></strong>
    <section v-if="hasImages" class="image-container">
      <div v-for="(img, i) in this.article.imagePath" :key="i">
        <img :src="img" />
      </div>
    </section>
    <hr />
    <section>
      <div v-if="hasPollyOutput">
        <p data-testid="polly-output">Pollyによる音声出力</p>
        <audio
          ref="audioPlayer"
          :src="article.pollyOutput"
          @timeupdate="updateTime"
        ></audio>
        <div class="actions">
          <div class="range-input">
            <p>
              再生時間: {{ formatTime(currentTime) }} /
              {{ formatTime(duration) }}
            </p>
            <input
              type="range"
              min="0"
              :max="duration"
              v-model="currentTime"
              @input="seek"
            />
          </div>
          <div class="volume-input">
            <p>音量: {{ Math.round(volume * 100) }}%</p>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              v-model="volume"
              @input="setVolume"
            />
          </div>
          <div class="audio-btn">
            <base-button @click="play">再生</base-button>
            <base-button @click="pause">停止</base-button>
          </div>
        </div>
      </div>
      <div class="actions convert-text" v-if="hasJapaneseText">
        <base-button
          data-testid="convert-to-jpn-btn"
          v-if="isOriginal"
          @click="changeText"
        >
          日本語テキストに切り替える
        </base-button>
        <base-button
          data-testid="convert-to-original-btn"
          v-else
          @click="reverseText"
          >原文に戻す</base-button
        >
      </div>
    </section>
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
      currentTime: 0,
      duration: 0,
      volume: 1,
    };
  },
  computed: {
    journalistId() {
      return this.$route.params.id;
    },
    convertToLink() {
      return this.convertNewLineChars(this.textToLink(this.body));
    },
    hasImages() {
      return this.article.imagePath.length > 0;
    },
    hasSentiment() {
      return this.article.sentiment !== null;
    },
    hasFaces() {
      return this.article.faces.length > 0;
    },
    hasPollyOutput() {
      return this.article.pollyOutput !== null;
    },
    hasJapaneseText() {
      return this.article.japaneseVersion !== null;
    },
    hasKeyOrgs() {
      return this.article.keyOrgs.length > 0;
    },
    hasKeyPersons() {
      return this.article.keyPersons.length > 0;
    },
    isDone() {
      return this.article.isDone;
    },
    buttonText() {
      return this.isDone ? '解析済' : 'AI解析';
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
      this.textToLink(this.article.articleBody),
    );
  },
  methods: {
    setVolume() {
      this.$refs.audioPlayer.volume = this.volume;
    },
    play() {
      this.$refs.audioPlayer.play();
    },
    pause() {
      this.$refs.audioPlayer.pause();
    },
    updateTime() {
      this.currentTime = this.$refs.audioPlayer.currentTime;
      this.duration = this.$refs.audioPlayer.duration;
    },
    seek() {
      this.$refs.audioPlayer.currentTime = this.currentTime;
    },
    formatTime(time) {
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);
      return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
    },
    async requestAIJob(refresh = false) {
      if (this.isLoading) return;
      this.isLoading = true;
      try {
        // JOBをリクエスト
        if (this.isDone) {
          console.log('実行済み');
          return;
        }
        await this.triggerAI(refresh);
        await this.checkStatus();
        // jobが完了したらarticlesを再度get
        await this.updateArticle();
      } catch (error) {
        this.error = error.message || 'Something went wrong!';
      } finally {
        this.isLoading = false;
      }
    },
    async triggerAI(refresh) {
      return await this.$store.dispatch('articles/triggerAI', {
        articleId: this.article.articleId,
        journalistId: this.journalistId,
        forceRefresh: refresh,
        isDone: this.isDone,
        lastFetch: this.article.lastFetch ? this.article.lastFetch : 0,
      });
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
.image-container {
  display: flex;
  flex-flow: column;
}
.image-container img {
  width: 100%;
}
.emoji {
  font-size: 50px;
  margin-right: 10px;
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
  top: -100px;
  left: -25px;
}
.btn-image {
  width: 60px;
}
</style>
