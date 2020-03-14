//lead class content populated with the current day text from moment
let todaysDay = moment().format('dddd MMM Do YYYY');
$('#currentDay').text(todaysDay)

//array of ids corresponding to the timeslots 
let idsCollection = ["#9", "#10", "#11", "#12", "#1", "#2", "#3", "#4", "#5"];
//array of timeslots
let timeSlotCollection = ["09:00:00", "10:00:00", "11:00:00", "12:00:00", "13:00:00", "14:00:00", "15:00:00", "16:00:00", "17:00:00"];
//array of timeslot range relative to current time
let shiftedTimeSlotCollection = ["10:00:00", "11:00:00", "12:00:00", "13:00:00", "14:00:00", "15:00:00", "16:00:00", "17:00:00", "18:00:00"];

let plannerContent = []; //holds the key-value pair of ids & input text
//get the planner-items list from local storage
let getLocalStorageData = JSON.parse(localStorage.getItem("planner-items"));

//if localstorage data tag "planner-items" is non-empty,assign it to 
//planner content array for further processing 
if (getLocalStorageData !== null) {
  plannerContent = getLocalStorageData;
}

//loop through each id to process each time entry from the planner
for (let i = 0; i < idsCollection.length; i++) {
  let descriptionEl = $(idsCollection[i]);
  let buttonEl = descriptionEl.parent().parent().find("button");

  //if current time less than timeslot entry,mark it as future
  if ((moment().format('MMMM Do YYYY, HH:mm:ss')) < (moment().format('MMMM Do YYYY') + ", " + timeSlotCollection[i])) {
    descriptionEl.attr("class", "future");
    plannerContent.forEach(function (item) {
      if (idsCollection[i] === ("#" + (item["key"]))) {
        descriptionEl.val(item["value"]);
      }
    });
  }
  //if current time greater than timeslot entry but less than timeslot range,mark it as present
  else if (((moment().format('MMMM Do YYYY, HH:mm:ss')) >= (moment().format('MMMM Do YYYY') + ", " + timeSlotCollection[i])) &&
    ((moment().format('MMMM Do YYYY, HH:mm:ss')) < (moment().format('MMMM Do YYYY') + ", " + shiftedTimeSlotCollection[i]))) {
    descriptionEl.attr("class", "present");
    //create a disabled attribute and apply it to button as no modifications
    //are allowed for present timeslot
    $(".present").attr("disabled", "disabled");
    buttonEl.attr("disabled", true);
    plannerContent.forEach(function (item) {
      if (idsCollection[i] === ("#" + item["key"])) {
        descriptionEl.val(item["value"]);
      }
    });
  }
  //if current time greater than timeslot entry,mark it as past
  else if ((moment().format('MMMM Do YYYY, HH:mm:ss')) > (moment().format('MMMM Do YYYY') + ", " + timeSlotCollection[i])) {
    descriptionEl.attr("class", "past");
    //create a disabled attribute and apply it to button as no modifications
    //are allowed for past timeslot
    $(".past").attr("disabled", "disabled");
    buttonEl.attr("disabled", true);
  }
}

/*
 on button click invoke this function to capture the input text and create a 
 key-value textobject pair which would be saved/appended to the local storage
*/
$("button").on("click", function () {
  event.preventDefault();
  let container = $(this).parent().parent();
  let inputValue = container.find("input").val();
  let inputId = container.find("input").attr("id");
  let textObj = {
    "key": inputId,
    "value": inputValue
  };
  //if input text is non empty save the textobject to local storage 
  if (textObj["value"] !== "") {
    plannerContent.push(textObj);
    localStorage.setItem("planner-items", JSON.stringify(plannerContent));
  }
});