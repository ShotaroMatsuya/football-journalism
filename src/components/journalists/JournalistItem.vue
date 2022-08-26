<template>
  <li>
    <h3>{{ username }}</h3>
    <h4>@{{ accountName }}</h4>
    <div>
      <base-badge
        v-for="area in areas"
        :key="area"
        :type="area"
        :title="area"
      ></base-badge>
    </div>
    <div class="actions">
      <base-button mode="outline" link :to="journalistContactLink"
        >リクエストを送る</base-button
      >
      <base-button link :to="journalistDetailsLink">記事を表示</base-button>
    </div>
  </li>
</template>

<script>
export default {
  props: ['id', 'username', 'accountName', 'areas'],
  computed: {
    journalistContactLink() {
      return this.$route.path + '/' + this.id + '/contact'; // /journalists/c1/contact
    },
    journalistDetailsLink() {
      return this.$route.path + '/' + this.id; // /journalists/c1
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

.actions {
  display: flex;
  justify-content: flex-end;
}
</style>
