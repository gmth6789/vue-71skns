import Vue from 'vue'
import firebase from 'firebase'
import App from './App.vue'
import router from './router'
import Vuex from 'vuex'
import store from './store'
import axios from 'axios'
import VueAxios from 'vue-axios'
import qs from 'qs'

Vue.use(VueAxios, axios)
Vue.config.productionTip = false

const config = {
    apiKey: "AIzaSyD0t1-osffdxsp_-MBqyVUlEI2Hh7GJwak",
    //authDomain: "",
    authDomain: "gmshare.firebaseapp.com",
    databaseURL: "https://gmshare-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "gmshare",
    storageBucket: "gmshare.appspot.com",
    messagingSenderId: "306699670895",
    appId: "1:306699670895:web:0e2b0da8ec3534bb15849a",
    measurementId: "G-BW0B4MXFMK"
};
firebase.initializeApp(config);

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')