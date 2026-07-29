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

 task.onclick = function(e){

    console.log("КЛИК ПО ЗАДАЧЕ");

    if(e.target.tagName==="INPUT"){
        return;
    }

    console.log("перед showTaskMenu");

    showTaskMenu(
        task,
        item,
        date,
        index
    );

    console.log("после showTaskMenu");
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

    alert("showTaskMenu вызвана");

    console.log(task);
    console.log(item);
    console.log(date);
    console.log(index);

    let oldMenu =
    document.querySelector(".task-menu");
    console.log("2");

    if(oldMenu){
        oldMenu.remove();
    }

    console.log("3");

    let menu = document.createElement("div");

    console.log("4");

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
document.body.appendChild(menu);
console.log("HTML MENU:", menu.innerHTML);
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


// Сначала задаём стили
menu.style.position = "fixed";
menu.style.zIndex = "99999";


// Получаем координаты задачи
let rect = task.getBoundingClientRect();

let left = rect.left;
let top = rect.bottom + 6;


// Проверяем правый край
if(left + 220 > window.innerWidth){
    left = window.innerWidth - 230;
}


// Проверяем нижний край
if(top + 250 > window.innerHeight){
    top = rect.top - 256;
}


// Добавляем меню в DOM
document.body.appendChild(menu);


// Ждём расчёт браузера
setTimeout(()=>{

    let menuRect = menu.getBoundingClientRect();

    console.log("7");
    console.log(menu);
    console.log(menuRect);

}, 50);

console.log("8");


menu
.querySelectorAll("button")
.forEach(button=>{

    button.onclick=function(e){

        e.stopPropagation();

        let action = this.dataset.action;


        if(
            action==="yellow" ||
            action==="red" ||
            action==="gray"
        ){
            item.priority = action;
        }


        if(action==="edit"){

            let txt = prompt(
                "Изменить задачу:",
                item.text
            );

            if(txt !== null && txt.trim() !== ""){
                item.text = txt.trim();
            }

        }


        if(action==="delete"){

            if(confirm("Удалить задачу?")){

                tasks[date].splice(index,1);

            }

        }


        saveTasks();

        menu.remove();

        renderWeek();

    };

});


console.log("9");
}
      

            // -------------------
            // Редактирование
            // -------------------

            if(action==="edit"){

                let txt=
                prompt(
                    "Изменить задачу:",
                    item.text
                );

                if(
                    txt!==null &&
                    txt.trim()!==""
                ){

                    item.text=
                    txt.trim();

                }

            }



            // -------------------
            // Удаление
            // -------------------

            if(action==="delete"){

                if(
                    confirm(
                        "Удалить задачу?"
                    )
                ){

                    tasks[date].splice(
                        index,
                        1
                    );

                }

            }



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
