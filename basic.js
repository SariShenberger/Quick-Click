const name=document.querySelector('#name');
name.innerHTML=(JSON.parse(localStorage.getItem('userName'))||'');

const div_alert = document.querySelector('#alert');
const letters = document.querySelector('#letters');
const div_input = document.querySelector('#input');
const audioDiv = document.querySelector('#audio');
const levelButtons = document.getElementsByClassName('level');
const keys = document.getElementsByClassName('key');
let timeAdd = 200, timeRemove = 400;
const fun = (data, line) => {
    div_input.innerHTML='';
    const input=document.createElement('input');
    input.classList.add('input');
    div_input.append(input);
    console.log(input);
    letters.innerHTML = "";
    timeAdd = 200;
    timeRemove = 400;
    const lettersArr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,];
    input.value = '';
    for (let i = 0; i < lettersArr.length; i++) {
        let random;
        do {
            random = parseInt(Math.random() * data.length);
        } while (data[random].line > line || ((i === 0 || i === lettersArr.length - 1) && data[random].letter === '_'));
        lettersArr[i] = data[random].letter;
        letters.innerHTML += lettersArr[i];

    }
    const wrongsArr = [];
    input.onkeypress = (Event) => {
        const key = Event.key;
        if (english.classList.contains('none')) {
            if (((key < 'א' || key > 'ת') && key != ' ') || letters.innerHTML.length === 0) {
                Event.preventDefault();
            }
        }
        if (hebrew.classList.contains('none')) {
            if (((key < 'a' || key > 'z') && key != ' ') || letters.innerHTML.length === 0) {
                Event.preventDefault();
            }
        }
        if (key === letters.innerHTML[input.value.length] || (key === ' ' && letters.innerHTML[input.value.length] === '_')) {
            const audio = document.createElement('audio');
            const source = document.createElement('source');
            source.src = "/web-client פרויקט/audio/correct_ans.mp3";
            source.type="audio/mpeg";
            audio.append(source);
            audio.autoplay="autoplay";
            audioDiv.append(audio);
            mark(key,'correctKey');
        } else {
            const audio = document.createElement('audio');
            const source = document.createElement('source');
            source.src = "/web-client פרויקט/audio/wrong_ans.mp3";
            source.type="audio/mpeg";
            audio.append(source);
            audio.autoplay="autoplay";
            audioDiv.append(audio);
            let flag = true;
            if (input.value.length > 0) {
                for (const wrong of wrongsArr) {
                    if (wrong === letters.innerHTML[input.value.length]) {
                        flag = false;
                    }
                }
                if (flag === true) {
                    wrongsArr.push(letters.innerHTML[input.value.length]);
                }
            }
            mark(key, 'wrongKey');
        }
        // } 
        if (input.value.length + 1 === letters.innerHTML.length) {
            if (wrongsArr.length <= 2) {
                const alert = document.createElement('div');
                alert.classList.add('alert');
                alert.classList.add('alert-success');
                alert.innerHTML = `<strong>כל הכבוד!</strong> סיימת בהצלחה שעור ${line}המשך לשעור הבא.`;
                const a = document.createElement('a');
                a.title = "סגור";
                a.innerHTML = "❌";
                a.classList.add('right');
                a.onclick = () => {
                    a.classList.add('close');
                    alert.classList.add('alert-idssmissible');
                    alert.classList.add('fade');
                    alert.classList.add('in');
                    alert.classList.add('none');
                }
                alert.append(a);
                div_alert.append(alert);
            }
            else {
                const alert = document.createElement('div');
                alert.classList.add('alert');
                alert.classList.add('alert-danger');
                alert.innerHTML = `<strong>נסה שוב!</strong> האותיות הבעיתיות הן:${wrongsArr}.`;
                const a = document.createElement('a');
                a.title = "סגור";
                a.innerHTML = "❌";
                a.classList.add('right');
                a.onclick = () => {
                    a.classList.add('close');
                    alert.classList.add('alert-idssmissible');
                    alert.classList.add('fade');
                    alert.classList.add('in');
                    alert.classList.add('none');

                }
                alert.append(a);
                div_alert.append(alert);
                fun(data, line);
            }
        }
    }

}
const level = (data) => {
    for (const button of levelButtons) {
        button.onclick = () => {
            letters.innerHTML = "";
            fun(data, button.innerHTML[button.innerHTML.length - 1]);
        }
    }

}
const mark = (value, className) => {
    for (const lett of keys) {
        if (lett.innerHTML === value && value != ' ') {

            setTimeout(() => {
                console.log("time out 1")
                lett.classList.add(className);
            }, timeAdd += 100);
            setTimeout(() => {
                console.log("time out 2")
                flag = true;
                lett.classList.remove(className);

            }, timeRemove += 500);

        }

    }

}


const english = document.querySelector("#english");
const english_keyboard = document.querySelector("#english_keyboard");
const hebrew = document.querySelector("#hebrew");
const hebrew_keyboard = document.querySelector("#hebrew_keyboard");

hebrew.onclick = () => {
    input.dir = 'rtl';
    if (!english_keyboard.classList.contains('none')) {
        english_keyboard.classList.add('none');

    } if (hebrew_keyboard.classList.contains('none')) {
        hebrew_keyboard.classList.remove('none');
    } english.classList.add('none');
    let p = $.ajax({
        method: 'GET',
         url:'./hebrew.json',
        success: (data) => {
            level(data);
        }
    })
}
english.onclick = () => {
    input.dir = 'ltr';
    if (!hebrew_keyboard.classList.contains('none')) {
        hebrew_keyboard.classList.add('none');

    } if (english_keyboard.classList.contains('none')) {
        english_keyboard.classList.remove('none');
    }
    hebrew.classList.add('none');
    let p = $.ajax({
        method: 'GET',
         url:'./english.json',
        success: (data) => {
            level(data);
        }
    })
}
