let quotes = [];

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

function showMessage(message, type = 'info') {
    messageBox.textContent = message; // Changed to textContent
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
        lastViewedQuoteSpan.textContent = `"${text}" - ${category}`; // Changed to textContent
    } else {
        lastViewedQuoteSpan.textContent = "None"; // Changed to textContent
    }
}

function showRandomQuote() {
    if (quotes.length === 0) {
        quoteText.textContent = "No quotes available. Add some!"; // Changed to textContent
        quoteCategory.textContent = ""; // Changed to textContent
        saveLastViewedQuote("No quotes available.", "");
        return;
    }
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];

    quoteText.textContent = `"${randomQuote.text}"`; // Changed to textContent
    quoteCategory.textContent = `- ${randomQuote.category}`; // Changed to textContent

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
    quotesContainer.innerHTML = ''; // Keep innerHTML here to clear all children

    if (filteredQuotes.length === 0) {
        const noQuotesMessage = document.createElement('p');
        noQuotesMessage.classList.add('text-gray-500', 'italic', 'text-center');
        noQuotesMessage.textContent = 'No quotes found for this category.'; // Changed to textContent
        quotesContainer.appendChild(noQuotesMessage);
        return;
    }

    filteredQuotes.forEach((quote, index) => {
        const quoteDiv = document.createElement('div');
        quoteDiv.classList.add('bg-gray-50', 'p-4', 'rounded-lg', 'shadow-sm', 'border', 'border-gray-200', 'text-left');

        const quoteP = document.createElement('p');
        quoteP.classList.add('text-gray-700', 'font-medium', 'mb-1');
        quoteP.textContent = `"${quote.text}"`; // Changed to textContent

        const categorySpan = document.createElement('span');
        categorySpan.classList.add('text-sm', 'text-gray-500', 'italic');
        categorySpan.textContent = `- ${quote.category}`; // Changed to textContent

        quoteDiv.appendChild(quoteP);
        quoteDiv.appendChild(categorySpan);

        quotesContainer.appendChild(quoteDiv);
    });
}

function populateCategories() {
    const uniqueCategories = new Set(quotes.map(quote => quote.category));

    // Clear existing options, keep "All Categories"
    categoryFilter.innerHTML = '<option value="all">All Categories</option>'; // Keep innerHTML here for option tags

    uniqueCategories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category; // Changed to textContent
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

function createAddQuoteForm() {
    addQuoteButton.addEventListener('click', addQuote);
}

newQuoteButton.addEventListener('click', showRandomQuote);
exportQuotesButton.addEventListener('click', exportQuotesToJson);
importFileInput.addEventListener('change', importFromJsonFile);
categoryFilter.addEventListener('change', filterQuotes);

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
});
