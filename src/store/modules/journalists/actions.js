export default {
  async registerJournalist(context, data) {
    const userId = context.rootGetters.userId;
    const journalistData = {
      username: data.username,
      accountName: data.accountName,
      description: data.description,
      areas: data.areas,
    };
    const token = context.rootGetters.token;

    const response = await fetch(
      `${process.env.VUE_APP_DB_HOST_URL}/journalist/${userId}`,
      {
        method: 'PUT',
        body: JSON.stringify(journalistData),
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // const responseData = await response.json();
    // FIXME: error後の処理
    if (!response.ok) {
      // error...
    }

    context.commit('registerJournalist', {
      ...journalistData,
      id: userId,
    });
  },
  async loadJournalists(context, payload) {
    if (!payload.forceRefresh && !context.getters.shouldUpdate) {
      return;
    }

    const response = await fetch(
      `${process.env.VUE_APP_DB_HOST_URL}/journalist`
    );
    const responseData = await response.json();

    if (!response.ok) {
      const error = new Error(responseData.message || 'Failed to fetch!');
      throw error;
    }
    const journalists = [];

    for (const key in responseData) {
      const journalist = {
        id: responseData[key].id,
        username: responseData[key].username,
        accountName: responseData[key].accountName,
        description: responseData[key].description,
        areas: responseData[key].areas,
      };
      journalists.push(journalist);
    }
    context.commit('setJournalists', journalists);
    context.commit('setFetchTimestampInJournalist');
  },
};
