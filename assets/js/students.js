/**
 * School Management System - Students Module
 * Handles student CRUD operations, table rendering, and student management
 */

let studentModal;

function openStudentModal(studentId = null) {
    const modalHtml = `
    <div class="modal fade" id="studentModal" tabindex="-1" aria-labelledby="studentModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="studentModalLabel">${studentId ? 'Edit Student' : 'Add New Student'}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form id="studentForm">
                        <input type="hidden" id="studentId" value="${studentId || ''}">
                        
                        <div class="mb-3">
                            <label class="form-label">First Name</label>
                            <input type="text" class="form-control" id="studentFirstName" required>
                        </div>
                        
                        <div class="mb-3">
                            <label class="form-label">Middle Name</label>
                            <input type="text" class="form-control" id="studentMiddleName">
                        </div>
                        
                        <div class="mb-3">
                            <label class="form-label">Last Name</label>
                            <input type="text" class="form-control" id="studentLastName" required>
                        </div>
                        
                        <div class="row mb-3">
                            <div class="col-md-6">
                                <label class="form-label">Gender</label>
                                <select class="form-select" id="studentGender" required>
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Date of Birth</label>
                                <input type="date" class="form-control" id="studentDob">
                            </div>
                        </div>
                        
                        <div class="mb-3">
                            <label class="form-label">Class</label>
                            <select class="form-select" id="studentClass">
                                <option value="">Select Class</option>
                            </select>
                        </div>
                        
                        <div class="mb-3">
                            <label class="form-label">Parent Contact</label>
                            <input type="text" class="form-control" id="studentContact">
                        </div>
                        
                        <div class="mb-3">
                            <label class="form-label">Address</label>
                            <textarea class="form-control" id="studentAddress" rows="2"></textarea>
                        </div>
                        
                        <div class="mb-3">
                            <label class="form-label">Date of Admission</label>
                            <input type="date" class="form-control" id="studentAdmissionDate">
                        </div>
                        
                        <div class="mb-3">
                            <label class="form-label">Parent Name</label>
                            <input type="text" class="form-control" id="studentParentName">
                        </div>
                        
                        <div class="row mb-3">
                            <div class="col-md-6">
                                <label class="form-label">House Number</label>
                                <input type="text" class="form-control" id="studentHouseNumber">
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Digital Address</label>
                                <input type="text" class="form-control" id="studentDigitalAddress">
                            </div>
                        </div>
                        
                        <div class="row mb-3">
                            <div class="col-md-6">
                                <label class="form-label">Home Town</label>
                                <input type="text" class="form-control" id="studentHomeTown">
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Religion</label>
                                <input type="text" class="form-control" id="studentReligion">
                            </div>
                        </div>
                        
                        <div class="mb-3">
                            <label class="form-label">Nationality</label>
                            <input type="text" class="form-control" id="studentNationality">
                        </div>
                        
                        <div class="mb-3">
                            <label class="form-label">Student Photo</label>
                            <input type="file" class="form-control" id="studentPhoto" accept="image/*">
                            <div id="studentPhotoPreview" class="mt-2" style="max-width: 150px;"></div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-primary" onclick="saveStudent()">Save Student</button>
                </div>
            </div>
        </div>
    </div>
    `;
    
    document.getElementById('modals-container').innerHTML = modalHtml;
    
    // Load classes from class management
    const classes = storage.get('classes') || [];
    const classSelect = document.getElementById('studentClass');
    classSelect.innerHTML = '<option value="">Select Class</option>';
    classes.forEach(cls => {
        classSelect.innerHTML += `<option value="${cls.id}">${cls.name}</option>`;
    });
    
    // If editing, populate form
    if (studentId) {
        const student = storage.findById('students', studentId);
        if (student) {
            // Handle backward compatibility for full name
            if (student.firstName) {
                document.getElementById('studentFirstName').value = student.firstName || '';
                document.getElementById('studentMiddleName').value = student.middleName || '';
                document.getElementById('studentLastName').value = student.lastName || '';
            } else {
                // Split existing full name if available
                const nameParts = (student.name || '').split(' ');
                document.getElementById('studentFirstName').value = nameParts[0] || '';
                document.getElementById('studentLastName').value = nameParts.slice(-1)[0] || '';
                document.getElementById('studentMiddleName').value = nameParts.slice(1, -1).join(' ') || '';
            }
            
            document.getElementById('studentGender').value = student.gender || '';
            document.getElementById('studentDob').value = student.dob || '';
            document.getElementById('studentClass').value = student.classId || '';
            document.getElementById('studentContact').value = student.contact || '';
            document.getElementById('studentAddress').value = student.address || '';
            document.getElementById('studentAdmissionDate').value = student.admissionDate || '';
            document.getElementById('studentParentName').value = student.parentName || '';
            document.getElementById('studentHouseNumber').value = student.houseNumber || '';
            document.getElementById('studentDigitalAddress').value = student.digitalAddress || '';
            document.getElementById('studentHomeTown').value = student.homeTown || '';
            document.getElementById('studentReligion').value = student.religion || '';
            document.getElementById('studentNationality').value = student.nationality || '';
        }
    }
    
    studentModal = new bootstrap.Modal(document.getElementById('studentModal'));
    studentModal.show();
    
    // Photo preview handler
    document.getElementById('studentPhoto').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
            document.getElementById('studentPhotoPreview').innerHTML = `
                <div class="photo-preview-container">
                    <img src="${e.target.result}" style="width: 150px; height: 150px; object-fit: cover;">
                </div>
            `;
            };
            reader.readAsDataURL(file);
        }
    });
    
    // Show existing photo if editing
    if (studentId) {
        const student = storage.findById('students', studentId);
        if (student && student.photo) {
            document.getElementById('studentPhotoPreview').innerHTML = `
                <div class="photo-preview-container">
                    <img src="${student.photo}" style="width: 150px; height: 150px; object-fit: cover;">
                </div>
            `;
        }
    }
}

function saveStudent() {
    const studentId = document.getElementById('studentId').value;
    const photoInput = document.getElementById('studentPhoto');
    const existingStudent = studentId ? storage.findById('students', studentId) : null;
    
    const firstName = document.getElementById('studentFirstName').value;
    const middleName = document.getElementById('studentMiddleName').value;
    const lastName = document.getElementById('studentLastName').value;
    const fullName = `${firstName} ${middleName ? middleName + ' ' : ''}${lastName}`.trim();
    
    const studentData = {
        firstName: firstName,
        middleName: middleName,
        lastName: lastName,
        name: fullName,
        gender: document.getElementById('studentGender').value,
        dob: document.getElementById('studentDob').value,
        classId: document.getElementById('studentClass').value,
        contact: document.getElementById('studentContact').value,
        address: document.getElementById('studentAddress').value,
        admissionDate: document.getElementById('studentAdmissionDate').value,
        parentName: document.getElementById('studentParentName').value,
        houseNumber: document.getElementById('studentHouseNumber').value,
        digitalAddress: document.getElementById('studentDigitalAddress').value,
        homeTown: document.getElementById('studentHomeTown').value,
        religion: document.getElementById('studentReligion').value,
        nationality: document.getElementById('studentNationality').value,
        photo: existingStudent ? existingStudent.photo : null
    };
    
    // Handle photo upload if selected
    if (photoInput.files && photoInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            studentData.photo = e.target.result;
            
            if (studentId) {
                storage.update('students', studentId, studentData);
                showNotification('Student updated successfully', 'success');
            } else {
                storage.add('students', studentData);
                showNotification('Student added successfully', 'success');
            }
            
            studentModal.hide();
            loadStudentsTable();
            loadDashboardStats();
        };
        reader.readAsDataURL(photoInput.files[0]);
        return;
    }
    
    if (studentId) {
        storage.update('students', studentId, studentData);
        showNotification('Student updated successfully', 'success');
    } else {
        storage.add('students', studentData);
        showNotification('Student added successfully', 'success');
    }
    
    studentModal.hide();
    loadStudentsTable();
    loadDashboardStats();
}

function deleteStudent(studentId) {
    if (confirm(SMS_CONFIG.messages.deleteConfirm)) {
        storage.delete('students', studentId);
        showNotification(SMS_CONFIG.messages.deleteSuccess, 'success');
        loadStudentsTable();
        loadDashboardStats();
    }
}

function loadStudentsTable() {
    const tbody = document.querySelector('#students-table tbody');
    
    // If element not found (on login page), exit silently
    if (!tbody) return;
    
    const students = storage.get('students') || [];
    const classes = storage.get('classes') || [];
    
    tbody.innerHTML = '';
    
    students.forEach(student => {
        const studentClass = classes.find(c => c.id === student.classId);
        const className = studentClass ? studentClass.name : 'Not Assigned';
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${student.id.slice(0, 8)}</td>
            <td>
                <div class="d-flex align-items-center gap-2">
                     ${student.photo ? `<img src="${student.photo}" class="avatar-circle" onclick="openStudentDetails('${student.id}')">` : `<div class="avatar-circle bg-secondary d-flex align-items-center justify-content-center text-white" onclick="openStudentDetails('${student.id}')">${student.name.charAt(0)}</div>`}
                    ${student.name}
                </div>
            </td>
            <td>${className}</td>
            <td>${student.gender || '-'}</td>
            <td>${student.contact || '-'}</td>
            <td>
                <div class="d-flex gap-1">
                    <button class="btn btn-sm btn-outline-primary" onclick="openStudentModal('${student.id}')">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteStudent('${student.id}')">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Student Details Sidebar Functions
function openStudentDetails(studentId) {
    const student = storage.findById('students', studentId);
    const classes = storage.get('classes') || [];
    const studentClass = classes.find(c => c.id === student.classId);
    
    if (!student) return;
    
    // Create overlay
    let overlay = document.getElementById('student-sidebar-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'student-sidebar-overlay';
        overlay.className = 'student-sidebar-overlay';
        overlay.onclick = closeStudentSidebar;
        document.body.appendChild(overlay);
    }
    
    const content = `
        <div class="student-profile-header">
            ${student.photo 
                ? `<img src="${student.photo}" class="student-profile-photo">` 
                : `<div class="student-profile-photo bg-primary d-flex align-items-center justify-content-center text-white" style="font-size: 4rem;">${student.name.charAt(0)}</div>`
            }
            <h3>${student.name}</h3>
            <p class="text-muted mb-0">Student ID: ${student.id.slice(0, 8)}</p>
        </div>
        
        <div class="student-info-item">
            <div class="student-info-label">Class</div>
            <div class="student-info-value">${studentClass ? studentClass.name : 'Not Assigned'}</div>
        </div>
        
        <div class="student-info-item">
            <div class="student-info-label">Gender</div>
            <div class="student-info-value">${student.gender || '-'}</div>
        </div>
        
        <div class="student-info-item">
            <div class="student-info-label">Date of Birth</div>
            <div class="student-info-value">${student.dob || '-'}</div>
        </div>
        
        <div class="student-info-item">
            <div class="student-info-label">Parent Contact</div>
            <div class="student-info-value">${student.contact || '-'}</div>
        </div>
        
        <div class="student-info-item">
            <div class="student-info-label">Address</div>
            <div class="student-info-value">${student.address || '-'}</div>
        </div>
        
        <div class="student-info-item">
            <div class="student-info-label">Date of Admission</div>
            <div class="student-info-value">${student.admissionDate || '-'}</div>
        </div>
        
        <div class="student-info-item">
            <div class="student-info-label">Parent Name</div>
            <div class="student-info-value">${student.parentName || '-'}</div>
        </div>
        
        <div class="student-info-item">
            <div class="student-info-label">House Number</div>
            <div class="student-info-value">${student.houseNumber || '-'}</div>
        </div>
        
        <div class="student-info-item">
            <div class="student-info-label">Digital Address</div>
            <div class="student-info-value">${student.digitalAddress || '-'}</div>
        </div>
        
        <div class="student-info-item">
            <div class="student-info-label">Home Town</div>
            <div class="student-info-value">${student.homeTown || '-'}</div>
        </div>
        
        <div class="student-info-item">
            <div class="student-info-label">Religion</div>
            <div class="student-info-value">${student.religion || '-'}</div>
        </div>
        
        <div class="student-info-item">
            <div class="student-info-label">Nationality</div>
            <div class="student-info-value">${student.nationality || '-'}</div>
        </div>
        
        <div class="mt-4 d-grid gap-2">
            <button class="btn btn-primary" onclick="openStudentModal('${student.id}'); closeStudentSidebar();">
                <i class="bi bi-pencil"></i> Edit Student
            </button>
        </div>
    `;
    
    document.getElementById('student-details-content').innerHTML = content;
    
    // Show sidebar and overlay with animation
    setTimeout(() => {
        document.getElementById('student-details-sidebar').classList.add('active');
        overlay.classList.add('active');
    }, 10);
}

function closeStudentSidebar() {
    const sidebar = document.getElementById('student-details-sidebar');
    const overlay = document.getElementById('student-sidebar-overlay');
    
    sidebar.classList.remove('active');
    if (overlay) {
        overlay.classList.remove('active');
        setTimeout(() => overlay.remove(), 400);
    }
}

// Close sidebar on Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeStudentSidebar();
    }
});
