export default {
  async contactJournalist(context, payload) {
    const newRequest = {
      username: payload.username,
      message: payload.message,
      created_at: new Date().toISOString(),
    };
    const response = await fetch(
      `${process.env.VUE_APP_DB_HOST_URL}/requests/${payload.journalistId}`,
      {
        method: 'POST',
        body: JSON.stringify(newRequest),
      },
    );
    const responseData = await response.json();
    if (!response.ok) {
      const error = new Error(responseData.message || 'リクエスト送信に失敗');
      throw error;
    }
    newRequest.id = responseData.name;
    newRequest.journalistId = payload.journalistId;
    context.commit('addRequest', newRequest);
  },
  async fetchRequests(context) {
    const journalistId = context.rootGetters.userId;
    const token = context.rootGetters.token;
    // NOTE: token必要箇所(Authorization ヘッダーに変える)

    const response = await fetch(
      `${process.env.VUE_APP_DB_HOST_URL}/requests/${journalistId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    const responseData = await response.json();

    if (!response.ok) {
      const error = new Error(responseData.message || 'リクエスト取得に失敗');
      throw error;
    }

    const requests = [];

    for (const key in responseData) {
      for (const value of responseData[key]) {
        const request = {
          id: value.id,
          journalistId: journalistId,
          username: value.username,
          message: value.message,
        };
        requests.push(request);
      }
    }
    context.commit('setRequests', requests);
  },
};
