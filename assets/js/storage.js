/**
 * School Management System - Local Storage Manager
 * Handles all data persistence operations using localStorage
 */

class StorageManager {
    constructor() {
        this.prefix = SMS_CONFIG.storagePrefix;
        this.initDefaults();
    }

    initDefaults() {
        // Initialize empty collections if they don't exist
        const defaultCollections = ['students', 'teachers', 'classes', 'attendance', 'grades'];
        
        defaultCollections.forEach(collection => {
            if (!this.get(collection)) {
                this.set(collection, []);
            }
        });
    }

    getKey(collection) {
        return `${this.prefix}${collection}`;
    }

    get(collection) {
        try {
            const data = localStorage.getItem(this.getKey(collection));
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error(`Storage get error for ${collection}:`, error);
            return null;
        }
    }

    set(collection, data) {
        try {
            localStorage.setItem(this.getKey(collection), JSON.stringify(data));
            return true;
        } catch (error) {
            console.error(`Storage set error for ${collection}:`, error);
            return false;
        }
    }

    add(collection, item) {
        const data = this.get(collection) || [];
        item.id = generateId();
        item.createdAt = new Date().toISOString();
        data.push(item);
        this.set(collection, data);
        return item;
    }

    update(collection, id, updates) {
        const data = this.get(collection) || [];
        const index = data.findIndex(item => item.id === id);
        
        if (index !== -1) {
            data[index] = { ...data[index], ...updates, updatedAt: new Date().toISOString() };
            this.set(collection, data);
            return data[index];
        }
        return null;
    }

    delete(collection, id) {
        const data = this.get(collection) || [];
        const filtered = data.filter(item => item.id !== id);
        this.set(collection, filtered);
        return filtered.length !== data.length;
    }

    findById(collection, id) {
        const data = this.get(collection) || [];
        return data.find(item => item.id === id);
    }

    count(collection) {
        const data = this.get(collection) || [];
        return data.length;
    }

    clearAll() {
        Object.keys(localStorage)
            .filter(key => key.startsWith(this.prefix))
            .forEach(key => localStorage.removeItem(key));
        this.initDefaults();
    }

    exportData() {
        const data = {};
        const collections = ['students', 'teachers', 'classes', 'attendance', 'grades'];
        collections.forEach(col => data[col] = this.get(col));
        return data;
    }

    importData(data) {
        Object.keys(data).forEach(collection => {
            this.set(collection, data[collection]);
        });
    }
}

// Initialize global storage instance
const storage = new StorageManager();