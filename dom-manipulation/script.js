let quotes = [];

// DOM Elements
const quoteDisplay = document.getElementById('quoteDisplay');
const quoteText = document.getElementById('quoteText');
const quoteCategory = document.getElementById('quoteCategory');
const newQuoteButton = document.getElementById('newQuote');
const newQuoteTextInput = document.getElementById('newQuoteText');
const newQuoteCategoryInput = document.getElementById('newQuoteCategory');
const addQuoteButton = document.getElementById('addQuoteBtn');
const messageBox = document.getElementById('messageBox');
const quotesContainer = document.getElementById('quotesContainer');
const exportQuotesButton = document.getElementById('exportQuotesBtn');
const importFileInput = document.getElementById('importFile');
const lastViewedQuoteSpan = document.getElementById('lastViewedQuote');
const categoryFilter = document.getElementById('categoryFilter');
const syncNowButton = document.getElementById('syncNowBtn');
const syncStatus = document.getElementById('syncStatus');
const conflictNotification = document.getElementById('conflictNotification');
const conflictMessage = document.getElementById('conflictMessage');
const resolveConflictButton = document.getElementById('resolveConflictBtn');
const updateNotification = document.getElementById('updateNotification');
const updateMessage = document.getElementById('updateMessage');
const dismissUpdateButton = document.getElementById('dismissUpdateBtn');

// Helper to show general messages
function showMessage(message, type = 'info') {
    messageBox.textContent = message;
    messageBox.classList.remove('hidden', 'bg-green-100', 'border-green-300', 'text-green-800', 'bg-red-100', 'border-red-300', 'text-red-800', 'bg-yellow-100', 'border-yellow-300', 'text-yellow-800');
    messageBox.classList.add('block');

    switch (type) {
        case 'success':
            messageBox.classList.add('bg-green-100', 'border-green-300', 'text-green-800');
            break;
        case 'error':
            messageBox.classList.add('bg-red-100', 'border-red-300', 'text-red-800');
            break;
        case 'warning':
        case 'info':
        default:
            messageBox.classList.add('bg-yellow-100', 'border-yellow-300', 'text-yellow-800');
            break;
    }

    setTimeout(() => {
        messageBox.classList.add('hidden');
    }, 3000);
}

// Local Storage Functions
function saveQuotes() {
    try {
        localStorage.setItem('quotes', JSON.stringify(quotes));
    } catch (e) {
        console.error("Error saving quotes to local storage:", e);
        showMessage("Error saving quotes. Storage might be full.", 'error');
    }
}

function loadQuotes() {
    try {
        const storedQuotes = localStorage.getItem('quotes');
        if (storedQuotes) {
            quotes = JSON.parse(storedQuotes);
        } else {
            // Initial default quotes if no quotes in local storage
            quotes = [
                { text: "The only way to do great work is to love what you do.", category: "Inspiration" },
                { text: "Strive not to be a success, but rather to be of value.", category: "Life" },
                { text: "The mind is everything. What you think you become.", category: "Philosophy" },
                { text: "Life is what happens when you're busy making other plans.", category: "Life" },
                { text: "The future belongs to those who believe in the beauty of their dreams.", category: "Dreams" }
            ];
        }
    } catch (e) {
        console.error("Error loading quotes from local storage:", e);
        showMessage("Error loading quotes. Data might be corrupted.", 'error');
        quotes = [];
    }
}

// Session Storage Functions
function saveLastViewedQuote(quoteText, quoteCategory) {
    try {
        sessionStorage.setItem('lastViewedQuoteText', quoteText);
        sessionStorage.setItem('lastViewedQuoteCategory', quoteCategory);
        updateLastViewedQuoteDisplay();
    } catch (e) {
        console.error("Error saving to session storage:", e);
    }
}

function updateLastViewedQuoteDisplay() {
    const text = sessionStorage.getItem('lastViewedQuoteText');
    const category = sessionStorage.getItem('lastViewedQuoteCategory');
    if (text && category) {
        lastViewedQuoteSpan.textContent = `"${text}" - ${category}`;
    } else {
        lastViewedQuoteSpan.textContent = "None";
    }
}

// Quote Display and Add Functions
function showRandomQuote() {
    if (quotes.length === 0) {
        quoteText.textContent = "No quotes available. Add some!";
        quoteCategory.textContent = "";
        saveLastViewedQuote("No quotes available.", "");
        return;
    }
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];

    quoteText.textContent = `"${randomQuote.text}"`;
    quoteCategory.textContent = `- ${randomQuote.category}`;

    saveLastViewedQuote(randomQuote.text, randomQuote.category);
}

function addQuote() {
    const text = newQuoteTextInput.value.trim();
    let category = newQuoteCategoryInput.value.trim();

    if (!text) {
        showMessage("Please enter text for the quote.", 'error');
        return;
    }

    if (!category) {
        category = "General";
    }

    const newQuote = { text, category };
    quotes.push(newQuote);
    saveQuotes();

    newQuoteTextInput.value = '';
    newQuoteCategoryInput.value = '';

    showMessage("Quote added successfully!", 'success');
    populateCategories();
    showRandomQuote();
    filterQuotes();
}

function displayAllQuotes(filteredQuotes = quotes) {
    quotesContainer.innerHTML = ''; // Clear existing list

    if (filteredQuotes.length === 0) {
        const noQuotesMessage = document.createElement('p');
        noQuotesMessage.classList.add('text-gray-500', 'italic', 'text-center');
        noQuotesMessage.textContent = 'No quotes found for this category.';
        quotesContainer.appendChild(noQuotesMessage);
        return;
    }

    filteredQuotes.forEach((quote) => {
        const quoteDiv = document.createElement('div');
        quoteDiv.classList.add('bg-gray-50', 'p-4', 'rounded-lg', 'shadow-sm', 'border', 'border-gray-200', 'text-left');

        const quoteP = document.createElement('p');
        quoteP.classList.add('text-gray-700', 'font-medium', 'mb-1');
        quoteP.textContent = `"${quote.text}"`;

        const categorySpan = document.createElement('span');
        categorySpan.classList.add('text-sm', 'text-gray-500', 'italic');
        categorySpan.textContent = `- ${quote.category}`;

        quoteDiv.appendChild(quoteP);
        quoteDiv.appendChild(categorySpan);

        quotesContainer.appendChild(quoteDiv);
    });
}

// Category Filtering Functions
function populateCategories() {
    const uniqueCategories = new Set(quotes.map(quote => quote.category));

    categoryFilter.innerHTML = '<option value="all">All Categories</option>';

    uniqueCategories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });

    const lastFilter = localStorage.getItem('selectedCategoryFilter');
    if (lastFilter) {
        categoryFilter.value = lastFilter;
    }
}

function filterQuotes() {
    const selectedCategory = categoryFilter.value;
    localStorage.setItem('selectedCategoryFilter', selectedCategory);

    let filtered = [];
    if (selectedCategory === 'all') {
        filtered = quotes;
    } else {
        filtered = quotes.filter(quote => quote.category === selectedCategory);
    }
    displayAllQuotes(filtered);
}

// JSON Import/Export Functions
function exportQuotesToJson() {
    const dataStr = JSON.stringify(quotes, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotes.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showMessage("Quotes exported successfully!", 'success');
}

function importFromJsonFile(event) {
    const file = event.target.files[0];
    if (!file) {
        return;
    }

    const fileReader = new FileReader();
    fileReader.onload = function(e) {
        try {
            const importedQuotes = JSON.parse(e.target.result);

            if (Array.isArray(importedQuotes) && importedQuotes.every(q => typeof q.text === 'string' && typeof q.category === 'string')) {
                quotes.push(...importedQuotes);
                saveQuotes();
                showMessage('Quotes imported successfully!', 'success');
                populateCategories();
                showRandomQuote();
                filterQuotes();
            } else {
                showMessage('Invalid JSON file format. Please upload a file with an array of quote objects.', 'error');
            }
        } catch (error) {
            console.error("Error parsing JSON file:", error);
            showMessage('Error importing quotes. Invalid JSON file.', 'error');
        }
    };
    fileReader.readAsText(file);
}

// Server Sync and Conflict Resolution Functions

// Simulate fetching quotes from a server using JSONPlaceholder
async function fetchQuotesFromServer() {
    const apiUrl = 'https://jsonplaceholder.typicode.com/posts?_limit=10'; // Fetch a limited number of posts
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const serverData = await response.json();
        // Map JSONPlaceholder posts to our quote format
        return serverData.map(post => ({
            text: post.title, // Using title as quote text
            category: 'JSONPlaceholder' // Assign a generic category
        }));
    } catch (error) {
        console.error("Error fetching quotes from server:", error);
        showMessage("Could not fetch quotes from server.", 'error');
        return []; // Return empty array on error
    }
}

// Simulate posting quotes to a server using JSONPlaceholder
async function postQuotesToServer(data) {
    const apiUrl = 'https://jsonplaceholder.typicode.com/posts';
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: "Local Quotes Update",
                body: JSON.stringify(data.slice(0, 5)),
                userId: 1
            })
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        console.log("Simulated server post response:", result);
        return { success: true, message: 'Data simulated to be synced to server!' };
    } catch (error) {
        console.error("Error posting quotes to server:", error);
        showMessage("Could not post quotes to server (simulated).", 'error');
        return { success: false, message: 'Simulated post failed.' };
    }
}

async function syncQuotes() {
    syncStatus.textContent = "Status: Syncing...";
    try {
        const serverQuotes = await fetchQuotesFromServer();
        const localQuotesJson = JSON.stringify(quotes.sort((a, b) => a.text.localeCompare(b.text)));
        const serverQuotesJson = JSON.stringify(serverQuotes.sort((a, b) => a.text.localeCompare(b.text)));

        let syncHappened = false;
        if (serverQuotes.length > 0 && localQuotesJson !== serverQuotesJson) {
            conflictNotification.classList.add('hidden');
            updateNotification.classList.remove('hidden');
            updateMessage.textContent = `Fetched ${serverQuotes.length} quotes from server. Your local data will be updated.`;

            quotes = [...serverQuotes];
            saveQuotes();
            populateCategories();
            showRandomQuote();
            filterQuotes();
            syncHappened = true;
        } else if (serverQuotes.length === 0) {
             showMessage("No quotes fetched from server. Keeping local data.", 'warning');
        } else {
            conflictNotification.classList.add('hidden');
            updateNotification.classList.add('hidden');
            // If the code reaches here, it means serverQuotes.length > 0 and data is identical
            showMessage("Quotes are already in sync with the server.", 'info');
        }

        await postQuotesToServer(quotes);

        syncStatus.textContent = `Status: Last synced: ${new Date().toLocaleTimeString()}`;
        if (syncHappened) {
            showMessage("Quotes synced with server!", 'success'); // Changed to the requested phrase
        }
    } catch (error) {
        console.error("Error during sync:", error);
        syncStatus.textContent = "Status: Sync Failed!";
        showMessage("Failed to sync with server. Please try again.", 'error');
    }
}

function resolveConflict() {
    syncQuotes();
    conflictNotification.classList.add('hidden');
}

function dismissUpdate() {
    updateNotification.classList.add('hidden');
}

function createAddQuoteForm() {
    addQuoteButton.addEventListener('click', addQuote);
}

// Event Listeners
newQuoteButton.addEventListener('click', showRandomQuote);
exportQuotesButton.addEventListener('click', exportQuotesToJson);
importFileInput.addEventListener('change', importFromJsonFile);
categoryFilter.addEventListener('change', filterQuotes);
syncNowButton.addEventListener('click', syncQuotes);
resolveConflictButton.addEventListener('click', resolveConflict);
dismissUpdateButton.addEventListener('click', dismissUpdate);

// Initial Load and Periodic Sync
document.addEventListener('DOMContentLoaded', () => {
    loadQuotes();
    populateCategories();
    const lastFilter = localStorage.getItem('selectedCategoryFilter');
    if (lastFilter) {
        categoryFilter.value = lastFilter;
    }
    showRandomQuote();
    createAddQuoteForm();
    filterQuotes();
    updateLastViewedQuoteDisplay();

    // Initial sync on load
    syncQuotes();

    // Periodic sync every 30 seconds (adjust as needed)
    setInterval(syncQuotes, 30000);
});
