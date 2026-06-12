/**
 * School Management System - Dashboard Module
 * Handles dashboard statistics, counters, and overview data
 */

function loadDashboardStats() {
    // Get counts from storage
    const totalStudents = storage.count('students');
    const totalTeachers = storage.count('teachers');
    const totalClasses = storage.count('classes');
    
    // Update counter elements with animation
    animateCounter('total-students', totalStudents);
    animateCounter('total-teachers', totalTeachers);
    animateCounter('total-classes', totalClasses);
    
    // Calculate attendance rate
    const attendanceRate = calculateAttendanceRate();
    document.getElementById('attendance-rate').textContent = `${attendanceRate}%`;
}

function animateCounter(elementId, targetValue) {
    const element = document.getElementById(elementId);
    const duration = 1000; // 1 second animation
    const steps = 30;
    const stepValue = targetValue / steps;
    let currentValue = 0;
    
    const interval = setInterval(() => {
        currentValue += stepValue;
        if (currentValue >= targetValue) {
            currentValue = targetValue;
            clearInterval(interval);
        }
        element.textContent = Math.floor(currentValue);
    }, duration / steps);
}

function calculateAttendanceRate() {
    const attendance = storage.get('attendance') || [];
    
    if (attendance.length === 0) {
        return SMS_CONFIG.defaults.attendanceRate;
    }
    
    let totalRecords = 0;
    let presentRecords = 0;
    
    attendance.forEach(day => {
        day.records.forEach(record => {
            totalRecords++;
            if (record.status === 'present') {
                presentRecords++;
            }
        });
    });
    
    return totalRecords > 0 ? Math.round((presentRecords / totalRecords) * 100) : 0;
}

function loadStudentPopulationStats() {
    const students = storage.get('students') || [];
    const classes = storage.get('classes') || [];
    const totalStudents = students.length;
    
    // Gender Statistics
    const maleCount = students.filter(s => s.gender === 'Male').length;
    const femaleCount = students.filter(s => s.gender === 'Female').length;
    
    const genderStatsHtml = `
        <div class="stat-item mb-4">
            <div class="stat-label">
                <span>Male Students</span>
                <span>${maleCount} / ${totalStudents}</span>
            </div>
            <div class="progress" style="height: 24px;">
                <div class="progress-bar bg-primary" style="width: 0%" data-width="${totalStudents > 0 ? (maleCount / totalStudents * 100) : 0}%">
                    ${totalStudents > 0 ? Math.round(maleCount / totalStudents * 100) : 0}%
                </div>
            </div>
        </div>
        <div class="stat-item">
            <div class="stat-label">
                <span>Female Students</span>
                <span>${femaleCount} / ${totalStudents}</span>
            </div>
            <div class="progress" style="height: 24px;">
                <div class="progress-bar bg-danger" style="width: 0%" data-width="${totalStudents > 0 ? (femaleCount / totalStudents * 100) : 0}%">
                    ${totalStudents > 0 ? Math.round(femaleCount / totalStudents * 100) : 0}%
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('gender-stats').innerHTML = genderStatsHtml;
    
    // Class Statistics
    let classStatsHtml = '';
    classes.forEach((cls, index) => {
        const classStudents = students.filter(s => s.classId === cls.id).length;
        const percentage = totalStudents > 0 ? (classStudents / totalStudents * 100) : 0;
        
        classStatsHtml += `
            <div class="stat-item mb-3">
                <div class="stat-label">
                    <span>${cls.name}</span>
                    <span>${classStudents} students</span>
                </div>
                <div class="progress" style="height: 20px;">
                    <div class="progress-bar bg-success" style="width: 0%" data-width="${percentage}%">
                        ${Math.round(percentage)}%
                    </div>
                </div>
            </div>
        `;
    });
    
    document.getElementById('class-stats').innerHTML = classStatsHtml;
    
    // Animate items with stagger effect
    setTimeout(() => {
        document.querySelectorAll('.stat-item').forEach((item, index) => {
            setTimeout(() => {
                item.classList.add('visible');
                
                // Animate progress bars
                const progressBar = item.querySelector('.progress-bar');
                if (progressBar) {
                    setTimeout(() => {
                        progressBar.style.width = progressBar.dataset.width;
                    }, 300);
                }
            }, index * 150);
        });
    }, 200);
}

function loadDashboardStats() {
    // Get counts from storage
    const totalStudents = storage.count('students');
    const totalTeachers = storage.count('teachers');
    const totalClasses = storage.count('classes');
    
    // Update counter elements with animation
    animateCounter('total-students', totalStudents);
    animateCounter('total-teachers', totalTeachers);
    animateCounter('total-classes', totalClasses);
    
    // Calculate attendance rate
    const attendanceRate = calculateAttendanceRate();
    document.getElementById('attendance-rate').textContent = `${attendanceRate}%`;
    
    // Load student population statistics
    loadStudentPopulationStats();
}

// Initialize dashboard on page load
document.addEventListener('DOMContentLoaded', () => {
    loadDashboardStats();
});
