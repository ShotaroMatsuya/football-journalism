<template>
  <button v-if="!link" :class="mode">
    <slot></slot>
  </button>
  <router-link v-else :to="to" :class="mode">
    <slot></slot>
  </router-link>
</template>

<script>
export default {
  props: {
    mode: {
      type: String,
      required: false,
      default: null,
    },
    link: {
      type: Boolean,
      required: false,
      default: false,
    },
    to: {
      type: String,
      required: false,
      default: '/',
    },
  },
};
</script>

<style scoped>
button,
a {
  text-decoration: none;
  padding: 0.75rem 1.5rem;
  font: inherit;
  background-color: #006118;
  border: 1px solid #006118;
  color: white;
  cursor: pointer;
  border-radius: 30px;
  margin-right: 0.5rem;
  display: inline-block;
}

a:hover,
a:active,
button:hover,
button:active {
  background-color: #084100;
  border-color: #084100;
}

.flat {
  background-color: transparent;
  color: #00613f;
  border: none;
}

.outline {
  background-color: transparent;
  border-color: #084100;
  color: #084100;
}

.disable {
  background-color: #084100;
  border-color: #084100;
  color: white;
}
.disable:hover,
.disable:active {
  background-color: #084100;
}

.flat:hover,
.flat:active,
.outline:hover,
.outline:active {
  background-color: #6800ad;
  color: white;
}
</style>
