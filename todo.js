(function(){
    let tasks=[];
    const tasksList=document.getElementById('list');
    const addtaskInput=document.getElementById('add');
    const addtaskbutton=document.getElementById('create');
    const totaltask=document.getElementById('total-counter');
    const completedtask=document.getElementById('completed-counter');
    const pendingtask=document.getElementById('pending-counter');
    console.log("Working")
    
    // Fetching data using API call using normal function
    
    // function fetchTodo(){
    //     // for get request we do this 
    //     fetch('https://jsonplaceholder.typicode.com/todos').then(function(response){
    //         console.log(response);
    //         return response.json();
    //     }).then(function (data){
    //         tasks=data
    //         console.log(data);
    //         renderlist()
    //     }).catch(function (error){
    //         console.log(error)
    //     })
    // };
    
    // Fetching data using API call using async and await function
    
    async function fetchTodo(){
        try{
            const response=await fetch('https://jsonplaceholder.typicode.com/todos');
            const data=await response.json();
            tasks=data;
            renderlist();
        } catch(error){
            console.log(error);
        }
    };
    
    function addTaskToDOM(task){
        const li=document.createElement('li');
        li.innerHTML=`
            <div id="checkbox-Input-container">
                <input type=checkbox id="${task.id}" ${task.completed? 'checked': ''} data-id=${task.id} class="custom-checkbox">
                <label for="${task.id}">${task.title}</label>
            </div>
            <div id="set-position">
                <button data-id="${task.id}" class="delete" type="click">Delete</button>
            </div>`
    
        tasksList.append(li);
    }
    
    function renderlist(){
        tasksList.innerHTML='';
        let pending=0;
        for (let i=0;i<tasks.length;i++){
            addTaskToDOM(tasks[i]);
            if (tasks[i].completed==false){
                pending+=1
            }
        }
        totaltask.innerHTML=tasks.length;
        pendingtask.innerHTML=pending;
        completedtask.innerHTML=tasks.length-pending;
    }
    
    function toggletask(taskId){
        const Task=tasks.filter(function (task){
            return task.id==Number(taskId)
        });
        if (Task.length>0){
            const currenttask=Task[0];
            currenttask.completed=!currenttask.completed
            renderlist()
            shownotification("Task toggled succesfully");
            return;
        }
        shownotification("Could not toggle the task");
    }
    
    function deleteTask(taskId){
        console.log(taskId)
        const newTasks=tasks.filter(function(task){
            return task.id!==Number(taskId)
        });
        const deletedtaskobj=tasks.filter(function(task){
            return task.id===Number(taskId)
        });
        tasks=newTasks;
        renderlist();
        // shownotification("Task deleted successfully");
    }
    // Add task normal function where we do not update the data
    function addtask(task){
        if (task){
            tasks.push(task);
            renderlist();
            shownotification('Task added Successfully');
            return;
        }
        shownotification("Task cannot be added")
    }
    
    // Add task function where we update the data but this will not work as this api does not allow us to update data
    function addtask(task){
        if (task){
            fetch('https://jsonplaceholder.typicode.com/todos',{
                method:'POST',
                headers:{
                    'Content-type':'application/json',
                },
                body:JSON.stringify(task),
            }).then(function (response){
                return response.json()
            }).then(function (data){
                console.log(data)
                tasks.push(task);
                renderlist();
                shownotification('Task added Successfully');
            }).catch(function (error){
                console.log(error);
            })
        }
        shownotification("Task cannot be added")
    }
    function shownotification(text){
        alert(text);
    }
    
    function handleInputKeyPress(e){
        if (e.key==='Enter'){
            const text=e.target.value;
            console.log('text: ', text)
            if (!text){
                shownotification('Hey Task text cannot be empty');
                return
            };
        
            const task={
                title:text,
                id:Date.now(),
                completed:false
            }
            e.target.value='';
            addtask(task)
        }
    }
    function handleClickListner(e){
        const target=e.target
        if (target.className==="custom-checkbox"){
            const taskId=target.dataset.id;
            toggletask(taskId);
            return
        }else if(target.className==="delete"){
            const taskId=target.dataset.id;
            deleteTask(taskId);
            return;
        }
    
    }
    
    function initializeApp(){
        fetchTodo();
        addtaskInput.addEventListener('keyup',handleInputKeyPress);
        document.addEventListener('click',handleClickListner); 
        // using the document.addEventListner so that we do not need to add multiple event listner and in handleclicklistner we are just finding where the user actually clicked and then calling the function accordingly
    };
    initializeApp()
})()

