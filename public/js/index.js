$.material.init();
$.material.input();
$.material.checkbox();
$.material.radio();
// I know there is the target feature of CSS but this is just
// a stupid mockup and this is much easier to work with
$(document).on('click', '[data-target]', function() {
    $(this).toggleClass('active');
    $($(this).data('target')).toggleClass('active');
});

// Stupid trick to allow radio un-selection
$("input:radio").on("click", function(e) {
    var inp = $(this); //cache the selector

    if (inp.is(".theone")) { //see if it has the selected class
        inp.prop("checked", false).removeClass("theone");
        return;
    }
    $("input:radio[name='" + inp.prop("name") + "'].theone").removeClass("theone");
    inp.addClass("theone");
});

// Reset search field, we can't use the reset function because
// I use a contenteditable DIV as textinput because in this way
// I can use the :empty selector to show the "clear" button
// when needed
$('.reset').click(function() {
    $(this).parent().find('.field').html('');
});

// Ok this is horrible
$('#main-table .radio').click(function() {
    console.log('a');
    var me = $(this);
    var selected = me.find('.theone').length ? 'show-content' : 'hide-content';
    $('.panel.details').attr('class', 'panel details').addClass(selected.toString());
});


var navbarPrimaryHeight = $('.sdc-navbar-main').outerHeight();
$(window).scroll(function() {
    if ($(this).scrollTop() >= navbarPrimaryHeight) {
        $('.sdc-navbar, .sdc-sidemenu').addClass('fixed');
        $('.sdc-sidemenu').css('height', '');
    } else {
        $('.sdc-navbar, .sdc-sidemenu').removeClass('fixed');
        $('.sdc-sidemenu').css('height', 'calc(100vh - 110px + ' + $(this).scrollTop() + 'px)');
    }
});



$('.nav-tab').append('<span class="marker"></span>');
$('.nav-tab > .active').each(function() {
    //alert($(this));
    var width = $(this).width();
    //alert(width);
    var nx = $(".nav-tab").offset();
    var lx = $(this).offset();
    var left = lx.left - nx.left;
    $(this).parent().find('.marker').css({
        "width": width,
        "left": left
    });
});


$('.nav-tab a').click(function() {
    var navTap = $(this).closest('.nav-tab');
    var mrkWidth = $(this).parent('li').width();
    var nx = $(".nav-tab").offset();
    var lx = $(this).parent('li').offset();
    var left = lx.left - nx.left;
    $('.nav-tab li').removeClass('active');
    $(this).parent().addClass('active');
    navTap.find('.marker').css({
        "width": mrkWidth,
        "left": left
    });
});
//Ripple Animation
$(".btn , .nav-tab a").click(function(e) {

    // Remove olds ones
    $(".ripple").remove();

    // Setup
    var posX = $(this).offset().left,
        posY = $(this).offset().top,
        buttonWidth = $(this).width(),
        buttonHeight = $(this).height();

    // Add the element
    $(this).prepend("<span class='ripple'></span>");

    // Make it round!
    if (buttonWidth >= buttonHeight) {
        buttonHeight = buttonWidth;
    } else {
        buttonWidth = buttonHeight;
    }

    // Get the center of the element
    var x = e.pageX - posX - buttonWidth / 2;
    var y = e.pageY - posY - buttonHeight / 2;

    // Add the ripples CSS and start the animation
    $(".ripple").css({
        width: buttonWidth,
        height: buttonHeight,
        top: y + 'px',
        left: x + 'px'
    }).addClass("rippleEffect");
});

$('#sidemenu a').click(function() {
    $('#sidemenu a').removeClass('active');
    $(this).addClass('active');
    $(this).parent().addClass('active');
});