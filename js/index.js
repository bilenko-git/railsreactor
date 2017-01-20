var myApp = angular.module('MyTabs', ['ngRoute']);

myApp.config(function($routeProvider) {      
    $routeProvider
        .when('/', {
            templateUrl: 'templates/tab.html',
            controller: 'MyTabs',
            redirectTo: '/tab/1'
        })
        .when('/tab/:num', {
            templateUrl: 'templates/tab.html',
            controller: 'MyTabs'
        })
        .otherwise({ redirectTo: "/" });
});

myApp.service('fieldService', function() {
    var self = this;
    this.fields = {};

    this.add_field_in_object = function(obj_field) {
        var index = Object.keys(obj_field);
        self.fields[index] = obj_field[index];
    }
});

myApp.service('http', function($http, $q) {
    var API = {};

    API.getCountries= function() {
        return $http({
            url: './countries.json'
        })
        .then(function successCallback(response) {
            return response.data;
        }, function errorCallback(response) {
            throw('error');
        });
    },
    API.saveUser = function(data) {
        console.log(data);
    }; 

    return API;
});

myApp.controller('MyTabs', function($scope, $routeParams, fieldService, http) {
    var messageError = "You have empty profile fields that are required to be filled in";
    $scope.active = 'tab_'+$routeParams.num;
    $scope.form = fieldService.fields;

    http.getCountries().then(function(countries) {
        $scope.countries = countries;
    });
    
    $scope.$on("$routeChangeStart", function(event) {
        if(!$scope.theForm.$valid) {
            alert(messageError);
            event.preventDefault();
        }
    });

    $scope.add_field = function(object) {
        fieldService.add_field_in_object(object);
        $scope.form.country_name = $scope.countries[$scope.form.country];
    };                                                                                                                                          

    $scope.$watch('form', function() {
        fieldService.fields = $scope.form;
    });

    $scope.onSubmit = function(event) {
        if(!$scope.theForm.$valid) {
            alert(messageError);
            return false;
        } else {
            http.saveUser($scope.form);
        }
    }

    $scope.resetForm = function() {
         $scope.form = {};
    }
});



