import Vue from 'vue'
import Router from 'vue-router'
import Book from './views/Book'
import Chapter from './views/Chapter'
import Admin from './views/Admin'
import List from './views/List'

Vue.use(Router)

export default new Router({
	mode: 'history',
	base: process.env.BASE_URL,
	routes: [
		{
			path: '/',
			name: 'home',
			component: Book
		},
		{
			path: '/chapter',
			name: 'chapter',
			component: Chapter
		},
		{
			path: '/admin/spider',
			name: 'admin',
			component: Admin
		},
		{
			path: '/list',
			name: 'list',
			component: List
		}
	]
})
