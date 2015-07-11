/**
 * Strict mode for the winz
 */ 
'use strict';

/**
 * Gallery section
 */
var ImageGallery = function() {};

/**
 * Prototypes
 */
ImageGallery.prototype = {
};

/**
 * Contact section
 */
var ContactForm = function() {};

/**
 * Prototypes
 */
ContactForm.prototype = {
};

/**
 * Globals
 */
var Main = function() {
  this.imageGallery = new ImageGallery();
  this.contactForm  = new ContactForm();

  // Bindings and stuff..
  this.init();
};

/**
 * Prototypes
 */
Main.prototype = {

  /**
   * Initializes everything
   */
  init: function() {
    
    // Binds scrolling clicks to necessary elements
    $('.scroll-to').on('click', this.scrollTo);

  },

  /**
   * Scrolls to proper page section
   */
  scrollTo: function(e) {
    e.preventDefault();

    var $target = $('#' + $(this).data('scroll-to'));

    $('html, body').stop().animate({
      'scrollTop': $target.offset().top
    }, 1000, 'easeInOutQuart', function() {});
  }
};

/**
 * DOM ready
 */
$(function() { 
  var main = new Main(); 
});