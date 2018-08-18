let projects;

create_card = function(card_id, project) {
	console.log(card_id);
	let card = $(card_id);//.css( "border", "3px solid red");
	$(card_id + ' p').text(card_id);
	$(card_id + ' img').attr("src", project["pic-url"]);
	$(card_id + ' h4').text(project.name);
	$(card_id + ' h4').attr("style", "color: black; background: white");
}

$(document).ready(function(){
	let response = $.getJSON('projects.json', function(data) {
		projects = data.projects;
		console.log(projects);

		let obj_keys = Object.keys(projects);
		let rand_key, rand_project, card_id;

		for(let i = 0; i < 6; i++) {
	        rand_key = obj_keys[Math.floor(Math.random() * obj_keys.length)];
	        obj_keys = obj_keys.filter( el => el !== rand_key);
	        rand_project = projects[rand_key];

	        card_id = "#project-card-" + i;
	        create_card(card_id, rand_project); 
    	}


    });
});