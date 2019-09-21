QUnit.test("Hello Test", function(assert) {
    assert.ok(1 == "1", "Passed!" );
});

function is_valid_JSON(str) {
	if(str == "") return false;
    json_str = str;
	json_str = json_str.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@');
	json_str = json_str.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']');
	json_str = json_str.replace(/(?:^|:|,)(?:\s*\[)+/g, '');
	return (/^[\],:{}\s]*$/).test(json_str);
}

QUnit.test("Validate Projects.json", function(assert) {
    const projects_json = JSON.stringify(require("../projects.json"));
    const valid = is_valid_JSON(projects_json);
    assert.equal(valid, true, "Validating projects.json");
});

function file_exists(path) {
    const fs = require('fs');
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
        const index_exists = file_exists(path + "/index.html");
        assert.equal(index_exists, true, path + "/index.html url validation");
    }
});

QUnit.test("Validate Project Image Files", function(assert) {
    const projects_json = require("../projects.json");
    for(let id in projects_json.projects) {
        const path = "./" + projects_json.projects[id]["pic-url"];
        const exists = file_exists(path);
        assert.equal(exists, true, path + " img validation");
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
        const index_exists = file_exists(path + "/index.html");
        assert.equal(index_exists, true, path + "/index.html url validation");
    }
});

function lint_js_source(file) {
    const Linter = require("eslint").Linter;
    const linter = new Linter();
    const fs = require("fs");
    const index = fs.readFileSync(file, "utf-8");
    const options = require("../.eslintrc.json");
    const message = linter.verify(index, options, {filename: file});
    return message;
}

QUnit.test("Lint JS Files", function(assert) {
    let lint_message = lint_js_source("./index.js");
    assert.equal(lint_message, "", "Lint index.js");

    lint_message = lint_js_source("./test/test.js");
    assert.equal(lint_message, "", "Lint test.js");

    const projects_json = require("../projects.json");
    for(let id in projects_json.projects) {
        const path = "." + projects_json.projects[id]["demo-url"];
        const fs = require("fs");
        const list = fs.readdirSync(path);
        const regex = new RegExp('^((?!\.test\.).)*\.js$');
        const result = list.filter(file => file.match(regex));

        for(const file_name of result) {
            const file = path + "/" + file_name;
            lint_message = lint_js_source(file);
            assert.equal(lint_message, "", path + "/" + file + " JS linting");
        }
    }
});
