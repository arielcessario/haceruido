(function () {
    'use strict';

    angular.module('haceruido.detalle', ['ngRoute'])

        .controller('DetalleCtrl', DetalleCtrl);
    DetalleCtrl.$inject = ['$routeParams', 'taOptions', '$location', '$scope'];
    function DetalleCtrl($routeParams, taOptions, $location, $scope) {
        var vm = this;
        vm.comentar = comentar;
        vm.comentario = '';
        vm.id = $routeParams.id;

        var ref = new Firebase('https://estomehaceruido.firebaseio.com/posts/' + vm.id);


        taOptions.toolbar = [
            ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'pre', 'quote'],
            ['bold', 'italics', 'underline', 'strikeThrough', 'ul', 'ol', 'redo', 'undo', 'clear'],
            ['justifyLeft', 'justifyCenter', 'justifyRight', 'indent', 'outdent']
        ];


        ref.on("value", function (childSnapshot) {
            vm.post = {key: childSnapshot.key(), value: childSnapshot.val()};
            console.log(vm.post);
            if(!$scope.$$phase) {
                $scope.$apply();
            }
        });

        function comentar(authData) {
            if(!ref.getAuth()){
                $location.path('/login');
                return;
            }

            var email = getEmail(authData);
            var nombre = getName(authData);
            ref.child("comentarios").push().set(
                {
                    comentario: vm.comentario,
                    fecha: Firebase.ServerValue.TIMESTAMP,
                    nombre: nombre,
                    email: email
                }
            );

        }


        function getEmail(authData) {
            switch(authData.provider) {
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
            switch(authData.provider) {
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

    }
})();

