import utils from '@/utils.js'

const get = utils.get.bind(utils);
const post = utils.post.bind(utils);

export function sendSms(phonenumber) {
	return post("/sendsms", {
		phonenumber
	});
}

export function login(phonenumber, code, uplevel, admin = false) {
	return post("/login", {
		phonenumber,
		code,
		uplevel,
		admin
	})
}

export function newTask(title, content, fee, remain) {
	return post("/task/putTask", {
		title,
		content,
		fee,
		remain,
		"new": true
	})
}


export function reNewTask(taskid) {
	return post("/task/putTask", {
		taskid,
		"new": false
	})
}


export function getPostTasks(page = 0, size = 10, type = 0) {
	return post("/task/getSendTasks", {
		type,
		page,
		size
	})
}


export function getTasksByUser(username, page = 0, size = 10) {
	return post("/getUserTask", {
		username,
		page,
		size
	})
}


export function getcash(fee) {
	return post("/getcash", {
		fee
	})
}

export function receiveTask(taskid) {
	return post("/receiveTask", {
		taskid
	})
}

export function pay(taskid) {
	return post("/payTask", {
		taskid
	})
}

export function wxlogin(enc, iv, code) {
	return post("/wxlogin", {
		"encrypted_data": enc,
		iv,
		code
	})
}

export function cancelTask(taskid) {
	return post("/cancelTask", {
		taskid
	})
}


export function getAvailableMoney() {
	return post("/getBalance")
}



export function getTasks(page = 0, size = 10) {
	return post("/getUserTask", {
		selectuser: false,
		username: "",
		page,
		size
	})
}


export function getTaskByID(taskid) {
	return post("/task/getTaskById", {
		taskid
	})
}

export function getMyTaskByStatus(status = -1, page = 0, size = 10) {
	return post("/task/getTaskByStatus", {
		status,
		page,
		size
	})
}

export function getCosCred(bucket, region) {
	return post("/get_cos_credentials", {
		bucket,
		region
	})
}



export function getUserInfo() {
	return post("/verifySession")
}
