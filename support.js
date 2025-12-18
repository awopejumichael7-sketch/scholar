// ===== SUPPORT MANAGER =====
class SupportManager {
    constructor() {
        this.faqs = [];
        this.currentFaqCategory = 'all';
        
        this.init();
    }
    
    init() {
        this.cacheElements();
        this.bindEvents();
        this.loadFAQs();
        this.renderFAQs();
        this.renderDiscussions();
    }
    
    cacheElements() {
        this.elements = {
            faqList: document.getElementById('faqList'),
            faqSearch: document.getElementById('faqSearch'),
            faqCategoryBtns: document.querySelectorAll('.faq-category-btn'),
            contactForm: document.getElementById('contactForm'),
            ticketStatusModal: document.getElementById('ticketStatusModal'),
            checkTicketBtn: document.getElementById('checkTicketBtn'),
            ticketStatus: document.getElementById('ticketStatus'),
            discussionsList: document.getElementById('discussionsList')
        };
    }
    
    bindEvents() {
        // FAQ category filtering
        this.elements.faqCategoryBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Remove active class from all buttons
                this.elements.faqCategoryBtns.forEach(b => b.classList.remove('active'));
                
                // Add active class to clicked button
                e.target.classList.add('active');
                
                // Update current category
                this.currentFaqCategory = e.target.dataset.category;
                
                // Filter FAQs
                this.filterFAQs();
            });
        });
        
        // FAQ search
        this.elements.faqSearch?.addEventListener('input', () => {
            this.filterFAQs();
        });
        
        // Contact form submission
        this.elements.contactForm?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitContactForm();
        });
        
        // Check ticket status
        this.elements.checkTicketBtn?.addEventListener('click', () => {
            this.checkTicketStatus();
        });
        
        // Modal close buttons
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', () => {
                this.closeAllModals();
            });
        });
        
        // Close modal on outside click
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeAllModals();
            }
        });
    }
    
    loadFAQs() {
        // Sample FAQs data
        this.faqs = [
            {
                id: 1,
                question: "How do I create an account on ExamMaster Pro?",
                answer: "Click the 'Sign Up Free' button on the homepage. Fill in your details including name, email, class level, and target exam. Verify your email address to activate your account.",
                category: "account",
                views: 1245
            },
            {
                id: 2,
                question: "Is ExamMaster Pro free to use?",
                answer: "Yes, we offer a free plan with access to 50 questions daily. For unlimited access to all questions and features, upgrade to our Premium or School plans.",
                category: "subscription",
                views: 987
            },
            {
                id: 3,
                question: "How do I reset my password?",
                answer: "Click 'Login' then 'Forgot Password'. Enter your email address and we'll send you a password reset link. Check your spam folder if you don't see the email.",
                category: "account",
                views: 756
            },
            {
                id: 4,
                question: "The CBT simulator is not loading properly. What should I do?",
                answer: "1. Clear your browser cache and cookies\n2. Try using a different browser (Chrome works best)\n3. Disable browser extensions temporarily\n4. Ensure you have a stable internet connection\nIf problems persist, contact our support team.",
                category: "technical",
                views: 543
            },
            {
                id: 5,
                question: "How many past questions are available?",
                answer: "We have over 50,000 past questions from WAEC, JAMB, NECO, and school term exams dating back to 2005. New questions are added regularly.",
                category: "exams",
                views: 432
            },
            {
                id: 6,
                question: "Can I download questions for offline use?",
                answer: "Yes, Premium and School plan users can download PDF versions of past questions for offline study. Free users can access questions online only.",
                category: "subscription",
                views: 321
            },
            {
                id: 7,
                question: "How accurate are the answers provided?",
                answer: "All questions and answers are verified by experienced educators and subject matter experts. We have a 99.8% accuracy rate across our question bank.",
                category: "exams",
                views: 298
            },
            {
                id: 8,
                question: "What payment methods do you accept?",
                answer: "We accept card payments (Visa, Mastercard), bank transfers, and USSD payments. All payments are secured with SSL encryption.",
                category: "subscription",
                views: 210
            },
            {
                id: 9,
                question: "How do I cancel my subscription?",
                answer: "Go to Dashboard > Settings > Subscription. Click 'Cancel Subscription'. Your access will continue until the end of your current billing period.",
                category: "subscription",
                views: 189
            },
            {
                id: 10,
                question: "Can I use ExamMaster Pro on my mobile phone?",
                answer: "Yes, ExamMaster Pro is fully responsive and works perfectly on smartphones, tablets, and desktop computers. You can also download our mobile app from the App Store or Google Play.",
                category: "technical",
                views: 167
            }
        ];
    }
    
    renderFAQs() {
        const list = this.elements.faqList;
        if (!list) return;
        
        // Get filtered FAQs
        const filteredFaqs = this.getFilteredFAQs();
        
        if (filteredFaqs.length === 0) {
            list.innerHTML = `
                <div class="no-faqs">
                    <i class="fas fa-search"></i>
                    <h3>No FAQs found</h3>
                    <p>Try a different search term or category</p>
                </div>
            `;
            return;
        }
        
        let html = '';
        filteredFaqs.forEach(faq => {
            html += `
                <div class="faq-item">
                    <div class="faq-question">
                        <h3>${faq.question}</h3>
                        <button class="faq-toggle">
                            <i class="fas fa-chevron-down"></i>
                        </button>
                    </div>
                    <div class="faq-answer">
                        <p>${faq.answer.replace(/\n/g, '<br>')}</p>
                        <div class="faq-meta">
                            <span class="faq-category ${faq.category}">${faq.category}</span>
                            <span><i class="far fa-eye"></i> ${faq.views.toLocaleString()} views</span>
                        </div>
                    </div>
                </div>
            `;
        });
        
        list.innerHTML = html;
        
        // Add event listeners to FAQ toggles
        document.querySelectorAll('.faq-toggle').forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                const faqItem = e.target.closest('.faq-item');
                const answer = faqItem.querySelector('.faq-answer');
                const icon = e.target.querySelector('i') || e.target;
                
                // Toggle answer visibility
                answer.classList.toggle('active');
                
                // Rotate icon
                if (answer.classList.contains('active')) {
                    icon.style.transform = 'rotate(180deg)';
                } else {
                    icon.style.transform = 'rotate(0deg)';
                }
            });
        });
        
        // Make entire question clickable
        document.querySelectorAll('.faq-question').forEach(question => {
            question.addEventListener('click', (e) => {
                if (!e.target.classList.contains('faq-toggle')) {
                    const toggle = question.querySelector('.faq-toggle');
                    toggle.click();
                }
            });
        });
    }
    
    getFilteredFAQs() {
        const searchTerm = this.elements.faqSearch?.value.toLowerCase() || '';
        
        return this.faqs.filter(faq => {
            // Filter by category
            if (this.currentFaqCategory !== 'all' && faq.category !== this.currentFaqCategory) {
                return false;
            }
            
            // Filter by search term
            if (searchTerm && 
                !faq.question.toLowerCase().includes(searchTerm) && 
                !faq.answer.toLowerCase().includes(searchTerm)) {
                return false;
            }
            
            return true;
        });
    }
    
    filterFAQs() {
        this.renderFAQs();
    }
    
    submitContactForm() {
        // Get form values
        const name = document.getElementById('contactName').value;
        const email = document.getElementById('contactEmail').value;
        const subject = document.getElementById('contactSubject').value;
        const message = document.getElementById('contactMessage').value;
        
        // Validate form
        if (!name || !email || !subject || !message) {
            if (window.ExamMaster) {
                window.ExamMaster.showNotification('Please fill in all required fields', 'error');
            }
            return;
        }
        
        // Simulate form submission
        if (window.ExamMaster) {
            window.ExamMaster.showNotification('Sending your message...', 'info');
        }
        
        // Generate ticket number
        const ticketNumber = `TKT-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
        
        setTimeout(() => {
            // Reset form
            this.elements.contactForm.reset();
            
            // Show success message with ticket number
            if (window.ExamMaster) {
                window.ExamMaster.showNotification(`Message sent successfully! Your ticket number is ${ticketNumber}. We'll respond within 2 hours.`, 'success');
            }
            
            // Store ticket in localStorage (for demo purposes)
            const tickets = JSON.parse(localStorage.getItem('supportTickets') || '[]');
            tickets.push({
                id: ticketNumber,
                name: name,
                email: email,
                subject: subject,
                message: message,
                date: new Date().toISOString(),
                status: 'open'
            });
            localStorage.setItem('supportTickets', JSON.stringify(tickets));
            
        }, 1500);
    }
    
    checkTicketStatus() {
        const ticketNumber = document.getElementById('ticketNumber').value.trim();
        
        if (!ticketNumber) {
            if (window.ExamMaster) {
                window.ExamMaster.showNotification('Please enter a ticket number', 'error');
            }
            return;
        }
        
        // For demo purposes, show a sample ticket status
        // In a real application, this would check against a database
        
        // Update ticket ID in modal
        document.getElementById('ticketId').textContent = ticketNumber;
        
        // Show the status section
        this.elements.ticketStatus.style.display = 'block';
        
        // Scroll to status section
        this.elements.ticketStatus.scrollIntoView({ behavior: 'smooth' });
    }
    
    renderDiscussions() {
        const list = this.elements.discussionsList;
        if (!list) return;
        
        const discussions = [
            {
                id: 1,
                title: "Best study schedule for WAEC preparation?",
                author: "Chinedu O.",
                replies: 24,
                views: 156,
                lastActivity: "2 hours ago",
                category: "study-tips"
            },
            {
                id: 2,
                title: "Mathematics: How to solve quadratic equations quickly",
                author: "Amina Y.",
                replies: 18,
                views: 98,
                lastActivity: "5 hours ago",
                category: "subject-help"
            },
            {
                id: 3,
                title: "JAMB CBT: Time management tips needed",
                author: "Tunde B.",
                replies: 32,
                views: 210,
                lastActivity: "1 day ago",
                category: "exam-tips"
            },
            {
                id: 4,
                title: "Chemistry: Balancing chemical equations",
                author: "Funke A.",
                replies: 15,
                views: 87,
                lastActivity: "2 days ago",
                category: "subject-help"
            },
            {
                id: 5,
                title: "How to stay motivated during long study sessions",
                author: "Emeka N.",
                replies: 42,
                views: 189,
                lastActivity: "3 days ago",
                category: "motivation"
            }
        ];
        
        let html = '';
        discussions.forEach(discussion => {
            html += `
                <div class="discussion-item">
                    <div class="discussion-info">
                        <h4>${discussion.title}</h4>
                        <div class="discussion-meta">
                            <span>By ${discussion.author}</span>
                            <span><i class="far fa-comment"></i> ${discussion.replies} replies</span>
                            <span><i class="far fa-eye"></i> ${discussion.views} views</span>
                        </div>
                    </div>
                    <div class="discussion-activity">
                        <span class="activity-time">${discussion.lastActivity}</span>
                        <span class="discussion-category ${discussion.category}">${discussion.category.replace('-', ' ')}</span>
                    </div>
                </div>
            `;
        });
        
        list.innerHTML = html;
        
        // Make discussion items clickable
        document.querySelectorAll('.discussion-item').forEach(item => {
            item.addEventListener('click', () => {
                if (window.ExamMaster) {
                    window.ExamMaster.showNotification('Redirecting to forum discussion...', 'info');
                }
                // In a real app, this would open the discussion
            });
        });
    }
    
    closeAllModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('active');
        });
        document.body.style.overflow = 'auto';
    }
}

// ===== INITIALIZE SUPPORT MANAGER =====
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the support page
    if (document.getElementById('faqList')) {
        const supportManager = new SupportManager();
        
        // Make manager available globally
        window.supportManager = supportManager;
    }
    
    // Add support-specific styles
    const supportStyles = document.createElement('style');
    supportStyles.textContent = `
    .support-container {
        padding-top: 120px;
        min-height: 100vh;
    }
    
    .support-header {
        text-align: center;
        margin-bottom: 40px;
    }
    
    .support-header h1 {
        font-size: 2.5rem;
        margin-bottom: 15px;
        color: var(--text-primary);
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 15px;
    }
    
    .support-header p {
        color: var(--text-secondary);
        font-size: 1.1rem;
        max-width: 600px;
        margin: 0 auto 25px;
    }
    
    .support-stats {
        display: flex;
        justify-content: center;
        gap: 30px;
        color: var(--text-secondary);
    }
    
    .support-stats span {
        display: flex;
        align-items: center;
        gap: 8px;
    }
    
    .quick-help {
        margin-bottom: 60px;
    }
    
    .quick-help h2 {
        font-size: 1.8rem;
        margin-bottom: 30px;
        color: var(--text-primary);
        text-align: center;
    }
    
    .help-options-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 25px;
    }
    
    .help-option {
        background-color: var(--bg-white);
        border-radius: var(--radius);
        padding: 30px;
        text-align: center;
        box-shadow: var(--shadow);
        cursor: pointer;
        transition: var(--transition);
    }
    
    .help-option:hover {
        transform: translateY(-10px);
        box-shadow: var(--shadow-lg);
        background-color: var(--primary-color);
        color: white;
    }
    
    .help-option:hover h3,
    .help-option:hover p,
    .help-option:hover .help-icon {
        color: white;
    }
    
    .help-icon {
        font-size: 2.5rem;
        color: var(--primary-color);
        margin-bottom: 20px;
        transition: var(--transition);
    }
    
    .help-option h3 {
        font-size: 1.3rem;
        margin-bottom: 15px;
        color: var(--text-primary);
        transition: var(--transition);
    }
    
    .help-option p {
        color: var(--text-secondary);
        transition: var(--transition);
    }
    
    .faq-section {
        margin-bottom: 60px;
        padding: 40px;
        background-color: var(--bg-white);
        border-radius: var(--radius);
        box-shadow: var(--shadow);
    }
    
    .faq-section h2 {
        font-size: 1.8rem;
        margin-bottom: 10px;
        color: var(--text-primary);
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .faq-section > p {
        color: var(--text-secondary);
        margin-bottom: 30px;
    }
    
    .faq-search {
        position: relative;
        margin-bottom: 30px;
    }
    
    .faq-search i {
        position: absolute;
        left: 15px;
        top: 50%;
        transform: translateY(-50%);
        color: var(--text-secondary);
    }
    
    .faq-search input {
        width: 100%;
        padding: 15px 15px 15px 45px;
        border: 1px solid var(--border-color);
        border-radius: var(--radius-sm);
        background-color: var(--bg-light);
        color: var(--text-primary);
        font-size: 1rem;
    }
    
    .faq-categories {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-bottom: 30px;
    }
    
    .faq-category-btn {
        padding: 10px 20px;
        background-color: var(--bg-light);
        border: 1px solid var(--border-color);
        border-radius: 20px;
        cursor: pointer;
        transition: var(--transition);
        font-weight: 500;
    }
    
    .faq-category-btn:hover {
        background-color: var(--border-color);
    }
    
    .faq-category-btn.active {
        background-color: var(--primary-color);
        color: white;
        border-color: var(--primary-color);
    }
    
    .faq-list {
        display: grid;
        grid-template-columns: 1fr;
        gap: 15px;
    }
    
    .faq-item {
        border: 1px solid var(--border-color);
        border-radius: var(--radius);
        overflow: hidden;
    }
    
    .faq-question {
        padding: 20px;
        background-color: var(--bg-light);
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: pointer;
        transition: var(--transition);
    }
    
    .faq-question:hover {
        background-color: var(--border-color);
    }
    
    .faq-question h3 {
        font-size: 1.1rem;
        color: var(--text-primary);
        margin: 0;
        flex: 1;
    }
    
    .faq-toggle {
        background: none;
        border: none;
        cursor: pointer;
        font-size: 1.2rem;
        color: var(--text-secondary);
        transition: var(--transition);
        padding: 5px;
    }
    
    .faq-answer {
        padding: 0 20px;
        max-height: 0;
        overflow: hidden;
        transition: max-height 0.3s ease;
    }
    
    .faq-answer.active {
        padding: 20px;
        max-height: 1000px;
    }
    
    .faq-answer p {
        color: var(--text-secondary);
        line-height: 1.6;
        margin-bottom: 20px;
    }
    
    .faq-meta {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-top: 20px;
        border-top: 1px solid var(--border-color);
        font-size: 0.9rem;
        color: var(--text-secondary);
    }
    
    .faq-category {
        padding: 3px 10px;
        border-radius: 15px;
        font-size: 0.8rem;
        font-weight: 500;
    }
    
    .faq-category.account {
        background-color: rgba(67, 97, 238, 0.1);
        color: var(--primary-color);
    }
    
    .faq-category.technical {
        background-color: rgba(239, 71, 111, 0.1);
        color: var(--danger-color);
    }
    
    .faq-category.exams {
        background-color: rgba(6, 214, 160, 0.1);
        color: var(--accent-color);
    }
    
    .faq-category.subscription {
        background-color: rgba(255, 209, 102, 0.1);
        color: var(--warning-color);
    }
    
    .no-faqs {
        text-align: center;
        padding: 40px 20px;
        grid-column: 1 / -1;
    }
    
    .no-faqs i {
        font-size: 3rem;
        color: var(--border-color);
        margin-bottom: 15px;
    }
    
    .no-faqs h3 {
        font-size: 1.5rem;
        margin-bottom: 10px;
        color: var(--text-primary);
    }
    
    .no-faqs p {
        color: var(--text-secondary);
    }
    
    .contact-section {
        margin-bottom: 60px;
    }
    
    .contact-header {
        text-align: center;
        margin-bottom: 40px;
    }
    
    .contact-header h2 {
        font-size: 1.8rem;
        margin-bottom: 15px;
        color: var(--text-primary);
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
    }
    
    .contact-header p {
        color: var(--text-secondary);
        max-width: 600px;
        margin: 0 auto;
    }
    
    .contact-grid {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: 40px;
    }
    
    .contact-form-container {
        background-color: var(--bg-white);
        border-radius: var(--radius);
        padding: 30px;
        box-shadow: var(--shadow);
    }
    
    .contact-form .form-group {
        margin-bottom: 25px;
    }
    
    .contact-form label {
        display: block;
        margin-bottom: 8px;
        font-weight: 500;
        color: var(--text-primary);
    }
    
    .contact-form input,
    .contact-form select,
    .contact-form textarea {
        width: 100%;
        padding: 12px 15px;
        border: 1px solid var(--border-color);
        border-radius: var(--radius-sm);
        background-color: var(--bg-light);
        color: var(--text-primary);
        font-family: 'Poppins', sans-serif;
    }
    
    .contact-form textarea {
        resize: vertical;
        min-height: 120px;
    }
    
    .file-help {
        font-size: 0.9rem;
        color: var(--text-secondary);
        margin-top: 5px;
    }
    
    .contact-info {
        display: grid;
        grid-template-columns: 1fr;
        gap: 25px;
    }
    
    .info-card {
        background-color: var(--bg-white);
        border-radius: var(--radius);
        padding: 25px;
        box-shadow: var(--shadow);
    }
    
    .info-card h3 {
        font-size: 1.2rem;
        margin-bottom: 20px;
        color: var(--text-primary);
        display: flex;
        align-items: center;
        gap: 10px;
        padding-bottom: 15px;
        border-bottom: 1px solid var(--border-color);
    }
    
    .info-card ul {
        list-style: none;
        padding: 0;
    }
    
    .info-card li {
        margin-bottom: 12px;
        color: var(--text-secondary);
        padding-left: 20px;
        position: relative;
    }
    
    .info-card li:before {
        content: "•";
        position: absolute;
        left: 0;
        color: var(--primary-color);
    }
    
    .contact-methods {
        display: grid;
        grid-template-columns: 1fr;
        gap: 20px;
    }
    
    .contact-method {
        display: flex;
        align-items: center;
        gap: 15px;
    }
    
    .contact-method i {
        font-size: 1.2rem;
        color: var(--primary-color);
    }
    
    .contact-method strong {
        display: block;
        margin-bottom: 5px;
        color: var(--text-primary);
    }
    
    .contact-method p {
        color: var(--text-secondary);
        margin: 0;
    }
    
    .tutorials-section {
        margin-bottom: 60px;
        padding: 40px;
        background-color: var(--bg-white);
        border-radius: var(--radius);
        box-shadow: var(--shadow);
    }
    
    .tutorials-section h2 {
        font-size: 1.8rem;
        margin-bottom: 10px;
        color: var(--text-primary);
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .tutorials-section > p {
        color: var(--text-secondary);
        margin-bottom: 30px;
    }
    
    .tutorials-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 25px;
    }
    
    .tutorial-card {
        background-color: var(--bg-light);
        border-radius: var(--radius);
        overflow: hidden;
        transition: var(--transition);
        cursor: pointer;
    }
    
    .tutorial-card:hover {
        transform: translateY(-5px);
        box-shadow: var(--shadow);
    }
    
    .tutorial-thumbnail {
        height: 150px;
        background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .tutorial-thumbnail i {
        font-size: 3rem;
        color: white;
        opacity: 0.8;
    }
    
    .tutorial-card h3 {
        font-size: 1.1rem;
        margin: 20px 20px 10px;
        color: var(--text-primary);
    }
    
    .tutorial-card p {
        color: var(--text-secondary);
        margin: 0 20px 15px;
        font-size: 0.9rem;
        line-height: 1.5;
    }
    
    .tutorial-duration {
        display: block;
        padding: 10px 20px;
        background-color: var(--bg-white);
        color: var(--text-secondary);
        font-size: 0.9rem;
        border-top: 1px solid var(--border-color);
    }
    
    .community-section {
        margin-bottom: 60px;
        padding: 40px;
        background-color: var(--bg-white);
        border-radius: var(--radius);
        box-shadow: var(--shadow);
    }
    
    .community-header {
        text-align: center;
        margin-bottom: 40px;
    }
    
    .community-header h2 {
        font-size: 1.8rem;
        margin-bottom: 15px;
        color: var(--text-primary);
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
    }
    
    .community-header p {
        color: var(--text-secondary);
        max-width: 600px;
        margin: 0 auto;
    }
    
    .community-stats {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 25px;
        margin-bottom: 40px;
    }
    
    .community-stat {
        display: flex;
        align-items: center;
        gap: 20px;
        padding: 25px;
        background-color: var(--bg-light);
        border-radius: var(--radius);
    }
    
    .community-stat i {
        font-size: 2rem;
        color: var(--primary-color);
    }
    
    .community-stat h3 {
        font-size: 1.8rem;
        margin-bottom: 5px;
        color: var(--text-primary);
    }
    
    .community-stat p {
        color: var(--text-secondary);
        font-size: 0.9rem;
        margin: 0;
    }
    
    .forum-preview {
        background-color: var(--bg-light);
        border-radius: var(--radius);
        padding: 30px;
    }
    
    .forum-preview h3 {
        font-size: 1.3rem;
        margin-bottom: 25px;
        color: var(--text-primary);
    }
    
    .discussions-list {
        display: grid;
        grid-template-columns: 1fr;
        gap: 15px;
        margin-bottom: 30px;
    }
    
    .discussion-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px;
        background-color: var(--bg-white);
        border-radius: var(--radius);
        cursor: pointer;
        transition: var(--transition);
    }
    
    .discussion-item:hover {
        background-color: var(--border-color);
    }
    
    .discussion-info h4 {
        font-size: 1rem;
        margin-bottom: 10px;
        color: var(--text-primary);
    }
    
    .discussion-meta {
        display: flex;
        gap: 15px;
        font-size: 0.9rem;
        color: var(--text-secondary);
    }
    
    .discussion-activity {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 10px;
    }
    
    .activity-time {
        font-size: 0.9rem;
        color: var(--text-secondary);
    }
    
    .discussion-category {
        padding: 3px 10px;
        border-radius: 15px;
        font-size: 0.8rem;
        font-weight: 500;
    }
    
    .discussion-category.study-tips {
        background-color: rgba(67, 97, 238, 0.1);
        color: var(--primary-color);
    }
    
    .discussion-category.subject-help {
        background-color: rgba(6, 214, 160, 0.1);
        color: var(--accent-color);
    }
    
    .discussion-category.exam-tips {
        background-color: rgba(114, 9, 183, 0.1);
        color: var(--secondary-color);
    }
    
    .discussion-category.motivation {
        background-color: rgba(255, 209, 102, 0.1);
        color: var(--warning-color);
    }
    
    /* Ticket Status Modal */
    .ticket-search {
        margin-bottom: 30px;
    }
    
    .ticket-search p {
        color: var(--text-secondary);
        margin-bottom: 20px;
    }
    
    .ticket-search .search-box {
        display: flex;
        gap: 10px;
        position: relative;
    }
    
    .ticket-search .search-box i {
        position: absolute;
        left: 15px;
        top: 50%;
        transform: translateY(-50%);
        color: var(--text-secondary);
    }
    
    .ticket-search .search-box input {
        flex: 1;
        padding: 12px 15px 12px 45px;
        border: 1px solid var(--border-color);
        border-radius: var(--radius-sm);
        background-color: var(--bg-light);
        color: var(--text-primary);
    }
    
    .status-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 30px;
        padding-bottom: 20px;
        border-bottom: 1px solid var(--border-color);
    }
    
    .status-header h3 {
        font-size: 1.2rem;
        color: var(--text-primary);
    }
    
    .status-badge {
        padding: 5px 15px;
        border-radius: 20px;
        font-size: 0.9rem;
        font-weight: 600;
    }
    
    .status-badge.open {
        background-color: rgba(6, 214, 160, 0.1);
        color: var(--accent-color);
    }
    
    .status-badge.in-progress {
        background-color: rgba(255, 209, 102, 0.1);
        color: var(--warning-color);
    }
    
    .status-badge.resolved {
        background-color: rgba(67, 97, 238, 0.1);
        color: var(--primary-color);
    }
    
    .status-timeline {
        margin-bottom: 30px;
    }
    
    .timeline-item {
        display: flex;
        margin-bottom: 25px;
        position: relative;
    }
    
    .timeline-item:last-child {
        margin-bottom: 0;
    }
    
    .timeline-dot {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background-color: var(--border-color);
        margin-right: 15px;
        position: relative;
        z-index: 1;
    }
    
    .timeline-item.active .timeline-dot {
        background-color: var(--primary-color);
    }
    
    .timeline-item:not(:last-child):after {
        content: '';
        position: absolute;
        left: 10px;
        top: 20px;
        width: 2px;
        height: calc(100% + 5px);
        background-color: var(--border-color);
    }
    
    .timeline-content {
        flex: 1;
    }
    
    .timeline-content h4 {
        font-size: 1rem;
        margin-bottom: 5px;
        color: var(--text-primary);
    }
    
    .timeline-content p {
        color: var(--text-secondary);
        font-size: 0.9rem;
        margin-bottom: 5px;
    }
    
    .timeline-time {
        font-size: 0.8rem;
        color: var(--text-secondary);
    }
    
    .status-actions {
        display: flex;
        justify-content: flex-end;
        gap: 15px;
        padding-top: 20px;
        border-top: 1px solid var(--border-color);
    }
    
    @media (max-width: 992px) {
        .contact-grid {
            grid-template-columns: 1fr;
        }
        
        .tutorials-grid {
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        }
        
        .community-stats {
            grid-template-columns: 1fr;
        }
    }
    
    @media (max-width: 768px) {
        .faq-section,
        .tutorials-section,
        .community-section {
            padding: 25px;
        }
        
        .help-options-grid {
            grid-template-columns: 1fr 1fr;
        }
        
        .discussion-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 15px;
        }
        
        .discussion-activity {
            flex-direction: row;
            align-items: center;
            width: 100%;
            justify-content: space-between;
        }
        
        .status-actions {
            flex-direction: column;
        }
    }
    
    @media (max-width: 576px) {
        .help-options-grid {
            grid-template-columns: 1fr;
        }
        
        .tutorials-grid {
            grid-template-columns: 1fr;
        }
        
        .support-stats {
            flex-direction: column;
            gap: 10px;
        }
        
        .faq-categories {
            flex-direction: column;
        }
        
        .faq-category-btn {
            text-align: left;
        }
        
        .ticket-search .search-box {
            flex-direction: column;
        }
        
        .ticket-search .search-box i {
            top: 12px;
        }
    }
    `;
    document.head.appendChild(supportStyles);
});