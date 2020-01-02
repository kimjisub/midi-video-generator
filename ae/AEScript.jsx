

//var data = [[67,3,3.9],[66,3.6,4.5]]

var proj = app.project
var comp = getComposition()
var layers = comp.layers


app.beginUndoGroup('Midi Video Generator')

var minNote = -1
var maxNote = -1
for(var i = 0; i < data.length; i++){
	var tmp = data[i]
	var note = tmp[0]
	var startTime = tmp[1]
	var outPoint = tmp[2]

	if(maxNote == -1 || maxNote < note)
		maxNote = note
	if(minNote == -1 || minNote > note)
		minNote = note

	var item = getItemByName(note+'.mp4')
	if (item == null)
		continue;
	var layer = layers.add(item)

	layer.quality = LayerQuality.BEST;
	layer.startTime = startTime;
	layer.outPoint = outPoint;

}

app.endUndoGroup()

alert(minNote + " ~ " + maxNote)






function getComposition() {
	for (var i = 1; i <= proj.numItems; i++)
		if(proj.item(i).typeName == "컴포지션")
			return proj.item(i)
	return null
}

function getItemByName(name) {
	for (var i = 1; i <= proj.numItems; i++)
		if(proj.item(i).name == name)
			return proj.item(i)
	return null
}