import ArticleItem from '@/components/articles/ArticleItem';
import store from '@/store';
import { config, shallowMount } from '@vue/test-utils';
import flushPromises from 'flush-promises';

config.showDeprecationWarnings = false;
const buildWrapper = (options = {}) => {
  return shallowMount(ArticleItem, {
    store,
    ...options,
  });
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe.only('ArticleItem', () => {
  const props = {
    accountName: 'https://twitter.com/fabrizioromano',
    username: 'fabrizioromano',
    articleBody:
      'Understand there’s nothing agreed or signed between Roberto Firmino and Barcelona at this stage. 🇧🇷 #FCB\n\nIt’s not even advanced deal — just name discussed internally. Barça priorities are Iñigo, Gündogan, of course Messi.\n\nFirmino, still exploring options — no decision made yet. https://t.co/Ekv328XDWu',
    articleId: '1649750091169660930',
    createdAt: '2023-04-22T12:20:47+00:00',
    imagePath: ['https://pbs.twimg.com/media/FuUW9mGWAAEro96.jpg'],
    pollyOutput: null,
    japaneseVersion: null,
    sentiment: null,
    faces: [],
    keyOrgs: [],
    keyPersons: [],
    isDone: false,
  };
  it('should render', () => {
    const wrapper = buildWrapper({
      propsData: { article: props },
      methods: {
        updateArticle: jest.fn(),
        checkStatus: jest.fn(),
      },
    });
    expect(wrapper.exists()).toBe(true);
  });

  it('should show loading spinner when starting ai analysis', async () => {
    const wrapper = buildWrapper({
      propsData: { article: props },
      methods: {
        updateArticle: jest.fn(),
        checkStatus: jest.fn(),
        triggerAI: jest.fn(),
      },
    });
    wrapper.vm.requestAIJob();
    expect(wrapper.vm.$data.isLoading).toBe(true);
  });
  it('should disappear loading spinner when finishing ai analysis', async () => {
    const wrapper = buildWrapper({
      propsData: { article: props },
      methods: {
        updateArticle: jest.fn(),
        checkStatus: jest.fn(),
        triggerAI: jest.fn(),
      },
    });
    await wrapper.vm.requestAIJob();
    expect(wrapper.vm.$data.isLoading).toBe(false);
  });
  // unit
  it('should url to link', async () => {
    const wrapper = buildWrapper({
      propsData: { article: props },
    });
    await flushPromises();
    expect(wrapper.vm.$data.body).toContain(
      '<a href="https://t.co/Ekv328XDWu">https://t.co/Ekv328XDWu</a>'
    );
  });
  // unit
  it('should convert new line in the text', async () => {
    const wrapper = buildWrapper({
      propsData: { article: props },
    });
    await flushPromises();
    expect(wrapper.vm.$data.body).toContain('<br>');
  });

  it('should make emoji visible if sentiment exists', async () => {
    const wrapper = buildWrapper({
      propsData: { article: { ...props, sentiment: 'POSITIVE' } },
    });
    await flushPromises();
    expect(wrapper.vm.sentimentFace).toBe('ec-laughing');
    expect(wrapper.vm.hasSentiment).toBeTruthy();
    expect(wrapper.findAll('.emoji')).toHaveLength(1);
    expect(wrapper.find('.description').text()).toContain('POSITIVE');
  });
  it('should show key organizations when it exists', async () => {
    const wrapper = buildWrapper({
      propsData: { article: { ...props, keyOrgs: ['ORG1', 'ORG2'] } },
    });
    await flushPromises();
    expect(wrapper.vm.hasKeyOrgs).toBeTruthy();
    expect(wrapper.findAll('.org-tag')).toHaveLength(1);
    expect(wrapper.props().article.keyOrgs).toHaveLength(2);
  });
  it('should show key persons when it exists', async () => {
    const wrapper = buildWrapper({
      propsData: { article: { ...props, keyPersons: ['PERSON1'] } },
    });
    await flushPromises();
    expect(wrapper.vm.hasKeyPersons).toBeTruthy();
    expect(wrapper.findAll('.person-tag')).toHaveLength(1);
    expect(wrapper.props().article.keyPersons).toHaveLength(1);
  });
  it("shouldn't show key rekognized entities when it not exists", async () => {
    const wrapper = buildWrapper({
      propsData: {
        article: {
          ...props,
          imagePath: [],
        },
      },
    });
    await flushPromises();
    expect(wrapper.vm.hasFaces).toBeFalsy();
    expect(wrapper.findAll('.face-tag')).toHaveLength(0);
    expect(wrapper.props().article.imagePath).toHaveLength(0);
    expect(wrapper.props().article.faces).toHaveLength(0);
  });
  it('should show audio player UI when it exists', async () => {
    const wrapper = buildWrapper({
      propsData: {
        article: {
          ...props,
          pollyOutput: 'pollyOutput',
        },
      },
    });
    await flushPromises();
    expect(wrapper.vm.hasPollyOutput).toBeTruthy();
    expect(wrapper.findAll('[data-testid="polly-output"]')).toHaveLength(1);
    expect(wrapper.props().article.pollyOutput).toBe('pollyOutput');
    expect(wrapper.find('audio').attributes('src')).toBe('pollyOutput');
    expect(wrapper.find('.actions > .range-input')).toBeTruthy();
  });
  it('should show text convert switch when translated texts exists', async () => {
    const wrapper = buildWrapper({
      propsData: {
        article: {
          ...props,
          japaneseVersion: `ルイス・エンリケ、チェルシーの新監督を目指してレースから脱退。まったく変わっていない。クラブサイドで決まった。🔵⛔️ #CFC

          ナーゲルスマンの状況が変わった後の金曜日に明らかになったように、マウリシオ・ポチェッティーノは依然としてお気に入りの候補者です。
          
          Poch については近日公開予定です。https://t.co/g58vxVF0DB`,
        },
      },
    });
    await flushPromises();
    expect(wrapper.vm.hasJapaneseText).toBeTruthy();
    expect(wrapper.findAll('strong')).toHaveLength(1);
    const btn1 = wrapper.find('[data-testid="convert-to-jpn-btn"]');
    expect(wrapper.find('.convert-text').text()).toContain(
      '日本語テキストに切り替える'
    );
    btn1.trigger('click');
    await flushPromises();
    expect(wrapper.vm.$data.isOriginal).toBe(false);
    expect(wrapper.find('.convert-text').text()).toContain('原文に戻す');
    expect(wrapper.vm.convertToLink).toContain('</a>');
    expect(wrapper.vm.convertToLink).toContain('<br>');
    const btn2 = wrapper.find('[data-testid="convert-to-original-btn"]');
    btn2.trigger('click');
    await flushPromises();
    expect(wrapper.find('.convert-text').text()).toContain(
      '日本語テキストに切り替える'
    );
    expect(wrapper.vm.convertToLink).toContain('</a>');
    expect(wrapper.vm.convertToLink).toContain('<br>');
  });
});
