(function () {
    'use strict';

    angular.module('haceruido.login', ['ngRoute'])

        .controller('LoginCtrl', LoginCtrl);

    LoginCtrl.$inject = ['$location', '$scope'];
    function LoginCtrl($location, $scope) {
        var vm = this;
        vm.email = '';
        vm.password = '';
        vm.nombre = '';
        //angular.element('#password').focus();


        vm.login = login;
        vm.loginFacebook = loginFacebook;
        vm.loginGoogle = loginGoogle;


        var ref = new Firebase('https://estomehaceruido.firebaseio.com');


        function authHandler(error, authData) {
            if (error) {
                console.log("Login Failed!", error);
            } else {
                console.log("Authenticated successfully with payload:", authData);
            }
        }

        function login() {
            ref.authWithPassword({
                email: vm.email,
                password: vm.password
            }, authHandler);
        }

        function loginFacebook() {
            ref.authWithOAuthPopup("facebook", authHandler, {scope: 'email'});
            //ref.authWithOAuthRedirect("facebook", authHandler);
        }

        function loginGoogle() {
            ref.authWithOAuthPopup("google", authHandler, {scope: 'email'});
            //ref.authWithOAuthRedirect("google", authHandler);
        }

        ref.onAuth(function (authData) {

            if (authData) {
                var userRef = new Firebase('https://estomehaceruido.firebaseio.com/users/' + authData.uid);
                userRef.once("value", function (snapshot) {
                    var exist = snapshot.exists();

                    if (!exist) {
                        // save the user's profile into the database so we can list users,
                        // use them in Security and Firebase Rules, and show profiles
                        ref.child("users").child(authData.uid).set({
                            provider: authData.provider,
                            name: getName(authData),
                            email: getEmail(authData),
                            rol: 1
                        });
                    }
                    $location.path('/main');
                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }
                });
            }
        });
        function getEmail(authData) {
            switch (authData.provider) {
                case 'password':
                    return authData.password.email;
                case 'twitter':
                    return authData.twitter.displayName;
                case 'facebook':
                    return authData.facebook.email;
                case 'google':
                    return authData.google.email;
            }
        }

        function getName(authData) {
            switch (authData.provider) {
                case 'password':
                    return authData.password.email.replace(/@.*/, '');
                case 'twitter':
                    return authData.twitter.displayName;
                case 'facebook':
                    return authData.facebook.displayName;
                case 'google':
                    return authData.google.displayName;
            }
        }

    };
})();