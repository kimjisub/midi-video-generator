

//var row = 2
//var col = 2
//var data = [[67,3,3.9],[66,3.6,4.5]]

var AVWidth = 1 / colNum * 100
var AVHeight = 1 / rowNum * 100

var proj = app.project
var comp = getComposition()
var layers = comp.layers

var chanelEndTime = []; for(var i=0;i<rowNum*colNum;i++) chanelEndTime[i]=0

	
app.beginUndoGroup('Midi Video Generator by kimjisub')

var minNote = -1
var maxNote = -1
for(var i = 0; i < data.length; i++){
	var tmp = data[i]
	var note = tmp[0]
	var startTime = tmp[1]
	var endTime = tmp[2]

	// Get range of notes
	if(maxNote == -1 || maxNote < note) maxNote = note
	if(minNote == -1 || minNote > note) minNote = note

	// Get note AVItem
	var item = getItemByName(note+'.mp4')
	if (item == null) continue;

	// Select video position
	var chanel = findSmallIndex(chanelEndTime)
	chanelEndTime[chanel] = endTime
	var row = Math.floor(chanel / rowNum)
	var col = Math.floor(chanel % colNum)

	// Apply note
	var layer = layers.add(item)
	layer.quality = LayerQuality.BEST
	layer.startTime = startTime
	layer.outPoint = endTime
	layer.position.setValue([compWidth/colNum*col, compHeight/rowNum*row,0])
	layer.scale.setValue([AVWidth, AVHeight, 0.0])
	layer.anchorPoint.setValue([0,0])
	//layer.width = AVWidth
	//layer.height = AVHeight
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

function findSmallIndex(arr){
	var value = arr[0]
	var index = 0
	for (var i=0;i<arr.length;i++)
		if(arr[i] < value){
			value = arr[i]
			index = i
		}
	return index 
}