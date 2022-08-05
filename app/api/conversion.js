import { decode as atob, encode as btoa } from 'base-64'

function b64ToBlob(b64Data, contentType, sliceSize) {
	contentType = contentType || '';
	sliceSize = sliceSize || 512;

	var byteCharacters = atob(b64Data);
	var byteArrays = [];

	for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
		var slice = byteCharacters.slice(offset, offset + sliceSize);

		var byteNumbers = new Array(slice.length);
		for (var i = 0; i < slice.length; i++) {
			byteNumbers[i] = slice.charCodeAt(i);
		}

		var byteArray = new Uint8Array(byteNumbers);

		byteArrays.push(byteArray);
	}

	var blob = new Blob(byteArrays, { type: contentType });
	return blob;
}

export function base64ToBlob(base64) {
	try {
		var arr = base64.split(',');
		var mime = arr[0].match(/:(.*?);/)[1];
		return Promise.resolve(b64ToBlob(arr[1], mime))
	} catch (e) {
		return Promise.reject(e)
	}
}

export const Base64Binary = {
	_keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

	/* will return a  Uint8Array type */
	decodeArrayBuffer: function (input) {
		var bytes = (input.length / 4) * 3;
		var ab = new ArrayBuffer(bytes);
		this.decode(input, ab);

		return ab;
	},

	decodeAsBlob: function (byteArrays, contentType = '') {
		var blob = new Blob(byteArrays, { type: contentType });
		return blob
	},

	removePaddingChars: function (input) {
		var lkey = this._keyStr.indexOf(input.charAt(input.length - 1));
		if (lkey == 64) {
			return input.substring(0, input.length - 1);
		}
		return input;
	},

	decode: function (input, arrayBuffer) {
		//get last chars to see if are valid
		input = this.removePaddingChars(input);
		input = this.removePaddingChars(input);

		var bytes = parseInt((input.length / 4) * 3, 10);

		var uarray;
		var chr1, chr2, chr3;
		var enc1, enc2, enc3, enc4;
		var i = 0;
		var j = 0;

		if (arrayBuffer)
			uarray = new Uint8Array(arrayBuffer);
		else
			uarray = new Uint8Array(bytes);

		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

		for (i = 0; i < bytes; i += 3) {
			//get the 3 octects in 4 ascii chars
			enc1 = this._keyStr.indexOf(input.charAt(j++));
			enc2 = this._keyStr.indexOf(input.charAt(j++));
			enc3 = this._keyStr.indexOf(input.charAt(j++));
			enc4 = this._keyStr.indexOf(input.charAt(j++));

			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;

			uarray[i] = chr1;
			if (enc3 != 64) uarray[i + 1] = chr2;
			if (enc4 != 64) uarray[i + 2] = chr3;
		}

		return uarray;
	}
}

export const dataURItoBlob = (dataURI) => {
	// convert base64 to raw binary data held in a string
	// doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
	let byteString = atob(dataURI.split(',')[1]);

	// separate out the mime component
	let mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

	// write the bytes of the string to an ArrayBuffer
	let ab = new ArrayBuffer(byteString.length);
	let ia = new Uint8Array(ab);
	for (let i = 0; i < byteString.length; i++) {
		ia[i] = byteString.charCodeAt(i);
	}

	return new Blob([ab], { type: mimeString });
}

export const generateBlob = base64URL => fetch(base64URL)
	.then(response => response.blob())
	.then(response => console.log('Your blob is' + response))

export function custom_atob(input) {
	var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
	var str = (String(input)).replace(/[=]+$/, ''); // #31: ExtendScript bad parse of /=
	if (str.length % 4 === 1) {
		console.log("'atob' failed: The string to be decoded is not correctly encoded.");
	}
	for (
		// initialize result and counters
		var bc = 0, bs, buffer, idx = 0, output = '';
		// get next character
		buffer = str.charAt(idx++); // eslint-disable-line no-cond-assign
		// character found in table? initialize bit storage and add its ascii value;
		~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer,
			// and if not first of each 4 characters,
			// convert the first 8 bits to one ascii character
			bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0
	) {
		// try to find character in table (0-63, not found => -1)
		buffer = chars.indexOf(buffer);
	}
	return output;
}