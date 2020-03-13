import '@/assets/css/home.less'
import Test from '@/components/ejs/test/index.js'

setTimeout(_=>{
    var list = []
    for(var i = 0 ; i < 20;i++){
        list.push(i+1)
    }
    document.getElementById('test').innerHTML = Test({list})
},1000)
console.log(11)