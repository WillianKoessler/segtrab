function formatDate(date, format = "dd/mm/YYYY HH:MM:SS") {
	const d = new Date(date);

	const map = {
		dd: String(d.getDate()).padStart(2, '0'),
		d: d.getDate(),
		mm: String(d.getMonth() + 1).padStart(2, '0'),
		m: d.getMonth() + 1,
		YYYY: d.getFullYear(),
		YY: String(d.getFullYear()).slice(-2),
		HH: String(d.getHours()).padStart(2, '0'),
		H: d.getHours(),
		MM: String(d.getMinutes()).padStart(2, '0'),
		M: d.getMinutes(),
		SS: String(d.getSeconds()).padStart(2, '0'),
		S: d.getSeconds(),
		N: d.getMilliseconds(),
	};

	return format.replace(/YYYY|YY|dd|d|mm|m|HH|H|MM|M|SS|S/g, match => map[match]);
}

function formatExceptionStacktrace(exception) {
	if (!exception || !exception.stack)
		return null;

	return exception.stack.split('\n').map(line => line.replace(/\s*at /, '')).slice(1);
}

function randomString(length, with_uppercase = false) {
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	let result = '';
	while (result.length < length)
		result += with_uppercase
			? chars.charAt(Math.floor(Math.random() * chars.length))
			: Math.random().toString(36).substring(2, 12);
	return result.substring(0, length);
}

function displayError(error) {
	const sanitize = str => str.replace(/\n/g, '<br>').replace(/ /g, '&nbsp;');

	document.body.classList.toggle('overflow-hidden')

	const container = document.createElement('div');
	container.id = "error_overlay"
	container.className = "print:hidden fixed top-0 left-0 w-screen h-screen bg-black/50 justify-center items-center"

	const main = document.createElement('div');
	main.className = "bg-red-200 text-red-900 p-4 border border-red-900 rounded-lg w-fit mx-auto flex flex-row justify-between items-start";

	const closeBtn = document.createElement('button');
	closeBtn.className = "size-6 rounded-md bg-red-300 color-white border border-red-900";
	closeBtn.type = 'button';
	closeBtn.append("X");
	closeBtn.onclick = event => {
		document.body.classList.toggle('overflow-hidden', false);
		container.parentElement.removeChild(container);
	}
	main.innerHTML = `<div><strong>Error Message:</strong>${sanitize(error.message)}<br><br><strong>Stacktrace:</strong><br>${sanitize(error.stack)}</div>`;
	main.appendChild(closeBtn);
	container.appendChild(main);

	document.body.appendChild(container);
}
