import $ from "jquery";
import "what-input";

// Foundation JS relies on a global varaible. In ES6, all imports are hoisted
// to the top of the file so if we used`import` to import Foundation,
// it would execute earlier than we have assigned the global variable.
// This is why we have to use CommonJS require() here since it doesn't
// have the hoisting behavior.
//window.jQuery = $;
//require('foundation-sites');

(function ($) {
  $(document).ready(function () {
    // Loaded when DOM is ready
    console.log("Running jQuery");

    createCollection();

    let currentStep = 1;
    $("#opret-mindeindsamling-form .next").click({ direction: "next" }, changeFormSlide);
    $("#opret-mindeindsamling-form .prev").click({ direction: "prev" }, changeFormSlide);

    $("#ins_goal").keyup(updateGoalPreview);
    $("#ins_own_donation").keyup(updateOwnDonationPreview);
    $("#ins_end_date").change(updateEndDate);
    $("#ins_images").change(function() {
      readURL(this);
    });

    $("[data-create-collection]").submit(function(e) {
      e.preventDefault();
    })


    const steps = $(".step").toArray().length;

    function readURL(input) {
      if (input.files && input.files[0]) {
        var reader = new FileReader();
        
        reader.onload = function(e) {
          $('.ins-images-preview').attr('src', e.target.result);
        }
        
        reader.readAsDataURL(input.files[0]); // convert to base64 string
      }
    }
  
    function updateEndDate() {
      $(".end-date-preview").text("Slutter d. " + formatDate($("#ins_end_date").val()));
    }

    function updateGoalPreview() {
      $(".ins-goal-preview").text("kr. " + $("#ins_goal").val().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + ",-");

      updateBarWidth();
    }

    function updateOwnDonationPreview() {
      $(".own-donation-preview").text("kr. " + $("#ins_own_donation").val().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + ",-" );

      updateBarWidth();
    }

    function updateBarWidth() {
      let barWidth = ($("#ins_own_donation").val() / $("#ins_goal").val()) * 100;
      $(".donation-progress").css("width", barWidth + "%");
    }

    function changeFormSlide(e) {
      console.log(e.data.direction);
      $("#opret-mindeindsamling-form .step-1").removeClass("step-active");
      $("#opret-mindeindsamling-form .step-2").removeClass("step-active");
      $("#opret-mindeindsamling-form .step-3").removeClass("step-active");
      $("#opret-mindeindsamling-form .step-4").removeClass("step-active");

      $(".dots .dot-1").removeClass("dot-filled");
      $(".dots .dot-2").removeClass("dot-filled");
      $(".dots .dot-3").removeClass("dot-filled");
      $(".dots .dot-4").removeClass("dot-filled");

      if (e.data.direction == "next") {
        currentStep++;
      } else {
        currentStep--;
      }

      if (currentStep == 1) {
        $("#opret-mindeindsamling-form .prev").addClass("hide-btn");
      } else if(currentStep == 4) {
        $(".preview-title").text($("#ins_title").val());
        $(".preview-name").text("Til minde om " + $("#ins_name").val());
        $(".preview-desc").text($("#ins_desc").val());
      } else {
        $("#opret-mindeindsamling-form .prev").removeClass("hide-btn");
        $("#opret-mindeindsamling-form .next").removeClass("hide-btn");
        $("#opret-mindeindsamling-form .submit-btn").addClass("remove-btn");
      }

      if(currentStep == steps) {
        $("#opret-mindeindsamling-form .next").addClass("hide-btn");
        $("#opret-mindeindsamling-form .submit-btn").removeClass("remove-btn");
      }

      $("#opret-mindeindsamling-form .step-" + currentStep).addClass("step-active");

      let dotStep = currentStep;
      while (dotStep > 0) {
        $(".dots .dot-" + dotStep).addClass("dot-filled");
        dotStep--;
      }

      console.log(currentStep);
    }

    function formatDate(date) {
      var d = new Date(date),
          month = '' + (d.getMonth() + 1),
          day = '' + d.getDate(),
          year = d.getFullYear();
 
      if (month.length < 2) month = '0' + month;
      if (day.length < 2) day = '0' + day;
 
      return [day, month, year].join('/');
    
    }

    function createCollection() {
      let data = '';
      let loading = false;
      $("body").removeClass("form-loading");

      let validator = $("[data-create-collection]").validate({
        messages: {
          ins_title: 'Giv venligst indsamlingen et navn (step 1).',
          ins_name: 'Angiv venligst hvem indsamlingen er til minde om (step 1).',
          ins_desc: 'Skriv venligst et par linjer om, hvorfor du samler ind til Kræftens Bekæmpelse (step 1).',
          ins_goal: 'Sæt venligst et mål for indsamlingen i kr (step 2).',
          ins_end_date: 'Sæt venligst en slutdato for indsamlingen (step 2).'
        },
        errorPlacement: function(error, element) {
          error.appendTo(".error-container");
        },
        submitHandler: function(form) {
          data = $(form).serialize();
          console.log(data);
          do_ajax(data, loading, function(res) {
            console.log(res);
          })
        }
      })

    }

    function do_ajax(data, loading, cb) {
      if(!loading) {
        $.ajax({
          url: site_vars.ajax_url,
          method: 'POST',
          dataType: 'json',
          data: data,
          beforeSend: function() {
            loading = true;
            $("body").addClass("form-loading");
            $("[type=submit]").attr("disabled", "true");
            console.log("beforeSend");
          },
          success: function(res) {
            loading = false;
            $("body").removeClass("form-loading");
            cb(res);
          },
          error: function(err) {
            loading = false;
            $("body").removeClass("form-loading");
            console.log(err);
          }
        })
      }
    }
  });
})(jQuery);
