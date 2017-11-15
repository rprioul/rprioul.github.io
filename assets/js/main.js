jQuery(document).ready(($) => {
    $('.level-bar-inner').css('width', '0');
    $(window).on('load', () => {
        $('.level-bar-inner').each(function() {
            let itemWidth = $(this).data('level');
            $(this).animate({
                width: itemWidth
            }, 800);
        });
    });
});