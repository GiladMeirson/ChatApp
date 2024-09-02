let currentUser = '';
const ws = new WebSocket(`wss://chat-test-sini.glitch.me/`);
//const ws = new WebSocket(`ws://localhost:3000/`);
ws.addEventListener('open', () => {
    //console.log('Connected to server');
    $.notify("Connected to server", "success");
    thisUser={
        type: 'USER_CONNECTED',
        nickname: 'anonymous',
        id: generateUniqueId()
    }
});
users = [];
thisUser=null;
const nicknameModal = document.getElementById('nicknameModal');
const chatInterface = document.getElementById('chatInterface');
const nicknameForm = document.getElementById('nicknameForm');
const nicknameInput = document.getElementById('nicknameInput');

nicknameForm.addEventListener('submit', (e) => {
    e.preventDefault();
    currentUser = nicknameInput.value.trim();
    if (currentUser) {
        thisUser.nickname = currentUser;
        sendDataToWs(thisUser);
        
        nicknameModal.style.display = 'none';
        chatInterface.style.display = 'flex';
        initializeChat();
    }
});
function updateUserList(usersListupdated) {
    //console.log(usersListupdated);
    users = usersListupdated;
    // Populate user list
    const userList = document.getElementById('userList');
    userList.innerHTML = '';
    users.forEach(user => {
        if (user.id!=thisUser.id) {
            userList.innerHTML+=`<li id="${user.id}">${user.nickname}</li>`;
        }
    });
}

function initializeChat() {
    // Simulated user data (replace with actual data from your backend)
    // Populate user list

    // Handle chat form submission
    const chatForm = document.getElementById('chatForm');
    const messageInput = document.getElementById('messageInput');
    const chatMessages = document.getElementById('chatMessages');

    chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const message = messageInput.value.trim();
        if (message) {
            addMessage(currentUser, message, true);
            messageInput.value = '';
            sendDataToWs({
                type: 'MESSAGE',
                nickname: currentUser,
                message: message
            });
     
        }
    });

    // Toggle sidebar for mobile view
    const toggleSidebar = document.getElementById('toggleSidebar');
    const closeSidebar = document.getElementById('closeSidebar');
    const chatSidebar = document.querySelector('.chat-sidebar');

    function openSidebar() {
        chatSidebar.classList.add('active');
    }

    function closeSidebarFunc() {
        chatSidebar.classList.remove('active');
    }

    toggleSidebar.addEventListener('click', openSidebar);
    closeSidebar.addEventListener('click', closeSidebarFunc);

    // Close sidebar when clicking outside of it on mobile
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768 && 
            !chatSidebar.contains(e.target) && 
            !toggleSidebar.contains(e.target) &&
            chatSidebar.classList.contains('active')) {
            closeSidebarFunc();
        }
    });


}

function addMessage(sender, text, isSent) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', isSent ? 'sent' : 'received');
    messageDiv.innerHTML = `<strong>${sender}:</strong> ${text}`;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}


function sendDataToWs(data){
    ws.send(JSON.stringify(data));
}

ws.addEventListener('message', (message) => {
    const data = JSON.parse(message.data);
    switch(data.type){
        case 'USER_CONNECTED':
            console.log(data);
            //addMessage('System', `${data.nickname} has joined the chat`, false);
            if (thisUser) {
                if (data.thisUser != undefined) {
                    $.notify(`${data.thisUser.nickname} has joined the chat`, "success");
                }
                
                updateUserList(data.users);
            }
            
            break;
        case 'MESSAGE':
            addMessage(data.nickname, data.message, false);
            break;

        case 'USER_DISCONNECTED':
            console.log(data);
            if (data.id!="") {
                let username = users.find(user => user.id === data.id).nickname;
                $.notify(`${username} has left the chat`, "error");
                updateUserList(data.users);
            }

            
            
            
            break;
    }
});



function generateUniqueId() {
    return Math.random().toString(36).substring(2) + (new Date()).getTime().toString(36);
}



// emojies Logics
function openemojiesModal(){
    $('#emojiPickerModal').show();
}


function closeEmoteModal(){
    $('#emojiPickerModal').hide();
}

$('.emoji-button').click((emote)=>{
    //console.log(emote.target.innerText);
    document.getElementById('messageInput').value+=emote.target.innerText;
})
// emojies Logics




//dark mode 
const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');
const currentTheme = localStorage.getItem('theme');

if (currentTheme) {
    document.documentElement.setAttribute('data-theme', currentTheme);

    if (currentTheme === 'dark') {
        toggleSwitch.checked = true;
    }
}

function switchTheme(e) {
    if (e.target.checked) {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    }
    else {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
    }    
}

toggleSwitch.addEventListener('change', switchTheme, false);