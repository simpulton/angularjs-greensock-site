angular.module('website', ['ngAnimate'])
  .constant('TweenMax', TweenMax)
  .controller('MainCtrl', function ($scope) {
    $scope.pages = {
      'home': {label: 'Home', sublabel: 'Sublabel', content: 'This is page content.'},
      'about': {label: 'About', sublabel: 'Sublabel', content: 'This is page content.'},
      'contact': {label: 'Contact', sublabel: 'Sublabel', content: 'This is page content.'}
    };

    $scope.currentPage = 'home';
    $scope.page = $scope.pages['home'];
    $scope.isInTransit = false;

    $scope.setCurrentPage = function (page) {
      if ($scope.currentPage !== page) {
        $scope.page = $scope.pages[page];
        $scope.currentPage = page;
        $scope.isInTransit = true;
      }
    };

    $scope.isCurrentPage = function (page) {
      return $scope.currentPage === page;
    };

    $scope.$on('bgTransitionComplete', function () {
      $scope.isInTransit = false;
    });
  })
  .directive('bg', function ($window) {
    return function (scope, element, attrs) {
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
      };

      var windowElement = angular.element($window);
      windowElement.resize(resizeBG);

      element.bind('load', function () {
        resizeBG();
      });
    }
  })
  .animation('.bg-animation', function ($window, $rootScope, TweenMax) {
    return {
      enter: function (element, done) {
        TweenMax.fromTo(element, 0.5, {left: $window.innerWidth}, {
          left: 0, onComplete: function () {
            $rootScope.$apply(function () {
              $rootScope.$broadcast('bgTransitionComplete');
            });
            done();
          }
        });
      },

      leave: function (element, done) {
        TweenMax.to(element, 0.5, {left: -$window.innerWidth, onComplete: done});
      }
    };
  })
  .animation('.panel-animation', function (TweenMax) {
    return {
      addClass: function (element, className, done) {
        if (className == 'ng-hide') {
          TweenMax.to(element, 0.2, {opacity: 0, onComplete: done});
        }
        else {
          done();
        }
      },
      removeClass: function (element, className, done) {
        if (className == 'ng-hide') {
          element.removeClass('ng-hide');
          TweenMax.fromTo(element, 0.5, {opacity: 0, left: -element.width()}, {opacity: 0.8, left: 0, onComplete: done});
        }
        else {
          done();
        }
      }
    };
  })
;

