const express = require("express");
const app = express();
const axios = require("axios");
const port = 9999;

async function getLookupStr(retryCount){
    try{
        console.log("Retry Count - LookupStr - API Call", retryCount);
        const response = await axios.get("https://join.reckon.com/test2/textToSearch",)
        /* const mockRestextToSearch = {
            text:
            "Peter told me (actually he slurred) that peter the pickle piper a pitted pickle before he petered out. Phew!"};
        */
            // return mockRestextToSearch;
            if (response.statusText === "OK"){
                return response.data
                }else{
                    console.log("Retrying getLookupStrAPICall");
                    return getLookupStr(++retryCount);
                }         
            }catch(err){
        console.log("Err in rangeInfo: ", err.response.status)
        if (err.response.statusText !== "OK"){
                return getLookupStr(++retryCount);
            }else{
                return response.data        
            }         
          }
        }

async function getSearchStr(retryCount){
    try{
        console.log("Retry Count - SearchStr - API Call :", retryCount);
        const response = await axios.get("https://join.reckon.com/test2/subTexts",)
        /* const mockResSubTexts = {
            subTexts: ["Peter", "peter", "Pick", "Pi", "Z"]
            };
        */
        //  return mockResSubTexts;
        if (response.statusText === "OK"){
            return response.data}else{
            console.log("Retrying getSearchStrAPICall");
            return getSearchStr(++retryCount);
        }
    }catch(err){
        console.log("Err in getSearchStr: ", err.response.status)
        if (err.response.statusText !== "OK"){
            return getSearchStr(++retryCount);
        }else{
            return response.data;        
        }     
    }
}

async function callAPIs(){
    try{
        let apisResponses=[];
        apisResponses.push(await getLookupStr(0))
        apisResponses.push(await getSearchStr(0))
        return apisResponses;
    }catch(err){
        console.log("Error: ", err)
    }
}

async function postResult(retryCount, data){
    console.log("Retry Count - postResult:", retryCount);
    try{
        const response = await axios.post(
            "https://join.reckon.com/test2/submitResults",
            data
        )
        if (response.statusText === "OK"){
            return response.data}else{
            console.log("Retrying postResultAPICall");
            return postResult(++retryCount);
        }
    }catch(err){
        console.log("Err in postResult: ", err.response.status)
        if (err.response.statusText !== "OK"){
            return postResult(++retryCount);
        }else{
            return response.data;        
        }     
    }
}

async function performSubStrSearchAndPostResult(req, res){
    console.log("-----------------------START-----------------------");
    const apisResponses = await callAPIs();
    let results = apisResponses[1].subTexts.map((searchStr) => {
let position = findSubStr(
    apisResponses[0].text.toLowerCase(), searchStr.toLowerCase()
);
if(position==="NOT_FOUND"){
    return {subtext: searchStr, result: "<No Output>"}
}else{
    return {subtext: searchStr, result: position}
}
    }
    )
console.log({
    candidate: "Rohit Mody",
    text: apisResponses[0].text,
    results: results
})
postResult(0, {
    candidate: "Rohit Mody",
    text: apisResponses[0].text,
    results: results
});
console.log("-----------------------END-----------------------");
res.set("Content-Type", "application/json");
res.status(204)
res.send("Ok")
}

function findSubStr(str, sub){
    let position = "";
    if(sub.length > str.length){
        return "NOT_FOUND"
    }
    for (let i=0; i < str.length - sub.length + 1; i++){
        if(str[i] !== sub[0]) continue;
        let exists = true;
        let j;
        for (j=1; j < sub.length && exists; j++) {
            if (str[i + j] === sub[j]) continue;
            exists=false
        }
        if(exists){
            if(position === ""){
                position = "" + (i + 1)
            }else{
                position = position + ", " + (i + 1)
            }
        }
    }
    console.log(position)
    if(position.length > 0){
        return position;
    }else{
        return "NOT_FOUND";
    }
}

app.get("/", (req, res) => {
    performSubStrSearchAndPostResult(req, res);
})

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
});

module.exports = findSubStr;