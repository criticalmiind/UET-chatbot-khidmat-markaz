import urdu from './urdu.json'

export function translate (text){
    if (text in urdu) return urdu[text]
    else return text
}