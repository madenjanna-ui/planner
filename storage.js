// =====================================
// MaDenFlow
// storage.js
// =====================================


// загрузка задач

let tasks =
JSON.parse(
    localStorage.getItem("MaDenFlow_tasks")
)
||
{};


// выбранная задача

let selectedTask = null;



// сохранить задачи

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





// =====================================
// загрузить задачи дня
// =====================================


function loadTasks(date, container){


    container.innerHTML = "";



    if(!tasks[date]){

        return;

    }




    // старым задачам добавляем приоритет

    tasks[date].forEach(item=>{


        if(!item.priority){

            item.priority="normal";

        }


    });





    // две колонки

    if(tasks[date].length > 1){

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


        <input 
        type="checkbox"
        ${item.done ? "checked" : ""}>


        <span>
        ${item.text}
        </span>


        `;




        // ==========================
        // выбор задачи для удаления
        // ==========================


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







        // ==========================
        // смена важности
        // временно двойной клик
        // ==========================


        task.ondblclick=function(){



            if(item.priority==="normal"){

                item.priority="yellow";

            }

            else if(item.priority==="yellow"){

                item.priority="red";

            }

            else if(item.priority==="red"){

                item.priority="gray";

            }

            else{

                item.priority="normal";

            }



            saveTasks();


            renderWeek();


        };








        // ==========================
        // выполнение задачи
        // ==========================


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
