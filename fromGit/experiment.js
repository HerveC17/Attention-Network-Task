/* ************************************ */
/* Define helper functions */
/* ************************************ */

function getVersion() {
	var version = jsPsych.version();
	console.log(version);
}

function evalAttentionChecks() {
	var check_percent = 1
	if (run_attention_checks) {
		var attention_check_trials = jsPsych.data.getTrialsOfType('attention-check')
		var checks_passed = 0
		for (var i = 0; i < attention_check_trials.length; i++) {
			if (attention_check_trials[i].correct === true) {
				checks_passed += 1
			}
		}
		check_percent = checks_passed / attention_check_trials.length
	}
	return check_percent
}

/* ********************************************* */
/*                                               */
/*   Compute all parameters assessing the three  */
/*   attention network.                          */
/*                                               */
/*   Modified by Thibault CACI on june 2021      */
/*   (for JsPsych 6.3.0)                         */
/*                                               */
/*********************************************** */

function assessPerformance() {
	/* Function to calculate the "credit_var", which is a boolean used to
	credit individual experiments in expfactory. 
	 */

	// Extrait les trials correspondant aux essais
	//
	jsPsych.data.displayData()

	// Filtre les trials correspondant à des réponses pendant la phase de test
	//
	var experiment_data = jsPsych.data.get().filter({exp_stage:'test', trial_id:'stim'})
	//
	// Calcule 	1. Le nombre de réponses correctes
	//			2. Le nombre de réponses incorrectes
	//			3. Le nombre d'absence de réponses (RT = 0)
	//			4. La médiane de l'ensemble des temps de réaction
	//			5. Les médianes selon les 4 possibilités de cue
	//			6. Les médianes selon les 2 possibilités de flanker (car neutre exclu)
	//
	var correct_count = 0
	var incorrect_count = 0
	var omission_count = 0
	var rt_correct = []
	var rt_correct_nocue = []
	var rt_correct_double = []
	var rt_correct_spatial = []
	var rt_correct_center = []
	var rt_correct_congruent = []
	var rt_correct_incongruent = []
	
	for (var i=0; i<experiment_data.count(); i++) {							
		rt = experiment_data.select('rt').values[i]
		if (rt == 0) {
			omission_count++
		}
		else if (experiment_data.select('correct').values[i] === true) {
				correct_count++
				rt_correct.push(rt)
				//
				switch (experiment_data.select('cue').values[i]) {
					case 'nocue':
						rt_correct_nocue.push(rt)	
						break;
					case 'double':
						rt_correct_double.push(rt)
						break;
					case 'spatial':
						rt_correct_spatial.push(rt)
						break;
					case 'center':
						rt_correct_center.push(rt)
						break;
				}
				//
				switch (experiment_data.select('flanker_type').values[i]) {
					case 'congruent':
						rt_correct_congruent.push(rt)
						break;
					case 'incongruent':
						rt_correct_incongruent.push(rt)
						break;
				}
			}
			else { incorrect_count++ }
	}
	
	if (rt_correct!=0) {
		var median_rt = math.median(rt_correct)
		var se_rt = median_rt/math.sqrt(correct_count)
	} else {
		var median_rt = -999
		var se_rt = -999
	}
	
	if (rt_correct_nocue.length!=0) {
		var median_nocue = math.median(rt_correct_nocue)
	} else { var median_nocue = -999 }

	if (rt_correct_double.length!=0) {
		var median_double = math.median(rt_correct_double)
	} else { var median_double = -999 }

	if (rt_correct_center.length!=0) {
		var median_center = math.median(rt_correct_center)
	} else { var median_center = -999 }

	if (rt_correct_spatial.length!=0) {
		var median_spatial = math.median(rt_correct_spatial)
	} else { var median_spatial = -999 }

	if (rt_correct_congruent.length!=0) {
		var median_congruent = math.median(rt_correct_congruent)
	} else { var median_congruent = -999 }

	if (rt_correct_incongruent.length!=0) {
		var median_incongruent = math.median(rt_correct_incongruent)
	} else { var median_incongruent = -999 }

	// Sortie provisoire sur la console
	//
	console.log("Nombre d'omissions: ", omission_count)
	console.log("Nombre de réponses: ", correct_count + incorrect_count)
	console.log("Nombre de réponses correctes au total: ", correct_count)
	console.log("Nombre d'erreurs au total: ", incorrect_count)
	console.log("Médianes des RT pour réponses correctes: ", median_rt)
	console.log("ES des médianes des RT pour les réponses correctes: ", se_rt)
//
	if (median_nocue==-999 || median_double==-999) {
		console.log("La variable Alerte ne peut être calculée...")
	} else { console.log("Alerte: ", median_nocue - median_double) }
//
	if (median_center==-999 || median_spatial==-999) {
		console.log("La variable Orientation ne peut être calculée...")
	} else { console.log("Orientation: ", median_center - median_spatial) }
//
	if (median_incongruent==-999 || median_congruent==-999) {
		console.log("La variable Conflict ne peut être calculée...")
	} else { console.log("Conflict: ", median_incongruent - median_congruent) }
}

var getInstructFeedback = function() {
	return '<div class = centerbox><p class = center-block-text>' + feedback_instruct_text +
		'</p></div>'
}

var post_trial_gap = function() {	// Modified by Thibault CACI for JsPsych 6.3.0
	var rt = jsPsych.data.getLastTrialData().select('rt').values[0]
	var D1 = jsPsych.data.get().last(4).select('block_duration').values[0]
	return 3500 - D1 - rt
}

var get_RT = function() {
	var curr_trial = jsPsych.progress().current_trial_global
	return jsPsych.data.getData()[curr_trial].rt
}

var getInstructFeedback = function() {
	return '<div class = centerbox><p class = center-block-text>' + feedback_instruct_text +
		'</p></div>'
}

/* ************************************ */
/* Define experimental variables        */
/* ************************************ */
// generic task variables
var run_attention_checks = false
var attention_check_thresh = 0.65
var sumInstructTime = 0 //ms
var instructTimeThresh = 1 ///in seconds
var credit_var = true

// task specific variables
/* set up stim: location (2) * cue (4) * direction (2) * condition (3) */
var locations = ['up', 'down']
var cues = ['nocue', 'center', 'double', 'spatial']
var current_trial = 0
var exp_stage = 'practice' // Variable dans excel
var test_stimuli = []
var choices = ['ArrowLeft', 'ArrowRight']	// Flèche gauche et flèche droite (REMPLACEMENT 37 ET 39 DANS V6.3.0)

// Preload images for Child ANT and for Classical ANT
//
var isChildVersion = localStorage.getItem('version');
let path = 'images/'
var images = [path + 'right_arrow.png', path + 'left_arrow.png', path + 'no_arrow.png', /*
		*/    path + 'right_fish.png', path + 'left_fish.png', path + 'no_fish.png']
if (isChildVersion=="true") {
	var offset0=3, offset1=4, offset2=5;
	var theClass="<div class=centerboxBlue>";
	}
	else {
		var offset0=0, offset1=1, offset2=2;
		var theClass="<div class=centerbox>";
	}
jsPsych.pluginAPI.preloadImages(images);

for (l = 0; l < locations.length; l++) { 	// Pour chacune des deux emplacements ("en haut" ou "en bas")
	var loc = locations[l]
	for (ci = 0; ci < cues.length; ci++) { 	// Pour chacun des types de cue: cues.length ("nocue", "center", "double", "spatial")
		var c = cues[ci]
		stims = [{ // Neutral: target turned left
			stimulus: theClass + '<div class = ANT_text>+</div></div><div class = ANT_' + loc + // "locup" ou "locdown"
				'><img class = ANT_img src = ' + images[offset2] + '></img><img class = ANT_img src = ' +
				images[offset2] + '></img><img class = ANT_img src = ' + images[offset1] +
				'></img><img class = ANT_img src = ' + images[offset2] + '></img><img class = ANT_img src = ' + images[offset2] +
				'></img></div></div>',
			data: {
				correct_response: 'ArrowLeft',
				flanker_middle_direction: 'left',
				flanker_type: 'neutral',
				flanker_location: loc,
				cue: c, 
				trial_id: 'stim'
			}
		}, { // Congruent: all arrows/fishes turned left
			stimulus: theClass + '<div class = ANT_text>+</div></div><div class = ANT_' + loc +
				'><img class = ANT_img src = ' + images[offset1] + '></img><img class = ANT_img src = ' + images[offset1] +
				'></img><img class = ANT_img src = ' + images[offset1] + '></img><img class = ANT_img src = ' + images[offset1] +
				'></img><img class = ANT_img src = ' + images[offset1] + '></img></div></div>',
			data: {
				correct_response: 'ArrowLeft',
				flanker_middle_direction: 'left',
				flanker_type: 'congruent',
				flanker_location: loc,
				cue: c, 
				trial_id: 'stim'
			}
		}, { // Incongruent: target turned left, others turned right
			stimulus: theClass + '<div class = ANT_text>+</div></div><div class = ANT_' + loc +
				'><img class = ANT_img src = ' + images[offset0] + '></img><img class = ANT_img src = ' + images[offset0] +
				'></img><img class = ANT_img src = ' + images[offset1] + '></img><img class = ANT_img src = ' + images[offset0] +
				'></img><img class = ANT_img src = ' + images[offset0] + '></img></div></div>',
			data: {
				correct_response: 'ArrowLeft',
				flanker_middle_direction: 'left',
				flanker_type: 'incongruent',
				flanker_location: loc,
				cue: c, 
				trial_id: 'stim'
			}
		}, { // Neutral: target turned right 
			stimulus: theClass + '<div class = ANT_text>+</div></div><div class = ANT_' + loc +
				'><img class = ANT_img src = ' + images[offset2] + '></img><img class = ANT_img src = ' + images[offset2] +
				'></img><img class = ANT_img src = ' + images[offset0] + '></img><img class = ANT_img src = ' + images[offset2] +
				'></img><img class = ANT_img src = ' + images[offset2] + '></img></div></div>',
			data: {
				correct_response: 'ArrowRight',
				flanker_middle_direction: 'right',
				flanker_type: 'neutral',
				flanker_location: loc,
				cue: c, 
				trial_id: 'stim'
			}
		}, { // Congruent: all arrows/fishes turned right
			stimulus: theClass + '<div class = ANT_text>+</div></div><div class = ANT_' + loc +
				'><img class = ANT_img src = ' + images[offset0] + '></img><img class = ANT_img src = ' + images[offset0] +
				'></img><img class = ANT_img src = ' + images[offset0] + '></img><img class = ANT_img src = ' + images[offset0] +
				'></img><img class = ANT_img src = ' + images[offset0] + '></img></div></div>',
			data: {
				correct_response: 'ArrowRight',
				flanker_middle_direction: 'right',
				flanker_type: 'congruent',
				flanker_location: loc,
				cue: c, 
				trial_id: 'stim'
			}
		}, { // Incongruent: target turned right
			stimulus: theClass + '<div class = ANT_text>+</div></div><div class = ANT_' + loc +
				'><img class = ANT_img src = ' + images[offset1] + '></img><img class = ANT_img src = ' + images[offset1] +
				'></img><img class = ANT_img src = ' + images[offset0] + '></img><img class = ANT_img src = ' + images[offset1] +
				'></img><img class = ANT_img src = ' + images[offset1] + '></img></div></div>',
			data: {
				correct_response: 'ArrowRight',
				flanker_middle_direction: 'right',
				flanker_type: 'incongruent',
				flanker_location: loc,
				cue: c, 
				trial_id: 'stim'
			}
		}]
		for (i = 0; i < stims.length; i++) {
			test_stimuli.push(stims[i])
		}
	}
}

// Set up 24 practice trials.
//
// Included all no_cue up trials, center cue up trials, double cue down trials,
// and 6 spatial trials (3 up, 3 down)
// 
var practice_block = jsPsych.randomization.repeat(test_stimuli.slice(0, 12).concat(test_stimuli.slice(18, 21)).concat(test_stimuli.slice(36, 45)), 1, true);

// Set up repeats for three test blocks
//
var block1_trials = jsPsych.randomization.repeat($.extend(true, [], test_stimuli), 1, true);
var block2_trials = jsPsych.randomization.repeat($.extend(true, [], test_stimuli), 1, true);
var block3_trials = jsPsych.randomization.repeat($.extend(true, [], test_stimuli), 1, true);
var blocks = [block1_trials, block2_trials, block3_trials]

/* ************************************ */
/* Set up jsPsych blocks 				*/
/* ************************************ */
// Set up attention check node
var attention_check_block = {
	type: 'attention-check',
	timing_response: 180000,
	response_ends_trial: true,
	timing_post_trial: 200
}

var attention_node = {
	timeline: [attention_check_block],
	conditional_function: function() {
		return run_attention_checks
	}
}

//Set up post task questionnaire
var post_task_block = {
   type: 'survey-text',
   data: {
       trial_id: "post task questions"
   },
   questions: ['<p class = center-block-text style = "font-size: 20px">Veuillez résumer ce que l\'on vous a demandé de faire dans cette tâche.</p>',
              '<p class = center-block-text style = "font-size: 20px">Avez-vous des commentaires sur cette tâche?</p>'],
   rows: [15, 15],
   columns: [60,60]
};

/* define static blocks */
var test_intro_block = {
	type: 'poldrack-text',
	text: '<div class = centerbox><p class = center-block-text>Le test va maintenant commencer. Appuyez sur la touche <strong>entrée</strong> pour commencer.</p></div>',
	cont_key: ['Enter'], // remplacé 13 par Enter
	data: {
		trial_id: "intro",
		exp_stage: "test"
	},
	timing_response: 180000,
	timing_post_trial: 1000,
	on_finish: function() {
		exp_stage = 'test'
	}
};

var end_block = {
	type: 'poldrack-text',
	text: '<div class = centerbox><p class = center-block-text>Merci d\'avoir terminé cette tâche !</p><p class = center-block-text>Appuyez sur la touche <strong>enter</strong> pour continuer.</p></div>',
	cont_key: ['Enter'], // remplacé 13 par Enter
	data: {
		trial_id: "end",
    	exp_id: 'attention_network_task'
	},
	timing_response: 180000,
	timing_post_trial: 0,
	on_finish: assessPerformance	// Calcule les résultats les affiche
};

var feedback_instruct_text =
	'Bienvenue sur le test. Le test va durer environ 15 minutes. Appuyez sur la touche <strong>entrée</strong> pour commencer.'

// This ensures that the subject does not read through the instructions too quickly.
// If they do it too quickly, then we will go over the loop again.
//
var feedback_instruct_block = {
	type: 'poldrack-text',
	cont_key: ['Enter'], // remplacé 13 par Enter
	text: getInstructFeedback,
	data: {
		trial_id: 'instruction'
	},
	timing_post_trial: 0,
	timing_response: 180000
};

if (isChildVersion=="true") {
	document.body.style.backgroundColor = 'rgb(0,253,255)';	// Background is blue for the child version
	var fixationDuration = 450; // milliseconds
	var cueDuration = 150;		// milliseconds
	var instructions_block = {
		type: 'poldrack-instructions',
		pages: [	/* Enlevé <p class=block-text> le 30/07/2021 par HC */
			'<div class=centerbox>Le jeu consiste à nourrir un petit poisson en appuyant sur la touche qui correspond au côté vers lequel il est tourné.<br/><br/>Si tu vois que le poisson regarde à droite, il faut que tu appuies le plus vite possible sur la flèche droite &rarr;.<br/><br/><img class=ANT_imginstructions src=' + images[3] + '><br/><br/>Si tu vois qu’il regarde à gauche, il faut que tu appuies le plus vite possible sur la flèche gauche &larr;.<br/><br/><img class=ANT_img src=' + images[4] + '></div>',
			'<div class=centerbox>Quelquefois le petit poisson est tout seul mais d\’autres fois il nage entouré de copains poissons.<br/><br/>Tu dois toujours faire attention au côté vers lequel regarde le poisson du <strong>milieu</strong> et ne jamais t\’occuper du côté vers lequel regardent les copains poissons.<br/><br/>Tu dois appuyer sur la flèche droite &rarr; si tu vois ceci<br/><br/><img class=ANT_img src='+ images[3] +'><img class=ANT_img src=' + images[3] + '><img class=ANT_img src=' + images[3] + '><img class=ANT_img src=' + images[3] + '><img class=ANT_img src=' + images[3] + '><br/><br/>Tu dois <strong>aussi</strong> appuyer sur la flèche droite &rarr; vois cela!<br/><br/><img class=ANT_img src='+ images[4] +'><img class=ANT_img src=' + images[4] + '><img class=ANT_img src=' + images[3] + '><img class=ANT_img src=' + images[4] + '><img class=ANT_img src=' + images[4] + '></div>',
			'<div class=centerbox>Tu dois appuyer sur la flèche gauche &larr; si tu vois ceci<br/><br/><img class=ANT_img src=' + images[4] + '><img class=ANT_img src=' + images[4] + '><img class=ANT_img src=' + images[4]+'><img class=ANT_img src=' + images[4]+'><img class=ANT_img src=' + images[4] + '><br/><br/>Tu dois <strong>aussi</strong> appuyer sur la flèche gauche &larr; si tu vois cela!<br/><br/><img class=ANT_img src=' + images[3] + '><img class=ANT_img src=' + images[3] + '><img class=ANT_img src=' + images[4]+'><img class=ANT_img src=' + images[3]+'><img class=ANT_img src=' + images[3] + '><br/><br/>Tu as bien compris ce qu\'il faut faire ?</div>',
			'<div class=centerbox>Pendant toute la durée du jeu, tu devras bien fixer du regard la croix au milieu de l’écran et réagir le plus rapidement possible quand tu verras apparaître le poisson ou un groupe de poissons. Une étoile t\'indiquera l\'endroit (au dessus ou en dessous) où va apparaître le poisson ou un groupe de poissons, mais parfois il y aura une étoile sur la croix ou deux étoiles (au dessus et en dessous de la croix) et tu devras faire très attention.<br/><br/>Pendant toute la durée du jeu, la webcam de l’ordinateur enregistrera le point que tu regardes sur l’écran (la croix, un poisson ou autre chose). Cela nous permettra de mieux mesurer l\'attention que tu portes au jeu.<br/><br/>Avant de jouer, il faudra apprendre à la caméra à suivre ton regard. Cela prendra quelques secondes seulement.<br/><br/>Ensuite, tu pourras t\'entraîner avant de jouer tout seul pour de vrai et pouvoir marquer des points.<br/><br/>Clique pour régler la caméra.</div>'
		],
		allow_keys: false,
		data: {
			trial_id: 'instruction'
		},
		show_clickable_nav: true,
		timing_post_trial: 1000
	};
}
else {
	document.body.style.backgroundColor = "white";	// Background is white for the classical version
	var fixationDuration = 400; // milliseconds
	var cueDuration = 100;		// milliseconds
	var instructions_block = {
		type: 'poldrack-instructions',
		pages: [
			'<div class = centerbox><class = block-text>Le test consiste à cliquer le plus vite possible sur la touche flèche gauche (&larr;) dès que vous voyez<br/><img class=ANT_img src=' + images[1] + '><br>et sur la touche flèche droite (&rarr;) dès que vous voyez<br/><br/><img class=ANT_img src=' + images[0] +'><br/>Cette flèche peut apparaître entourée de deux traits de part et d’autre ou de deux flèches de part et d’autre. Vous devez toujours faire attention à la flèche du <strong>milieu</strong> et appuyez sur la touche qui correspond à la direction vers laquelle elle pointe.</div>',
			'<div class = centerbox><class = block-text>Il faut appuyer sur la flèche droite (&larr;) si vous voyez l’une de ces trois configurations<img class=ANT_img src=' + images[1] + '><img class=ANT_img src=' + images[1] + '><img class=ANT_img src=' + images[1] + '><img class=ANT_img src=' + images[1] + '><img class=ANT_img src=' + images[1] + '><br/><img class=ANT_img src=' + images[0] + '><img class=ANT_img src=' + images[0] + '><img class=ANT_img src=' + images[1] + '><img class=ANT_img src=' + images[0] + '><img class=ANT_img src=' + images[0] + '><br/><img class=ANT_img src=' + images[2] + '><img class=ANT_img src=' + images[2] + '><img class=ANT_img src=' + images[1] + '><img class=ANT_img src=' + images[2] + '><img class=ANT_img src=' + images[2] + '></div>',
			'<div class = centerbox><class = block-text>Il faut appuyer sur la flèche droite (&rarr;) si vous voyez l’une de ces trois configurations<img class=ANT_img src=' + images[0] + '><img class=ANT_img src=' + images[0] + '><img class=ANT_img src=' + images[0] + '><img class=ANT_img src=' + images[0] + '><img class=ANT_img src=' + images[0] + '><br/><img class=ANT_img src=' + images[1] + '><img class=ANT_img src=' + images[1] + '><img class=ANT_img src=' + images[0] + '><img class=ANT_img src=' + images[1] + '><img class=ANT_img src=' + images[1] + '><br/><img class=ANT_img src=' + images[2] + '><img class=ANT_img src=' + images[2] + '><img class=ANT_img src=' + images[0] + '><img class=ANT_img src=' + images[2] + '><img class=ANT_img src=' + images[2] + '></div>',
			'<div class = centerbox><class = block-text>Tout au long du test, vous devrez fixer une croix au centre de l’écran.<br/><br/>Parfois, une étoile (*) apparaîtra juste avant les flèches soit au même endroit (au dessus ou en dessous de la croix), soit sur la croix elle-même, soit deux étoiles apparaîtront à la fois au dessus et en dessous de la croix.<br/><br/>Attention! il se peut qu\'aucune étoile n\'apparaissent mais, dans tous les cas, vous devrez appuyer sur la bonne touche le plus vite possible <strong>après</strong> que les flèches soient affichées.<br/><br/>Avant de commencer le test, vous suivrez une séance d\’entraînement. A chaque fois, le mot « Correct » ou « Incorrect » vous indiquera si vous avez bien respecté la consigne ou pas. Ensuite, pendant le test, aucune information ne vous sera donnée.</div>',
			'<div class = centerbox><class = block-text>Pendant toute la durée du test, la webcam de l\’ordinateur enregistrera le point que vous regardez sur l\’écran (la croix, une flèche ou autre chose). Cela nous permettra de mieux mesurer votre attention pendant la durée du test.<br/><br/>Avant la séance d\’entraînement au test proprement dit, il faudra apprendre à la caméra à suivre votre regard. Cela ne prendra que quelques secondes.<br/><br/>Cliquez pour paramétrer la webcam.</div>'
		],
		allow_keys: false,
		data: {
			trial_id: 'instruction'
		},
		show_clickable_nav: true,
		timing_post_trial: 1000
	};
}

var instruction_node = {
	timeline: [feedback_instruct_block, instructions_block],
	/* This function defines stopping criteria */
	loop_function: function(data) {
		for (i = 0; i < data.length; i++) {
			if ((data[i].trial_type == 'poldrack-instructions') && (data[i].rt != -1)) {
				rt = data[i].rt
				sumInstructTime = sumInstructTime + rt
			}
		}
		// if (sumInstructTime <= instructTimeThresh * 10) { // 1000
		// 	feedback_instruct_text =
		// 		'Vous avez lu les consignes trop rapidement. Veuillez prendre votre temps et assurez-vous de bien comprendre les consignes. Appuyez sur la touche <strong>enter</strong> pour continuer.'
		// 	return true
		// } else if (sumInstructTime > instructTimeThresh * 1000) {
			feedback_instruct_text = 'Vous en avez terminé avec les consignes. Appuyez sur la touche <strong>enter</strong> pour continuer.'
			return false
		//}
	}
}

var rest_block = {
	type: 'poldrack-text',
	text: '<div class = centerbox><p class = block-text>Prenez une pause ! Appuyez sur la touche <strong>enter</strong> pour reprendre.</p></div>',
	timing_response: 180000,
	cont_key: ['Enter'],
	data: {
		trial_id: "rest block"
	},
	timing_post_trial: 1000
};

var fixation = {
	type: 'poldrack-single-stim',
	stimulus: '<div class = centerbox><div class = ANT_text>+</div></div>',		// Affiche la "+" de fixation au centre
	is_html: true,
	choices: 'none',
	data: {
		trial_id: 'fixation'
	},
	timing_post_trial: 0,
	timing_stim: fixationDuration,		// 400 ms for adults, 450 ms for children
	timing_response: fixationDuration, 
	on_finish: function() {
		jsPsych.data.addDataToLastTrial({
			exp_stage: exp_stage
		})
	}
}

var no_cue = {
	type: 'poldrack-single-stim',
	stimulus: '<div class = centerbox><div class = ANT_text>+</div></div>',				// En fait, il affiche "+" sur la "+ de fixation
	is_html: true,
	choices: 'none',
	data: {
		trial_id: 'nocue'
	},
	timing_post_trial: 0,
	timing_stim: cueDuration,		// 100 ms for adults, 150 ms for children
	timing_response: cueDuration,
	on_finish: function() {
		jsPsych.data.addDataToLastTrial({
			exp_stage: exp_stage
		})
	}
}

var center_cue = {
	type: 'poldrack-single-stim',
	stimulus: '<div class = centerbox><div class = ANT_centercue_text>*</div></div>',	// Affiche "*" à la place de la "+" de fixation
	is_html: true,
	choices: 'none',
	data: {
		trial_id: 'centercue'
	},
	timing_post_trial: 0,
	timing_stim: cueDuration,		// 100 ms for adults, 150 ms for children,
	timing_response: cueDuration,
	on_finish: function() {
		jsPsych.data.addDataToLastTrial({
			exp_stage: exp_stage
		})
	}

}

var double_cue = {
	type: 'poldrack-single-stim',
	// Affiche la "+" de fixation au center, et les deux "*" en haut et en bas
	//
	stimulus: '<div class = centerbox><div class = ANT_text>+</div></div><div class = ANT_down><div class = ANT_text>*</div></div><div class = ANT_up><div class = ANT_text>*</div><div></div>',
	is_html: true,
	choices: 'none',
	data: {
		trial_id: 'doublecue'
	},
	timing_post_trial: 0,
	timing_stim: cueDuration,		// 100 ms for adults, 150 ms for children,
	timing_response: cueDuration,
	on_finish: function() {
		jsPsych.data.addDataToLastTrial({
			exp_stage: exp_stage
		})
	}
}

/* set up ANT experiment */
var attention_network_task_experiment = [];

var goToFullScreen = {
	type: 'fullscreen',
	fullscreen_mode: true
}
var exitFromFullScreen = {
	type: 'fullscreen',
	fullscreen_mode: false
}

// Create the instruction node in the timeliine
//
attention_network_task_experiment.push(goToFullScreen);
attention_network_task_experiment.push(instruction_node);

/* set up ANT practice */
/*
/*	  Adults:	random fixation (D1 ms) - cue (100 ms) - fixed fixation (400 ms)
/*				target & feedback (< 1700 ms --> rt) - post trial (3500 - D1 - rt ms)
/*
/*	  Children:	random fixation (D1 ms) - cue (150 ms) - fixed fixation (450 ms)
/*				target & feedback (< 1700 ms --> rt) - post trial (3500 - D1 - rt ms)
/*
/*    ATTENTION! Feedback in the plug-in "poldrack-categorize"
*/
var trial_num = 0
var block = practice_block
for (i = 0; i < block.data.length; i++) {
	var trial_num = trial_num + 1

	// Trial: Fixation & Practice for a random duration between 400 and 1600 ms (D1)
	//
	var first_fixation_gap = Math.floor(Math.random() * 1200) + 400;
	var first_fixation = {
		type: 'poldrack-single-stim',
		stimulus: '<div class = centerbox><div class = ANT_text>+</div></div>',
		is_html: true,
		choices: 'none',
		data: {
			trial_id: 'fixation',
			exp_stage: 'practice'
		},
		timing_post_trial: 0,
		timing_stim: first_fixation_gap,		// D1 -- Same for children and adults
		timing_response: first_fixation_gap		// D1 -- Same for children and adults
	}
	attention_network_task_experiment.push(first_fixation)

	if (block.data[i].cue == 'nocue') {
		attention_network_task_experiment.push(no_cue)
	} else if (block.data[i].cue == 'center') {
		attention_network_task_experiment.push(center_cue)
	} else if (block.data[i].cue == 'double') {
		attention_network_task_experiment.push(double_cue)
	} else {
		var spatial_cue = {
			type: 'poldrack-single-stim',
			// La balise pour afficher la "*" sera soit "ANT_up" soit "ANT_down"
			//
			stimulus: '<div class = centerbox><div class = ANT_text>+</div></div><div class = centerbox><div class = ANT_' + block.data[i].flanker_location +
				'><div class = ANT_text>*</p></div></div>',
			is_html: true,
			choices: 'none',
			data: {
				trial_id: 'spatialcue',
				exp_stage: 'practice'
			},
			timing_post_trial: 0,
			timing_stim: cueDuration,		// 100 ms for adults, 150 ms for children
			timing_response: cueDuration
		}
		attention_network_task_experiment.push(spatial_cue)
	}

	// Trial: Fixation for 400 ms
	//
	attention_network_task_experiment.push(fixation)

	block.data[i].trial_num = trial_num
	var attention_network_task_practice_trial = {
		type: 'poldrack-categorize',
		stimulus: block.stimulus[i],
		is_html: true,
		key_answer: block.data[i].correct_response,
		correct_text: '<div class = centerbox><div style="color:green"; class = center-text>Correct !</div></div>',
		incorrect_text: '<div class = centerbox><div style="color:red"; class = center-text>Incorrect</div></div>',
		timeout_message: '<div class = centerbox><div class = center-text>Répondez plus vite !</div></div>',
		choices: choices,
		data: block.data[i],
		timing_response: 1700,						// 1700 ms limit !
		timing_stim: 1700,
		response_ends_trial: true,
		timing_feedback_duration: 1000,
		show_stim_with_feedback: false,
		timing_post_trial: 0,
		on_finish: function() {
			jsPsych.data.addDataToLastTrial({
				exp_stage: 'practice'				// exp_stage: exp_stage
			})
		}
	}
	if (isChildVersion = "true") { // localStorage.getItem('version')
		attention_network_task_practice_trial.correct_text='<div class = centerbox><div style="color:black"; class = center-text>Child OK!</div></div';
		attention_network_task_practice_trial.incorrect_text='<div class = centerbox><div style="color:black"; class = center-text>Child BAD!</div></div';
	}
	
	attention_network_task_experiment.push(attention_network_task_practice_trial)

	// For adults, fixation cross at the center of the screen for 3500-D1-rt milliseconds
	// For children, audio and visual feedback
	//
	var last_fixation = {
		type: 'poldrack-single-stim',
		stimulus: '<div class = centerbox><div class = ANT_text>+</div></div>',
		is_html: true,
		choices: 'none',
		data: {
			trial_id: 'fixation',
			exp_stage: 'practice'
		},
		timing_post_trial: 0,
		timing_stim: post_trial_gap,
		timing_response: post_trial_gap,
	}
	attention_network_task_experiment.push(last_fixation)
}

attention_network_task_experiment.push(rest_block)
attention_network_task_experiment.push(test_intro_block);

/* Set up ANT main task */

// Blocks est le tableau qui contient les 3 blocs de trials randomisés
//
var trial_num = 0
for (b = 0; b < blocks.length; b++) { 			// Pour chaque bloc de 48 essais
	var block = blocks[b] 			  			// block1_trials, block2_trials, block3_trials
	for (i = 0; i < block.data.length; i++) { 	// Pour chaque essai dans le bloc
		var trial_num = trial_num + 1

		// Trial: Fixation & Practice for a random duration between 400 and 1600 ms (D1)
		//
		var first_fixation_gap = Math.floor(Math.random() * 1200) + 400;
		var first_fixation = {
			type: 'poldrack-single-stim',
			stimulus: '<div class = centerbox><div class = ANT_text>+</div></div>',
			is_html: true,
			choices: 'none',
			data: {
				trial_id: 'fixation',
				exp_stage: 'test'
			},
			timing_post_trial: 0,
			timing_stim: first_fixation_gap,		// D1 -- Same for children and adults
			timing_response: first_fixation_gap		// D1 -- Same for children and adults
		}
		attention_network_task_experiment.push(first_fixation)

		// Trial: Cue(4 kinds) & Test for a fixed duration of 100 ms
		//
		if (block.data[i].cue == 'nocue') {
			attention_network_task_experiment.push(no_cue)
		} else if (block.data[i].cue == 'center') {
			attention_network_task_experiment.push(center_cue)
		} else if (block.data[i].cue == 'double') {
			attention_network_task_experiment.push(double_cue)
		} else {
			var spatial_cue = {
				type: 'poldrack-single-stim',
				stimulus: '<div class = centerbox><div class = ANT_text>+</div></div><div class = centerbox><div class = ANT_' + block.data[i].flanker_location +
					'><div class = ANT_text>*</p></div></div>',
				is_html: true,
				choices: 'none',
				data: {
					trial_id: "spatialcue",
					exp_stage: 'test'
				},
				timing_post_trial: 0,
				timing_stim: cueDuration,	// 100 ms for adults, 150 ms for children
				timing_response: cueDuration,	// 100 ms for adults, 150 ms for children
			}
			attention_network_task_experiment.push(spatial_cue)
		}

		// Trial: fixation for a fixed duration of 400 ms
		//
		attention_network_task_experiment.push(fixation)

		// Trial: get the RT (no more than 1700 ms!)
		//
		block.data[i].trial_num = trial_num
		var ANT_trial = {
			type: 'poldrack-single-stim',	// On n'attend pas de feedback dans le "test"
			stimulus: block.stimulus[i],
			is_html: true,
			choices: choices,
			data: block.data[i],
			timing_response: 1700,
			timing_stim: 1700,
			response_ends_trial: true,
			timing_post_trial: 0,
			on_finish: function(data) {
				correct = data.key_press === data.correct_response
				jsPsych.data.addDataToLastTrial({
					correct: correct,
					exp_stage: 'test'
				})
			}
		}
		attention_network_task_experiment.push(ANT_trial)

		// Trial: fixation for 3500 - D1 - RT
		//
		var last_fixation = {
			type: 'poldrack-single-stim',
			stimulus: '<div class = centerbox><div class = ANT_text>+</div></div>',
			is_html: true,
			choices: 'none',
			data: {
				trial_id: "fixation",
				exp_stage: 'test'
			},
			timing_post_trial: 0,
			timing_stim: post_trial_gap,
			timing_response: post_trial_gap,
		}
		attention_network_task_experiment.push(last_fixation)
	}
	
	// Now, push a node and a rest block of text on the timeline
	//
	attention_network_task_experiment.push(attention_node)
	attention_network_task_experiment.push(rest_block)
}

// At the end of the experiment, push the questionnaire and the end_block on the timeline
//
//attention_network_task_experiment.push(post_task_block) // Questionnaire

attention_network_task_experiment.push(end_block) // Fin de l'expérience
attention_network_task_experiment.push(exitFromFullScreen) // Sort du mode plein écran
