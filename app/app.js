(function () {
    'use strict';

// Declare app level module which depends on views, and components
    angular.module('haceruido', ['oc.lazyLoad',
        'ngRoute',
        'textAngular',
        'duScroll',
        'acUtils',
        'acAnimate',
        'haceruido.nav'
    ]).config(['$routeProvider', function ($routeProvider) {


            $routeProvider.otherwise({redirectTo: '/main'});

            $routeProvider.when('/main', {
                templateUrl: 'main/main.html',
                controller: 'MainCtrl',
                data: {requiresLogin: false},
                resolve: { // Any property in resolve should return a promise and is executed before the view is loaded
                    loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                        // you can lazy load files for an existing module
                        return $ocLazyLoad.load('main/main.js');
                    }]
                }
            });

            $routeProvider.when('/login', {
                templateUrl: 'login/login.html',
                controller: 'LoginCtrl',
                data: {requiresLogin: false},
                resolve: { // Any property in resolve should return a promise and is executed before the view is loaded
                    loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                        // you can lazy load files for an existing module
                        return $ocLazyLoad.load('login/login.js');
                    }]
                }
            });

            $routeProvider.when('/registro', {
                templateUrl: 'registro/registro.html',
                controller: 'RegistroCtrl',
                data: {requiresLogin: false},
                resolve: { // Any property in resolve should return a promise and is executed before the view is loaded
                    loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                        // you can lazy load files for an existing module
                        return $ocLazyLoad.load('registro/registro.js');
                    }]
                }
            });


            $routeProvider.when('/detalle/:id', {
                templateUrl: 'detalle/detalle.html',
                controller: 'DetalleCtrl',
                data: {requiresLogin: false},
                resolve: { // Any property in resolve should return a promise and is executed before the view is loaded
                    loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                        // you can lazy load files for an existing module
                        return $ocLazyLoad.load('detalle/detalle.js');
                    }]
                }
            });

            $routeProvider.when('/administracion', {
                templateUrl: 'administracion/administracion.html',
                controller: 'AdministracionCtrl',
                data: {requiresLogin: true},
                resolve: { // Any property in resolve should return a promise and is executed before the view is loaded
                    loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                        // you can lazy load files for an existing module
                        return $ocLazyLoad.load('administracion/administracion.js');
                    }]
                }
            });

        }])
        .run(function ($rootScope, $location) {
            // Para activar la seguridad en una vista, agregar data:{requiresLogin:false} dentro de $routeProvider.when */


            $rootScope.$on('$routeChangeStart', function (e, to) {
                var ref = new Firebase('https://estomehaceruido.firebaseio.com/');
                var authData = ref.getAuth();


                if (to && to.data && to.data.requiresLogin) {
                    if (!authData) {
                        e.preventDefault();
                        $location.path('/login');
                    } else {
                        if (to.originalPath == '/administracion') {

                            //console.log(authData);
                        }
                        //if (to.originalPath == '/login') {
                        //
                        //    $location.path('/main');
                        //    console.log(authData);
                        //}
                    }
                }
            });
        })
        .controller('AppController', AppController);

    AppController.$inject = ['$location', '$window', '$scope', '$document', '$rootScope'];
    function AppController($location, $window, $scope, $document, $rootScope) {
        var rootRef = new Firebase('https://estomehaceruido.firebaseio.com/');

        var vm = this;
        vm.lista = false;
        vm.logout = logout;
        vm.goTo = goTo;
        vm.scrollTo = scrollTo;
        vm.showLista = showLista;
        vm.filtro = '';
        vm.authData = rootRef.getAuth();
        vm.offTop = false;
        vm.posts = [];
        vm.rol = 1;

        if (vm.authData) {
            var refUser = new Firebase('https://estomehaceruido.firebaseio.com/users/' + vm.authData.uid);
            refUser.on('value', function (childSnapshot, prevChildKey) {
                vm.rol = childSnapshot.val().rol;
            });
        }

        function showLista(val) {
            vm.lista = val;

            if (val) {
                porc = ($window.scrollY * 100) / $document[0].body.scrollHeight;
                console.log(porc);

                if (porc > 30) {
                    addPostInfinite();
                }
            }
        }

        function goTo(path) {


            if (path != '/main') {
                vm.filtro = '';
            }

            if (path == '/login' && rootRef.getAuth()) {
                logout();
                return;
            }
            $location.path(path);
        }

        function scrollTo(id) {
            var top = 400;
            var duration = 1000;
            var offset = 60; //pixels; adjust for floating menu, context etc
            //Scroll to #some-id with 30 px "padding"
            //Note: Use this in a directive, not with document.getElementById
            var someElement = angular.element(document.getElementById(id));
            $document.scrollToElement(someElement, offset, duration);
        }

        function logout() {
            rootRef.unauth();
            $location.path('/login');
        }

        var backImage = angular.element(document.querySelector('#back-image'));
        var porc = 0;
        angular.element($window).bind('scroll', function () {
            //backImage.css('top', (50 + (this.pageYOffset / 2)) + 'px');
            backImage.css('webkitFilter', 'blur(' + (this.pageYOffset / 100) + 'px)');

            var elem = angular.element($window);
            vm.offTop = parseInt(this.pageYOffset) > 1000;
            porc = (this.pageYOffset * 100) / $document[0].body.scrollHeight;

            if ((vm.lista && porc > 10) || porc > 70) {
                addPostInfinite();
            }
            if (!$scope.$$phase) {
                $scope.$apply();
            }
        });

        $scope.$watch('appCtrl.filtro', function () {
            if (vm.filtro.length > 0) {
                $location.path('/main');
                scrollTo('list-start');
            }
        });


        // create a Firebase ref that points to the scrollable data
        var baseRef = new Firebase('https://estomehaceruido.firebaseio.com/posts');

// create a read-only scroll ref, we pass in the baseRef and a field that
// will be used in the orderByChild() criteria (this also accepts $key, $priority, and $value)
        var scrollRef = new Firebase.util.Scroll(baseRef, 'fecha');

// establish an event listener as you would for any Firebase ref
        scrollRef.on('child_added', function (snap) {
            vm.posts.push({key: snap.key(), value: snap.val()});
        });

// download the first 20 records
        function addPostInfinite() {
            scrollRef.scroll.next(4);
        }

        addPostInfinite();

        $rootScope.$on("refreshListMain", function () {
            vm.posts = [];
            baseRef = {};
            scrollRef = {};

            baseRef = new Firebase('https://estomehaceruido.firebaseio.com/posts');
            scrollRef = new Firebase.util.Scroll(baseRef, 'fecha');

            scrollRef.on('child_added', function (snap) {
                vm.posts.push({key: snap.key(), value: snap.val()});
            });
            addPostInfinite();


        });

    }

})();
