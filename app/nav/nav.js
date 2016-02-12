(function () {
    'use strict';

    angular.module('haceruido.nav', ['ngRoute'])

        .controller('NavCtrl', NavCtrl);

    NavCtrl.$inject = [];
    function NavCtrl() {
        var vm = this;
        var ref = new Firebase('https://estomehaceruido.firebaseio.com');
        var authData = ref.getAuth();
        if (authData) {
            vm.isLogged = true;
        }else{
            vm.isLogged = false;
        }


    }
})();