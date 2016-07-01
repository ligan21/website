/**
 * Created by ligan on 27/05/16.
 */
var Website = require('../models/website');
var Member = require('../models/member');
var Log = require('../models/log');
var Message = require('../models/message');
var Count = require('../models/count');
var Organization = require('../models/organization');
var AM = require('../modules/account-manager');
var express = require('express');
var upload = require('../modules/multerUtil');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    //res.render('index', { title: 'Express' });

    //console.log("homepage");
});

router.route('/count')
    .get(function(req, res) {
        var user = req.session.user;
        console.log("user:" + user);
        if (user == null) {
            res.status(401).send();
            return;
        }
        var query = {};
        if (user.userType == "部属单位管理员") {
            query.organizationName = user.organizationName;
        } else if (user.userType == "部属单位网站管理员") {
            query.submitter = user.username;
        }
        var count = {};
        Member.count(query, function(err, c) {
            count.memberCount = c;
            query.state = "通过审核";
            Website.count(query, function(err, c) {
                count.acceptWebsiteCount = c;
                query.state = "待审核";
                Website.count(query, function(err, c) {
                    count.paddingCheckWebsiteCount = c;
                    query.state = "驳回申请";
                    Website.count(query, function(err, c) {
                        count.refuseWebsiteCount = c;
                        res.json(count);
                    });

                });
            });

        });
    });
router.route('/SERcount')
    .get(function(req, res) {
        var user = req.session.user;
        console.log("user:" + user);
        if (user == null) {
            res.status(401).send();
            return;
        }
        var query = {}
        if (user.userType == "部属单位管理员") {
            query.organizationName = user.organizationName;
        } else if (user.userType == "部属单位网站管理员") {
            query.submitter = user.username;
        }
        var count = {};
        query.securityEvaluationReportState = "需要提交";
        Website.count(query, function(err, c) {
            count.SERcount = c;
            res.json(count);
        });

    });
router.route('/RRcount')
    .get(function(req, res) {
        var user = req.session.user;
        console.log("user:" + user);
        if (user == null) {
            res.status(401).send();
            return;
        }
        var query = {}
        if (user.userType == "部属单位管理员") {
            query.organizationName = user.organizationName;
        } else if (user.userType == "部属单位网站管理员") {
            query.submitter = user.username;
        }
        var count = {};
        query.reformReportState = "需要提交";
        Website.count(query, function(err, c) {
            count.RRcount = c;
            res.json(count);
        });

    });
// website route
router.route('/websites')
    .get(function(req, res) {
        var user = req.session.user;
        console.log("user:" + user);
        if (user == null) {
            res.status(401).send();
            return;
        }
        var organizationName = req.param('organizationName');
        var startDate = req.param('startDate');
        var endDate = req.param('endDate');
        var state = req.param('state');
        var limit = req.param('limit');
        var page = Math.max(0, req.param('page'));
        var query = {};
        if (state) {
            query.state = state;
        }
        if (organizationName) query.organizationName = organizationName;
        if (startDate) query.submitTime = {
            "$gte": startDate,
            "$lt": endDate
        };

        if (user.userType == "部属单位网站管理员") {
            query._submitterId = user._id;
        } else if (user.userType == "部属单位管理员") {
            query.organizationName = user.organizationName;
            query.state = {
                $ne: "保存网站"
            };

        } else if (user.userType == "系统管理员") query._ownerId = user._id;
        console.log(query);
        Website.paginate(query, {
            page: page,
            limit: limit,
            sort: {
                updateTime: -1
            },
            select: {
                _id: 1,
                organizationName: 1,
                websiteName: 1,
                submitTime: 1,
                state: 1,
                securityEvaluationReportLink: 1,
                securityEvaluationReportState: 1,
                reformReportLink: 1,
                reformReportState: 1,
                refuseReason: 1
            }
        }, function(err, result) {
            res.json(result);
        });


    })
    .post(function(req, res) {
        console.log("add websites");
        var user = req.session.user;

        if (user == null) {
            res.status(401).send();
            return;
        }
        var website = new Website(req.body);
        website['submitter'] = user.username;
        website['_submitterId'] = user._id;
        website['_ownerId'] = user._id;
        website['organizationName'] = user.organizationName;
        console.log(req.body);
        website.save(function(err) {
            if (err) {
                res.send(err);
                return;
            }
            res.send({
                message: 'website Added'
            });

            var log = new Log({
                'userType': user.userType,
                'username': user.username,
                'organizationName': user.organizationName,
                'action': '添加网站',
                '_memberId': user._id,
                '_websiteId': website._id
            });
            log.save();
            var websiteQuery = {};
            websiteQuery.organizationName = user.organizationName;
            var organizationQuery = {};
            organizationQuery.name = user.organizationName;
            //Organization.findOneAndUpdate(query, {
            //    $inc: {
            //        count: 1
            //    }
            //}, function(err, doc) {
            //    if (err) {
            //        console.log("Something wrong when updating data!");
            //    }
            //});
            console.log(organizationQuery);
            Organization.findOne(organizationQuery, function(err, organization) {
                console.log(organization);
                Website.count(websiteQuery, function(err, c) {
                    console.log(c);
                    organization['count'] = c;
                    organization.save();
                })
            });

            /*
                        Website.count({}, function(err, c) {
                            console.log('Count is ' + c);
                            Count.findOne({}, function(err, count) {
                                count["websiteCount"] = c;
                                count.save();
                            });
 
                        });
                         Website.count({ state: "待审核" }, function (err, c) {
                             console.log('Count is ' + c);
                             Count.findOne({}, function (err, count) { count["paddingCheckCount"] = c; count.save(); });
 
                         });*/
        });
    });


router.route('/websites/:id')
    .put(function(req, res) {
        var user = req.session.user;
        if (user == null) {
            res.status(401).send();
            return;
        }
        Website.findOne({
            _id: req.params.id
        }, function(err, website) {

            if (err) {
                res.send(err);
                return;
            }
            for (prop in req.body) {
                website[prop] = req.body[prop];
            }
            website['updateTime'] = new Date();
            if (req.body['ownerId'] == '1')
                website['_ownerId'] = user._createrId;
            // save the website
            console.log(website);
            website.save(function(err) {
                if (err) {
                    res.send(err);
                    return;
                }
                res.status(200).json({
                    message: 'website updated!'
                });
            });
            /*
                        Website.count({
                            state: "待审核"
                        }, function(err, c) {
                            console.log('Count is ' + c);
                            Count.findOne({}, function(err, count) {
                                count["paddingCheckCount"] = c;
                                count.save();
                            });
        
                        });
                        Website.count({
                            state: "通过审核"
                        }, function(err, c) {
                            console.log('Count is ' + c);
                            Count.findOne({}, function(err, count) {
                                count["agreeCount"] = c;
                                count.save();
                            });
        
                        });
                        Website.count({
                            state: "驳回申请"
                        }, function(err, c) {
                            console.log('Count is ' + c);
                            Count.findOne({}, function(err, count) {
                                count["refuseCount"] = c;
                                count.save();
                            });
        
                        });*/
            var action;
            if (website.target == "WS") action = website.state + "网站";
            else if (website.target == "SER") action = website.securityEvaluationReportState + "安全评测报告";
            else if (website.target == "RR") action = website.reformReportState + "整改报告";

            var log = new Log({
                'userType': user.userType,
                'username': user.username,
                'organizationName': user.organizationName,
                'action': action,
                '_memberId': user._id,
                '_websiteId': website._id
            });
            log.save();
        });
    })

.get(function(req, res) {
    Website.findOne({
        _id: req.params.id
    }, function(err, website) {
        if (err)
            res.send(err);

        res.json(website);
    });
})


.delete(function(req, res) {
    Website.remove({
        _id: req.params.id
    }, function(err, website) {
        if (err)
            res.send(err);

        res.json({
            message: 'Successfully deleted'
        });
    });
});

//member route
router.route('/members')
    .get(function(req, res) {
        var user = req.session.user;
        if (user == null) {
            res.status(401).send();
            return;
        }
        var username = req.param('username');
        if (username) {
            Member.findOne({
                username: username
            }, function(e, o) {
                if (o == null) {
                    res.status(200).json({
                        message: 'not found user!'
                    });
                    return;
                } else {
                    res.status(403).send();
                    return;
                }
            });
            return;
        }
        var userType = req.param('userType');
        var organizationName = req.param('organizationName');
        var limit = req.param('limit');
        var page = Math.max(0, req.param('page'));
        var query = {
            '_createrId': req.session.user._id
        };
        if (userType) {
            query.userType = userType;
        }
        if (organizationName) query.orangizationName = organizationName;
        console.log(query);
        Member.paginate(query, {
            page: page,
            limit: limit,
            select: {
                _id: 1,
                username: 1,
                organizationName: 1,
                name: 1,
                userType: 1,
                time: 1
            }
        }, function(err, result) {
            res.json(result);
        });

    })
    .post(function(req, res) {
        console.log("add member");
        var user = req.session.user;
        if (user == null) {
            res.status(401).send();
            return;
        }
        var member = new Member(req.body);
        console.log(req.body);
        member['_createrId'] = user._id;
        if (user.userType == '部属单位管理员') {
            member['organizationName'] = user.organizationName;
        }
        AM.addNewAccount(member, function(err, o) {
            if (err) res.status(400).send(err);
            else res.json(o);
        });
        /*
                Member.count({}, function (err, c) {
                    console.log('Count is ' + c);
                    Count.findOne({}, function (err, count) {
                        count["memberCount"] = c;
                        count.save();
                    });

                });*/
        var log = new Log({
            'userType': user.userType,
            'username': user.username,
            'organizationName': user.organizationName,
            'action': '添加用户',
            '_memberId': user._id
        });
        log.save();

    });

router.route('/members/:id')
    .put(function(req, res) {
        var user = req.session.user;
        if (user == null) {
            res.status(401).send();
            return;
        }
        AM.updateAccount(req, function(err, o) {
            if (err) {
                res.status(400).send(e);
                return;
            } else res.json(o);
        });
        var log = new Log({
            'userType': user.userType,
            'username': user.username,
            'organizationName': user.organizationName,
            'action': '更新用户',
            '_memberId': user._id
        });
        log.save();
        /*
    Member.findOne({ _id: req.params.id }, function (err, member) {

        if (err)
            res.send(err);

        for (prop in req.body) {
            member[prop] = req.body[prop];
        }

        // save the movie
        member.save(function (err) {
            if (err)
                res.send(err);

            res.json({ message: 'member updated!' });
        });

    });
  */
    })

.get(function(req, res) {
    Member.findOne({
        _id: req.params.id
    }, function(err, member) {
        if (err)
            res.send(err);
        else res.json(member);
    });
})

.delete(function(req, res) {
    Member.remove({
        _id: req.params.id
    }, function(err, member) {
        if (err)
            res.send(err);
        else
            res.json({
                message: 'Successfully deleted'
            });
    });
});

//organization route
router.route('/organizations')
    .get(function(req, res) {
        var limit = req.param('limit');
        var page = Math.max(0, req.param('page'));
        var sort = req.param('sort');
        var sortby;
        if (sort) sortby = sort;
        else sortby = "name";
        console.log(sortby);
        console.log(req.param('page'));
        Organization.paginate({}, {
            page: page,
            limit: limit,
            sort: {
                count: -1,
                name: 1,
            },
            select: {
                _id: 1,
                name: 1,
                type: 1,
                time: 1,
                count: 1
            }
        }, function(err, result) {
            res.json(result);
        });
    })
    .post(function(req, res) {
        console.log("add organization");
        var organization = new Organization(req.body);
        organization.save(function(err) {
            if (err)
                res.send(err);
            else res.json({
                message: 'add organization!'
            });
        });
    });


router.route('/organizations/:id')
    .put(function(req, res) {
        var user = req.session.user;
        if (user == null) {
            res.status(401).send();
            return;
        }
        Organization.findOne({
            _id: req.params.id
        }, function(err, organization) {

            if (err)
                res.send(err);

            for (prop in req.body) {
                organization[prop] = req.body[prop];
            }

            // save the 
            organization.save(function(err) {
                if (err)
                    res.send(err);

                res.json({
                    message: 'organization updated!'
                });
                var log = new Log({
                    'userType': user.userType,
                    'username': user.username,
                    'organizationName': user.organizationName,
                    'action': '更新单位',
                    '_memberId': user._id
                });
                log.save();
            });

        });
    })

.get(function(req, res) {
    Organization.findOne({
        _id: req.params.id
    }, function(err, organization) {
        if (err)
            res.send(err);

        res.json(organization);
    });
})

.delete(function(req, res) {
    Organization.remove({
        _id: req.params.id
    }, function(err, organization) {
        if (err)
            res.send(err);

        res.json({
            message: 'Successfully deleted'
        });
    });
});

//message route
router.route('/messages')
    .get(function(req, res) {
        var type = req.param('type');
        var limit = req.param('limit');
        var page = Math.max(0, req.param('page'));
        console.log(req.param('type'));
        var query = {};
        if (type) {
            query.type = type;
        }
        Message.paginate(query, {
            page: page,
            limit: limit,
            sort: {
                time: -1
            },
            select: {
                _id: 1,
                title: 1,
                type: 1,
                time: 1,
                timeout: 1
            }
        }, function(err, result) {
            res.json(result);
        });

    })
    .post(function(req, res) {
        console.log("add message");
        var user = req.session.user;
        if (user == null) {
            res.status(401).send();
            return;
        }
        var message = new Message(req.body);
        message.save(function(err) {
            if (err)
                res.send(err);
            else res.json({
                message: 'add message!'
            });
        });
        var log = new Log({
            'userType': user.userType,
            'username': user.username,
            'organizationName': user.organizationName,
            'action': '发布消息',
            '_memberId': user._id,
        });
        log.save();


    });

router.route('/messages/:id')
    .put(function(req, res) {
        Message.findOne({
            _id: req.params.id
        }, function(err, message) {

            if (err)
                res.send(err);

            for (prop in req.body) {
                message[prop] = req.body[prop];
            }

            // save the message
            message.save(function(err) {
                if (err)
                    res.send(err);

                res.json({
                    message: 'Message updated!'
                });
            });

        });
    })

.get(function(req, res) {
    Message.findOne({
        _id: req.params.id
    }, function(err, message) {
        if (err)
            res.send(err);

        res.json(message);
    });
})

.delete(function(req, res) {
    Message.remove({
        _id: req.params.id
    }, function(err, organization) {
        if (err)
            res.send(err);

        res.json({
            message: 'Successfully deleted'
        });
    });
});
//logs route
router.route('/logs')
    .get(function(req, res) {
        var websiteId = req.param('_websiteId');
        var memberId = req.param("_memberId");
        var userType = req.param('userType');
        var organizationName = req.param('organizationName');
        var filter = req.param('filter');
        var limit = req.param('limit');
        var page = Math.max(0, req.param('page'));
        var query = {};
        if (websiteId) {
            query._websiteId = websiteId;
        }
        if (memberId) {
            query._memberId = memberId;
        }
        if (userType) {
            query.userType = userType;
        }
        if (organizationName) {
            query.organizationName = organizationName;
        }
        console.log(query);
        Log.paginate(query, {
            page: page,
            limit: limit,
            sort: {
                time: -1
            }
        }, function(err, result) {
            res.json(result);
        });

    });

router.route('/logs/:id')
    .put(function(req, res) {
        Log.findOne({
            _id: req.params.id
        }, function(err, log) {

            if (err)
                res.send(err);

            for (prop in req.body) {
                log[prop] = req.body[prop];
            }

            // save the 
            log.save(function(err) {
                if (err)
                    res.send(err);

                res.json({
                    message: 'log updated!'
                });
            });

        });
    })

.get(function(req, res) {
    Logs.findOne({
        _id: req.params.id
    }, function(err, log) {
        if (err)
            res.send(err);

        res.json(log);
    });
});

router.route('/organizationType')
    .get(function(req, res) {
        var organizationType = [{
            "name": "部属单位"
        }, {
            "name": "直属高校"
        }, {
            "name": "地方主管部门"
        }];
        res.json(organizationType);
    });

router.route('/memberType')
    .get(function(req, res) {
        var user = req.session.user;
        if (user == null) {
            res.status(401).send();
        }
        if (user.userType == "系统管理员") {
            var memberType = [{
                "name": "系统部级一般用户"
            }, {
                "name": "部属单位管理员"
            }, {
                "name": "安全审核员"
            }];
            res.json(memberType);
        } else if (user.userType == "部属单位管理员") {
            var memberType = [{
                "name": "部属单位网站管理员"
            }];
            res.json(memberType);
        }

    });

router.route('/upload')
    .post(function(req, res) {
        /*
                if (!req.file) {
                    res.status(402).send();
                    return;
                }
        */
        upload.single('files')(req, res, function(err) {
            if (err) {
                // An error occurred when uploading
                console.log(err);
                res.status(402).send();
                return
            }
            console.log(req.file);
            var r = {
                success: 1,
                path: req.file.path
            };
            res.json(r);
            // Everything went fine
        })

        // console.log("upload");
    });

module.exports = router;