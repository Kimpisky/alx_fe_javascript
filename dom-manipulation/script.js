let quotes = [
    { text: "The only way to do great work is to love what you do.", category: "Inspiration" },
    { text: "Strive not to be a success, but rather to be of value.", category: "Life" },
    { text: "The mind is everything. What you think you become.", category: "Philosophy" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
    { text: "The future belongs to those who believe in the beauty of their dreams.", category: "Dreams" }
];

const quoteDisplay = document.getElementById('quoteDisplay');
const quoteText = document.getElementById('quoteText');
const quoteCategory = document.getElementById('quoteCategory');
const newQuoteButton = document.getElementById('newQuote');
const newQuoteTextInput = document.getElementById('newQuoteText');
const newQuoteCategoryInput = document.getElementById('newQuoteCategory');
const addQuoteButton = document.getElementById('addQuoteBtn');
const messageBox = document.getElementById('messageBox');

function showMessage(message, type = 'info') {
    messageBox.innerHTML = message; // Changed to innerHTML
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

function showRandomQuote() {
    if (quotes.length === 0) {
        quoteText.innerHTML = "No quotes available. Add some!"; // Changed to innerHTML
        quoteCategory.innerHTML = ""; // Changed to innerHTML
        return;
    }
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];

    quoteText.innerHTML = `"${randomQuote.text}"`; // Changed to innerHTML
    quoteCategory.innerHTML = `- ${randomQuote.category}`; // Changed to innerHTML
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

    newQuoteTextInput.value = '';
    newQuoteCategoryInput.value = '';

    showMessage("Quote added successfully!", 'success');
    showRandomQuote();
}

newQuoteButton.addEventListener('click', showRandomQuote);
addQuoteButton.addEventListener('click', addQuote);

document.addEventListener('DOMContentLoaded', showRandomQuote);
