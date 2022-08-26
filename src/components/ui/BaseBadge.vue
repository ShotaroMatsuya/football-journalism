<template>
  <span class="badge" :class="type">
    {{ text }}
  </span>
</template>

<script>
export default {
  props: ['type', 'title'],
  computed: {
    text() {
      return this.title.toUpperCase();
    },
  },
};
</script>

<style scoped>
.badge {
  background-color: #ccc;
  color: #252525;
  padding: 0.1rem 1rem;
  display: inline-block;
  margin-right: 0.5rem;
}

.transfer {
  background-color: #008d50;
  color: white;
}

.stats {
  background-color: #006c8d;
  color: white;
}

.private {
  background-color: #00158d;
  color: white;
}

.variety {
  background-color: #55008d;
  color: white;
}
</style>
