// ===== CBT SIMULATOR ENGINE =====
class CBTSimulator {
    constructor() {
        this.currentExam = null;
        this.questions = [];
        this.currentQuestionIndex = 0;
        this.userAnswers = {};
        this.flaggedQuestions = new Set();
        this.startTime = null;
        this.timerInterval = null;
        this.timeRemaining = 0;
        this.examCompleted = false;
        
        this.init();
    }
    
    init() {
        this.cacheElements();
        this.bindEvents();
        this.loadDemoQuestions();
        this.setupQuestionGrid();
    }
    
    cacheElements() {
        this.elements = {
            examSetup: document.getElementById('examSetup'),
            examInterface: document.getElementById('examInterface'),
            resultsPanel: document.getElementById('resultsPanel'),
            startExamBtn: document.getElementById('startExamBtn'),
            questionGrid: document.getElementById('questionGrid'),
            questionContent: document.getElementById('questionContent'),
            questionOptions: document.getElementById('questionOptions'),
            questionNumber: document.getElementById('questionNumber'),
            totalQuestions: document.getElementById('totalQuestions'),
            prevQuestion: document.getElementById('prevQuestion'),
            nextQuestion: document.getElementById('nextQuestion'),
            submitExamBtn: document.getElementById('submitExamBtn'),
            flagQuestion: document.getElementById('flagQuestion'),
            timerDisplay: document.getElementById('timerDisplay'),
            answeredCount: document.getElementById('answeredCount'),
            unansweredCount: document.getElementById('unansweredCount'),
            flaggedCount: document.getElementById('flaggedCount'),
            finalScore: document.getElementById('finalScore'),
            correctAnswers: document.getElementById('correctAnswers'),
            wrongAnswers: document.getElementById('wrongAnswers'),
            skippedAnswers: document.getElementById('skippedAnswers'),
            timeSpent: document.getElementById('timeSpent'),
            reviewAnswersBtn: document.getElementById('reviewAnswersBtn'),
            newPracticeBtn: document.getElementById('newPracticeBtn'),
            saveResultsBtn: document.getElementById('saveResultsBtn'),
            calculatorModal: document.getElementById('calculatorModal'),
            notepadModal: document.getElementById('notepadModal')
        };
    }
    
    bindEvents() {
        // Start exam button
        this.elements.startExamBtn.addEventListener('click', () => this.startExam());
        
        // Navigation buttons
        this.elements.prevQuestion.addEventListener('click', () => this.prevQuestion());
        this.elements.nextQuestion.addEventListener('click', () => this.nextQuestion());
        this.elements.submitExamBtn.addEventListener('click', () => this.submitExam());
        this.elements.flagQuestion.addEventListener('click', () => this.toggleFlag());
        
        // Results panel buttons
        this.elements.reviewAnswersBtn.addEventListener('click', () => this.reviewAnswers());
        this.elements.newPracticeBtn.addEventListener('click', () => this.resetExam());
        this.elements.saveResultsBtn.addEventListener('click', () => this.saveResults());
        
        // Question grid clicks
        this.elements.questionGrid.addEventListener('click', (e) => {
            const questionBtn = e.target.closest('.question-btn');
            if (questionBtn) {
                const questionIndex = parseInt(questionBtn.dataset.index);
                this.goToQuestion(questionIndex);
            }
        });
        
        // Answer selection
        this.elements.questionOptions.addEventListener('change', (e) => {
            if (e.target.name === 'answer') {
                this.saveAnswer(e.target.value);
                this.updateQuestionGrid();
                this.updateStats();
            }
        });
        
        // Tool buttons
        document.getElementById('calculatorBtn')?.addEventListener('click', () => {
            this.openCalculator();
        });
        
        document.getElementById('notepadBtn')?.addEventListener('click', () => {
            this.openNotepad();
        });
    }
    
    loadDemoQuestions() {
        // Demo questions - in production, these would come from an API
        this.questions = [
            {
                id: 1,
                text: "If the sum of the first n terms of an arithmetic progression is given by Sₙ = 3n² + 5n, what is the common difference?",
                options: ["3", "5", "6", "8"],
                correctAnswer: "C",
                topic: "Sequence and Series",
                explanation: "The common difference can be found by calculating S₂ - 2S₁ = (3×4 + 10) - 2(3×1 + 5) = 22 - 16 = 6"
            },
            {
                id: 2,
                text: "What is the derivative of sin²(x) with respect to x?",
                options: ["2sin(x)", "2sin(x)cos(x)", "sin(2x)", "cos²(x)"],
                correctAnswer: "B",
                topic: "Calculus",
                explanation: "Using chain rule: d/dx[sin²(x)] = 2sin(x) * cos(x) = sin(2x)"
            },
            {
                id: 3,
                text: "If log₁₀2 = 0.3010, what is the value of log₁₀8?",
                options: ["0.3010", "0.6020", "0.9030", "1.2040"],
                correctAnswer: "C",
                topic: "Logarithms",
                explanation: "log₁₀8 = log₁₀(2³) = 3 × log₁₀2 = 3 × 0.3010 = 0.9030"
            },
            {
                id: 4,
                text: "A circle has equation x² + y² - 4x + 6y - 3 = 0. What is its radius?",
                options: ["2", "3", "4", "5"],
                correctAnswer: "C",
                topic: "Coordinate Geometry",
                explanation: "Complete the square: (x-2)² + (y+3)² = 16, so radius = √16 = 4"
            },
            {
                id: 5,
                text: "What is the probability of getting at least one head when three coins are tossed?",
                options: ["1/8", "3/8", "7/8", "1"],
                correctAnswer: "C",
                topic: "Probability",
                explanation: "P(at least one head) = 1 - P(no heads) = 1 - (1/2)³ = 1 - 1/8 = 7/8"
            }
        ];
        
        // Add more demo questions to reach selected count
        const questionCount = parseInt(document.getElementById('questionCount')?.value || 5);
        while (this.questions.length < questionCount) {
            const baseQuestion = this.questions[this.questions.length % 5];
            const newQuestion = {
                ...baseQuestion,
                id: this.questions.length + 1,
                text: `Question ${this.questions.length + 1}: ${baseQuestion.text}`,
                options: [...baseQuestion.options].sort(() => Math.random() - 0.5)
            };
            this.questions.push(newQuestion);
        }
        
        this.questions = this.questions.slice(0, questionCount);
    }
    
    setupQuestionGrid() {
        const grid = this.elements.questionGrid;
        if (!grid) return;
        
        grid.innerHTML = '';
        
        for (let i = 0; i < this.questions.length; i++) {
            const button = document.createElement('button');
            button.className = 'question-btn';
            button.dataset.index = i;
            button.textContent = i + 1;
            grid.appendChild(button);
        }
    }
    
    startExam() {
        // Get exam configuration
        const examType = document.querySelector('input[name="examType"]:checked')?.value || 'jamb';
        const subject = document.getElementById('subjectSelect')?.value || 'mathematics';
        const questionCount = parseInt(document.getElementById('questionCount')?.value || 5);
        const timeLimit = parseInt(document.getElementById('timeLimit')?.value || 60);
        const mode = document.querySelector('input[name="mode"]:checked')?.value || 'timed';
        
        // Reload questions with correct count
        this.loadDemoQuestions();
        this.setupQuestionGrid();
        
        // Reset exam state
        this.currentQuestionIndex = 0;
        this.userAnswers = {};
        this.flaggedQuestions.clear();
        this.examCompleted = false;
        
        // Set time
        this.timeRemaining = timeLimit * 60; // Convert to seconds
        this.startTime = Date.now();
        
        // Update UI
        this.elements.examSetup.style.display = 'none';
        this.elements.examInterface.style.display = 'block';
        this.elements.resultsPanel.style.display = 'none';
        
        // Update exam info
        document.getElementById('currentExamTitle').textContent = 
            `${examType.toUpperCase()} ${subject.charAt(0).toUpperCase() + subject.slice(1)} Practice`;
        document.getElementById('currentSubject').textContent = 
            subject.charAt(0).toUpperCase() + subject.slice(1);
        document.getElementById('currentQuestionCount').textContent = questionCount;
        this.elements.totalQuestions.textContent = questionCount;
        
        // Set student name
        const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
        document.getElementById('currentStudent').textContent = user.firstName || 'Student';
        
        // Start timer if in timed mode
        if (mode === 'timed') {
            this.startTimer();
        } else {
            this.elements.timerDisplay.querySelector('span').textContent = 'Untimed';
        }
        
        // Load first question
        this.loadQuestion(0);
        this.updateStats();
        
        // Show notification
        if (window.ExamMaster) {
            window.ExamMaster.showNotification('Exam started! Good luck!', 'info');
        }
    }
    
    startTimer() {
        if (this.timerInterval) clearInterval(this.timerInterval);
        
        this.updateTimerDisplay();
        
        this.timerInterval = setInterval(() => {
            if (this.timeRemaining > 0) {
                this.timeRemaining--;
                this.updateTimerDisplay();
                
                // Warning when 5 minutes remain
                if (this.timeRemaining === 300) {
                    if (window.ExamMaster) {
                        window.ExamMaster.showNotification('5 minutes remaining!', 'warning');
                    }
                }
                
                // Auto-submit when time is up
                if (this.timeRemaining === 0) {
                    this.submitExam();
                }
            }
        }, 1000);
    }
    
    updateTimerDisplay() {
        if (!this.elements.timerDisplay) return;
        
        const minutes = Math.floor(this.timeRemaining / 60);
        const seconds = this.timeRemaining % 60;
        const display = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        this.elements.timerDisplay.querySelector('span').textContent = display;
        
        // Add warning class when less than 5 minutes
        if (this.timeRemaining < 300) {
            this.elements.timerDisplay.classList.add('warning');
        } else {
            this.elements.timerDisplay.classList.remove('warning');
        }
    }
    
    loadQuestion(index) {
        if (index < 0 || index >= this.questions.length) return;
        
        this.currentQuestionIndex = index;
        const question = this.questions[index];
        
        // Update question number
        this.elements.questionNumber.textContent = index + 1;
        
        // Update question text
        const questionText = this.elements.questionContent.querySelector('p');
        if (questionText) {
            questionText.textContent = question.text;
        }
        
        // Update options
        const optionsContainer = this.elements.questionOptions;
        optionsContainer.innerHTML = '';
        
        ['A', 'B', 'C', 'D'].forEach((letter, i) => {
            if (question.options[i]) {
                const label = document.createElement('label');
                label.className = 'option';
                
                const input = document.createElement('input');
                input.type = 'radio';
                input.name = 'answer';
                input.value = letter;
                
                // Check if this answer was previously selected
                if (this.userAnswers[question.id] === letter) {
                    input.checked = true;
                }
                
                const spanLetter = document.createElement('span');
                spanLetter.className = 'option-letter';
                spanLetter.textContent = letter;
                
                const spanText = document.createElement('span');
                spanText.className = 'option-text';
                spanText.textContent = question.options[i];
                
                label.appendChild(input);
                label.appendChild(spanLetter);
                label.appendChild(spanText);
                
                optionsContainer.appendChild(label);
            }
        });
        
        // Update flag button
        const flagBtn = this.elements.flagQuestion;
        if (this.flaggedQuestions.has(question.id)) {
            flagBtn.innerHTML = '<i class="fas fa-flag"></i> Remove Flag';
            flagBtn.classList.add('flagged');
        } else {
            flagBtn.innerHTML = '<i class="far fa-flag"></i> Flag for Review';
            flagBtn.classList.remove('flagged');
        }
        
        // Update question grid
        this.updateQuestionGrid();
        
        // Update navigation buttons
        this.elements.prevQuestion.disabled = index === 0;
        this.elements.nextQuestion.disabled = index === this.questions.length - 1;
    }
    
    prevQuestion() {
        if (this.currentQuestionIndex > 0) {
            this.loadQuestion(this.currentQuestionIndex - 1);
        }
    }
    
    nextQuestion() {
        if (this.currentQuestionIndex < this.questions.length - 1) {
            this.loadQuestion(this.currentQuestionIndex + 1);
        }
    }
    
    goToQuestion(index) {
        this.loadQuestion(index);
    }
    
    saveAnswer(answer) {
        const currentQuestion = this.questions[this.currentQuestionIndex];
        this.userAnswers[currentQuestion.id] = answer;
    }
    
    toggleFlag() {
        const currentQuestion = this.questions[this.currentQuestionIndex];
        
        if (this.flaggedQuestions.has(currentQuestion.id)) {
            this.flaggedQuestions.delete(currentQuestion.id);
        } else {
            this.flaggedQuestions.add(currentQuestion.id);
        }
        
        this.loadQuestion(this.currentQuestionIndex); // Reload to update flag button
        this.updateStats();
    }
    
    updateQuestionGrid() {
        const buttons = this.elements.questionGrid.querySelectorAll('.question-btn');
        
        buttons.forEach((button, index) => {
            const questionId = this.questions[index].id;
            
            // Reset classes
            button.classList.remove('answered', 'current', 'flagged');
            
            // Add appropriate classes
            if (index === this.currentQuestionIndex) {
                button.classList.add('current');
            }
            
            if (this.userAnswers[questionId]) {
                button.classList.add('answered');
            }
            
            if (this.flaggedQuestions.has(questionId)) {
                button.classList.add('flagged');
            }
        });
    }
    
    updateStats() {
        const total = this.questions.length;
        const answered = Object.keys(this.userAnswers).length;
        const flagged = this.flaggedQuestions.size;
        const unanswered = total - answered;
        
        this.elements.answeredCount.textContent = answered;
        this.elements.unansweredCount.textContent = unanswered;
        this.elements.flaggedCount.textContent = flagged;
    }
    
    submitExam() {
        if (this.examCompleted) return;
        
        // Stop timer
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        
        this.examCompleted = true;
        this.calculateResults();
        
        // Show results panel
        this.elements.examInterface.style.display = 'none';
        this.elements.resultsPanel.style.display = 'block';
        
        // Show notification
        if (window.ExamMaster) {
            window.ExamMaster.showNotification('Exam submitted! View your results.', 'success');
        }
    }
    
    calculateResults() {
        let correct = 0;
        let wrong = 0;
        let skipped = 0;
        
        // Calculate scores
        this.questions.forEach(question => {
            const userAnswer = this.userAnswers[question.id];
            
            if (!userAnswer) {
                skipped++;
            } else if (userAnswer === question.correctAnswer) {
                correct++;
            } else {
                wrong++;
            }
        });
        
        const total = this.questions.length;
        const score = Math.round((correct / total) * 100);
        const timeSpent = Math.floor((Date.now() - this.startTime) / 1000);
        
        // Update UI
        this.elements.finalScore.textContent = `${score}%`;
        this.elements.correctAnswers.textContent = correct;
        this.elements.wrongAnswers.textContent = wrong;
        this.elements.skippedAnswers.textContent = skipped;
        this.elements.timeSpent.textContent = this.formatTime(timeSpent);
        
        // Update metrics
        document.getElementById('accuracyMetric').textContent = `${score}%`;
        document.getElementById('speedMetric').textContent = `${Math.round((total / timeSpent) * 3600)} Q/Hour`;
        document.getElementById('percentileMetric').textContent = `${Math.min(score + 20, 99)}%`;
        document.getElementById('improvementMetric').textContent = `+${Math.floor(Math.random() * 15)}%`;
        
        // Animate score circle
        const circle = document.getElementById('scoreCircle');
        if (circle) {
            const circumference = 2 * Math.PI * 54;
            const offset = circumference - (score / 100) * circumference;
            
            setTimeout(() => {
                circle.style.transition = 'stroke-dashoffset 1.5s ease';
                circle.style.strokeDashoffset = offset;
            }, 300);
        }
        
        // Populate topic breakdown
        this.populateTopicBreakdown();
    }
    
    formatTime(seconds) {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        
        if (hrs > 0) {
            return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        } else {
            return `${mins}:${secs.toString().padStart(2, '0')}`;
        }
    }
    
    populateTopicBreakdown() {
        const topicsList = document.getElementById('topicsList');
        if (!topicsList) return;
        
        // Group questions by topic
        const topicStats = {};
        
        this.questions.forEach(question => {
            const topic = question.topic;
            if (!topicStats[topic]) {
                topicStats[topic] = { total: 0, correct: 0 };
            }
            
            topicStats[topic].total++;
            if (this.userAnswers[question.id] === question.correctAnswer) {
                topicStats[topic].correct++;
            }
        });
        
        // Create HTML
        let html = '';
        for (const [topic, stats] of Object.entries(topicStats)) {
            const percentage = Math.round((stats.correct / stats.total) * 100);
            
            html += `
                <div class="topic-item">
                    <div class="topic-info">
                        <h4>${topic}</h4>
                        <span>${stats.correct}/${stats.total} correct</span>
                    </div>
                    <div class="topic-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${percentage}%"></div>
                        </div>
                        <span class="topic-percentage">${percentage}%</span>
                    </div>
                </div>
            `;
        }
        
        topicsList.innerHTML = html;
    }
    
    reviewAnswers() {
        // Switch to review mode
        this.currentQuestionIndex = 0;
        this.examCompleted = false;
        
        // Show exam interface in review mode
        this.elements.resultsPanel.style.display = 'none';
        this.elements.examInterface.style.display = 'block';
        
        // Update UI for review
        this.elements.submitExamBtn.style.display = 'none';
        this.loadQuestion(0);
        
        // Show correct answers
        this.showCorrectAnswers();
    }
    
    showCorrectAnswers() {
        const currentQuestion = this.questions[this.currentQuestionIndex];
        const options = this.elements.questionOptions.querySelectorAll('.option');
        
        options.forEach(option => {
            const input = option.querySelector('input');
            const letter = input.value;
            
            // Disable all inputs in review mode
            input.disabled = true;
            
            // Highlight correct answer
            if (letter === currentQuestion.correctAnswer) {
                option.classList.add('correct');
            }
            
            // Highlight wrong answer if selected
            if (this.userAnswers[currentQuestion.id] === letter && letter !== currentQuestion.correctAnswer) {
                option.classList.add('wrong');
            }
        });
        
        // Add explanation if available
        const questionContent = this.elements.questionContent;
        let explanationDiv = questionContent.querySelector('.explanation');
        
        if (!explanationDiv) {
            explanationDiv = document.createElement('div');
            explanationDiv.className = 'explanation';
            questionContent.appendChild(explanationDiv);
        }
        
        if (currentQuestion.explanation) {
            explanationDiv.innerHTML = `
                <div class="explanation-header">
                    <h4><i class="fas fa-lightbulb"></i> Explanation</h4>
                </div>
                <p>${currentQuestion.explanation}</p>
            `;
        }
    }
    
    resetExam() {
        // Reset to setup screen
        this.elements.resultsPanel.style.display = 'none';
        this.elements.examInterface.style.display = 'none';
        this.elements.examSetup.style.display = 'block';
        
        // Reset exam state
        this.currentExam = null;
        this.questions = [];
        this.currentQuestionIndex = 0;
        this.userAnswers = {};
        this.flaggedQuestions.clear();
        this.examCompleted = false;
        this.startTime = null;
        this.timeRemaining = 0;
        
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        
        // Reload demo questions
        this.loadDemoQuestions();
        this.setupQuestionGrid();
    }
    
    saveResults() {
        // Save results to localStorage
        const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
        const examResults = {
            examType: document.querySelector('input[name="examType"]:checked')?.value || 'jamb',
            subject: document.getElementById('subjectSelect')?.value || 'mathematics',
            score: parseInt(this.elements.finalScore.textContent),
            date: new Date().toISOString(),
            correct: parseInt(this.elements.correctAnswers.textContent),
            total: this.questions.length,
            timeSpent: this.elements.timeSpent.textContent
        };
        
        let userResults = JSON.parse(localStorage.getItem('userResults') || '[]');
        userResults.push(examResults);
        localStorage.setItem('userResults', JSON.stringify(userResults));
        
        // Show notification
        if (window.ExamMaster) {
            window.ExamMaster.showNotification('Results saved to your dashboard!', 'success');
        }
    }
    
    openCalculator() {
        // In a real implementation, this would open a proper calculator
        if (window.ExamMaster) {
            window.ExamMaster.showNotification('Calculator opened in new window', 'info');
        }
    }
    
    openNotepad() {
        // In a real implementation, this would open a notepad
        if (window.ExamMaster) {
            window.ExamMaster.showNotification('Notepad opened in new window', 'info');
        }
    }
}

// ===== INITIALIZE CBT SIMULATOR =====
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the CBT page
    if (document.getElementById('examSetup')) {
        const cbtSimulator = new CBTSimulator();
        
        // Make simulator available globally
        window.cbtSimulator = cbtSimulator;
    }
    
    // Add CBT-specific styles
    const cbtStyles = document.createElement('style');
    cbtStyles.textContent = `
    .cbt-container {
        padding-top: 120px;
        min-height: 100vh;
    }
    
    .cbt-header {
        text-align: center;
        margin-bottom: 50px;
    }
    
    .cbt-header h1 {
        font-size: 2.5rem;
        margin-bottom: 1rem;
        color: var(--text-primary);
    }
    
    .cbt-header p {
        color: var(--text-secondary);
        font-size: 1.1rem;
        max-width: 600px;
        margin: 0 auto;
    }
    
    .exam-setup {
        background-color: var(--bg-white);
        border-radius: var(--radius);
        padding: 40px;
        box-shadow: var(--shadow);
        margin-bottom: 40px;
    }
    
    .exam-setup h2 {
        margin-bottom: 30px;
        display: flex;
        align-items: center;
        gap: 10px;
        color: var(--text-primary);
    }
    
    .setup-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 30px;
    }
    
    .setup-card {
        padding: 25px;
        background-color: var(--bg-light);
        border-radius: var(--radius);
        border: 2px solid var(--border-color);
        transition: var(--transition);
    }
    
    .setup-card:hover {
        border-color: var(--primary-color);
        transform: translateY(-5px);
    }
    
    .setup-icon {
        font-size: 2rem;
        color: var(--primary-color);
        margin-bottom: 15px;
    }
    
    .setup-card h3 {
        font-size: 1.3rem;
        margin-bottom: 20px;
        color: var(--text-primary);
    }
    
    .exam-options {
        display: grid;
        grid-template-columns: 1fr;
        gap: 10px;
    }
    
    .exam-option {
        cursor: pointer;
    }
    
    .exam-option input {
        display: none;
    }
    
    .option-content {
        padding: 15px;
        background-color: var(--bg-white);
        border: 2px solid var(--border-color);
        border-radius: var(--radius-sm);
        display: flex;
        align-items: center;
        gap: 10px;
        transition: var(--transition);
    }
    
    .exam-option.active .option-content {
        border-color: var(--primary-color);
        background-color: rgba(67, 97, 238, 0.1);
    }
    
    .exam-option:hover .option-content {
        border-color: var(--primary-color);
    }
    
    .option-content i {
        font-size: 1.2rem;
        color: var(--primary-color);
    }
    
    .setup-select {
        width: 100%;
        padding: 12px 15px;
        border: 1px solid var(--border-color);
        border-radius: var(--radius-sm);
        background-color: var(--bg-white);
        color: var(--text-primary);
        font-family: 'Poppins', sans-serif;
        font-size: 1rem;
    }
    
    .settings-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 15px;
    }
    
    .mode-options {
        display: grid;
        grid-template-columns: 1fr;
        gap: 10px;
        margin-bottom: 20px;
    }
    
    .mode-option {
        cursor: pointer;
    }
    
    .mode-option input {
        display: none;
    }
    
    .mode-content {
        padding: 15px;
        background-color: var(--bg-white);
        border: 2px solid var(--border-color);
        border-radius: var(--radius-sm);
        transition: var(--transition);
    }
    
    .mode-option.active .mode-content {
        border-color: var(--primary-color);
        background-color: rgba(67, 97, 238, 0.1);
    }
    
    .mode-content i {
        font-size: 1.2rem;
        color: var(--primary-color);
        margin-bottom: 10px;
        display: block;
    }
    
    .mode-content span {
        display: block;
        font-weight: 600;
        margin-bottom: 5px;
    }
    
    .mode-content small {
        color: var(--text-secondary);
        font-size: 0.9rem;
    }
    
    /* Exam Interface */
    .exam-interface {
        background-color: var(--bg-white);
        border-radius: var(--radius);
        overflow: hidden;
        box-shadow: var(--shadow-lg);
    }
    
    .exam-header {
        background-color: var(--primary-color);
        color: white;
        padding: 25px 30px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .exam-info h2 {
        font-size: 1.5rem;
        margin-bottom: 10px;
    }
    
    .exam-meta {
        display: flex;
        gap: 20px;
        font-size: 0.9rem;
        opacity: 0.9;
    }
    
    .exam-meta i {
        margin-right: 5px;
    }
    
    .exam-timer {
        text-align: center;
    }
    
    .timer-display {
        font-size: 2rem;
        font-family: 'Roboto Mono', monospace;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .timer-display.warning {
        color: #ffd166;
        animation: pulse 1s infinite;
    }
    
    @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.7; }
    }
    
    .timer-label {
        font-size: 0.9rem;
        opacity: 0.8;
        margin-top: 5px;
    }
    
    .exam-body {
        display: grid;
        grid-template-columns: 1fr 300px;
        min-height: 600px;
    }
    
    .question-panel {
        padding: 30px;
        border-right: 1px solid var(--border-color);
    }
    
    .question-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 30px;
        padding-bottom: 20px;
        border-bottom: 1px solid var(--border-color);
    }
    
    .question-header h3 {
        font-size: 1.2rem;
        color: var(--text-primary);
    }
    
    .question-actions {
        display: flex;
        gap: 10px;
    }
    
    .btn-small {
        padding: 8px 15px;
        font-size: 0.9rem;
    }
    
    .question-content {
        margin-bottom: 30px;
    }
    
    .question-content p {
        font-size: 1.2rem;
        line-height: 1.6;
        margin-bottom: 30px;
        color: var(--text-primary);
    }
    
    .question-options {
        display: grid;
        grid-template-columns: 1fr;
        gap: 15px;
        margin-bottom: 40px;
    }
    
    .option {
        display: flex;
        align-items: center;
        padding: 15px 20px;
        background-color: var(--bg-light);
        border: 2px solid var(--border-color);
        border-radius: var(--radius-sm);
        cursor: pointer;
        transition: var(--transition);
    }
    
    .option:hover {
        border-color: var(--primary-color);
        background-color: rgba(67, 97, 238, 0.05);
    }
    
    .option input:checked + .option-letter {
        background-color: var(--primary-color);
        color: white;
    }
    
    .option.correct {
        border-color: var(--accent-color);
        background-color: rgba(6, 214, 160, 0.1);
    }
    
    .option.wrong {
        border-color: var(--danger-color);
        background-color: rgba(239, 71, 111, 0.1);
    }
    
    .option input {
        margin-right: 15px;
    }
    
    .option-letter {
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: var(--bg-white);
        border-radius: 50%;
        font-weight: 600;
        margin-right: 15px;
        transition: var(--transition);
    }
    
    .option-text {
        flex: 1;
    }
    
    .question-navigation {
        display: flex;
        gap: 15px;
        padding-top: 30px;
        border-top: 1px solid var(--border-color);
    }
    
    .navigation-panel {
        padding: 30px;
        background-color: var(--bg-light);
    }
    
    .nav-header {
        margin-bottom: 25px;
    }
    
    .nav-header h4 {
        font-size: 1.2rem;
        margin-bottom: 15px;
        color: var(--text-primary);
    }
    
    .nav-stats {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
        font-size: 0.9rem;
    }
    
    .answered { color: var(--accent-color); }
    .unanswered { color: var(--text-secondary); }
    .flagged { color: var(--warning-color); }
    
    .question-grid {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: 10px;
        margin-bottom: 25px;
    }
    
    .question-btn {
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: var(--bg-white);
        border: 2px solid var(--border-color);
        border-radius: var(--radius-sm);
        cursor: pointer;
        transition: var(--transition);
        font-weight: 500;
    }
    
    .question-btn:hover {
        border-color: var(--primary-color);
        transform: translateY(-2px);
    }
    
    .question-btn.answered {
        background-color: var(--accent-color);
        border-color: var(--accent-color);
        color: white;
    }
    
    .question-btn.current {
        background-color: var(--primary-color);
        border-color: var(--primary-color);
        color: white;
    }
    
    .question-btn.flagged {
        background-color: var(--warning-color);
        border-color: var(--warning-color);
        color: var(--text-primary);
    }
    
    .nav-legend {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
        margin-bottom: 25px;
        padding-bottom: 25px;
        border-bottom: 1px solid var(--border-color);
    }
    
    .legend-item {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 0.9rem;
        color: var(--text-secondary);
    }
    
    .legend-color {
        width: 15px;
        height: 15px;
        border-radius: 3px;
        background-color: var(--border-color);
    }
    
    .legend-color.answered {
        background-color: var(--accent-color);
    }
    
    .legend-color.current {
        background-color: var(--primary-color);
    }
    
    .legend-color.flagged {
        background-color: var(--warning-color);
    }
    
    .exam-tools {
        display: grid;
        grid-template-columns: 1fr;
        gap: 10px;
    }
    
    .tool-btn {
        padding: 12px;
        background-color: var(--bg-white);
        border: 1px solid var(--border-color);
        border-radius: var(--radius-sm);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        transition: var(--transition);
        font-weight: 500;
    }
    
    .tool-btn:hover {
        border-color: var(--primary-color);
        background-color: rgba(67, 97, 238, 0.05);
    }
    
    /* Results Panel */
    .results-panel {
        background-color: var(--bg-white);
        border-radius: var(--radius);
        padding: 40px;
        box-shadow: var(--shadow);
    }
    
    .results-header {
        text-align: center;
        margin-bottom: 40px;
    }
    
    .results-header h2 {
        font-size: 2rem;
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
    }
    
    .results-summary {
        display: grid;
        grid-template-columns: 1fr 2fr;
        gap: 40px;
        margin-bottom: 40px;
    }
    
    .score-card {
        text-align: center;
    }
    
    .score-circle {
        position: relative;
        width: 120px;
        height: 120px;
        margin: 0 auto 20px;
    }
    
    .score-text {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
    
    .score-text h2 {
        font-size: 2.2rem;
        margin-bottom: 5px;
    }
    
    .score-details {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 15px;
        margin-top: 25px;
    }
    
    .detail {
        padding: 15px;
        background-color: var(--bg-light);
        border-radius: var(--radius-sm);
    }
    
    .detail h4 {
        font-size: 1.5rem;
        margin-bottom: 5px;
    }
    
    .detail p {
        font-size: 0.9rem;
        color: var(--text-secondary);
    }
    
    .performance-metrics h3 {
        font-size: 1.3rem;
        margin-bottom: 25px;
    }
    
    .metrics-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 15px;
    }
    
    .metric {
        text-align: center;
        padding: 20px;
        background-color: var(--bg-light);
        border-radius: var(--radius);
    }
    
    .metric-icon {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 15px;
        font-size: 1.5rem;
    }
    
    .metric-icon.accuracy {
        background-color: rgba(6, 214, 160, 0.1);
        color: var(--accent-color);
    }
    
    .metric-icon.speed {
        background-color: rgba(67, 97, 238, 0.1);
        color: var(--primary-color);
    }
    
    .metric-icon.percentile {
        background-color: rgba(114, 9, 183, 0.1);
        color: var(--secondary-color);
    }
    
    .metric-icon.improvement {
        background-color: rgba(255, 209, 102, 0.1);
        color: var(--warning-color);
    }
    
    .metric h4 {
        font-size: 1rem;
        margin-bottom: 5px;
    }
    
    .results-actions {
        display: flex;
        justify-content: center;
        gap: 15px;
        margin-bottom: 40px;
        padding-bottom: 40px;
        border-bottom: 1px solid var(--border-color);
    }
    
    .topic-breakdown h3 {
        font-size: 1.3rem;
        margin-bottom: 25px;
    }
    
    .topics-list {
        display: grid;
        grid-template-columns: 1fr;
        gap: 15px;
    }
    
    .topic-item {
        padding: 20px;
        background-color: var(--bg-light);
        border-radius: var(--radius);
    }
    
    .topic-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
    }
    
    .topic-info h4 {
        font-size: 1.1rem;
    }
    
    .topic-info span {
        font-size: 0.9rem;
        color: var(--text-secondary);
    }
    
    .topic-progress {
        display: flex;
        align-items: center;
        gap: 15px;
    }
    
    .progress-bar {
        flex: 1;
        height: 8px;
        background-color: var(--border-color);
        border-radius: 4px;
        overflow: hidden;
    }
    
    .progress-fill {
        height: 100%;
        background-color: var(--primary-color);
        border-radius: 4px;
        transition: width 1s ease;
    }
    
    .topic-percentage {
        font-weight: 600;
        min-width: 40px;
    }
    
    .explanation {
        margin-top: 30px;
        padding: 20px;
        background-color: var(--bg-light);
        border-radius: var(--radius);
        border-left: 4px solid var(--accent-color);
    }
    
    .explanation-header {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 15px;
    }
    
    .explanation-header h4 {
        color: var(--accent-color);
    }
    
    @media (max-width: 992px) {
        .exam-body {
            grid-template-columns: 1fr;
        }
        
        .question-panel {
            border-right: none;
            border-bottom: 1px solid var(--border-color);
        }
        
        .results-summary {
            grid-template-columns: 1fr;
        }
        
        .metrics-grid {
            grid-template-columns: repeat(2, 1fr);
        }
    }
    
    @media (max-width: 768px) {
        .exam-header {
            flex-direction: column;
            gap: 20px;
            text-align: center;
        }
        
        .exam-meta {
            flex-wrap: wrap;
            justify-content: center;
        }
        
        .question-header {
            flex-direction: column;
            gap: 15px;
            align-items: flex-start;
        }
        
        .question-actions {
            width: 100%;
        }
        
        .results-actions {
            flex-direction: column;
        }
        
        .setup-grid {
            grid-template-columns: 1fr;
        }
    }
    
    @media (max-width: 576px) {
        .exam-setup,
        .results-panel {
            padding: 25px;
        }
        
        .question-grid {
            grid-template-columns: repeat(4, 1fr);
        }
        
        .metrics-grid {
            grid-template-columns: 1fr;
        }
        
        .score-details {
            grid-template-columns: 1fr;
        }
    }
    `;
    document.head.appendChild(cbtStyles);
});