(function () {
    'use strict';

    angular.module('haceruido.administracion', ['ngRoute'])

        .controller('AdministracionCtrl', AdministracionCtrl);

    AdministracionCtrl.$inject = ['$scope', 'taOptions', '$location', '$rootScope'];
    function AdministracionCtrl($scope, taOptions, $location, $rootScope) {
        var vm = this;


        vm.titulo = '';
        vm.detalle = '';
        vm.posts = [];
        vm.key = '';
        vm.post = {value: {fecha: new Date()}};

        vm.selectedIndex = -1;

        var rootRef = new Firebase('https://estomehaceruido.firebaseio.com/');
        vm.authData = rootRef.getAuth();

        vm.create = create;
        vm.update = update;
        vm.cancelar = cancelar;
        vm.remove = remove;
        vm.selectPost = selectPost;

        if (vm.authData) {
            var refUser = new Firebase('https://estomehaceruido.firebaseio.com/users/' + vm.authData.uid);
            refUser.on('value', function (childSnapshot, prevChildKey) {
                vm.rol = childSnapshot.val().rol;
                if(vm.rol != 0){
                    $location.path('/main');
                }
            });
        }


        taOptions.toolbar = [
            ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'pre', 'quote'],
            ['bold', 'italics', 'underline', 'strikeThrough', 'ul', 'ol', 'redo', 'undo', 'clear'],
            ['justifyLeft', 'justifyCenter', 'justifyRight', 'indent', 'outdent'],
            ['html', 'insertImage', 'insertLink', 'wordcount', 'charcount']
        ];

        var ref = new Firebase('https://estomehaceruido.firebaseio.com');


        var refFull = new Firebase('https://estomehaceruido.firebaseio.com/posts');
        //refFull.once("value", function (snapshot) {
        //    // The callback function will get called twice, once for "fred" and once for "barney"
        //    vm.posts = [];
        //    snapshot.forEach(function (childSnapshot) {
        //        vm.posts.push({key: childSnapshot.key(), value: childSnapshot.val()});
        //        // key will be "fred" the first time and "barney" the second time
        //        var key = childSnapshot.key();
        //        // childData will be the actual contents of the child
        //        var childData = childSnapshot.val();
        //    });
        //
        //    $scope.$apply();
        //
        //});

        refFull.orderByChild("fecha").on('child_added', function (childSnapshot, prevChildKey) {
            // code to handle new child.
            vm.posts.push({key: childSnapshot.key(), value: childSnapshot.val()});
            console.log('added');
            if (!$scope.$$phase) {
                $scope.$apply();
            }
        });

        refFull.on('child_changed', function (childSnapshot, prevChildKey) {
            // code to handle new child.
            console.log('change');
            if (vm.selectedIndex != -1) {
                vm.posts[vm.selectedIndex].value = childSnapshot.val();
            }
            vm.post = {value: {fecha: new Date()}};
            vm.posts.sort(function (a, b) {
                // Turn your strings into dates, and then subtract them
                // to get a value that is either negative, positive, or zero.
                return new Date(a.value.fecha) - new Date(b.value.fecha);
            });
            if (!$scope.$$phase) {
                $scope.$apply();
            }
        });

        refFull.on('child_removed', function (oldChildSnapshot) {
            // code to handle new child.
            console.log('removed');
            var n = vm.posts.indexOf(vm.post);
            vm.posts.splice(n, 1);
            vm.post = {value: {fecha: new Date()}};
            if (!$scope.$$phase) {
                $scope.$apply();
            }
        });

        function cancelar() {
            vm.post = {value: {fecha: new Date()}};
        }

        function create() {
            console.log('entra');

            if (vm.post.value.titulo == undefined) {
                console.log('entra');
                return;
            }

            if (vm.post.key == undefined || vm.post.key == '') {
                nuevo();
            } else {
                update();
            }
            $rootScope.$broadcast("refreshListMain");
        }

        function nuevo() {
            ref.child("posts").push().set(
                {
                    titulo: vm.post.value.titulo,
                    detalle: vm.post.value.detalle,
                    fecha: -1 * (new Date(vm.post.value.fecha).getTime())
                    //fecha: Firebase.ServerValue.TIMESTAMP,
                }
            );
            //ref.child("posts").child(vm.titulo).set(
            //    {
            //        detalle:vm.detalle
            //    }
            //);
            vm.post = {value: {fecha: new Date()}};
        }

        function update() {
            var refUpdate = new Firebase('https://estomehaceruido.firebaseio.com/posts/' + vm.post.key);
            refUpdate.update(
                {
                    titulo: vm.post.value.titulo,
                    detalle: vm.post.value.detalle,
                    fecha: -1 * (new Date(vm.post.value.fecha).getTime())
                }
            );


            //ref.child("posts").child(vm.titulo).set(
            //    {
            //        detalle:vm.detalle
            //    }
            //);
        }

        function remove(post) {
            var ref = new Firebase('https://estomehaceruido.firebaseio.com/posts/' + post.key);
            ref.remove();

        }

        function selectPost(post) {
            vm.selectedIndex = vm.posts.indexOf(post);
            vm.post = angular.copy(post);
            vm.post.value.fecha = new Date(-1 * vm.post.value.fecha);

        }

    }
})();

