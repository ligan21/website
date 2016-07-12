/**
 * Created by ligan on 0/05/14.
 */

angular.module('websiteApp.controllers', []).controller('indexController', function($scope, $user, $logout, $window, $popupService) {
    //$accountManager.checkLogin();
    //$scope.logout = function () {
    //  $accountManager.logout();s
    //}
    $scope.checkLogin = function() {
        $user.get(success, error);
    }
    $scope.logout = function() {
        $logout.get(logoutSuccess, logoutError);
    }
    $scope.checkLogin();

    function success(user) {
        $scope.user = user;
    }

    function error(err) {
        $window.location.href = '/login.html';
    }

    function logoutSuccess() {
        $window.location.href = '/login.html';
    }

    function logoutError(err) {
        $popupService.showPopup("退出失败" + err.data + err.message);
    }
}).controller('websitesController', function($scope, $state, $user, $websites, $websiteDetail, $window, $organizations, $popupService) {
    $scope.organizations = $organizations.get({
        page: 1,
        limit: 200
    });
    $scope.query = {
        limit: 10,
        page: 1
    };

    $scope.checkLogin = function() {
        $user.get(loginSuccess, loginError);
    }
    $scope.checkLogin();

    function loginSuccess(user) {
        $scope.user = user;
    }

    function loginError(err) {
        $window.location.href = '/login.html';
    }

    //$scope.websites = websites.websites.get($scope.option);
    $scope.getWebsites = function(query) {
        console.log($scope.organizationName);
        console.log($scope.state);
        if ($scope.organizationName) $scope.query.organizationName = $scope.organizationName;
        if ($scope.state) $scope.query.state = $scope.state;
        if ($scope.startDate) {
            $scope.query.startDate = $scope.startDate;
            $scope.query.endDate = $scope.endDate;
        }
        $scope.promise = $websites.get($scope.query, success).$promise;
    }

    function success(websites) {
        $scope.websites = websites;

    }
    $scope.showUploadSecurityEvaluationReport = function(website) {
        $("#" + website._id + "S").pekeUpload({
            url: "/upload",
            //   showPreview: false,
            //  showFilename: false,
            //  showPercent: false,
            btnText: '<div><i class="material-icons">publish</i>上传文件</div>',
            onFileSuccess: function(file, data) {
                website.id = website._id;
                website.securityEvaluationReportLink = data.path;
                website.securityEvaluationReportState = "已提交";
                website.target = "SER";
                $websiteDetail.information.update(website, successAction, errorAction);
            }

        });
    }
    $scope.showUploadReformReport = function(website) {
        $("#" + website._id + "R").pekeUpload({
            url: "/upload",
            //showPreview: false,
            //showFilename: false,
            //showPercent: false,
            btnText: '<div><i class="material-icons">publish</i>上传文件</div>',
            onFileSuccess: function(file, data) {
                website.id = website._id;
                website.reformReportLink = data.path;
                website.target = "RR";
                website.reformReportState = "已提交";
                $websiteDetail.information.update(website, successAction, errorAction);
            }
        });
    }
    $scope.getWebsites();
    $scope.setWebsite = function(website) {

        $scope.website = website;
    }
    $scope.agreeSER = function(website) {
        //alert(website._id);
        website.id = website._id;
        website.securityEvaluationReportState = "通过";
        website.target = "SER";
        $websiteDetail.information.update(website, successAction, errorAction);
    };
    $scope.refuseSER = function(website) {
        website.id = website._id;
        website.securityEvaluationReportState = "拒绝";
        website.target = "SER";
        $websiteDetail.information.update(website, successAction, errorAction);
    }
    $scope.agreeRR = function(website) {
        website.id = website._id;
        website.reformReportState = "通过";
        website.target = "RR";
        $websiteDetail.information.update(website, successAction, errorAction);
    }
    $scope.refuseRR = function(website) {
        website.id = website._id;
        website.reformReportState = "拒绝";
        website.target = "RR";
        $websiteDetail.information.update(website, successAction, errorAction);
    }

    function successAction() {
        $popupService.showPopup("操作成功");
    }

    function errorAction(err) {
        $popupService.showPopup("操作失败:" + error.data + error.message);
    }
    $scope.search = function() {
        $scope.getWebsites();
    }




}).controller('websiteDetailController', function($scope, $state, $user, $stateParams, $window, $websiteDetail, $popupService, $mdDialog) {
    $scope.query = {
        limit: 10,
        page: 1
    };
    $scope.query._websiteId = $stateParams.id;
    $scope.information = $websiteDetail.information.get({
        id: $stateParams.id
    });
    $scope.getLogs = function() {
        $scope.promise = $websiteDetail.logs.get($scope.query, success).$promise;
    }

    function success(logs) {
        $scope.logs = logs;
    }
    $scope.getLogs();
    $scope.checkLogin = function() {
        $user.get(loginSuccess, loginError);
    }
    $scope.checkLogin();

    function loginSuccess(user) {

        $scope.user = user;
    }

    function loginError(err) {
        $window.location.href = '/login.html';
    }
    $scope.accept = function() {
        $scope.information.id = $scope.information._id;
        $scope.information.target = "WS";
        if ($scope.user.userType == "系统管理员") {
            $scope.information.refuseReason = '';
            $scope.information.state = "通过审核";
        } else if ($scope.user.userType == "部属单位管理员") {
            $scope.information.refuseReason = '';
            $scope.information.ownerId = "1";
            $scope.information.state = "待审核";
        }
        $websiteDetail.information.update($scope.information, successAction, errorAction);
    }
    $scope.refuse = function(ev) {
        var confirm = $mdDialog.prompt()
            .title('提示')
            .textContent('请输入驳回理由.')
            .placeholder('驳回理由')
            .ariaLabel('驳回理由')
            .targetEvent(ev)
            .ok('确定')
            .cancel('取消');
        $mdDialog.show(confirm).then(function(result) {
            $scope.information.refuseReason = result;
            $scope.information.id = $scope.information._id;
            $scope.information.target = "WS";
            if ($scope.user.userType == "系统管理员") {
                //$scope.information.refuseReason;
                $scope.information.state = "驳回申请";
                $scope.information.ownerId = '1';
            } else if ($scope.user.userType == "部属单位管理员") {
                $scope.information.ownerId = '0';
                $scope.information.state = "驳回提交网站";
            }

            $websiteDetail.information.update($scope.information, successAction, errorAction);
        }, function() {
            $scope.information.refuseReason = '';
        });

    }
    $scope.needSecurityEvaluationReport = function(ev) {
        var confirm = $mdDialog.confirm()
            .title('提示')
            .textContent('您确定要求此网站提交安全测评报告？')
            .ariaLabel('Lucky day')
            .targetEvent(ev)
            .ok('确定')
            .cancel('取消');
        $mdDialog.show(confirm).then(function() {
            $scope.information.id = $scope.information._id;
            $scope.information.securityEvaluationReportState = "需要提交";
            $scope.information.target = "SER";
            $websiteDetail.information.update($scope.information, successAction, errorAction);
        }, function() {

        });
    };
    $scope.needReformReport = function(ev) {
        var confirm = $mdDialog.confirm()
            .title('提示')
            .textContent('您确定要求此网站提交整改报告？')
            .ariaLabel('Lucky day')
            .targetEvent(ev)
            .ok('确定')
            .cancel('取消');
        $mdDialog.show(confirm).then(function() {
            $scope.information.id = $scope.information._id;
            $scope.information.reformReportState = "需要提交";
            $scope.information.target = "RR";
            $websiteDetail.information.update($scope.information, successAction, errorAction);
        }, function() {

        });
    };

    function successAction() {
        $popupService.showPopup("操作成功", goState("websites"));
    }

    function errorAction(error) {
        $popupService.showPopup("操作失败:" + error.data + error.message);
    }

    function goState(state) {
        $state.go(state);
    }

}).controller('addWebsiteController', function($scope, $state, $stateParams, $websites, $websiteDetail, $popupService) {
    $scope.information = {};

    $("#uploadAttachment").pekeUpload({
        url: "/upload",
        btnText: '<i class="fa fa-upload" aria-hidden="true"></i>',
        onFileSuccess: function(file, data) {
            $scope.information.attachmentLink = data.path;
        }
    });
    $("#uploadTopology").pekeUpload({
        url: "/upload",

        btnText: '<i class="fa fa-upload" aria-hidden="true"></i>',
        onFileSuccess: function(file, data) {
            $scope.information.topologyLink = data.path;
        }
    });
    $("#uploadKeyProducts").pekeUpload({
        url: "/upload",

        btnText: '<i class="fa fa-upload" aria-hidden="true"></i>',
        onFileSuccess: function(file, data) {
            $scope.information.keyProductsLink = data.path;
        }
    });
    $("#uploadRecoveryPlan").pekeUpload({
        url: "/upload",
        btnText: '<i class="fa fa-upload" aria-hidden="true"></i>',
        onFileSuccess: function(file, data) {
            $scope.information.recoveryPlanLink = data.path;
        }
    });
    $("#uploadGradeProtect").pekeUpload({
        url: "/upload",
        btnText: '<i class="fa fa-upload" aria-hidden="true"></i>',
        onFileSuccess: function(file, data) {
            $scope.information.gradeProtectLink = data.path;
        }
    });
    $("#uploadSecurityEvalustionResult").pekeUpload({
        url: "/upload",
        btnText: '<i class="fa fa-upload" aria-hidden="true"></i>',
        onFileSuccess: function(file, data) {
            $scope.information.securityEvaluationResultLink = data.path;
        }
    });

    $scope.saveWebsite = function() {
        $scope.information.state = "保存网站";
        $websites.save($scope.information, success, error);
    }
    $scope.saveAndsubmitWebsite = function() {
        $scope.information.state = "提交网站";
        $scope.information.ownerId = '1';
        $websites.save($scope.information, success, error);
    }

    function success() {
        $popupService.showPopup("成功添加网站", goState);
    }

    function error(err) {
        $popupService.showPopup("添加网站失败");
    }

    function goState() {
        $state.go('websites');
    }

}).controller("modifyWebsiteController", function($scope, $state, $stateParams, $websiteDetail, $popupService) {
    $scope.information = {};
    $scope.id = $stateParams.id;
    $scope.information = $websiteDetail.information.get({
        "id": $scope.id
    });


    $("#uploadAttachment").pekeUpload({
        url: "/upload",
        btnText: '<i class="fa fa-upload" aria-hidden="true"></i>',
        onFileSuccess: function(file, data) {
            $scope.information.attachmentLink = data.path;
            //alert($scope.information.attachmentLink);

        }
    });

    $("#uploadTopology").pekeUpload({
        url: "/upload",
        btnText: '<i class="fa fa-upload" aria-hidden="true"></i>',
        onFileSuccess: function(file, data) {
            $scope.information.topologyLink = data.path;
            // alert($scope.information.attachmentLink);

        }
    });


    $("#uploadKeyProducts").pekeUpload({
        url: "/upload",
        btnText: '<i class="fa fa-upload" aria-hidden="true"></i>',
        onFileSuccess: function(file, data) {
            $scope.information.keyProductsLink = data.path;

        }
    });

    $("#uploadRecoveryPlan").pekeUpload({
        url: "/upload",
        btnText: '<i class="fa fa-upload" aria-hidden="true"></i>',
        onFileSuccess: function(file, data) {
            $scope.information.recoveryPlanLink = data.path;

        }
    });

    $("#uploadGradeProtect").pekeUpload({
        url: "/upload",
        btnText: '<i class="fa fa-upload" aria-hidden="true"></i>',
        onFileSuccess: function(file, data) {
            $scope.information.gradeProtectLink = data.path;

        }
    });
    $("#uploadSecurityEvalustionResult").pekeUpload({
        url: "/upload",
        btnText: '<i class="fa fa-upload" aria-hidden="true"></i>',
        onFileSuccess: function(file, data) {
            $scope.information.securityEvaluationResultLink = data.path;

        }
    });

    $scope.saveWebsite = function() {
        $scope.information.state = "保存网站";
        $websiteDetail.information.update($scope.information, success, error);
    }
    $scope.saveAndsubmitWebsite = function() {
        $scope.information.state = "提交网站";
        $scope.information.ownerId = '1';
        $scope.information.id = $scope.id;
        //$scope.information.id=
        $websiteDetail.information.update($scope.information, success, error);

    }

    function success() {
        $popupService.showPopup("成功修改网站信息", goState);
    }

    function error(err) {
        $popupService.showPopup("修改网站失败");
    }

    function goState() {
        $state.go('websites');
    }

}).controller('dashboardController', function($scope, $stateParams, $user, $count, $SERcount, $RRcount, $window, $messages, $websites, $logs) {
    $scope.checkLogin = function() {
        $user.get(success, error);
    }
    $scope.checkLogin();

    function success(user) {

        $scope.user = user;
        if ($scope.user.userType == "部属单位网站管理员") $scope.webstate = "驳回申请";
        else $scope.webstate = "待审核";
        $scope.paddingWebsites = $websites.get({
            state: $scope.website,
            page: 1,
            limit: 10
        });
    }

    function error(err) {

        $window.location.href = '/login.html';
    }
    $scope.count = $count.get(); //countSuccess);
    $scope.SERcount = $SERcount.get();
    $scope.RRcount = $RRcount.get();
    /*
        function countSuccess(count) {
            anychart.onDocumentReady(function() {
                // create pie chart with passed data
                chart = anychart.pie3d([
                    ['通过审核', count.acceptWebsiteCount],
                    ['驳回申请', count.refuseWebsiteCount],
                    ['待审核', count.paddingCheckWebsiteCount],
                ]);

                // set container id for the chart
                chart.container('chart');
                // turn on chart animation
                chart.animation(true);
                // set chart title text settings
                chart.title('备案网站占比');

                //set chart radius
                chart.radius('43%');

                // initiate chart drawing
                chart.draw();
            });
        }
    */
    $scope.notifications = $messages.get({
        type: '公告',
        page: 1,
        limit: 10
    });
    $scope.rules = $messages.get({
        type: '规定',
        page: 1,
        limit: 10
    });

    $scope.logs = $logs.get({
        page: 1,
        limit: 10
    });



}).controller('membersController', function($scope, $state, $stateParams, $members, $organizations,$user) {
   $scope.checkLogin = function() {
        $user.get(success, error);
    }
    $scope.checkLogin();

    function success(user) {

        $scope.user = user;
    }

    function error(err) {

        $window.location.href = '/login.html';
    }
    $scope.organizations = $organizations.get({
        page: 1,
        limit: 200
    });
    $scope.query = {
        limit: 10,
        page: 1
    };
    $scope.getMembers = function(query) {
        console.log($scope.organizationName);
        if ($scope.organizationName) $scope.query.organizationName = $scope.organizationName;
        $scope.promise = $members.get($scope.query, success).$promise;
    }

    function success(members) {
        $scope.members = members;
    }
    $scope.getMembers();
    $scope.search = function() {
        console.log($scope);

        $scope.getMembers();
    }


}).controller('memberDetailController', function($scope, $state, $stateParams, $memberDetail,$user) {
    $scope.checkLogin = function() {
        $user.get(success, error);
    }
    $scope.checkLogin();

    function success(user) {
        
        $scope.user = user;
        if ($scope.user.userType == "部属单位管理员") $scope.information.userType = "驳回申请";
    }

    function error(err) {
        
        $window.location.href = '/login.html';
    }
    $scope.query = {
        limit: 10,
        page: 1
    };
    $scope.query._memberId = $stateParams.id;
    $scope.information = $memberDetail.information.get({
        "id": $stateParams.id
    });
    $scope.getLogs = function() {
        $scope.promise = $memberDetail.logs.get($scope.query, success).$promise;
    }

    function success(logs) {
        $scope.logs = logs;
    }
    $scope.getLogs();


}).controller('addMemberController', function($scope, $state, $stateParams, $memberDetail, $popupService, $memberType, $organizations) {
    //$scope.id = $stateParams.id;
    //$scope.information = $memberDetail.informagion.get({"id":$scope.id});
        $scope.checkLogin = function() {
        $user.get(success, error);
    }
    $scope.checkLogin();

    function success(user) {

        $scope.user = user;
        if ($scope.user.userType == "部属单位管理员") $scope.information.userType = "部属单位网站管理员";
    }

    function error(err) {

        $window.location.href = '/login.html';
    }
    $scope.types = $memberType.query();
    $scope.organizations = $organizations.get({
        page: 1,
        limit: 200
    });
    $scope.addMember = function() {
        $memberDetail.information.save($scope.information, success, error);
    }

    function success() {
        $popupService.showPopup("成功添加成员", goState);
    }

    function error(err) {
        $popupService.showPopup("添加成员失败");
    }

    function goState() {
        $state.go('members');
    }
    $scope.enableSetOrganization = true;
    $scope.setOrganization = function() {

        if ($scope.information.userType == "系统部级一般用户" || $scope.information.userType == "安全审核员") {
            $scope.enableSetOrganization = false;
            $scope.information.organizationName = "工信部";
        } else {
            $scope.enableSetOrganization = true;
            $scope.information.organizationName = "";
        }
    }
    $scope.checkUsername = function() {
        if ($scope.information.username == undefined) return;
        query = {
            "username": $scope.information.username
        }
        $memberDetail.information.get(query, function() {
            $scope.duplication = false;
        }, function() {
            $scope.duplication = true;

        });

    }
}).controller("modifyMemberController", function($scope, $state, $stateParams, $memberDetail, $popupService) {
    $scope.id = $stateParams.id;
    $scope.information = $memberDetail.information.get({
        "id": $scope.id
    });
    $scope.modifyMember = function() {
        $scope.information.id = $scope.id;
        $memberDetail.information.update($scope.information, success, err);
    }

    function success() {
        $popupService.showPopup("成功修改成员信息", goState);
    }

    function err(error) {
        $popupService.showPopup("修改成员信息失败:" + error.data + error.message);
    }

    function goState() {
        $state.go('members');
    }
}).controller('organizationsController', function($scope, $state, $stateParams, $organizations) {
    $scope.query = {
        limit: 10,
        page: 1
    };
    $scope.getOrganizations = function(query) {
        $scope.promise = $organizations.get($scope.query, success).$promise;
    }

    function success(organizations) {
        $scope.organizations = organizations;
    }
    $scope.getOrganizations();
}).controller('organizationDetailController', function($scope, $state, $stateParams, $organizationDetail) {
    $scope.id = $stateParams.id;
    $scope.information = $organizationDetail.information.get({
        "id": $scope.id
    });

}).controller('modifyOrganizationController', function($scope, $state, $stateParams, $organizationDetail, $popupService) {
    $scope.id = $stateParams.id;
    $scope.information = $organizationDetail.information.get({
        "id": $scope.id
    });
    $scope.modifyOrganization = function() {
        $scope.information.id = $scope.id;
        $organizationDetail.information.update($scope.information, success, err);
    }

    function success() {
        $popupService.showPopup("成功修改单位信息");
    }

    function err(error) {
        $popupService.showPopup("修改单位信息失败:" + error.data + error.message);
    }

}).controller('messagesController', function($scope, $state, $stateParams, $messages) {
    $scope.query = {
        limit: 10,
        page: 1
    };
    $scope.notificationsQuery = {
        limit: 10,
        page: 1,
        type: "公告"
    };
    $scope.rulesQuery = {
        limit: 10,
        page: 1,
        type: "规定"
    };
    //$scope.websites = websites.websites.get($scope.option);
    $scope.getMessages = function(query) {
        $scope.promise = $messages.get($scope.query, successMessages).$promise;
    }

    function successMessages(messages) {
        $scope.messages = messages;
    }
    $scope.getNotifications = function() {
        $scope.promise = $messages.get($scope.notificationsQuery, successNotifications).$promise;
    }

    function successNotifications(notifications) {
        $scope.notifications = notifications;
    }
    $scope.getRules = function() {
        $scope.promise = $messages.get($scope.rulesQuery, successRules).$promise;
    }

    function successRules(rules) {
        $scope.rules = rules;
    }
    $scope.getMessages();
    $scope.getNotifications({
        type: '通知',
        page: 1,
        limit: 10
    });
    $scope.getRules({
        type: '规定',
        page: 1,
        limit: 10
    });
}).controller('messageDetailController', function($scope, $state, $stateParams, $messageDetail) {
    id = $stateParams.id;
    $scope.information = $messageDetail.information.get({
        "id": id
    });

}).controller('addMessageController', function($scope, $state, $stateParams, $messages, $popupService) {
    $scope.message = {};
    $scope.message.attachment = "";
    $('#summernote').summernote({
        lang: 'zh-CN'
    });
    $("#uploadFile").pekeUpload({
        url: "/upload",
        btnText: '<i class="fa fa-upload" aria-hidden="true">上传附件</i>',
        onFileSuccess: function(file, data) {
            $scope.message.attachment = data.path;
            $popupService.showPopup("成功上传附件");
        }
    });
    $scope.submit = function() {
        $scope.message.content = $('#summernote').summernote('code');
        $messages.save($scope.message, success, error);
    }

    function success() {
        $popupService.showPopup("成功发布公告消息", goState);

    }

    function error(err) {
        $popupService.showPopup("添加消息失败:" + error.data + error.message);
    }

    function goState() {
        $state.go('messages');
    }

}).controller('settingsController', function($scope, $state, $stateParams, $settings, $popupService) {
    $scope.setPassword = function() {
        $settings.update($scope.information, success, error);
    }

    function success() {
        $popupService.showPopup("成功修改密码信息");
    }

    function error(err) {
        $popupService.showPopup("修改成员密码失败" + err.data + err.message);
    }

}).controller('logsController', function($scope, $state, $stateParams, $logs, $organizations, $memberType) {
    $scope.organizations = $organizations.get({
        page: 1,
        limit: 200
    });
    $scope.userTypes = $memberType.query({
        all: "1"
    });
    $scope.query = {
        limit: 10,
        page: 1
    };
    $scope.getLogs = function() {
        if ($scope.organizationName) $scope.query.organizationName = $scope.organizationName;
        if ($scope.userType) $scope.query.userType = $scope.userType;
        $scope.promise = $logs.get($scope.query, success).$promise;
    }

    function success(logs) {
        $scope.logs = logs;
    }
    $scope.getLogs();
    $scope.search = function() {
        $scope.getLogs();
    }
}).controller('chartsController', function($scope, $state, $stateParams, $count, $organizations) {
    $scope.organizations = $organizations.get({
        page: 1,
        limit: 10,
        sort: "count",
    }, successOrganization);

    function successOrganization(organizations) {
        anychart.onDocumentReady(function() {
            // create bar chart
            chart = anychart.bar3d();

            // turn on chart animation
            chart.animation(true);
            var color = ['rgb(146, 202, 248)', 'rgb(247, 210, 92)', 'rgb(226, 102, 0)', 'rgb(25, 118, 210)', 'rgb(91, 170, 255)', 'rgb(116, 215, 147)', 'rgb(22, 135, 255)', 'rgb(255, 127, 191)', 'rgb(205, 241, 217)', 'rgb(176, 232, 194)', 'rgb(146, 224, 170)'];
            // set container id for the chart
            chart.container('chart');
            chart.padding([10, 40, 5, 20]);
            // create area series with passed data
            /*
                        var series = chart.bar([
                            ['Eyeshadows', '249980'],
                            ['Eyeliner', '213210'],
                            ['Eyebrow pencil', '170670'],
                            ['Nail polish', '143760'],
                            ['Pomade', '128000'],
                            ['Lip gloss', '110430'],
                            ['Mascara', '102610'],
                            ['Foundation', '94190'],
                            ['Rouge', '80540'],
                             ['Powder', '53540']
                        ]);*/
            // set chart title text settings
            var data = [];
            chart.title('Top 10 单位网站数');
            for (var i = 0, l = organizations.docs.length; i < l; i++) {
                //data[i] = [organizations.docs[i].name, organizations.docs[i].count];
                data[i] = {
                    x: organizations.docs[i].name,
                    value: organizations.docs[i].count,
                    fill: color[i]
                };
            }
            var series = chart.bar(data);
            // set tooltip formatter
            series.tooltip().titleFormatter(function() {
                return this.x
            });
            series.tooltip().textFormatter(function() {
                return parseInt(this.value).toLocaleString();
            });
            series.tooltip().position('right').anchor('left').offsetX(5).offsetY(0);

            // set yAxis labels formatter
            chart.yAxis().labels().textFormatter(function() {
                return this.value.toLocaleString();
            });

            // set titles for axises
            chart.xAxis().title('单位');
            chart.yAxis().title('网站数');
            chart.interactivity().hoverMode('byX');
            chart.tooltip().positionMode('point');
            // set scale minimum
            chart.yScale().minimum(0);

            // initiate chart drawing
            chart.draw();
        });
    }
});
