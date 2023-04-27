<template>
  <form @submit.prevent="submitForm">
    <div
      class="form-control"
      data-testid="username-form"
      :class="{ invalid: !username.isValid }"
    >
      <label for="username">UserName</label>
      <input
        type="text"
        id="username"
        v-model.trim="username.val"
        @blur="clearValidity('username')"
      />
      <p v-if="!username.isValid">UserName must not be empty.</p>
    </div>
    <div
      class="form-control"
      data-testid="accountName-form"
      :class="{ invalid: !accountName.isValid }"
    >
      <label for="accountName">AccountName</label>
      <input
        type="text"
        id="accountName"
        v-model.trim="accountName.val"
        @blur="clearValidity('accountName')"
      />
      <p v-if="!accountName.isValid">AccountName must not be empty.</p>
    </div>
    <div
      class="form-control"
      data-testid="description-form"
      :class="{ invalid: !description.isValid }"
    >
      <label for="description">Description</label>
      <textarea
        id="description"
        rows="5"
        v-model.trim="description.val"
        @blur="clearValidity('description')"
      ></textarea>
      <p v-if="!description.isValid">Description must be not be empty.</p>
    </div>
    <div
      class="form-control"
      data-testid="areas-form"
      :class="{ invalid: !areas.isValid }"
    >
      <h3>Areas of Journalism</h3>
      <div>
        <input
          type="checkbox"
          id="transfer"
          value="transfer"
          v-model="areas.val"
          @blur="clearValidity('areas')"
        />
        <label for="transfer">移籍情報</label>
      </div>
      <div>
        <input
          type="checkbox"
          id="stats"
          value="stats"
          v-model="areas.val"
          @blur="clearValidity('areas')"
        />
        <label for="stats">統計情報</label>
      </div>
      <div>
        <input
          type="checkbox"
          id="private"
          value="private"
          v-model="areas.val"
          @blur="clearValidity('areas')"
        />
        <label for="private">プライベート情報</label>
      </div>
      <div>
        <input
          type="checkbox"
          id="variety"
          value="variety"
          v-model="areas.val"
          @blur="clearValidity('areas')"
        />
        <label for="variety">その他</label>
      </div>
      <p v-if="!areas.isValid" data-testid="areas-invalid">
        At least one Journalism type must be selected.
      </p>
    </div>
    <p v-if="!formIsValid">Please fix the above errors and submit again.</p>
    <base-button>Register</base-button>
  </form>
</template>

<script>
export default {
  emits: ['save-data'],
  data() {
    return {
      username: {
        val: '',
        isValid: true,
      },
      accountName: {
        val: '',
        isValid: true,
      },
      description: {
        val: '',
        isValid: true,
      },
      areas: {
        val: [],
        isValid: true,
      },
      formIsValid: true,
    };
  },
  methods: {
    clearValidity(input) {
      this[input].isValid = true;
    },
    validateForm() {
      this.formIsValid = true;
      if (this.username.val === '') {
        this.username.isValid = false;
        this.formIsValid = false;
      }
      if (this.accountName.val === '') {
        this.accountName.isValid = false;
        this.formIsValid = false;
      }
      if (this.description.val === '') {
        this.description.isValid = false;
        this.formIsValid = false;
      }
      if (this.areas.val.length === 0) {
        this.areas.isValid = false;
        this.formIsValid = false;
      }
    },
    submitForm() {
      this.validateForm();

      if (!this.formIsValid) {
        return;
      }

      const formData = {
        username: this.username.val,
        accountName: this.accountName.val,
        description: this.description.val,
        areas: this.areas.val,
      };
      this.$emit('save-data', formData);
    },
  },
};
</script>

<style scoped>
.form-control {
  margin: 0.5rem 0;
}

label {
  font-weight: bold;
  display: block;
  margin-bottom: 0.5rem;
}

input[type='checkbox'] + label {
  font-weight: normal;
  display: inline;
  margin: 0 0 0 0.5rem;
}

input,
textarea {
  display: block;
  width: 100%;
  border: 1px solid #ccc;
  font: inherit;
}

input:focus,
textarea:focus {
  background-color: #f0e6fd;
  outline: none;
  border-color: #008d50;
}

input[type='checkbox'] {
  display: inline;
  width: auto;
  border: none;
}

input[type='checkbox']:focus {
  outline: #008d50 solid 1px;
}

h3 {
  margin: 0.5rem 0;
  font-size: 1rem;
}

.invalid label {
  color: red;
}

.invalid input,
.invalid textarea {
  border: 1px solid red;
}
</style>
