/**
 * School Management System - Main Application Entry
 * Application initialization, global event handlers, and core functions
 */

// Application entry point
document.addEventListener('DOMContentLoaded', () => {
    console.log(`${SMS_CONFIG.appName} v${SMS_CONFIG.appVersion} initialized successfully`);
    
    // Set today's date in attendance field
    const today = new Date().toISOString().split('T')[0];
    const attendanceDate = document.getElementById('attendance-date');
    if (attendanceDate) {
        attendanceDate.value = today;
    }
    
    // Initialize all module data loaders only after login, when DOM exists
    if (document.querySelector('.content-section.active')) {
        loadStudentsTable();
        loadTeachersTable();
        loadClassesTable();
        loadAttendanceClasses();
        loadGradesData();
        loadDashboardStats();
        loadFeesRecords();
    }
});

// Global functions referenced from other modules
function loadAttendance() {
    // Placeholder for attendance loading implementation
    console.log('Loading attendance data...');
    showNotification('Attendance module loaded', 'info');
}

function loadAttendanceClasses() {
    // Load classes into attendance filter dropdown
    const classes = storage.get('classes') || [];
    const classSelect = document.getElementById('attendance-class-filter');
    
    if (classSelect) {
        classSelect.innerHTML = '<option value="">Select Class</option>';
        classes.forEach(cls => {
            classSelect.innerHTML += `<option value="${cls.id}">${cls.name}</option>`;
        });
    }
}

function loadGradesData() {
    // Placeholder for grades module initialization
    console.log('Grades module initialized');
}

// Global error handler
window.onerror = function(message, source, lineno, colno, error) {
    console.error('Application Error:', { message, source, lineno, colno, error });
    showNotification('An unexpected error occurred', 'danger');
    return false;
};

// Enable tooltips globally
document.addEventListener('DOMContentLoaded', () => {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
});