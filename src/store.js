import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		book: null
	},
	mutations: {
		setBook(state, book){
			state.book = book;
		}
	},
	actions: {

	}
})
