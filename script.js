document.addEventListener('DOMContentLoaded', function() {
    const expenseForm = document.getElementById('expense-form');
    const expenseList = document.getElementById('expense-list');
    const balance = document.getElementById('balance');

    let totalBalance = 0;
    let editMode = false;
    let editExpenseId = '';

    // Retrieve expenses from local storage if available
    let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

    // Function to calculate and update balance
    function updateBalance() {
        let totalExpenses = expenses.reduce((acc, curr) => acc + parseFloat(curr.amount), 0);
        totalBalance = totalExpenses;
        balance.textContent = totalBalance.toFixed(2);
    }

    // Function to render expenses
    function renderExpenses() {
        expenseList.innerHTML = '';
        expenses.forEach((expense, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <div>
                    <strong>${expense.text}</strong>: $${expense.amount}
                </div>
                <div>
                    <button onclick="editExpense('${expense.id}')">Edit</button>
                    <button onclick="deleteExpense(${index})">Delete</button>
                </div>
            `;
            expenseList.appendChild(li);
        });
        updateBalance();
        localStorage.setItem('expenses', JSON.stringify(expenses));
    }

    // Function to handle form submission
    expenseForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const text = document.getElementById('text').value.trim();
        const amount = parseFloat(document.getElementById('amount').value.trim());

        if (text === '') {
            alert('Please enter a description for your expense.');
            return;
        }

        if (isNaN(amount) || amount <= 0) {
            alert('Please enter a valid positive number for the amount.');
            return;
        }

        if (editMode) {
            // Edit existing expense
            expenses = expenses.map(expense => {
                if (expense.id === editExpenseId) {
                    return { id: expense.id, text: text, amount: amount };
                }
                return expense;
            });
            editMode = false;
            editExpenseId = '';
        } else {
            // Add new expense
            const newExpense = {
                id: generateId(),
                text: text,
                amount: amount
            };
            expenses.push(newExpense);
        }

        renderExpenses();
        expenseForm.reset();
    });

    // Function to generate unique ID for expenses
    function generateId() {
        return '_' + Math.random().toString(36).substr(2, 9);
    }

    // Function to delete expense
    window.deleteExpense = function(index) {
        expenses.splice(index, 1);
        renderExpenses();
    };

    // Function to edit expense
    window.editExpense = function(id) {
        const expenseToEdit = expenses.find(expense => expense.id === id);
        if (expenseToEdit) {
            document.getElementById('text').value = expenseToEdit.text;
            document.getElementById('amount').value = expenseToEdit.amount;
            document.getElementById('expense-id').value = expenseToEdit.id;
            editMode = true;
            editExpenseId = expenseToEdit.id;
        }
    };

    // Initial render
    renderExpenses();
});
