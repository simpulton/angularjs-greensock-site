angular.module('website', [])
    .controller('MainCtrl', ['$scope', function ($scope) {
        $scope.pages = {
            'home': {
                label: 'Home',
                sublabel: 'Sublabel',
                content: 'Bacon ipsum dolor sit amet prosciutto filet mignon biltong, pork loin turkey beef ribs brisket. Pancetta corned beef spare ribs strip steak ball tip ham, meatloaf turkey.'
            },
            'about': {
                label: 'About',
                sublabel: 'Sublabel',
                content: 'Bacon ipsum dolor sit amet prosciutto filet mignon biltong, pork loin turkey beef ribs brisket. Pancetta corned beef spare ribs strip steak ball tip ham, meatloaf turkey.'
            },
            'contact': {
                label: 'Contact',
                sublabel: 'Sublabel',
                content: 'Bacon ipsum dolor sit amet prosciutto filet mignon biltong, pork loin turkey beef ribs brisket. Pancetta corned beef spare ribs strip steak ball tip ham, meatloaf turkey.'
            }
        };

        $scope.currentPage = 'home';
        $scope.page = $scope.pages['home'];
        $scope.inTransit = false;

        $scope.getCurrentPage = function () {
            return $scope.currentPage;
        };

        $scope.setCurrentPage = function (page) {
            $scope.inTransit = true;
            $scope.page = $scope.pages[page];
            $scope.currentPage = page;
        };

        $scope.isCurrentPage = function (page) {
            return $scope.currentPage === page;
        };
    }])
    .directive('bg', function factory($window) {
        // Adapted from http://bavotasan.com/2011/full-sizebackground-image-jquery-plugin/ Thanks @bavotasan!
        var linker = function (scope, element, attrs) {
            var resizeBG = function () {
                var bgwidth = element.width();
                var bgheight = element.height();

                var winwidth = $window.innerWidth;
                var winheight = $window.innerHeight;

                var widthratio = winwidth / bgwidth;
                var heightratio = winheight / bgheight;

                var widthdiff = heightratio * bgwidth;
                var heightdiff = widthratio * bgheight;

                if (heightdiff > winheight) {
                    element.css({
                        width: winwidth + 'px',
                        height: heightdiff + 'px'
                    });
                } else {
                    element.css({
                        width: widthdiff + 'px',
                        height: winheight + 'px'
                    });
                }
            }

            resizeBG();

            var windowElement = angular.element($window);
            windowElement.resize(resizeBG);
        }

        return {
            restrict: 'A',
            link: linker
        };
    })
    .animation('fade-in', function ($window) {
        return {
            start: function (element, done) {
                TweenMax.to(element, 1, {alpha: 1, onComplete: done});
            },
            cancel: function (element, done) {
                cancelAnimation(element);
                done();
            }
        }
    })
    .animation('fade-out', function ($window) {
        return {
            start: function (element, done) {
                TweenMax.to(element, 0.2, {alpha: 0, onComplete: done});
            },
            cancel: function (element, done) {
                cancelAnimation(element);
                done();
            }
        }
    })
    .animation('hide-panel', function ($window) {
        return {
            setup: function (element, done) {
                TweenMax.set(element, {position: 'absolute'});
            },
            start: function (element, done) {
                TweenMax.to(element, 0.2, {alpha: 0, onComplete: done});
            }
        }
    })
    .animation('show-panel', function ($window) {
        return {
            setup: function (element, done) {
                TweenMax.set(element, { left: -element.width()});
            },
            start: function (element, done) {
                TweenMax.to(element, 0.2, {alpha: 0.8, onComplete: done});
                TweenMax.to(element, 0.5, {left: 0, onComplete: done});
            },
            cancel: function (element, done) {
                cancelAnimation(element);
                done();
            }
        }
    })
    .animation('hide-bg', function ($window) {
        return {
            setup: function (element, done) {
                TweenMax.set(element, {position: 'absolute'});
            },
            start: function (element, done) {
                TweenMax.to(element, 0.5, {left: -$window.innerWidth, onComplete: done});
            }
        }
    })
    .animation('show-bg', function ($window) {
        var getScope = function (e) {
            return angular.element(e).scope();
        };

        return {
            setup: function (element, done) {
                TweenMax.set(element, { left: $window.innerWidth});
            },
            start: function (element, done) {
                var $scope = getScope(element);
                TweenMax.to(element, 0.5, {left: 0, onComplete: function () {
                    $scope.$apply(function () {
                        $scope.inTransit = false;
                    });
                }});
            },
            cancel: function (element, done) {
                cancelAnimation(element);
                done();
            }
        }
    });
