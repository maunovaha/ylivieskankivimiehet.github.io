'use strict';

/***********************************************************************
 * 
 * Gallery section
 * 
 **********************************************************************/
var ImageGallery = function() {};
ImageGallery.prototype = {
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
  this.imageGallery = new ImageGallery();
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

    $('body').stop().animate({
      'scrollTop': $target.offset().top
    }, 900, 'easeInOutQuart', function() {});
  },

  /**
   * Handles toggling of proper nav element, based on vertical scroll position
   */
  windowScroll: function() {
    var self = this;

    // Do nothing if element not visible
    // e.g. Means that window is smaller than desktop and nav is not visible
    // if () { return; }

    // Using small delay to activate nav classes.. it doesn't need to be real-time, 
    // and therefore, this is better considering performance.
    //
    // Also, handling that we don't bind multiple nav checks... we only want to know 
    // when we have moved, and then check the state of scroll position.
    if(!this.windowScrollTimer) {
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
    var scrollY = window.scrollY,
        section = 'contact';

    if (scrollY < this.$sections['header'].height() - this.sectionOffset) {
      section = 'header';
    } else if (scrollY < (this.$sections['header'].height() + this.$sections['info'].height()) - this.sectionOffset) {
      section = 'info';
    }

    return $('#nav-section-' + section);
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