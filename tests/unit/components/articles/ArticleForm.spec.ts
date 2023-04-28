import ArticleForm from '@/components/articles/ArticleForm.vue';
import store from '@/store';
import { shallowMount } from '@vue/test-utils';
import flushPromises from 'flush-promises';
const buildWrapper = (options = {}) => {
  return shallowMount(ArticleForm, {
    store,
    ...options,
  });
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('ArticleForm', () => {
  it('should render', async () => {
    const wrapper = buildWrapper({
      propsData: {
        username: 'テストユーザー',
        accountName: '@testuser',
        userId: 1,
      },
      data() {
        return {
          articleBody: {
            val: '記事内容',
            isValid: true,
          },
          formIsValid: true,
        };
      },
    });
    await flushPromises();
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.vm.$data.articleBody.val).toBe('記事内容');
  });
  it('should show messages on validated form input', async () => {
    const wrapper = buildWrapper({
      propsData: {
        username: 'テストユーザー',
        accountName: '@testuser',
        userId: 1,
      },
      data() {
        return {
          articleBody: {
            val: '',
            isValid: false,
          },
          formIsValid: false,
        };
      },
    });
    await flushPromises();
    expect(wrapper.find('.form-control > p').text()).toContain('not be empty');
    expect(wrapper.find('.form-control + p').text()).toContain('Please fix');
  });

  it('should be validate when empty input', async () => {
    const wrapper = buildWrapper({
      propsData: {
        username: 'テストユーザー',
        accountName: '@testuser',
        userId: 1,
      },
      data() {
        return {
          articleBody: {
            val: '',
            isValid: true,
          },
          formIsValid: true,
        };
      },
    });
    await flushPromises();
    wrapper.vm.validateForm();
    expect(wrapper.vm.$data.articleBody.val).toBe('');
    expect(wrapper.vm.$data.articleBody.isValid).toBe(false);
    expect(wrapper.vm.$data.formIsValid).toBe(false);
  });

  it('should be validated when input texts', async () => {
    const wrapper = buildWrapper({
      propsData: {
        username: 'テストユーザー',
        accountName: '@testuser',
        userId: 1,
      },
      data() {
        return {
          articleBody: {
            val: '',
            isValid: true,
          },
          formIsValid: true,
        };
      },
    });
    wrapper.find('textarea').setValue('テストメッセージ');
    await flushPromises();
    wrapper.vm.validateForm();
    expect(wrapper.vm.$data.articleBody.val).toBe('テストメッセージ');
    expect(wrapper.vm.$data.articleBody.isValid).toBe(true);
    expect(wrapper.vm.$data.formIsValid).toBe(true);
  });

  it('should not submit form', async () => {
    const wrapper = buildWrapper({
      propsData: {
        username: 'テストユーザー',
        accountName: '@testuser',
        userId: 1,
      },
      data() {
        return {
          articleBody: {
            val: '',
            isValid: true,
          },
          formIsValid: true,
        };
      },
    });
    wrapper.vm.submitForm();
    await flushPromises();
    const emit = wrapper.emitted();
    expect(emit).toEqual({});
  });
  it('should submit form', async () => {
    const prop = {
      username: 'テストユーザー',
      accountName: '@testuser',
      userId: 1,
    };
    const data = {
      articleBody: {
        val: 'test',
        isValid: true,
      },
      formIsValid: true,
    };
    const wrapper = buildWrapper({
      propsData: prop,
      data() {
        return data;
      },
    });
    wrapper.vm.submitForm();
    await flushPromises();
    const emit = wrapper.emitted();
    expect(emit['save-data'].length).toBe(1);
    expect(emit['save-data'][0]).toEqual([
      {
        accountName: prop.accountName,
        username: prop.username,
        articleBody: data.articleBody,
      },
    ]);
  });
});
