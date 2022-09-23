const TOKEN = "852d4287-aaec-4298-bf32-f86d0d545ddf";
const SOCKET_URL = `wss://tech.cle.org.pk:9991/client/ws/speech?content-type=audio/x-raw,+layout=(string)interleaved,+rate=(int)16000,+format=(string)S16LE,+channels=(int)1,+token=${TOKEN}`;
const base_url = "https://api.cle.org.pk";
const query_answer = "https://f016-202-142-159-37.ngrok.io/webhooks/rest/webhook";
const uri = {
    "asr": "/v1/asr",
    "synth": "/v1/synth"
}

export {
    SOCKET_URL
}

export async function speechToTextApi(base64) {
    let payload = { file: base64, token: TOKEN, lang: "ur", srate: "0" };
    const rawResponse = await fetch(`${base_url}${uri.asr}`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });
    const content = await rawResponse.json();
    return content;
}

export async function textTotSpeechApi(obj) {
    obj["token"] = TOKEN;
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

export async function askQuestionApi(obj) {
    const rawResponse = await fetch(`${query_answer}`, {
        method: 'POST',
        body: JSON.stringify({ "sender": 1, ...obj })
    });
    const content = await rawResponse.json();
    return content;
}