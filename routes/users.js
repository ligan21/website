var express = require('express');
var AM = require('../modules/account-manager');
var Log = require('../models/log');
var router = express.Router();


router.post('/login', function (req, res) {
		AM.manualLogin(req.body['username'], req.body['password'], function (e, o) {
    if (!o) {
      //res.status(400).send(e);

      res.redirect(301, '/login.html');
    } else {
      req.session.user = o;
      res.redirect(301, '/');
      //res.status(200).send(o);
      var user = req.session.user;
      console.log("login"+user);
      //var log = new Log({ 'userType': user.userType, 'username': user.username, 'organizationName': user.organizationName, 'action': '登录', '_memberId': user._id});
      //log.save();
    }
		});
});
router.get('/logout', function (req, res) {
  req.session.user = null;
  res.redirect(301, '/login.html');
  var user = req.session.user;
  //var log = new Log({ 'userType': user.userType, 'username': user.username, 'organizationName': user.organizationName, 'action': '退出登录', '_memberId': user._id});
  //log.save();
});

router.put('/setting', function (req, res) {
  //console.log(req.session.user);
  if (req.session.user == null) {
    // if user is not logged-in redirect back to login page //
    console.log("redirect login");
    res.status(401).send("not login")
    return;
  }
  AM.updatePassword(req, function (e, o) {
    if (!o) {
      res.status(400).send(e);
      var user = req.session.user;
      var log = new Log({ 'userType': user.userType, 'username': user.username, 'organizationName': user.organizationName, 'action': '修改密码失败', '_memberId': user._id });
      log.save();
    }
    else {
      res.status(200).send("成功修改密码");
      var user = req.session.user;
      var log = new Log({ 'userType': user.userType, 'username': user.username, 'organizationName': user.organizationName, 'action': '修改密码成功', '_memberId': user._id });
      log.save();
    }
  });
});


router.get('/user', function (req, res) {
  if (req.session.user == null) {
    // if user is not logged-in redirect back to login page //
    console.log("redirect login");
    res.status(401).send("not login")
    return;
  }
  res.json(req.session.user)
});


module.exports = router;
