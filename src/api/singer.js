import jsonp from 'common/js/jsonp'
import { commenParams, options } from './config'

export function getSingerList () {
	const url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg'
	const data = Object.assign({}, commenParams, {
		channel: 'singer',
		page: 'list',
		key: 'all_all_all',
		pagesize: 100,
		pagenum: 1,
		hostUin: 0,
		platform: 'yqq',
    needNewCode: 0
	})

	return jsonp(url, data, options)
}

export function getSingerDetail(singermid) {
	const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg'
	const data = Object.assign({}, commenParams, {
		loginUin: 0,
		hostUin: 0,
		platform: 'yqq',
		needNewCode: 0,
		singermid: singermid,
		order: 'listen',
		begin: 0,
		num: 100,
		songstatus: 1

	})

	return jsonp(url, data, options)
}
