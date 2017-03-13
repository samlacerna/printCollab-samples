angular.module('public.cart').directive('sidebarCart', sidebarCart)

sidebarCart.$inject = ['$document']

function sidebarCart($document) {
    return {
        restrict: 'AEC',
        replace: 'true',
        templateUrl: '/client/cart/views/dropdown-sidebar.html',
        controllerAs: 'SideCartCtrl',
        controller: 'SideCartController',
        link: function(scope, elem, attrs) {
            $document.find('.overly-mask, .cart-close-trigger').click(function(event) {
                elem.toggleClass('is-visible')
                elem.find('.overly-mask').toggleClass('is-visible')
                elem.find('.cart-sidebar-toggle').toggleClass('active')
                elem.find('.cartMenu ').toggleClass('open')
                $document[0].body.classList.toggle('modal-open')
                $document.find('.overly-mask').toggleClass('is-visible')
            })
        }

    }
}
