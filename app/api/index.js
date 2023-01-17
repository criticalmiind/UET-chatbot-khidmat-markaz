const main_base_url = "https://bot.cle.org.pk/"

export const uri = {
    "asr_manager":"asrManager",
    "app_manager":"applicationManager",
    "converter":"converter",
}

export const method = {
    "loginUser": "loginUser",
    "signUpUser": "signUpUser",
    "startService": "startService",
    "rasaInput": "rasaInput",
    "doSynthesis": "doSynthesis",
    "openAsrConnection": "openAsrConnection", // payload = {"function":"openAsrConnection","connectionId": connectionId}
    "closeConnection": "closeConnection", // payload = {"function":"closeConnection","connectionId": connectionId,"sessionId":sessionId}
}

export async function run_scripts(string) {
    const rawResponse = await fetch(`http://kamaljankamal4.pythonanywhere.com`, {
    // const rawResponse = await fetch(`http://lovopyda.pythonanywhere.com/`, {
    // const rawResponse = await fetch(`${main_base_url}${uri["converter"]}/`, {
        method: 'POST',
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify({ "base64": string })
    })
    const content = await rawResponse.blob();
    return content;
}

export async function call_application_manager(payload){
    const rawResponse = await fetch(`${main_base_url}${uri["app_manager"]}/`, {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    const content = await rawResponse.json();
    return content;
}

export async function call_asr_manager(payload){
    const rawResponse = await fetch(`${main_base_url}${uri["asr_manager"]}/`, {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    const content = await rawResponse.json();
    return content;
}

export async function tts_manager(obj) {
    const rawResponse = await fetch(`${this.get_resource('tts')}`, {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ "function":method['doSynthesis'], "connectionId": this.get_resource('cid'), ...obj })
    });
    const content = await rawResponse.json();
    return content;
}

export async function dialogue_manager(obj) {
    const rawResponse = await fetch(`${this.get_resource('dm')}`, {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ "function":method['rasaInput'], "connectionId": this.get_resource('cid'), ...obj })
    });
    const content = await rawResponse.json();
    return content;
}