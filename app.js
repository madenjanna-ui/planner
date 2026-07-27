// MaDenFlow app.js

console.log("MaDenFlow запущен 🚀");


const planner = document.getElementById("planner");
const weekTitle = document.getElementById("weekTitle");


const weekDays = [
    "Понедельник",
    "Вторник",
    "Среда",
    "Четверг",
    "Пятница",
    "Суббота",
    "Воскресенье"
];


let currentDate = new Date();


// выбранный день для добавления задачи
let selectedDate = null;
let selectedTask = null;




function getMonday(date){

    let d = new Date(date);

    let day = d.getDay();


    if(day === 0){
        day = 7;
    }


    d.setDate(
        d.getDate() - day + 1
    );


    return d;

}







function renderWeek(){


    planner.innerHTML = "";


    let today = new Date();


    let monday = getMonday(currentDate);



    let sunday = new Date(monday);


    sunday.setDate(
        monday.getDate() + 6
    );



    weekTitle.textContent =
    `${monday.toLocaleDateString("ru-RU")}
    —
    ${sunday.toLocaleDateString("ru-RU")}`;






    for(let i = 0; i < 7; i++){


        let date = new Date(monday);


        date.setDate(
            monday.getDate() + i
        );



        let dateKey =
        date.toISOString()
        .split("T")[0];



        let isToday =
        date.toDateString()
        === today.toDateString();




        let section =
        document.createElement("section");



        section.className = "day";


        section.dataset.date =
        dateKey;




        section.innerHTML = `


        <button class="day-title">

        ${isToday ? "▼" : "▶"}

        ${weekDays[i]}
        ${date.getDate()}
<span class="day-status" data-date="${dateKey}"></span>

        ${isToday ? "⭐ Сегодня" : ""}

        </button>




        <div class="day-content ${isToday ? "" : "hidden"}">


            <div class="tasks"></div>


        </div>


        `;



        planner.appendChild(section);





        if(typeof loadTasks === "function"){


            loadTasks(
                dateKey,
                section.querySelector(".tasks")
            );


        }



    }



    activateDays();

updateDayStatus();
}









function activateDays(){


    document
    .querySelectorAll(".day-title")
    .forEach(button=>{


        button.onclick=function(){


            let day =
            this.closest(".day");



            selectedDate =
            day.dataset.date;



            let content =
            this.nextElementSibling;



            content.classList.toggle("hidden");



            if(content.classList.contains("hidden")){


                this.textContent =
                this.textContent.replace(
                    "▼",
                    "▶"
                );


            }
            else{


                this.textContent =
                this.textContent.replace(
                    "▶",
                    "▼"
                );


            }


        };


    });


}









// нижняя кнопка добавить


document
.getElementById("addTaskBtn")
.onclick=function(){


    if(!selectedDate){


        alert("Сначала выберите день");


        return;

    }



    document
    .getElementById("taskModal")
    .classList
    .remove("hidden");


};









// сохранить задачу


document
.getElementById("saveTaskBtn")
.onclick=function(){


    let input =
    document.getElementById("newTaskInput");



    let text =
    input.value.trim();



    if(text === ""){

        return;

    }



    addTask(
        selectedDate,
        text
    );



    renderWeek();



    input.value = "";



    document
    .getElementById("taskModal")
    .classList
    .add("hidden");


};









// отмена


document
.getElementById("cancelTaskBtn")
.onclick=function(){


    document
    .getElementById("taskModal")
    .classList
    .add("hidden");


};









// переключение недель


document
.getElementById("prevWeek")
.onclick=function(){


    currentDate.setDate(
        currentDate.getDate()-7
    );


    renderWeek();


};







document
.getElementById("nextWeek")
.onclick=function(){


    currentDate.setDate(
        currentDate.getDate()+7
    );


    renderWeek();


};







document
.getElementById("todayBtn")
.onclick=function(){


    currentDate =
    new Date();


    renderWeek();


};





function updateDayStatus(){


    document
    .querySelectorAll(".day-status")
    .forEach(status=>{


        let date =
        status.dataset.date;



        if(!tasks[date] || tasks[date].length === 0){


            status.textContent = "⚪";


            return;

        }



        let allDone =
        tasks[date]
        .every(
            item=>item.done
        );



        if(allDone){


            status.textContent = "🟢";


        }
        else{


            status.textContent = "🟡";


        }


    });


}

// удаление задачи

document
.getElementById("deleteTaskBtn")
.onclick=function(){


    if(!selectedTask){

        alert("Выберите задачу");

        return;

    }



    tasks[selectedTask.date]
    .splice(
        selectedTask.index,
        1
    );



    saveTasks();



    selectedTask = null;



    renderWeek();


};
renderWeek();