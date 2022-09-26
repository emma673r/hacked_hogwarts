"use strict";

window.addEventListener("DOMContentLoaded", displayLogin);

let allStudents = [];
let searchStudentList = [];

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

// let showNumberOfStudent = document.querySelector(".howmanystudents");

const studentList = document.getElementById("student_list");
const template = document.getElementById("student");
const studentModal = document.getElementById("student_modal");

const urlList = "https://petlatkea.dk/2021/hogwarts/students.json";
const urlBlood = "https://petlatkea.dk/2021/hogwarts/families.json";

// joke login screen here
function displayLogin() {
  studentModal.style.display = "none";
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

// function displayTotalCount(list) {
//   let expelledStudents = [];
//   let attendingStudents = [];

//   list.forEach((student) => {
//     if (student.expelled == true && student.attending == false) {
//       expelledStudents.push(student);

//     } else if (student.expelled == false && student.attending == true) {
//       attendingStudents.push(student);
//     }
//   });

//   console.log(`expelledStudents is`, expelledStudents);
//   console.log(`attendingStudents is `, attendingStudents);

//   document.querySelector("#count_total").textContent = `${attendingStudents.length} students attending school`;
//   document.querySelector("#count_expelled").innerHTML = `<b>${expelledStudents.length}</b> expelled students`;
// }
// function displayTotalCount(list) {
//   list = list.filter(isExpelled);
//   console.log(`here`,list)
// }

function displayCounts(list) {
  // console.log(list);

  // start count list
  let startList = allStudents.length;
  document.querySelector("#count_start").innerHTML = `The year started with <b>${startList}</b> students`;

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
  document.querySelector("#count_squad").textContent = `${squadList} students in the squad`;
  // pure blood list
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

  // TODO add background and text color to memebers of each house
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

  // TODO background color if expelled
  if (student.expelled === true) {
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
  studentModal.querySelector("[data-field=nickName]").innerHTML = `<u>Nick Name</u> : ${student.NickName}`;
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
    if (student.expelled === false) {
      studentModal.style.display = "none";
      student.expelled = true;
      student.prefect = false;
      student.squad = false;
      student.attending = false;

      // todo remove actions for expelled students

      removeEvtListener();
      studentModal.querySelector(".actions").style.display = "none";
      // console.log(student.expelled);
      makeCurrentList();
      return student;
    }
  }

  if (student.expelled === false) {
    studentModal.querySelector("[data-field=expelled]").textContent = "Attending";
  } else {
    studentModal.querySelector("[data-field=expel]").removeEventListener("click", clickExpel);
    studentModal.querySelector("[data-field=expel]").style.display = "none";

    studentModal.querySelector("[data-field=expelled]").textContent = "EXPELLED";
    studentModal.querySelector("[data-field=expelled]").style.fontSize = "2rem";
  }

  //  TODO : button to prefect

  studentModal.querySelector("[data-field=prefect]").dataset.prefect = student.prefect;
  studentModal.querySelector("[data-field=makePrefect]").addEventListener("click", clickPrefect);

  console.log(`before `, student.prefect);
  function clickPrefect(btn) {
    console.log(`clickPrefect`);
    removeEvtListener();

    if (student.prefect == false) {
      console.log("it was false and is now true");
      student.prefect = true;

      studentModal.querySelector(`[data-field="prefect"]`).style.filter = "none";
      studentModal.style.display = "none";
    } else {
      console.log("it was true and is now false");

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
  studentModal.querySelector("[data-field=makeSquad]").addEventListener("click", clickSquad);

  console.log(student.squad);

  // TODO if student blood is not pure and or if student not slytherin then cannot be a squad member
  // !Change place at some point

  if (!student.blood !== "Pureblood" || student.house !== "Slytherin") {
    studentModal.querySelector("[data-field=makeSquad]").style.display = "none";
    studentModal.querySelector("[data-field=makeSquad]").removeEventListener("click", clickSquad);
  }

  function clickSquad(btn) {
    removeEvtListener();

    if (student.squad == true) {
      console.log(`was true and is now false`);
      student.squad = false;
      student.prefect = false;
      studentModal.style.display = "none";
    } else {
      console.log(`was false and is now true`);
      student.squad = true;
      studentModal.querySelector(`[data-field="squad"]`).style.filter = "none";
      studentModal.style.display = "none";

      // TODO onto the rules of being a squadmember;
      // tryToMakeASquadMember(student);
    }
    makeCurrentList();
    return student;
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
}

// todo hack

// TODO display counted arrays in display list i think ?? think about it
