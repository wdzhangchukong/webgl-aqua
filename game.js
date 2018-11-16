import "./aquarium/wxhelper.js"

import "./tdl/base.js"
import "./tdl/fast.js"
import "./tdl/io.js"
import "./tdl/log.js"
import "./tdl/clock.js"
import "./tdl/math.js"
import "./tdl/fps.js"
import "./tdl/buffers.js"
import "./tdl/misc.js"
import "./tdl/models.js"
import "./tdl/particles.js"
import "./tdl/primitives.js"
import "./tdl/programs.js"
import "./tdl/screenshot.js"
import "./tdl/shader.js"
import "./tdl/string.js"
import "./tdl/sync.js"
import "./tdl/webgl.js"
import "./tdl/textures.js"
import "./tdl/initText.js"

import "./aquarium/aquarium-shader.js"
import "./aquarium/aquarium-common.js"
import "./aquarium/aquarium.js"

// document.addEventListener('touchend', (event) => {
//   var x = event.touches[0].clientX;
//   var y = event.touches[0].clientY;
//   // console.log('touch: x:' + x + ", y:" + y);
//   // if (y > window.innerHeight - 200) {
//   if (x < window.innerWidth / 2) {
//     --fishIndex;
//     if (fishIndex < 0)
//       fishIndex = 0;
//     setSetting(null, fishIndex);
//   }
//   else {
//     ++fishIndex;
//     if (fishIndex >= g_numFish.length)
//       fishIndex = g_numFish.length - 1;
//     setSetting(null, fishIndex);
//   }
//   jsb.setDebugViewText(0, "鱼数量: " + g_numFish[fishIndex]);
//   // }
// });
