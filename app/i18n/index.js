import urdu from './urdu.json'

export function translate (text){
    if (text.includes("JSON parse error")) return urdu["Network request failed"]
    if (text in urdu) return urdu[text]
    else return text
}