QUnit.test("Hello Test", function(assert) {
    assert.ok(1 == "1", "Passed!" );
});

function is_valid_JSON(str) {
	if(str == "") return false;
	str = str.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@');
	str = str.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']');
	str = str.replace(/(?:^|:|,)(?:\s*\[)+/g, '');
	return (/^[\],:{}\s]*$/).test(str);
}

QUnit.test("Validate Projects.json", function(assert) {
    const projects_json = JSON.stringify(require("../projects.json"));
    const valid = is_valid_JSON(projects_json);
    assert.equal(valid, true, "Validating projects.json");
});

function file_exists(path) {
    const fs = require('fs')
    try {
        if(fs.existsSync(path)) {
            return true;
        }
    } catch(err) {
        console.error(err);
    }
    return false;
}

QUnit.test("Validate Project Folder", function(assert) {
    const projects_json = require("../projects.json");
    for(let id in projects_json.projects) {
        const path = "." + projects_json.projects[id]["demo-url"];
        const exists = file_exists(path);
        assert.equal(exists, true, path + " url validation");
    }
});

QUnit.test("Validate Project index.html", function(assert) {
    const projects_json = require("../projects.json");
    for(let id in projects_json.projects) {
        const path = "." + projects_json.projects[id]["demo-url"];
        const index_exists = file_exists(path  + "/index.html");
        assert.equal(index_exists, true, path + "/index.html url validation");
    }
});

QUnit.test("Validate Docs Folder", function(assert) {
    const projects_json = require("../projects.json");
    for(let id in projects_json.projects) {
        const path = "." + projects_json.projects[id]["docs-url"];
        const exists = file_exists(path);
        assert.equal(exists, true, path + " url validation");
    }
});

QUnit.test("Validate Docs index.html", function(assert) {
    const projects_json = require("../projects.json");
    for(let id in projects_json.projects) {
        const path = "." + projects_json.projects[id]["docs-url"];
        const index_exists = file_exists(path  + "/index.html");
        assert.equal(index_exists, true, path + "/index.html url validation");
    }
});
