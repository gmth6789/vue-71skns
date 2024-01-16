import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        channelData: {
            userId: '',
            channelName: '',
            post: ''
        },
        isOpenPostList: false
    },
    mutations: {
        channelData(state, data) {
            state.channelData.userId = data.userId;
            state.channelData.channelName = data.channelName;
            state.channelData.post = data.postData;
        },
        postListStatus(state, data) {
            state.isOpenPostList = data.status;
        }
    },
    actions: {

    }
})