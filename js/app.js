angular.module('website', ['ngAnimate'])
    .factory('ContentService', function () {
        var content = {
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

        var getContent = function () {
            return content;
        };

        return {
            getContent: getContent
        };
    })
    .factory('TransitService', function ($rootScope) {
        var inTransit = false;

        var setTransit = function (transit) {
            inTransit = transit;
            $rootScope.$broadcast('onTransitChanged');
        }

        var getTransit = function () {
            return inTransit;
        }

        return {
            getTransit: getTransit,
            setTransit: setTransit
        };
    })
    .controller('MainCtrl', function ($scope, ContentService, TransitService) {
        $scope.pages = ContentService.getContent();

        $scope.currentPage = 'home';
        $scope.page = $scope.pages['home'];
        $scope.isInTransit = false;

        $scope.getCurrentPage = function () {
            return $scope.currentPage;
        };

        $scope.setCurrentPage = function (page) {
            if ($scope.currentPage !== page) {
                TransitService.setTransit(true);
                $scope.page = $scope.pages[page];
                $scope.currentPage = page;
            }
        };

        $scope.$on('onTransitChanged', function () {
            $scope.isInTransit = TransitService.getTransit();
        });

        $scope.isInTransit = function () {
            return TransitService.inTransit;
        };

        $scope.isCurrentPage = function (page) {
            return $scope.currentPage === page;
        };
    })
    .directive('bg', function ($window) {
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
    .animation('.bg-animation', function ($window, TransitService) {
        return {
            enter: function (element, done) {
                var $scope = element.scope();
                TweenMax.fromTo(element, 0.5, { left: $window.innerWidth}, {left: 0, onComplete: function () {
                    $scope.$apply(function () {
                        TransitService.setTransit(false);
                    });

                    done();
                }});
            },

            leave: function (element, done) {
                TweenMax.to(element, 0.5, {left: -$window.innerWidth, onComplete: done});
            }
        };
    })
    .animation('.panel-animation', function ($window) {
        return {
            addClass: function (element, className, done) {
                if (className == 'ng-hide') {
                    TweenMax.to(element, 0.2, { alpha: 0, onComplete: done });
                }
                else {
                    done();
                }
            },
            removeClass: function (element, className, done) {
                if (className == 'ng-hide') {
                    element.removeClass('ng-hide');
                    TweenMax.fromTo(element, 0.5, { alpha: 0, left: -element.width() }, { alpha: 0.8, left: 0, onComplete: done });
                }
                else {
                    done();
                }
            }
        };
    });

