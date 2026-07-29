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
// удержание задачи

let pressTimer;


function startPress(){

    pressTimer = setTimeout(()=>{
  console.log("удержание сработало");

        showPriorityMenu(
            task,
            item,
            date
        );

    },700);

}



function endPress(){

    clearTimeout(pressTimer);

}



task.addEventListener(
    "touchstart",
    startPress
);


task.addEventListener(
    "touchend",
    endPress
);



task.addEventListener(
    "mousedown",
    startPress
);


task.addEventListener(
    "mouseup",
    endPress
);
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
