/**
 * School Management System - Navigation Handler
 * Manages section navigation, menu activation, and section visibility
 */

class Navigation {
    constructor() {
        this.init();
    }

    init() {
        this.bindNavigationEvents();
        this.setDefaultSection();
    }

    bindNavigationEvents() {
        // Navigation links click handler
        document.querySelectorAll('.navbar-nav .nav-link[data-section]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.getAttribute('data-section');
                this.navigateTo(section);
            });
        });
    }

    navigateTo(sectionId) {
        // Hide all sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });

        // Show target section
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
        }

        // Update active nav link
        document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === sectionId) {
                link.classList.add('active');
            }
        });

        // Trigger section specific load functions
        this.loadSectionData(sectionId);
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    loadSectionData(sectionId) {
        switch(sectionId) {
            case 'dashboard':
                loadDashboardStats();
                break;
            case 'students':
                loadStudentsTable();
                break;
            case 'teachers':
                loadTeachersTable();
                break;
            case 'classes':
                loadClassesTable();
                break;
            case 'attendance':
                loadAttendanceClasses();
                break;
            case 'grades':
                loadGradesData();
                break;
            case 'fees':
                loadFeesRecords();
                break;
        }
    }

    setDefaultSection() {
        // Check for hash in URL
        const hash = window.location.hash.substring(1);
        if (hash && document.getElementById(hash)) {
            this.navigateTo(hash);
        } else {
            this.navigateTo('dashboard');
        }
    }
}

// Initialize navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Navigation();
});