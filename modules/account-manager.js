/**
 * Created by ligan on 1/06/16.
 */
var crypto = require('crypto');
var moment = require('moment');
var Member = require('../models/member');


/* login validation methods */

exports.manualLogin = function (username, password, callback) {
	Member.findOne({ username: username }, function (e, o) {
		if (o == null) {
			callback('user-not-found');
		} else {
			validatePassword(password, o.password, function (err, res) {
				if (res) {
					callback(null, o);
				} else {
					callback('invalid-password');
				}
			});
		}
	});
}



/* record insertion, update & deletion methods */

exports.addNewAccount = function (newMember, callback) {
	Member.findOne({ username: newMember.username }, function (e, o) {
		if (o) {
			callback('用户名存在');
		} else {
			saltAndHash(newMember.password, function (hash) {
				newMember.password = hash;
				// append date stamp when record was created //
				//newMember.time = moment().format('MMMM Do YYYY, h:mm:ss a');
				newMember.save(callback);
			});
		}


	});
}

exports.updateAccount = function (req, callback) {
	Member.findOne({ _id: req.params.id }, function (e, member) {
		for (prop in req.body) {
			member[prop] = req.body[prop];
		}

		member.save(function (e) {
			if (e) callback(e);
			else callback(null, member);
		});
        /*
		if (req.body['password'] == '') {
			member.save(function (e) {
				if (e) callback(e);
				else callback(null, o);
			});
		} else {
			saltAndHash(req.body['password'], function (hash) {
				member.password = hash;
				member.save(function (e) {
					if (e) callback(e);
					else callback(null, o);
				});
			});
		}
       */
	});
}


exports.updatePassword = function (req, callback) {
	Member.findOne({ _id: req.session.user._id }, function (e, member) {
		if (e) {
			callback(e, null);
		} else {
            validatePassword(req.body['oldPassword'], member.password, function (err, res) {
				if (res) {
					//callback(null, member);
                    //return;
				} else {
					callback('旧密码不相符');
                    return;
				}
			});
			saltAndHash(req.body['newPassword'], function (hash) {
				member.password = hash;
				member.save(function (e) {
					if (e) callback(e);
					else callback(null, member);
				});
			});
		}
	});
}

/* account lookup methods */

exports.deleteAccount = function (id, callback) {
	accounts.remove({ _id: getObjectId(id) }, callback);
}







/* private encryption & validation methods */

var generateSalt = function () {
	var set = '0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ';
	var salt = '';
	for (var i = 0; i < 10; i++) {
		var p = Math.floor(Math.random() * set.length);
		salt += set[p];
	}
	return salt;
}

var md5 = function (str) {
	return crypto.createHash('md5').update(str).digest('hex');
}

var saltAndHash = function (pass, callback) {
	var salt = generateSalt();
	callback(salt + md5(pass + salt));
}

var validatePassword = function (plainPass, hashedPass, callback) {
	var salt = hashedPass.substr(0, 10);
	var validHash = salt + md5(plainPass + salt);
	callback(null, hashedPass === validHash);
}


