tdl.require('tdl.fast');
tdl.require('tdl.io');
tdl.require('tdl.log');
tdl.require('tdl.math');
tdl.require('tdl.screenshot');
tdl.require('tdl.sync');

// globals
var math;                 // the math lib.
var fast;                 // the fast math lib.
// var g_syncManager;

var g_viewSettingsIndex = 0;
var g_getCount = 0;
var g_putCount = 0;

var g_viewSettings = [
  // Inside 1
  {
    targetHeight: 63.3,
    targetRadius: 91.6,
    eyeHeight: 7.5,
    eyeRadius: 13.2,
    eyeSpeed: 0.0258,
    fieldOfView: 82.699,
    ambientRed: 0.218,
    ambientGreen: 0.502,
    ambientBlue: 0.706,
    fogPower: 16.5,
    fogMult: 1.5, //2.02,
    fogOffset: 0.738,
    fogRed: 0.338,
    fogGreen: 0.81,
    fogBlue: 1,
    refractionFudge: 3,
    eta: 1,
    tankColorFudge: 0.796
  },
  // Outside 1
  {
    targetHeight: 17.1,
    targetRadius: 69.2,
    eyeHeight: 59.1,
    eyeRadius: 124.4,
    eyeSpeed: 0.0258,
    fieldOfView: 56.923,
    ambientRed: 0.218,
    ambientGreen: 0.246,
    ambientBlue: 0.394,
    fogPower: 27.1,
    fogMult: 1.46,
    fogOffset: 0.53,
    fogRed: 0.382,
    fogGreen: 0.602,
    fogBlue: 1,
    refractionFudge: 3,
    eta: 1,
    tankColorFudge: 1
  },
  // Inside Original
  {
    targetHeight: 0,
    targetRadius: 88,
    eyeHeight: 38,
    eyeRadius: 69,
    eyeSpeed: 0.0258,
    fieldOfView: 64,
    ambientRed: 0.218,
    ambientGreen: 0.246,
    ambientBlue: 0.394,
    fogPower: 16.5,
    fogMult: 1.5, // 2.02,
    fogOffset: 0.738,
    fogRed: 0.338,
    fogGreen: 0.81,
    fogBlue: 1,
    refractionFudge: 3,
    eta: 1,
    tankColorFudge: 0.796
  },
  // Outside Original
  {
    targetHeight: 72,
    targetRadius: 73,
    eyeHeight: 3.9,
    eyeRadius: 120,
    eyeSpeed: 0.0258,
    fieldOfView: 74,
    ambientRed: 0.218,
    ambientGreen: 0.246,
    ambientBlue: 0.394,
    fogPower: 27.1,
    fogMult: 1.46,
    fogOffset: 0.53,
    fogRed: 0.382,
    fogGreen: 0.602,
    fogBlue: 1,
    refractionFudge: 3,
    eta: 1,
    tankColorFudge: 1
  },
  // Center for LG
  {
    targetHeight: 24,
    targetRadius: 73,
    eyeHeight: 24,
    eyeRadius: 0,
    eyeSpeed: 0.06,
    fieldOfView: 60,
    ambientRed: 0.22,
    ambientGreen: 0.25,
    ambientBlue: 0.39,
    fogPower: 14.5,
    fogMult: 1.3, //1.66,
    fogOffset: 0.53,
    fogRed: 0.54,
    fogGreen: 0.86,
    fogBlue: 1,
    refractionFudge: 3,
    eta: 1,
    tankColorFudge: 0.8
  },
  // Outside for LG
  {
    targetHeight: 20,
    targetRadius: 127,
    eyeHeight: 39.9,
    eyeRadius: 124,
    eyeSpeed: 0.06,
    fieldOfView: 24,
    ambientRed: 0.22,
    ambientGreen: 0.25,
    ambientBlue: 0.39,
    fogPower: 27.1,
    fogMult: 1.2, //1.46,
    fogOffset: 0.53,
    fogRed: 0.382,
    fogGreen: 0.602,
    fogBlue: 1,
    refractionFudge: 3,
    eta: 1,
    tankColorFudge: 1
  }
];

var g = {
  globals: {
    // 0 - 100 fishes, 1 - 200, 2 - 500, 3 - 1000, 4 - 2000
    fishSetting: 2,
    drawLasers: true,
	  width: 1080,
	  height: 1920
  },
  net: {
    timeout: 3000,
    fovMult: 1.21,
    rotYMult: 0,
    offsetMult: 1.0,
    offset: [0, 0, 0],
    port: 8080
  },
  win: {
    useDevicePixelRatio: true
  },
  fish: {},
  innerConst: {},
  options: {
    normalMaps: { enabled: true, text: 'Normal Maps' },
    reflection: { enabled: true, text: 'Reflection' },
    tank:       { enabled: true,  text: 'Tank' },
    museum:     { enabled: true,  text: 'Museum' },
    fog:        { enabled: true,  text: 'Fog' },
    bubbles:    { enabled: true,  text: 'Bubbles' },
    lightRays:  { enabled: true,  text: 'Light Rays' }
  }
};

var g_uiWidgets = {};

window.getScriptText = function getScriptText(id) {
  return window["__" + id];
};

window.updateUI = function updateUI(settings) {};

function setViewSettings(index) {
  function setGlobal(name, value) {
    g.globals[name] = value;
  }

  var viewSettings = g_viewSettings[index];
  setSettings({globals: viewSettings})
}

function advanceViewSettings() {
  g_viewSettingsIndex = (g_viewSettingsIndex + 1) % g_viewSettings.length;
  setViewSettings(g_viewSettingsIndex);
}

function resetViewSettings() {
  setViewSettings(g_viewSettingsIndex);
}

/**
 * Sets the count
 */
function setSetting(elem, id) {
  switch (id) {
  case 8:
    break;
  case 7:
    advanceViewSettings();
    break;
  default:
    setSettings({globals:{fishSetting:id}});
  }
}

/**
 * Initializes stuff.
 */
window.initializeCommon = function initializeCommon() {
  if (g.net.sync) {
    var url = "ws:" + window.location.host;
    tdl.log("server:", url);
    g_syncManager.init(url, g.net.slave);
    if (!g.net.slave) {
      g_viewSettingsIndex = 4;
      setViewSettings(g_viewSettingsIndex);
    }
  }

  return true;
}

var g_event;

function getParamId(id) {
  return id.substr(6).replace(/(\w)/, function(m) {return m.toLowerCase() });
}

function setParam(event, qui, ui, obj, valueElem) {
  var id = event.target.id;
  var value = qui.value / 1000;
  valueElem.innerHTML = value;
  var inner = {}
  var settings = {};
  settings[ui.obj] = inner;
  inner[ui.name] = value;
  setSettings(settings);
}

function getUIValue(obj, id) {
  return obj[id] * 1000;
}

window.SetupEnv = function (uiObj) {
  for (var ii = 0; ii < uiObj.length; ++ii) {
    var ui = uiObj[ii];
    var obj = g[ui.obj];
    if (!obj[ui.name]) {
      obj[ui.name] = ui.value;
    }
  }
}

window.setSettings = function setSettings(settings) {
  window.g_syncManager.setSettings(settings);
}

window.g_viewSettingsIndex = g_viewSettingsIndex;
window.g_viewSettings = g_viewSettings;
window.g = g;




