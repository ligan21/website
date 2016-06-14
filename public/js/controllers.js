/**
 * Created by ligan on 0/05/14.
 */

angular.module('websiteApp.controllers', []).controller('indexController', function ($scope, $user, $logout, $window, $popupService) {
  //$accountManager.checkLogin();
  //$scope.logout = function () {
  //  $accountManager.logout();
  //}
  $scope.checkLogin = function () {
    $user.get(success, error);
  }
  $scope.logout = function () {
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
}).controller('websitesController', function ($scope, $state, $user, $websites, $websiteDetail, $organizations, $popupService) {
  $scope.organizations = $organizations.get({ page: 1, limit: 200 });
  $scope.query = {
    limit: 10,
    page: 1
  };

  $scope.checkLogin = function () {
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
  $scope.getWebsites = function (query) {
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
  $scope.showUploadSecurityEvalustionReport = function (website) {
    $("#" + website._id + "S").pekeUpload({
      url: "/upload",
      btnText: '<i class="material-icons">publish</i>',
      onFileSuccess: function (file, data) {
        website.id = website._id;
        website.securityEvalustionReportLink = data.path;
        website.securityEvalustionState = "已提交";
        $websiteDetail.information.update(website, successAction, errorAction);
      }

    });
  }
  $scope.showUploadReformReport = function (website) {
    $("#" + website._id + "R").pekeUpload({
      url: "/upload",
      btnText: '<i class="material-icons">publish</i>',
      onFileSuccess: function (file, data) {
        website.id = website._id;
        website.reformReportLink = data.path;
        website.reformState = "已提交";
        $websiteDetail.information.update(website, successAction, errorAction);
      }
    });
  }
  $scope.getWebsites();
  $scope.setWebsite = function (website) {
    alert(website);
    $scope.website = website;
  }
  $scope.agreeSER = function (website) {
    //alert(website._id);
    website.id = website._id;
    website.securityEvalustionReportState = "通过";
    $websiteDetail.information.update(website, successAction, errAction);
  };
  $scope.refuseSER = function (website) {
    website.id = website._id;
    website.securityEvalustionReportState = "拒绝";
    $websiteDetail.information.update(website, successAction, errAction);
  }
  $scope.agreeRR = function (website) {
    website.id = website._id;
    website.reformReportState = "通过";
    $websiteDetail.information.update(website, successAction, errorAction);
  }
  $scope.refuseRR = function (website) {
    website.id = website._id;
    website.reformReportState = "拒绝";
    $websiteDetail.information.update(website, successAction, errorAction);
  }
  function successAction() {
    $popupService.showPopup("操作成功");
  }
  function errorAction(err) {
    $popupService.showPopup("操作失败:" + error.data + error.message);
  }
  $scope.search = function () {
    $scope.getWebsites();
  }




}).controller('websiteDetailController', function ($scope, $state, $user, $stateParams, $websiteDetail, $popupService, $mdDialog) {
  $scope.query = {
    limit: 10,
    page: 1
  };
  $scope.query._websiteId = $stateParams.id;
  $scope.information = $websiteDetail.information.get({ id: $stateParams.id });
  $scope.getLogs = function () {
    $scope.promise = $websiteDetail.logs.get($scope.query, success).$promise;
  }
  function success(logs) {
    $scope.logs = logs;
  }
  $scope.getLogs();
  $scope.accept = function () {
    $scope.information.id = $scope.information._id;
    if ($user.user.userType == "系统管理员") {
      $scope.information.refuseReason = '';
      $scope.information.state = "通过审核";
    }
    else if ($user.user.userType == "部属单位管理员") {
      $scope.information.refuseReason = '';
      $scope.information.state = "待审核";
    }
    $websiteDetail.information.update($scope.information, $popupService.showPopup("通过网站审核"), $popupService.showPopup("通过网站审核失败"));
  }
  $scope.refuse = function (ev) {
    var confirm = $mdDialog.prompt()
      .title('提示')
      .textContent('请输入驳回理由.')
      .placeholder('驳回理由')
      .ariaLabel('驳回理由')
      .targetEvent(ev)
      .ok('确定')
      .cancel('取消');
    $mdDialog.show(confirm).then(function (result) {
      $scope.information.refuseReason = result;
      $scope.information.id = $scope.information._id;
      if ($user.user.userType == "系统管理员") {
        //$scope.information.refuseReason;
        $scope.information.state = "驳回申请";
        $scope.information.ownerId = '1';
      }
      else if ($user.user.userType == "部属单位管理员") {
        $scope.information.state = "驳回提交网站";
      }

      $websiteDetail.information.update($scope.information, $popupService.showPopup("拒绝网站审核"), $popupService.showPopup("拒绝网站审核失败"));
    }, function () {
      $scope.information.refuseReason = '';
    });

  }
  $scope.needSecurityEvalustionReport = function (ev) {
    var confirm = $mdDialog.confirm()
      .title('提示')
      .textContent('您确定要求此网站提交安全测评报告？')
      .ariaLabel('Lucky day')
      .targetEvent(ev)
      .ok('确定')
      .cancel('取消');
    $mdDialog.show(confirm).then(function () {
      $scope.information.id = $scope.information._id;
      $scope.informationSecurityEvalustionReportState = "需要提交";
      $websiteDetail.information.update($scope.information, successAction, errorAction);
    }, function () {

    });
  };
  $scope.needReformReport = function (ev) {
    var confirm = $mdDialog.confirm()
      .title('提示')
      .textContent('您确定要求此网站提交整改报告？')
      .ariaLabel('Lucky day')
      .targetEvent(ev)
      .ok('确定')
      .cancel('取消');
    $mdDialog.show(confirm).then(function () {
      $scope.information.id = $scope.information._id;
      $scope.informationReformReportState = "需要提交";
      $websiteDetail.information.update($scope.information, successAction, errorAction);
    }, function () {

    });
  };
  function successAction() {
    $popupService.showPopup("操作成功");
  }
  function errorAction(err) {
    $popupService.showPopup("操作失败:" + error.data + error.message);
  }


}).controller('addWebsiteController', function ($scope, $state, $stateParams, $websiteDetail, $popupService) {
  $scope.information = {};

  $("#uploadAttachment").pekeUpload({
    url: "/upload",
    btnText: '<i class="fa fa-upload" aria-hidden="true"></i>',
    onFileSuccess: function (file, data) { $scope.information.attachmentLink = data.path; }
  });
  $("#uploadTopology").pekeUpload({
    url: "/upload",
    btnText: '<i class="fa fa-upload" aria-hidden="true"></i>',
    onFileSuccess: function (file, data) { $scope.information.topologyLink = data.path; }
  });
  $("#uploadKeyProducts").pekeUpload({
    url: "/upload",
    btnText: '<i class="fa fa-upload" aria-hidden="true"></i>',
    onFileSuccess: function (file, data) { $scope.information.keyProductsLink = data.path; }
  });
  $("#uploadRecoveryPlan").pekeUpload({
    url: "/upload",
    btnText: '<i class="fa fa-upload" aria-hidden="true"></i>',
    onFileSuccess: function (file, data) { $scope.information.recoveryPlanLink = data.path; }
  });
  $("#uploadGradeProtect").pekeUpload({
    url: "/upload",
    btnText: '<i class="fa fa-upload" aria-hidden="true"></i>',
    onFileSuccess: function (file, data) { $scope.information.gradeProtectLink = data.path; }
  });
  $("#uploadSecurityEvalustionResult").pekeUpload({
    url: "/upload",
    btnText: '<i class="fa fa-upload" aria-hidden="true"></i>',
    onFileSuccess: function (file, data) { $scope.information.securityEvaluationResultLink = data.path; }
  });

  $scope.save = function () {
    $scope.information.state = "保存网站";
    $websiteDetail.information.save($scope.information, $popupService.showPopup("成功添加网站"), $popupService.showPopup("添加网站失败"));

  }
  $scope.saveAndsubmit = function () {
    $scope.information.state = "提交网站";
    $scope.information.ownerId = '1';
    $websiteDetail.information.save($scope.information, $popupService.showPopup("成功添加网站"), $popupService.showPopup("添加网站失败"));
  }

}).controller('dashboardController', function ($scope, $stateParams, $count, $messages, $websites, $logs) {
  $scope.count = $count.get();
  $scope.notifications = $messages.get({ type: '通知', page: 1, limit: 10 });
  $scope.rules = $messages.get({ type: '规定', page: 1, limit: 10 });
  $scope.paddingWebsites = $websites.get({ state: '待审核', page: 1, limit: 10 });
  $scope.logs = $logs.get({ page: 1, limit: 10 });

}).controller('membersController', function ($scope, $state, $stateParams, $members, $organizations) {
  $scope.organizations = $organizations.get({ page: 1, limit: 200 });
  $scope.query = {
    limit: 10,
    page: 1
  };
  $scope.getMembers = function (query) {
    if ($scope.organizationName) $scope.query.organizationName = $scope.organizationName;
    $scope.promise = $members.get($scope.query, success).$promise;
  }
  function success(members) {
    $scope.members = members;
  }
  $scope.getMembers();
  $scope.search = function () {
    $scope.getMembers();
  }


}).controller('memberDetailController', function ($scope, $state, $stateParams, $memberDetail) {
  $scope.query = {
    limit: 10,
    page: 1
  };
  $scope.query._memberId = $stateParams.id;
  $scope.information = $memberDetail.information.get({ "id": $stateParams.id });
  $scope.getLogs = function () {
    $scope.promise = $memberDetail.logs.get($scope.query, success).$promise;
  }
  function success(logs) {
    $scope.logs = logs;
  }
  $scope.getLogs();


}).controller('addMemberController', function ($scope, $state, $stateParams, $memberDetail, $popupService, $memberType, $organizations) {
  //$scope.id = $stateParams.id;
  //$scope.information = $memberDetail.informagion.get({"id":$scope.id});
  $scope.types = $memberType.query();
  $scope.organizations = $organizations.get({ page: 1, limit: 200 });
  $scope.addMember = function () {
    $memberDetail.information.save($scope.information, success, err);
  }
  function success() {
    $popupService.showPopup("成功添加成员");
  }
  function error(err) {
    $popupService.showPopup("添加成员失败:" + error.data + error.message);
  }
}).controller("modifyMemberController", function ($scope, $state, $stateParams, $memberDetail, $popupService) {
  $scope.id = $stateParams.id;
  $scope.information = $memberDetail.information.get({ "id": $scope.id });
  $scope.modifyMember = function () {
    $scope.information.id = $scope.id;
    $memberDetail.information.update($scope.information, success, err);
  }
  function success() {
    $popupService.showPopup("成功修改成员信息");
  }
  function err(error) {
    $popupService.showPopup("修改成员信息失败:" + error.data + error.message);
  }
}).controller('organizationsController', function ($scope, $state, $stateParams, $organizations) {
  $scope.query = {
    limit: 10,
    page: 1
  };
  $scope.getOrganizations = function (query) {
    $scope.promise = $organizations.get($scope.query, success).$promise;
  }
  function success(organizations) {
    $scope.organizations = organizations;
  }
  $scope.getOrganizations();
}).controller('organizationDetailController', function ($scope, $state, $stateParams, $organizationDetail) {
  $scope.id = $stateParams.id;
  $scope.information = $organizationDetail.information.get({ "id": $scope.id });

}).controller('modifyOrganizationController', function ($scope, $state, $stateParams, $organizationDetail) {
  $scope.id = $stateParams.id;
  $scope.information = $organizationDetail.information.get({ "id": $scope.id });

}).controller('messagesController', function ($scope, $state, $stateParams, $messages) {
  $scope.query = {
    limit: 10,
    page: 1
  };

  //$scope.websites = websites.websites.get($scope.option);
  $scope.getMessages = function (query) {
    $scope.promise = $messages.get($scope.query, successMessages).$promise;
  }
  function successMessages(messages) {
    $scope.messages = messages;
  }
  $scope.getNotifications = function () {
    var query = $scope.query;
    query.type = "通知";
    $scope.promise = $messages.get(query, successNotifications).$promise;
  }
  function successNotifications(notifications) {
    $scope.notifications = notifications;
  }
  $scope.getRules = function () {
    var query = $scope.query;
    query.type = "规定";
    $scope.promise = $messages.get(query, successRules).$promise;
  }
  function successRules(rules) {
    $scope.rules = rules;
  }
  $scope.getMessages();
  $scope.getNotifications({ type: '通知', page: 1, limit: 10 });
  $scope.getRules({ type: '规定', page: 1, limit: 10 });
}).controller('messageDetailController', function ($scope, $state, $stateParams, $messageDetail) {
  id = $stateParams.id;
  $scope.information = $messageDetail.information.get({ "id": id });
}).controller('addMessageController', function ($scope, $state, $stateParams, $messages, $popupService) {

  $('#summernote').summernote({ lang: 'zh-CN' });
  $("#uploadFile").pekeUpload({
    url: "/upload",
    btnText: '<i class="fa fa-upload" aria-hidden="true"></i>',
    onFileSuccess: function (file, data) {
      $scope.message.attachment = data.path;
      $popupService.showPopup("成功上传附件");
    }
  });
  $scope.submit = function () {
    $scope.content = $('#summernote').summernote('code');
    $messages.save($scope.message, success, error);
  }
  function success() {
    $popupService.showPopup("成功添加成员消息");
  }
  function error(err) {
    $popupService.showPopup("添加消息失败:" + error.data + error.message);
  }

}).controller('settingsController', function ($scope, $state, $stateParams, $settings, $popupService) {
  $scope.setPassword = function () {
    $settings.update($scope.information, success, error);
  }
  function success() {
    $popupService.showPopup("成功修改密码信息");
  }
  function error(err) {
    $popupService.showPopup("修改成员密码失败" + err.data + err.message);
  }

}).controller('logsController', function ($scope, $state, $stateParams, $logs, $organizations, $memberType) {
  $scope.organizations = $organizations.get({ page: 1, limit: 200 });
  $scope.userTypes = $memberType.query();
  $scope.query = {
    limit: 10,
    page: 1
  };
  $scope.getLogs = function () {
    if ($scope.organizationName) $scope.query.organizationName = $scope.organizationName;
    if ($scope.userType) $scope.query.userType = $scope.userType;
    $scope.promise = $logs.get($scope.query, success).$promise;
  }
  function success(logs) {
    $scope.logs = logs;
  }
  $scope.getLogs();
  $scope.search = function () {
    $scope.getLogs();
  }
}).controller('chartsController', function ($scope, $state, $stateParams, $count) {

  $count.get(success, function () { })
  function success(count) {
    var ctx = document.getElementById("websiteAgreeChart");
    

    var data = {
      labels: [
        "通过审核",
        "驳回申请",
        "待审核"
      ],
      datasets: [
        {
          data: [count.agreeCount, count.refuseCount, count.paddingCheckCount],
         
          backgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56"
          ],
          hoverBackgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56"
          ]
        }]
    };
    var myPieChart = new Chart(ctx, {
      type: 'pie',
      data: data
    });
  }

});