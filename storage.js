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
if(tasks[date].length <= 2){

    container.classList.remove(
        "two-columns",
        "three-columns"
    );

}


else if(tasks[date].length <= 6){

    container.classList.add(
        "two-columns"
    );

    container.classList.remove(
        "three-columns"
    );

}


else{


    container.classList.add(
        "three-columns"
    );

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


    selectedTask={

        date:date,

        index:index

    };


    showTaskMenu(
        task,
        item,
        date,
        index
    );


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
function showTaskMenu(task,item,date,index){


    let old =
    document.querySelector(
        ".task-menu"
    );


    if(old){

        old.remove();

    }



    let menu =
    document.createElement("div");


    menu.className =
    "task-menu";


    menu.innerHTML = `

    <button data-action="yellow">
    🟡 Важная
    </button>


    <button data-action="red">
    🔴 Срочная
    </button>


    <button data-action="gray">
    ⚪ Обычная
    </button>


    <button data-action="edit">
    ✏️ Изменить
    </button>


    <button data-action="delete">
    🗑 Удалить
    </button>

    `;


    document.body.appendChild(menu);



    let rect =
    task.getBoundingClientRect();


    menu.style.left =
    rect.left + "px";


    menu.style.top =
    rect.bottom + 5 + "px";




    menu.querySelectorAll("button")
    .forEach(button=>{


        button.onclick=function(e){


            e.stopPropagation();


            let action =
            this.dataset.action;



            if(
                action==="yellow" ||
                action==="red" ||
                action==="gray"
            ){

                item.priority =
                action;

            }



            if(action==="delete"){


                tasks[date]
                .splice(
                    index,
                    1
                );

            }



            if(action==="edit"){


                let newText =
                prompt(
                    "Изменить задачу:",
                    item.text
                );


                if(newText){

                    item.text =
                    newText;

                }

            }



            saveTasks();

            menu.remove();

            renderWeek();


        };


    });


}



document.onclick=function(){

    let menu =
    document.querySelector(
        ".task-menu"
    );


    if(menu){

        menu.remove();

    }

};


            saveTasks();


            menu.remove();


            renderWeek();


        };


    });


}
