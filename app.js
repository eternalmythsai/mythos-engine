document.addEventListener('DOMContentLoaded', () => {
    let data = {};
    const allElements = {
        protagonistSelect: document.getElementById('protagonist'),
        antagonistSelect: document.getElementById('antagonist'),
        settingSelect: document.getElementById('setting'),
        motiveSelect: document.getElementById('motive'),
        twistSelect: document.getElementById('twist'),
        ceoSelect: document.getElementById('ceo'),
        leaderSelect: document.getElementById('leader'),
        generateBtn: document.getElementById('generateBtn'),
        resultP: document.getElementById('result'),
        generationControls: document.getElementById('generation-controls'),
        saveBtn: document.getElementById('saveBtn'),
        exportBtn: document.getElementById('exportBtn'),
        promptOutputTextarea: document.getElementById('promptOutput'),
        copyPromptBtn: document.getElementById('copyPromptBtn'),
        artStyleSelect: document.getElementById('artStyle'),
        moodSelect: document.getElementById('mood'),
        storyTemplateDisplay: document.getElementById('story-template-display'),
        act1Textarea: document.getElementById('act1'),
        act2Textarea: document.getElementById('act2'),
        act3Textarea: document.getElementById('act3'),
        elaborateBtn: document.getElementById('elaborateBtn'),
        thumbnailIdeasContainer: document.getElementById('thumbnailIdeasContainer'),
        pollQuestionContainer: document.getElementById('pollQuestionContainer'),
        titleListTextarea: document.getElementById('titleList'),
        youtubeDescTextarea: document.getElementById('youtubeDesc'),
        hashtagsTextarea: document.getElementById('hashtags'),
        copySocialsBtn: document.getElementById('copySocialsBtn'),
        hallOfLegendsContainer: document.getElementById('savedLegendsContainer'),
        rerollProtagonist: document.getElementById('rerollProtagonist'),
        rerollAntagonist: document.getElementById('rerollAntagonist'),
        rerollSetting: document.getElementById('rerollSetting'),
        rerollMotive: document.getElementById('rerollMotive'),
        rerollTwist: document.getElementById('rerollTwist'),
        manageRosterBtn: document.getElementById('manageRosterBtn'),
        rosterModal: document.getElementById('roster-manager-modal'),
        closeModalBtn: document.querySelector('.close-btn'),
        addCharForm: document.getElementById('add-character-form'),
        addItemForm: document.getElementById('add-item-form'),
        customRosterDisplay: document.getElementById('custom-roster-display')
    };
    
    let currentSelection = {};
    let flatProtagonists = [], flatAntagonists = [], legends = [];
    let customData = { protagonists: [], antagonists: [], settings: [], motives: [], twists: [] };

    // --- DATA LOADING & INITIALIZATION ---
    function initializeApp() {
        loadCustomData();
        mergeData();
        populateAllSelects();
        setupEventListeners();
        loadSavedLegends();
    }

    fetch('database.json')
        .then(response => response.json())
        .then(jsonData => {
            data.base = jsonData;
            initializeApp();
        })
        .catch(error => console.error('Error loading database:', error));

    function loadCustomData() {
        const savedCustomData = localStorage.getItem('mythosCustomData');
        if (savedCustomData) {
            customData = JSON.parse(savedCustomData);
        }
    }

    function mergeData() {
        data.merged = JSON.parse(JSON.stringify(data.base)); // Deep copy
        
        // Merge characters
        if (customData.protagonists.length > 0) {
            const customGroup = { groupName: "Your Custom Characters", characters: customData.protagonists };
            data.merged.protagonists.push(customGroup);
        }
        if (customData.antagonists.length > 0) {
            const customGroup = { groupName: "Your Custom Characters", characters: customData.antagonists };
            data.merged.antagonists.push(customGroup);
        }
        
        // Merge flat lists
        data.merged.settings = [...new Set([...data.base.settings, ...customData.settings])];
        data.merged.motives = [...new Set([...data.base.motives, ...customData.motives])];
        data.merged.twists = [...new Set([...data.base.twists, ...customData.twists])];
    }
    
    function populateAllSelects() {
        flatProtagonists = flattenCharacterList(data.merged.protagonists);
        flatAntagonists = flattenCharacterList(data.merged.antagonists);
        populateGroupedSelect(allElements.protagonistSelect, data.merged.protagonists);
        populateGroupedSelect(allElements.antagonistSelect, data.merged.antagonists);
        populateSelect(allElements.settingSelect, data.merged.settings);
        populateSelect(allElements.motiveSelect, data.merged.motives);
        populateSelect(allElements.twistSelect, data.merged.twists);
        populateSelect(allElements.ceoSelect, data.base.ceos, true);
        populateSelect(allElements.leaderSelect, data.base.leaders, true);
        populateSelect(allElements.artStyleSelect, data.base.artStyles, false, true);
        populateSelect(allElements.moodSelect, data.base.moods, false, true);
    }
    
    // --- HELPER FUNCTIONS ---
    function populateGroupedSelect(selectElement, groupedItems) {
        selectElement.innerHTML = '<option value="random">-- Random --</option>';
        groupedItems.forEach(group => {
            if (group.characters.length === 0) return;
            const optgroup = document.createElement('optgroup');
            optgroup.label = group.groupName;
            group.characters.sort((a, b) => a.name.localeCompare(b.name)).forEach(character => {
                const option = document.createElement('option');
                option.value = character.name;
                option.textContent = character.name;
                optgroup.appendChild(option);
            });
            selectElement.appendChild(optgroup);
        });
    }
    
    function populateSelect(selectElement, items, optional = false) {
        let defaultOption = optional ? '<option value="none">-- None --</option>' : '<option value="random">-- Random --</option>';
        selectElement.innerHTML = defaultOption;
        items.sort().forEach(item => {
            const option = document.createElement('option');
            option.value = item;
            option.textContent = item;
            selectElement.appendChild(option);
        });
    }

    function flattenCharacterList(groupedList) {
        return groupedList.reduce((acc, group) => acc.concat(group.characters), []);
    }

    function getCharacterObject(name, list) {
        for (const group of list) {
            const found = group.characters.find(char => char.name === name);
            if (found) return found;
        }
        return { name: name, tags: ["custom"] }; // Fallback for custom
    }

    function getRandomItem(array) { return array[Math.floor(Math.random() * array.length)]; }
    
    function copyToClipboard(text, button) {
        navigator.clipboard.writeText(text).then(() => {
            const originalText = button.textContent;
            button.textContent = 'Copied!';
            setTimeout(() => { button.textContent = originalText; }, 2000);
        });
    }

    // --- GENERATOR FUNCTIONS ---
    function generateArtPrompt() { /* ... same as before ... */ }
    function generateStoryOutline() { /* ... same as before ... */ }
    function elaborateStory() { /* ... same as before ... */ }
    function generateThumbnailIdeas() { /* ... same as before ... */ }
    function generatePollQuestion() { /* ... same as before ... */ }
    function generateSocialMediaContent() { /* ... same as before ... */ }
    
    function updateAllOutputs() {
        if (!currentSelection.protagonist) return;
        generateArtPrompt();
        generateStoryOutline();
        generateSocialMediaContent();
        generateThumbnailIdeas();
        generatePollQuestion();
        
        document.getElementById('generation-controls').style.display = 'block';
        Array.from(document.querySelectorAll('#generated-content .module')).forEach(el => el.style.display = 'block');
        Array.from(document.getElementsByClassName('reroll-btn')).forEach(el => el.style.display = 'inline');
    }

    function generateLegend() {
        const pName = allElements.protagonistSelect.value === 'random' ? getRandomItem(flatProtagonists).name : allElements.protagonistSelect.value;
        const aName = allElements.antagonistSelect.value === 'random' ? getRandomItem(flatAntagonists).name : allElements.antagonistSelect.value;
        
        currentSelection.protagonist = getCharacterObject(pName, data.merged.protagonists);
        currentSelection.antagonist = getCharacterObject(aName, data.merged.antagonists);
        
        currentSelection.setting = allElements.settingSelect.value === 'random' ? getRandomItem(data.merged.settings) : allElements.settingSelect.value;
        currentSelection.motive = allElements.motiveSelect.value === 'random' ? getRandomItem(data.merged.motives) : allElements.motiveSelect.value;
        currentSelection.twist = allElements.twistSelect.value === 'random' ? getRandomItem(data.merged.twists) : allElements.twistSelect.value;
        currentSelection.ceo = allElements.ceoSelect.value;
        currentSelection.leader = allElements.leaderSelect.value;

        while (currentSelection.protagonist.name === currentSelection.antagonist.name) {
             currentSelection.antagonist = getRandomItem(flatAntagonists);
        }
        
        displayCurrentLegend();
        updateAllOutputs();
    }
    
    function displayCurrentLegend() { /* ... same as before ... */ }
    function reroll(component) { /* ... same as before ... */ }

    // --- LOCAL STORAGE & WORKSPACE ---
    function saveLegend() { /* ... same as before ... */ }
    function renderLegends() { /* ... same as before ... */ }
    function loadLegend(id) { /* ... same as before ... */ }
    function deleteLegend(id) { /* ... same as before ... */ }
    function exportContent() { /* ... same as before ... */ }
    
    // --- ROSTER MANAGER ---
    function showRosterManager() {
        allElements.rosterModal.style.display = 'block';
        renderCustomRoster();
    }
    
    function closeRosterManager() { allElements.rosterModal.style.display = 'none'; }
    
    function addCharacter(e) {
        e.preventDefault();
        const name = document.getElementById('char-name').value;
        const source = document.getElementById('char-source').value;
        const type = document.getElementById('char-type').value;
        const tags = document.getElementById('char-tags').value.split(',').map(tag => tag.trim());

        const newChar = { name: `${name} (${source})`, tags: tags };
        
        if (type === 'protagonist') {
            customData.protagonists.push(newChar);
        } else {
            customData.antagonists.push(newChar);
        }
        
        saveCustomDataAndReload();
        e.target.reset();
    }

    function addItem(e) {
        e.preventDefault();
        const text = document.getElementById('item-text').value;
        const type = document.getElementById('item-type').value;
        if (!customData[type].includes(text)) {
            customData[type].push(text);
        }
        saveCustomDataAndReload();
        e.target.reset();
    }

    function saveCustomDataAndReload() {
        localStorage.setItem('mythosCustomData', JSON.stringify(customData));
        mergeData();
        populateAllSelects();
        renderCustomRoster();
    }

    function renderCustomRoster() {
        allElements.customRosterDisplay.innerHTML = '';
        const allCustomItems = [
            ...customData.protagonists.map(item => ({...item, type: 'protagonists'})),
            ...customData.antagonists.map(item => ({...item, type: 'antagonists'})),
            ...customData.settings.map(item => ({name: item, type: 'settings'})),
            ...customData.motives.map(item => ({name: item, type: 'motives'})),
            ...customData.twists.map(item => ({name: item, type: 'twists'}))
        ];

        if (allCustomItems.length === 0) {
            allElements.customRosterDisplay.innerHTML = '<span>No custom entries yet.</span>';
            return;
        }

        allCustomItems.forEach((item, index) => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'custom-item';
            itemDiv.innerHTML = `<span>${item.name} <i>(${item.type})</i></span><button data-index="${index}" data-type="${item.type}">Delete</button>`;
            allElements.customRosterDisplay.appendChild(itemDiv);
        });
    }

    function deleteCustomItem(e) {
        if (e.target.tagName !== 'BUTTON') return;
        const type = e.target.dataset.type;
        const name = e.target.previousElementSibling.textContent.split(' (')[0];

        if (type === 'protagonists' || type === 'antagonists') {
            customData[type] = customData[type].filter(char => char.name !== name);
        } else {
            customData[type] = customData[type].filter(item => item !== name);
        }
        saveCustomDataAndReload();
    }

    // --- EVENT LISTENERS ---
    function setupEventListeners() {
        allElements.generateBtn.addEventListener('click', generateLegend);
        allElements.elaborateBtn.addEventListener('click', elaborateStory);
        allElements.rerollProtagonist.addEventListener('click', () => reroll('protagonist'));
        allElements.rerollAntagonist.addEventListener('click', () => reroll('antagonist'));
        allElements.rerollSetting.addEventListener('click', () => reroll('setting'));
        allElements.rerollMotive.addEventListener('click', () => reroll('motive'));
        allElements.rerollTwist.addEventListener('click', () => reroll('twist'));
        allElements.saveBtn.addEventListener('click', saveLegend);
        allElements.exportBtn.addEventListener('click', exportContent);
        allElements.manageRosterBtn.addEventListener('click', showRosterManager);
        allElements.closeModalBtn.addEventListener('click', closeRosterManager);
        window.addEventListener('click', (e) => { if (e.target == allElements.rosterModal) closeRosterManager(); });
        allElements.addCharForm.addEventListener('submit', addCharacter);
        allElements.addItemForm.addEventListener('submit', addItem);
        allElements.customRosterDisplay.addEventListener('click', deleteCustomItem);
        // ... other copy button event listeners
        allElements.copyPromptBtn.addEventListener('click', () => copyToClipboard(allElements.promptOutputTextarea.value, allElements.copyPromptBtn));
        allElements.copySocialsBtn.addEventListener('click', () => {
            const text = `TITLES:\n${allElements.titleListTextarea.value}\n\nDESCRIPTION:\n${allElements.youtubeDescTextarea.value}\n\nHASHTAGS:\n${allElements.hashtagsTextarea.value}`;
            copyToClipboard(text, allElements.copySocialsBtn);
        });
        allElements.hallOfLegendsContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('delete-legend-btn')) {
                deleteLegend(parseInt(e.target.dataset.id, 10));
            }
            if (e.target.classList.contains('load-btn')) {
                loadLegend(parseInt(e.target.dataset.id, 10));
            }
        });
    }

    function loadSavedLegends() {
        const saved = localStorage.getItem('mythosLegends');
        if (saved) {
            legends = JSON.parse(saved);
            renderLegends();
        }
    }
    
    // Fill in placeholders for brevity
    const originalGenerators = { generateArtPrompt, generateStoryOutline, elaborateStory, generateThumbnailIdeas, generatePollQuestion, generateSocialMediaContent, updateAllOutputs, generateLegend, displayCurrentLegend, reroll, saveLegend, renderLegends, loadLegend, deleteLegend, exportContent };
    Object.assign(window, originalGenerators); // Make them accessible
});
