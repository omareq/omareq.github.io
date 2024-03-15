/*******************************************************************************
 *
 *  @file ui.js A file with all the the ui handlers
 *
 *  @author Omar Essilfie-Quaye <omareq08+githubio@gmail.com>
 *  @version 1.0
 *  @date 15-March-2024
 *  @link https://omareq.github.io/line-sim-3d/
 *  @link https://omareq.github.io/line-sim-3d/docs/
 *
 *******************************************************************************
 *
 *                   GNU General Public License V3.0
 *                   --------------------------------
 *
 *   Copyright (C) 2024 Omar Essilfie-Quaye
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of the GNU General Public License as published by
 *   the Free Software Foundation, either version 3 of the License, or
 *   (at your option) any later version.
 *
 *   This program is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *   GNU General Public License for more details.
 *
 *   You should have received a copy of the GNU General Public License
 *   along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 *****************************************************************************/

/**
 * UI Namespace Object
 */
var UI = UI || {};

UI.controlPanel = undefined;

/**
 * UI control panel setup function that assigns the handler and makes the
 * control panel visible
 */
UI.controlPanelSetup = () => {
    UI.controlPanel = document.getElementById("control-panel");
    UI.controlPanelShow();
};

/**
 * UI control panel show function makes the control panel visible
 */
UI.controlPanelShow = () => {
    UI.controlPanel.style.visibility = "visible";
};

/**
 * UI control panel hide function makes the control panel hidden
 */
UI.controlPanelHide = () => {
    UI.controlPanel.style.visibility = "hidden";
};


/**
 * UI setup all UI elements
 */
UI.setup = () => {
    console.debug("UI.setup: Start");
    UI.controlPanelSetup();
    console.debug("UI.setup: End");
};

/**
 * Poll UI elements that require periodic checks
 */
UI.poll = () => {
    console.debug("UI.poll: Start");

    console.debug("UI.poll: End");
};