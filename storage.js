// ======================================
// MaDenFlow 2.0
// storage.js
// ======================================


// загрузка задач

let tasks =
JSON.parse(
    localStorage.getItem("MaDenFlow_tasks")
)
|| {};



// выбранная задача

let selectedTask = null;



// сохранить

function saveTasks(){

    localStorage.setItem(
        "MaDenFlow_tasks",
        JSON.stringify(tasks)
    );


    if(typeof cloudSave === "function"){

        cloudSave();

    }

}



// добавить задачу

function addTask(date, text){


    if(!tasks[date]){

        tasks[date] = [];

    }



    tasks[date].push({

        text:text,

        done:false,

        priority:"normal"

    });



    saveTasks();


}




// ======================================
// загрузить задачи дня
// ======================================


function loadTasks(date, container){


    container.innerHTML = "";



    if(!tasks[date]){

        return;

    }



    // старые задачи получают приоритет

    tasks[date].forEach(item=>{

        if(!item.priority){

            item.priority="normal";

        }

    });



    // две колонки

    if(tasks[date].length > 2){

        container.classList.add(
            "two-columns"
        );

    }
    else{

        container.classList.remove(
            "two-columns"
        );

    }




    tasks[date].forEach((item,index)=>{


        let task =
        document.createElement("div");



        task.className =
        item.done
        ?
        "task completed"
        :
        "task";



        task.classList.add(
            item.priority
        );



        task.innerHTML = `

        <input type="checkbox"
        ${item.done ? "checked" : ""}>


        <span>
        ${item.text}
        </span>

        `;



        // =========================
        // обычный клик
        // выбор задачи
        // =========================


        task.onclick=function(e){


            if(e.target.tagName==="INPUT"){

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



            selectedTask={

                date:date,

                index:index

            };


        };





        // =========================
        // долгое нажатие
        // =========================


        let pressTimer;



        function startPress(){


            pressTimer =
            setTimeout(()=>{


                showPriorityMenu(
                    task,
                    item,
                    date,
                    container
                );


            },700);


        }




        function cancelPress(){


            clearTimeout(
                pressTimer
            );


        }



        task.addEventListener(
            "touchstart",
            startPress
        );


        task.addEventListener(
            "touchend",
            cancelPress
        );


        task.addEventListener(
            "mousedown",
            startPress
        );


        task.addEventListener(
            "mouseup",
            cancelPress
        );





        // =========================
        // выполнение
        // =========================


        let checkbox =
        task.querySelector("input");



        checkbox.onchange=function(){


            item.done =
            checkbox.checked;



            saveTasks();


            renderWeek();


        };



        container.appendChild(
            task
        );


    });


}





// ======================================
// меню приоритета
// ======================================


function showPriorityMenu(
    task,
    item,
    date,
    container
){



    let old =
    document.querySelector(
        ".priority-menu"
    );



    if(old){

        old.remove();

    }




    let menu =
    document.createElement("div");



    menu.className =
    "priority-menu";



    menu.innerHTML = `

        <button data-color="yellow">
            Важная
        </button>

        <button data-color="red">
            Срочная
        </button>

        <button data-color="gray">
            Обычная
        </button>

    `;



    task.appendChild(
        menu
    );





    menu.querySelectorAll("button")
    .forEach(btn=>{


        btn.onclick=function(e){


            e.stopPropagation();



            item.priority =
            this.dataset.color;



            saveTasks();



            menu.remove();



            renderWeek();


        };


    });



}
