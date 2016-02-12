(function () {
    'use strict';

    angular.module('haceruido.registro', ['ngRoute'])

        .config(['$routeProvider', function ($routeProvider) {
            $routeProvider.when('/registro', {
                templateUrl: 'registro/registro.html',
                controller: 'RegistroCtrl'
            });
        }])

        .controller('RegistroCtrl', RegistroCtrl);

    RegistroCtrl.$inject = [];
    function RegistroCtrl() {
        var registroRef = new Firebase('https://estomehaceruido.firebaseio.com');
        var vm = this;
        vm.email = '';
        vm.password = '';
        vm.nombre = '';
        //angular.element('#password').focus();
        vm.createUser = createUser;

        function createUser() {

// find a suitable name based on the meta info given by each provider


            //console.log('entra');
            var userRef = registroRef.child('users');

            userRef.createUser({
                email    : vm.email,
                password : vm.password
            }, function(error, userData) {
                if (error) {
                    console.log("Error creating user:", error);
                } else {
                    console.log("Successfully created user account with uid:", userData.uid);
                }
            });

            //var algo = {vm.email:{}};
            //userRef.set({
            //    algo: {
            //        email: vm.email,
            //        password: vm.password
            //    }
            //})
        }

    }
})();

