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

        done:false

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
        item.done ? "task completed" : "task";



        task.innerHTML = `

        <input type="checkbox"
        ${item.done ? "checked" : ""}>


        <span>
        ${item.text}
        </span>

        `;



        // выбор задачи
        task.onclick=function(e){

            if(e.target.tagName==="INPUT"){
                return;
            }

            document
            .querySelectorAll(".task")
            .forEach(t=>t.classList.remove("selected"));

            task.classList.add("selected");

            selectedTask = {

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


        };



        container.appendChild(task);



    });


}