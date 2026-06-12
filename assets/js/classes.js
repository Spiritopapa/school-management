/**
 * School Management System - Classes Module
 * Handles class CRUD operations, table rendering, and class management
 */

let classModal;

function openClassModal(classId = null) {
    const modalHtml = `
    <div class="modal fade" id="classModal" tabindex="-1" aria-labelledby="classModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="classModalLabel">${classId ? 'Edit Class' : 'Add New Class'}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form id="classForm">
                        <input type="hidden" id="classId" value="${classId || ''}">
                        
                        <div class="mb-3">
                            <label class="form-label">Class Name</label>
                            <input type="text" class="form-control" id="className" required placeholder="e.g. Grade 7 - A">
                        </div>
                        
                        <div class="mb-3">
                            <label class="form-label">Assigned Teacher</label>
                            <select class="form-select" id="classTeacher">
                                <option value="">Select Teacher</option>
                            </select>
                        </div>
                        
                        <div class="mb-3">
                            <label class="form-label">Class Room</label>
                            <input type="text" class="form-control" id="classRoom">
                        </div>
                        
                        <div class="mb-3">
                            <label class="form-label">Academic Year</label>
                            <input type="text" class="form-control" id="classYear">
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-primary" onclick="saveClass()">Save Class</button>
                </div>
            </div>
        </div>
    </div>
    `;
    
    document.getElementById('modals-container').innerHTML = modalHtml;
    
    // Load teachers into dropdown
    const teachers = storage.get('teachers') || [];
    const teacherSelect = document.getElementById('classTeacher');
    teachers.forEach(teacher => {
        teacherSelect.innerHTML += `<option value="${teacher.id}">${teacher.name} - ${teacher.subject}</option>`;
    });
    
    // If editing, populate form
    if (classId) {
        const classData = storage.findById('classes', classId);
        if (classData) {
            document.getElementById('className').value = classData.name || '';
            document.getElementById('classTeacher').value = classData.teacherId || '';
            document.getElementById('classRoom').value = classData.room || '';
            document.getElementById('classYear').value = classData.year || '';
        }
    }
    
    classModal = new bootstrap.Modal(document.getElementById('classModal'));
    classModal.show();
}

function saveClass() {
    const classId = document.getElementById('classId').value;
    const classData = {
        name: document.getElementById('className').value,
        teacherId: document.getElementById('classTeacher').value,
        room: document.getElementById('classRoom').value,
        year: document.getElementById('classYear').value
    };
    
    if (classId) {
        storage.update('classes', classId, classData);
        showNotification('Class updated successfully', 'success');
    } else {
        storage.add('classes', classData);
        showNotification('Class added successfully', 'success');
    }
    
    classModal.hide();
    loadClassesTable();
    loadDashboardStats();
}

function deleteClass(classId) {
    if (confirm(SMS_CONFIG.messages.deleteConfirm)) {
        storage.delete('classes', classId);
        showNotification(SMS_CONFIG.messages.deleteSuccess, 'success');
        loadClassesTable();
        loadDashboardStats();
    }
}

function loadClassesTable() {
    const tbody = document.querySelector('#classes-table tbody');
    
    // If element not found (on login page), exit silently
    if (!tbody) return;
    
    const classes = storage.get('classes') || [];
    const teachers = storage.get('teachers') || [];
    const students = storage.get('students') || [];
    
    tbody.innerHTML = '';
    
    classes.forEach(cls => {
        const classTeacher = teachers.find(t => t.id === cls.teacherId);
        const teacherName = classTeacher ? classTeacher.name : 'Not Assigned';
        const studentCount = students.filter(s => s.classId === cls.id).length;
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${cls.id.slice(0, 8)}</td>
            <td>${cls.name}</td>
            <td>${teacherName}</td>
            <td>${studentCount}</td>
            <td>
                <div class="d-flex gap-1">
                    <button class="btn btn-sm btn-outline-primary" onclick="openClassModal('${cls.id}')">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteClass('${cls.id}')">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}