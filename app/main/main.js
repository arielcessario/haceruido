(function () {

    'use strict';

    angular.module('haceruido.main', ['ngRoute'])

        .controller('MainCtrl', MainCtrl);

    MainCtrl.$inject = ['$scope', '$location'];
    function MainCtrl($scope, $location) {

        var vm = this;
        vm.posts = [];
        vm.ver = ver;
        //var refFull = new Firebase('https://estomehaceruido.firebaseio.com/posts');

        //refFull.on('value', function (childSnapshot, prevChildKey) {
        //    // code to handle new child.
        //    vm.posts.push({key: childSnapshot.key(), value: childSnapshot.val()});
        //
        //    if (!$scope.$$phase) {
        //        $scope.$apply();
        //    }
        //});

        function ver(id) {
            $location.path('detalle/' + id);
        }


    }
})();
