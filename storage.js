// =====================================
// MaDenFlow Storage 3.1
// =====================================

window.tasks = JSON.parse(
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
// Добавить задачу
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
// Удалить задачу
// =====================================

function deleteTask(date,index){

    if(!tasks[date]) return;

    tasks[date].splice(index,1);

    saveTasks();

}



// =====================================
// Изменить задачу
// =====================================

function editTask(date,index,newText){

    if(!tasks[date]) return;

    tasks[date][index].text=newText;

    saveTasks();

}



// =====================================
// Изменить приоритет
// =====================================

function changePriority(date,index,color){

    if(!tasks[date]) return;

    tasks[date][index].priority=color;

    saveTasks();

}



// =====================================
// Выполнение задачи
// =====================================

function toggleTask(date,index,state){

    if(!tasks[date]) return;

    tasks[date][index].done=state;

    saveTasks();

}
// =====================================
// Загрузка задач дня
// =====================================

function loadTasks(date,container){

    container.innerHTML="";

    if(!tasks[date]){
        return;
    }

    // ---------- Колонки ----------

    container.classList.remove(
        "two-columns",
        "three-columns"
    );

    const count = tasks[date].length;

    if(count>=3 && count<=6){

        container.classList.add(
            "two-columns"
        );

    }

    if(count>=7){

        container.classList.add(
            "three-columns"
        );

    }

    // ---------- Список задач ----------

    tasks[date].forEach((item,index)=>{

        const task =
        document.createElement("div");

        task.className =
            item.done
            ?
            "task completed"
            :
            "task";

        task.classList.add(
            item.priority || "normal"
        );

        task.innerHTML=`

            <input
                type="checkbox"
                ${item.done ? "checked" : ""}
            >

            <span>${item.text}</span>

        `;

        // Чекбокс

        const checkbox =
        task.querySelector("input");

        checkbox.onchange=function(){

            toggleTask(
                date,
                index,
                checkbox.checked
            );

            renderWeek();

        };

        // Клик по задаче

        task.onclick=function(e){

            if(e.target.tagName==="INPUT"){
                return;
            }

            showTaskMenu(
                task,
                item,
                date,
                index
            );

        };

        container.appendChild(task);

    });

}
// =====================================
// Меню задачи
// =====================================

function showTaskMenu(task,item,date,index){

    // удалить старое меню
    const oldMenu =
    document.querySelector(".task-menu");

    if(oldMenu){
        oldMenu.remove();
    }

    // создать меню
    const menu =
    document.createElement("div");

    menu.className="task-menu";

    menu.innerHTML=`

        <button data-action="yellow">
            🟡 Важная
        </button>

        <button data-action="red">
            🔴 Срочная
        </button>

        <button data-action="normal">
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

    // положение меню
    const rect =
    task.getBoundingClientRect();

    let left = rect.left;
    let top = rect.bottom + 6;

    if(left + 220 > window.innerWidth){
        left = window.innerWidth - 225;
    }

    if(top + 240 > window.innerHeight){
        top = rect.top - 245;
    }

    menu.style.position="fixed";
    menu.style.left=left+"px";
    menu.style.top=top+"px";
    menu.style.zIndex="99999";

    // обработка кнопок
    menu.querySelectorAll("button")
    .forEach(button=>{

        button.onclick=function(e){

            e.stopPropagation();

            const action =
            this.dataset.action;

            if(
                action==="yellow" ||
                action==="red" ||
                action==="normal"
            ){

                changePriority(
                    date,
                    index,
                    action
                );

            }

            else if(action==="edit"){

                const txt =
                prompt(
                    "Изменить задачу",
                    item.text
                );

                if(
                    txt!==null &&
                    txt.trim()!==""
                ){

                    editTask(
                        date,
                        index,
                        txt.trim()
                    );

                }

            }

            else if(action==="delete"){

                if(confirm("Удалить задачу?")){

                    deleteTask(
                        date,
                        index
                    );

                }

            }

            menu.remove();

            renderWeek();

        };

    });

}
// =====================================
// Закрытие меню при клике вне него
// =====================================

document.addEventListener("click",function(e){

    const menu =
    document.querySelector(".task-menu");

    if(!menu){
        return;
    }

    // клик по меню
    if(menu.contains(e.target)){
        return;
    }

    // клик по задаче
    if(e.target.closest(".task")){
        return;
    }

    menu.remove();

});

/* ===================================
   СЛУЖЕНИЕ
=================================== */

.service-window{
    width:340px;
    max-width:92%;
    border-radius:22px;
    padding:22px;
    background:#ffffff;
    box-shadow:0 15px 45px rgba(0,0,0,.25);
}

.service-add-window{
    width:300px;
    max-width:90%;
    border-radius:22px;
    padding:22px;
    background:#ffffff;
    box-shadow:0 15px 45px rgba(0,0,0,.25);
}

.service-header{
    font-size:24px;
    font-weight:700;
    text-align:center;
    margin-bottom:18px;
}

.service-month{
    text-align:center;
    font-size:18px;
    font-weight:600;
    color:#666;
    margin-bottom:15px;
}

.service-list{
    max-height:260px;
    overflow-y:auto;
    margin-bottom:15px;
}

.service-row{
    display:flex;
    justify-content:space-between;
    align-items:center;
    padding:10px 6px;
    border-bottom:1px solid #ececec;
    font-size:17px;
}

.service-row:last-child{
    border-bottom:none;
}

.service-date{
    font-weight:600;
}

.service-time{
    color:#2f80ed;
    font-weight:700;
}

.service-total{
    margin-top:18px;
    padding-top:15px;
    border-top:2px solid #ddd;
    text-align:center;
}

.service-total div:first-child{
    font-size:15px;
    color:#888;
}

#serviceTotal{
    margin-top:6px;
    font-size:26px;
    font-weight:bold;
    color:#2f80ed;
}

.service-add,
.service-close,
#saveServiceBtn,
#cancelServiceBtn{

    width:100%;
    border:none;
    border-radius:14px;
    padding:13px;
    margin-top:12px;

    cursor:pointer;

    font-size:16px;
    font-weight:600;

    transition:.2s;
}

.service-add{
    background:#2f80ed;
    color:white;
}

.service-add:hover{
    transform:scale(1.02);
}

.service-close{
    background:#efefef;
}

#saveServiceBtn{
    background:#2f80ed;
    color:white;
}

#cancelServiceBtn{
    background:#efefef;
}

.service-add-window label{
    display:block;
    margin-top:15px;
    margin-bottom:6px;
    font-weight:600;
}

.service-add-window input{

    width:100%;

    box-sizing:border-box;

    padding:10px;

    border-radius:10px;

    border:1px solid #ccc;

    font-size:16px;
}

.modal.hidden{
    display:none;
}
