// check if student can be prefect
function tryToMakeAPrefect(selectedStudent) {
  const prefects = allStudents.filter((student) => student.prefect);
  const other = prefects.filter((student) => student.house === selectedStudent.house);

  //if there is another of the same type
  if (other.length >= 2) {
    console.log("there can only be two of each house");
    removeAorB(other[0], other[1]);
  } else {
    makePrefect(selectedStudent);
  }

  function removeAorB(prefectA, prefectB) {
    //ask the user to ignore or remove a or b
    document.querySelector("#warningbox_prefect").classList.remove("hide");
    document.querySelector(".closebutton").addEventListener("click", closeDialog);
    document.querySelector("#remove_a").addEventListener("click", clickRemoveA);
    document.querySelector("#remove_b").addEventListener("click", clickRemoveB);

    // show names on remove a or b button
    document.querySelector("[data-field=prefectA]").textContent = prefectA.firstName;
    document.querySelector("[data-field=prefectB]").textContent = prefectB.firstName;

    //if ignore - do nothing
    function closeDialog() {
      document.querySelector("#warningbox_prefect").classList.add("hide");
      document.querySelector(".closebutton").removeEventListener("click", closeDialog);
      document.querySelector("#remove_a").removeEventListener("click", clickRemoveA);
      document.querySelector("#remove_b").removeEventListener("click", clickRemoveB);
    }
    // if remove a
    function clickRemoveA() {
      removePrefect(prefectA);
      makePrefect(selectedStudent);
      makeCurrentList();
      closeDialog();
    }

    //else if - removeB
    function clickRemoveB() {
      removePrefect(prefectB);
      makePrefect(selectedStudent);
      makeCurrentList();
      closeDialog();
    }
  }
  function removePrefect(prefectStudent) {
    prefectStudent.prefect = false;
  }
  function makePrefect(student) {
    student.prefect = true;
  }
}

function tryToMakeASquadMember(student) {
  if (student.house === "Slytherin" || student.bloodStatus === "Pureblood") {
    student.squadMember = true;
  } else {
    document.querySelector("#warningbox_squad").classList.remove("hide");
    document.querySelector("#warningbox_squad .okay_btn").addEventListener("click", closeSquadDialog);
  }

  function closeSquadDialog() {
    document.querySelector("#warningbox_squad").classList.add("hide");
    document.querySelector("#warningbox_squad .okay_btn").removeEventListener("click", closeSquadDialog);
  }
}




  // TODO prefects
  document.querySelector("[data-field=prefect]").dataset.prefect = student.prefect;
  document.querySelector("[data-field=prefect]").addEventListener("click", clickPrefect);

  function clickPrefect() {
    if (student.prefect === true) {
      student.prefect = false;
    } else {
      tryToMakeAPrefect(student);
    }
    makeCurrentList();
  }

  //TODO squad
  if (student.squadMember === true) {
    document.querySelector("[data-field=squadMember]").textContent = "yes";
  } else {
    document.querySelector("[data-field=squadMember]").textContent = "no";
  }
  document.querySelector("[data-field=squadMember]").addEventListener("click", clickSquadMember);

  function clickSquadMember() {
    if (student.squadMember === true) {
      student.squadMember = false;
    } else {
      tryToMakeASquadMember(student);
    }
    makeCurrentList();
  }

//search function
function searchInput(event) {
  console.log(`searchInput`);
  let searchStudentList = allStudents.filter((student) => {
    let name = "";
    if (student.lastName === null) {
      name = student.firstName;
    } else {
      name = student.firstName + " " + student.lastName;
    }
    return name.toLowerCase().includes(event.target.value);
  });

  // this will show number og student in the search

  showNumberOfStudent.textContent = `number of students: ${searchStudentList.length}`;
  displayStudent(searchStudentList);
}



/*---------------------------------sort-----------------------------*/
function selectSort(event) {
  const sortBy = event.target.dataset.sort; // what is clicked
  const sortDir = event.target.dataset.sortDirection; //direction

  //find old sort by element
  const oldElement = document.querySelector(`[data-sort='${settings.sortBy}']`);
  oldElement.classList.remove("sortby");
  //indicate active sort
  event.target.classList.add("sortby");

  //toggle the direction of sorting
  if (sortDir === "asc") {
    event.target.dataset.sortDirection = "desc";
  } else {
    event.target.dataset.sortDirection = "asc";
  }
  console.log(`user selected ${sortBy}${sortDir}`);
  setSort(sortBy, sortDir);
}

// //?
// function setSort(sortBy, sortDir) {
//   settings.sortBy = sortBy;
//   settings.sortDir = sortDir;
//   makeCurrentList();
// }
// function sortList(sortedList) {
//   // to sort both directions
//   let direction = 1;
//   if (settings.sortDir === "desc") {
//     direction = -1;
//   } else {
//     settings.direction = 1;
//   }

//   sortedList = sortedList.sort(sortByProperty);
//   //?
//   function sortByProperty(studentA, studentB) {
//     if (studentA[settings.sortBy] < studentB[settings.sortBy]) {
//       return -1 * direction;
//     } else {
//       return 1 * direction;
//     }
//   }

//   return sortedList;
// }