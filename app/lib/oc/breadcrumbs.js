angular.module('OrderCloud-Breadcrumbs', []);

angular.module('OrderCloud-Breadcrumbs')
    .directive('breadcrumbs', breadcrumbs)
    .controller('BreadcrumbsCtrl', BreadcrumbsCtrl)
    .directive('productnav', productnav)
;

function breadcrumbs() {
    var directive =  {
        restrict: 'E',
        template: template,
        controller: BreadcrumbsCtrl
    };
    return directive;

    function template() {
        return [
            '<style>',
            '.breadcrumbs {padding:10px 0;}',
            '.breadcrumb {background-color: #f0f0f0; border-radius:0;}',
            '.breadcrumb a{color: #4e2683; padding:5px;}',
            '.breadcrumb a:hover {background-color:#ddd; color: #000;}',
            //'.breadcrumbs li:last-child a{font-weight:bold;}',
            '</style>',
            '<div class="breadcrumbs" ng-show="breadcrumbs">',
            '<ul class="breadcrumb">',
            '<li ng-repeat="crumb in breadcrumbs">',
            '<a ng-href="{{crumb.link}}">{{crumb.name}}</a>',
            '</li>',
            '</ul>',
            '</div>'
        ].join('');
    }
}

BreadcrumbsCtrl.$inject = ['$scope','$cookieStore'];
function BreadcrumbsCtrl($scope, $cookieStore) {

    $scope.linkedTree = {};
    $scope.breadcrumbs = [];
    $cookieStore.put("breadCookie", $scope.breadcrumbs);

    $scope.$watch('currentCategory', function(newVal) {
        if (!newVal) return;
        $scope.breadcrumbs = [];
        initTree();
        getNode($scope.linkedTree, $scope.currentCategory, $scope.breadcrumbs);
    });

    function initTree() {
        $scope.linkedTree.Description = '';
        $scope.linkedTree.Image = null;
        $scope.linkedTree.Name = 'Catalog';
        $scope.linkedTree.ProductViewName = null;
        $scope.linkedTree.SortOptions = null;
        $scope.linkedTree.InteropID = 'catalog';
        $scope.linkedTree.Parent = null;
        $scope.linkedTree.SubCategories = $scope.tree;
        linkTree($scope.linkedTree.SubCategories, $scope.linkedTree);
    }

    function linkTree(currentNodes, parentNode) {
        if (currentNodes) {
            angular.forEach(currentNodes, function(node) {
                node.Parent = parentNode;
                linkTree(node.SubCategories, node);
            });
        }
    }

    function getNode(currentNode, node, breadcrumbs) {
        if (currentNode.InteropID === node.InteropID) {
            getBreadCrumbs(currentNode, breadcrumbs);
        }
        else if (currentNode.SubCategories) {
            angular.forEach(currentNode.SubCategories, function(cat) {
                getNode(cat, node, breadcrumbs);
            });
        }
    }

    function getBreadCrumbs(node, breadcrumbs) {
        if (node) {
            var linkPath;
            if (node.InteropID !== 'catalog') {
                linkPath = 'catalog/' + node.InteropID;
            } else {
                linkPath = node.InteropID;
            }
            breadcrumbs.unshift({name: node.Name, link: linkPath});
            $cookieStore.put("breadCookie", breadcrumbs);
            getBreadCrumbs(node.Parent, breadcrumbs);
        }
    }
}

function productnav() {
    var directive = {
        scope: {
            product: '=',
            variant: '=',
            editvariant: '='
        },
        restrict: 'E',
        template: template,
        controller: ['$scope','$cookieStore', function($scope,$cookieStore){
            $scope.breadCookie = $cookieStore.get("breadCookie");
        }]
    };

    return directive;

    function template() {
        return [
            '<style>',
            '.breadcrumbs {padding:10px 0;}',
            '.breadcrumb {background-color: #f0f0f0; border-radius:0;}',
            '.breadcrumb a{color: #4e2683; padding:5px;}',
            '.breadcrumb a:hover {background-color:#ddd; color: #000;}',
            //'.breadcrumbs li:last-child a{font-weight:bold;}',
            '</style>',
            '<div class="breadcrumbs" ng-show="breadCookie">',
            '<ul class="breadcrumb">',
            '<li ng-repeat="crumb in breadCookie">',
            '<a ng-href="{{crumb.link}}">{{crumb.name}}</a>',
            '</li>',
            '<li><a href="product/{{product.InteropID}}">{{product.Name}}</a></li>',
            '<li ng-if="variant && variant.ExternalID"><a href="product/{{product.InteropID}}/{{variant.InteropID}}">{{variant.ExternalID}}</a></li>',
            '</ul>',
            '</div>'
        ].join('');
    }
}