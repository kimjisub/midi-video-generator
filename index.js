const fs = require("fs-extra");
const parseMidi = require("midi-file").parseMidi;
const AfterEffectScriptLauncher = require("aftereffect-script-launcher")();
const input = fs.readFileSync("midi/Twilight.mid");
const parsed = parseMidi(input);
console.log(parsed);

var time = 0;
var speed = 0.8;
var outfadeTime = 0;
var defaultDuration = 1;
var row = 1;
var col = 1;

var list = [];
var chanelList = [];
for (var i = 0; i < row * col; i++) chanelList[i] = false;
var maxMultiplayCount = 0;
var multiplayCount = 0;

for (i in parsed.tracks[1]) {
  const data = parsed.tracks[1][i];
  time += (data.deltaTime / 480) * speed;

  switch (data.type) {
    case "noteOn":
      var noteNumber = data.noteNumber;

      list.push([noteNumber, time, time + defaultDuration]);

      multiplayCount += 1;
      if (multiplayCount > maxMultiplayCount)
        maxMultiplayCount = multiplayCount;
      break;
    case "noteOff":
      for (var j = list.length - 1; j >= 0; j--) {
        var prev = list[j];
        if (prev[0] == data.noteNumber) {
          prev[2] = time + outfadeTime;
          break;
        }
      }

      multiplayCount -= 1;
      break;
  }
}

const data = `
var data = ${JSON.stringify(list)}
var maxMultiplayCount = ${maxMultiplayCount}
var rowNum = ${row}
var colNum = ${col}
var compWidth = 1920
var compHeight = 1080
`;

AfterEffectScriptLauncher.generate(
  data,
  `${__dirname}/AEScript.jsx`,
  `${__dirname}/AEScriptWithData.jsx`
)
  .then(path => {
    console.log("jsx generate success");
    AfterEffectScriptLauncher.run(path)
      .then(code => {
        console.log("jsx run success");
      })
      .catch(err => {
        console.log("jsx run fail");
        console.log(err);
      });
  })
  .catch(err => {
    console.log("jsx generate fail");
    console.log(err);
  });

//40~76 총 37개
