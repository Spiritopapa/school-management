/**
 * School Management System - Teachers Module
 * Handles teacher CRUD operations, table rendering, and teacher management
 */

let teacherModal;

function openTeacherModal(teacherId = null) {
    const modalHtml = `
    <div class="modal fade" id="teacherModal" tabindex="-1" aria-labelledby="teacherModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="teacherModalLabel">${teacherId ? 'Edit Teacher' : 'Add New Teacher'}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form id="teacherForm">
                        <input type="hidden" id="teacherId" value="${teacherId || ''}">
                        
                        <div class="mb-3">
                            <label class="form-label">Full Name</label>
                            <input type="text" class="form-control" id="teacherName" required>
                        </div>
                        
                        <div class="mb-3">
                            <label class="form-label">Subject Specialization</label>
                            <input type="text" class="form-control" id="teacherSubject" required>
                        </div>
                        
                        <div class="mb-3">
                            <label class="form-label">Contact Number</label>
                            <input type="text" class="form-control" id="teacherContact">
                        </div>
                        
                        <div class="mb-3">
                            <label class="form-label">Email Address</label>
                            <input type="email" class="form-control" id="teacherEmail">
                        </div>
                        
                        <div class="mb-3">
                            <label class="form-label">Qualifications</label>
                            <textarea class="form-control" id="teacherQualifications" rows="2"></textarea>
                        </div>
                        
                        <div class="mb-3">
                            <label class="form-label">Teacher Photo</label>
                            <input type="file" class="form-control" id="teacherPhoto" accept="image/*">
                            <div id="teacherPhotoPreview" class="mt-2" style="max-width: 150px;"></div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-primary" onclick="saveTeacher()">Save Teacher</button>
                </div>
            </div>
        </div>
    </div>
    `;
    
    document.getElementById('modals-container').innerHTML = modalHtml;
    
    // If editing, populate form
    if (teacherId) {
        const teacher = storage.findById('teachers', teacherId);
        if (teacher) {
            document.getElementById('teacherName').value = teacher.name || '';
            document.getElementById('teacherSubject').value = teacher.subject || '';
            document.getElementById('teacherContact').value = teacher.contact || '';
            document.getElementById('teacherEmail').value = teacher.email || '';
            document.getElementById('teacherQualifications').value = teacher.qualifications || '';
        }
    }
    
    teacherModal = new bootstrap.Modal(document.getElementById('teacherModal'));
    teacherModal.show();
    
    // Photo preview handler
    document.getElementById('teacherPhoto').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
            document.getElementById('teacherPhotoPreview').innerHTML = `
                <div class="photo-preview-container">
                    <img src="${e.target.result}" style="width: 150px; height: 150px; object-fit: cover;">
                </div>
            `;
            };
            reader.readAsDataURL(file);
        }
    });
    
    // Show existing photo if editing
    if (teacherId) {
        const teacher = storage.findById('teachers', teacherId);
        if (teacher && teacher.photo) {
            document.getElementById('teacherPhotoPreview').innerHTML = `
                <div class="photo-preview-container">
                    <img src="${teacher.photo}" style="width: 150px; height: 150px; object-fit: cover;">
                </div>
            `;
        }
    }
}

function saveTeacher() {
    const teacherId = document.getElementById('teacherId').value;
    const photoInput = document.getElementById('teacherPhoto');
    const existingTeacher = teacherId ? storage.findById('teachers', teacherId) : null;
    
    const teacherData = {
        name: document.getElementById('teacherName').value,
        subject: document.getElementById('teacherSubject').value,
        contact: document.getElementById('teacherContact').value,
        email: document.getElementById('teacherEmail').value,
        qualifications: document.getElementById('teacherQualifications').value,
        photo: existingTeacher ? existingTeacher.photo : null
    };
    
    // Handle photo upload if selected
    if (photoInput.files && photoInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            teacherData.photo = e.target.result;
            
            if (teacherId) {
                storage.update('teachers', teacherId, teacherData);
                showNotification('Teacher updated successfully', 'success');
            } else {
                storage.add('teachers', teacherData);
                showNotification('Teacher added successfully', 'success');
            }
            
            teacherModal.hide();
            loadTeachersTable();
            loadDashboardStats();
        };
        reader.readAsDataURL(photoInput.files[0]);
        return;
    }
    
    if (teacherId) {
        storage.update('teachers', teacherId, teacherData);
        showNotification('Teacher updated successfully', 'success');
    } else {
        storage.add('teachers', teacherData);
        showNotification('Teacher added successfully', 'success');
    }
    
    teacherModal.hide();
    loadTeachersTable();
    loadDashboardStats();
}

function deleteTeacher(teacherId) {
    if (confirm(SMS_CONFIG.messages.deleteConfirm)) {
        storage.delete('teachers', teacherId);
        showNotification(SMS_CONFIG.messages.deleteSuccess, 'success');
        loadTeachersTable();
        loadDashboardStats();
    }
}

function loadTeachersTable() {
    const tbody = document.querySelector('#teachers-table tbody');
    
    // If element not found (on login page), exit silently
    if (!tbody) return;
    
    const teachers = storage.get('teachers') || [];
    
    tbody.innerHTML = '';
    
    teachers.forEach(teacher => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${teacher.id.slice(0, 8)}</td>
            <td>
                <div class="d-flex align-items-center gap-2">
                    ${teacher.photo ? `<img src="${teacher.photo}" class="avatar-circle">` : `<div class="avatar-circle bg-secondary d-flex align-items-center justify-content-center text-white">${teacher.name.charAt(0)}</div>`}
                    ${teacher.name}
                </div>
            </td>
            <td>${teacher.subject}</td>
            <td>${teacher.contact || '-'}</td>
            <td>
                <div class="d-flex gap-1">
                    <button class="btn btn-sm btn-outline-primary" onclick="openTeacherModal('${teacher.id}')">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteTeacher('${teacher.id}')">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}