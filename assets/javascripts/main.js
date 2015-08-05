'use strict';

/***********************************************************************
 * 
 * Image overlay
 * 
 **********************************************************************/
var ImageOverlay = function(main) {
  this.main = main;
  this.init();
};
ImageOverlay.prototype = {
  /**
   * Initializes everything
   */
  init: function() {
    var self = this;

    // Silly test for mobile
    this.isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase());
    this.showDelay = this.isMobile ? 650 : 0;

    // Handle to overlay etc.
    this.$overlay    = $('.overlay');
    this.$overlayImg = $('#overlay-img');

    // Binds clicks for opening overlay
    $('.img-link').on('click', function(e) {
      self.open(e, this);
    });

    // Binds click for closing overlay
    $('.overlay-close').on('click', function(e) {
      self.close(e);
    });
  },

  /**
   * Opens overlay
   */
  open: function(e, that) {
    e.preventDefault();

    var self = this;

    // Handle to proper image element & url of it
    var $target = $('#' + $(that).data('img-id')),
        imgUrl  = $target.attr('src');

    // Swaps overlay to display proper image
    self.$overlayImg.attr('src', imgUrl);

    setTimeout(function() { 
      // Disables scrollbars from body while image is open
      $('body').addClass('overflow-hidden');
      self.$overlay.addClass('overlay-open'); 
    }, self.showDelay);
  },

  /**
   * Closes overlay
   */
  close: function(e) {
    e.preventDefault();

    // Enables scrollbars from body
    $('body').removeClass('overflow-hidden');

    // Hide it all
    this.$overlay.removeClass('overlay-open');
  }
};

/***********************************************************************
 * 
 * Contact section
 * 
 **********************************************************************/
var ContactForm = function(main) {
  this.main = main;
  this.init();
};
ContactForm.prototype = {
  /**
   * Initializes everything
   */
  init: function() {
    var self = this;

    $('#send-feedback').on('click', function(e) {
      self.send(e);
    });
  },

  /**
   * Handles sending of email, and required steps
   */
  send: function(e) {
    e.preventDefault();

    if(!$('#feedback-overlay').hasClass('feedback-overlay-open')) {
      var isValid = this.isValid();

      if(isValid) {
        this.email();
      } else {
        this.setState('validation-error');
      }
    }
  },

  /**
   * Clears all form inputs, called when feedback is sent
   */
  clearFormInputs: function() {
    $("#name").val('');
    $("#phone").val('');
    $("#message").val('');
    $("#email").val('');
  },

  /**
   * Sends the actual email
   */
  email: function() {
    var self = this;

    self.setState('loading');

    $.ajax({
      url: "https://ylivieskankivimiehet.herokuapp.com/feedback",
      type: "POST",
      data: self.userInput(),
      cache: false,
    }).done(function(data, statusText, xhr) {
      var status = xhr.status;

      if (status == 200) {
        self.setState('success');
        self.clearFormInputs();
      } else {
        self.setState('server-error');
      }

    }).fail(function() {
      self.setState('server-error');
    });
  },

  /**
   * Sets loading state
   */
  setState: function(state) {

    $('.success').addClass('hidden');
    $('.validation-error').addClass('hidden');
    $('.server-error').addClass('hidden');

    switch(state) {
      case 'loading':
        $('body').addClass('overflow-hidden');
        $('#feedback-overlay').addClass('feedback-overlay-open'); 
        break;
      case 'validation-error':
        $('.validation-error').removeClass('hidden');
        break;
      case 'server-error':
        $('.server-error').removeClass('hidden');
        break;
      case 'success':
        $('.success').removeClass('hidden');
        break;
    } 

    if (state !== 'loading') {
      $('body').removeClass('overflow-hidden');
      $('#feedback-overlay').removeClass('feedback-overlay-open'); 
    }
  },

  /**
   * Validates given input, nice and simple.
   */
  isValid: function() {
    var userInput = this.userInput();

    return userInput['name'].length        > 0 && 
           userInput['phone'].length       > 0 && 
           userInput['message'].length     > 0 && 
           userInput['email'].length       > 0 &&
           userInput['email'].indexOf('@') > -1;
  },

  /**
   * 
   */
  userInput: function() {
    return {
      'name':    $.trim($('#name').val()),
      'phone':   $.trim($('#phone').val()),
      'message': $.trim($('#message').val()),
      'email':   $.trim($('#email').val())
    };
  },


};

/***********************************************************************
 * 
 * Main program
 * 
 **********************************************************************/
var Main = function() {
  this.imageOverlay = new ImageOverlay(this);
  this.contactForm  = new ContactForm(this);

  // Launch spinner
  var opts = {
    lines: 13, // The number of lines to draw
    length: 28, // The length of each line
    width: 14, // The line thickness
    radius: 42, // The radius of the inner circle
    scale: 1, // Scales overall size of the spinner
    corners: 1, // Corner roundness (0..1)
    color: '#000', // #rgb or #rrggbb or array of colors
    opacity: 0.25, // Opacity of the lines
    rotate: 0, // The rotation offset
    direction: 1, // 1: clockwise, -1: counterclockwise
    speed: 1, // Rounds per second
    trail: 60, // Afterglow percentage
    fps: 20, // Frames per second when using setTimeout() as a fallback for CSS
    zIndex: 2e9, // The z-index (defaults to 2000000000)
    className: 'spinner', // The CSS class to assign to the spinner
    top: '50%', // Top position relative to parent
    left: '50%', // Left position relative to parent
    shadow: false, // Whether to render a shadow
    hwaccel: false, // Whether to use hardware acceleration
    position: 'fixed' // Element positioning
  };

  var target = document.getElementById('feedback-overlay');
  var spinner = new Spinner(opts).spin(target);

  // Handle to nav
  this.$nav = undefined;

  // Handles to page sections
  this.$sections = {};

  // Offset to detect which section user is viewing
  this.sectionOffset = 100;

  this.init();
};
Main.prototype = {
  /**
   * Timer for detecting nav classes based on scrolling
   */
  windowScrollTimer: undefined,

  /**
   * Initializes everything
   */
  init: function() {
    var self = this;

    // Grap the nav element
    this.$nav = $('nav');

    // Grap the sections
    this.$sections = {
      header:  $('header'),
      info:    $('.info'),
      contact: $('.contact')
    };
    
    // Binds scrolling clicks to necessary elements
    $('.scroll-to').on('click', function(e) {
      self.scrollToClick(e, this);
    });

    // Binds scrolling logic, so that proper nav element can be selected
    $(window).scroll(function() { 
      self.windowScroll();
    });
  },

  /**
   * Binds scrolling clicks
   */
  scrollToClick: function(e, that) {
    e.preventDefault();
    this.scrollTo($('#' + $(that).data('scroll-to')));
  },

  /**
   * Scrolls to proper page section
   */
  scrollTo: function(target, cb) {
    $('body, html').animate({
      scrollTop: target.offset().top
    }, 900, 'easeInOutQuart', function() {
      if (cb) { 
        cb();
      }
    });
  },

  /**
   * Handles toggling of proper nav element, based on vertical scroll position
   */
  windowScroll: function() {
    var self = this;

    // Do nothing if nav is not visible
    // e.g. Means that window is smaller than defined media query for its visibility
    //
    // Thus, uses small delay to activate nav classes.. it doesn't need to be real-time, 
    // and therefore, this is better considering performance.
    if(!this.windowScrollTimer && this.innerWidth() >= 1120) {
      this.windowScrollTimer = setTimeout(function() {
        self.updateNav();
      }, 900);
    }
  },

  /** 
   * Updates navigation classes
   */
  updateNav: function() {

    // Find out which section we are at
    var $sectionLink = this.currentSection();

    // Update section whenever necessary
    if (!$sectionLink.hasClass('active')) {

      // Remove all previously activate classes
      $('.nav-link').removeClass('active');

      // Activate current
      $sectionLink.addClass('active');
    }

    // Free timer for next tests of scrolling
    clearTimeout(this.windowScrollTimer);
    this.windowScrollTimer = undefined;
  },

  /** 
   * Returns currently viewed section link based on scroll position
   */
  currentSection: function() {
    var scrollY = this.scrollY(),
        section = 'contact';

    if (scrollY < this.$sections['header'].height() - this.sectionOffset) {
      section = 'header';
    } else if (scrollY < (this.$sections['header'].height() + this.$sections['info'].height()) - this.sectionOffset) {
      section = 'info';
    }

    return $('#nav-section-' + section);
  },

  /** 
   * Cross-browser scrollY position, IE's can eat my shorts.
   */
  scrollY: function() {
    var supportPageOffset = window.pageXOffset !== undefined,
        isCSS1Compat      = ((document.compatMode || "") === "CSS1Compat");

    return supportPageOffset ? window.pageYOffset : isCSS1Compat ? 
           document.documentElement.scrollTop : document.body.scrollTop;
  },

  /** 
   * Cross-browser innerWidth, IE 8, I hate you.
   */
  innerWidth: function() {
    return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  }
};

/***********************************************************************
 * 
 * DOM ready
 * 
 **********************************************************************/
$(function() { 
  var main = new Main(); 
});