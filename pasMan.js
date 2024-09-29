// script.js
let currentUser = null;

document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();
    login();
});

document.getElementById('password-form').addEventListener('submit', function(event) {
    event.preventDefault();
    savePassword();
});

document.getElementById('edit-form').addEventListener('submit', function(event) {
    event.preventDefault();
    saveEdit();
});

document.getElementById('register-form').addEventListener('submit', function(event) {
    event.preventDefault();
    register();
});

// Event listener for logout button
document.getElementById('logout-btn').addEventListener('click', function(event) {
    event.preventDefault();
    logout();
});

function login() {
    
    const userinput = document.getElementById('loginInput').value;
    const password = document.getElementById('password').value;
    
    const users = JSON.parse(localStorage.getItem('users')) || {};
    let userFound = false;

    for(let username in users) {
        const user = users[username];
       
        if((username === userinput || user.email === userinput ||user.contact === userinput) && user.password === password) {
            currentUser = username;
            userFound = true;
            document.getElementById('login-section').classList.add('hidden');
            document.getElementById('verification1').classList.remove('hidden');
            const serviceID = "service_bs6c2zb";
            const templateID = "template_3vh5eqi";  
            const usingEmail = document.getElementById("viaEmail");
            usingEmail.addEventListener("click", () => {
                OTP = generateOTP();
                let templateParameter = {
                    from_name: "Password Manager dev Community",
                     OTP: OTP,
                    message: "Please find the OTP password",
                    reply_to: user.email,
                };
                emailjs.send(serviceID, templateID, templateParameter).then(
                    (res) => {
                        document.getElementById('verification1').classList.add('hidden');
                        document.getElementById('verification2').classList.remove('hidden');
                        document.getElementById('verify').textContent = user.email;
                        document.getElementById('code').textContent = "Email Adresse";
                    },
                    (err) => {
                        alert('Verification failed, try again...');
                    }
                );
                   
            });
            
            
            const usingPhone = document.getElementById("viaPhone");
            usingPhone.addEventListener("click", () => {
                document.getElementById('verification1').classList.add('hidden');
                document.getElementById('verification2').classList.remove('hidden');
                document.getElementById('verify').textContent = user.contact;
                document.getElementById('code').textContent = "Phone Number";
            });
            break;
        }
    }
    if(!userFound) {
        alert('Invalid username, email, contact or password');
    }

    // if (users[username] && users[username].password === password) {
    //     currentUser = username;
    //     document.getElementById('login-section').classList.add('hidden');
    //     document.getElementById('verification1').classList.remove('hidden');
    // } else {
    //     alert('Invalid username or password');
    // }
    
}
const verifyEmail = document.getElementById("verifyEmail"),
    inputs = document.querySelectorAll(".otp-group input"),
    verifyButton = document.querySelector(".verifyButton");

let OTP = "";

window.addEventListener("load", () =>{
    emailjs.init("xab6Hm4geQO67nCkl");
    verifyButton.classList.add("disabled");
});

const generateOTP = () =>{
    return Math.floor(1000+Math.random()*9000);
};

inputs.forEach((input) => {
    input.addEventListener("keyup", function(e){
        if (this.value.length >= 1) {
           e.target.value = e.target.value.substr(0,1); 
        }
        if(inputs[0].value != "" && inputs[1].value!= "" &&
            inputs[2].value!= "" && inputs[3].value!= ""){
            verifyButton.classList.remove("disabled");    
        }else{
            verifyButton.classList.remove("disabled");
        }
    });
});

verifyButton.addEventListener("click", ()=> {
    let values = "";
    inputs.forEach((input) => {
        values += input.value;
    });

    if(OTP == values){
        document.getElementById('verification2').classList.add('hidden');
        alert("Verifcation Successful");
        document.getElementById('password-section').classList.remove('hidden');
        loadPasswords();
    }
    else{
        verifyButton.classList.add("Error-shake");
        alert('Please Enter Correct OTP....');
        setTimeout(()=> {
            verifyButton.classList.remove("Error-shake");
        }, 1000);
    }
});

function changeMyEmail(){
    document.getElementById('verification2').classList.add('hidden');
    document.getElementById('verification1').classList.remove('hidden');
}

function register() {
    const username = document.getElementById('register-username').value;
    const emails = document.getElementById('email-address').value;
    const contact = document.getElementById('phone').value;
    const passwords = document.getElementById('registerpassword').value;
    if (!username || !passwords || !emails || !contact) {
        alert('All details are required!');
        return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || {};
    
    if (users[username]) {
        alert('Username already exists! Please choose a different one.');
        return;
    }

    // Register new user
    users[username] = { 
        password: passwords,
        email: emails,
        contact: contact,
        passwords: [] 
    };
    localStorage.setItem('users', JSON.stringify(users));
      
    alert('Registration successful! Please login.');
    showLogin();
}

let hide = document.getElementById("hide");
let password = document.getElementById("password");
let registerpassword = document.getElementById("registerpassword");
let registerPassword = document.getElementById("registerPassword");
hide.onclick = function() {
    if(password.type == "password") {
        password.type = "text";
        hide.src = "img/show.png";
    }
    else{
        password.type = "password";
        hide.src = "img/hide.png";
    }
}
registerPassword.onclick = function() {
    if(registerpassword.type == "password") {
        registerpassword.type = "text";
        registerPassword.src = "img/show.png";
    }
    else{
        registerpassword.type = "password";
        registerPassword.src = "img/hide.png";
    }
}

function savePassword() {
    const site = document.getElementById('site').value;
    const siteUsername = document.getElementById('site-username').value;
    const sitePassword = document.getElementById('site-password').value;

    if (!site || !siteUsername || !sitePassword) {
        alert('All fields are required!');
        return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || {};
    
    if (!users[currentUser].passwords) {
        users[currentUser].passwords = [];
    }

    users[currentUser].passwords.push({ site, siteUsername, sitePassword });
    localStorage.setItem('users', JSON.stringify(users));
    
    loadPasswords();
    document.getElementById('password-form').reset();
}

function loadPasswords() {
    const passwordList = document.getElementById('password-list');
    passwordList.innerHTML = '';

    const users = JSON.parse(localStorage.getItem('users')) || {};
    const passwords = users[currentUser].passwords || [];

    passwords.forEach((password, index) => {
        const passwordItem = document.createElement('div');
        passwordItem.className = 'password-item';
        passwordItem.innerHTML = `
            <div>
                <strong>${password.site}</strong> - ${password.siteUsername}: <span class="password">${'*'.repeat(password.sitePassword.length)}</span>
                <button onclick="togglePassword(${index})">Show</button>
            </div>
            <div class="password-actions">
                <button onclick="editPassword(${index})">Edit</button>
                <button onclick="deletePassword(${index})">Delete</button>
            </div>
        `;
        passwordList.appendChild(passwordItem);
    });
}

function togglePassword(index) {
    const users = JSON.parse(localStorage.getItem('users')) || {};
    const passwordElement = document.querySelectorAll('.password')[index];
    const showButton = passwordElement.nextElementSibling;

    if (passwordElement.textContent === '*'.repeat(users[currentUser].passwords[index].sitePassword.length)) {
        passwordElement.textContent = users[currentUser].passwords[index].sitePassword;
        showButton.textContent = 'Hide';
    } else {
        passwordElement.textContent = '*'.repeat(users[currentUser].passwords[index].sitePassword.length);
        showButton.textContent = 'Show';
    }
}

function editPassword(index) {
    const users = JSON.parse(localStorage.getItem('users')) || {};
    const password = users[currentUser].passwords[index];
    
    document.getElementById('edit-site').value = password.site;
    document.getElementById('edit-username').value = password.siteUsername;
    document.getElementById('edit-password').value = password.sitePassword;
    
    document.getElementById('edit-form').dataset.index = index;
    showModal();
}

function saveEdit() {
    const index = document.getElementById('edit-form').dataset.index;
    const users = JSON.parse(localStorage.getItem('users')) || {};

    const site = document.getElementById('edit-site').value;
    const siteUsername = document.getElementById('edit-username').value;
    const sitePassword = document.getElementById('edit-password').value;

    if (!site || !siteUsername || !sitePassword) {
        alert('All fields are required!');
        return;
    }

    users[currentUser].passwords[index] = { site, siteUsername, sitePassword };
    
    localStorage.setItem('users', JSON.stringify(users));
    loadPasswords();
    hideModal();
}

function deletePassword(index) {
    const users = JSON.parse(localStorage.getItem('users')) || {};
    users[currentUser].passwords.splice(index, 1);
    
    localStorage.setItem('users', JSON.stringify(users));
    loadPasswords();
}

function showRegister() {
    document.getElementById('login-section').classList.add('hidden');
    document.getElementById('register-section').classList.remove('hidden');
}

function showLogin() {
    document.getElementById('register-section').classList.add('hidden');
    document.getElementById('login-section').classList.remove('hidden');
}

function showModal() {
    const modal = document.getElementById('edit-modal');
    modal.classList.remove('hidden');
    modal.style.display = 'block';
}

function hideModal() {
    const modal = document.getElementById('edit-modal');
    modal.classList.add('hidden');
    modal.style.display = 'none';
}

document.querySelector('.close').onclick = hideModal;
window.onclick = function(event) {
    const modal = document.getElementById('edit-modal');
    if (event.target == modal) {
        hideModal();
    }
}

// Function to logout user
function logout() {
    currentUser = null; // Clear current user session
    document.getElementById('password-section').classList.add('hidden');
    document.getElementById('login-section').classList.remove('hidden');
}
