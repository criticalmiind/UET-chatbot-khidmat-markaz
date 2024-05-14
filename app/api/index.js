const main_base_url = "https://bot.cle.org.pk/"
export const SOCKET_CONFIG = (connection1) => ({
    "transportOptions": {
        "polling": {
            "extraHeaders": {
                'connectionid': connection1
            }
        }
    }
})

export const CONST = {
}
export const uri = {
    "asr_manager": "asrManager",
    "app_manager": "applicationManager",
    "converter": "converter",
}

export const method = {
    "loginUser": "loginUser",
    "signUpUser": "signUpUser",
    "startService": "startService",
}

export async function call_application_manager(payload) {
    try {
        const rawResponse = await fetch(`${main_base_url}${uri["app_manager"]}/`, {
            method: 'POST',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const content = await rawResponse.json();
        return content;
    } catch (error) {
        return { "resultFlag": false, "message": error.message }
    }
}