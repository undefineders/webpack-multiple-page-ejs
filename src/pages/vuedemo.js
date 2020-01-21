import Vue from 'vue'
import MyImg from '../components/vue/MyImg/index.vue';

//Vue去掉 You are running Vue in development mode
Vue.config.productionTip = false;

new Vue({
    el:'#app',
    components:{
        MyImg
    },
    data:{
        list:[1,2,3,4]
    }
    // render:h=>h(App)
})