import urdu from './urdu.json'

export function translate (text){
    return urdu[text]
}