// =====================================
// MaDenFlow Storage 3.0
// =====================================

window.tasks =
JSON.parse(
    localStorage.getItem("MaDenFlow_tasks")
) || {};



// =====================================
// Сохранение
// =====================================

function saveTasks(){

    localStorage.setItem(
        "MaDenFlow_tasks",
        JSON.stringify(tasks)
    );

    if(typeof cloudSave==="function"){
        cloudSave();
    }

}



// =====================================
// Добавление задачи
// =====================================

function addTask(date,text){

    if(!tasks[date]){
        tasks[date]=[];
    }

    tasks[date].push({

        text:text,

        done:false,

        priority:"normal"

    });

    saveTasks();

}



// =====================================
// Загрузка задач
// =====================================

function loadTasks(date,container){

    container.innerHTML="";



    if(!tasks[date]){
        return;
    }



    // -------------------
    // Колонки
    // -------------------

    container.classList.remove(
        "two-columns",
        "three-columns"
    );



    if(tasks[date].length>=3 &&
       tasks[date].length<=6){

        container.classList.add(
            "two-columns"
        );

    }

    if(tasks[date].length>=7){

        container.classList.add(
            "three-columns"
        );

    }



    // -------------------
    // Задачи
    // -------------------

    tasks[date].forEach((item,index)=>{

        if(!item.priority){
            item.priority="normal";
        }



        let task=
        document.createElement("div");



        task.className=
        item.done
        ?
        "task completed"
        :
        "task";



        task.classList.add(
            item.priority
        );



        task.innerHTML=`

            <input
                type="checkbox"
                ${item.done ? "checked" : ""}
            >

            <span>
                ${item.text}
            </span>

        `;



        // -------------------
        // Выбор задачи
        // -------------------

 task.onclick=function(e){

    console.log("КЛИК");

    if(e.target.tagName==="INPUT"){
        return;
    }
console.log(typeof showTaskMenu);

    showTaskMenu(task,item,date,index);

};




        // -------------------
        // Выполнение
        // -------------------

        let checkbox=
        task.querySelector("input");



        checkbox.onchange=function(){

            item.done=
            checkbox.checked;

            saveTasks();

            renderWeek();

        };



        container.appendChild(task);

    });

}
// =====================================
// Меню задачи
// =====================================

function showTaskMenu(task,item,date,index){

    

    let oldMenu =
    document.querySelector(".task-menu");
    

    if(oldMenu){
        oldMenu.remove();
    }

    

    let menu = document.createElement("div");

    

    menu.className="task-menu";

   
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

menu.style.position = "fixed";
menu.style.zIndex = "99999";

let rect = task.getBoundingClientRect();

let left = rect.left;
let top = rect.bottom + 6;

if(left + 220 > window.innerWidth){
    left = window.innerWidth - 230;
}

if(top + 250 > window.innerHeight){
    top = rect.top - 256;
}

menu.style.left = left + "px";
menu.style.top = top + "px";

document.body.appendChild(menu);


menu.querySelectorAll("button").forEach(button=>{

    button.onclick=function(e){

        e.stopPropagation();

        let action=this.dataset.action;

        if(action==="yellow" ||
           action==="red" ||
           action==="gray"){

            item.priority=action;

        }
        else if(action==="edit"){

            let txt=prompt(
                "Изменить задачу:",
                item.text
            );

            if(txt!==null && txt.trim()!==""){
                item.text=txt.trim();
            }

        }
        else if(action==="delete"){

            if(confirm("Удалить задачу?")){
                tasks[date].splice(index,1);
            }

        }

        saveTasks();
        renderWeek();
saveTasks();

menu.remove();

renderWeek();
    };

});

}


      

// =====================================
// Закрытие меню
// =====================================

document.addEventListener(

    "click",

    function(e){

        let menu =
        document.querySelector(".task-menu");

        if(!menu){
            return;
        }

        if(
            !menu.contains(e.target)
        ){

            menu.remove();

        }

    }

);
