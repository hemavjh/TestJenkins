////$(document).ready(function () {
////    if (!config.isSocialIconVisible) $('.fixedSocial').hide();
////    if (!config.isCustomerVisible) {
////        $('#customers').hide();
////        $('[href="#customers"]').parent().remove();
////    }

////    $('[data-toggle="tooltip"]').tooltip();
////    $('.addressG').click(function () {
////        $('.contact h4 i').toggleClass('activeMap');
////        $('.gMap').toggle();
////    })
////    $(window).scroll(function () {
////        if ($(this).scrollTop() > 100) {
////            $('.scrollToTop').fadeIn();
////        } else {
////            $('.scrollToTop').fadeOut();
////        }
////    });
////    $('.menuBar').click(function () {
////        $('.primaryMenu>ul').toggleClass('mobileMenu')
////    });
////    $('.primaryMenu>ul>li>a').click(function () {
////        $('.primaryMenu>ul').removeClass('mobileMenu')
////    })
////    $("#homeSlider").owlCarousel({
////        loop: true,
////        stagePadding: 0,
////        nav: true,
////        items: 1,
////        autoplay: true,
////        autoplayTimeout: 40000,
////        smartSpeed: 700,
////        navText: ["<i class='fas fa-chevron-left navSliderIcon'></i>", "<i class='fas fa-chevron-right navSliderIcon'></i>"]


////    });

////    $('.scrollToTop').click(function () {
////        $('.menu').removeClass('activeMenu');
////        $('.menu[href="#homeSlider"]').addClass('activeMenu');
////    })
////    $(".smoothScroll").on('click', function (event) {

////        if (this.hash !== "") {
////            event.preventDefault();
////            var hash = this.hash;
////            $('html, body').animate({
////                scrollTop: ($(hash).offset().top - 80)
////            }, 800, function () {
////            });
////        }
////    });
////    $('#abtAnimate').viewportChecker({
////        classToAdd: 'fadeInUp'
////    });
////    $('#abtImg').viewportChecker({
////        classToAdd: 'fadeInDown'
////    });
////    $('.fu').viewportChecker({
////        classToAdd: 'fadeInUp'
////    });
////    $('.fd').viewportChecker({
////        classToAdd: 'fadeInDown'
////    });

////    // Cache selectors
////    var topMenu = $("#top-menu"),
////        topMenuHeight = topMenu.outerHeight() + 15,
////        // All list items
////        menuItems = topMenu.find("a.menu"),
////        // Anchors corresponding to menu items
////        scrollItems = menuItems.map(function () {
////            var item = $($(this).attr("href"));
////            if (item.length) { return item; }
////        });
////    // Bind to scroll
////    $(window).scroll(function () {
////        // Get container scroll position
////        var fromTop = $(this).scrollTop() + topMenuHeight;

////        // Get id of current scroll item
////        var cur = scrollItems.map(function () {
////            if ($(this).offset().top < fromTop)
////                return this;
////        });
////        // Get the id of the current element
////        cur = cur[cur.length - 1];
////        var id = cur && cur.length ? cur[0].id : "";

////        $('.menu').removeClass('activeMenu');
////        $('.menu[href="#' + id + '"]').addClass('activeMenu');
////    });
////});
