/* jspsych-text.js
 * Josh de Leeuw
 *
 * This plugin displays text (including HTML formatted strings) during the experiment.
 * Use it to show instructions, provide performance feedback, etc...
 *
 * documentation: docs.jspsych.org
 *
 * Modified by Ian Eisenberg to allow timing response to be set
 */

jsPsych.plugins["poldrack-text"] = (function() {

  var plugin = {};

  plugin.info = {
    name: 'poldrack-text',
    description: '',
    parameters: {
      timing_response: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Timing response',
        default: -1,
        description: 'How long to respond'
      },
      // cont_key: {

      // },
      timing_post_trial: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Timing post trial',
        default: null,
        description: 'Timing after response'
      },
      // data: {

      // },
      text: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Text',
        default: null,
        description: 'IDK'
      }
    }
  }

  plugin.trial = function(display_element, trial) {

    // trial.timing_response = trial.timing_response || -1; // ajouté par eisenberg
    trial.cont_key = trial.cont_key || [];
    // trial.timing_post_trial = (typeof trial.timing_post_trial === 'undefined') ? 1000 : trial.timing_post_trial; // ajouté par eisenberg

    // if any trial variables are functions
    // this evaluates the function and replaces
    // it with the output of the function
    //trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);

    // set the HTML of the display target to replaced_text.
    display_element.innerHTML = trial.text;


    var after_response = function(info) {
      clearTimeout(t1); // eisenberg
      display_element.innerHTML = ''; // clear the display

      if (typeof keyboardListener !== 'undefined') {
        jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
      }

      var block_duration = trial.timing_response
      if (info.rt != -1) {
          block_duration = info.rt
      }

      var trialdata = {
        "text": trial.text,
        "rt": info.rt,
        "key_press": info.key,
        "block_duration": block_duration,
        "timing_post_trial": trial.timing_post_trial
      }

      jsPsych.finishTrial(trialdata);

    };

    var mouse_listener = function(e) {
      clearTimeout(t1); // eisenberg
      var rt = performance.now() - start_time;

      display_element.unbind('click', mouse_listener);

      after_response({
        key: 'mouse',
        rt: rt
      });

    };

    // check if key is 'mouse' 
    if (trial.cont_key == 'mouse') {
      display_element.click(mouse_listener);
      var start_time = performance.now();
    } else {
      var keyboardListener = jsPsych.pluginAPI.getKeyboardResponse({
        callback_function: after_response,
        valid_responses: trial.cont_key,
        rt_method: 'performance', // 'date'
        persist: false,
        allow_held_key: false
      });
    }

    // end trial if time limit is set (Eisenberg)
    if (trial.timing_response > 0) {
      var t1 = setTimeout(function() {
        after_response({
          key: -1,
          rt: -1
        });
      }, trial.timing_response);
    }

  };

  return plugin;
})();
