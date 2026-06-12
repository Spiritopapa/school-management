/**
 * School Management System - Search Filter Module
 * Search and filter functionality for students and dashboard
 */

function filterStudents() {
    const searchTerm = document.getElementById('student-search').value.toLowerCase();
    const students = storage.get('students') || [];
    const classes = storage.get('classes') || [];
    const tbody = document.querySelector('#students-table tbody');
    
    tbody.innerHTML = '';
    
    const filteredStudents = students.filter(student => {
        const matchesName = student.name.toLowerCase().includes(searchTerm);
        const matchesId = student.id.toLowerCase().includes(searchTerm);
        const matchesShortId = student.id.slice(0, 8).toLowerCase().includes(searchTerm);
        
        return matchesName || matchesId || matchesShortId;
    });
    
    filteredStudents.forEach(student => {
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

// Global search function for dashboard
function globalSearch(searchTerm) {
    searchTerm = searchTerm.toLowerCase();
    
    const results = {
        students: [],
        teachers: [],
        classes: []
    };
    
    // Search students
    const students = storage.get('students') || [];
    results.students = students.filter(s => 
        s.name.toLowerCase().includes(searchTerm) || 
        s.id.includes(searchTerm)
    );
    
    // Search teachers
    const teachers = storage.get('teachers') || [];
    results.teachers = teachers.filter(t => 
        t.name.toLowerCase().includes(searchTerm) || 
        t.id.includes(searchTerm)
    );
    
    // Search classes
    const classes = storage.get('classes') || [];
    results.classes = classes.filter(c => 
        c.name.toLowerCase().includes(searchTerm)
    );
    
    return results;
}