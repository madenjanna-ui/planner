// MaDenFlow - сохранение задач


let tasks =
JSON.parse(
    localStorage.getItem("MaDenFlow_tasks")
)
||
{};




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





// загрузить задачи дня

function loadTasks(date, container){


    container.innerHTML = "";



    if(!tasks[date]){

        return;

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
// приоритет задачи

if(!item.priority){

    item.priority = "normal";

}


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





        let checkbox =
        task.querySelector("input");



        checkbox.onchange=function(){


            item.done =
            checkbox.checked;



            saveTasks();



            renderWeek();


        };



        container.appendChild(task);
// удержание задачи

let pressTimer;


task.addEventListener(
    "touchstart",
    function(){

        pressTimer = setTimeout(()=>{

            showPriorityMenu(
                task,
                item,
                date
            );

        },700);

    }
);



task.addEventListener(
    "touchend",
    function(){

        clearTimeout(pressTimer);

    }
);

    });


}
function showPriorityMenu(task, item, date){


    let oldMenu =
    document.querySelector(
        ".priority-menu"
    );


    if(oldMenu){

        oldMenu.remove();

    }



    let menu =
    document.createElement("div");


    menu.className =
    "priority-menu";


    menu.innerHTML = `

    <button data-color="yellow">
    🟡 Важная
    </button>


    <button data-color="red">
    🔴 Срочная
    </button>


    <button data-color="gray">
    ⚪ Обычная
    </button>

    `;



    task.appendChild(menu);



    menu.querySelectorAll("button")
    .forEach(button=>{


        button.onclick=function(e){


            e.stopPropagation();


            item.priority =
            this.dataset.color;


            saveTasks();


            menu.remove();


            renderWeek();


        };


    });


}
