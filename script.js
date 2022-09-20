"use strict";

window.addEventListener("DOMContentLoaded", displayLogin);

// all my const
const allCleanStudents = [];

const Student = {
  firstName: "",
  middleName: "unknown",
  nickName: "unknown",
  lastName: "",
  imageSrc: "",
  house: "",
  prefect: false,
  squad: false,
  expelled: false,
};

const settings = {
  filterBy: "all",
  sortBy: "",
  sortDir: "asc",
  search: "",
};

const studentList = document.getElementById("student_list");
const template = document.getElementById("student");
const studentModal = document.getElementById("student_modal");
// const singleStudent = document.querySelectorAll(".single_student");

const url = "https://petlatkea.dk/2021/hogwarts/students.json ";

// all my variables

let list;
// ****** CONTROLLER
//* step 1 : start

// start
function displayLogin() {
  //   console.log(`start`);
  studentModal.style.display = "none";
  document.querySelector(".login_1").addEventListener("click", start);
  document.querySelector(".login_2").addEventListener("click", start);
}

function start() {
  document.querySelector("#login_page").style.display = "none";
  fetchData();
}
// step 2 : fetch data

async function fetchData() {
  const response = await fetch(url);
  list = await response.json();

  // console.log(`allStudents is :`, list);

  cleanStudentData();
}

// ****** MODEL
//* step 2 : init loop for each student aka prepare the student list

// *step 3 clean the data
function cleanStudentData() {
  //   console.log(`cleanStudentData`);
  //   foreach jsonStudent (not to confuse with const student!!)
  list.forEach((elm) => {
    const student = Object.create(Student);
    // ** make variables for each properties in (old) array
    // they are : fullname, gender and house
    let fullName;
    let gender;
    let house;

    //* 3.1 trim each new let for whitespace (as a start - global thing to do)
    // ! SHOULD ALL :  be lowercase as default and trim
    fullName = elm.fullname.trim();
    gender = elm.gender.trim();
    house = elm.house.trim();

    fullName = fullName.toLowerCase();
    gender = gender.toLowerCase();
    house = house.toLowerCase();

    // console.log(`fullName is _${fullName}_`);
    // console.log(`gender is _${gender}_`);
    // console.log(`house is _${house}_`);

    // *make new array for all srtings in fullname
    let fullNameArray = fullName.split(" ");
    // console.log(fullNameArray);

    //* 3.2 Clean and set values for the object student (specify steps)
    // ** 3.2.1 firstname
    let firstName = fullNameArray[0];
    // ! SHOULD : first char uppercase
    firstName = firstName[0].toUpperCase() + firstName.substring(1);
    student.firstName = firstName;
    // console.log(firstName);
    // console.log(student);

    // ** 3.2.2 middleName
    let indexOfFirst = fullName.indexOf(` `);
    let indexOfLast = fullName.lastIndexOf(` `);
    // ! SHOULD : first char uppercase + display undefined if student doesnt have one
    let middleName = fullName.substring(indexOfFirst, indexOfLast);

    // if middle name is empty display undefined middle name
    if (middleName === "") {
      student.middleName = "No middle name";
    } else if (middleName.includes(" ")) {
      // if middle includes a space - replace space with empty character (" " to "")
      middleName = middleName.replace(" ", "");
    } else {
      // uppercase first letter
      middleName = middleName[0].toUpperCase() + middleName.substring(1);
      //   console.log(`middleName is _${middleName}_`);
      student.middleName = middleName;
    }
    // console.log(student);
    // ** 3.2.3 nickName
    // ! SHOULD : find string inside of "" and isolate + display undefined if student doesnt have one
    // only one student with nickname
    // nickname displayed by putting it between ""
    let nickName;

    if (!nickName) {
      student.nickName = "No nick name";
    } else {
      nickName = fullName.substring(fullName.indexOf(`"`) + 1, fullName.lastIndexOf(`"`));
      nickName = nickName.charAt(0).toUpperCase() + nickName.substring(1);
      student.nickName = nickName;
    }
    // !somehow nickName[0] is not defined ???? dont understand

    // ** 3.2.4 lastName
    let lastName = fullNameArray[fullNameArray.length - 1];
    // console.log(lastName);
    console.log(fullName.length);
    // ! SHOULD : first char uppercase
    if (fullName.length <= 6) {
      student.lastName = `No last name known`;
    } else {
      lastName = lastName[0].toUpperCase() + lastName.substring(1);
      student.lastName = lastName;
    }
    // console.log(student);

    // ** 3.2.5 gender
    // ! SHOULD : first char uppercase
    gender = gender[0].toUpperCase() + gender.substring(1);
    student.gender = gender;
    // console.log(student);
    // ** 3.2.6 imgSrc
    let imgSrc;
    // ! SHOULD : have the right name to fetch the right photo from right depository
    //* look at images and student names - find a pattern
    //* all images src have last name written, a _ and first letter firstname
    //* exceptions are : Leanne and the Patils and finch-fletchey

    // if student name has no last name - Leanne
    if (!fullName.includes(" ")) {
      imgSrc = `/images/no_image.png`;
    }
    // only 2 img src same last name - Patil (Parvati & Padma)
    // so if student name includes patil
    else if (fullName.toLowerCase().includes("patil")) {
      imgSrc = `./images/${lastName.toLowerCase()}_${firstName.toLowerCase()}.png`;
    }
    // if student includes "-" - finch fletchey
    else if (fullName.includes("-")) {
      imgSrc = `./images/${fullName.substring(fullName.lastIndexOf("-") + 1).toLowerCase()}_${student.firstName[0].toLowerCase()}.png`;
    }
    // if student name has last name and first name and is only one with last name (the OG pattern)
    else {
      imgSrc = `./images/${fullName.substring(fullName.lastIndexOf(" ") + 1).toLowerCase()}_${student.firstName[0].toLowerCase()}.png`;
    }

    student.imgSrc = imgSrc;

    // ** 3.2.7 house
    // ! SHOULD : first char uppercase
    house = house[0].toUpperCase() + house.substring(1);
    student.house = house;

    // console.log(student);
    //* PUSH each elm in new clean student array :   allCleanStudents.push(elm)
    allCleanStudents.push(student);
    // console.log(allCleanStudents);
    console.log(student.imgSrc);
  });
  //   console.log(allCleanStudents);
  displayStudentList();
}

// ***** VIEW
//* step 4 display/show the data
function displayStudentList(student) {
  console.log(`displayStudentList`);
  //   console.table(allCleanStudents)
  // ** 4.1  foreach student loop
  allCleanStudents.forEach((student) => {
    // ** 4.2  CLONE const clone = template cloneNode(true)
    const clone = template.content.cloneNode(true);
    //* 4.2.0 clone h2 data field fullname = firstname + middle name + last name
    clone.querySelector("[data-field=fullName]").innerHTML = `${student.firstName} ${student.lastName}´s student card`;
    // ** 4.2.1  clone qS [data-field="firstName"] = student.firstName
    clone.querySelector("[data-field=firstName]").innerHTML = `<u>First name</u> : <b>${student.firstName}</b>`;
    // // ** 4.2.2  clone qS [data-field="MiddleName"] = student.middleName
    // clone.querySelector("[data-field=middleName]").innerHTML = `<u>Middle name</u> : <b>${student.middleName}</b>`;
    // // ** 4.2.3  clone qS [data-field="NickName"] = student.NickName
    // clone.querySelector("[data-field=nickName]").innerHTML = `<u>Nick name</u> : <b>${student.nickName}</b>`;
    // ** 4.2.4  clone qS [data-field="LastName"] = student.lastName
    clone.querySelector("[data-field=lastName]").innerHTML = `<u>Last name</u> : <b>${student.lastName}</b>`;
    // ** 4.2.5  clone qS [data-field="gender"] = student.gender
    clone.querySelector("[data-field=gender]").innerHTML = `<u>Gender</u> : <b>${student.gender}</b>`;
    // ** 4.2.6  clone qS [data-field="imgSrc"].src = student.imgSrc
    clone.querySelector("[data-field=imgSrc]").src = student.imgSrc;
    clone.querySelector("[data-field=imgSrc]").alt = `picture of ${student.lastName}, ${student.firstName}`;

    // ** 4.2.7  clone qS [data-field="house"] = student.house
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

    // TODO clone prefect and add greyscale if false
    clone.querySelector("[data-field=prefect]").dataset.prefect = student.prefect;
    if (student.prefect === false) {
      clone.querySelector(`[data-field="prefect"]`).style.filter = "grayscale(100%)";
    }
    // TODO clone squad and add greyscale if false
    clone.querySelector("[data-field=squad]").dataset.squad = student.squad;
    if (student.squad === false) {
      clone.querySelector(`[data-field="squad"]`).style.filter = "grayscale(100%)";
    }
    // add event listener to each student click and get details
    clone.querySelector(".single_student").addEventListener("click", () => displayStudentModal(student));

    // ** 4.3 APPEND studentList.appenChild(clone);
    studentList.appendChild(clone);
  });

  countStudents(allCleanStudents);
}

function displayStudentModal(student) {
  console.log(`Hello`);
  studentModal.style.display = "block";
  document.querySelector(".close").addEventListener("click", () => {
    studentModal.style.display = "none";
  });

  // TODO : put right info in divs
  studentModal.querySelector("[data-field=imgSrc]").src = student.imgSrc;
  studentModal.querySelector("[data-field=imgSrc]").alt = `picture of ${student.lastName}, ${student.firstName}`;
  studentModal.querySelector("[data-field=fullName]").textContent = `${student.firstName} ${student.lastName}`;
  studentModal.querySelector("[data-field=middleName]").innerHTML = `<u>Middle Name</u> : ${student.middleName}`;
  studentModal.querySelector("[data-field=nickName]").innerHTML = `<u>Nick Name</u> : ${student.NickName}`;
  studentModal.querySelector("[data-field=gender]").innerHTML = `<u>Gender</u> : ${student.gender}`;
  // TODO add blood status
  // studentModal.querySelector("[data-field=bloodStatus]").textContent += ` : ${student.blood}`;

  studentModal.querySelector(`[data-field="imgHouseSrc"]`).src = `/images/house/${student.house.toLowerCase()}.png`;
  studentModal.querySelector(`[data-field="imgHouseSrc"]`).alt = `${student.house}`;
  studentModal.querySelector(`[data-field="squad"]`).src = `/images/assets/squad.png`;
  studentModal.querySelector(`[data-field="squad"]`).style.filter = "grayscale(100%)";
  studentModal.querySelector(`[data-field="prefect"]`).src = `/images/assets/prefect.png`;
  studentModal.querySelector(`[data-field="prefect"]`).style.filter = "grayscale(100%)";
}

function countStudents(allCleanStudents) {
  // TODO make arrays for each houses
  const allGryffindorArray = allCleanStudents.filter((student) => student.house.toLowerCase().includes("gryffindor"));
  const allSlytherinArray = allCleanStudents.filter((student) => student.house.toLowerCase().includes("slytherin"));
  const allRavenclawArray = allCleanStudents.filter((student) => student.house.toLowerCase().includes("ravenclaw"));
  const allHufflepuffArray = allCleanStudents.filter((student) => student.house.toLowerCase().includes("hufflepuff"));
  // console.log(allRavenclaw)
  // console.log(allHufflepuff)

  // todo array for all actually displayed
  // todo array for all squad
  // todo array for all prefects
  // todo array for all expelled
  // todo array for all purebloods

  displayStudentCounts(allGryffindorArray, allSlytherinArray, allRavenclawArray, allHufflepuffArray);
}

function displayStudentCounts(allGryffindorArray, allSlytherinArray, allRavenclawArray, allHufflepuffArray) {
  // Todo display total count
  document.getElementById("count_total").textContent = `${allCleanStudents.length} students in total`;
  // todo display sudent count for each house
  document.getElementById("count_gry").textContent = `${allGryffindorArray.length} Gryffindor students`;
  document.getElementById("count_sly").textContent = `${allSlytherinArray.length} Slytherin students`;
  document.getElementById("count_rav").textContent = `${allRavenclawArray.length} Ravenclaw students`;
  document.getElementById("count_huf").textContent = `${allHufflepuffArray.length} Hufflepuff students`;
  // todo display all actually displayed
  // todo display all squad
  // todo display all prefects
  // todo display all expelled
  // todo display all purebloods
}
