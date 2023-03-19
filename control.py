#!/usr/bin/python3

import os
import sys
import json
import shutil
from datetime import date

projects_json_file = "projects.json"
projects_json = ""


def create_project(name, description):
    global projects_json
    if os.path.isdir(name):
        print("The project " + name + " already exists")
        return

    print("Creating project directory " + name + "/")
    os.mkdir(name)

    print("Creating " + name + "/README.md")
    readme(name, description)
    print("Creating " + name + "/sketch.js")
    sketch_js(name, description)

    obj_id = add_project_to_json(name, description)

    print("Creating imgs/" + obj_id + ".jpg")
    add_image(obj_id)
    print("Creating " + name + "/index.html")
    index_html(name, obj_id, description)

    prev_id = projects_json["projects"][obj_id]["prev-id"]
    prev_name = projects_json["projects"][prev_id]["name"]
    print("Updating project " + prev_name + "/index.html with new next project card")
    replace_next_project_in(prev_id, obj_id)

    next_id = projects_json["projects"][obj_id]["next-id"]
    next_name = projects_json["projects"][next_id]["name"]
    print(
        "Updating project " + next_name + "/index.html with new previous project card"
    )
    replace_prev_project_in(next_id, obj_id)

    print("Creating " + name + "/docs")
    os.mkdir(name + "/docs")
    # os.system("jsdoc -R " + name + "/README.md -d " + name +"/docs " + name + "/*.js")
    os.chdir(name)
    os.system("jsdoc -c ../.jsdoc-conf.json *.js")
    os.chdir("..")

    return


def readme(name, description):
    f = open(name + "/README.md", "w+")
    capsName = name.strip()[0].capitalize() + name.strip()[1:]
    capsName = capsName.replace("-", " ")
    capsName = capsName.replace("_", " ")
    f.write("# " + capsName + "\n\n")
    f.write(description + "\n\n")
    f.write("Check out the [Demo](https://omareq.github.io/" + name + "/).\n\n")
    f.write("Check out the [Docs](https://omareq.github.io/" + name + "/docs/).\n\n")
    f.write("Created using [p5.js](https://p5js.org/)\n\n")
    f.write("## Contact Details\n")
    f.write("__Programmer:__ Omar Essilfie-Quaye (omareq08+githubio@gmail.com)\n")
    f.write(
        "\n\n(This is an auto-generated document, not all links will necessarily work)\n"
    )
    f.close()
    return


def index_html(name, project_id, description="Project Description"):
    global projects_json
    template = open("template-index.html", "r")
    output = open(name + "/index.html", "w+")
    prev_key = projects_json["projects"][project_id]["prev-id"]
    next_key = projects_json["projects"][project_id]["next-id"]

    for line in template:
        newline = line
        if "/**TITLE**/" in line:
            capsName = name.strip()[0].capitalize() + name.strip()[1:]
            capsName = capsName.replace("-", " ")
            capsName = capsName.replace("_", " ")
            newline = line.replace("/**TITLE**/", capsName)
        elif "/**URL**/" in line:
            newline = line.replace("/**URL**/", name + "/")
        elif "/**IMG**/" in line:
            newline = line.replace("/**IMG**/", project_id + ".jpg")
        elif "/**PREV IMG**/" in line:
            newline = line.replace("/**PREV IMG**/", prev_key + ".jpg")
        elif "/**NEXT IMG**/" in line:
            newline = line.replace("/**NEXT IMG**/", next_key + ".jpg")
        elif "/**NEXT TITLE**/" in line:
            newline = line.replace(
                "/**NEXT TITLE**/", projects_json["projects"][next_key]["name"]
            )
        elif "/**PREV TITLE**/" in line:
            newline = line.replace(
                "/**PREV TITLE**/", projects_json["projects"][prev_key]["name"]
            )
        elif "/**NEXT URL**/" in line:
            newline = line.replace(
                "/**NEXT URL**/", projects_json["projects"][next_key]["demo-url"][1:]
            )
        elif "/**PREV URL**/" in line:
            newline = line.replace(
                "/**PREV URL**/", projects_json["projects"][prev_key]["demo-url"][1:]
            )
        elif "/**DESCRIPTION**/" in line:
            newline = line.replace(
                "/**DESCRIPTION**/",
                description
                + ".  This is a project created by Omar Essilfie-Quaye on "
                + date.today().strftime("%d %B %Y."),
            )

        output.write(newline)

    template.close()
    output.close()
    return


def sketch_js(name, description):
    today = date.today()
    date_str = today.strftime("%d-%B-%Y")
    year_str = today.strftime("%Y")
    date_str = "*\t@date " + date_str
    f = open(name + "/sketch.js", "w+")
    f.write(
        "/"
        + "*" * 79
        + "\n\
 *\n\
 *\t@file sketch.js "
        + description
        + "\n\
 *\n\
 *\t@author Omar Essilfie-Quaye <omareq08+githubio@gmail.com>\n\
 *\t@version 1.0\n "
        + date_str
        + "\n\
 *\t@link https://omareq.github.io/"
        + name
        + "/\n\
 *\t@link https://omareq.github.io/"
        + name
        + "/docs/\n\
 *\n "
        + "*" * 79
        + "\n\
 *\n\
 *                   GNU General Public License V3.0\n\
 *                   --------------------------------\n\
 *\n\
 *   Copyright (C) "
        + year_str
        + " Omar Essilfie-Quaye\n\
 *\n\
 *   This program is free software: you can redistribute it and/or modify\n\
 *   it under the terms of the GNU General Public License as published by\n\
 *   the Free Software Foundation, either version 3 of the License, or\n\
 *   (at your option) any later version.\n\
 *\n\
 *   This program is distributed in the hope that it will be useful,\n\
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of\n\
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the\n\
 *   GNU General Public License for more details.\n\
 *\n\
 *   You should have received a copy of the GNU General Public License\n\
 *   along with this program.  If not, see <https://www.gnu.org/licenses/>.\n\
 *\n "
        + "*" * 77
        + "/\n\n"
    )

    f.write(
        "/**\n\
 * p5.js setup function, creates canvas.\n\
 */\n\
function setup() {\n\
\tlet cnvSize;\n\
\tif(windowWidth > windowHeight) {\n\
\t\tcnvSize = windowHeight;\n\
\t} else {\n\
\t\tcnvSize = windowWidth;\n\
\t}\n\
\tlet cnv = createCanvas(cnvSize, 0.7 * cnvSize);\n\
\tcnv.parent('sketch');\n\
}\n\n"
    )

    f.write(
        "/**\n\
 * p5.js draw function, is run every frame to create the desired animation\n\
 */\n\
function draw() {\n\
\tbackground(0);\n}\n\n"
    )
    f.close()
    return


def add_image(project_id):
    img_path = "imgs/" + project_id + ".jpg"
    if not os.path.isdir("imgs"):
        print('The images folder has been removed please create the folder "imgs/"')
        return

    if os.path.exists(img_path):
        print("This project id had already been used for an image")
        return

    shutil.copy("imgs/p_default.jpg", ".")
    os.rename("p_default.jpg", img_path)
    return


# what if project is archived
def get_highest_key(filter_archived_values=False):
    global projects_json
    projects = projects_json["projects"]
    high_key = "p_-001"
    for key, value in projects.items():
        if int(key[2:]) > int(high_key[2:]):
            if filter_archived_values or value["status"] != "archived":
                high_key = key

    return high_key


# what if project is archived
def get_lowest_key(filter_archived_values=False):
    global projects_json
    projects = projects_json["projects"]
    low_key = "p_1000"
    for key, value in projects.items():
        if int(key[2:]) < int(low_key[2:]) and value["status"] != "archived":
            if filter_archived_values or value["status"] != "archived":
                low_key = key

    return low_key


def new_project(name, project_id, prev_id, description):
    capsName = name.strip()[0].capitalize() + name.strip()[1:]
    capsName = capsName.replace("-", " ")
    capsName = capsName.replace("_", " ")
    return {
        "id": project_id,
        "name": capsName,
        "demo-url": "/" + name + "/",
        "docs-url": "/" + name + "/docs/",
        "pic-url": "imgs/" + project_id + ".jpg",
        "gif-url": "imgs/" + project_id + ".gif",
        "vid-url": "vids/" + project_id + ".mp4",
        "prev-id": prev_id,
        "next-id": "p_000",
        "status": "active",
        "brief": description,
        "tags": [],
    }


def add_project_to_json(name, description):
    global projects_json, projects_json_file

    prev_key = get_highest_key()
    filter_archived_values = True
    highest_json_key = get_highest_key(filter_archived_values)
    current_key = "p_" + str(int(highest_json_key[2:]) + 1).zfill(3)
    next_key = get_lowest_key()

    current_project_json = new_project(name, current_key, prev_key, description)

    print(
        "New JSON Object: \n",
        json.dumps(current_project_json, sort_keys=True, indent=4),
    )

    projects_json["projects"][current_key] = current_project_json
    projects_json["projects"][prev_key]["next-id"] = current_key
    projects_json["projects"][next_key]["prev-id"] = current_key

    with open(projects_json_file, "w") as json_file:
        # print(json.dumps(projects_json, sort_keys=True, indent=4))
        json.dump(projects_json, json_file, sort_keys=True, indent=4)

    return current_key


def replace_prev_project_in(project_id, new_prev_id):
    global projects_json
    name = projects_json["projects"][project_id]["name"]
    url = projects_json["projects"][project_id]["demo-url"][1:]
    new_prev_name = projects_json["projects"][new_prev_id]["name"]
    new_prev_url = projects_json["projects"][new_prev_id]["demo-url"][1:]

    new_index = open("tmp_index.html", "w+")
    with open(url + "index.html") as old_index:
        for line in old_index:
            newline = line
            if 'id="prev-title"' in line:
                newline = '\t\t\t\t\t\t<h5 id="prev-title">' + new_prev_name + "</h5>\n"
            elif 'id="prev-url"' in line:
                newline = (
                    '\t\t\t\t\t\t<a id="prev-url" href="../'
                    + new_prev_url
                    + '" class="project-demo">\n'
                )
            elif 'id="prev-img"' in line:
                newline = (
                    '\t\t\t\t\t\t\t<img id="prev-img" src="../imgs/'
                    + new_prev_id
                    + '.jpg" onerror="this.onerror=null; this.src=\'../imgs/p_default.jpg\'">\n'
                )

            new_index.write(newline)
    new_index.close()
    print("Replacing " + url + "index.html")
    os.rename("tmp_index.html", url + "index.html")
    return


def replace_next_project_in(project_id, new_next_id):
    global projects_json
    name = projects_json["projects"][project_id]["name"]
    url = projects_json["projects"][project_id]["demo-url"][1:]
    new_next_name = projects_json["projects"][new_next_id]["name"]
    new_next_url = projects_json["projects"][new_next_id]["demo-url"][1:]

    new_index = open("tmp_index.html", "w+")
    with open(url + "index.html") as old_index:
        for line in old_index:
            newline = line
            if 'id="next-title"' in line:
                newline = '\t\t\t\t\t\t<h5 id="next-title">' + new_next_name + "</h5>\n"
            elif 'id="next-url"' in line:
                newline = (
                    '\t\t\t\t\t\t<a id="next-url" href="../'
                    + new_next_url
                    + '" class="project-demo">\n'
                )
            elif 'id="next-img"' in line:
                newline = (
                    '\t\t\t\t\t\t\t<img id="next-img" src="../imgs/'
                    + new_next_id
                    + '.jpg" onerror="this.onerror=null; this.src=\'../imgs/p_default.jpg\'">\n'
                )

            new_index.write(newline)
    new_index.close()
    print("Replacing " + url + "index.html")
    os.rename("tmp_index.html", url + "index.html")
    return


def project_id_from_name(name):
    global projects_json
    name = name.replace("/", "")
    name = name.replace(".", "")

    projects = projects_json["projects"]
    for key, value in projects.items():
        # print("Demo url: " + value["demo-url"][1:].replace('/',''))
        # print("Name: " + name)
        if value["demo-url"][1:].lower().replace("/", "") == name.lower():
            return key

    print("There is no project with the url " + name + " in projects.json")
    exit(0)
    return


def archive_project(name):
    global projects_json, projects_json_file
    if not os.path.isdir(name):
        print("The project with this name does not exist")
        return

    project_id = project_id_from_name(name)
    print("Project " + name + " key: " + project_id)
    if projects_json["projects"][project_id]["status"] == "archived":
        print("The project " + name + " has already been archived")
        return

    next_id = projects_json["projects"][project_id]["next-id"]
    prev_id = projects_json["projects"][project_id]["prev-id"]

    replace_next_project_in(prev_id, next_id)
    projects_json["projects"][prev_id]["next-id"] = next_id

    replace_prev_project_in(next_id, prev_id)
    projects_json["projects"][next_id]["prev-id"] = prev_id

    projects_json["projects"][project_id]["status"] = "archived"

    print("Updating projects.json")
    with open(projects_json_file, "w") as json_file:
        json.dump(projects_json, json_file, sort_keys=True, indent=4)

    return


def restore_project(name):
    global projects_json
    if not os.path.isdir(name):
        print("The project with this name does not exist")
        return

    project_id = project_id_from_name(name)
    if projects_json["projects"][project_id]["status"] == "active":
        print("The project " + name + " is already active")
        return

    # these while loops need to be replaced by traversing the project id list manually
    next_id = projects_json["projects"][project_id]["next-id"]
    while projects_json["projects"][next_id]["status"] == "archived":
        next_id = projects_json["projects"][next_id]["next-id"]

    prev_id = projects_json["projects"][project_id]["prev-id"]
    while projects_json["projects"][project_id]["prev-id"] == "archived":
        prev_id = projects_json["projects"][prev_id]["prev-id"]

    replace_next_project_in(prev_id, project_id)
    projects_json["projects"][prev_id]["next-id"] = project_id
    replace_next_project_in(project_id, next_id)
    projects_json["projects"][project_id]["next-id"] = next_id

    replace_prev_project_in(next_id, project_id)
    projects_json["projects"][next_id]["prev-id"] = project_id
    replace_prev_project_in(project_id, prev_id)
    projects_json["projects"][project_id]["prev-id"] = prev_id

    projects_json["projects"][project_id]["status"] = "active"

    with open(projects_json_file, "w+") as json_file:
        json.dump(projects_json, json_file, sort_keys=True, indent=4)
    return


# what about removing from git by git deletion
def remove_project(name):
    global projects_json, projects_json_file
    if not os.path.isdir(name):
        print("The project with this name does not exist")
        return

    prompt = "Remove all files and folders in project " + name + "? (y/n) "
    confirmation = input(prompt)
    if not confirmation.lower() == "y":
        print("Deletion aborted")
        return

    archive_project(name)
    project_id = project_id_from_name(name)
    print("Deleting " + name + " directory")
    shutil.rmtree(name)
    print("Deleting imgs/" + project_id + ".jpg")
    os.unlink("imgs/" + project_id + ".jpg")

    print("Deleting project from projects.json")
    projects_json["projects"].pop(project_id, None)
    with open(projects_json_file, "w+") as json_file:
        json.dump(projects_json, json_file, sort_keys=True, indent=4)


def usage():
    print(
        "Usage:\t control [OPTION] [PROJECT]\n\n\
            [OPTIONS]\n\
            add        Add a new project to the web page\n\
                           -- Additional Argument Description\n\
                           USAGE:\t./control.py add new_project project_description\n\
            archive    Remove a project from active view but do not delete files\n\
            remove     Remove all files associated with a project\n\
            restore    Returns a project to an active state from the archive\n\
            id         Returns a project ID given the folder name\n\n"
    )
    exit(0)


def load_projects_json():
    global projects_json, projects_json_file
    with open(projects_json_file) as json_file:
        projects_json = json.load(json_file)


if __name__ == "__main__":
    argv = sys.argv

    if len(argv) < 3:
        usage()

    command = argv[1]
    project_name = argv[2]

    load_projects_json()

    if command == "add":
        if len(argv) != 4:
            print("USAGE:\t./control.py add new_project project_description\n")
            exit(0)

        description = argv[3]
        print("Adding project: " + project_name)
        create_project(project_name, description)
    elif command == "archive":
        print("Archiving project: " + project_name)
        archive_project(project_name)
    elif command == "remove":
        print("Removing project: " + project_name)
        remove_project(project_name)
    elif command == "restore":
        print("Restoring project: " + project_name)
        restore_project(project_name)
    elif command == "id":
        print("ID: " + project_id_from_name(project_name))
    else:
        usage()
