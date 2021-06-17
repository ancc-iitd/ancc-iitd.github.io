const words = [' Graphs     ', ' Dynamic Programming     ',' Linked List     ',' Recursion     ',' DFS     '];
let i = 0;
let timer;

function typingEffect() {
	let word = words[i].split('');
	var loopTyping = function () {
		if (word.length > 1) {
			document.getElementById('word').innerHTML += word.shift();
		} else {
			deletingEffect();
			return false;
		}
		timer = setTimeout(loopTyping, 100);
	};
	loopTyping();
}

function deletingEffect() {
	let word = words[i].split('');
	var loopDeleting = function () {
		if (word.length > 1) {
			word.pop();
			document.getElementById('word').innerHTML = word.join('');
		} else {
			if (words.length > i + 1) {
				i++;
			} else {
				i = 0;
			}
			typingEffect();
			return false;
		}
		timer = setTimeout(loopDeleting, 40);
	};
	loopDeleting();
}

typingEffect();