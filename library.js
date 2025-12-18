// ===== LIBRARY MANAGER =====
class LibraryManager {
    constructor() {
        this.currentView = 'grid';
        this.currentPage = 1;
        this.itemsPerPage = 12;
        this.filteredItems = [];
        this.allItems = [];
        
        this.init();
    }
    
    init() {
        this.cacheElements();
        this.bindEvents();
        this.loadDemoData();
        this.renderItems();
        this.updateResultsCount();
    }
    
    cacheElements() {
        this.elements = {
            searchInput: document.getElementById('searchInput'),
            searchBtn: document.getElementById('searchBtn'),
            examFilter: document.getElementById('examFilter'),
            subjectFilter: document.getElementById('subjectFilter'),
            yearFilter: document.getElementById('yearFilter'),
            classFilter: document.getElementById('classFilter'),
            termFilter: document.getElementById('termFilter'),
            difficultyFilter: document.getElementById('difficultyFilter'),
            resetFilters: document.getElementById('resetFilters'),
            applyFilters: document.getElementById('applyFilters'),
            questionsGrid: document.getElementById('questionsGrid'),
            resultsCount: document.getElementById('resultsCount'),
            viewOptions: document.querySelectorAll('.view-option'),
            sortBy: document.getElementById('sortBy'),
            prevPage: document.getElementById('prevPage'),
            nextPage: document.getElementById('nextPage'),
            pageNumbers: document.getElementById('pageNumbers'),
            noResults: document.getElementById('noResults'),
            clearSearch: document.getElementById('clearSearch'),
            questionSetModal: document.getElementById('questionSetModal'),
            modalSetTitle: document.getElementById('modalSetTitle'),
            modalExamType: document.getElementById('modalExamType'),
            modalSubject: document.getElementById('modalSubject'),
            modalYear: document.getElementById('modalYear'),
            modalQuestionCount: document.getElementById('modalQuestionCount'),
            modalDescription: document.getElementById('modalDescription'),
            modalTopics: document.getElementById('modalTopics'),
            practiceOnlineBtn: document.getElementById('practiceOnlineBtn'),
            downloadPdfBtn: document.getElementById('downloadPdfBtn'),
            saveSetBtn: document.getElementById('saveSetBtn')
        };
    }
    
    bindEvents() {
        // Search
        this.elements.searchBtn.addEventListener('click', () => this.applyFilters());
        this.elements.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.applyFilters();
        });
        
        // Filter buttons
        this.elements.applyFilters.addEventListener('click', () => this.applyFilters());
        this.elements.resetFilters.addEventListener('click', () => this.resetFilters());
        
        // View options
        this.elements.viewOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                this.elements.viewOptions.forEach(opt => opt.classList.remove('active'));
                e.target.closest('.view-option').classList.add('active');
                this.currentView = e.target.closest('.view-option').dataset.view;
                this.renderItems();
            });
        });
        
        // Sort
        this.elements.sortBy.addEventListener('change', () => this.applyFilters());
        
        // Pagination
        this.elements.prevPage.addEventListener('click', () => this.prevPage());
        this.elements.nextPage.addEventListener('click', () => this.nextPage());
        
        // Clear search
        this.elements.clearSearch?.addEventListener('click', () => {
            this.elements.searchInput.value = '';
            this.applyFilters();
        });
        
        // Modal buttons
        this.elements.practiceOnlineBtn?.addEventListener('click', () => {
            this.practiceOnline();
        });
        
        this.elements.downloadPdfBtn?.addEventListener('click', () => {
            this.downloadPdf();
        });
        
        this.elements.saveSetBtn?.addEventListener('click', () => {
            this.saveToLibrary();
        });
    }
    
    loadDemoData() {
        // Demo data - in production, this would come from an API
        this.allItems = [
            {
                id: 1,
                title: "WAEC Mathematics 2023",
                examType: "WAEC",
                subject: "Mathematics",
                year: "2023",
                classLevel: "SS3",
                term: null,
                questionCount: 60,
                difficulty: "medium",
                popularity: 95,
                description: "Complete WAEC Mathematics objective questions from 2023 examination. Includes all topics: Algebra, Geometry, Trigonometry, Calculus, and Statistics.",
                topics: ["Algebra", "Geometry", "Trigonometry", "Calculus", "Statistics"],
                hasSolutions: true,
                hasExplanations: true,
                downloadCount: 1245,
                lastUpdated: "2024-01-15"
            },
            {
                id: 2,
                title: "JAMB English 2024",
                examType: "JAMB",
                subject: "English",
                year: "2024",
                classLevel: "SS3",
                term: null,
                questionCount: 40,
                difficulty: "medium",
                popularity: 88,
                description: "JAMB English Language CBT questions with comprehension passages, lexis & structure, and oral English sections.",
                topics: ["Comprehension", "Lexis & Structure", "Oral English"],
                hasSolutions: true,
                hasExplanations: false,
                downloadCount: 987,
                lastUpdated: "2024-02-10"
            },
            {
                id: 3,
                title: "NECO Physics 2022",
                examType: "NECO",
                subject: "Physics",
                year: "2022",
                classLevel: "SS3",
                term: null,
                questionCount: 50,
                difficulty: "hard",
                popularity: 76,
                description: "NECO Physics objective and theory questions with detailed solutions and diagrams.",
                topics: ["Mechanics", "Electricity", "Waves", "Thermodynamics"],
                hasSolutions: true,
                hasExplanations: true,
                downloadCount: 654,
                lastUpdated: "2023-11-20"
            },
            {
                id: 4,
                title: "JSS2 Mathematics 1st Term 2023",
                examType: "Term",
                subject: "Mathematics",
                year: "2023",
                classLevel: "JSS2",
                term: "1st",
                questionCount: 30,
                difficulty: "easy",
                popularity: 67,
                description: "First term Mathematics examination for Junior Secondary School 2 students.",
                topics: ["Basic Operations", "Fractions", "Decimals", "Geometry"],
                hasSolutions: true,
                hasExplanations: false,
                downloadCount: 432,
                lastUpdated: "2023-09-05"
            },
            {
                id: 5,
                title: "WAEC Chemistry 2022",
                examType: "WAEC",
                subject: "Chemistry",
                year: "2022",
                classLevel: "SS3",
                term: null,
                questionCount: 55,
                difficulty: "medium",
                popularity: 82,
                description: "WAEC Chemistry practical and theory questions with step-by-step solutions.",
                topics: ["Organic Chemistry", "Inorganic Chemistry", "Physical Chemistry"],
                hasSolutions: true,
                hasExplanations: true,
                downloadCount: 789,
                lastUpdated: "2023-10-15"
            },
            {
                id: 6,
                title: "SS1 Biology 2nd Term 2023",
                examType: "Term",
                subject: "Biology",
                year: "2023",
                classLevel: "SS1",
                term: "2nd",
                questionCount: 35,
                difficulty: "medium",
                popularity: 71,
                description: "Second term Biology examination for Senior Secondary School 1 students.",
                topics: ["Cell Biology", "Genetics", "Ecology"],
                hasSolutions: true,
                hasExplanations: false,
                downloadCount: 321,
                lastUpdated: "2023-11-30"
            },
            {
                id: 7,
                title: "JAMB Mathematics 2023",
                examType: "JAMB",
                subject: "Mathematics",
                year: "2023",
                classLevel: "SS3",
                term: null,
                questionCount: 40,
                difficulty: "medium",
                popularity: 91,
                description: "JAMB Mathematics CBT questions covering all topics in the syllabus.",
                topics: ["Algebra", "Geometry", "Trigonometry", "Calculus"],
                hasSolutions: true,
                hasExplanations: true,
                downloadCount: 1123,
                lastUpdated: "2024-01-20"
            },
            {
                id: 8,
                title: "NECO Economics 2021",
                examType: "NECO",
                subject: "Economics",
                year: "2021",
                classLevel: "SS3",
                term: null,
                questionCount: 45,
                difficulty: "easy",
                popularity: 63,
                description: "NECO Economics objective and essay questions with model answers.",
                topics: ["Microeconomics", "Macroeconomics", "Development Economics"],
                hasSolutions: true,
                hasExplanations: false,
                downloadCount: 456,
                lastUpdated: "2023-08-12"
            },
            {
                id: 9,
                title: "JSS3 Basic Science 3rd Term 2023",
                examType: "Term",
                subject: "Basic Science",
                year: "2023",
                classLevel: "JSS3",
                term: "3rd",
                questionCount: 40,
                difficulty: "easy",
                popularity: 58,
                description: "Third term Basic Science examination for Junior Secondary School 3 students.",
                topics: ["Physics", "Chemistry", "Biology Basics"],
                hasSolutions: true,
                hasExplanations: false,
                downloadCount: 234,
                lastUpdated: "2023-12-15"
            },
            {
                id: 10,
                title: "WAEC Government 2024",
                examType: "WAEC",
                subject: "Government",
                year: "2024",
                classLevel: "SS3",
                term: null,
                questionCount: 50,
                difficulty: "medium",
                popularity: 74,
                description: "WAEC Government questions covering Nigerian and world political systems.",
                topics: ["Political Systems", "Constitution", "International Relations"],
                hasSolutions: true,
                hasExplanations: true,
                downloadCount: 567,
                lastUpdated: "2024-02-28"
            },
            {
                id: 11,
                title: "JAMB Physics 2022",
                examType: "JAMB",
                subject: "Physics",
                year: "2022",
                classLevel: "SS3",
                term: null,
                questionCount: 40,
                difficulty: "hard",
                popularity: 79,
                description: "JAMB Physics CBT questions with calculations and conceptual problems.",
                topics: ["Mechanics", "Electricity", "Waves", "Modern Physics"],
                hasSolutions: true,
                hasExplanations: true,
                downloadCount: 678,
                lastUpdated: "2023-09-25"
            },
            {
                id: 12,
                title: "SS2 ICT 1st Term 2023",
                examType: "Term",
                subject: "ICT",
                year: "2023",
                classLevel: "SS2",
                term: "1st",
                questionCount: 25,
                difficulty: "easy",
                popularity: 52,
                description: "First term Information Technology examination for Senior Secondary School 2.",
                topics: ["Computer Hardware", "Software", "Networking", "Programming"],
                hasSolutions: true,
                hasExplanations: false,
                downloadCount: 189,
                lastUpdated: "2023-10-05"
            }
        ];
        
        this.filteredItems = [...this.allItems];
    }
    
    applyFilters() {
        const searchTerm = this.elements.searchInput.value.toLowerCase();
        const examType = this.elements.examFilter.value;
        const subject = this.elements.subjectFilter.value;
        const year = this.elements.yearFilter.value;
        const classLevel = this.elements.classFilter.value;
        const term = this.elements.termFilter.value;
        const difficulty = this.elements.difficultyFilter.value;
        const sortBy = this.elements.sortBy.value;
        
        // Filter items
        this.filteredItems = this.allItems.filter(item => {
            // Search term
            if (searchTerm && !item.title.toLowerCase().includes(searchTerm) && 
                !item.description.toLowerCase().includes(searchTerm) &&
                !item.subject.toLowerCase().includes(searchTerm)) {
                return false;
            }
            
            // Exam type
            if (examType !== 'all' && item.examType.toLowerCase() !== examType) {
                return false;
            }
            
            // Subject
            if (subject !== 'all' && item.subject.toLowerCase() !== subject) {
                return false;
            }
            
            // Year
            if (year !== 'all' && item.year !== year) {
                return false;
            }
            
            // Class level
            if (classLevel !== 'all' && item.classLevel.toLowerCase() !== classLevel) {
                return false;
            }
            
            // Term
            if (term !== 'all') {
                if (term === '1st' && item.term !== '1st') return false;
                if (term === '2nd' && item.term !== '2nd') return false;
                if (term === '3rd' && item.term !== '3rd') return false;
            }
            
            // Difficulty
            if (difficulty !== 'all' && item.difficulty !== difficulty) {
                return false;
            }
            
            return true;
        });
        
        // Sort items
        this.sortItems(sortBy);
        
        // Reset to first page
        this.currentPage = 1;
        
        // Update UI
        this.renderItems();
        this.updateResultsCount();
        this.updatePagination();
    }
    
    sortItems(sortBy) {
        switch (sortBy) {
            case 'newest':
                this.filteredItems.sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated));
                break;
            case 'oldest':
                this.filteredItems.sort((a, b) => new Date(a.lastUpdated) - new Date(b.lastUpdated));
                break;
            case 'popular':
                this.filteredItems.sort((a, b) => b.popularity - a.popularity);
                break;
            case 'difficulty':
                const difficultyOrder = { 'easy': 1, 'medium': 2, 'hard': 3 };
                this.filteredItems.sort((a, b) => difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]);
                break;
        }
    }
    
    resetFilters() {
        this.elements.searchInput.value = '';
        this.elements.examFilter.value = 'all';
        this.elements.subjectFilter.value = 'all';
        this.elements.yearFilter.value = 'all';
        this.elements.classFilter.value = 'all';
        this.elements.termFilter.value = 'all';
        this.elements.difficultyFilter.value = 'all';
        this.elements.sortBy.value = 'newest';
        
        this.filteredItems = [...this.allItems];
        this.currentPage = 1;
        
        this.renderItems();
        this.updateResultsCount();
        this.updatePagination();
    }
    
    renderItems() {
        const grid = this.elements.questionsGrid;
        if (!grid) return;
        
        // Calculate pagination
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const pageItems = this.filteredItems.slice(startIndex, endIndex);
        
        // Clear grid
        grid.innerHTML = '';
        
        // Show/hide no results message
        if (this.filteredItems.length === 0) {
            this.elements.noResults.style.display = 'block';
            return;
        } else {
            this.elements.noResults.style.display = 'none';
        }
        
        // Render items
        pageItems.forEach(item => {
            const itemElement = this.createItemElement(item);
            grid.appendChild(itemElement);
        });
        
        // Update pagination
        this.updatePagination();
    }
    
    createItemElement(item) {
        const div = document.createElement('div');
        div.className = `question-item ${this.currentView}`;
        div.dataset.id = item.id;
        
        // Get exam type color
        const examColors = {
            'WAEC': '#4361ee',
            'JAMB': '#7209b7',
            'NECO': '#06d6a0',
            'Term': '#ff9e00'
        };
        
        const examColor = examColors[item.examType] || '#4361ee';
        
        if (this.currentView === 'grid') {
            div.innerHTML = `
                <div class="item-header" style="border-top: 5px solid ${examColor}">
                    <span class="exam-badge" style="background-color: ${examColor}">${item.examType}</span>
                    <span class="year-badge">${item.year}</span>
                </div>
                <div class="item-body">
                    <h3>${item.title}</h3>
                    <div class="item-meta">
                        <span><i class="fas fa-book"></i> ${item.subject}</span>
                        <span><i class="fas fa-file-alt"></i> ${item.questionCount} Questions</span>
                    </div>
                    <p class="item-description">${item.description.substring(0, 100)}...</p>
                    <div class="item-footer">
                        <div class="difficulty">
                            <span class="difficulty-dot ${item.difficulty}"></span>
                            <span>${item.difficulty.charAt(0).toUpperCase() + item.difficulty.slice(1)}</span>
                        </div>
                        <div class="popularity">
                            <i class="fas fa-fire"></i>
                            <span>${item.popularity}%</span>
                        </div>
                    </div>
                </div>
                <div class="item-actions">
                    <button class="btn btn-outline btn-small view-btn">
                        <i class="fas fa-eye"></i> View
                    </button>
                    <button class="btn btn-primary btn-small practice-btn">
                        <i class="fas fa-play-circle"></i> Practice
                    </button>
                </div>
            `;
        } else {
            // List view
            div.innerHTML = `
                <div class="list-item">
                    <div class="list-left">
                        <div class="list-header">
                            <span class="exam-badge" style="background-color: ${examColor}">${item.examType}</span>
                            <h3>${item.title}</h3>
                            <span class="year-badge">${item.year}</span>
                        </div>
                        <div class="list-meta">
                            <span><i class="fas fa-book"></i> ${item.subject}</span>
                            <span><i class="fas fa-user-graduate"></i> ${item.classLevel}</span>
                            <span><i class="fas fa-file-alt"></i> ${item.questionCount} Questions</span>
                            <span><i class="fas fa-chart-line"></i> ${item.difficulty.charAt(0).toUpperCase() + item.difficulty.slice(1)}</span>
                        </div>
                        <p class="list-description">${item.description}</p>
                    </div>
                    <div class="list-right">
                        <div class="list-stats">
                            <div class="stat">
                                <i class="fas fa-fire"></i>
                                <span>${item.popularity}% Popular</span>
                            </div>
                            <div class="stat">
                                <i class="fas fa-download"></i>
                                <span>${item.downloadCount} Downloads</span>
                            </div>
                        </div>
                        <div class="list-actions">
                            <button class="btn btn-outline view-btn">
                                <i class="fas fa-eye"></i> View Details
                            </button>
                            <button class="btn btn-primary practice-btn">
                                <i class="fas fa-play-circle"></i> Practice Now
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }
        
        // Add event listeners
        div.querySelector('.view-btn').addEventListener('click', () => {
            this.openItemModal(item);
        });
        
        div.querySelector('.practice-btn').addEventListener('click', () => {
            this.startPractice(item);
        });
        
        return div;
    }
    
    openItemModal(item) {
        // Update modal content
        this.elements.modalSetTitle.textContent = item.title;
        this.elements.modalExamType.textContent = item.examType;
        this.elements.modalSubject.textContent = item.subject;
        this.elements.modalYear.textContent = item.year;
        this.elements.modalQuestionCount.textContent = item.questionCount;
        this.elements.modalDescription.textContent = item.description;
        
        // Update topics
        const topicsContainer = this.elements.modalTopics;
        topicsContainer.innerHTML = '';
        
        item.topics.forEach(topic => {
            const span = document.createElement('span');
            span.className = 'topic-tag';
            span.textContent = topic;
            topicsContainer.appendChild(span);
        });
        
        // Update button data
        this.elements.practiceOnlineBtn.dataset.id = item.id;
        this.elements.downloadPdfBtn.dataset.id = item.id;
        this.elements.saveSetBtn.dataset.id = item.id;
        
        // Open modal
        this.elements.questionSetModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    startPractice(item) {
        // Redirect to CBT page with parameters
        const params = new URLSearchParams({
            exam: item.examType.toLowerCase(),
            subject: item.subject.toLowerCase(),
            questions: item.questionCount,
            practice: 'true'
        });
        
        window.location.href = `cbt.html?${params.toString()}`;
    }
    
    practiceOnline() {
        const itemId = this.elements.practiceOnlineBtn.dataset.id;
        const item = this.allItems.find(i => i.id == itemId);
        
        if (item) {
            this.startPractice(item);
            this.closeModal();
        }
    }
    
    downloadPdf() {
        const itemId = this.elements.downloadPdfBtn.dataset.id;
        
        // In a real implementation, this would trigger a PDF download
        if (window.ExamMaster) {
            window.ExamMaster.showNotification('Preparing PDF download...', 'info');
        }
        
        // Simulate download
        setTimeout(() => {
            if (window.ExamMaster) {
                window.ExamMaster.showNotification('PDF download started!', 'success');
            }
        }, 1500);
    }
    
    saveToLibrary() {
        const itemId = this.elements.saveSetBtn.dataset.id;
        const item = this.allItems.find(i => i.id == itemId);
        
        if (!item) return;
        
        // Get user's saved items
        let savedItems = JSON.parse(localStorage.getItem('savedItems') || '[]');
        
        // Check if already saved
        if (savedItems.some(saved => saved.id == itemId)) {
            if (window.ExamMaster) {
                window.ExamMaster.showNotification('Already saved to your library!', 'info');
            }
            return;
        }
        
        // Save item
        savedItems.push({
            id: item.id,
            title: item.title,
            examType: item.examType,
            subject: item.subject,
            savedAt: new Date().toISOString()
        });
        
        localStorage.setItem('savedItems', JSON.stringify(savedItems));
        
        if (window.ExamMaster) {
            window.ExamMaster.showNotification('Saved to your library!', 'success');
        }
    }
    
    closeModal() {
        this.elements.questionSetModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
    
    updateResultsCount() {
        if (this.elements.resultsCount) {
            this.elements.resultsCount.textContent = this.filteredItems.length.toLocaleString();
        }
    }
    
    updatePagination() {
        const totalPages = Math.ceil(this.filteredItems.length / this.itemsPerPage);
        
        // Update prev/next buttons
        this.elements.prevPage.disabled = this.currentPage === 1;
        this.elements.nextPage.disabled = this.currentPage === totalPages || totalPages === 0;
        
        // Update page numbers
        const pageNumbersContainer = this.elements.pageNumbers;
        pageNumbersContainer.innerHTML = '';
        
        // Show up to 5 page numbers
        let startPage = Math.max(1, this.currentPage - 2);
        let endPage = Math.min(totalPages, startPage + 4);
        
        if (endPage - startPage < 4) {
            startPage = Math.max(1, endPage - 4);
        }
        
        for (let i = startPage; i <= endPage; i++) {
            const span = document.createElement('span');
            span.className = `page-number ${i === this.currentPage ? 'active' : ''}`;
            span.textContent = i;
            span.addEventListener('click', () => {
                this.goToPage(i);
            });
            pageNumbersContainer.appendChild(span);
        }
    }
    
    goToPage(page) {
        if (page < 1 || page > Math.ceil(this.filteredItems.length / this.itemsPerPage)) {
            return;
        }
        
        this.currentPage = page;
        this.renderItems();
        this.updatePagination();
        
        // Scroll to top of grid
        this.elements.questionsGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    prevPage() {
        this.goToPage(this.currentPage - 1);
    }
    
    nextPage() {
        this.goToPage(this.currentPage + 1);
    }
}

// ===== INITIALIZE LIBRARY MANAGER =====
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the library page
    if (document.getElementById('questionsGrid')) {
        const libraryManager = new LibraryManager();
        
        // Make manager available globally
        window.libraryManager = libraryManager;
        
        // Close modal on outside click or close button
        const modal = document.getElementById('questionSetModal');
        const modalClose = modal.querySelector('.modal-close');
        
        modalClose.addEventListener('click', () => {
            libraryManager.closeModal();
        });
        
        window.addEventListener('click', function(event) {
            if (event.target === modal) {
                libraryManager.closeModal();
            }
        });
    }
    
    // Add library-specific styles
    const libraryStyles = document.createElement('style');
    libraryStyles.textContent = `
    .library-container {
        padding-top: 120px;
        min-height: 100vh;
    }
    
    .library-header {
        text-align: center;
        margin-bottom: 40px;
    }
    
    .library-header h1 {
        font-size: 2.5rem;
        margin-bottom: 1rem;
        color: var(--text-primary);
    }
    
    .library-header p {
        color: var(--text-secondary);
        font-size: 1.1rem;
        max-width: 600px;
        margin: 0 auto;
    }
    
    .library-filters {
        background-color: var(--bg-white);
        border-radius: var(--radius);
        padding: 30px;
        box-shadow: var(--shadow);
        margin-bottom: 30px;
    }
    
    .search-bar {
        display: flex;
        gap: 10px;
        margin-bottom: 25px;
        position: relative;
    }
    
    .search-bar i {
        position: absolute;
        left: 15px;
        top: 50%;
        transform: translateY(-50%);
        color: var(--text-secondary);
    }
    
    .search-bar input {
        flex: 1;
        padding: 15px 15px 15px 45px;
        border: 2px solid var(--border-color);
        border-radius: var(--radius-sm);
        background-color: var(--bg-light);
        color: var(--text-primary);
        font-family: 'Poppins', sans-serif;
        font-size: 1rem;
    }
    
    .search-bar input:focus {
        outline: none;
        border-color: var(--primary-color);
    }
    
    .filter-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 20px;
        margin-bottom: 25px;
    }
    
    .filter-group {
        display: flex;
        flex-direction: column;
    }
    
    .filter-group label {
        margin-bottom: 8px;
        font-weight: 500;
        color: var(--text-primary);
        display: flex;
        align-items: center;
        gap: 8px;
    }
    
    .filter-group select {
        padding: 12px 15px;
        border: 1px solid var(--border-color);
        border-radius: var(--radius-sm);
        background-color: var(--bg-light);
        color: var(--text-primary);
        font-family: 'Poppins', sans-serif;
        font-size: 1rem;
    }
    
    .filter-actions {
        display: flex;
        justify-content: flex-end;
        gap: 15px;
    }
    
    .results-stats {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 25px;
        padding-bottom: 20px;
        border-bottom: 1px solid var(--border-color);
    }
    
    .results-stats h3 {
        font-size: 1.2rem;
        color: var(--text-primary);
    }
    
    .results-stats span {
        color: var(--primary-color);
    }
    
    .view-options {
        display: flex;
        align-items: center;
        gap: 15px;
    }
    
    .view-option {
        padding: 8px 15px;
        background-color: var(--bg-light);
        border: 1px solid var(--border-color);
        border-radius: var(--radius-sm);
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 8px;
        transition: var(--transition);
    }
    
    .view-option.active {
        background-color: var(--primary-color);
        color: white;
        border-color: var(--primary-color);
    }
    
    .sort-options {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .sort-options label {
        color: var(--text-secondary);
    }
    
    .sort-options select {
        padding: 8px 12px;
        border: 1px solid var(--border-color);
        border-radius: var(--radius-sm);
        background-color: var(--bg-light);
        color: var(--text-primary);
    }
    
    .questions-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 25px;
        margin-bottom: 40px;
    }
    
    .question-item.grid {
        background-color: var(--bg-white);
        border-radius: var(--radius);
        overflow: hidden;
        box-shadow: var(--shadow);
        transition: var(--transition);
        display: flex;
        flex-direction: column;
    }
    
    .question-item.grid:hover {
        transform: translateY(-5px);
        box-shadow: var(--shadow-lg);
    }
    
    .item-header {
        padding: 20px 20px 10px;
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
    }
    
    .exam-badge {
        padding: 5px 12px;
        border-radius: 20px;
        color: white;
        font-size: 0.8rem;
        font-weight: 600;
    }
    
    .year-badge {
        padding: 5px 10px;
        background-color: var(--bg-light);
        border-radius: var(--radius-sm);
        font-size: 0.9rem;
        font-weight: 500;
    }
    
    .item-body {
        padding: 0 20px 20px;
        flex: 1;
    }
    
    .item-body h3 {
        font-size: 1.2rem;
        margin-bottom: 15px;
        color: var(--text-primary);
        line-height: 1.4;
    }
    
    .item-meta {
        display: flex;
        gap: 15px;
        margin-bottom: 15px;
        font-size: 0.9rem;
        color: var(--text-secondary);
    }
    
    .item-meta span {
        display: flex;
        align-items: center;
        gap: 5px;
    }
    
    .item-description {
        color: var(--text-secondary);
        font-size: 0.95rem;
        line-height: 1.5;
        margin-bottom: 20px;
    }
    
    .item-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-top: 15px;
        border-top: 1px solid var(--border-color);
    }
    
    .difficulty {
        display: flex;
        align-items: center;
        gap: 8px;
    }
    
    .difficulty-dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
    }
    
    .difficulty-dot.easy {
        background-color: var(--accent-color);
    }
    
    .difficulty-dot.medium {
        background-color: var(--warning-color);
    }
    
    .difficulty-dot.hard {
        background-color: var(--danger-color);
    }
    
    .popularity {
        display: flex;
        align-items: center;
        gap: 5px;
        color: var(--text-secondary);
        font-size: 0.9rem;
    }
    
    .popularity i {
        color: #ff6b6b;
    }
    
    .item-actions {
        padding: 20px;
        border-top: 1px solid var(--border-color);
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
    }
    
    .btn-small {
        padding: 8px 15px;
        font-size: 0.9rem;
    }
    
    /* List View */
    .question-item.list {
        background-color: var(--bg-white);
        border-radius: var(--radius);
        overflow: hidden;
        box-shadow: var(--shadow);
        transition: var(--transition);
    }
    
    .list-item {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: 30px;
        padding: 25px;
    }
    
    .list-header {
        display: flex;
        align-items: center;
        gap: 15px;
        margin-bottom: 15px;
    }
    
    .list-header h3 {
        font-size: 1.3rem;
        color: var(--text-primary);
        margin: 0;
    }
    
    .list-meta {
        display: flex;
        flex-wrap: wrap;
        gap: 15px;
        margin-bottom: 15px;
        font-size: 0.9rem;
        color: var(--text-secondary);
    }
    
    .list-meta span {
        display: flex;
        align-items: center;
        gap: 5px;
    }
    
    .list-description {
        color: var(--text-secondary);
        line-height: 1.6;
    }
    
    .list-stats {
        display: grid;
        grid-template-columns: 1fr;
        gap: 10px;
        margin-bottom: 20px;
    }
    
    .stat {
        display: flex;
        align-items: center;
        gap: 8px;
        color: var(--text-secondary);
    }
    
    .list-actions {
        display: grid;
        grid-template-columns: 1fr;
        gap: 10px;
    }
    
    /* Pagination */
    .pagination {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 20px;
        margin-top: 40px;
    }
    
    .pagination-btn {
        padding: 10px 20px;
        background-color: var(--bg-white);
        border: 1px solid var(--border-color);
        border-radius: var(--radius-sm);
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 8px;
        transition: var(--transition);
    }
    
    .pagination-btn:hover:not(:disabled) {
        border-color: var(--primary-color);
        background-color: rgba(67, 97, 238, 0.05);
    }
    
    .pagination-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
    
    .page-numbers {
        display: flex;
        gap: 5px;
    }
    
    .page-number {
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: var(--radius-sm);
        cursor: pointer;
        transition: var(--transition);
        font-weight: 500;
    }
    
    .page-number:hover:not(.active) {
        background-color: var(--bg-light);
    }
    
    .page-number.active {
        background-color: var(--primary-color);
        color: white;
    }
    
    /* No Results */
    .no-results {
        text-align: center;
        padding: 60px 20px;
    }
    
    .no-results i {
        font-size: 4rem;
        color: var(--border-color);
        margin-bottom: 20px;
    }
    
    .no-results h3 {
        font-size: 1.5rem;
        margin-bottom: 10px;
        color: var(--text-primary);
    }
    
    .no-results p {
        color: var(--text-secondary);
        margin-bottom: 25px;
    }
    
    /* Modal */
    .wide-modal {
        max-width: 800px;
    }
    
    .set-details {
        display: grid;
        grid-template-columns: 1fr;
        gap: 30px;
    }
    
    .detail-row {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 20px;
        padding-bottom: 25px;
        border-bottom: 1px solid var(--border-color);
    }
    
    .detail-item {
        display: flex;
        align-items: center;
        gap: 15px;
    }
    
    .detail-item i {
        font-size: 1.5rem;
        color: var(--primary-color);
    }
    
    .detail-label {
        display: block;
        font-size: 0.9rem;
        color: var(--text-secondary);
        margin-bottom: 5px;
    }
    
    .detail-value {
        display: block;
        font-weight: 600;
        color: var(--text-primary);
    }
    
    .set-description h4 {
        font-size: 1.2rem;
        margin-bottom: 15px;
        color: var(--text-primary);
    }
    
    .set-description p {
        color: var(--text-secondary);
        line-height: 1.6;
    }
    
    .action-buttons {
        display: flex;
        gap: 15px;
    }
    
    .topic-breakdown h4 {
        font-size: 1.2rem;
        margin-bottom: 15px;
        color: var(--text-primary);
    }
    
    .topics-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
    }
    
    .topic-tag {
        padding: 8px 15px;
        background-color: var(--bg-light);
        border-radius: 20px;
        font-size: 0.9rem;
        color: var(--text-secondary);
    }
    
    @media (max-width: 992px) {
        .questions-grid {
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        }
        
        .list-item {
            grid-template-columns: 1fr;
            gap: 20px;
        }
    }
    
    @media (max-width: 768px) {
        .results-stats {
            flex-direction: column;
            gap: 20px;
            align-items: flex-start;
        }
        
        .view-options {
            width: 100%;
            justify-content: space-between;
        }
        
        .filter-grid {
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        }
        
        .action-buttons {
            flex-direction: column;
        }
        
        .pagination {
            flex-wrap: wrap;
        }
    }
    
    @media (max-width: 576px) {
        .library-filters {
            padding: 20px;
        }
        
        .search-bar {
            flex-direction: column;
        }
        
        .search-bar i {
            top: 18px;
        }
        
        .questions-grid {
            grid-template-columns: 1fr;
        }
        
        .detail-row {
            grid-template-columns: 1fr;
        }
    }
    `;
    document.head.appendChild(libraryStyles);
});