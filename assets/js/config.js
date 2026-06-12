/**
 * School Management System - Configuration File
 * Application settings, constants, and global configurations
 */

const SMS_CONFIG = {
    appName: 'School Management System',
    appVersion: '1.0.0',
    storagePrefix: 'sms_',

    // Supabase Cloud Database Configuration
    // Add your credentials here to enable multi-user sync
    supabase: {
        url: 'https://cuzxjlxttxghiepudfbz.supabase.co',
        apiKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1enhqbHh0dHhnaGllcHVkZmJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEyNTE3NzcsImV4cCI6MjA5NjgyNzc3N30.rdRQN7l76QT2eHJqsKdi7s43IRyt_jh0QFVkUd7PBz8'
    },
    
    // Default data
    defaults: {
        attendanceRate: 92,
        dateFormat: 'YYYY-MM-DD'
    },
    
    // Application messages
    messages: {
        saveSuccess: 'Record saved successfully',
        deleteConfirm: 'Are you sure you want to delete this record?',
        deleteSuccess: 'Record deleted successfully',
        error: 'An error occurred. Please try again.'
    },
    
    // Grade system
    grades: {
        'A+': { min: 90, max: 100, point: 4.0 },
        'A':  { min: 80, max: 89,  point: 3.6 },
        'B+': { min: 75, max: 79,  point: 3.2 },
        'B':  { min: 70, max: 74,  point: 2.8 },
        'C+': { min: 65, max: 69,  point: 2.4 },
        'C':  { min: 60, max: 64,  point: 2.0 },
        'D':  { min: 50, max: 59,  point: 1.0 },
        'F':  { min: 0,  max: 49,  point: 0.0 }
    },

    // Months list
    months: ['January', 'February', 'March', 'April', 'May', 'June', 
             'July', 'August', 'September', 'October', 'November', 'December']
};

// Global helper functions
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function formatDate(date) {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}

function showNotification(message, type = 'success') {
    // Create toast notification
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-white bg-${type} border-0 position-fixed bottom-0 end-0 m-3`;
    toast.style.zIndex = '9999';
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">${message}</div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;
    document.body.appendChild(toast);
    
    const bsToast = new bootstrap.Toast(toast, { autohide: true, delay: 3000 });
    bsToast.show();
    
    toast.addEventListener('hidden.bs.toast', () => toast.remove());
}