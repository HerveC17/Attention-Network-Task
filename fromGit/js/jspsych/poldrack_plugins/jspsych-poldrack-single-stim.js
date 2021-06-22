/**
 * jspsych-poldrack-single-stim
 * Josh de Leeuw
 *
 * plugin for displaying a stimulus and getting a keyboard response
 *
 * documentation: docs.jspsych.org
 * 
 * Modified by Ian Eisenberg to record more trial parameters
 **/


jsPsych.plugins["poldrack-single-stim"] = (function() {

  var plugin = {};

  plugin.info = {
    name: 'poldrack-single-stim',
    description: '',
    parameters: {
      stimulus: {
        type: jsPsych.plugins.parameterType.HTML_STRING,
        pretty_name: 'Stimulus',
        default: undefined,
        description: 'The HTML content to be displayed.'
      },
      choices: {
        type: jsPsych.plugins.parameterType.STRING ,
        pretty_name: 'Choices',
        default: [],
        description: 'Choices'
      },
      response_ends_trial: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Response ends trial',
        default: false,
        description: 'Response ends trial'
      },
      timing_stim: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Timing stim',
        default: -1,
        description: 'Timing stim'
      },
      timing_response: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Timing_response',
        default: -1,
        description: 'Timing_response'
      },
      timing_post_trial: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Timing post trial',
        default: 0,
        description: 'Timing post trial'
      },
      is_html: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Is HTML',
        default: false,
        description: 'Is HTML'
      },
      prompt: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Prompt',
        default: "",
        description: 'Prompt'
      }
    }
  }

  jsPsych.pluginAPI.registerPreload('poldrack-single-stim', 'stimulus', 'image');

  plugin.trial = function(display_element, trial) {

    // if any trial variables are functions
    // this evaluates the function and replaces
    // it with the output of the function
    //trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);

    // set default values for the parameters
    trial.choices = trial.choices || [];
    trial.response_ends_trial = (typeof trial.response_ends_trial == 'undefined') ? false : trial.response_ends_trial;
    trial.timing_stim = trial.timing_stim || -1;
    trial.timing_response = trial.timing_response || -1;
    trial.timing_post_trial = (typeof trial.timing_post_trial === 'undefined') ? 1000 : trial.timing_post_trial;
    trial.is_html = (typeof trial.is_html == 'undefined') ? false : trial.is_html;
    trial.prompt = trial.prompt || "";

    // this array holds handlers from setTimeout calls that need to be cleared if the trial ends early
    //
    //var setTimeoutHandlers = [];

    // // ERREUR PROBABLE ICI
    // //     display stimulus
    // if (!trial.is_html) {
    //   display_element.append($('<img>', {
    //     src: trial.stimulus,
    //     id: 'jspsych-poldrack-single-stim-stimulus'
    //   }));
    // } else {
    //   display_element.append($('<div>', {
    //     html: trial.stimulus,
    //     id: 'jspsych-poldrack-single-stim-stimulus'
    //   }));
    // }

    // Affiche le stimulus
    //
    display_element.innerHTML = '<div id="poldrack-single-stim-stimulus" class="poldrack-single-stim-stimulus">'+trial.stimulus+'</div>';

    // Hide image after time if the timing parameter is set
    //
    // This is simply a call to the standard setTimeout function in JavaScript with the added
    // benefit of registering the setTimeout call in a central list.
    // This is useful for scenarios where some other event (the trial ending, aborting the experiment)
    // should stop the execution of queued timeouts.
    //
    if (trial.timing_stim !== -1) { // Etait à null mais par défaut vaut -1
      jsPsych.pluginAPI.setTimeout(function() {     // jsPsych.pluginAPI.setTimeout(callback, delay)
        display_element.innerHTML = '';  //display_element.querySelector('#poldrack-single-stim-stimulus').style.visibility = 'hidden';
      }, trial.timing_stim);                        // Time to wait in milliseconds
    }

    // if prompt is set, show prompt
    if (trial.prompt !== null) {  // Chaîne de caractères vide par défaut
      display_element.innerHTML += trial.prompt; // display_element.append(trial.prompt);
    }

    // store response
    var response = {
      rt: -1,
      key: -1
    };

    // function to end trial when it is time
    var end_trial = function() {

      // // kill any remaining setTimeout handlers
      // for (var i = 0; i < setTimeoutHandlers.length; i++) {
      //   clearTimeout(setTimeoutHandlers[i]);
      // }

      // kill any remaining setTimeout handlers
      jsPsych.pluginAPI.clearAllTimeouts();

      // clear keyboard listener
      jsPsych.pluginAPI.cancelAllKeyboardResponses();
      
      //calculate stim and block duration
      var stim_duration = trial.timing_stim
      var block_duration = trial.timing_response
      if (trial.response_ends_trial & response.rt != -1) {
          block_duration = response.rt
      }
      if (stim_duration != -1) {
        stim_duration = Math.min(block_duration,trial.timing_stim)
      } else {
        stim_duration = block_duration
      }

      // gather the data to store for the trial
      var trial_data = {
        "rt": response.rt,
        "stimulus": trial.stimulus,
        "key_press": response.key,
        "possible_responses": trial.choices,
        "stim_duration": stim_duration,
        "block_duration": block_duration,
        "timing_post_trial": trial.timing_post_trial
      };

      // jsPsych.data.write(trial_data);   // Pourquoi l'avait-on commentée avant ?

      // clear the display
      display_element.innerHTML = '';

      // move on to the next trial
      jsPsych.finishTrial(trial_data);
    };

    // function to handle responses by the subject
    var after_response = function(info) {

      // after a valid response, the stimulus will have the CSS class 'responded'
      // which can be used to provide visual feedback that a response was recorded
      $("#jspsych-poldrack-single-stim-stimulus").addClass('responded');

      // only record the first response
      if (response.key == -1) {
        response = info;
      }

      if (trial.response_ends_trial) {
        end_trial();
      }
    };

    // start the response listener
    if (JSON.stringify(trial.choices) != JSON.stringify(["none"])) {
      var keyboardListener = jsPsych.pluginAPI.getKeyboardResponse({
        callback_function: after_response,
        valid_responses: trial.choices,
        rt_method: 'performance', // 'date'
        persist: false,
        allow_held_key: false
      });
    }

    // hide image if timing is set
    // if (trial.timing_stim > 0) {
    //   var t1 = setTimeout(function() {
    //     $('#jspsych-poldrack-single-stim-stimulus').css('visibility', 'hidden');
    //   }, trial.timing_stim);
    //   setTimeoutHandlers.push(t1);
    // }
    if (trial.timing_stim > 0) { // 0 dans le fichier original...
      setTimeout(function() {
        $('#jspsych-poldrack-single-stim-stimulus').css('visibility', 'hidden');
      }, trial.timing_stim);
    }

    // end trial if time limit is set
    // if (trial.timing_response > 0) {
    //   var t2 = setTimeout(function() {
    //     end_trial();
    //   }, trial.timing_response);
    //   setTimeoutHandlers.push(t2);
    // }
    if (trial.timing_response > 0) {
       setTimeout(function() {
        end_trial();
      }, trial.timing_response);
    }
  };

  return plugin;
})();