(function () {
    'use strict';

    angular.module('haceruido.nav', ['ngRoute'])

        .controller('NavCtrl', NavCtrl);

    NavCtrl.$inject = ['$scope'];
    function NavCtrl($scope) {
        var vm = this;
        var ref = new Firebase('https://estomehaceruido.firebaseio.com');

        $scope.$watch('appCtrl.menu_mobile_open', function(){
            vm.isLogged = ref.getAuth();
        });


    }
})();