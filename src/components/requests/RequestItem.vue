<template>
  <li>
    <div>
      <h1>{{ username }}</h1>
    </div>
    <p>{{ message }}</p>
  </li>
</template>

<script>
export default {
  props: ['username', 'message'],
  computed: {},
};
</script>

<style scoped>
li {
  margin: 1rem 0;
  border: 1px solid #ccc;
  padding: 1rem;
}

h1 {
  color: #008d50;
  text-decoration: none;
  font-weight: bold;
  margin-top: 0;
}

h1:active {
  color: #008d15;
}

p {
  margin: 0.5rem 0 0 0;
}
</style>
