/**
 * Created by ligan on 01/06/16.
 */

angular.module('websiteApp.services', []).factory('$count', function ($resource) {
  return $resource('/count')

}).factory('$websites', function ($resource) {
  return $resource('/websites')
}).factory('$websiteDetail', function ($resource) {
  return {
    information: $resource('/websites/:id', { id: '@id' }, {
      'save': { method: 'POST' },
      'update': { method: 'PUT' }
    }),
    logs: $resource('/logs')
  }
}).factory('$members', function ($resource) {
  return $resource('/members')

}).factory('$memberDetail', function ($resource) {
  return {
    information: $resource('/members/:id', { id: '@id' }, {
      'save': { method: 'POST' },
      'update': { method: 'PUT' }
    }),
    logs: $resource('/logs')
  }
}).factory('$organizations', function ($resource) {
  return $resource('/organizations')

}).factory('$organizationDetail', function ($resource) {
  return {
    information: $resource('/organizations/:id', { id: '@id' }, {
      'save': { method: 'POST' },
      'update': { method: 'PUT' }
    })
  }
}).factory('$messages', function ($resource) {
  return $resource('/messages')

}).factory("$messageDetail", function ($resource) {
  return {
    information: $resource('/messages/:id', { id: '@id' }, {
      'save': { method: 'POST' },
      'update': { method: 'PUT' }
    })
  }
}).factory("$logs", function ($resource) {
  return $resource('/logs')

}).factory("$logsDetail", function ($resource) {
  return $resource('/logs/:id', { id: '@id' })

}).factory("$memberType", function ($resource) {
  return $resource('/memberType');
}).factory("$organizationType", function ($resource) {
  return $resorce('/organizationType');
}).factory("$settings", function ($resource) {
  return $resource('/users/setting',{}, {
    'save': { method: 'POST' },
    'update': { method: 'PUT' }
  })

}).factory('$logout',function($resource){
  return $resource('/users/logout');
}).factory('$user',function($resource){
  return  $resource('/users/user');
}).service('$popupService', function ($window, $mdDialog) {
  this.showPopup = function (message) {

    $mdDialog.show(
      $mdDialog.alert()
        .clickOutsideToClose(true)
        .title('网站备案管理系统')
        .textContent(message)
        .ariaLabel('Alert Dialog Demo')
        .ok('确定')
    );
  }
}).service('$accountManager', function ($scope, $user, $logout, $window, $popupService) {
  this.checkLogin = function () {
    $user.get(success, error);
  }
  this.logout = function () {
    $logout.get(logoutSuccess, logoutError);
  }

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
});