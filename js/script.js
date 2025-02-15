let isModalOpen = true;
let modalPriorityColor = "red";
let taskArr = [];
let currentStatus = "todo";
let isRemoveFlagEnabled = false;

/*
    Helper functions
*/
const query = (selector) => document.querySelector(selector);
const queryAll = (selector) => document.querySelectorAll(selector);
const createElement = (HTMLTag) => document.createElement(HTMLTag);
const updateLocalStorage = (key, data) => localStorage.setItem(key, JSON.stringify(data));
const getLocalStorage = (key) => localStorage.getItem(key);

/*
    Create ticket elements.
    Tickets has to be created under todo section.

    <div class="ticket-cont">
        <div class="ticket-color red"></div>
        <div class="ticket-id">#1234</div>
        <div class="ticket-task">Learn HTML</div>
        <div class="lock-unlock">
            <i class="fa-solid fa-lock"></i>
        </div>
    </div>
*/

const createTicketElement = (priorityColor, id, task) => {
    const ticketContainer = createElement("div");

    ticketContainer.className = "ticket-cont";
    ticketContainer.id = id;
    ticketContainer.draggable = true;

    ticketContainer.innerHTML =
        `<div class="ticket-color ${priorityColor}"></div>
        <div class="ticket-id">${id}</div>
        <div class="ticket-task">${task}</div>
        <div class="lock-unlock">
            <i class="fa-solid fa-lock"></i>
        </div>
        `;
    return ticketContainer;
}

const addLockUnlockHandler = (ticketEl, taskId) => {

    const locKUnlockBtn = ticketEl.querySelector(".fa-solid");
    const ticketTask = ticketEl.querySelector(".ticket-task")
    
    locKUnlockBtn.addEventListener("click", () => {
        
        locKUnlockBtn.classList.toggle("fa-unlock");
        
        ticketTask.contentEditable = locKUnlockBtn.classList.contains("fa-unlock");
        
        const idx = taskArr.findIndex((val) => val.id === taskId);
        console.log(idx);
        console.log(ticketTask.innerText);
        taskArr[idx].task = ticketTask.innerText;


        updateLocalStorage("tickets", taskArr);
    })
}

const deleteTicketHandler = (ticketEl, taskId) => {
    ticketEl.addEventListener("click", () => {
        if(isRemoveFlagEnabled) {
            ticketEl.remove();
            taskArr = taskArr.filter((val) => val.id !== taskId);
            updateLocalStorage("tickets", taskArr);
        }
    })
}

const createTicketHandler = () => {
    const textarea = query(".modal-textarea");
    const task = textarea.value.trim();

    if(task) {
        const id = `kb-${new ShortUniqueId().randomUUID()}`;
        const ticketEl = createTicketElement(modalPriorityColor, id, task);
        query(`#${currentStatus}`).appendChild(ticketEl);
        toggleModal();
        textarea.value = "";
        
        taskArr.push({id, task, priorityColor: modalPriorityColor, status: currentStatus});
        updateLocalStorage("tickets", taskArr);

        addLockUnlockHandler(ticketEl, id);

        deleteTicketHandler(ticketEl, id);
    }
}

const handlePriorityColorSelection = (event) => {

    const priorityColorElement = event.target;

    queryAll(".priority-color").forEach(el => {
        el.classList.remove("active");
        
    })
    priorityColorElement.classList.add("active");
    modalPriorityColor = priorityColorElement.classList[1];
}

const toggleModal = () => {
    const modal = query(".modal-overlay");
    modal.style.display = isModalOpen ? "flex" : "none";
    isModalOpen = !isModalOpen;
}

const toggleRemoveFlag = () => {
    isRemoveFlagEnabled = !isRemoveFlagEnabled;
    const removeBtn = query(".remove-btn");
    removeBtn.style.color = isRemoveFlagEnabled ? "red" : "black";
}

const handleDragStart = (event) => {

    event.dataTransfer.setData("text/plain", event.target.id);
    event.target.classList.add("dragging");
}

const handleDragEnd = () => {

    event.target.classList.remove('dragging');
}

const handleDrop = (event) => {
    
    const taskId = event.dataTransfer.getData("text/plain");
    
    const droppedTicket = query(`#${taskId}`);
    // console.log(droppedTicket);

    const targetContainer = event.target.closest(".ticket-container")
    // console.log(targetContainer);

    if(droppedTicket && targetContainer) {
        const sourceContainer = droppedTicket.closest(".ticket-container")
        // console.log(sourceContainer);

        sourceContainer.removeChild(droppedTicket);

        targetContainer.appendChild(droppedTicket);

        const idx = taskArr.findIndex((val) => val.id === taskId);
        console.log(idx);

        taskArr[idx].status = targetContainer.id;

        updateLocalStorage("tickets", taskArr);
    }
}

const setupEventListeners = () => {
    query(".toolbox-cont").addEventListener("click", (event) => {
        const targetClassList = event.target.classList;
        if (targetClassList.contains("fa-plus")) {
            toggleModal();
        } else if(targetClassList.contains("fa-trash")) {
            toggleRemoveFlag();
        }
    });

    query(".modal-close-btn").addEventListener("click", () => {
        toggleModal();
    });

    query(".create-task").addEventListener("click", () => {
        createTicketHandler();
    });

    queryAll(".priority-color").forEach(el => {
        el.addEventListener("click", handlePriorityColorSelection);
    })

    const mainContainer = query(".main-cont");
    mainContainer.addEventListener("dragstart", handleDragStart);
    mainContainer.addEventListener("dragover", (event) => {event.preventDefault()});
    mainContainer.addEventListener("dragend", handleDragEnd);
    mainContainer.addEventListener("drop", handleDrop);
}

const loadTicketsFromLocalStorage = () => {
    taskArr = getLocalStorage("tickets") ? JSON.parse(getLocalStorage("tickets")) : [];
    
    taskArr.forEach((val) => {
        const ticketEl = createTicketElement(val.priorityColor, val.id, val.task);

        query(`#${val.status}`).appendChild(ticketEl);

        addLockUnlockHandler(ticketEl, val.id);

        deleteTicketHandler(ticketEl, val.id);
    })
}

const initializeKanbanBoard = () => {
    loadTicketsFromLocalStorage();
    setupEventListeners();
}

initializeKanbanBoard();