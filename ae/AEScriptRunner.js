const fs = require('fs-extra')
const { exec } = require('child_process')

const jsxSourcePath = `${__dirname}/AEScript.jsx`.replace(/\\/gi, '/')

const afterfx = 'C:/Program Files/Adobe/Adobe After Effects 2020/Support Files/afterfx.exe'


let child_process

module.exports = {
	generate: (data, path) => new Promise((resolve, reject) => {
		try{
			const jsxPath = `${path}/AEScriptWithData.jsx`.replace(/\\/gi, '/')

			fs.writeFileSync(jsxPath, data, 'utf-8')

			let jsxSourceStream = fs.createReadStream(jsxSourcePath)
			let jsxStream = fs.createWriteStream(jsxPath, {'flags': 'a'})

			jsxSourceStream
				.on('data', function(chunk) {
					jsxStream.write(chunk)
				})
				.on('end', function() {
					jsxStream.end()
				})
			return resolve()
		}catch(err){
			return reject(err)
		}
	}),
	run : (path) => new Promise((resolve, reject) => {
		try{
			const jsxPath = `${path}/AEScriptWithData.jsx`.replace(/\\/gi, '/')
			
			let command = `"${afterfx}" -r ${jsxPath}`
			console.log('AE_jsx: ' + command)

			child_process = exec(command)

			// success 
			child_process.stdout.on('data', (data) => {
				console.log('AE_jsx: ' + data)
			})
    
			// err
			child_process.stderr.on('data', (data) => {
				console.error('AE_jsx: ' + data)
			})
    
			// done
			child_process.on('exit', (code) => {
				return resolve(code)
			})
            
		}catch(err){
			return reject(err)
		}
	}),
	kill : () => {
		child_process.kill()
	}
}
