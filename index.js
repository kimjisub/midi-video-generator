const fs = require('fs-extra')
const parseMidi = require('midi-file').parseMidi
const AEScriptRunner = require('./ae/AEScriptRunner')
const input = fs.readFileSync('midi/플랑도르s.mid')
const parsed = parseMidi(input)
console.log(parsed)

var time = 0
var speed = 1.2
var outfadeTime = 0.3
var list = []

for(i in parsed.tracks[1]){
	const data = parsed.tracks[1][i]
	time += data.deltaTime / 480 * speed

	switch(data.type){
		case 'noteOn':
			list.push([data.noteNumber, time, 10000])
			break;
		case 'noteOff':
			for(var j = list.length-1 ; j>=0 ; j--){
				var prev = list[j]
				if(prev[0] == data.noteNumber){
					prev[2] = time + outfadeTime
					break
				}
			}
			break;
	}
}

console.log(JSON.stringify(list))

AEScriptRunner.generate(list, __dirname+'/ae')
	.then(() => {
		console.log('jsx generate success')
		AEScriptRunner.run(__dirname+'/ae')
		.then((code) => {
			console.log('jsx run success')
		})
		.catch((err) => {
			console.log('jsx run fail')
			console.log(err)
		})
	})
	.catch((err) => {
		console.log('jsx generate fail')
		console.log(err)
	})


//40~76 총 37개
