/** Same browser/native-WebView fallback used by the existing B03 flow. */
export async function writePrototypeClipboard(text:string){
 if(navigator.clipboard&&window.isSecureContext){try{await navigator.clipboard.writeText(text);return}catch{/* Existing fallback below. */}}
 const previous=document.activeElement as HTMLElement|null,field=document.createElement('textarea')
 field.value=text;field.style.cssText='position:fixed;opacity:0;pointer-events:none';document.body.append(field);field.select()
 try{if(!document.execCommand('copy'))throw Error('Clipboard unavailable')}
 finally{field.remove();previous?.focus({preventScroll:true})}
}
