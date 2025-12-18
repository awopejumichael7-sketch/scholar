// ===== DASHBOARD MANAGER =====
class DashboardManager {
    constructor() {
        this.userData = null;
        this.testResults = [];
        this.savedItems = [];
        this.weakAreas = [];
        this.goals = [];
        
        this.init();
    }
    
    init() {
        this.cacheElements();
        this.bindEvents();
        this.loadUserData();
        this.loadTestResults();
        this.loadSavedItems();
        this.loadWeakAreas();
        this.loadGoals();
        this.updateDashboard();
        this.initCharts();
    }
    
    cacheElements() {
        this.elements = {
            userName: document.getElementById('userName'),
            streakCount: document.getElementById('streakCount'),
            practiceTodayBtn: document.getElementById('practiceTodayBtn'),
            totalTests: document.getElementById('totalTests'),
            averageScore: document.getElementById('averageScore'),
            totalTime: document.getElementById('totalTime'),
            ranking: document.getElementById('ranking'),
            chartPeriod: document.getElementById('chartPeriod'),
            performanceChart: document.getElementById('performanceChart'),
            activityList: document.getElementById('activityList'),
            weakAreasList: document.getElementById('weakAreasList'),
            savedItemsBtn: document.getElementById('savedItemsBtn'),
            leaderboardBtn: document.getElementById('leaderboardBtn'),
            setGoalsBtn: document.getElementById('setGoalsBtn'),
            goalsList: document.getElementById('goalsList'),
            subjectPerformanceFilter: document.getElementById('subjectPerformanceFilter'),
            subjectPerformanceGrid: document.getElementById('subjectPerformanceGrid'),
            savedItemsModal: document.getElementById('savedItemsModal'),
            savedItemsList: document.getElementById('savedItemsList'),
            noSavedItems: document.getElementById('noSavedItems'),
            leaderboardModal: document.getElementById('leaderboardModal'),
            leaderboardList: document.getElementById('leaderboardList'),
            setGoalsModal: document.getElementById('setGoalsModal'),
            goalsForm: document.getElementById('goalsForm')
        };
    }
    
    bindEvents() {
        // Practice today button
        this.elements.practiceTodayBtn.addEventListener('click', () => {
            window.location.href = 'cbt.html';
        });
        
        // Chart period change
        this.elements.chartPeriod.addEventListener('change', () => {
            this.updateChart();
        });
        
        // Subject filter change
        this.elements.subjectPerformanceFilter.addEventListener('change', () => {
            this.updateSubjectPerformance();
        });
        
        // Quick actions
        this.elements.savedItemsBtn.addEventListener('click', () => {
            this.openSavedItemsModal();
        });
        
        this.elements.leaderboardBtn.addEventListener('click', () => {
            this.openLeaderboardModal();
        });
        
        this.elements.setGoalsBtn.addEventListener('click', () => {
            this.openSetGoalsModal();
        });
        
        // Modal close buttons
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', () => {
                this.closeAllModals();
            });
        });
        
        // Goals form submission
        this.elements.goalsForm?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveGoal();
        });
        
        // Leaderboard tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.updateLeaderboard(e.target.dataset.tab);
            });
        });
    }
    
    loadUserData() {
        // Load user from localStorage
        const userData = localStorage.getItem('currentUser');
        if (userData) {
            this.userData = JSON.parse(userData);
        } else {
            // Default user data
            this.userData = {
                firstName: 'Student',
                lastName: '',
                email: 'student@example.com',
                classLevel: 'SS3',
                examTarget: 'WAEC',
                subscription: 'free',
                joinDate: new Date().toISOString(),
                streak: 3
            };
        }
    }
    
    loadTestResults() {
        // Load test results from localStorage
        const resultsData = localStorage.getItem('userResults');
        if (resultsData) {
            this.testResults = JSON.parse(resultsData);
        } else {
            // Demo test results
            this.testResults = [
                {
                    examType: 'JAMB',
                    subject: 'Mathematics',
                    score: 75,
                    date: '2024-03-15T10:30:00Z',
                    correct: 30,
                    total: 40,
                    timeSpent: '45:00'
                },
                {
                    examType: 'WAEC',
                    subject: 'Physics',
                    score: 68,
                    date: '2024-03-14T14:20:00Z',
                    correct: 34,
                    total: 50,
                    timeSpent: '55:30'
                },
                {
                    examType: 'JAMB',
                    subject: 'English',
                    score: 82,
                    date: '2024-03-13T09:15:00Z',
                    correct: 33,
                    total: 40,
                    timeSpent: '38:45'
                },
                {
                    examType: 'NECO',
                    subject: 'Chemistry',
                    score: 71,
                    date: '2024-03-12T16:45:00Z',
                    correct: 36,
                    total: 50,
                    timeSpent: '60:00'
                },
                {
                    examType: 'WAEC',
                    subject: 'Mathematics',
                    score: 79,
                    date: '2024-03-11T11:20:00Z',
                    correct: 47,
                    total: 60,
                    timeSpent: '75:15'
                }
            ];
        }
    }
    
    loadSavedItems() {
        // Load saved items from localStorage
        const savedData = localStorage.getItem('savedItems');
        if (savedData) {
            this.savedItems = JSON.parse(savedData);
        }
    }
    
    loadWeakAreas() {
        // Calculate weak areas from test results
        const subjectPerformance = {};
        
        this.testResults.forEach(result => {
            const subject = result.subject;
            if (!subjectPerformance[subject]) {
                subjectPerformance[subject] = {
                    totalScore: 0,
                    testCount: 0,
                    totalQuestions: 0,
                    correctAnswers: 0
                };
            }
            
            subjectPerformance[subject].totalScore += result.score;
            subjectPerformance[subject].testCount++;
            subjectPerformance[subject].totalQuestions += result.total;
            subjectPerformance[subject].correctAnswers += result.correct;
        });
        
        // Calculate weak areas (subjects with average score < 70%)
        this.weakAreas = Object.entries(subjectPerformance)
            .map(([subject, data]) => ({
                subject,
                averageScore: Math.round(data.totalScore / data.testCount),
                accuracy: Math.round((data.correctAnswers / data.totalQuestions) * 100)
            }))
            .filter(item => item.averageScore < 70)
            .sort((a, b) => a.averageScore - b.averageScore);
    }
    
    loadGoals() {
        // Load goals from localStorage
        const goalsData = localStorage.getItem('userGoals');
        if (goalsData) {
            this.goals = JSON.parse(goalsData);
        } else {
            // Default goals
            this.goals = [
                {
                    id: 1,
                    type: 'daily',
                    description: 'Complete 20 mathematics questions',
                    target: 20,
                    current: 15,
                    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
                },
                {
                    id: 2,
                    type: 'score',
                    description: 'Achieve 80% in Physics',
                    target: 80,
                    current: 68,
                    deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
                },
                {
                    id: 3,
                    type: 'subject',
                    description: 'Master Chemistry organic reactions',
                    target: 100,
                    current: 60,
                    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
                }
            ];
        }
    }
    
    updateDashboard() {
        // Update user name
        if (this.elements.userName) {
            this.elements.userName.textContent = this.userData.firstName || 'Student';
        }
        
        // Update streak
        if (this.elements.streakCount) {
            this.elements.streakCount.textContent = this.userData.streak || 0;
        }
        
        // Update stats
        this.updateStats();
        
        // Update activity list
        this.updateActivityList();
        
        // Update weak areas
        this.updateWeakAreas();
        
        // Update goals
        this.updateGoals();
        
        // Update subject performance
        this.updateSubjectPerformance();
    }
    
    updateStats() {
        // Calculate total tests
        const totalTests = this.testResults.length;
        this.elements.totalTests.textContent = totalTests;
        
        // Calculate average score
        const averageScore = totalTests > 0 
            ? Math.round(this.testResults.reduce((sum, result) => sum + result.score, 0) / totalTests)
            : 0;
        this.elements.averageScore.textContent = `${averageScore}%`;
        
        // Calculate total time (simplified)
        const totalHours = Math.round(totalTests * 0.75);
        this.elements.totalTime.textContent = `${totalHours}h`;
        
        // Calculate ranking (simulated)
        const ranking = Math.max(1, Math.round(1000 - (averageScore * 10)));
        this.elements.ranking.textContent = `#${ranking}`;
    }
    
    updateActivityList() {
        const activityList = this.elements.activityList;
        if (!activityList) return;
        
        // Sort by date (newest first)
        const recentActivities = [...this.testResults]
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5);
        
        if (recentActivities.length === 0) {
            activityList.innerHTML = `
                <div class="no-activity">
                    <i class="fas fa-history"></i>
                    <p>No recent activity</p>
                    <button class="btn btn-outline btn-small" onclick="window.location.href='cbt.html'">
                        Start Practicing
                    </button>
                </div>
            `;
            return;
        }
        
        let html = '';
        recentActivities.forEach(activity => {
            const date = new Date(activity.date);
            const timeAgo = this.getTimeAgo(date);
            
            html += `
                <div class="activity-item">
                    <div class="activity-icon">
                        <i class="fas fa-file-alt"></i>
                    </div>
                    <div class="activity-content">
                        <h4>${activity.examType} ${activity.subject}</h4>
                        <p>Scored ${activity.score}% • ${timeAgo}</p>
                    </div>
                    <div class="activity-score ${activity.score >= 70 ? 'good' : 'average'}">
                        ${activity.score}%
                    </div>
                </div>
            `;
        });
        
        activityList.innerHTML = html;
    }
    
    updateWeakAreas() {
        const weakAreasList = this.elements.weakAreasList;
        if (!weakAreasList) return;
        
        if (this.weakAreas.length === 0) {
            weakAreasList.innerHTML = `
                <div class="no-weak-areas">
                    <i class="fas fa-check-circle"></i>
                    <p>No weak areas detected!</p>
                    <p class="small">Keep up the good work</p>
                </div>
            `;
            return;
        }
        
        let html = '';
        this.weakAreas.forEach(area => {
            html += `
                <div class="weak-area-item">
                    <div class="weak-area-info">
                        <h4>${area.subject}</h4>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${area.averageScore}%"></div>
                        </div>
                    </div>
                    <div class="weak-area-score">
                        ${area.averageScore}%
                    </div>
                </div>
            `;
        });
        
        weakAreasList.innerHTML = html;
    }
    
    updateGoals() {
        const goalsList = this.elements.goalsList;
        if (!goalsList) return;
        
        if (this.goals.length === 0) {
            goalsList.innerHTML = `
                <div class="no-goals">
                    <i class="fas fa-bullseye"></i>
                    <p>No goals set yet</p>
                    <button class="btn btn-outline btn-small" id="setFirstGoal">
                        Set Your First Goal
                    </button>
                </div>
            `;
            
            document.getElementById('setFirstGoal')?.addEventListener('click', () => {
                this.openSetGoalsModal();
            });
            return;
        }
        
        let html = '';
        this.goals.forEach(goal => {
            const progress = Math.round((goal.current / goal.target) * 100);
            const deadline = new Date(goal.deadline);
            const daysLeft = Math.ceil((deadline - new Date()) / (1000 * 60 * 60 * 24));
            
            html += `
                <div class="goal-item">
                    <div class="goal-header">
                        <h4>${goal.description}</h4>
                        <span class="goal-type">${goal.type}</span>
                    </div>
                    <div class="goal-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${Math.min(progress, 100)}%"></div>
                        </div>
                        <div class="goal-stats">
                            <span>${goal.current}/${goal.target}</span>
                            <span>${progress}%</span>
                        </div>
                    </div>
                    <div class="goal-footer">
                        <span><i class="fas fa-calendar"></i> ${daysLeft} days left</span>
                        <button class="btn btn-outline btn-small update-goal" data-id="${goal.id}">
                            Update
                        </button>
                    </div>
                </div>
            `;
        });
        
        goalsList.innerHTML = html;
        
        // Add event listeners to update buttons
        document.querySelectorAll('.update-goal').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const goalId = e.target.dataset.id;
                this.updateGoalProgress(goalId);
            });
        });
    }
    
    updateSubjectPerformance() {
        const grid = this.elements.subjectPerformanceGrid;
        if (!grid) return;
        
        const filter = this.elements.subjectPerformanceFilter.value;
        
        // Group by subject
        const subjectData = {};
        this.testResults.forEach(result => {
            if (filter !== 'all' && result.subject.toLowerCase() !== filter) {
                return;
            }
            
            const subject = result.subject;
            if (!subjectData[subject]) {
                subjectData[subject] = {
                    scores: [],
                    totalQuestions: 0,
                    correctAnswers: 0
                };
            }
            
            subjectData[subject].scores.push(result.score);
            subjectData[subject].totalQuestions += result.total;
            subjectData[subject].correctAnswers += result.correct;
        });
        
        // Convert to array and calculate averages
        const subjects = Object.entries(subjectData).map(([subject, data]) => {
            const averageScore = Math.round(data.scores.reduce((a, b) => a + b, 0) / data.scores.length);
            const accuracy = Math.round((data.correctAnswers / data.totalQuestions) * 100);
            const testCount = data.scores.length;
            
            return { subject, averageScore, accuracy, testCount };
        }).sort((a, b) => b.averageScore - a.averageScore);
        
        if (subjects.length === 0) {
            grid.innerHTML = `
                <div class="no-subject-data">
                    <i class="fas fa-chart-bar"></i>
                    <p>No data available for selected filter</p>
                </div>
            `;
            return;
        }
        
        let html = '';
        subjects.forEach(item => {
            // Determine performance level
            let performanceLevel = 'excellent';
            if (item.averageScore < 70) performanceLevel = 'good';
            if (item.averageScore < 60) performanceLevel = 'average';
            if (item.averageScore < 50) performanceLevel = 'weak';
            
            html += `
                <div class="subject-performance-card">
                    <div class="subject-header">
                        <h4>${item.subject}</h4>
                        <span class="performance-badge ${performanceLevel}">
                            ${item.averageScore}%
                        </span>
                    </div>
                    <div class="subject-stats">
                        <div class="stat">
                            <i class="fas fa-chart-line"></i>
                            <div>
                                <span class="stat-value">${item.averageScore}%</span>
                                <span class="stat-label">Average Score</span>
                            </div>
                        </div>
                        <div class="stat">
                            <i class="fas fa-bullseye"></i>
                            <div>
                                <span class="stat-value">${item.accuracy}%</span>
                                <span class="stat-label">Accuracy</span>
                            </div>
                        </div>
                        <div class="stat">
                            <i class="fas fa-file-alt"></i>
                            <div>
                                <span class="stat-value">${item.testCount}</span>
                                <span class="stat-label">Tests Taken</span>
                            </div>
                        </div>
                    </div>
                    <button class="btn btn-outline btn-small btn-block practice-subject-btn" data-subject="${item.subject.toLowerCase()}">
                        <i class="fas fa-play-circle"></i> Practice ${item.subject}
                    </button>
                </div>
            `;
        });
        
        grid.innerHTML = html;
        
        // Add event listeners to practice buttons
        document.querySelectorAll('.practice-subject-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const subject = e.target.dataset.subject || 
                               e.target.closest('.practice-subject-btn').dataset.subject;
                window.location.href = `cbt.html?subject=${subject}`;
            });
        });
    }
    
    initCharts() {
        // Initialize performance chart
        this.performanceChart = new Chart(this.elements.performanceChart, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Test Scores',
                    data: [],
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
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    }
                }
            }
        });
        
        this.updateChart();
    }
    
    updateChart() {
        const period = this.elements.chartPeriod.value;
        
        // Generate sample data based on period
        let labels = [];
        let data = [];
        
        switch (period) {
            case '7days':
                labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                data = [65, 70, 68, 75, 72, 78, 80];
                break;
            case '30days':
                labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
                data = [68, 72, 75, 79];
                break;
            case '90days':
                labels = ['Month 1', 'Month 2', 'Month 3'];
                data = [65, 72, 78];
                break;
            case 'all':
                labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
                data = [60, 65, 68, 72, 75, 78];
                break;
        }
        
        this.performanceChart.data.labels = labels;
        this.performanceChart.data.datasets[0].data = data;
        this.performanceChart.update();
    }
    
    openSavedItemsModal() {
        const modal = this.elements.savedItemsModal;
        const list = this.elements.savedItemsList;
        const noItems = this.elements.noSavedItems;
        
        if (this.savedItems.length === 0) {
            list.style.display = 'none';
            noItems.style.display = 'block';
        } else {
            list.style.display = 'block';
            noItems.style.display = 'none';
            
            // Populate saved items list
            let html = '';
            this.savedItems.forEach(item => {
                const savedDate = new Date(item.savedAt);
                const timeAgo = this.getTimeAgo(savedDate);
                
                html += `
                    <div class="saved-item">
                        <div class="saved-item-info">
                            <h4>${item.title}</h4>
                            <p>${item.examType} • ${item.subject} • Saved ${timeAgo}</p>
                        </div>
                        <div class="saved-item-actions">
                            <button class="btn btn-outline btn-small practice-saved-btn" data-id="${item.id}">
                                Practice
                            </button>
                            <button class="btn btn-text remove-saved-btn" data-id="${item.id}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                `;
            });
            
            list.innerHTML = html;
            
            // Add event listeners
            document.querySelectorAll('.practice-saved-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const itemId = e.target.dataset.id;
                    this.practiceSavedItem(itemId);
                });
            });
            
            document.querySelectorAll('.remove-saved-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const itemId = e.target.closest('.remove-saved-btn').dataset.id;
                    this.removeSavedItem(itemId);
                });
            });
        }
        
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    openLeaderboardModal() {
        const modal = this.elements.leaderboardModal;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Update leaderboard
        this.updateLeaderboard('weekly');
    }
    
    openSetGoalsModal() {
        const modal = this.elements.setGoalsModal;
        
        // Set default deadline to 7 days from now
        const defaultDeadline = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        document.getElementById('goalDeadline').value = defaultDeadline.toISOString().split('T')[0];
        
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    closeAllModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('active');
        });
        document.body.style.overflow = 'auto';
    }
    
    practiceSavedItem(itemId) {
        // Find the item
        const item = this.savedItems.find(i => i.id == itemId);
        if (!item) return;
        
        // Redirect to CBT page
        const params = new URLSearchParams({
            exam: item.examType.toLowerCase(),
            subject: item.subject.toLowerCase(),
            practice: 'true'
        });
        
        window.location.href = `cbt.html?${params.toString()}`;
    }
    
    removeSavedItem(itemId) {
        // Remove from saved items
        this.savedItems = this.savedItems.filter(item => item.id != itemId);
        
        // Update localStorage
        localStorage.setItem('savedItems', JSON.stringify(this.savedItems));
        
        // Update modal
        this.openSavedItemsModal();
        
        // Show notification
        if (window.ExamMaster) {
            window.ExamMaster.showNotification('Item removed from saved list', 'success');
        }
    }
    
    updateLeaderboard(tab) {
        const leaderboardList = this.elements.leaderboardList;
        
        // Generate sample leaderboard data
        const leaderboardData = [
            { rank: 1, name: 'Chinedu Okafor', score: 98, tests: 42 },
            { rank: 2, name: 'Amina Yusuf', score: 96, tests: 38 },
            { rank: 3, name: 'Tunde Balogun', score: 95, tests: 45 },
            { rank: 4, name: 'Funke Adebayo', score: 94, tests: 32 },
            { rank: 5, name: 'Emeka Nwankwo', score: 93, tests: 29 },
            { rank: 6, name: 'Bola Ahmed', score: 92, tests: 36 },
            { rank: 7, name: 'Chioma Eze', score: 91, tests: 41 },
            { rank: 8, name: 'Kolawole James', score: 90, tests: 27 },
            { rank: 9, name: 'Ngozi Okoro', score: 89, tests: 33 },
            { rank: 10, name: 'Segun Adeola', score: 88, tests: 39 }
        ];
        
        // Highlight current user (simulated)
        const currentUserRank = 156;
        const currentUserName = this.userData.firstName || 'You';
        
        let html = '';
        
        // Top 10
        leaderboardData.forEach(user => {
            const isCurrentUser = user.name.includes(currentUserName);
            
            html += `
                <div class="leaderboard-item ${isCurrentUser ? 'current-user' : ''}">
                    <div class="leaderboard-rank">
                        <span class="rank-number">${user.rank}</span>
                        <i class="fas fa-crown ${user.rank <= 3 ? 'top-three' : ''}"></i>
                    </div>
                    <div class="leaderboard-user">
                        <div class="user-avatar">
                            ${user.name.charAt(0)}
                        </div>
                        <div class="user-info">
                            <h4>${user.name}</h4>
                            <p>${user.tests} tests taken</p>
                        </div>
                    </div>
                    <div class="leaderboard-score">
                        <span class="score-value">${user.score}%</span>
                        <div class="score-bar">
                            <div class="score-fill" style="width: ${user.score}%"></div>
                        </div>
                    </div>
                </div>
            `;
        });
        
        // Current user's position
        html += `
            <div class="current-user-position">
                <div class="position-info">
                    <span class="position-label">Your Position</span>
                    <span class="position-value">#${currentUserRank}</span>
                </div>
                <button class="btn btn-primary btn-small" onclick="window.location.href='cbt.html'">
                    Improve Your Rank
                </button>
            </div>
        `;
        
        leaderboardList.innerHTML = html;
    }
    
    saveGoal() {
        const goalType = document.getElementById('goalType').value;
        const goalDescription = document.getElementById('goalDescription').value;
        const goalTarget = parseInt(document.getElementById('goalTarget').value);
        const goalDeadline = document.getElementById('goalDeadline').value;
        
        if (!goalType || !goalDescription || !goalTarget || !goalDeadline) {
            if (window.ExamMaster) {
                window.ExamMaster.showNotification('Please fill in all fields', 'error');
            }
            return;
        }
        
        const newGoal = {
            id: Date.now(),
            type: goalType,
            description: goalDescription,
            target: goalTarget,
            current: 0,
            deadline: goalDeadline
        };
        
        this.goals.push(newGoal);
        localStorage.setItem('userGoals', JSON.stringify(this.goals));
        
        this.closeAllModals();
        this.updateGoals();
        
        if (window.ExamMaster) {
            window.ExamMaster.showNotification('Goal saved successfully!', 'success');
        }
    }
    
    updateGoalProgress(goalId) {
        const goal = this.goals.find(g => g.id == goalId);
        if (!goal) return;
        
        const newProgress = prompt(`Update progress for: ${goal.description}\nCurrent: ${goal.current}/${goal.target}\nEnter new current value:`, goal.current);
        
        if (newProgress !== null) {
            const progressNum = parseInt(newProgress);
            if (!isNaN(progressNum) && progressNum >= 0) {
                goal.current = progressNum;
                localStorage.setItem('userGoals', JSON.stringify(this.goals));
                this.updateGoals();
                
                if (window.ExamMaster) {
                    window.ExamMaster.showNotification('Progress updated!', 'success');
                }
            }
        }
    }
    
    getTimeAgo(date) {
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);
        
        if (diffInSeconds < 60) {
            return 'just now';
        } else if (diffInSeconds < 3600) {
            const minutes = Math.floor(diffInSeconds / 60);
            return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        } else if (diffInSeconds < 86400) {
            const hours = Math.floor(diffInSeconds / 3600);
            return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        } else if (diffInSeconds < 2592000) {
            const days = Math.floor(diffInSeconds / 86400);
            return `${days} day${days > 1 ? 's' : ''} ago`;
        } else {
            return date.toLocaleDateString();
        }
    }
}

// ===== INITIALIZE DASHBOARD MANAGER =====
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the dashboard page
    if (document.getElementById('userName')) {
        const dashboardManager = new DashboardManager();
        
        // Make manager available globally
        window.dashboardManager = dashboardManager;
        
        // Close modal on outside click
        window.addEventListener('click', function(event) {
            if (event.target.classList.contains('modal')) {
                dashboardManager.closeAllModals();
            }
        });
    }
    
    // Add dashboard-specific styles
    const dashboardStyles = document.createElement('style');
    dashboardStyles.textContent = `
    .dashboard-container {
        padding-top: 120px;
        min-height: 100vh;
    }
    
    .dashboard-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 40px;
        flex-wrap: wrap;
        gap: 20px;
    }
    
    .welcome-section h1 {
        font-size: 2.2rem;
        margin-bottom: 10px;
        color: var(--text-primary);
    }
    
    .welcome-section p {
        color: var(--text-secondary);
        font-size: 1.1rem;
    }
    
    .wave {
        font-size: 1.8rem;
    }
    
    .streak-section {
        display: flex;
        align-items: center;
        gap: 30px;
    }
    
    .streak-display {
        display: flex;
        align-items: center;
        gap: 15px;
        padding: 15px 25px;
        background-color: var(--bg-white);
        border-radius: var(--radius);
        box-shadow: var(--shadow);
    }
    
    .streak-display i {
        font-size: 2rem;
        color: #ff6b6b;
    }
    
    .streak-display h3 {
        font-size: 2rem;
        color: var(--text-primary);
    }
    
    .streak-display p {
        color: var(--text-secondary);
        font-size: 0.9rem;
    }
    
    .dashboard-stats {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 25px;
        margin-bottom: 40px;
    }
    
    .stat-card {
        background-color: var(--bg-white);
        border-radius: var(--radius);
        padding: 25px;
        display: flex;
        align-items: center;
        gap: 20px;
        box-shadow: var(--shadow);
        transition: var(--transition);
    }
    
    .stat-card:hover {
        transform: translateY(-5px);
        box-shadow: var(--shadow-lg);
    }
    
    .stat-icon {
        width: 60px;
        height: 60px;
        border-radius: var(--radius);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.8rem;
    }
    
    .stat-icon.primary {
        background-color: rgba(67, 97, 238, 0.1);
        color: var(--primary-color);
    }
    
    .stat-icon.success {
        background-color: rgba(6, 214, 160, 0.1);
        color: var(--accent-color);
    }
    
    .stat-icon.warning {
        background-color: rgba(255, 209, 102, 0.1);
        color: var(--warning-color);
    }
    
    .stat-icon.secondary {
        background-color: rgba(114, 9, 183, 0.1);
        color: var(--secondary-color);
    }
    
    .stat-info h3 {
        font-size: 1.8rem;
        margin-bottom: 5px;
        color: var(--text-primary);
    }
    
    .stat-info p {
        color: var(--text-secondary);
        font-size: 0.9rem;
    }
    
    .dashboard-grid {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: 30px;
        margin-bottom: 30px;
    }
    
    .dashboard-card {
        background-color: var(--bg-white);
        border-radius: var(--radius);
        box-shadow: var(--shadow);
        margin-bottom: 30px;
        overflow: hidden;
    }
    
    .dashboard-card.full-width {
        grid-column: 1 / -1;
    }
    
    .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 25px 30px;
        border-bottom: 1px solid var(--border-color);
    }
    
    .card-header h3 {
        font-size: 1.3rem;
        color: var(--text-primary);
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .card-header select {
        padding: 8px 15px;
        border: 1px solid var(--border-color);
        border-radius: var(--radius-sm);
        background-color: var(--bg-light);
        color: var(--text-primary);
        font-family: 'Poppins', sans-serif;
    }
    
    .view-all {
        color: var(--primary-color);
        text-decoration: none;
        font-weight: 500;
        font-size: 0.9rem;
    }
    
    .view-all:hover {
        text-decoration: underline;
    }
    
    .card-body {
        padding: 30px;
    }
    
    .chart-container {
        height: 250px;
        width: 100%;
    }
    
    .activity-list {
        display: grid;
        grid-template-columns: 1fr;
        gap: 20px;
    }
    
    .activity-item {
        display: flex;
        align-items: center;
        gap: 15px;
        padding-bottom: 20px;
        border-bottom: 1px solid var(--border-color);
    }
    
    .activity-item:last-child {
        border-bottom: none;
        padding-bottom: 0;
    }
    
    .activity-icon {
        width: 45px;
        height: 45px;
        border-radius: 50%;
        background-color: rgba(67, 97, 238, 0.1);
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--primary-color);
        font-size: 1.2rem;
    }
    
    .activity-content {
        flex: 1;
    }
    
    .activity-content h4 {
        font-size: 1rem;
        margin-bottom: 5px;
        color: var(--text-primary);
    }
    
    .activity-content p {
        font-size: 0.9rem;
        color: var(--text-secondary);
    }
    
    .activity-score {
        padding: 5px 15px;
        border-radius: 20px;
        font-weight: 600;
        font-size: 0.9rem;
    }
    
    .activity-score.good {
        background-color: rgba(6, 214, 160, 0.1);
        color: var(--accent-color);
    }
    
    .activity-score.average {
        background-color: rgba(255, 209, 102, 0.1);
        color: var(--warning-color);
    }
    
    .no-activity {
        text-align: center;
        padding: 40px 20px;
    }
    
    .no-activity i {
        font-size: 3rem;
        color: var(--border-color);
        margin-bottom: 15px;
    }
    
    .no-activity p {
        color: var(--text-secondary);
        margin-bottom: 20px;
    }
    
    .weak-areas-list {
        display: grid;
        grid-template-columns: 1fr;
        gap: 20px;
    }
    
    .weak-area-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px;
        background-color: var(--bg-light);
        border-radius: var(--radius);
    }
    
    .weak-area-info {
        flex: 1;
    }
    
    .weak-area-info h4 {
        font-size: 1rem;
        margin-bottom: 10px;
        color: var(--text-primary);
    }
    
    .weak-area-score {
        font-weight: 600;
        color: var(--danger-color);
        font-size: 1.2rem;
        margin-left: 15px;
    }
    
    .no-weak-areas {
        text-align: center;
        padding: 40px 20px;
    }
    
    .no-weak-areas i {
        font-size: 3rem;
        color: var(--accent-color);
        margin-bottom: 15px;
    }
    
    .no-weak-areas p {
        color: var(--text-secondary);
        margin-bottom: 5px;
    }
    
    .no-weak-areas .small {
        font-size: 0.9rem;
    }
    
    .quick-actions-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 15px;
    }
    
    .quick-action {
        padding: 20px;
        background-color: var(--bg-light);
        border: 2px solid var(--border-color);
        border-radius: var(--radius);
        cursor: pointer;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
        transition: var(--transition);
    }
    
    .quick-action:hover {
        border-color: var(--primary-color);
        background-color: rgba(67, 97, 238, 0.05);
        transform: translateY(-3px);
    }
    
    .quick-action i {
        font-size: 1.8rem;
        color: var(--primary-color);
    }
    
    .quick-action span {
        font-weight: 500;
        color: var(--text-primary);
        text-align: center;
    }
    
    .goals-list {
        display: grid;
        grid-template-columns: 1fr;
        gap: 20px;
    }
    
    .goal-item {
        padding: 20px;
        background-color: var(--bg-light);
        border-radius: var(--radius);
        border-left: 4px solid var(--primary-color);
    }
    
    .goal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
    }
    
    .goal-header h4 {
        font-size: 1rem;
        color: var(--text-primary);
    }
    
    .goal-type {
        padding: 3px 10px;
        background-color: var(--bg-white);
        border-radius: 20px;
        font-size: 0.8rem;
        color: var(--text-secondary);
    }
    
    .goal-progress {
        margin-bottom: 15px;
    }
    
    .goal-stats {
        display: flex;
        justify-content: space-between;
        margin-top: 8px;
        font-size: 0.9rem;
        color: var(--text-secondary);
    }
    
    .goal-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 0.9rem;
        color: var(--text-secondary);
    }
    
    .goal-footer i {
        margin-right: 5px;
    }
    
    .no-goals {
        text-align: center;
        padding: 40px 20px;
    }
    
    .no-goals i {
        font-size: 3rem;
        color: var(--border-color);
        margin-bottom: 15px;
    }
    
    .no-goals p {
        color: var(--text-secondary);
        margin-bottom: 20px;
    }
    
    .subject-performance-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 25px;
    }
    
    .subject-performance-card {
        background-color: var(--bg-light);
        border-radius: var(--radius);
        padding: 25px;
    }
    
    .subject-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
    }
    
    .subject-header h4 {
        font-size: 1.2rem;
        color: var(--text-primary);
    }
    
    .performance-badge {
        padding: 5px 15px;
        border-radius: 20px;
        font-weight: 600;
        font-size: 0.9rem;
    }
    
    .performance-badge.excellent {
        background-color: rgba(6, 214, 160, 0.1);
        color: var(--accent-color);
    }
    
    .performance-badge.good {
        background-color: rgba(67, 97, 238, 0.1);
        color: var(--primary-color);
    }
    
    .performance-badge.average {
        background-color: rgba(255, 209, 102, 0.1);
        color: var(--warning-color);
    }
    
    .performance-badge.weak {
        background-color: rgba(239, 71, 111, 0.1);
        color: var(--danger-color);
    }
    
    .subject-stats {
        display: grid;
        grid-template-columns: 1fr;
        gap: 15px;
        margin-bottom: 20px;
    }
    
    .stat {
        display: flex;
        align-items: center;
        gap: 15px;
    }
    
    .stat i {
        font-size: 1.2rem;
        color: var(--primary-color);
    }
    
    .stat-value {
        display: block;
        font-weight: 600;
        color: var(--text-primary);
    }
    
    .stat-label {
        display: block;
        font-size: 0.9rem;
        color: var(--text-secondary);
    }
    
    .no-subject-data {
        text-align: center;
        padding: 40px 20px;
        grid-column: 1 / -1;
    }
    
    .no-subject-data i {
        font-size: 3rem;
        color: var(--border-color);
        margin-bottom: 15px;
    }
    
    /* Saved Items Modal */
    .saved-items-list {
        max-height: 400px;
        overflow-y: auto;
    }
    
    .saved-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px;
        border-bottom: 1px solid var(--border-color);
    }
    
    .saved-item:last-child {
        border-bottom: none;
    }
    
    .saved-item-info h4 {
        font-size: 1rem;
        margin-bottom: 5px;
        color: var(--text-primary);
    }
    
    .saved-item-info p {
        font-size: 0.9rem;
        color: var(--text-secondary);
    }
    
    .saved-item-actions {
        display: flex;
        gap: 10px;
    }
    
    .btn-text {
        background: none;
        border: none;
        color: var(--text-secondary);
        cursor: pointer;
        padding: 5px;
    }
    
    .btn-text:hover {
        color: var(--danger-color);
    }
    
    .no-saved-items {
        text-align: center;
        padding: 40px 20px;
    }
    
    .no-saved-items i {
        font-size: 3rem;
        color: var(--border-color);
        margin-bottom: 15px;
    }
    
    .no-saved-items h4 {
        font-size: 1.2rem;
        margin-bottom: 10px;
        color: var(--text-primary);
    }
    
    .no-saved-items p {
        color: var(--text-secondary);
        margin-bottom: 20px;
    }
    
    /* Leaderboard Modal */
    .leaderboard-tabs {
        display: flex;
        gap: 10px;
        margin-bottom: 25px;
        border-bottom: 1px solid var(--border-color);
        padding-bottom: 15px;
    }
    
    .tab-btn {
        padding: 10px 20px;
        background: none;
        border: none;
        border-bottom: 3px solid transparent;
        cursor: pointer;
        font-weight: 500;
        color: var(--text-secondary);
        transition: var(--transition);
    }
    
    .tab-btn.active {
        color: var(--primary-color);
        border-bottom-color: var(--primary-color);
    }
    
    .leaderboard-list {
        max-height: 500px;
        overflow-y: auto;
    }
    
    .leaderboard-item {
        display: flex;
        align-items: center;
        gap: 20px;
        padding: 15px;
        border-bottom: 1px solid var(--border-color);
    }
    
    .leaderboard-item.current-user {
        background-color: rgba(67, 97, 238, 0.05);
        border-radius: var(--radius);
    }
    
    .leaderboard-rank {
        display: flex;
        flex-direction: column;
        align-items: center;
        min-width: 40px;
    }
    
    .rank-number {
        font-size: 1.2rem;
        font-weight: 600;
        color: var(--text-primary);
    }
    
    .fa-crown {
        color: #ffd700;
        font-size: 0.9rem;
        margin-top: 5px;
    }
    
    .fa-crown.top-three {
        display: block;
    }
    
    .fa-crown:not(.top-three) {
        display: none;
    }
    
    .leaderboard-user {
        flex: 1;
        display: flex;
        align-items: center;
        gap: 15px;
    }
    
    .user-avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background-color: var(--primary-color);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
    }
    
    .user-info h4 {
        font-size: 1rem;
        margin-bottom: 5px;
        color: var(--text-primary);
    }
    
    .user-info p {
        font-size: 0.9rem;
        color: var(--text-secondary);
    }
    
    .leaderboard-score {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        min-width: 100px;
    }
    
    .score-value {
        font-weight: 600;
        color: var(--text-primary);
        margin-bottom: 5px;
    }
    
    .score-bar {
        width: 100%;
        height: 6px;
        background-color: var(--border-color);
        border-radius: 3px;
        overflow: hidden;
    }
    
    .score-fill {
        height: 100%;
        background-color: var(--primary-color);
        border-radius: 3px;
    }
    
    .current-user-position {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px;
        background-color: var(--bg-light);
        border-radius: var(--radius);
        margin-top: 20px;
    }
    
    .position-info {
        display: flex;
        flex-direction: column;
    }
    
    .position-label {
        font-size: 0.9rem;
        color: var(--text-secondary);
        margin-bottom: 5px;
    }
    
    .position-value {
        font-size: 1.5rem;
        font-weight: 600;
        color: var(--text-primary);
    }
    
    @media (max-width: 992px) {
        .dashboard-grid {
            grid-template-columns: 1fr;
        }
        
        .subject-performance-grid {
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        }
    }
    
    @media (max-width: 768px) {
        .dashboard-header {
            flex-direction: column;
            align-items: flex-start;
        }
        
        .streak-section {
            width: 100%;
            justify-content: space-between;
        }
        
        .dashboard-stats {
            grid-template-columns: 1fr 1fr;
        }
        
        .quick-actions-grid {
            grid-template-columns: 1fr;
        }
    }
    
    @media (max-width: 576px) {
        .dashboard-stats {
            grid-template-columns: 1fr;
        }
        
        .subject-performance-grid {
            grid-template-columns: 1fr;
        }
        
        .stat-card {
            flex-direction: column;
            text-align: center;
        }
        
        .leaderboard-item {
            flex-direction: column;
            text-align: center;
            gap: 15px;
        }
        
        .leaderboard-user {
            flex-direction: column;
            text-align: center;
        }
    }
    `;
    document.head.appendChild(dashboardStyles);
});