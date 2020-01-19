let list = [1,2,3]
list.forEach(n=>{
	console.log(n)
})

class hello {
	constructor(arg) {
	    
	}
	
	say(){
		console.log('i can say')
	}
}

class hello2 {
	constructor(arg) {
	    
	}
	
	say(){
		console.log('i can say')
	}
}

// export default {
// 	hello,
// 	hello2
// }

module.exports = {
	hello,
	hello2
}