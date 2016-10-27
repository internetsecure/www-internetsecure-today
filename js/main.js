$(document).ready(function () {


    var fooReveal = {
        scale: 1,
        easing: 'ease-in',
        duration: 400,
    };

    window.sr = ScrollReveal();
    sr.reveal('.icon-1', fooReveal);
    sr.reveal('.icon-2', fooReveal,{
        delay: 300,
    });
    sr.reveal('.icon-3', fooReveal, {
        delay: 400
    });
    sr.reveal('.icon-4',fooReveal,{
        delay: 500
    });
    sr.reveal('.icon-5', fooReveal,{
        delay: 600
    });
    sr.reveal('.icon-6', fooReveal,{
        delay: 700
    });
     sr.reveal('#btn-contact', fooReveal,{
        delay: 400
    });
    
    

    $('a[href*=#]:not([href=#])').click(function () {
        if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
            if (target.length) {
                $('html,body').animate({
                    scrollTop: target.offset().top
                }, 600, 'swing');
                return false;
            }
        }
    });

});