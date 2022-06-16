const token = "852d4287-aaec-4298-bf32-f86d0d545ddf";
const base_url = "https://api.cle.org.pk";
const query_answer = "https://d3ae-202-142-159-37.ngrok.io/webhooks/rest/webhook";
const uri = {
    "asr":"/v1/asr",
    "synth":"/v1/synth"
}

export async function speechToTextApi(obj){
    obj["token"] = token;
    const rawResponse = await fetch(`${base_url}${uri.asr}`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(obj)
    });
    const content = await rawResponse.json();
    return content;
}

export async function textTotSpeechApi(obj){
    obj["token"] = token;
    const rawResponse = await fetch(`${base_url}${uri.synth}`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(obj)
    });
    const content = await rawResponse.json();
    return content;
}

export async function askQuestionApi(obj){
    const rawResponse = await fetch(`${query_answer}`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "sender":1, ...obj })
    });
    const content = await rawResponse.json();
    return content;
}