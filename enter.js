const container = document.querySelector("#container");
const input = document.querySelector('#users_search');
const find = document.querySelector("#find");
const users = JSON.parse(localStorage.getItem('users')) || [];
const div_alert=document.querySelector("#alert");
function filter(arr, func) {
  let returnArr = [];
  for (let index = 0; index < arr.length; index++) {
    if (func(arr[index]))
      returnArr.push(arr[index]);
  }
  return returnArr;
}
input.onkeyup = () => {
  const newUsers = filter(users, function (x) {
    return (x.includes(input.value));
  })

  find.innerHTML = `<div class="list">` + newUsers.join(`</div ><div class="list">`) + "</div>";
  const list = document.getElementsByClassName('list');
  for (const li of list) {
    li.onclick = () => {
      input.value = li.innerHTML;

    }
  }

}

const menu = document.getElementsByClassName('menu');
const submit = document.querySelector('#submit');
const drop = document.querySelector('#drop');
submit.onclick = () => {
  if (input.value.length > 0) {
    for (const m of menu) { m.classList.remove('none'); }
    let usersContains_flag = false;
    for (const user of users) {
      if (user === input.value) {
        usersContains_flag = true;
      }
    }
    if (!usersContains_flag) {
      users.push(input.value);
      localStorage.setItem('users', JSON.stringify(users));
    }
    localStorage.setItem('userName', JSON.stringify(input.value));
  }
}


drop.onclick = () => {
  if (input.value.length > 0) {
    const alert = document.createElement('div');
    alert.classList.add('alert');
    alert.classList.add('alert-success');
    alert.innerHTML = `?<strong>סליחה?!</strong>האם ברצונך למחוק את המשתמש '${input.value}' </br> `;
    const no = document.createElement('a');
    no.title = "סגור";
    no.innerHTML = "❌";
    no.classList.add('right');
    no.onclick = () => {
      no.classList.add('close');
        alert.classList.add('alert-idssmissible');
        alert.classList.add('fade');
        alert.classList.add('in');
        alert.classList.add('none');
    }
    alert.append(no);
    const yes=document.createElement('a');
    yes.title="אשר";
    yes.innerHTML="✔"
    yes.classList.add('right');
    yes.onclick=()=>{
      alert.classList.add('alert-idssmissible');
      alert.classList.add('fade');
      alert.classList.add('in');
      alert.classList.add('none');
      for (let i = 0; i < users.length; i++) {
      if (users[i] === input.value) {
        users[i] = "";
        localStorage.setItem('users', JSON.stringify(users));
        input.value='';
      }
    }
    }
    alert.append(yes);
    div_alert.append(alert);
    
  }

}