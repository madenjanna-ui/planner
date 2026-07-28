// =====================================
// MaDenFlow 2.0
// Основной движок планировщика
// =====================================


console.log("MaDenFlow 2.0 запущен 🚀");



// элементы страницы

const planner =
document.getElementById("planner");


const weekTitle =
document.getElementById("weekTitle");



// дни недели

const weekDays = [

    "Пн",
    "Вт",
    "Ср",
    "Чт",
    "Пт",
    "Сб",
    "Вс"

];



// текущая дата

let currentDate =
new Date();



// выбранный день

let selectedDate =
null;



// выбранная задача

let selectedTask =
null;



// состояние недели

let weekCollapsed =
false;





// получить понедельник недели

function getMonday(date){


    let d =
    new Date(date);



    let day =
    d.getDay();



    if(day === 0){

        day = 7;

    }



    d.setDate(
        d.getDate() - day + 1
    );


    return d;

}







// построение недели

function renderWeek(){


    planner.innerHTML = "";



    let monday =
    getMonday(currentDate);



    let sunday =
    new Date(monday);



    sunday.setDate(
        monday.getDate()+6
    );



    weekTitle.textContent =

    `${monday.toLocaleDateString("ru-RU")}
    —
    ${sunday.toLocaleDateString("ru-RU")}`;





    for(let i = 0; i < 7; i++){



        let date =
        new Date(monday);



        date.setDate(
            monday.getDate()+i
        );



        let dateKey =

        date.toISOString()
        .split("T")[0];



        let today =

        date.toDateString()
        ===
        new Date().toDateString();





        let section =
        document.createElement("section");



        section.className =
        "day";



        section.dataset.date =
        dateKey;





        section.innerHTML = `


        <button class="day-title">


            ${weekDays[i]}

            ${date.getDate()}


            <span 
            class="day-status"
            data-date="${dateKey}">
            ⚪
            </span>


            ${today ? "⭐" : ""}


        </button>



        <div class="day-content">


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



    updateDayStatus();


    activateDays();


}
// =====================================
// Выбор дня
// =====================================


function activateDays(){


    document
    .querySelectorAll(".day-title")
    .forEach(button=>{


        button.onclick=function(){


            let day =
            this.closest(".day");



            selectedDate =
            day.dataset.date;



            document
            .querySelectorAll(".day")
            .forEach(d=>{

                d.classList.remove("selected-day");

            });



            day.classList.add("selected-day");



            console.log(
                "Выбран день:",
                selectedDate
            );


        };


    });


}







// =====================================
// Добавление задачи
// =====================================



document
.getElementById("addTaskBtn")
.onclick=function(){



    if(!selectedDate){


        alert(
            "Сначала выберите день"
        );


        return;

    }



    document
    .getElementById("taskModal")
    .classList
    .remove("hidden");


};








// сохранить новую задачу


document
.getElementById("saveTaskBtn")
.onclick=function(){



    let input =
    document.getElementById("newTaskInput");



    let text =
    input.value.trim();





    if(text===""){

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
// =====================================
// Общая кнопка свернуть/развернуть неделю
// =====================================


const toggleWeekBtn =
document.getElementById("toggleWeekBtn");


if(toggleWeekBtn){


    toggleWeekBtn.onclick = function(){


        weekCollapsed = !weekCollapsed;



        document
        .querySelectorAll(".day-content")
        .forEach(content=>{


            if(weekCollapsed){


                content.classList.add("hidden");


            } else {


                content.classList.remove("hidden");


            }


        });



        toggleWeekBtn.textContent =

        weekCollapsed ? "▲" : "▼";


    };


}
renderWeek();
// =====================================
// Навигация по неделям
// =====================================


document
.getElementById("prevWeek")
.onclick=function(){


    currentDate.setDate(

        currentDate.getDate() - 7

    );


    renderWeek();


};







document
.getElementById("nextWeek")
.onclick=function(){


    currentDate.setDate(

        currentDate.getDate() + 7

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







// =====================================
// Выбор задачи для удаления
// =====================================


function activateTaskSelection(){


    document
    .querySelectorAll(".task")
    .forEach((task,index)=>{


        task.onclick=function(e){


            if(
                e.target.tagName === "INPUT"
            ){

                return;

            }



            document
            .querySelectorAll(".task")
            .forEach(t=>{

                t.classList.remove(
                    "selected"
                );

            });



            task.classList.add(
                "selected"
            );



            let day =
            task.closest(".day");



            selectedTask = {


                date:
                day.dataset.date,


                index:index


            };



        };


    });


}









// =====================================
// Корзина
// =====================================


document
.getElementById("deleteTaskBtn")
.onclick=function(){



    if(!selectedTask){


        alert(
            "Выберите задачу"
        );


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
// =====================================
// Статусы дней
// =====================================


function updateDayStatus(){


    document
    .querySelectorAll(".day-status")
    .forEach(status=>{


        let date =
        status.dataset.date;



        if(
            !tasks[date] ||
            tasks[date].length === 0
        ){


            status.textContent =
            "⚪";


            return;

        }



        let allDone =

        tasks[date]
        .every(item=>item.done);



        if(allDone){


            status.textContent =
            "🟢";


        } else {


            status.textContent =
            "🟡";


        }



    });


}








// =====================================
// Сворачивание всей недели
// =====================================


const toggleWeekButton =

document.getElementById(
    "toggleWeekBtn"
);



if(toggleWeekButton){


    toggleWeekButton.onclick=function(){



        weekCollapsed =
        !weekCollapsed;



        document
        .querySelectorAll(".day-content")
        .forEach(content=>{



            if(weekCollapsed){


                content.classList
                .add("hidden");


            } else {


                content.classList
                .remove("hidden");


            }


        });



        toggleWeekButton.textContent =

        weekCollapsed
        ?
        "▲"
        :
        "▼";



    };


}








// =====================================
// После построения недели
// =====================================


function refreshWeek(){


    activateDays();


    activateTaskSelection();


    updateDayStatus();


}








// первый запуск

renderWeek();

refreshWeek();
// =====================================
// Повторное подключение кнопок
// =====================================


document
.getElementById("prevWeek")
.onclick = function(){


    currentDate.setDate(
        currentDate.getDate() - 7
    );


    renderWeek();


};




document
.getElementById("nextWeek")
.onclick = function(){


    currentDate.setDate(
        currentDate.getDate() + 7
    );


    renderWeek();


};




document
.getElementById("todayBtn")
.onclick = function(){


    currentDate =
    new Date();


    renderWeek();


};





// =====================================
// Добавление задачи
// =====================================


document
.getElementById("addTaskBtn")
.onclick=function(){


    if(!selectedDate){


        alert(
            "Сначала выберите день"
        );


        return;

    }



    document
    .getElementById("taskModal")
    .classList
    .remove("hidden");


};





document
.getElementById("saveTaskBtn")
.onclick=function(){


    let input =
    document.getElementById("newTaskInput");


    let text =
    input.value.trim();



    if(text===""){

        return;

    }



    addTask(
        selectedDate,
        text
    );



    input.value="";



    document
    .getElementById("taskModal")
    .classList
    .add("hidden");



    renderWeek();


};
// компактная шапка при прокрутке

const header = document.querySelector(".glass-header");


window.addEventListener("scroll", ()=>{


    if(window.scrollY > 40){

        header.classList.add("compact");

    } 
    else {

        header.classList.remove("compact");

    }


});
