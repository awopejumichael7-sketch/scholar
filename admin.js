// ===== ADMIN PANEL MANAGER =====
class AdminPanelManager {
    constructor() {
        this.currentTab = 'questions';
        this.questions = [];
        this.users = [];
        
        this.init();
    }
    
    init() {
        this.cacheElements();
        this.bindEvents();
        this.loadSampleData();
        this.setupTabs();
        this.renderQuestionsTable();
        this.renderUsersTable();
        this.renderRecentContent();
        this.initCharts();
    }
    
    cacheElements() {
        this.elements = {
            // Tab buttons
            tabBtns: document.querySelectorAll('.tab-btn'),
            tabContents: document.querySelectorAll('.admin-tab-content'),
            
            // Questions tab
            questionsTableBody: document.getElementById('questionsTableBody'),
            addQuestionBtn: document.getElementById('addQuestionBtn'),
            importQuestionsBtn: document.getElementById('importQuestionsBtn'),
            selectAllQuestions: document.getElementById('selectAllQuestions'),
            
            // Users tab
            usersTableBody: document.getElementById('usersTableBody'),
            addUserBtn: document.getElementById('addUserBtn'),
            selectAllUsers: document.getElementById('selectAllUsers'),
            
            // Modals
            addQuestionModal: document.getElementById('addQuestionModal'),
            importQuestionsModal: document.getElementById('importQuestionsModal'),
            editUserModal: document.getElementById('editUserModal'),
            
            // Charts
            userGrowthChart: document.getElementById('userGrowthChart'),
            examUsageChart: document.getElementById('examUsageChart'),
            revenueChart: document.getElementById('revenueChart'),
            subjectChart: document.getElementById('subjectChart'),
            
            // Content
            recentContentList: document.getElementById('recentContentList'),
            
            // Settings
            saveSettingsBtn: document.getElementById('saveSettingsBtn')
        };
    }
    
    bindEvents() {
        // Tab switching
        this.elements.tabBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = e.target.dataset.tab;
                this.switchTab(tab);
            });
        });
        
        // Question management
        this.elements.addQuestionBtn?.addEventListener('click', () => {
            this.openAddQuestionModal();
        });
        
        this.elements.importQuestionsBtn?.addEventListener('click', () => {
            this.openImportQuestionsModal();
        });
        
        this.elements.selectAllQuestions?.addEventListener('change', (e) => {
            this.toggleSelectAllQuestions(e.target.checked);
        });
        
        // User management
        this.elements.addUserBtn?.addEventListener('click', () => {
            this.openAddUserModal();
        });
        
        this.elements.selectAllUsers?.addEventListener('change', (e) => {
            this.toggleSelectAllUsers(e.target.checked);
        });
        
        // Settings
        this.elements.saveSettingsBtn?.addEventListener('click', () => {
            this.saveSettings();
        });
        
        // Modal close buttons
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', () => {
                this.closeAllModals();
            });
        });
        
        // Close modals on outside click
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeAllModals();
            }
        });
        
        // Add question form
        document.getElementById('addQuestionForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addNewQuestion();
        });
        
        // Edit user form
        document.getElementById('editUserForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveUserChanges();
        });
        
        // Start import button
        document.getElementById('startImportBtn')?.addEventListener('click', () => {
            this.startImport();
        });
    }
    
    loadSampleData() {
        // Sample questions data
        this.questions = [
            {
                id: 1001,
                text: "Find the value of x if 2x + 5 = 15",
                exam: "WAEC",
                subject: "Mathematics",
                year: "2023",
                difficulty: "easy",
                status: "active",
                createdAt: "2024-03-10"
            },
            {
                id: 1002,
                text: "What is the capital of Nigeria?",
                exam: "JAMB",
                subject: "Government",
                year: "2024",
                difficulty: "easy",
                status: "active",
                createdAt: "2024-03-12"
            },
            {
                id: 1003,
                text: "Calculate the force acting on a 5kg mass with acceleration 2m/s²",
                exam: "NECO",
                subject: "Physics",
                year: "2022",
                difficulty: "medium",
                status: "pending",
                createdAt: "2024-03-08"
            },
            {
                id: 1004,
                text: "Which organelle is responsible for protein synthesis?",
                exam: "WAEC",
                subject: "Biology",
                year: "2023",
                difficulty: "medium",
                status: "active",
                createdAt: "2024-03-05"
            },
            {
                id: 1005,
                text: "Solve the quadratic equation: x² - 5x + 6 = 0",
                exam: "Term",
                subject: "Mathematics",
                year: "2023",
                difficulty: "medium",
                status: "archived",
                createdAt: "2024-02-28"
            }
        ];
        
        // Sample users data
        this.users = [
            {
                id: 2001,
                name: "Chinedu Okafor",
                email: "chinedu@example.com",
                class: "SS3",
                plan: "premium",
                tests: 42,
                status: "active",
                joinDate: "2024-01-15"
            },
            {
                id: 2002,
                name: "Amina Yusuf",
                email: "amina@example.com",
                class: "SS2",
                plan: "free",
                tests: 18,
                status: "active",
                joinDate: "2024-02-10"
            },
            {
                id: 2003,
                name: "Tunde Balogun",
                email: "tunde@example.com",
                class: "SS3",
                plan: "school",
                tests: 56,
                status: "active",
                joinDate: "2024-01-05"
            },
            {
                id: 2004,
                name: "Funke Adebayo",
                email: "funke@example.com",
                class: "JSS3",
                plan: "premium",
                tests: 32,
                status: "inactive",
                joinDate: "2024-02-20"
            },
            {
                id: 2005,
                name: "Emeka Nwankwo",
                email: "emeka@example.com",
                class: "SS1",
                plan: "free",
                tests: 7,
                status: "suspended",
                joinDate: "2024-03-01"
            }
        ];
    }
    
    setupTabs() {
        // Set first tab as active
        this.switchTab('questions');
    }
    
    switchTab(tabName) {
        // Update active tab button
        this.elements.tabBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.tab === tabName) {
                btn.classList.add('active');
            }
        });
        
        // Show corresponding tab content
        this.elements.tabContents.forEach(content => {
            content.classList.remove('active');
            if (content.id === `${tabName}-tab`) {
                content.classList.add('active');
            }
        });
        
        this.currentTab = tabName;
        
        // Refresh data if needed
        if (tabName === 'questions') {
            this.renderQuestionsTable();
        } else if (tabName === 'users') {
            this.renderUsersTable();
        } else if (tabName === 'analytics') {
            this.updateCharts();
        }
    }
    
    renderQuestionsTable() {
        const tbody = this.elements.questionsTableBody;
        if (!tbody) return;
        
        let html = '';
        this.questions.forEach(question => {
            // Get status badge class
            let statusClass = '';
            switch(question.status) {
                case 'active': statusClass = 'badge-success'; break;
                case 'pending': statusClass = 'badge-warning'; break;
                case 'archived': statusClass = 'badge-secondary'; break;
            }
            
            // Get difficulty badge class
            let difficultyClass = '';
            switch(question.difficulty) {
                case 'easy': difficultyClass = 'badge-success'; break;
                case 'medium': difficultyClass = 'badge-warning'; break;
                case 'hard': difficultyClass = 'badge-danger'; break;
            }
            
            // Truncate question text
            const questionText = question.text.length > 50 
                ? question.text.substring(0, 50) + '...' 
                : question.text;
            
            html += `
                <tr>
                    <td><input type="checkbox" class="question-checkbox" data-id="${question.id}"></td>
                    <td>#${question.id}</td>
                    <td>${questionText}</td>
                    <td>${question.exam}</td>
                    <td>${question.subject}</td>
                    <td>${question.year}</td>
                    <td><span class="badge ${difficultyClass}">${question.difficulty}</span></td>
                    <td><span class="badge ${statusClass}">${question.status}</span></td>
                    <td>
                        <button class="btn-icon edit-question" data-id="${question.id}" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon delete-question" data-id="${question.id}" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                        <button class="btn-icon preview-question" data-id="${question.id}" title="Preview">
                            <i class="fas fa-eye"></i>
                        </button>
                    </td>
                </tr>
            `;
        });
        
        tbody.innerHTML = html;
        
        // Add event listeners to action buttons
        document.querySelectorAll('.edit-question').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const questionId = e.target.closest('.edit-question').dataset.id;
                this.editQuestion(questionId);
            });
        });
        
        document.querySelectorAll('.delete-question').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const questionId = e.target.closest('.delete-question').dataset.id;
                this.deleteQuestion(questionId);
            });
        });
        
        document.querySelectorAll('.preview-question').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const questionId = e.target.closest('.preview-question').dataset.id;
                this.previewQuestion(questionId);
            });
        });
    }
    
    renderUsersTable() {
        const tbody = this.elements.usersTableBody;
        if (!tbody) return;
        
        let html = '';
        this.users.forEach(user => {
            // Get status badge class
            let statusClass = '';
            switch(user.status) {
                case 'active': statusClass = 'badge-success'; break;
                case 'inactive': statusClass = 'badge-secondary'; break;
                case 'suspended': statusClass = 'badge-danger'; break;
            }
            
            // Get plan badge class
            let planClass = '';
            switch(user.plan) {
                case 'premium': planClass = 'badge-premium'; break;
                case 'school': planClass = 'badge-primary'; break;
                case 'free': planClass = 'badge-secondary'; break;
            }
            
            html += `
                <tr>
                    <td><input type="checkbox" class="user-checkbox" data-id="${user.id}"></td>
                    <td>#${user.id}</td>
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td>${user.class}</td>
                    <td><span class="badge ${planClass}">${user.plan}</span></td>
                    <td>${user.tests}</td>
                    <td><span class="badge ${statusClass}">${user.status}</span></td>
                    <td>${user.joinDate}</td>
                    <td>
                        <button class="btn-icon edit-user" data-id="${user.id}" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon message-user" data-id="${user.id}" title="Send Message">
                            <i class="fas fa-envelope"></i>
                        </button>
                        <button class="btn-icon view-user" data-id="${user.id}" title="View Details">
                            <i class="fas fa-user"></i>
                        </button>
                    </td>
                </tr>
            `;
        });
        
        tbody.innerHTML = html;
        
        // Add event listeners to action buttons
        document.querySelectorAll('.edit-user').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const userId = e.target.closest('.edit-user').dataset.id;
                this.editUser(userId);
            });
        });
    }
    
    renderRecentContent() {
        const list = this.elements.recentContentList;
        if (!list) return;
        
        const recentContent = [
            { type: 'blog', title: '10 Tips for JAMB Success', author: 'Admin', date: 'Today', views: 245 },
            { type: 'video', title: 'Trigonometry Explained', author: 'Mr. Johnson', date: 'Yesterday', views: 156 },
            { type: 'pdf', title: 'WAEC Past Questions 2023', author: 'System', date: '2 days ago', downloads: 89 },
            { type: 'announcement', title: 'Platform Maintenance Notice', author: 'Admin', date: '3 days ago', views: 'All Users' }
        ];
        
        let html = '';
        recentContent.forEach(content => {
            let icon = '';
            let typeClass = '';
            
            switch(content.type) {
                case 'blog':
                    icon = 'fas fa-blog';
                    typeClass = 'blog';
                    break;
                case 'video':
                    icon = 'fas fa-video';
                    typeClass = 'video';
                    break;
                case 'pdf':
                    icon = 'fas fa-file-pdf';
                    typeClass = 'pdf';
                    break;
                case 'announcement':
                    icon = 'fas fa-bullhorn';
                    typeClass = 'announcement';
                    break;
            }
            
            html += `
                <div class="content-item ${typeClass}">
                    <div class="content-icon">
                        <i class="${icon}"></i>
                    </div>
                    <div class="content-info">
                        <h4>${content.title}</h4>
                        <p>By ${content.author} • ${content.date}</p>
                    </div>
                    <div class="content-stats">
                        ${content.type === 'pdf' ? 
                          `<span><i class="fas fa-download"></i> ${content.downloads}</span>` :
                          `<span><i class="fas fa-eye"></i> ${content.views}</span>`
                        }
                    </div>
                </div>
            `;
        });
        
        list.innerHTML = html;
    }
    
    toggleSelectAllQuestions(checked) {
        document.querySelectorAll('.question-checkbox').forEach(checkbox => {
            checkbox.checked = checked;
        });
    }
    
    toggleSelectAllUsers(checked) {
        document.querySelectorAll('.user-checkbox').forEach(checkbox => {
            checkbox.checked = checked;
        });
    }
    
    openAddQuestionModal() {
        this.elements.addQuestionModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    openImportQuestionsModal() {
        this.elements.importQuestionsModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    openAddUserModal() {
        // For now, use edit user modal for adding users too
        document.getElementById('editUserName').value = '';
        document.getElementById('editUserEmail').value = '';
        document.getElementById('editUserClass').value = '';
        document.getElementById('editUserRole').value = 'student';
        document.getElementById('editUserStatus').value = 'active';
        document.getElementById('editUserPlan').value = 'free';
        document.getElementById('editUserNotes').value = '';
        
        this.elements.editUserModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    editUser(userId) {
        const user = this.users.find(u => u.id == userId);
        if (!user) return;
        
        // Fill form with user data
        document.getElementById('editUserName').value = user.name;
        document.getElementById('editUserEmail').value = user.email;
        document.getElementById('editUserClass').value = user.class.toLowerCase();
        document.getElementById('editUserRole').value = 'student'; // Default
        document.getElementById('editUserStatus').value = user.status;
        document.getElementById('editUserPlan').value = user.plan;
        document.getElementById('editUserNotes').value = '';
        
        // Store user ID in form for reference
        document.getElementById('editUserForm').dataset.userId = userId;
        
        this.elements.editUserModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    closeAllModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('active');
        });
        document.body.style.overflow = 'auto';
    }
    
    addNewQuestion() {
        // Get form values
        const exam = document.getElementById('newQuestionExam').value;
        const subject = document.getElementById('newQuestionSubject').value;
        const year = document.getElementById('newQuestionYear').value;
        const questionText = document.getElementById('newQuestionText').value;
        const optionA = document.getElementById('newOptionA').value;
        const optionB = document.getElementById('newOptionB').value;
        const optionC = document.getElementById('newOptionC').value;
        const optionD = document.getElementById('newOptionD').value;
        const correctAnswer = document.getElementById('newCorrectAnswer').value;
        const difficulty = document.getElementById('newQuestionDifficulty').value;
        const explanation = document.getElementById('newQuestionExplanation').value;
        const topics = document.getElementById('newQuestionTopics').value;
        
        // Create new question object
        const newQuestion = {
            id: Date.now(), // Generate unique ID
            text: questionText,
            exam: exam.toUpperCase(),
            subject: subject.charAt(0).toUpperCase() + subject.slice(1),
            year: year,
            difficulty: difficulty,
            status: 'pending',
            createdAt: new Date().toISOString().split('T')[0]
        };
        
        // Add to questions array
        this.questions.unshift(newQuestion);
        
        // Update table
        this.renderQuestionsTable();
        
        // Close modal and reset form
        this.closeAllModals();
        document.getElementById('addQuestionForm').reset();
        
        // Show success message
        if (window.ExamMaster) {
            window.ExamMaster.showNotification('Question added successfully!', 'success');
        }
    }
    
    saveUserChanges() {
        const form = document.getElementById('editUserForm');
        const userId = form.dataset.userId;
        
        // Get form values
        const name = document.getElementById('editUserName').value;
        const email = document.getElementById('editUserEmail').value;
        const userClass = document.getElementById('editUserClass').value;
        const status = document.getElementById('editUserStatus').value;
        const plan = document.getElementById('editUserPlan').value;
        
        if (userId) {
            // Update existing user
            const userIndex = this.users.findIndex(u => u.id == userId);
            if (userIndex !== -1) {
                this.users[userIndex].name = name;
                this.users[userIndex].email = email;
                this.users[userIndex].class = userClass.toUpperCase();
                this.users[userIndex].status = status;
                this.users[userIndex].plan = plan;
            }
        } else {
            // Add new user
            const newUser = {
                id: Date.now(),
                name: name,
                email: email,
                class: userClass.toUpperCase(),
                plan: plan,
                tests: 0,
                status: status,
                joinDate: new Date().toISOString().split('T')[0]
            };
            this.users.unshift(newUser);
        }
        
        // Update table
        this.renderUsersTable();
        
        // Close modal and reset form
        this.closeAllModals();
        form.reset();
        delete form.dataset.userId;
        
        // Show success message
        if (window.ExamMaster) {
            window.ExamMaster.showNotification('User saved successfully!', 'success');
        }
    }
    
    editQuestion(questionId) {
        // Find the question
        const question = this.questions.find(q => q.id == questionId);
        if (!question) return;
        
        // For now, just show a notification
        if (window.ExamMaster) {
            window.ExamMaster.showNotification(`Editing question #${questionId}`, 'info');
        }
        
        // In a real application, you would open an edit modal
        // and populate it with the question data
    }
    
    deleteQuestion(questionId) {
        if (confirm('Are you sure you want to delete this question?')) {
            // Remove question from array
            this.questions = this.questions.filter(q => q.id != questionId);
            
            // Update table
            this.renderQuestionsTable();
            
            // Show success message
            if (window.ExamMaster) {
                window.ExamMaster.showNotification('Question deleted successfully!', 'success');
            }
        }
    }
    
    previewQuestion(questionId) {
        // Find the question
        const question = this.questions.find(q => q.id == questionId);
        if (!question) return;
        
        // For now, just show a notification
        if (window.ExamMaster) {
            window.ExamMaster.showNotification(`Previewing question #${questionId}: ${question.text.substring(0, 50)}...`, 'info');
        }
        
        // In a real application, you would open a preview modal
    }
    
    startImport() {
        const fileInput = document.getElementById('importFile');
        const overwrite = document.getElementById('importOverwrite').checked;
        const validate = document.getElementById('importValidate').checked;
        
        if (!fileInput.files.length) {
            if (window.ExamMaster) {
                window.ExamMaster.showNotification('Please select a file to import', 'error');
            }
            return;
        }
        
        // Simulate import process
        if (window.ExamMaster) {
            window.ExamMaster.showNotification('Starting import process...', 'info');
        }
        
        // Simulate processing delay
        setTimeout(() => {
            this.closeAllModals();
            
            // Simulate adding some sample questions from import
            for (let i = 0; i < 5; i++) {
                const newQuestion = {
                    id: Date.now() + i,
                    text: `Imported question ${i + 1} about ${['Mathematics', 'English', 'Physics'][i % 3]}`,
                    exam: ['WAEC', 'JAMB', 'NECO'][i % 3],
                    subject: ['Mathematics', 'English', 'Physics'][i % 3],
                    year: '2024',
                    difficulty: ['easy', 'medium', 'hard'][i % 3],
                    status: 'pending',
                    createdAt: new Date().toISOString().split('T')[0]
                };
                this.questions.unshift(newQuestion);
            }
            
            // Update table
            this.renderQuestionsTable();
            
            if (window.ExamMaster) {
                window.ExamMaster.showNotification('Import completed! 5 new questions added.', 'success');
            }
        }, 2000);
    }
    
    saveSettings() {
        // Get all settings values
        const settings = {
            registrationOpen: document.getElementById('registrationOpen').checked,
            emailVerification: document.getElementById('emailVerification').checked,
            maxFreeQuestions: document.getElementById('maxFreeQuestions').value,
            defaultExamTime: document.getElementById('defaultExamTime').value,
            questionsPerPage: document.getElementById('questionsPerPage').value,
            passingScore: document.getElementById('passingScore').value,
            premiumPrice: document.getElementById('premiumPrice').value,
            schoolDiscount: document.getElementById('schoolDiscount').value,
            emailNotifications: document.getElementById('emailNotifications').checked,
            pushNotifications: document.getElementById('pushNotifications').checked,
            maintenanceMode: document.getElementById('maintenanceMode').checked
        };
        
        // In a real application, you would save these to a server
        // For now, save to localStorage
        localStorage.setItem('adminSettings', JSON.stringify(settings));
        
        // Show success message
        if (window.ExamMaster) {
            window.ExamMaster.showNotification('Settings saved successfully!', 'success');
        }
    }
    
    initCharts() {
        // Initialize all charts
        this.initUserGrowthChart();
        this.initExamUsageChart();
        this.initRevenueChart();
        this.initSubjectChart();
    }
    
    initUserGrowthChart() {
        const ctx = this.elements.userGrowthChart?.getContext('2d');
        if (!ctx) return;
        
        this.userGrowthChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
                datasets: [{
                    label: 'New Users',
                    data: [120, 190, 300, 500, 700, 900, 1200],
                    borderColor: '#4361ee',
                    backgroundColor: 'rgba(67, 97, 238, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }
    
    initExamUsageChart() {
        const ctx = this.elements.examUsageChart?.getContext('2d');
        if (!ctx) return;
        
        this.examUsageChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['WAEC', 'JAMB', 'NECO', 'Term'],
                datasets: [{
                    label: 'Tests Taken',
                    data: [4500, 3800, 2900, 2200],
                    backgroundColor: [
                        'rgba(67, 97, 238, 0.8)',
                        'rgba(114, 9, 183, 0.8)',
                        'rgba(6, 214, 160, 0.8)',
                        'rgba(255, 158, 0, 0.8)'
                    ],
                    borderColor: [
                        '#4361ee',
                        '#7209b7',
                        '#06d6a0',
                        '#ff9e00'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }
    
    initRevenueChart() {
        const ctx = this.elements.revenueChart?.getContext('2d');
        if (!ctx) return;
        
        this.revenueChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
                datasets: [{
                    label: 'Revenue (₦)',
                    data: [450000, 520000, 680000, 810000, 920000, 1050000, 1200000],
                    borderColor: '#06d6a0',
                    backgroundColor: 'rgba(6, 214, 160, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        ticks: {
                            callback: function(value) {
                                return '₦' + (value / 1000).toFixed(0) + 'K';
                            }
                        }
                    }
                }
            }
        });
    }
    
    initSubjectChart() {
        const ctx = this.elements.subjectChart?.getContext('2d');
        if (!ctx) return;
        
        this.subjectChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Mathematics', 'English', 'Physics', 'Chemistry', 'Biology', 'Others'],
                datasets: [{
                    data: [35, 25, 15, 10, 8, 7],
                    backgroundColor: [
                        '#4361ee',
                        '#7209b7',
                        '#06d6a0',
                        '#ff9e00',
                        '#ef476f',
                        '#3a86ff'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right'
                    }
                }
            }
        });
    }
    
    updateCharts() {
        // Update charts with fresh data
        if (this.userGrowthChart) {
            // Simulate data update
            const newData = Array.from({length: 7}, () => Math.floor(Math.random() * 1000) + 500);
            this.userGrowthChart.data.datasets[0].data = newData;
            this.userGrowthChart.update();
        }
    }
}

// ===== INITIALIZE ADMIN PANEL =====
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the admin page
    if (document.getElementById('questions-tab')) {
        const adminPanel = new AdminPanelManager();
        
        // Make panel available globally
        window.adminPanel = adminPanel;
        
        // Load saved settings
        const savedSettings = localStorage.getItem('adminSettings');
        if (savedSettings) {
            const settings = JSON.parse(savedSettings);
            // Apply settings to form elements
            Object.keys(settings).forEach(key => {
                const element = document.getElementById(key);
                if (element) {
                    if (element.type === 'checkbox') {
                        element.checked = settings[key];
                    } else {
                        element.value = settings[key];
                    }
                }
            });
        }
    }
    
    // Add admin-specific styles
    const adminStyles = document.createElement('style');
    adminStyles.textContent = `
    .admin-container {
        padding-top: 120px;
        min-height: 100vh;
    }
    
    .admin-header {
        margin-bottom: 40px;
    }
    
    .admin-header h1 {
        font-size: 2.5rem;
        margin-bottom: 10px;
        color: var(--text-primary);
        display: flex;
        align-items: center;
        gap: 15px;
    }
    
    .admin-header p {
        color: var(--text-secondary);
        font-size: 1.1rem;
        margin-bottom: 20px;
    }
    
    .admin-access {
        display: flex;
        gap: 20px;
        align-items: center;
    }
    
    .access-badge {
        padding: 8px 15px;
        background-color: var(--primary-color);
        color: white;
        border-radius: 20px;
        font-size: 0.9rem;
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 8px;
    }
    
    .last-login {
        color: var(--text-secondary);
        font-size: 0.9rem;
    }
    
    .admin-stats {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 25px;
        margin-bottom: 40px;
    }
    
    .admin-stat-card {
        background-color: var(--bg-white);
        border-radius: var(--radius);
        padding: 25px;
        display: flex;
        align-items: center;
        gap: 20px;
        box-shadow: var(--shadow);
        transition: var(--transition);
    }
    
    .admin-stat-card:hover {
        transform: translateY(-5px);
        box-shadow: var(--shadow-lg);
    }
    
    .admin-stat-card .stat-icon {
        width: 60px;
        height: 60px;
        border-radius: var(--radius);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.8rem;
        background-color: rgba(67, 97, 238, 0.1);
        color: var(--primary-color);
    }
    
    .admin-stat-card .stat-info {
        flex: 1;
    }
    
    .admin-stat-card .stat-info h3 {
        font-size: 1.8rem;
        margin-bottom: 5px;
        color: var(--text-primary);
    }
    
    .admin-stat-card .stat-info p {
        color: var(--text-secondary);
        font-size: 0.9rem;
        margin-bottom: 5px;
    }
    
    .stat-change {
        font-size: 0.8rem;
        display: flex;
        align-items: center;
        gap: 5px;
    }
    
    .stat-change.positive {
        color: var(--accent-color);
    }
    
    .stat-change.negative {
        color: var(--danger-color);
    }
    
    .admin-tabs {
        display: flex;
        gap: 10px;
        margin-bottom: 30px;
        overflow-x: auto;
        padding-bottom: 10px;
    }
    
    .admin-tabs .tab-btn {
        padding: 15px 25px;
        background-color: var(--bg-white);
        border: 1px solid var(--border-color);
        border-radius: var(--radius);
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 10px;
        font-weight: 500;
        white-space: nowrap;
        transition: var(--transition);
    }
    
    .admin-tabs .tab-btn:hover {
        border-color: var(--primary-color);
        background-color: rgba(67, 97, 238, 0.05);
    }
    
    .admin-tabs .tab-btn.active {
        background-color: var(--primary-color);
        color: white;
        border-color: var(--primary-color);
    }
    
    .admin-tab-content {
        display: none;
    }
    
    .admin-tab-content.active {
        display: block;
        animation: fadeIn 0.3s ease;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    .tab-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 30px;
        padding-bottom: 20px;
        border-bottom: 1px solid var(--border-color);
    }
    
    .tab-header h2 {
        font-size: 1.5rem;
        color: var(--text-primary);
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .tab-actions {
        display: flex;
        gap: 15px;
    }
    
    .question-filters,
    .users-filters {
        background-color: var(--bg-light);
        border-radius: var(--radius);
        padding: 25px;
        margin-bottom: 30px;
    }
    
    .filter-row {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 20px;
        margin-bottom: 20px;
    }
    
    .filter-group label {
        display: block;
        margin-bottom: 8px;
        font-weight: 500;
        color: var(--text-primary);
    }
    
    .filter-group select {
        width: 100%;
        padding: 10px 15px;
        border: 1px solid var(--border-color);
        border-radius: var(--radius-sm);
        background-color: var(--bg-white);
        color: var(--text-primary);
        font-family: 'Poppins', sans-serif;
    }
    
    .search-box {
        display: flex;
        gap: 10px;
        position: relative;
    }
    
    .search-box i {
        position: absolute;
        left: 15px;
        top: 50%;
        transform: translateY(-50%);
        color: var(--text-secondary);
    }
    
    .search-box input {
        flex: 1;
        padding: 12px 15px 12px 45px;
        border: 1px solid var(--border-color);
        border-radius: var(--radius-sm);
        background-color: var(--bg-white);
        color: var(--text-primary);
    }
    
    .questions-table-container,
    .users-table-container {
        background-color: var(--bg-white);
        border-radius: var(--radius);
        overflow: hidden;
        box-shadow: var(--shadow);
        margin-bottom: 40px;
    }
    
    .admin-table {
        width: 100%;
        border-collapse: collapse;
    }
    
    .admin-table thead {
        background-color: var(--bg-light);
    }
    
    .admin-table th {
        padding: 15px 20px;
        text-align: left;
        font-weight: 600;
        color: var(--text-primary);
        border-bottom: 2px solid var(--border-color);
    }
    
    .admin-table td {
        padding: 15px 20px;
        border-bottom: 1px solid var(--border-color);
        color: var(--text-primary);
    }
    
    .admin-table tbody tr:hover {
        background-color: var(--bg-light);
    }
    
    .admin-table input[type="checkbox"] {
        width: 18px;
        height: 18px;
    }
    
    .badge {
        padding: 5px 12px;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: 500;
    }
    
    .badge-success {
        background-color: rgba(6, 214, 160, 0.1);
        color: var(--accent-color);
    }
    
    .badge-warning {
        background-color: rgba(255, 209, 102, 0.1);
        color: var(--warning-color);
    }
    
    .badge-danger {
        background-color: rgba(239, 71, 111, 0.1);
        color: var(--danger-color);
    }
    
    .badge-secondary {
        background-color: var(--bg-light);
        color: var(--text-secondary);
    }
    
    .badge-primary {
        background-color: rgba(67, 97, 238, 0.1);
        color: var(--primary-color);
    }
    
    .badge-premium {
        background-color: rgba(114, 9, 183, 0.1);
        color: var(--secondary-color);
    }
    
    .btn-icon {
        width: 35px;
        height: 35px;
        border-radius: 50%;
        background-color: var(--bg-light);
        border: none;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        margin: 0 5px;
        transition: var(--transition);
    }
    
    .btn-icon:hover {
        background-color: var(--primary-color);
        color: white;
    }
    
    .table-actions {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px;
        border-top: 1px solid var(--border-color);
    }
    
    .bulk-actions {
        display: flex;
        gap: 10px;
        align-items: center;
    }
    
    .bulk-actions select {
        padding: 8px 15px;
        border: 1px solid var(--border-color);
        border-radius: var(--radius-sm);
        background-color: var(--bg-white);
        color: var(--text-primary);
    }
    
    .pagination {
        display: flex;
        align-items: center;
        gap: 20px;
        color: var(--text-secondary);
    }
    
    .pagination-controls {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .pagination-btn {
        width: 35px;
        height: 35px;
        border-radius: 50%;
        background-color: var(--bg-light);
        border: 1px solid var(--border-color);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: var(--transition);
    }
    
    .pagination-btn:hover {
        background-color: var(--primary-color);
        color: white;
        border-color: var(--primary-color);
    }
    
    .current-page {
        font-weight: 600;
        color: var(--text-primary);
    }
    
    .content-management-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 25px;
        margin-bottom: 40px;
    }
    
    .content-card {
        background-color: var(--bg-white);
        border-radius: var(--radius);
        padding: 25px;
        text-align: center;
        box-shadow: var(--shadow);
        transition: var(--transition);
    }
    
    .content-card:hover {
        transform: translateY(-5px);
        box-shadow: var(--shadow-lg);
    }
    
    .content-icon {
        font-size: 2.5rem;
        color: var(--primary-color);
        margin-bottom: 20px;
    }
    
    .content-card h3 {
        font-size: 1.3rem;
        margin-bottom: 10px;
        color: var(--text-primary);
    }
    
    .content-card p {
        color: var(--text-secondary);
        margin-bottom: 20px;
        font-size: 0.9rem;
    }
    
    .content-stats {
        display: flex;
        justify-content: space-around;
        margin-bottom: 20px;
        padding-top: 20px;
        border-top: 1px solid var(--border-color);
    }
    
    .content-stats span {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 5px;
        font-size: 0.9rem;
        color: var(--text-secondary);
    }
    
    .content-stats i {
        font-size: 1.2rem;
        color: var(--primary-color);
    }
    
    .recent-content {
        background-color: var(--bg-white);
        border-radius: var(--radius);
        padding: 30px;
        box-shadow: var(--shadow);
    }
    
    .recent-content h3 {
        font-size: 1.3rem;
        margin-bottom: 25px;
        color: var(--text-primary);
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .content-list {
        display: grid;
        grid-template-columns: 1fr;
        gap: 15px;
    }
    
    .content-item {
        display: flex;
        align-items: center;
        gap: 20px;
        padding: 15px;
        border-radius: var(--radius);
        background-color: var(--bg-light);
        transition: var(--transition);
    }
    
    .content-item:hover {
        background-color: var(--border-color);
    }
    
    .content-icon {
        width: 45px;
        height: 45px;
        border-radius: var(--radius);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
    }
    
    .content-item.blog .content-icon {
        background-color: rgba(67, 97, 238, 0.1);
        color: var(--primary-color);
    }
    
    .content-item.video .content-icon {
        background-color: rgba(239, 71, 111, 0.1);
        color: var(--danger-color);
    }
    
    .content-item.pdf .content-icon {
        background-color: rgba(6, 214, 160, 0.1);
        color: var(--accent-color);
    }
    
    .content-item.announcement .content-icon {
        background-color: rgba(255, 209, 102, 0.1);
        color: var(--warning-color);
    }
    
    .content-info {
        flex: 1;
    }
    
    .content-info h4 {
        font-size: 1rem;
        margin-bottom: 5px;
        color: var(--text-primary);
    }
    
    .content-info p {
        font-size: 0.9rem;
        color: var(--text-secondary);
    }
    
    .content-stats span {
        display: flex;
        align-items: center;
        gap: 5px;
        color: var(--text-secondary);
        font-size: 0.9rem;
    }
    
    .settings-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 25px;
    }
    
    .settings-card {
        background-color: var(--bg-white);
        border-radius: var(--radius);
        padding: 25px;
        box-shadow: var(--shadow);
    }
    
    .settings-card h3 {
        font-size: 1.2rem;
        margin-bottom: 25px;
        color: var(--text-primary);
        display: flex;
        align-items: center;
        gap: 10px;
        padding-bottom: 15px;
        border-bottom: 1px solid var(--border-color);
    }
    
    .settings-group {
        margin-bottom: 25px;
    }
    
    .settings-group label {
        display: block;
        margin-bottom: 10px;
        font-weight: 500;
        color: var(--text-primary);
    }
    
    .settings-group input[type="number"] {
        width: 100%;
        padding: 10px 15px;
        border: 1px solid var(--border-color);
        border-radius: var(--radius-sm);
        background-color: var(--bg-white);
        color: var(--text-primary);
    }
    
    .setting-description {
        font-size: 0.9rem;
        color: var(--text-secondary);
        margin-top: 8px;
    }
    
    .toggle-switch {
        position: relative;
        display: inline-block;
        width: 60px;
        height: 30px;
    }
    
    .toggle-switch input {
        opacity: 0;
        width: 0;
        height: 0;
    }
    
    .toggle-slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: var(--border-color);
        transition: .4s;
        border-radius: 34px;
    }
    
    .toggle-slider:before {
        position: absolute;
        content: "";
        height: 22px;
        width: 22px;
        left: 4px;
        bottom: 4px;
        background-color: white;
        transition: .4s;
        border-radius: 50%;
    }
    
    input:checked + .toggle-slider {
        background-color: var(--primary-color);
    }
    
    input:checked + .toggle-slider:before {
        transform: translateX(30px);
    }
    
    .checkbox-group {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
    
    .analytics-charts {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 25px;
        margin-bottom: 40px;
    }
    
    .chart-card {
        background-color: var(--bg-white);
        border-radius: var(--radius);
        padding: 25px;
        box-shadow: var(--shadow);
    }
    
    .chart-card h3 {
        font-size: 1.2rem;
        margin-bottom: 25px;
        color: var(--text-primary);
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .chart-container {
        height: 250px;
        width: 100%;
    }
    
    .analytics-stats {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 25px;
    }
    
    .stats-card {
        background-color: var(--bg-white);
        border-radius: var(--radius);
        padding: 25px;
        box-shadow: var(--shadow);
    }
    
    .stats-card h3 {
        font-size: 1.2rem;
        margin-bottom: 25px;
        color: var(--text-primary);
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .stats-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 15px;
    }
    
    .stat-item {
        text-align: center;
    }
    
    .stat-item h4 {
        font-size: 1.5rem;
        margin-bottom: 5px;
        color: var(--text-primary);
    }
    
    .stat-item p {
        font-size: 0.9rem;
        color: var(--text-secondary);
    }
    
    .stats-list {
        display: grid;
        grid-template-columns: 1fr;
        gap: 10px;
    }
    
    .geo-item {
        display: flex;
        justify-content: space-between;
        padding: 10px 0;
        border-bottom: 1px solid var(--border-color);
    }
    
    .geo-item:last-child {
        border-bottom: none;
    }
    
    .geo-percent {
        font-weight: 600;
        color: var(--text-primary);
    }
    
    .import-instructions {
        background-color: var(--bg-light);
        border-radius: var(--radius);
        padding: 20px;
        margin-bottom: 25px;
    }
    
    .import-instructions h3 {
        font-size: 1.1rem;
        margin-bottom: 15px;
        color: var(--text-primary);
    }
    
    .import-instructions ul {
        margin-left: 20px;
        color: var(--text-secondary);
    }
    
    .import-instructions li {
        margin-bottom: 8px;
        font-size: 0.9rem;
    }
    
    .import-upload {
        margin-bottom: 25px;
    }
    
    .import-upload label {
        display: block;
        margin-bottom: 10px;
        font-weight: 500;
        color: var(--text-primary);
    }
    
    .import-upload input[type="file"] {
        width: 100%;
        padding: 10px;
        border: 2px dashed var(--border-color);
        border-radius: var(--radius);
        background-color: var(--bg-light);
    }
    
    .file-help {
        font-size: 0.9rem;
        color: var(--text-secondary);
        margin-top: 8px;
    }
    
    .import-options {
        display: flex;
        flex-direction: column;
        gap: 15px;
        margin-bottom: 25px;
    }
    
    .form-actions {
        display: flex;
        justify-content: flex-end;
        gap: 15px;
    }
    
    @media (max-width: 992px) {
        .admin-tabs {
            flex-wrap: wrap;
        }
        
        .analytics-charts {
            grid-template-columns: 1fr;
        }
    }
    
    @media (max-width: 768px) {
        .tab-header {
            flex-direction: column;
            gap: 20px;
            align-items: flex-start;
        }
        
        .table-actions {
            flex-direction: column;
            gap: 20px;
            align-items: flex-start;
        }
        
        .admin-table {
            display: block;
            overflow-x: auto;
        }
        
        .stats-grid {
            grid-template-columns: 1fr;
        }
    }
    
    @media (max-width: 576px) {
        .admin-stats {
            grid-template-columns: 1fr;
        }
        
        .content-management-grid {
            grid-template-columns: 1fr;
        }
        
        .settings-grid {
            grid-template-columns: 1fr;
        }
        
        .analytics-stats {
            grid-template-columns: 1fr;
        }
        
        .filter-row {
            grid-template-columns: 1fr;
        }
        
        .search-box {
            flex-direction: column;
        }
        
        .search-box i {
            top: 12px;
        }
    }
    `;
    document.head.appendChild(adminStyles);
});