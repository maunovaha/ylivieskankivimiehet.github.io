'use strict';

/***********************************************************************
 * 
 * Image overlay
 * 
 **********************************************************************/
var ImageOverlay = function() {
  this.init();
};
ImageOverlay.prototype = {
  /**
   * Initializes everything
   */
  init: function() {
    var self = this;

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

    // Disables scrollbars from body while image is open
    $('body').addClass('overflow-hidden');

    var self = this;

    // Handle to proper image element & url of it
    var $target = $('#' + $(that).data('img-id')),
        imgUrl  = $target.attr('src');

    // Swaps overlay to display proper image
    self.$overlayImg.attr('src', imgUrl);

    // Shows it all
    self.$overlay.addClass('overlay-open'); 
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
var ContactForm = function() {};
ContactForm.prototype = {
};

/***********************************************************************
 * 
 * Main program
 * 
 **********************************************************************/
var Main = function() {
  this.imageOverlay = new ImageOverlay();
  this.contactForm  = new ContactForm();

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
    $('.scroll-to').on('click', this.scrollTo);

    // Binds scrolling logic, so that proper nav element can be selected
    $(window).scroll(function() { 
      self.windowScroll();
    });
  },

  /**
   * Scrolls to proper page section
   */
  scrollTo: function(e) {
    e.preventDefault();

    var $target = $('#' + $(this).data('scroll-to'));

    $('body, html').animate({
      scrollTop: $target.offset().top
    }, 900, 'easeInOutQuart', function() {});
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