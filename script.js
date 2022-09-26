"use strict";

window.addEventListener("DOMContentLoaded", displayLogin);

let allStudents = [];
let searchStudentList = [];
let pureStudents = [];

let isHacked = false;
let keystroke = "";

const settings = {
  filterBy: "all",
  sortBy: "firstName",
  sortDir: "asc",
  search: "",
};

const Student = {
  prefect: false,
  attending: true,
  expelled: false,
  squad: false,
  firstName: "",
  nickName: "",
  middelName: "",
  lastName: "",
  gender: "",
  house: "",
  image: "",
  blood: "",
};

const studentList = document.getElementById("student_list");
const template = document.getElementById("student");
const studentModal = document.getElementById("student_modal");
const notification = document.getElementById("notification");
const proceedPopup = document.getElementById("proceed");
const proceedMessage = document.getElementById("message_proceed");
const yesBtn = document.getElementById("yes_btn");
const noBtn = document.getElementById("no_btn");
const hackedPopup = document.getElementById("hacked_popup");

const urlList = "https://petlatkea.dk/2021/hogwarts/students.json";
const urlBlood = "https://petlatkea.dk/2021/hogwarts/families.json";

// joke login screen here
function displayLogin() {
  studentModal.style.display = "none";
  notification.style.display = "none";
  proceedPopup.style.display = "none";
  hackedPopup.style.display = "none";

  document.querySelector(".login_1").addEventListener("click", start);
  document.querySelector(".login_2").addEventListener("click", start);
}

function start() {
  //   console.log(`start`);
  document.querySelector("#login_page").style.display = "none";
  // TODO: register all buttons
  registerBtn();
  fetchData();
}

// register btn for filter sort and search bar
function registerBtn() {
  // filter btns - click
  document.querySelectorAll("[data-action='filter']").forEach((button) => button.addEventListener("click", selectFilter));
  // filter btns - click
  document.querySelectorAll("[data-action='sort']").forEach((button) => button.addEventListener("click", selectSort));
  // search bar - input
  document.querySelector("#search_bar").addEventListener("input", searchInput);
  // secret keystroke
  // document.querySelector("#search_bar").addEventListener("input", getSecretKeystroke);
  window.addEventListener("keydown", getSecretKeystroke);
}

// todo input search function

function searchInput(evt) {
  // console.log(`searchInput`);
  //? if input value = firstname includes input or includes lastname ? then filter to show only them in display list

  let searchStudentList = allStudents.filter((student) => {
    let searchInput = evt.target.value;
    searchInput = searchInput.trim();

    // console.log(`searchInput is _${searchInput}_`);

    return student.firstName.toLowerCase().includes(searchInput);
  });

  // console.log(searchStudentList)

  displayList(searchStudentList);
}

// fetch data students
async function fetchData() {
  const response = await fetch(urlList);
  const studentList = await response.json();
  //   console.log(`studentList is `, studentList);

  // call prepare data
  prepareData(studentList);
}

// use map to prep data
function prepareData(list) {
  allStudents = list.map(cleanData);
  //   console.log(`allStudents is `, allStudents);
  const startCount = allStudents.length;

  displayStartCount(startCount);

  // todo display count students
  displayCounts(allStudents);
  displayDisplayedCount(allStudents);

  displayList(allStudents);
}

// clean the data, will return a clean student with blood
// NO TOUCHY - done
function cleanData(elm) {
  const student = Object.create(Student);

  //TRIM (fullName, house, gender)
  let fullName = elm.fullname.trim();
  let house = elm.house.trim();
  let gender = elm.gender.trim();

  //   to lowercase
  fullName = fullName.toLowerCase();
  //   console.log(fullName);
  gender = gender.toLowerCase();
  house = house.toLowerCase();

  // make new array for all srtings in fullname
  let fullNameArray = fullName.split(" ");

  //* FIRSTNAME
  //uppercase on the first letter and rest lowercase
  let firstName = fullNameArray[0];
  firstName = firstName[0].toUpperCase() + firstName.substring(1);
  student.firstName = firstName;
  //console.log(student.firstname);

  //* MIDDLENAME
  //trim + uppercase on the first letter and the rest lowercase
  let indexOfFirst = fullName.indexOf(` `);
  let indexOfLast = fullName.lastIndexOf(` `);

  let middleName = fullName.substring(indexOfFirst, indexOfLast);

  // if middle name is empty display "no middle name"
  if (middleName === "" || middleName.includes(`"`)) {
    student.middleName = "No middle name";
  } else if (middleName !== "") {
    if (middleName.includes(` `)) {
      // if middle includes a space - replace space with empty character (" " to "")
      // middleName = middleName.replace(` `, ``);
      middleName = middleName.trim();
      student.middelName = middleName;
    }
    // uppercase first letter
    middleName = middleName[0].toUpperCase() + middleName.substring(1);
    student.middleName = middleName;
    //   console.log(`middleName is _${middleName}_`);
  }

  //   console.log(student.middleName);

  //* NICKNAME
  let nickName;

  if (fullName.includes(`"`)) {
    nickName = fullName.substring(fullName.indexOf(`"`) + 1, fullName.lastIndexOf(`"`));
    nickName = nickName.charAt(0).toUpperCase() + nickName.substring(1);
    student.nickName = nickName;
  } else {
    student.nickName = "Nick Name unknown'";
  }
  //   console.log(student.nickName);

  //* LASTNAME
  //trim + uppercase on the first letter and the rest lowercase
  let lastName = fullNameArray[fullNameArray.length - 1];
  // console.log(fullName.length);

  if (fullName.length <= 6) {
    student.lastName = `Last name unknown`;
  } else {
    lastName = lastName[0].toUpperCase() + lastName.substring(1);
    student.lastName = lastName;
  }
  //console.log(student.lastName);

  //* GENDER
  student.gender = gender.substring(0, 1).toUpperCase() + gender.substring(1).toLowerCase();
  //console.log(student.gender);

  //* HOUSE
  student.house = house.substring(0, 1).toUpperCase() + house.substring(1).toLowerCase();
  //console.log(student.house);

  //* IMAGE
  let image;
  //* look at images and student names - find a pattern
  //* all images src have last name written, a _ and first letter firstname
  //* exceptions are : Leanne and the Patils and finch-fletchey

  // if student name has no last name - Leanne
  if (!fullName.includes(" ")) {
    image = `/images/no_image.png`;
  }
  // only 2 img src same last name - Patil (Parvati & Padma)
  // so if student name includes patil
  else if (fullName.toLowerCase().includes("patil")) {
    image = `./images/${lastName.toLowerCase()}_${firstName.toLowerCase()}.png`;
  }
  // if student includes "-" - finch fletchey
  else if (fullName.includes("-")) {
    image = `./images/${fullName.substring(fullName.lastIndexOf("-") + 1).toLowerCase()}_${student.firstName[0].toLowerCase()}.png`;
  }
  // if student name has last name and first name and is only one with last name (the OG pattern)
  else {
    image = `./images/${fullName.substring(fullName.lastIndexOf(" ") + 1).toLowerCase()}_${student.firstName[0].toLowerCase()}.png`;
  }

  student.image = image;
  //   console.log(student.image)

  //* BLOOD

  loadBloodJSON();

  async function loadBloodJSON() {
    const response = await fetch(urlBlood);
    const bloodList = await response.json();
    student.blood = addBlood(bloodList);

    addBlood(bloodList);

    function addBlood(bloodList) {
      // console.log(bloodList)
      if (bloodList.pure.includes(student.lastName) == true) {
        return "pure";
      } else if (bloodList.half.includes(student.lastName) == true) {
        return "half";
      } else {
        return "muggle";
      }
    }
  }

  //   console.log(student);
  //   fuck yeah -- so far so good

  // push em all in clean array for all students + their bloooooooooooooood fuuuuuck yeaaaaah
  return student;
}

// TODO FILTER

function selectFilter(event) {
  const filter = event.target.dataset.value;
  // console.log(`user selected ${filter}`);

  //TODO find old sort elm
  const oldFiltElm = document.querySelector(`[data-value='${settings.filterBy}']`);
  // console.log(`oldFiltElm`, oldFiltElm);
  // TODO unstyle it
  oldFiltElm.classList.remove("filterby");

  // todo style active elm
  event.target.classList.add("filterby");
  // console.log(`event target`, event.target);

  settings.filterBy = filter;
  makeCurrentList();
}

//create filtered list
function filterList(filteredList) {
  //let filteredList = allStudents
  if (settings.filterBy === "Gryffindor") {
    //create a filtered list of only gry
    filteredList = allStudents.filter(isGryffindor);
  } else if (settings.filterBy === "Ravenclaw") {
    //create a filtered list of only rav
    filteredList = allStudents.filter(isRavenclaw);
  } else if (settings.filterBy === "Hufflepuff") {
    //create a filtered list of only huf
    filteredList = allStudents.filter(isHufflePuff);
  } else if (settings.filterBy === "Slytherin") {
    //create a filtered list of only sly
    filteredList = allStudents.filter(isSlytherin);
  } else if (settings.filterBy === "expelled") {
    //create a filtered list of only sly
    filteredList = allStudents.filter(isExpelled);
  } else if (settings.filterBy === "attending") {
    //create a filtered list of only sly
    filteredList = allStudents.filter(isAttending);
  } else if (settings.filterBy === "prefect") {
    //create a filtered list of only sly
    filteredList = allStudents.filter(isPrefect);
  } else if (settings.filterBy === "squad") {
    //create a filtered list of only sly
    filteredList = allStudents.filter(isSquad);
  } else if (settings.filterBy === "pure") {
    //create a filtered list of only pure
    filteredList = allStudents.filter(isPure);
  } else if (settings.filterBy === "half") {
    //create a filtered list of only half
    filteredList = allStudents.filter(isHalf);
  } else if (settings.filterBy === "muggle") {
    //create a filtered list of only muggle
    filteredList = allStudents.filter(isMuggle);
  } else if (settings.filterBy === "Boy") {
    //create a filtered list of only boy
    filteredList = allStudents.filter(isBoy);
  } else if (settings.filterBy === "Girl") {
    //create a filtered list of only girl
    filteredList = allStudents.filter(isGirl);
  }
  return filteredList;
}

// isFunctions
function isGryffindor(student) {
  return student.house === "Gryffindor";
}
function isRavenclaw(student) {
  return student.house === "Ravenclaw";
}
function isHufflePuff(student) {
  return student.house === "Hufflepuff";
}
function isSlytherin(student) {
  return student.house === "Slytherin";
}
function isExpelled(student) {
  return student.expelled === true;
}
function isAttending(student) {
  return student.attending === true;
}
function isPrefect(student) {
  return student.prefect === true;
}
function isSquad(student) {
  return student.squad === true;
}
function isPure(student) {
  return student.blood === "pure";
}
function isHalf(student) {
  return student.blood === "half";
}
function isMuggle(student) {
  return student.blood === "muggle";
}
function isBoy(student) {
  return student.gender === "Boy";
}
function isGirl(student) {
  return student.gender === "Girl";
}

// TODO SORT

function selectSort(event) {
  const sort = event.target.dataset.sort;
  const sortDir = event.target.dataset.dir;

  // console.log(sort, sortDir);

  if (sortDir === "asc") {
    event.target.dataset.dir = "desc";
  } else {
    event.target.dataset.dir = "asc";
  }

  //TODO find old sort elm
  const oldSortElm = document.querySelector(`[data-sort='${settings.sortBy}']`);
  // console.log(`oldSOrtElm`, oldSortElm);
  // console.log(`settings.sortBy`, settings.sortBy);

  // TODO unstyle it
  oldSortElm.classList.remove("sortby");

  // TODO style chosen elm
  event.target.classList.add("sortby");

  settings.sortBy = sort;
  settings.sortDir = sortDir;

  makeCurrentList();
}

function sortList(sortedList) {
  // to sort both directions
  let dir = 1;
  if (settings.sortDir === "desc") {
    dir = -1;
  } else {
    settings.dir = 1;
  }

  sortedList = sortedList.sort(sortByProperty);

  function sortByProperty(studentA, studentB) {
    if (studentA[settings.sortBy] < studentB[settings.sortBy]) {
      return -1 * dir;
    } else {
      return 1 * dir;
    }
  }

  return sortedList;
}

//get a list that both filters and sorts
function makeCurrentList() {
  console.log(`makeCurrentList`);

  const currentList = filterList(allStudents);

  const sortedList = sortList(currentList);

  displayDisplayedCount(sortedList);
  displayCounts(allStudents);
  displayList(sortedList);
}

function displayCounts(list) {
  // console.log(list);

  // expelled list
  let expelledList = list.filter(isExpelled);
  document.querySelector("#count_expelled").innerHTML = `<b>${expelledList.length}</b> students are expelled`;
  // attending list
  let attendingList = list.filter(isAttending).length;
  document.querySelector("#count_attending").innerHTML = `<b>${attendingList}</b> students are attending`;
  // houses list
  let gryList = list.filter(isGryffindor).length;
  let slyList = list.filter(isSlytherin).length;
  let ravList = list.filter(isRavenclaw).length;
  let hufList = list.filter(isHufflePuff).length;

  document.querySelector("#count_gry").innerHTML = `<b>${gryList}</b> Gryffindor students`;
  document.querySelector("#count_sly").innerHTML = `<b>${slyList}</b> Slytherin students`;
  document.querySelector("#count_rav").innerHTML = `<b>${ravList}</b> Hufflepuff students`;
  document.querySelector("#count_huf").innerHTML = `<b>${hufList}</b> Ravenclaw students`;

  // squad list

  let squadList = list.filter(isSquad).length;
  document.querySelector("#count_squad").innerHTML = `<b>${squadList}</b> students in the squad`;

  // pure blood list
  // !is only displayed when some kind of filtering is clicked
  let pureList = allStudents.filter(isPure).length;
  document.querySelector("#count_pure").innerHTML = `<b>${pureList}</b> pure bloods`;
}

function displayStartCount(list) {
  document.querySelector("#count_start").innerHTML = `The year started with <b>${list}</b> students`;
}

function displayDisplayedCount(list) {
  let displayList = list.length;
  document.querySelector("#count_displayed").innerHTML = `<b>${displayList}</b> displayed students`;
}

function displayList(students) {
  // clear the list
  studentList.innerHTML = "";

  // build a new list
  students.forEach(displayStudent);

  displayDisplayedCount(students);
}

//clone to main site
function displayStudent(student) {
  // console.log(student.gender)
  // create clone
  const clone = template.content.cloneNode(true);

  clone.querySelector("[data-field=fullName]").innerHTML = `${student.firstName} ${student.lastName}´s student card`;
  clone.querySelector("[data-field=firstName]").innerHTML = `<u>First name</u> : <b>${student.firstName}</b>`;
  clone.querySelector("[data-field=lastName]").innerHTML = `<u>Last name</u> : <b>${student.lastName}</b>`;
  clone.querySelector("[data-field=gender]").innerHTML = `<u>Gender</u> : <b>${student.gender}</b>`;
  clone.querySelector("[data-field=imgSrc]").src = student.image;
  clone.querySelector("[data-field=imgSrc]").alt = `picture of ${student.lastName}, ${student.firstName}`;
  clone.querySelector(`[data-field="imgHouseSrc"]`).src = `/images/house/${student.house.toLowerCase()}.png`;
  clone.querySelector(`[data-field="imgHouseSrc"]`).alt = `${student.house}`;

  // TODO add background and text color to members of each house

  if (isHacked) {
    if (student.house.toLowerCase() === "slytherin") {
      clone.querySelector(".single_student").style.backgroundColor = "#39ff14";
      clone.querySelector(".single_student").style.color = "black";
      clone.querySelector("[data-field=fullName]").style.color = "black";
    } else if (student.house.toLowerCase() === "gryffindor") {
      clone.querySelector(".single_student").style.backgroundColor = "#ff0000";
      clone.querySelector(".single_student").style.color = "black";
      clone.querySelector("[data-field=fullName]").style.color = "black";
    } else if (student.house.toLowerCase() === "hufflepuff") {
      clone.querySelector(".single_student").style.backgroundColor = "#ffff00";
      clone.querySelector(".single_student").style.color = "black";
      clone.querySelector("[data-field=fullName]").style.color = "black";
    } else if (student.house.toLowerCase() === "ravenclaw") {
      clone.querySelector(".single_student").style.backgroundColor = "#1f00ff";
      clone.querySelector(".single_student").style.color = "black";
      clone.querySelector("[data-field=fullName]").style.color = "black";
    }
  } else {
    if (student.house.toLowerCase() === "slytherin") {
      clone.querySelector(".single_student").style.backgroundColor = "#1a472a";
      clone.querySelector(".single_student").style.color = "#aaaaaa";
      clone.querySelector("[data-field=fullName]").style.color = "#aaaaaa";
    } else if (student.house.toLowerCase() === "gryffindor") {
      clone.querySelector(".single_student").style.backgroundColor = "#740001";
      clone.querySelector(".single_student").style.color = "goldenrod";
      clone.querySelector("[data-field=fullName]").style.color = "goldenrod";
    } else if (student.house.toLowerCase() === "hufflepuff") {
      clone.querySelector(".single_student").style.backgroundColor = "#f0c75e";
      clone.querySelector(".single_student").style.color = "#372e29";
      clone.querySelector("[data-field=fullName]").style.color = "#372e29";
    } else if (student.house.toLowerCase() === "ravenclaw") {
      clone.querySelector(".single_student").style.backgroundColor = "#222f5b";
      clone.querySelector(".single_student").style.color = "#946b2d";
      clone.querySelector("[data-field=fullName]").style.color = "#946b2d";
    }
  }

  // TODO background color if expelled
  if (isHacked && student.expelled) {
    clone.querySelector(".single_student").style.backgroundColor = "black";
    clone.querySelectorAll(".single_student u").forEach((u) => {
      u.style.color = "#39ff14";
    });
    clone.querySelectorAll(".single_student b").forEach((b) => {
      b.style.color = "#39ff14";
    });
    clone.querySelector("[data-field=fullName]").style.color = "#39ff14";
  } else if (student.expelled === true) {
    clone.querySelector(".single_student").style.backgroundColor = "#333333";
    clone.querySelector(".single_student").style.color = "#aaaaaa";
    clone.querySelector("[data-field=fullName]").style.color = "#aaaaaa";
  }

  // TODO clone prefect and add greyscale if false

  clone.querySelector("[data-field=prefect]").dataset.prefect = student.prefect;
  if (student.prefect == false) {
    clone.querySelector(`[data-field="prefect"]`).style.filter = "grayscale(100%)";
  }

  // TODO clone squad and add greyscale if false
  clone.querySelector("[data-field=squad]").dataset.squad = student.squad;
  if (student.squad == false) {
    clone.querySelector(`[data-field="squad"]`).style.filter = "grayscale(100%)";
  }

  if (isHacked && student.squad == true) {
    console.log(`here`);
    student.squad = false;
    // todo notify student is not allowed to be in squad
    notification.style.display = "block";
    notification.textContent = `There no longer is an inquositorial squad. Signed HackEm'`;
    setTimeout(closeNotification, 3000);
  }

  // add event listener to each student click and get details
  clone.querySelector(".single_student").addEventListener("click", () => displayStudentModal(student));
  // append clone to list
  studentList.appendChild(clone);
}

// * display single students extra info modal
function displayStudentModal(student) {
  //   console.log(`displayStudentModal`);
  studentModal.style.display = "block";
  studentModal.querySelector(".close").addEventListener("click", () => {
    studentModal.style.display = "none";
  });

  // TODO : put right info in divs
  studentModal.querySelector("[data-field=imgSrc]").src = student.image;
  studentModal.querySelector("[data-field=imgSrc]").alt = `picture of ${student.lastName}, ${student.firstName}`;
  studentModal.querySelector("[data-field=fullName]").textContent = `${student.firstName} ${student.lastName}`;
  studentModal.querySelector("[data-field=middleName]").innerHTML = `<u>Middle Name</u> : ${student.middleName}`;
  studentModal.querySelector("[data-field=nickName]").innerHTML = `<u>Nick Name</u> : ${student.nickName}`;
  console.log(student.nickName);
  studentModal.querySelector("[data-field=gender]").innerHTML = `<u>Gender</u> : ${student.gender}`;
  // TODO add blood status
  studentModal.querySelector("[data-field=bloodStatus]").innerHTML = `<u>Blood Status</u> : ${student.blood}`;

  studentModal.querySelector(`[data-field="imgHouseSrc"]`).src = `/images/house/${student.house.toLowerCase()}.png`;
  studentModal.querySelector(`[data-field="imgHouseSrc"]`).alt = `${student.house}`;

  studentModal.querySelector(`[data-field="squad"]`).src = `/images/assets/squad.png`;
  studentModal.querySelector(`[data-field="prefect"]`).src = `/images/assets/prefect.png`;

  //  TODO : button to expell

  studentModal.querySelector("[data-field=expel]").style.display = "unset";
  studentModal.querySelector("[data-field=expel]").addEventListener("click", clickExpel);

  function clickExpel() {
    // console.log(`clickExpel`);

    // todo when hacked and only for my name make it so that both buttons say no

    if (isHacked && student.firstName === "Emma") {
      proceedPopup.style.display = "block";
      proceedMessage.textContent = `${student.firstName} is about to be expelled. This is irreversible.`;
      yesBtn.innerHTML = "No";
      yesBtn.addEventListener("click", noExpel);
      noBtn.addEventListener("click", noExpel);
    } else {
      proceedPopup.style.display = "block";
      proceedMessage.textContent = `${student.firstName} is about to be expelled. This is irreversible.`;
      yesBtn.addEventListener("click", yesExpel);
      noBtn.addEventListener("click", noExpel);
    }

    function yesExpel() {
      yesBtn.removeEventListener("click", yesExpel);
      noBtn.removeEventListener("click", noExpel);

      if (student.expelled === false) {
        studentModal.style.display = "none";
        student.expelled = true;
        // notidy student is expelled
        student.prefect = false;
        // sotiofy student is no longer prefect
        student.squad = false;
        // notify student is no longer squad
        student.attending = false;
        // notify student is no longer attending
        notification.style.display = "block";
        notification.innerHTML = `${student.firstName} is now expelled. <br> This means their eventual squad or prefect status is now also revoked.<br> They will no longer be attending Hogwarts.`;
        setTimeout(closeNotification, 2000);

        proceedPopup.style.display = "none";
        // console.log(student.expelled);
        makeCurrentList();
        return student;
      }
    }

    function noExpel() {
      student.expelled = false;
      proceedPopup.style.display = "none";
      studentModal.style.display = "none";
    }
  }

  if (student.expelled == false) {
    studentModal.querySelector("[data-field=expelled]").textContent = "Attending";
    studentModal.querySelector(".actions").style.display = "block";
  } else {
    studentModal.querySelector("[data-field=expel]").removeEventListener("click", clickExpel);
    studentModal.querySelector("[data-field=expel]").style.display = "none";

    studentModal.querySelector("[data-field=expelled]").textContent = "EXPELLED";
    studentModal.querySelector("[data-field=expelled]").style.fontSize = "2rem";

    studentModal.querySelector(".actions").style.display = "none";
  }

  // if (student.expelled == true) {
  //   // todo remove actions for expelled students
  //   removeEvtListener();
  //   studentModal.querySelector(".actions").style.display = "none";
  // }

  //  TODO : button to prefect

  studentModal.querySelector("[data-field=prefect]").dataset.prefect = student.prefect;
  studentModal.querySelector("[data-field=makePrefect]").addEventListener("click", clickPrefect);

  console.log(`before `, student.prefect);
  function clickPrefect(btn) {
    console.log(`clickPrefect`);
    removeEvtListener();

    if (student.prefect == false) {
      console.log("it was false and is now true");
      // student.prefect = true;

      studentModal.querySelector(`[data-field="prefect"]`).style.filter = "none";
      studentModal.style.display = "none";

      // TODO onto the rules of being a prefect
      tryToMakePrefect(student);
    } else {
      console.log("it was true and is now false");
      // todo notify student is no longer prefect
      notification.style.display = "block";
      notification.textContent = `${student.firstName} is no longer a prefect`;
      setTimeout(closeNotification, 2000);

      student.prefect = false;
      studentModal.style.display = "none";
    }
    makeCurrentList();
    return student;
  }

  if (student.prefect == false) {
    studentModal.querySelector(`[data-field="prefect"]`).style.filter = "grayscale(100%)";
    studentModal.querySelector("[data-field=makePrefect]").textContent = "Make Prefect";
  } else {
    studentModal.querySelector("[data-field=makePrefect]").textContent = "Remove Prefect";
  }

  //  TODO : button to squad

  studentModal.querySelector("[data-field=squad]").dataset.squad = student.squad;
  if (isHacked) {
    studentModal.querySelector("[data-field=makeSquad]").addEventListener("click", clickHackedSquad);
  } else {
    studentModal.querySelector("[data-field=makeSquad]").addEventListener("click", clickSquad);
  }

  // console.log(student.squad);

  function clickSquad() {
    removeEvtListener();
    if (student.squad == true) {
      console.log(`was true and is now false`);
      student.squad = false;
      studentModal.style.display = "none";
      // todo notify student is no longer squad
      notification.style.display = "block";
      notification.textContent = `${student.firstName} is no longer a squad member`;
      setTimeout(closeNotification, 2000);
    } else {
      console.log(`was false and is now  maybe true`);
      studentModal.style.display = "none";
      // TODO onto the rules of being a squadmember;
      tryToMakeSquad(student);
    }
    makeCurrentList();
    return student;
  }

  function clickHackedSquad() {
    console.log(`clickHackedSquad`);
    removeEvtListener();
    squadTimeOut(student);
    makeCurrentList();
  }

  function squadTimeOut() {
    console.log(`squadTimeout`);
    
  }

  if (student.squad == false) {
    studentModal.querySelector(`[data-field="squad"]`).style.filter = "grayscale(100%)";
    studentModal.querySelector("[data-field=makeSquad]").textContent = "Make Squad";
  } else {
    studentModal.querySelector("[data-field=makeSquad]").textContent = "Remove Squad";
  }

  // function to remove event listeners
  function removeEvtListener() {
    studentModal.querySelector("[data-field=prefect]").removeEventListener("click", clickPrefect);
    studentModal.querySelector("[data-field = makePrefect]").removeEventListener("click", clickPrefect);

    document.querySelector("[data-field=squad]").removeEventListener("click", clickSquad);
    document.querySelector("[data-field = makeSquad]").removeEventListener("click", clickSquad);
  }

  function tryToMakePrefect(thisStudent) {
    console.log(`TrytoMakePrefect`);
    // make an array of all prefects
    const prefectList = allStudents.filter(isPrefect);
    console.log(prefectList);
    // make an array of all prefects in same house as this student
    const prefectSameHouseList = prefectList.filter((student) => student.house === thisStudent.house);
    console.log(prefectSameHouseList);

    // ***ACTION PLAN

    // TODo check if prefectSameHouseList length is under 2 (max 2 from same houses)

    // todo    if < 2 onto next if
    // todo       if this student gender != student from prefectsamehouselist, make a prefect and remove other one
    // todo       else not allowed to be a prefect

    // todo    else ( >=2 ) check prefectsamehouselist genders
    // todo      popup there are 2 prefets alreday (show both names) and ask if you want to proceed to add this student as prefect
    // todo         if yes btn
    // todo          if one of prefectsamehouselist students includes thisStudent.gender, add this student and remove the includes same gender
    // todo          else add this student and remove the other one
    // todo         else
    // todo          close student modal and popup proceed

    // *****

    let numberOfPrefects = prefectSameHouseList.length;
    let prefectA = prefectSameHouseList[0];
    console.log(`prefectA is `, prefectA);
    let prefectB = prefectSameHouseList[1];

    if (numberOfPrefects >= 1 && numberOfPrefects < 2) {
      if (thisStudent.gender !== prefectA.gender) {
        thisStudent.prefect = true;

        makePrefect(thisStudent);
        // notify this student is now a prefect with prefectA
        notification.style.display = "block";
        notification.textContent = `${thisStudent.firstName} is now prefect with ${prefectA.firstName}`;
        setTimeout(closeNotification, 2000);
      } else {
        thisStudent.prefect = false;

        removePrefect(thisStudent);

        // notify this student is not allowed to be a prefect beacuse of gender
        notification.style.display = "block";
        notification.textContent = `${
          thisStudent.firstName
        } is not allowed to be a prefect. There is alredy a ${thisStudent.gender.toLowerCase()} prefect from this house.`;
        setTimeout(closeNotification, 2000);
      }
    } else if (numberOfPrefects === 0) {
      thisStudent.prefect = true;

      makePrefect(thisStudent);
      console.log(`this student is now a prefect`);
      // notify this student is now prefect
      notification.style.display = "block";
      notification.textContent = `${thisStudent.firstName} is now a prefect`;
      setTimeout(closeNotification, 2000);
    } else {
      let thisStudentGender = thisStudent.gender.toLowerCase();

      // make in html - done
      proceedPopup.style.display = "block";
      proceedMessage.textContent = `${prefectA.firstName} and ${prefectB.firstName} are the ${prefectA.house} prefects. To appoint ${thisStudent.firstName} as a prefect for this house, you have to eliminate their equivalent. `;
      yesBtn.addEventListener("click", saidYes);
      noBtn.addEventListener("click", saidNo);

      function saidYes() {
        yesBtn.removeEventListener("click", saidYes);
        noBtn.removeEventListener("click", saidNo);

        prefectSameHouseList = allStudents.filter(isPrefect);
        prefectA = prefectSameHouseList[0];
        console.log(`prefectA is `, prefectA);
        prefectB = prefectSameHouseList[1];

        thisStudentGender = thisStudent.gender;

        // logs to check info

        console.log("prefectA.gender is ", prefectA.gender);
        console.log("prefectB.gender is ", prefectB.gender);
        console.log("thisStudentGender is ", thisStudentGender);
        console.log("thisStudent is ", thisStudent);

        if (prefectA.gender === thisStudentGender) {
          prefectA.prefect = false;
          removePrefect(prefectA);
          thisStudent.prefect = true;
          makePrefect(thisStudent);
          // prefectList.unshift();
          // prefectList.push(thisStudent);

          // notify this student is now prefect and prefectA is no longer prefect
          notification.style.display = "block";
          notification.textContent = `${thisStudent.firstName} is now prefect. ${prefectA.firstName} has been dismissed from prefects.`;
          setTimeout(closeNotification, 2000);
        } else if (prefectB.gender === thisStudentGender) {
          prefectB.prefect = false;
          removePrefect(prefectB);
          thisStudent.prefect = true;
          makePrefect(thisStudent);

          // prefectList.pop();
          // prefectList.push(thisStudent);

          // notify this student is now prefect and prefectB is no longer prefect
          notification.style.display = "block";
          notification.textContent = `${thisStudent.firstName} is now prefect. ${prefectB.firstName} has been dismissed from prefects.`;
          setTimeout(closeNotification, 2000);
        }

        studentModal.style.display = "none";
        proceedPopup.style.display = "none";

        console.log("prefect list is now ", prefectList);
        return prefectSameHouseList;
      }

      function saidNo() {
        studentModal.style.display = "none";
        proceedPopup.style.display = "none";

        yesBtn.removeEventListener("click", saidYes);
        noBtn.removeEventListener("click", saidNo);

        // notify this student is not a prefect because there already was 2 of them
        notification.style.display = "block";
        notification.textContent = `${thisStudent.firstName} has not been appointed as prefect as there already were 2 prefects in this house.`;
        setTimeout(closeNotification, 2000);
      }
    }

    function makePrefect(student) {
      student.prefect = true;
    }
    function removePrefect(student) {
      student.prefect = false;
    }
  }

  function tryToMakeSquad(student) {
    if (student.house === "Slytherin" && student.blood === "pure") {
      student.squad = true;
      // todo notify student is now squad
      notification.style.display = "block";
      notification.textContent = `${student.firstName} is now a squad member`;
      setTimeout(closeNotification, 2000);
      studentModal.querySelector(`[data-field="squad"]`).style.filter = "none";
    } else {
      // todo notify student is not allowed to be in squad
      notification.style.display = "block";
      notification.textContent = `${student.firstName} is not allowed to be a squad member`;
      setTimeout(closeNotification, 2000);
    }
  }
}

function closeNotification() {
  notification.style.display = "none";
}
// todo hack

function hackTheSystem() {
  //*** war plan
  // make sure the hacking only is called once and is only removed when reload page
  // call function that changes whole style (remember css file)
  // call function to inject myself in the list
  // todo call function hack bloods (purebloods have now a random blood status and all others have a pure blood status)
  // make sure the expell popup on my student has two button that say no - as to not be able to expell me
  // call function to remove all squad members -- notification to say it
  // todo make sure new squad members get removed after random time out -- with notification

  // ******

  // todo only hack once
  if (!isHacked) {
    isHacked = true;
    console.log(`hackTheSystem`);
    // !call all those functions in here
    // todo style
    hackStyle();
    // todo popup to notify youve been hacked
    // make in html
    hackedPopup.style.display = "flex";
    hackedPopup.style.flexDirection = "row";
    hackedPopup.style.flexWrap = "wrap";
    hackedPopup.style.gap = "5px";

    // !i tried for loop but the delay doesnt work like i want
    // for (let i = 1; i <= 40; i++) {
    //   setTimeout(() => {
    //     let p = document.createElement("p");
    //     p.textContent = "YOU HAVE BEEN HACKED";
    //     hackedPopup.appendChild(p);
    //   }, 1000);
    // }

    // ! so here is a snippet from https://thewebdev.info/2022/02/09/how-to-create-pause-or-delay-in-a-javascript-for-loop/
    // ! to put delay in for loop
    // const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    // const loop = async () => {
    //   for (const a of [1, 2, 3]) {
    //     console.log(a);
    //     await wait(2000);
    //   }
    // };
    // loop();
    //

    const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    let loop = async () => {
      for (let i = 0; i < 400; i++) {
        console.log(i);
        let p = document.createElement("p");
        p.textContent =
          // "YOU HAVE BEEN HACKED YOU HAVE BEEN HACKED YOU HAVE BEEN HACKED YOU HAVE BEEN HACKED YOU HAVE BEEN HACKED YOU HAVE BEEN HACKED YOU HAVE BEEN HACKED";
          " YOU HAVE BEEN HACKED ";
        hackedPopup.appendChild(p);
        await wait(5);
      }
      hackedPopup.style.display = "none";
    };

    loop();

    // setTimeout(() => {
    //   hackedPopup.style.display = "none";
    // }, 5000);
    // hackedPopup.querySelector(".close").addEventListener("click", () => {
    //   hackedPopup.style.display = "none";
    // });
    //todo inject myself
    injectMe();
  }
}

// take harry potter test to get a house
// im hufflepuff
// is Anyone surprised?

function injectMe() {
  console.log(`injectMe`);
  allStudents.push({
    firstName: "Emma",
    lastName: "Pasquer",
    middleName: "No middle Name",
    nickName: "HackEm'",
    house: "hufflepuff",
    blood: "Muggle",
    gender: "Hacker",
    prefect: false,
    squad: false,
    image: `/images/emma_p.png`,
    attending: true,
    expelled: false,
  });

  console.log(allStudents);
  makeCurrentList();
}

function hackStyle() {
  console.log("hackStyle");
  document.querySelector("#css_sheet").href = "hacked_style.css";
}

function getSecretKeystroke(event) {
  console.log(`getSecretKeystroke`);

  // *--- method with input -----*

  // const actualKeystroke += actualKey;
  // console.log(event.target.value);

  // keystroke = event.target.value;

  // if (keystroke === "iddqd") {
  //   hackTheSystem();
  // }

  // *--- method with keydown -----*

  // ****** plan of attACK

  //  set a secret password
  //  get value for pressed key
  //  store pressed keys --- has to be outside of this function or else doesnt work
  // !!!only store them if they match the characters in the password (probably use charAt() ???)
  //  compare each new keystroke to next key in password
  //  maybe get index from password to use when comparing ?
  //     if actual key match char at same index in password, add char to keystroke
  //     else reset keystroke completely (start from 0)
  //  when the keystroke is === password call hackthesystem()
  // *******

  console.log(event.key);
  const secretKeystroke = "iddqd";
  const pressedKey = event.key;

  let keyIndex = keystroke.length;
  let charToCompare = secretKeystroke.charAt(keyIndex);

  console.log(charToCompare);

  if (pressedKey === charToCompare) {
    console.log(`pressed key match same index char in password`);
    keystroke += pressedKey;
    console.log(`keystroke is `, keystroke); // holy shit so cool
  } else {
    keystroke = "";
  }

  if (keystroke === secretKeystroke) {
    hackTheSystem();
  }
}
