// script.js
$(document).ready(function() {
    $('a[href^="#"]').on('click', function(e) {
        e.preventDefault();
        const target = $(this.getAttribute('href'));
        if (target.length) {
            $('html, body').animate({
                scrollTop: target.offset().top - 50
            }, 800);
        }
    });
});

// script.js
$(document).ready(function() {
    $(window).scroll(function() {
        $('.feature-card').each(function() {
            const cardTop = $(this).offset().top;
            const windowBottom = $(window).scrollTop() + $(window).height();
            if (windowBottom > cardTop + 100) {
                $(this).css({
                    opacity: 1,
                    transform: 'translateY(0)'
                });
            }
        });
    });
});

// script.js
$(document).ready(function() {
    // Open modal when login/signup is clicked
    $('#login-button, #signup-button').click(function(e) {
        e.preventDefault();
        $('#auth-modal').fadeIn();
    });

    // Close modal
    $('.close').click(function() {
        $('#auth-modal').fadeOut();
    });

    // Close when clicking outside modal
    $(window).click(function(e) {
        if (e.target.id === 'auth-modal') {
            $('#auth-modal').fadeOut();
        }
    });
});

