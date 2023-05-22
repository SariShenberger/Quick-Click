const name = document.querySelector('#name');
name.innerHTML = (JSON.parse(localStorage.getItem('userName')) || '');

const div_alert = document.querySelector("#alert");
const letters = document.querySelector('#letters');
const div_input = document.querySelector('#div_input');
const audioDiv = document.querySelector('#audio');
const levelButtons = document.getElementsByClassName('level');
const cardsContainer = document.querySelector('#cards_container');
const cards = document.getElementsByClassName('mycard');
const input = document.createElement('input');


const fun = (data, line) => {
    startCards();
    const fillLetters = (data, line) => {
        input.classList.add('input');
        div_input.append(input);
        console.log(input);
        letters.innerHTML = "";
        const lettersArr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        input.value = '';
        for (let i = 0; i < lettersArr.length; i++) {
            let random;
            do {
                random = parseInt(Math.random() * data.length);
            } while (data[random].line > line || ((i === 0 || i === lettersArr.length - 1) && data[random].letter === '_'));
            lettersArr[i] = data[random].letter;
            letters.innerHTML += lettersArr[i];

        }
    }
    fillLetters(data, line);
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
                    source.type = "audio/mpeg";
                    audio.append(source);
                    audio.autoplay = "autoplay";
                    audioDiv.append(audio);
                    open();
                } else {
                    const audio = document.createElement('audio');
                    const source = document.createElement('source');
                    source.src = "/web-client פרויקט/audio/wrong_ans.mp3";
                    source.type = "audio/mpeg";
                    audio.append(source);
                    audio.autoplay = "autoplay";
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
                    close();
                }
     
        if (input.value.length >= letters.innerHTML.length - 1) {
            fillLetters(data, line);
            input.value = '';
            Event.preventDefault();
        }
    }


    const open = () => {
        let flag = false;
        for (let i = 0, j = 0; i < 2 && j++ < 100;) {
            const randomCard = parseInt(Math.random() * cards.length);
            if (cards[randomCard].classList.contains('close')) {
                cards[randomCard].classList.remove('close');
                flag = true;
                i++;
            }
        }
        if (flag === false) {
            if (wrongsArr.length <= 5) {
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

            }
            startCards();
        }
    }}
    const close = () => {
        let flag = false;
        for (let i = 0, j = 0; i < 3 && j++ < 100;) {
            const randomCard = parseInt(Math.random() * cards.length);
            if (!cards[randomCard].classList.contains('close')) {
                cards[randomCard].classList.add('close');
                flag = true;
                i++;
            }

        }
        if (flag === false) {
            const alert = document.createElement('div');
            alert.classList.add('alert');
            alert.classList.add('alert-danger');
            alert.innerHTML = `<strong>חבל!</strong> חזור שוב על שעור זה.`;
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
    }



    const startCards = () => {
        let randomImg = parseInt(Math.random() * 15 + 1);
        cardsContainer.style=`background-image: url('cards_image/${randomImg}.jpg');border-radius: 20px;`;
        for (const c of cards) {
            if (!c.classList.contains('close')) {
                c.classList.add('close');
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

const hebrew = document.querySelector("#hebrew");
const english = document.querySelector("#english");
hebrew.onclick = () => {
    input.dir = 'rtl';
    english.classList.add('none');
    let p = $.ajax({
        method: 'GET',
        url: './hebrew.json',
        success: (data) => {
            level(data);
        }
    })
}
english.onclick = () => {
    input.dir = 'ltr';
    hebrew.classList.add('none');
    let p = $.ajax({
        method: 'GET',
        url: './english.json',
        success: (data) => {
            level(data);
        }
    })
}