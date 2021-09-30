
let inpCode = document.getElementById('inpCode')
let btnEncode = document.getElementById('btnEncode')
let btnEncrypt = document.getElementById('btnEncrypt')
let outputGroup = document.getElementById('output-group')
let submit = document.getElementById('submit')

let code = document.getElementById('code')

let encrypted = false
let data = ''

btnEncode.onclick = function () {
    encrypted = false
    data = inpCode.value 
    data = removeConsoleLog(data)
    data = btoa(data) 
    code.value = data
}

btnEncrypt.onclick = function () {
    encrypted = true
    data = code.value
    data = encryptData(data)
    code.value = data
}

submit.onclick = async function () {
    const res = await fetch(`http://localhost:4545/eval?code=${data}&encrypted=${encrypted}`)
    const output = await res.json()

    outputGroup.innerHTML = `
    <label for="output" class="mb-2">Output :</label>
    <input class="form-control w-100 mb-4" type="text" id="output" disabled="disabled">
    `
    const domOutput = document.getElementById('output')
    domOutput.value = output.output
}

function removeConsoleLog(data) {
    const s = 'console.log(' 
    let temp = ''
    let start = -1,end = -1,idx = 0,lastBracket = -1,tempIdx = 0
    let check = false
    for (let i = 0; i < data.length; i++) {
        if(idx === s.length) check = true
        if(!check) { 

            if( data[i] !== s[idx]) idx = 0

            if(data[i] === s[idx]) {
                if(idx === 0) start = i
                idx++
            }
        }
        
        if(check) { 

            if( temp.length === 0) tempIdx = 0
            if(data[i] === '\n' || data[i] === ';' || i === data.length-1) {
                if(i === data.length -1) temp += data[i]
                check = false
                idx = 0
            }
            else temp += data[i]
            if(data[i] === ')' ) end = tempIdx
            tempIdx++
        }
        
    }
    temp = temp.slice(0,end)
    const from = `console.log(${temp})`

    const newData = data.replace(from,temp)

    return newData
}

function encryptData(rawData) {
    
    let s = ""
    Array.from(rawData).forEach((char) => {
        s += (char === char.toLowerCase())?(char.toUpperCase()):(char.toLowerCase())
    })
    return s
}