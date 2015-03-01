angular.module('website', [])
  .controller('MainCtrl', function ($scope) {
    $scope.pages = {
      'home': {label: 'Home', sublabel: 'Sublabel', content: 'This is page content.'},
      'about': {label: 'About', sublabel: 'Sublabel', content: 'This is page content.'},
      'contact': {label: 'Contact', sublabel: 'Sublabel', content: 'This is page content.'}
    };

    $scope.currentPage = 'home';
    $scope.page = $scope.pages['home'];

    $scope.setCurrentPage = function (page) {
      if ($scope.currentPage !== page) {
        $scope.page = $scope.pages[page];
        $scope.currentPage = page;
      }
    };

    $scope.isCurrentPage = function (page) {
      return $scope.currentPage === page;
    };
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
;

