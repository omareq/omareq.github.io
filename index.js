let projects;

searchEvent = function(event) {
	console.log("Search event: ", event);
	return false;
};

submitFunction = function(event) {
	console.log("Submit Event: ", event);
	event.preventDefault();
	return false;
};

hover = function(element) {
	element.children[0].setAttribute("src", "imgs/external_link_blue.png");
	element.style.color = "0000FF";
	element.style.padding = "4px";
	element.style.margin = "2px";
	element.style.border = "1px solid blue";
	element.style.borderRadius = "0.2em";
};

unhover = function(element) {
	element.children[0].setAttribute("src", "imgs/external_link.png");
	element.style.color = "000000";
	element.style.padding = "0px";
	element.style.margin = "0px";
	element.style.border = "";
};

archivedCards = function(projects) {
	let sum = 0;

	let obj_keys = Object.keys(projects);
	for(const key in projects) {
		if(projects[key]["status"] == "archived") {
			sum++;
		}
	}
	return sum;
};

create_card = function(card_id, project) {
	let card = $(card_id);//.css( "border", "3px solid red");
	$(card_id + ' img').attr("src", project["pic-url"]);
	$(card_id + ' .project-docs').attr("href", project["docs-url"]);
	$(card_id + ' .project-docs').attr("style", "color: blue; background: white");
	$(card_id + ' .project-demo').attr("href", project["demo-url"]);
	$(card_id + ' .project-demo').attr("style", "color: blue; background: white");
	$(card_id + ' h4').text(project.name);
	$(card_id + ' h4, p').attr("style", "color: black; background: white");

	if(project["brief"]) {
		$(card_id + ' p').text(project["brief"]);
	} else {
		$(card_id + ' p').text("");
	}
};

insert_cards = function(start_card, end_card) {
	let response = $.getJSON('projects.json', function(data) {
		projects = data.projects;

		let obj_keys = Object.keys(projects);
		let rand_key, rand_project, card_id;

		const filter_func = function(el) {
			return el !== rand_key;
		};

		for(let i = start_card; i < end_card; i++) {
	        rand_key = obj_keys[Math.floor(Math.random() * obj_keys.length)];
	        obj_keys = obj_keys.filter(filter_func);
	        rand_project = projects[rand_key];


	        if(rand_project["status"] == "archived") {
	        	i--;
	        	continue;
	        }

	        card_id = "#project-card-" + i;
	        create_card(card_id, rand_project);
    	}
    });
};

append_card_layout = function(end_card) {
	let card_layout_start = "<div class=\"col-sm-4\">\
                        \n<div class=\"project-card\" id=\"project-card-";
    let card_layout_end = ">\
        \n<h4>Code Title</h4>\
        \n<a href=\"#\" class=\"project-demo\">\
        \n<img src=\"imgs/p_default.jpg\" onerror=\"this.onerror=null; this.src=\'../imgs/p_default.jpg\'\">\
        \n</a>\
        \n<p class=\"project-brief\">A Brief Description of this project</p>\
        \n<a href=\"#\" class=\"project-docs\"> Docs </a>\
    \n</div>\
\n</div>";

	let section_start = "<section class=\"container\">\n<div class=\"row\">\n";
	let section_end = "\n</div>\n</section>";

	let row_index = -1;
	for(let i = 0; i < end_card; i++) {
		card_id = "project-card-" + i;
		let col_index = i % 3;
		row_index = Math.floor(i / 3);

		// console.log("Row " + row_index + " Col " + col_index);


		if(	document.getElementById(card_id)) {
			console.log("Card " + card_id + " already exists");
			continue;
		}

		console.log("Creating Project Card " + i);

		let prev_card = "#project-card-" + (i-1);
		if(i == 0) {
			prev_card = card_id;
		}

		// console.log($(prev_card));

		if(col_index == 0) {
			let card_layout = card_layout_start + i + "\"" + card_layout_end;
			card_layout = section_start + card_layout + section_end;

			$(card_layout).insertAfter($(prev_card).parent().parent().parent());

			// console.log(card_layout);
		} else {
			let card_layout = card_layout_start + i + "\"" + card_layout_end;
			$(card_layout).insertAfter($(prev_card).parent());
			// console.log(card_layout);
		}
		// $(card_id).hide().show(i * 300);
	}
};

$(document).ready(function(){
	if(document.title.includes("Projects")) {
		let response = $.getJSON('projects.json', function(data) {
			let num_cards = Object.keys(data.projects).length - archivedCards(data.projects);
			append_card_layout(num_cards);
			insert_cards(0, num_cards);
			$('main').hide().show(0);
		});
	} else {
		insert_cards(0, 6);
	}

	// append_card_layout(8);
});