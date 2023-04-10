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

.orgs {
  margin: 1px;
  border: 1px solid black;
  background-color: #8d6c00;
  color: white;
}

.persons {
  margin: 1px;
  border: 1px solid black;
  background-color: #7a8d00;
  color: white;
}

.faces {
  margin: 1px;
  border: 1px solid black;
  background-color: #8d0021;
  color: white;
}
</style>
