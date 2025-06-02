class Calculator {
    constructor(displayElement, historyList) {
        this.displayElement = displayElement;
        this.historyList = historyList;
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.history = [];
        this.updateDisplay();
        this.setupEventListeners();
    }
            
    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
    }
            
    delete() {
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
        if (this.currentOperand === '') {
            this.currentOperand = '0';
        }
    }
            
    appendNumber(number) {
        if (number === '.' && this.currentOperand.includes('.')) return;
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number;
        } else {
            this.currentOperand = this.currentOperand.toString() + number.toString();
        }
    }
            
    chooseOperation(operation) {
        if (this.currentOperand === '') return;
        if (this.previousOperand !== '') {
            this.calculate();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
    }
            
    calculate() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        if (isNaN(prev)) return;
        
        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '−':
                computation = prev - current;
                break;
            case '×':
                computation = prev * current;
                break;
            case '÷':
                computation = prev / current;
                break;
            default:
                return;
        }
        
        // Add to history
        const historyItem = `${this.previousOperand} ${this.operation} ${this.currentOperand} = ${computation}`;
        this.history.unshift(historyItem);
        this.updateHistory();
        
        this.currentOperand = computation;
        this.operation = undefined;
        this.previousOperand = '';
    }
    
    percentage() {
        this.currentOperand = parseFloat(this.currentOperand) / 100;
    }
    
    getDisplayNumber(number) {
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        let integerDisplay;
        
        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('en', {
                maximumFractionDigits: 0
            });
        }
        
        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }
    
    updateDisplay() {
        this.displayElement.querySelector('.current-operand').textContent = 
            this.getDisplayNumber(this.currentOperand);
        
        if (this.operation != null) {
            this.displayElement.querySelector('.previous-operand').textContent = 
                `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
        } else {
            this.displayElement.querySelector('.previous-operand').textContent = '';
        }
    }
    
    updateHistory() {
        this.historyList.innerHTML = '';
        this.history.slice(0, 10).forEach(item => {
            const li = document.createElement('li');
            li.className = 'history-item';
            li.textContent = item;
            this.historyList.appendChild(li);
        });
    }
    
    setupEventListeners() {
        const keypad = document.querySelector('.keypad');
        const historyToggle = document.querySelector('.history-toggle');
        const closeHistory = document.querySelector('.close-history');
        const historyPanel = document.querySelector('.history-panel');
        
        keypad.addEventListener('click', (e) => {
            if (e.target.matches('button')) {
                const action = e.target.dataset.action;
                const number = e.target.dataset.number;
                const operation = e.target.dataset.operation;
                
                if (number) {
                    this.appendNumber(number);
                    this.updateDisplay();
                }
                
                if (operation) {
                    this.chooseOperation(operation);
                    this.updateDisplay();
                }
                
                if (action === 'calculate') {
                    this.calculate();
                    this.updateDisplay();
                }
                
                if (action === 'clear') {
                    this.clear();
                    this.updateDisplay();
                }
                
                if (action === 'backspace') {
                    this.delete();
                    this.updateDisplay();
                }
                
                if (action === 'percentage') {
                    this.percentage();
                    this.updateDisplay();
                }
            }
        });
        
        historyToggle.addEventListener('click', () => {
            historyPanel.classList.add('active');
        });
        
        closeHistory.addEventListener('click', () => {
            historyPanel.classList.remove('active');
        });
        
        // Keyboard support
        document.addEventListener('keydown', (e) => {
            if (e.key >= 0 && e.key <= 9) {
                this.appendNumber(e.key);
                this.updateDisplay();
            }
            
            if (e.key === '.') {
                this.appendNumber('.');
                this.updateDisplay();
            }
            
            if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
                let operation;
                switch(e.key) {
                    case '+': operation = '+'; break;
                    case '-': operation = '−'; break;
                    case '*': operation = '×'; break;
                    case '/': operation = '÷'; break;
                }
                this.chooseOperation(operation);
                this.updateDisplay();
            }
            
            if (e.key === 'Enter' || e.key === '=') {
                this.calculate();
                this.updateDisplay();
            }
            
            if (e.key === 'Escape') {
                this.clear();
                this.updateDisplay();
            }
            
            if (e.key === 'Backspace') {
                this.delete();
                this.updateDisplay();
            }
            
            if (e.key === '%') {
                this.percentage();
                this.updateDisplay();
            }
        });
    }
}

    // Initialize calculator
    const displayElement = document.querySelector('.display');
    const historyList = document.querySelector('.history-list');
    const calculator = new Calculator(displayElement, historyList);