import './assets/script/common.js'
import './style/home.less'
import Test from './components/test/index.js'

setTimeout(_=>{
    document.getElementById('test').innerHTML = Test({list:[1,2,3]})
},1000)
console.log(11)