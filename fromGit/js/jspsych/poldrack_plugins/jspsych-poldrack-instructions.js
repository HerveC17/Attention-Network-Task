/* jspsych-text.js
 * Josh de Leeuw
 *
 * This plugin displays text (including HTML formatted strings) during the experiment.
 * Use it to show instructions, provide performance feedback, etc...
 *
 * documentation: docs.jspsych.org
 *
 * Modification by Ian Eisenberg - changed navigation buttons such that the "Next" button reads
 * "End Instructions" on the last page
 */

jsPsych.plugins['poldrack-instructions'] = (function() {

  var plugin = {};

  // Début de copie depuis 6.3.0
  //
  plugin.info = {
    name: 'poldrack-instructions',
    description: '',
    parameters: {
      pages: {
        type: jsPsych.plugins.parameterType.HTML_STRING,
        pretty_name: 'Pages',
        default: undefined,
        array: true,
        description: 'Each element of the array is the content for a single page.'
      },
      key_forward: {
        type: jsPsych.plugins.parameterType.KEY,
        pretty_name: 'Key forward',
        default: 'ArrowRight',
        description: 'The key the subject can press in order to advance to the next page.'
      },
      key_backward: {
        type: jsPsych.plugins.parameterType.KEY,
        pretty_name: 'Key backward',
        default: 'ArrowLeft',
        description: 'The key that the subject can press to return to the previous page.'
      },
      allow_backward: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Allow backward',
        default: true,
        description: 'If true, the subject can return to the previous page of the instructions.'
      },
      allow_keys: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Allow keys',
        default: true,
        description: 'If true, the subject can use keyboard keys to navigate the pages.'
      },
      show_clickable_nav: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Show clickable nav',
        default: false,
        description: 'If true, then a "Previous" and "Next" button will be displayed beneath the instructions.'
      },
      show_page_number: {
          type: jsPsych.plugins.parameterType.BOOL,
          pretty_name: 'Show page number',
          default: false,
          description: 'If true, and clickable navigation is enabled, then Page x/y will be shown between the nav buttons.'
      },
      page_label: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Page label',
        default: 'Page',
        description: 'The text that appears before x/y (current/total) pages displayed with show_page_number'
      },      
      button_label_previous: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Button label previous',
        default: 'Previous',
        description: 'The text that appears on the button to go backwards.'
      },
      button_label_next: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Button label next',
        default: 'Next',
        description: 'The text that appears on the button to go forwards.'
      }
    }
  }
  // FIN DE COPIE

  plugin.trial = function(display_element, trial) {

    trial.key_forward = trial.key_forward || 'rightarrow';
    trial.key_backward = trial.key_backward || 'leftarrow';
    trial.allow_backward = (typeof trial.allow_backward === 'undefined') ? true : trial.allow_backward;
    trial.allow_keys = (typeof trial.allow_keys === 'undefined') ? true : trial.allow_keys;
    trial.show_clickable_nav = (typeof trial.show_clickable_nav === 'undefined') ? false : trial.show_clickable_nav;

    // if any trial variables are functions
    // this evaluates the function and replaces
    // it with the output of the function
    //trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial); // EISENBERG

    var current_page = 0;

    var view_history = [];

    var start_time = performance.now(); // Eisenberg : var start_time = (new Date()).getTime();

    var last_page_update_time = start_time;

    // buttonListener probablement supprimé par Eisenberg
    //

    function show_current_page() {
      
      if (trial.show_clickable_nav) {

        var nav_html = "<div class='jspsych-instructions-nav'>";
        if (trial.pages.length == 1) {
          nav_html += "<button id='jspsych-instructions-next'>Fin des consignes</button>"
        } else {
          if (current_page == 0) {
            nav_html += "<button id='jspsych-instructions-next'>Suivant</button>"
          } else if (current_page == trial.pages.length - 1) {
            if (trial.allow_backward) {
              nav_html += "<button id='jspsych-instructions-back'>Retour</button>";
            }
            nav_html += "<button id='jspsych-instructions-next'>Fin des consignes</button>"
          } else {
            if (trial.allow_backward) {
              nav_html += "<button id='jspsych-instructions-back'>Retour</button>";
            }
            nav_html += "<button id='jspsych-instructions-next'>Suivant</button>"
          }
        }
        nav_html += "</div>"

        // Place nav_html into the container div for the instruction page and display
        if (trial.pages[current_page].slice(-6) == '</div>') {
          display_element.innerHTML = trial.pages[current_page].slice(0, -6) + nav_html + '</div>'
        } else {
          display_element.innerHTML = trial.pages[current_page] + nav_html + '</div>'
        }

        if (current_page != 0 && trial.allow_backward) {
          $('#jspsych-instructions-back').on('click', function () {
            clear_button_handlers();
            back();
          });
        }

        $('#jspsych-instructions-next').on('click', function () {
          clear_button_handlers();
          next();
        });

    //   display_element.innerHTML = html;
    //   if (current_page != 0 && trial.allow_backward) {
    //     display_element.querySelector('#jspsych-instructions-back').addEventListener('click', btnListener);
    //   }

    //   display_element.querySelector('#jspsych-instructions-next').addEventListener('click', btnListener);
    // } else {
    //   if (trial.show_page_number && trial.pages.length > 1) {
    //     // page numbers for non-mouse navigation
    //     html += "<div class='jspsych-instructions-pagenum'>" + pagenum_display + "</div>"
    //   }
    //   display_element.innerHTML = html;
    }
  }

    // Version Eisenberg
    //
    // function show_current_page() {
    //   if (trial.show_clickable_nav) {
    
    //     var nav_html = "<div class='jspsych-instructions-nav'>";
    //     if (trial.pages.length == 1) {
    //       nav_html += "<button id='jspsych-instructions-next'>Fin des consignes</button>"
    //     } else {
    //       if (current_page == 0) {
    //         nav_html += "<button id='jspsych-instructions-next'>Suivant</button>"
    //       } else if (current_page == trial.pages.length - 1) {
    //         if (trial.allow_backward) {
    //           nav_html += "<button id='jspsych-instructions-back'>Retour</button>";
    //         }
    //         nav_html += "<button id='jspsych-instructions-next'>Fin des consignes</button>"
    //       } else {
    //         if (trial.allow_backward) {
    //           nav_html += "<button id='jspsych-instructions-back'>Retour</button>";
    //         }
    //         nav_html += "<button id='jspsych-instructions-next'>Suivant</button>"
    //       }
    //     }
    //     nav_html += "</div>"

    //     // Place nav_html into the container div for the instruction page and display
    //     if (trial.pages[current_page].slice(-6) == '</div>') {
    //       display_element.html(trial.pages[current_page].slice(0, -6) + nav_html + '</div>')
    //     } else {
    //       display_element.html(trial.pages[current_page] + nav_html + '</div>')
    //     }


    //     if (current_page != 0 && trial.allow_backward) {
    //       $('#jspsych-instructions-back').on('click', function() {
    //         clear_button_handlers();
    //         back();
    //       });
    //     }

    //     $('#jspsych-instructions-next').on('click', function() {
    //       clear_button_handlers();
    //       next();
    //     });
    //   }
    // }

    function clear_button_handlers() {
      $('#jspsych-instructions-next').off('click');
      $('#jspsych-instructions-back').off('click');
    }

    function next() {

      add_current_page_to_view_history()

      current_page++;

      // if done, finish up...
      if (current_page >= trial.pages.length) {
        endTrial();
      } else {
        show_current_page();
      }

    }

    function back() {

      add_current_page_to_view_history()

      current_page--;

      show_current_page();
    }

    function add_current_page_to_view_history() {

      var current_time = performance.now(); // Eisenberg : var current_time = (new Date()).getTime();

      var page_view_time = current_time - last_page_update_time;

      view_history.push({
        page_index: current_page,
        viewing_time: page_view_time
      });

      last_page_update_time = current_time;
    }

    function endTrial() {

      if (trial.allow_keys) {
        jsPsych.pluginAPI.cancelKeyboardResponse(keyboard_listener);
      }

      var trial_data = {
        "view_history": JSON.stringify(view_history),
        "rt": performance.now() - start_time // Eisenberg : "rt": (new Date()).getTime() - start_time
      };

      jsPsych.finishTrial(trial_data);
    }

    var after_response = function(info) {

      // have to reinitialize this instead of letting it persist to prevent accidental skips of pages by holding down keys too long
      keyboard_listener = jsPsych.pluginAPI.getKeyboardResponse({
        callback_function: after_response,
        valid_responses: [trial.key_forward, trial.key_backward],
        rt_method: 'performance', // Eisenberg : 'date' mais 6.3.0 utilise 'performance' ??
        persist: false,
        allow_held_key: false
      });
      // check if key is forwards or backwards and update page
      if (jsPsych.pluginAPI.compareKeys(info.key, trial.key_backward)) {
        if (current_page !== 0 && trial.allow_backward) {
          back();
        }
      }

      if (jsPsych.pluginAPI.compareKeys(info.key, trial.key_forward)) {
        next();
      }

      // Eisenberg
      //
      // if (info.key === trial.key_backward || info.key === jsPsych.pluginAPI.convertKeyCharacterToKeyCode(
      //     trial.key_backward)) {
      //   if (current_page !== 0 && trial.allow_backward) {
      //     back();
      //   }
      // }

      // if (info.key === trial.key_forward || info.key === jsPsych.pluginAPI.convertKeyCharacterToKeyCode(
      //     trial.key_forward)) {
      //   next();
      // }

    };

    show_current_page();

    if (trial.allow_keys) {
      var keyboard_listener = jsPsych.pluginAPI.getKeyboardResponse({
        callback_function: after_response,
        valid_responses: [trial.key_forward, trial.key_backward],
        rt_method: 'performance', // Eisenberg : 'date' mais 6.3.0 utilise 'performance' ??
        persist: false
      });
    }
  };

  return plugin;
})();