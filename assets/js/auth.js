/**
 * School Management System - Authentication Module
 * Handles login, signup, user roles, permissions and session management
 */

const USER_ROLES = {
    ADMIN: 'admin',
    TEACHER: 'teacher',
    STUDENT: 'student'
};

let currentUser = null;

// Initialize auth system
function initAuth() {
    // Check for existing session
    const savedSession = localStorage.getItem(`${SMS_CONFIG.storagePrefix}session`);
    if (savedSession) {
        currentUser = JSON.parse(savedSession);
        applyUserPermissions();
    } else {
        showLoginScreen();
    }
}

function showLoginScreen() {
    document.body.innerHTML = `
    <div class="min-vh-100 d-flex align-items-center justify-content-center bg-gradient">
        <div class="card auth-card shadow-lg" style="width: 420px;">
            <div class="card-body p-4">
                <div class="text-center mb-4">
                    <i class="bi bi-building text-primary" style="font-size: 3rem;"></i>
                    <h3 class="mt-2">School Management System</h3>
                    <p class="text-muted">Sign in to your account</p>
                </div>
                
                <ul class="nav nav-pills nav-justified mb-4" id="authTab" role="tablist">
                    <li class="nav-item" role="presentation">
                        <button class="nav-link active" id="login-tab" data-bs-toggle="pill" data-bs-target="#login" type="button" role="tab">Login</button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link" id="signup-tab" data-bs-toggle="pill" data-bs-target="#signup" type="button" role="tab">Sign Up</button>
                    </li>
                </ul>
                
                <div class="tab-content" id="authTabContent">
                    <!-- Login Form -->
                    <div class="tab-pane fade show active" id="login" role="tabpanel">
                        <form id="loginForm">
                            <div class="mb-3">
                                <label class="form-label">User ID</label>
                                <input type="text" class="form-control form-control-lg" id="login-userid" required placeholder="Enter your ID">
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Password</label>
                                <input type="password" class="form-control form-control-lg" id="login-password" required placeholder="Enter your password">
                            </div>
                            <div class="mb-3">
                                <label class="form-label">User Type</label>
                                <select class="form-select form-select-lg" id="login-role" required>
                                    <option value="">Select Account Type</option>
                                    <option value="admin">Administrator</option>
                                    <option value="teacher">Teacher</option>
                                    <option value="student">Student</option>
                                </select>
                            </div>
                            <button type="submit" class="btn btn-primary btn-lg w-100">
                                <i class="bi bi-box-arrow-in-right"></i> Sign In
                            </button>
                        </form>
                    </div>
                    
                    <!-- Signup Form -->
                    <div class="tab-pane fade" id="signup" role="tabpanel">
                        <form id="signupForm">
                            <div class="mb-3">
                                <label class="form-label">Full Name</label>
                                <input type="text" class="form-control" id="signup-name" required placeholder="Enter your full name">
                            </div>
                            <div class="mb-3">
                                <label class="form-label">User ID</label>
                                <input type="text" class="form-control" id="signup-userid" required placeholder="Create your user ID">
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Password</label>
                                <input type="password" class="form-control" id="signup-password" required placeholder="Create password">
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Confirm Password</label>
                                <input type="password" class="form-control" id="signup-confirm" required placeholder="Confirm password">
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Account Type</label>
                                <select class="form-select" id="signup-role" required>
                                    <option value="">Select Account Type</option>
                                    <option value="admin">Administrator</option>
                                    <option value="teacher">Teacher</option>
                                    <option value="student">Student</option>
                                </select>
                            </div>
                            <button type="submit" class="btn btn-success btn-lg w-100">
                                <i class="bi bi-person-plus"></i> Create Account
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;
    
    // Bind form events
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('signupForm').addEventListener('submit', handleSignup);
}

async function handleLogin(e) {
    e.preventDefault();
    
    const userId = document.getElementById('login-userid').value.trim();
    const password = document.getElementById('login-password').value;
    const role = document.getElementById('login-role').value;

    console.log('🔑 LOGIN ATTEMPT:', userId, role);

    // Try cloud first, fallback to local
    let users = [];
    
    try {
        console.log('📡 Loading users from cloud...');
        users = await db.get('users') || [];
        console.log('✅ Users loaded from cloud:', users.length);
    } catch (err) {
        console.warn('⚠️ Cloud failed, using local storage');
        users = storage.get('users') || [];
    }

    console.log('📋 All users found:', users);

    // ✅ DEFAULT ADMIN ACCOUNT FALLBACK
    if (userId === 'Master1' && password === 'admin123' && role === 'admin') {
        console.log('✅ USING DEFAULT ADMIN ACCOUNT');
        const defaultAdmin = {
            id: 'admin_1',
            name: 'System Administrator',
            userId: 'Master1',
            password: 'admin123',
            role: 'admin'
        };
        
        // Auto create admin user if not exists
        try {
            await db.add('users', defaultAdmin);
        } catch(e) {}
        
        currentUser = defaultAdmin;
        localStorage.setItem(`${SMS_CONFIG.storagePrefix}session`, JSON.stringify(defaultAdmin));
        showNotification(`Welcome back ${defaultAdmin.name}!`, 'success');
        setTimeout(() => location.reload(), 500);
        return;
    }

    for (let i = 0; i < users.length; i++) {
        const u = users[i];
        console.log(`👤 Checking user ${i}:`, u.userId, u.role);
        
        if (String(u.userId).trim().toLowerCase() === String(userId).trim().toLowerCase() && 
            String(u.password) === String(password) && 
            String(u.role).toLowerCase() === String(role).toLowerCase()) {
            
            console.log('✅ LOGIN SUCCESSFUL!');
            currentUser = u;
            localStorage.setItem(`${SMS_CONFIG.storagePrefix}session`, JSON.stringify(u));
            showNotification(`Welcome back ${u.name}!`, 'success');
            
            setTimeout(() => location.reload(), 500);
            return;
        }
    }

    console.error('❌ NO MATCHING USER FOUND');
    showNotification('Invalid credentials. Please try again.', 'danger');
}

async function handleSignup(e) {
    e.preventDefault();
    
    const name = document.getElementById('signup-name').value.trim();
    const userId = document.getElementById('signup-userid').value.trim();
    const password = document.getElementById('signup-password').value;
    const confirm = document.getElementById('signup-confirm').value;
    const role = document.getElementById('signup-role').value;
    
    // For STUDENT accounts - verify that student ID exists in admissions
    if (role === USER_ROLES.STUDENT) {
        let students;
        try {
            students = await db.get('students') || [];
        } catch {
            students = storage.get('students') || [];
        }

        const validStudent = students.find(s => s.id === userId || s.id.startsWith(userId) || s.id.slice(0,8) === userId);
        
        if (!validStudent) {
            showNotification('⚠️ Invalid Student ID! This ID was not found in registered students. Contact school administration.', 'danger');
            return;
        }
    }
    
    if (password !== confirm) {
        showNotification('Passwords do not match', 'danger');
        return;
    }

    let users;
    try {
        users = await db.get('users') || [];
    } catch {
        users = storage.get('users') || [];
    }
    
    if (users.find(u => u.userId === userId)) {
        showNotification('User ID already exists', 'danger');
        return;
    }
    
    const newUser = {
        id: generateId(),
        name,
        userId,
        password,
        role,
        createdAt: new Date().toISOString()
    };

    try {
        // ✅ Force save to cloud database first
        const savedUser = await db.add('users', newUser);
        console.log('✅ User created successfully in cloud:', savedUser);
    } catch (e) {
        console.log('⚠️ Cloud save failed, saving locally:', e);
        users.push(newUser);
        storage.set('users', users);
    }
    
    // ✅ Auto login user immediately after signup
    currentUser = newUser;
    localStorage.setItem(`${SMS_CONFIG.storagePrefix}session`, JSON.stringify(newUser));
    
    showNotification(`Welcome ${newUser.name}! Your account has been created.`, 'success');
    
    // ✅ Reload to login automatically
    setTimeout(() => location.reload(), 1000);
}

function logout() {
    currentUser = null;
    localStorage.removeItem(`${SMS_CONFIG.storagePrefix}session`);
    location.reload();
}

function applyUserPermissions() {
    if (!currentUser) return;
    
    // Add user info to navbar
    const navbar = document.querySelector('.navbar-nav');
    const userNav = document.createElement('li');
    userNav.className = 'nav-item ms-3';
    userNav.innerHTML = `
        <span class="nav-link d-flex align-items-center gap-2">
            <span class="badge bg-light text-dark">${currentUser.role.toUpperCase()}</span>
            ${currentUser.name}
            <button class="btn btn-sm btn-outline-light ms-2" onclick="logout()">
                <i class="bi bi-box-arrow-right"></i> Logout
            </button>
        </span>
    `;
    navbar.appendChild(userNav);
    
    // Hide sections based on user role
    if (currentUser.role === USER_ROLES.STUDENT) {
        // Students can only see their own data
        document.querySelectorAll('.nav-link[data-section]').forEach(link => {
            const section = link.getAttribute('data-section');
            if (section !== 'dashboard' && section !== 'students' && section !== 'fees') {
                link.style.display = 'none';
            }
        });
        
        // Modify students section to show only current student
        document.querySelector('#students .btn').style.display = 'none';
        
        // Filter student view
        const originalLoadStudents = loadStudentsTable;
        loadStudentsTable = function() {
            const students = storage.get('students') || [];
            const classes = storage.get('classes') || [];
            const tbody = document.querySelector('#students-table tbody');
            tbody.innerHTML = '';
            
    // Find current student record by matching exact Student ID
    const student = students.find(s => s.id === currentUser.userId || s.id.startsWith(currentUser.userId) || s.id.slice(0,8) === currentUser.userId);
            
            if (student) {
                const studentClass = classes.find(c => c.id === student.classId);
                const className = studentClass ? studentClass.name : 'Not Assigned';
                
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${student.id.slice(0, 8)}</td>
                    <td>
                        <div class="d-flex align-items-center gap-2">
                            ${student.photo ? `<img src="${student.photo}" class="avatar-circle">` : `<div class="avatar-circle bg-secondary d-flex align-items-center justify-content-center text-white">${student.name.charAt(0)}</div>`}
                            ${student.name}
                        </div>
                    </td>
                    <td>${className}</td>
                    <td>${student.gender || '-'}</td>
                    <td>${student.contact || '-'}</td>
                    <td>
                        <div class="d-flex gap-1">
                            <button class="btn btn-sm btn-outline-info" onclick="openStudentModal('${student.id}')">
                                <i class="bi bi-eye"></i> View
                            </button>
                        </div>
                    </td>
                `;
                tbody.appendChild(row);
            }
        };
        
    // Filter fees to show only student's own fees
    const originalLoadFees = loadFeesRecords;
    loadFeesRecords = function() {
        const fees = storage.get('fees') || [];
        const tbody = document.querySelector('#fees-table tbody');
        tbody.innerHTML = '';
        
        const studentFees = fees.filter(f => f.studentId === currentUser.userId || f.studentId.startsWith(currentUser.userId));
            
            studentFees.forEach(record => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${record.receiptNumber}</td>
                    <td>${record.studentName}</td>
                    <td>${record.term}</td>
                    <td>GH₵ ${record.totalAmount.toFixed(2)}</td>
                    <td>GH₵ ${record.amountPaid.toFixed(2)}</td>
                    <td class="text-${record.balance > 0 ? 'danger' : 'success'}">GH₵ ${record.balance.toFixed(2)}</td>
                    <td><span class="badge bg-${record.status === 'Fully Paid' ? 'success' : 'warning'}">${record.status}</span></td>
                    <td>${formatDate(record.date)}</td>
                    <td>
                        <button class="btn btn-sm btn-outline-info" onclick="showReceipt('${record.id}')">
                            <i class="bi bi-receipt"></i>
                        </button>
                    </td>
                `;
                tbody.appendChild(row);
            });
        };
    }
    
    if (currentUser.role === USER_ROLES.TEACHER) {
        // Teachers can see everything except admin functions
        document.querySelector('.nav-link[data-section="fees"]').style.display = 'none';
    }
    
    // Admins have full access to everything
}

// Initialize auth on page load
document.addEventListener('DOMContentLoaded', initAuth);

// ✅ AUTO MIGRATE EXISTING LOCAL USERS TO CLOUD DATABASE
document.addEventListener('DOMContentLoaded', async () => {
    setTimeout(async () => {
        const localUsers = storage.get('users') || [];
        
        if (localUsers.length > 0 && window.db && window.db.isOnline) {
            console.log('🔄 Migrating existing users to cloud database:', localUsers.length);
            
            for (const user of localUsers) {
                try {
                    await db.add('users', user);
                    console.log('✅ User account migrated to cloud:', user.userId);
                } catch (e) {
                    console.log('ℹ️ User already exists in cloud:', user.userId);
                }
            }
        }
    }, 3000);
});
