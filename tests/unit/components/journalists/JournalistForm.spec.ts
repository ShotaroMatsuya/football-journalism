import JournalistForm from '@/components/journalists/JournalistForm.vue';
import store from '@/store';
import { shallowMount } from '@vue/test-utils';
import flushPromises from 'flush-promises';

const buildWrapper = (options = {}) => {
  return shallowMount(JournalistForm, {
    store,
    ...options,
  });
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('JournalistForm', () => {
  it('should render', async () => {
    const wrapper = buildWrapper();
    await flushPromises();
    expect(wrapper.exists()).toBe(true);
  });
  it('should show messages on validated form input', async () => {
    const wrapper = buildWrapper({
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
    });
    wrapper.vm.validateForm();
    await flushPromises();
    expect(wrapper.find('[data-testid="username-form"]').classes()).toContain(
      'invalid'
    );
    expect(wrapper.find('#username + p').text()).toContain('not be empty.');
    expect(
      wrapper.find('[data-testid="accountName-form"]').classes()
    ).toContain('invalid');
    expect(wrapper.find('#accountName + p').text()).toContain('not be empty.');
    expect(
      wrapper.find('[data-testid="description-form"]').classes()
    ).toContain('invalid');
    expect(wrapper.find('#description + p').text()).toContain('not be empty.');
    expect(wrapper.find('[data-testid="areas-form"]').classes()).toContain(
      'invalid'
    );
    expect(wrapper.find('[data-testid="areas-invalid"]').text()).toContain(
      'be selected.'
    );
    expect(wrapper.find('[data-testid="areas-form"] + p').text()).toContain(
      'Please fix'
    );
  });

  it('should be validate when empty input', async () => {
    const wrapper = buildWrapper({
      data() {
        return {
          formIsValid: false,
        };
      },
    });
    const form = wrapper.find('form');
    form.trigger('submit');
    await flushPromises();
    const emit = wrapper.emitted();
    expect(emit['submit'].length).toEqual(1);
    expect(emit['save-data']).toBeFalsy();
  });

  it("shouldn't display validate messages", async () => {
    const wrapper = buildWrapper({
      data() {
        return {
          username: {
            val: 'test',
            isValid: true,
          },
          accountName: {
            val: 'test',
            isValid: true,
          },
          description: {
            val: 'test',
            isValid: true,
          },
          areas: {
            val: ['private', 'stats'],
            isValid: true,
          },
          formIsValid: false,
        };
      },
    });
    await wrapper.find('form').trigger('submit');
    await flushPromises();
    expect(
      wrapper.find('[data-testid="username-form"]').classes()
    ).not.toContain('invalid');
    expect(wrapper.findAll('#username + p')).toHaveLength(0);
    expect(
      wrapper.find('[data-testid="accountName-form"]').classes()
    ).not.toContain('invalid');
    expect(wrapper.findAll('#accountName + p')).toHaveLength(0);
    expect(
      wrapper.find('[data-testid="description-form"]').classes()
    ).not.toContain('invalid');
    expect(wrapper.findAll('#description + p')).toHaveLength(0);
    expect(wrapper.find('[data-testid="areas-form"]').classes()).not.toContain(
      'invalid'
    );
    expect(wrapper.findAll('[data-testid="areas-invalid"]')).toHaveLength(0);
    expect(wrapper.findAll('[data-testid="areas-form"] + p')).toHaveLength(0);
  });
  it('should submit form', async () => {
    const wrapper = buildWrapper({
      data() {
        return {
          username: {
            val: 'test',
            isValid: true,
          },
          accountName: {
            val: 'test',
            isValid: true,
          },
          description: {
            val: 'test',
            isValid: true,
          },
          areas: {
            val: ['private', 'stats'],
            isValid: true,
          },
          formIsValid: false,
        };
      },
    });
    await wrapper.find('form').trigger('submit');
    await flushPromises();
    const emit = wrapper.emitted();
    expect(emit['save-data'].length).toBe(1);
    expect(emit['save-data'][0]).toEqual([
      {
        accountName: 'test',
        areas: ['private', 'stats'],
        description: 'test',
        username: 'test',
      },
    ]);
  });
});
