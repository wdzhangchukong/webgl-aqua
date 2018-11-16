/******************************************************************************
 *
 * WX Mini Game Adapter
 *
******************************************************************************/
let WX_GAME_ENV = typeof wx !== 'undefined';
let WX_GAME_DEVTOOLS = false;
let SystemInfo = null;
let MainCanvas = null;

let TRY_USE_WEBGL2 = true;
let CAN_USE_WEBGL2 = false;

if (WX_GAME_ENV) {
  SystemInfo = wx.getSystemInfoSync();
  if (SystemInfo.platform == "devtools") {
    WX_GAME_DEVTOOLS = true;
  } else {
    // WeiXin not support WebGL2 API
    TRY_USE_WEBGL2 = false;
  }

  console.log("Game run in wx mini game env, devtools:" +  WX_GAME_DEVTOOLS
    + ", window:" + SystemInfo.windowWidth + "x" + SystemInfo.windowHeight
    + ", pixelRatio:" + SystemInfo.pixelRatio
    + ", screen:" + SystemInfo.screenWidth + "x" + SystemInfo.screenHeight
    + ", window " + typeof window + ", GameGlobal " + typeof GameGlobal);
} else {
  console.log("Game run in browser env, window:"
    + window.outerWidth + "x" + window.outerHeight
    + ", dpr:" + window.devicePixelRatio
    + ", screen:" + window.screen.width + "x" + window.screen.height);
}

function IsWxGameEnv() { return WX_GAME_ENV; }
function IsWxGameDevTools() { return WX_GAME_DEVTOOLS; }
function TryUseWebGL2() { return TRY_USE_WEBGL2; }
function CanUseWebGL2() { return CAN_USE_WEBGL2; }
function SetCanUseWebGL2(can) { CAN_USE_WEBGL2 = can; }

// Fxxk, wx performance.now return microsecond in device,
// return millisecond in devtools, we return microsecond in here!
function Now() {
  if (WX_GAME_ENV) {
    if (WX_GAME_DEVTOOLS)
      return wx.getPerformance().now();
    else
      return wx.getPerformance().now() / 1000;
  } else {
    return performance.now();
  }
}

function CreateImage() {
  if (WX_GAME_ENV) {
    return wx.createImage();
  } else {
    return new Image();
  }
}

function GetMainCanvas(domId) {
  function GetMainCanvasImpl(domId) {
    if (WX_GAME_ENV) {
      if (window != null && window.canvas != null)
      {
        return window.canvas;
      }
      else {
        console.log("xxxxxxxxxxxxxxxx 2 ");
        return wx.createCanvas();
      }      
    } else {
      return document.getElementById(domId);
    }
  }

  if (MainCanvas != null)
    return MainCanvas;

  MainCanvas = GetMainCanvasImpl(domId);
  return MainCanvas;
}

function GetWindowSize() {
  let windowWidth = 0;
  let windowHeight = 0;
  if (WX_GAME_ENV) {
    windowWidth = SystemInfo.windowWidth;
    windowHeight = SystemInfo.windowHeight;
  } else {
    windowWidth = window.outerWidth;
    windowHeight = window.outerHeight;
  }
  return {"width":windowWidth, "height":windowHeight}
}

function GetWindowSizeInPx() {
  let windowWidth = 0;
  let windowHeight = 0;
  let dpr = 0;

  if (WX_GAME_ENV) {
    windowWidth = SystemInfo.windowWidth;
    windowHeight = SystemInfo.windowHeight;
    dpr = SystemInfo.pixelRatio;
  } else {
    windowWidth = window.outerWidth;
    windowHeight = window.outerHeight;
    dpr = window.devicePixelRatio;
  }

  let windowWidthPx = windowWidth * dpr;
  let windowHeightPx = windowHeight * dpr;

  if (Math.abs(windowWidthPx - 1080) < dpr) {
    windowWidthPx = 1080;
  } else if (Math.abs(windowWidthPx - 1440) < dpr) {
    windowWidthPx = 1440;
  }

  if (Math.abs(windowHeightPx - 1920) < dpr) {
    windowHeightPx = 1920;
  } else if (Math.abs(windowHeightPx - 2560) < dpr) {
    windowHeightPx = 2560;
  }

  return {"width":windowWidthPx, "height":windowHeightPx}
}

function GetCanvasSizeUseWindowRatio(width) {
  let windowSize = GetWindowSizeInPx();
  let height = Math.round(width * windowSize.height / windowSize.width);
  return {"width":width, "height":height}
}

let TimeUtil = {
  startTime: Now(),
  getTimer: function() { return Now() - TimeUtil.startTime; }
}

function FPSMeter() {
  let lastSampledTime = 0;
  let sampleFrames = 0;
  let framerate = 0;

  this.formatNumber = function (val) {
    //format as XX.XX
    return Math.floor(val*100)/100;
  }

  this.update = function() {
    if (++sampleFrames >= 600) {
      framerate = this.getFramerate();
      let frames = sampleFrames;
      sampleFrames = 0;
      return {"framerate": framerate, "frames": frames};
    }
    return {"framerate": 0};
  }

  this.getFramerate = function() {
    let diff = TimeUtil.getTimer() - lastSampledTime;
    let rawFPS = sampleFrames/(diff/1000);
    let sampleFPS = this.formatNumber(rawFPS);
    lastSampledTime = TimeUtil.getTimer();
    return sampleFPS;
  }
}

let wxhelper = {
  IsWxGameEnv,
  IsWxGameDevTools,
  TryUseWebGL2,
  CanUseWebGL2,
  SetCanUseWebGL2,
  Now,
  CreateImage,
  GetMainCanvas,
  GetWindowSize,
  GetWindowSizeInPx,
  GetCanvasSizeUseWindowRatio,
  TimeUtil,
  FPSMeter,
};

if (typeof window !== 'undefined') {
  window.wxhelper = wxhelper;
} else if (typeof GameGlobal !== 'undefined') {
  GameGlobal.wxhelper = wxhelper;
  GameGlobal.window = GameGlobal;
  window.top = GameGlobal.parent = window;
} else {
  console.log("Cannot find any global object!");
}

