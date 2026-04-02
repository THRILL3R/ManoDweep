// State Management using localStorage
const GardenState = {
    getKey: (key) => `garden_app_${key}`,

    load: function(key, defaultValue) {
        try {
            const item = localStorage.getItem(this.getKey(key));
            if (item === null) return defaultValue;
            return JSON.parse(item);
        } catch (e) {
            console.error("Error loading state", e);
            return defaultValue;
        }
    },

    save: function(key, value) {
        try {
            localStorage.setItem(this.getKey(key), JSON.stringify(value));
        } catch (e) {
            console.error("Error saving state", e);
        }
    },

    // Specific Getters & Setters
    getGratitude: function() {
        return this.load('gratitude', [{name:'', note:''}, {name:'', note:''}, {name:'', note:''}]);
    },
    saveGratitude: function(data) {
        this.save('gratitude', data);
    },

    getIntentions: function() {
        return this.load('intentions', [false, false, false]);
    },
    saveIntentions: function(data) {
        this.save('intentions', data);
    },

    getGoals: function() {
        // 6 categories, 3 inputs each. Structure: { personal: [ {text:'', checked:false}, ... ], ... }
        const defaultGoals = {
            personal: Array(3).fill({text:'', checked:false}),
            social: Array(3).fill({text:'', checked:false}),
            wellness: Array(3).fill({text:'', checked:false}),
            work: Array(3).fill({text:'', checked:false}),
            study: Array(3).fill({text:'', checked:false}),
            hobbies: Array(3).fill({text:'', checked:false}),
        };
        return this.load('goals', defaultGoals);
    },
    saveGoals: function(data) {
        this.save('goals', data);
    },

    getSelectedCups: function() {
        return this.load('cups', []);
    },
    saveSelectedCups: function(data) {
        this.save('cups', data);
    },

    getSeedCount: function() {
        return this.load('seeds', 0);
    },
    addSeeds: function(amount) {
        const current = this.getSeedCount();
        this.save('seeds', current + amount);
        return current + amount;
    }
};
