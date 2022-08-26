<template>
  <div>
    <base-dialog
      :show="!!error"
      title="An error occurred!"
      @close="handleError"
    >
      <p>{{ error }}</p>
    </base-dialog>
    <section>
      <journalist-filter @change-filter="setFilters"></journalist-filter>
    </section>
    <section>
      <base-card>
        <div class="controls">
          <base-button mode="outline" @click="loadJournalists(true)"
            >Refresh</base-button
          >
          <base-button link to="/auth?redirect=register" v-if="!isLoggedIn"
            >Login to Register as Journalist</base-button
          >
          <base-button
            v-if="isLoggedIn && !isJournalist && !isLoading"
            link
            to="/register"
            >Register as Journalist</base-button
          >
        </div>
        <div v-if="isLoading">
          <base-spinner></base-spinner>
        </div>
        <ul v-else-if="hasJournalists">
          <journalist-item
            v-for="journalist in filteredJournalists"
            :key="journalist.id"
            :id="journalist.id"
            :username="journalist.username"
            :account-name="journalist.accountName"
            :areas="journalist.areas"
          ></journalist-item>
        </ul>
        <h3 v-else>No Journalist found.</h3>
      </base-card>
    </section>
  </div>
</template>

<script>
import journalistItem from '../../components/journalists/JournalistItem.vue';
import journalistFilter from '../../components/journalists/JournalistFilter.vue';

export default {
  components: {
    journalistItem,
    journalistFilter,
  },
  data() {
    return {
      isLoading: false,
      error: null,
      activeFilters: {
        transfer: true,
        stats: true,
        private: true,
        variety: true,
      },
    };
  },
  computed: {
    isLoggedIn() {
      return this.$store.getters.isAuthenticated;
    },
    isJournalist() {
      return this.$store.getters['journalists/isJournalist'];
    },
    filteredJournalists() {
      const journalists = this.$store.getters['journalists/journalists'];
      return journalists.filter((journalist) => {
        if (
          this.activeFilters.transfer &&
          journalist.areas.includes('transfer')
        ) {
          return true;
        }
        if (this.activeFilters.stats && journalist.areas.includes('stats')) {
          return true;
        }
        if (
          this.activeFilters.private &&
          journalist.areas.includes('private')
        ) {
          return true;
        }
        if (
          this.activeFilters.variety &&
          journalist.areas.includes('variety')
        ) {
          return true;
        }
        return false;
      });
    },
    hasJournalists() {
      return (
        !this.isLoading && this.$store.getters['journalists/hasJournalists']
      );
    },
  },
  created() {
    this.loadJournalists();
  },
  methods: {
    setFilters(updatedFilters) {
      this.activeFilters = updatedFilters;
    },
    async loadJournalists(refresh = false) {
      this.isLoading = true;
      try {
        await this.$store.dispatch('journalists/loadJournalists', {
          forceRefresh: refresh,
        });
      } catch (error) {
        this.error = error.message || 'Something went wrong!';
      }
      this.isLoading = false;
    },
    handleError() {
      this.error = null;
    },
  },
};
</script>

<style scoped>
ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.controls {
  display: flex;
  justify-content: space-between;
}
</style>
