<template>
  <base-card>
    <h2>Find Your Journalist</h2>
    <span class="filter-option">
      <input type="checkbox" id="transfer" checked @change="setFilter" />
      <label for="transfer">移籍の噂</label>
    </span>
    <span class="filter-option">
      <input type="checkbox" id="stats" checked @change="setFilter" />
      <label for="stats">統計情報</label>
    </span>
    <span class="filter-option">
      <input type="checkbox" id="private" checked @change="setFilter" />
      <label for="private">プライベート情報</label>
    </span>
    <span class="filter-option">
      <input type="checkbox" id="variety" checked @change="setFilter" />
      <label for="variety">その他</label>
    </span>
  </base-card>
</template>

<script>
export default {
  emits: ['change-filter'],
  data() {
    return {
      filters: {
        transfer: true,
        stats: true,
        private: true,
        variety: true,
      },
    };
  },
  methods: {
    setFilter(event) {
      const inputId = event.target.id;
      const isActive = event.target.checked;
      const updatedFilters = {
        ...this.filters,
        [inputId]: isActive,
      };
      this.filters = updatedFilters;
      this.$emit('change-filter', updatedFilters);
    },
  },
};
</script>

<style scoped>
h2 {
  margin: 0.5rem 0;
}

.filter-option {
  margin-right: 1rem;
}

.filter-option label,
.filter-option input {
  vertical-align: middle;
}

.filter-option label {
  margin-left: 0.25rem;
}

.filter-option.active label {
  font-weight: bold;
}
</style>
