let users = JSON.parse(localStorage.getItem("users")) || [];

let currentUser =
    localStorage.getItem("currentUser");

let isSignupMode = false;
let confirmationResult = null;
document.addEventListener(
    "DOMContentLoaded",
    function () {

        let savedMode =
            localStorage.getItem("mode");

        let icon =
            document.getElementById("modeIcon");

        if (savedMode === "dark") {

            document.body.classList.add("dark");

            icon.innerText = "🌙";
        }

        else {

            icon.innerText = "☀️";
        }

        if (currentUser) {

            showApp();
        }
    }
);
let toggle = document.getElementById("modeToggle");
let icon = document.getElementById("modeIcon");



function toggleMode() {
    let body = document.body;
    let icon = document.getElementById("modeIcon");

    body.classList.toggle("dark");

    let isDark = body.classList.contains("dark");

    localStorage.setItem("mode", isDark ? "dark" : "light");

    // emoji change
    // ✅ emoji correct mapping
    if (isDark) {
        icon.innerText = "🌙"; // dark mode
    } else {
        icon.innerText = "☀️"; // light mode
    }
}



// 🔐 SIGNUP
function signup() {

    if (!isSignupMode) {

        document.getElementById("phone")
            .style.display = "block";

        isSignupMode = true;

        return;
    }
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;


    let phone =
    document.getElementById("phone").value.trim();

if (
    username === "" ||
    password === "" ||
    phone === ""
) {
    showMsg("Fill all fields");
    return;
}

    let exists = users.find(u => u.username === username);
    if (exists) {
        showMsg("User already exists ❌");
        return;
    }

    users.push({
        username, password,
        phone: document.getElementById("phone").value.trim()
    });
    localStorage.setItem("users", JSON.stringify(users));

    showMsg("Signup success ✅");
}

// 🔐 LOGIN

function login() {
    document.getElementById("phone")
        .style.display = "none";

    isSignupMode = false;
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    let user = users.find(u => u.username === username && u.password === password);

    if (user) {

        localStorage.setItem("currentUser", username);

        showLoader(() => {

            showApp();

        });

    } else {

        showMsg("Invalid login ❌");
    }
}

// 🚪 LOGOUT
function logout() {

    let confirmLogout =
        confirm("Are you sure you want to logout?");

    if (!confirmLogout) {

        return;
    }

    showLoader(() => {

        localStorage.removeItem(
            "currentUser"
        );

        location.reload();

    });
}

// UI switch
function showApp() {
    document.getElementById("loginPage").style.display = "none";
    document.getElementById("appPage").style.display = "block";
    loadData();
    updateDashboard();
}

// 💾 USER-WISE DATA
function getUserData() {

    return JSON.parse(localStorage.getItem(currentUser)) || [];
}

function saveUserData(data) {

    localStorage.setItem(currentUser, JSON.stringify(data));
}

// ➕ ADD
function addEntry() {
    let name = document.getElementById("name").value;
    let amount =
        parseInt(document.getElementById("amount").value);
    let type = document.getElementById("type").value;

    if (name === "") {

        alert("Enter Name ❌");

        return;
    }

    if (isNaN(amount) || amount <= 0) {

        alert("Enter valid amount ❌");

        return;
    }

    let data = getUserData();
    if (editIndex > -1) {

        data[editIndex].name = name;

        data[editIndex].amount = amount;

        data[editIndex].type = type;

        editIndex = -1;
    }

    /* ➕ ADD NEW */

    else {

        let now = new Date();

        let date =
            now.toLocaleDateString();

        let time =
            now.toLocaleTimeString();

        data.push({

            name,
            amount,
            type,
            settled: 0,
            date,
            time
        });
    }

    saveUserData(data);

    document.getElementById("name").value = "";

    document.getElementById("amount").value = "";

    loadData();

    updateDashboard();
}

// 📄 DISPLAY
function loadData() {

    let list =
        document.getElementById("list");

    list.innerHTML = "";

    let data = getUserData();

    let tableSection =
        document.getElementById(
            "tableSection"
        );

    if (data.length === 0) {

        tableSection.style.display = "none";

    } else {

        tableSection.style.display = "block";
    }

    data.forEach((item, index) => {

        let symbol =
            item.type === "borrow"
                ? "❌"
                : "❌";

        let tr =
            document.createElement("tr");

        tr.innerHTML = `

        <td class="${item.type === "borrow"
                ? "borrow-tag"
                : "lend-tag"
            }">
    ${item.type === "borrow"
                ? "B"
                : "L"
            }
</td>

<td>${item.name}</td>

<td>₹${item.amount}</td>

<td class="balance-cell">

    ₹${item.amount - (item.settled || 0)}

</td>

<td class="action-buttons">

    <button
        onclick="editEntry(${index})">

        ✏️

    </button>

    <button
        onclick="settleAmount(${index})">

        💸

    </button>

    <button
        onclick="deleteEntry(${index})">

        🗑️

    </button>

</td>

`;

        list.appendChild(tr);
    });

    updateDashboard();
}


let editIndex = -1;

function editEntry(index) {

    let data = getUserData();

    document.getElementById("name").value =
        data[index].name;

    document.getElementById("amount").value =
        data[index].amount;

    document.getElementById("type").value =
        data[index].type;

    editIndex = index;
}

function saveEdit(index) {

    let data = getUserData();

    data[index].name =
        document.getElementById(`editName${index}`).value;

    data[index].amount =
        document.getElementById(`editAmount${index}`).value;

    data[index].type =
        document.getElementById(`editType${index}`).value;

    saveUserData(data);

    loadData();
}




// ❌ DELETE
function deleteEntry(index) {
    let data = getUserData();
    data.splice(index, 1);
    saveUserData(data);
    loadData();
    updateDashboard();
}

// message
function showMsg(msg) {
    document.getElementById("msg").innerText = msg;
}

function updateDashboard() {

    let data = getUserData();

    let borrowCount = 0;
    let lendCount = 0;

    let totalBorrow = 0;
    let totalLent = 0;

    data.forEach(item => {

        let amount =
            Number(item.amount) - Number(item.settled || 0);

        if (item.type === "borrow") {

            borrowCount++;
            totalBorrow += amount;

        } else if (item.type === "lend") {

            lendCount++;
            totalLent += amount;
        }
    });


    document.getElementById("dashboard").innerHTML = `

        <div class="card">

            <h3>Borrow</h3>

            <p>
                Count : ${borrowCount}
            </p>

            <p>
                Total : ₹${totalBorrow}
            </p>

        </div>

        <div class="card">

            <h3>Lend</h3>

            <p>
                Count : ${lendCount}
            </p>

            <p>
                Total : ₹${totalLent}
            </p>

        </div>
    `;
}
async function forgotPassword() {

    let username = prompt("Enter Username");

    if (!username) return;

    let users =
        JSON.parse(localStorage.getItem("users")) || [];

    let user =
        users.find(u => u.username === username);

    if (!user) {

        alert("User not found ❌");
        return;
    }

    try {

        window.recaptchaVerifier =
            new RecaptchaVerifier(
                auth,
                "recaptcha-container",
                {}
            );

        confirmationResult =
            await signInWithPhoneNumber(
                auth,
                user.phone,
                window.recaptchaVerifier
            );

        let otp =
            prompt("Enter OTP");

        await confirmationResult.confirm(otp);

        let newPassword =
            prompt("Enter New Password");

        user.password = newPassword;

        localStorage.setItem(
            "users",
            JSON.stringify(users)
        );

        alert(
            "Password changed successfully ✅"
        );

    } catch (error) {

        console.error(error);

        alert(
            "OTP verification failed ❌"
        );
    }
}
function handleEnter(event) {

    if (event.key === "Enter") {

        addEntry();
    }
}
function settleAmount(index) {

    let data = getUserData();

    let pay =
        parseInt(
            prompt("Enter settled amount")
        );

    if (isNaN(pay) || pay <= 0) {

        alert("Invalid amount ❌");

        return;
    }

    let balance =

        Number(data[index].amount)

        - Number(data[index].settled || 0);

    if (pay > balance) {

        alert(
            "More than balance amount ❌"
        );

        return;
    }
    data[index].settled =

        Number(data[index].settled || 0)

        + Number(pay);

    /* ✅ FULLY SETTLED */

    if (
        data[index].settled >=
        Number(data[index].amount)
    ) {

        data.splice(index, 1);

        alert(
            "Entry Settled Successfully ✅"
        );

    } else {

        saveUserData(data);
    }



    saveUserData(data);

    loadData();

    updateDashboard();
}
function showLoader(callback) {

    document.getElementById(
        "loader"
    ).style.display = "flex";

    setTimeout(() => {

        document.getElementById(
            "loader"
        ).style.display = "none";

        callback();

    }, 2000);
}

function showSignup() {

    document.getElementById("phone")
        .style.display = "block";

    signup();
}

function showLogin() {

    document.getElementById("phone")
        .style.display = "none";

    login();
}
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

window.auth = auth;
window.RecaptchaVerifier = RecaptchaVerifier;
window.signInWithPhoneNumber = signInWithPhoneNumber;

