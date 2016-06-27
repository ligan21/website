/**
 * Created by Sandeep on 01/06/14.
 */


angular.module('websiteApp', ['ngMaterial', 'ngMessages', 'md.data.table', 'ui.router', 'ngResource', 'websiteApp.controllers', 'websiteApp.services']).controller('AppCtrl', function($scope) {});


angular.module('websiteApp').config(function($httpProvider) {
    $httpProvider.defaults.withCredentials = true;
    //rest of route code
}).config(function($stateProvider, $httpProvider) {
    $stateProvider.state('home', {
        url: '/home',
        templateUrl: 'partials/dashboard.html',
        controller: 'dashboardController'
    }).state('websites', {
        url: '/websites',
        templateUrl: 'partials/websites.html',
        controller: 'websitesController'
    }).state('websiteDetail', {
        url: '/websiteDetail?id',
        templateUrl: 'partials/websiteDetail.html',
        controller: 'websiteDetailController'
    }).state('modifyWebsite', {
        url: '/modifyWebsite?id',
        templateUrl: 'partials/website-modify.html',
        controller: 'modifyWebsiteController'
    }).state('addWebsite', {
        url: '/addWebsite',
        templateUrl: 'partials/website-add.html',
        controller: 'addWebsiteController'
    }).state('members', {
        url: '/members',
        templateUrl: 'partials/members.html',
        controller: 'membersController'
    }).state('memberDetail', {
        url: '/memberDetail?id',
        templateUrl: 'partials/memberDetail.html',
        controller: 'memberDetailController'
    }).state('addMember', {
        url: '/addMember',
        templateUrl: 'partials/member-add.html',
        controller: 'addMemberController'
    }).state('modifyMember', {
        url: '/modifyMember?id',
        templateUrl: 'partials/member-modify.html',
        controller: 'modifyMemberController'
    }).state('organizations', {
        url: '/organizations',
        templateUrl: 'partials/organizations.html',
        controller: 'organizationsController'
    }).state('organizationDetail', {

        url: '/organizationDetail?id',
        templateUrl: 'partials/organizationDetail.html',
        controller: 'organizationDetailController'
    }).state('modifyOrganization', {
        url: '/modifyOrganization?id',
        templateUrl: 'partials/organization-modify.html',
        controller: 'modifyOrganizationController'
    }).state('messages', {
        url: '/messages',
        templateUrl: 'partials/messages.html',
        controller: 'messagesController'
    }).state('messageDetail', {
        url: '/messageDetail?id',
        templateUrl: 'partials/messageDetail.html',
        controller: 'messageDetailController'
    }).state('addMessage', {
        url: '/addMessage',
        templateUrl: 'partials/message-add.html',
        controller: 'addMessageController'
    }).state('logs', {
        url: '/logs',
        templateUrl: 'partials/logs.html',
        controller: 'logsController'
    }).state('settings', {
        url: '/settings',
        templateUrl: 'partials/settings.html',
        controller: 'settingsController'
    }).state('charts', {
        url: '/charts',
        templateUrl: 'partials/charts.html',
        controller: 'chartsController'
    })
}).run(function($state) {
    $state.go('home');
});