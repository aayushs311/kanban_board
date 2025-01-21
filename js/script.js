let isModalOpen = true;
let modalPriorityColor = "red";

/*
    Helper functions
*/
const query = (selector) => document.querySelector(selector);
const queryAll = (selector) => document.querySelectorAll(selector);
const createElement = (HTMLTag) => document.createElement(HTMLTag);

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

const createTicketHandler = () => {
    const textarea = query(".modal-textarea");
    const task = textarea.value.trim();

    if(task) {
        const id = `kb-${new ShortUniqueId().randomUUID()}`;
        query("#todo").appendChild(createTicketElement(modalPriorityColor, id, task));
        toggleModal();
        textarea.value = "";
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

const setupEventListeners = () => {
    query(".toolbox-cont").addEventListener("click", (event) => {
        const targetClassList = event.target.classList;
        if (targetClassList.contains("fa-plus")) {
            toggleModal();
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
}

setupEventListeners();