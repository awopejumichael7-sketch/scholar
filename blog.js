// ===== BLOG MANAGER =====
class BlogManager {
    constructor() {
        this.articles = [];
        this.currentCategory = 'all';
        this.currentSort = 'newest';
        
        this.init();
    }
    
    init() {
        this.cacheElements();
        this.bindEvents();
        this.loadArticles();
        this.renderArticles();
    }
    
    cacheElements() {
        this.elements = {
            articlesGrid: document.getElementById('articlesGrid'),
            blogSearch: document.getElementById('blogSearch'),
            sortArticles: document.getElementById('sortArticles'),
            categoryCards: document.querySelectorAll('.category-card'),
            newsletterForm: document.getElementById('newsletterForm'),
            articleModal: document.getElementById('articleModal'),
            modalArticleTitle: document.getElementById('modalArticleTitle'),
            modalArticleCategory: document.getElementById('modalArticleCategory'),
            modalAuthorImage: document.getElementById('modalAuthorImage'),
            modalAuthorName: document.getElementById('modalAuthorName'),
            modalArticleDate: document.getElementById('modalArticleDate'),
            modalArticleViews: document.getElementById('modalArticleViews'),
            modalArticleTime: document.getElementById('modalArticleTime'),
            modalArticleContent: document.getElementById('modalArticleContent'),
            modalArticleTags: document.getElementById('modalArticleTags'),
            relatedArticles: document.getElementById('relatedArticles')
        };
    }
    
    bindEvents() {
        // Category filtering
        this.elements.categoryCards.forEach(card => {
            card.addEventListener('click', (e) => {
                // Remove active class from all cards
                this.elements.categoryCards.forEach(c => c.classList.remove('active'));
                
                // Add active class to clicked card
                e.currentTarget.classList.add('active');
                
                // Update current category
                this.currentCategory = e.currentTarget.dataset.category;
                
                // Filter articles
                this.filterAndSortArticles();
            });
        });
        
        // Search
        this.elements.blogSearch?.addEventListener('input', () => {
            this.filterAndSortArticles();
        });
        
        // Sort
        this.elements.sortArticles?.addEventListener('change', (e) => {
            this.currentSort = e.target.value;
            this.filterAndSortArticles();
        });
        
        // Newsletter subscription
        this.elements.newsletterForm?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.subscribeToNewsletter();
        });
        
        // Modal close button
        document.querySelector('#articleModal .modal-close')?.addEventListener('click', () => {
            this.closeArticleModal();
        });
        
        // Close modal on outside click
        window.addEventListener('click', (e) => {
            if (e.target === this.elements.articleModal) {
                this.closeArticleModal();
            }
        });
    }
    
    loadArticles() {
        // Sample articles data
        this.articles = [
            {
                id: 1,
                title: "10 Proven Strategies to Ace Your WAEC Exams",
                excerpt: "Discover the most effective study techniques used by top-performing students to excel in WAEC examinations.",
                category: "exam-tips",
                author: {
                    name: "Mr. Johnson",
                    image: "https://ui-avatars.com/api/?name=Mr+Johnson&background=4361ee&color=fff"
                },
                date: "March 15, 2024",
                readTime: 8,
                views: 1245,
                tags: ["WAEC", "Study Tips", "Exam Strategy"],
                featured: true,
                content: `
                    <h3>Introduction</h3>
                    <p>WAEC examinations are a crucial milestone in every Nigerian student's academic journey. With proper preparation and the right strategies, you can achieve outstanding results.</p>
                    
                    <h3>1. Create a Study Schedule</h3>
                    <p>Plan your study sessions in advance. Allocate specific times for each subject and stick to your schedule. Consistency is key to effective learning.</p>
                    
                    <h3>2. Use Past Questions</h3>
                    <p>Practicing with past questions helps you understand the exam pattern and identify frequently tested topics. Aim to complete at least 5 years of past questions.</p>
                    
                    <h3>3. Active Recall Technique</h3>
                    <p>Instead of passively reading, actively test yourself on what you've learned. This strengthens memory retention and improves recall during exams.</p>
                    
                    <h3>4. Join Study Groups</h3>
                    <p>Collaborative learning can provide different perspectives and help clarify difficult concepts. Limit study groups to 3-5 serious students.</p>
                    
                    <h3>5. Take Care of Your Health</h3>
                    <p>Don't neglect sleep, nutrition, and exercise. A healthy body supports a healthy mind, especially during intense study periods.</p>
                `
            },
            {
                id: 2,
                title: "Mastering Mathematics: From Basics to Advanced",
                excerpt: "A comprehensive guide to improving your math skills for JAMB and WAEC examinations.",
                category: "subject-guides",
                author: {
                    name: "Dr. Mathematics",
                    image: "https://ui-avatars.com/api/?name=Dr+Math&background=7209b7&color=fff"
                },
                date: "March 10, 2024",
                readTime: 12,
                views: 987,
                tags: ["Mathematics", "JAMB", "Problem Solving"],
                featured: false,
                content: `
                    <h3>Understanding the Fundamentals</h3>
                    <p>Mathematics builds upon foundational concepts. Ensure you have a strong grasp of basic arithmetic, algebra, and geometry before moving to advanced topics.</p>
                    
                    <h3>Common Problem Areas</h3>
                    <ul>
                        <li>Algebraic expressions and equations</li>
                        <li>Trigonometric functions</li>
                        <li>Calculus basics</li>
                        <li>Statistics and probability</li>
                    </ul>
                    
                    <h3>Practice Strategies</h3>
                    <p>Solve at least 20 math problems daily. Focus on understanding the methodology rather than just getting the answer.</p>
                `
            },
            {
                id: 3,
                title: "Overcoming Exam Anxiety: A Student's Guide",
                excerpt: "Learn practical techniques to manage stress and perform your best under pressure.",
                category: "motivation",
                author: {
                    name: "Sarah Williams",
                    image: "https://ui-avatars.com/api/?name=Sarah+W&background=06d6a0&color=fff"
                },
                date: "March 5, 2024",
                readTime: 6,
                views: 1567,
                tags: ["Mental Health", "Stress Management", "Exam Anxiety"],
                featured: false,
                content: `
                    <h3>Understanding Exam Anxiety</h3>
                    <p>Exam anxiety is a normal response to pressure, but it can be managed with the right techniques.</p>
                    
                    <h3>Breathing Exercises</h3>
                    <p>Practice deep breathing: Inhale for 4 seconds, hold for 7 seconds, exhale for 8 seconds. Repeat 5 times.</p>
                    
                    <h3>Positive Visualization</h3>
                    <p>Visualize yourself successfully completing the exam. This builds confidence and reduces anxiety.</p>
                `
            },
            {
                id: 4,
                title: "Effective Note-Taking Methods for Better Retention",
                excerpt: "Discover scientific approaches to taking notes that actually help you remember information.",
                category: "study-techniques",
                author: {
                    name: "Professor Note",
                    image: "https://ui-avatars.com/api/?name=Prof+Note&background=ff9e00&color=fff"
                },
                date: "February 28, 2024",
                readTime: 10,
                views: 834,
                tags: ["Study Techniques", "Memory", "Learning"],
                featured: false,
                content: `
                    <h3>The Cornell Method</h3>
                    <p>Divide your page into three sections: notes, cues, and summary. This structured approach improves review efficiency.</p>
                    
                    <h3>Mind Mapping</h3>
                    <p>Create visual diagrams that connect concepts. This works especially well for subjects like Biology and Literature.</p>
                `
            },
            {
                id: 5,
                title: "JAMB CBT: What to Expect on Exam Day",
                excerpt: "A complete walkthrough of the JAMB Computer-Based Test experience.",
                category: "exam-tips",
                author: {
                    name: "JAMB Expert",
                    image: "https://ui-avatars.com/api/?name=JAMB+Expert&background=ef476f&color=fff"
                },
                date: "February 20, 2024",
                readTime: 7,
                views: 2103,
                tags: ["JAMB", "CBT", "Exam Day"],
                featured: false,
                content: `
                    <h3>Before the Exam</h3>
                    <p>Arrive at least 30 minutes early. Bring your registration printout and valid ID. Electronic devices are not allowed.</p>
                    
                    <h3>During the Exam</h3>
                    <p>You'll have 120 minutes for 180 questions. Use the navigation panel to track your progress. Flag difficult questions for review.</p>
                `
            },
            {
                id: 6,
                title: "Career Paths for Science Students in Nigeria",
                excerpt: "Explore the various career opportunities available to students with science backgrounds.",
                category: "career-advice",
                author: {
                    name: "Career Guide",
                    image: "https://ui-avatars.com/api/?name=Career+Guide&background=3a86ff&color=fff"
                },
                date: "February 15, 2024",
                readTime: 15,
                views: 567,
                tags: ["Career", "Science", "Future"],
                featured: false,
                content: `
                    <h3>Medical Fields</h3>
                    <p>Medicine, Pharmacy, Dentistry, and Nursing remain popular choices with good career prospects.</p>
                    
                    <h3>Engineering</h3>
                    <p>Civil, Mechanical, Electrical, and Computer Engineering offer diverse opportunities in Nigeria's growing economy.</p>
                `
            }
        ];
    }
    
    filterAndSortArticles() {
        let filteredArticles = [...this.articles];
        
        // Filter by category
        if (this.currentCategory !== 'all') {
            filteredArticles = filteredArticles.filter(article => 
                article.category === this.currentCategory
            );
        }
        
        // Filter by search term
        const searchTerm = this.elements.blogSearch?.value.toLowerCase();
        if (searchTerm) {
            filteredArticles = filteredArticles.filter(article =>
                article.title.toLowerCase().includes(searchTerm) ||
                article.excerpt.toLowerCase().includes(searchTerm) ||
                article.tags.some(tag => tag.toLowerCase().includes(searchTerm))
            );
        }
        
        // Sort articles
        switch(this.currentSort) {
            case 'newest':
                // Assuming dates are in "Month Day, Year" format
                // In a real app, you'd parse dates properly
                filteredArticles.sort((a, b) => b.id - a.id); // Using ID as proxy for date
                break;
            case 'popular':
                filteredArticles.sort((a, b) => b.views - a.views);
                break;
            case 'reading-time':
                filteredArticles.sort((a, b) => a.readTime - b.readTime);
                break;
        }
        
        this.renderArticles(filteredArticles);
    }
    
    renderArticles(articlesToShow = null) {
        const articles = articlesToShow || this.articles;
        const grid = this.elements.articlesGrid;
        if (!grid) return;
        
        // Don't show featured article in grid (it's already shown separately)
        const gridArticles = articles.filter(article => !article.featured);
        
        if (gridArticles.length === 0) {
            grid.innerHTML = `
                <div class="no-articles">
                    <i class="fas fa-search"></i>
                    <h3>No articles found</h3>
                    <p>Try adjusting your search or filter criteria</p>
                </div>
            `;
            return;
        }
        
        let html = '';
        gridArticles.forEach(article => {
            // Get category display name
            const categoryNames = {
                'exam-tips': 'Exam Tips',
                'study-techniques': 'Study Techniques',
                'subject-guides': 'Subject Guides',
                'career-advice': 'Career Advice',
                'motivation': 'Motivation'
            };
            
            html += `
                <div class="article-card" data-id="${article.id}">
                    <div class="article-image">
                        <span class="article-category ${article.category}">
                            ${categoryNames[article.category] || article.category}
                        </span>
                    </div>
                    <div class="article-content">
                        <h3>${article.title}</h3>
                        <p class="article-excerpt">${article.excerpt}</p>
                        <div class="article-meta">
                            <div class="author">
                                <img src="${article.author.image}" alt="${article.author.name}">
                                <span>${article.author.name}</span>
                            </div>
                            <div class="article-info">
                                <span><i class="far fa-calendar"></i> ${article.date}</span>
                                <span><i class="far fa-clock"></i> ${article.readTime} min</span>
                            </div>
                        </div>
                        <div class="article-footer">
                            <div class="article-tags">
                                ${article.tags.map(tag => `<span class="tag">#${tag}</span>`).join('')}
                            </div>
                            <button class="btn btn-outline btn-small read-article-btn" data-id="${article.id}">
                                Read More
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });
        
        grid.innerHTML = html;
        
        // Add event listeners to read buttons
        document.querySelectorAll('.read-article-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const articleId = e.target.dataset.id;
                this.openArticle(articleId);
            });
        });
        
        // Also make entire article card clickable
        document.querySelectorAll('.article-card').forEach(card => {
            card.addEventListener('click', (e) => {
                // Don't trigger if clicking on button or link
                if (!e.target.closest('.read-article-btn') && !e.target.closest('a')) {
                    const articleId = card.dataset.id;
                    this.openArticle(articleId);
                }
            });
        });
    }
    
    openArticle(articleId) {
        const article = this.articles.find(a => a.id == articleId);
        if (!article) return;
        
        // Update modal content
        this.elements.modalArticleTitle.textContent = article.title;
        this.elements.modalArticleCategory.textContent = 
            article.category.replace('-', ' ').toUpperCase();
        this.elements.modalArticleCategory.className = `article-category ${article.category}`;
        
        this.elements.modalAuthorImage.src = article.author.image;
        this.elements.modalAuthorImage.alt = article.author.name;
        this.elements.modalAuthorName.textContent = article.author.name;
        this.elements.modalArticleDate.textContent = article.date;
        this.elements.modalArticleViews.textContent = article.views.toLocaleString();
        this.elements.modalArticleTime.textContent = article.readTime;
        
        this.elements.modalArticleContent.innerHTML = article.content;
        
        // Update tags
        this.elements.modalArticleTags.innerHTML = '';
        article.tags.forEach(tag => {
            const span = document.createElement('span');
            span.className = 'tag';
            span.textContent = `#${tag}`;
            this.elements.modalArticleTags.appendChild(span);
        });
        
        // Show related articles (filter by category, exclude current)
        this.showRelatedArticles(article);
        
        // Open modal
        this.elements.articleModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Increment view count (in a real app, this would be saved to server)
        article.views++;
    }
    
    showRelatedArticles(currentArticle) {
        const related = this.articles
            .filter(article => 
                article.id !== currentArticle.id && 
                (article.category === currentArticle.category || 
                 article.tags.some(tag => currentArticle.tags.includes(tag)))
            )
            .slice(0, 3); // Show max 3 related articles
        
        const container = this.elements.relatedArticles;
        if (!container) return;
        
        if (related.length === 0) {
            container.innerHTML = '<p>No related articles found.</p>';
            return;
        }
        
        let html = '';
        related.forEach(article => {
            html += `
                <div class="related-card" data-id="${article.id}">
                    <h4>${article.title}</h4>
                    <p class="related-excerpt">${article.excerpt.substring(0, 80)}...</p>
                    <div class="related-meta">
                        <span><i class="far fa-clock"></i> ${article.readTime} min</span>
                        <button class="btn-text read-related" data-id="${article.id}">
                            Read <i class="fas fa-arrow-right"></i>
                        </button>
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
        
        // Add event listeners to related article buttons
        document.querySelectorAll('.read-related').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent card click event
                const articleId = e.target.closest('.read-related').dataset.id;
                this.openArticle(articleId);
            });
        });
        
        // Make related cards clickable
        document.querySelectorAll('.related-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.read-related')) {
                    const articleId = card.dataset.id;
                    this.openArticle(articleId);
                }
            });
        });
    }
    
    closeArticleModal() {
        this.elements.articleModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
    
    subscribeToNewsletter() {
        const emailInput = this.elements.newsletterForm.querySelector('input[type="email"]');
        const email = emailInput.value.trim();
        
        if (!email) {
            if (window.ExamMaster) {
                window.ExamMaster.showNotification('Please enter your email address', 'error');
            }
            return;
        }
        
        // Simulate subscription process
        if (window.ExamMaster) {
            window.ExamMaster.showNotification('Subscribing to newsletter...', 'info');
        }
        
        setTimeout(() => {
            emailInput.value = '';
            
            if (window.ExamMaster) {
                window.ExamMaster.showNotification('Successfully subscribed to newsletter!', 'success');
            }
        }, 1000);
    }
}

// ===== INITIALIZE BLOG MANAGER =====
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the blog page
    if (document.getElementById('articlesGrid')) {
        const blogManager = new BlogManager();
        
        // Make manager available globally
        window.blogManager = blogManager;
    }
    
    // Add blog-specific styles
    const blogStyles = document.createElement('style');
    blogStyles.textContent = `
    .blog-container {
        padding-top: 120px;
        min-height: 100vh;
    }
    
    .blog-header {
        text-align: center;
        margin-bottom: 40px;
    }
    
    .blog-header h1 {
        font-size: 2.5rem;
        margin-bottom: 15px;
        color: var(--text-primary);
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 15px;
    }
    
    .blog-header p {
        color: var(--text-secondary);
        font-size: 1.1rem;
        max-width: 600px;
        margin: 0 auto 25px;
    }
    
    .blog-stats {
        display: flex;
        justify-content: center;
        gap: 30px;
        color: var(--text-secondary);
    }
    
    .blog-stats span {
        display: flex;
        align-items: center;
        gap: 8px;
    }
    
    .featured-article {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 40px;
        margin-bottom: 50px;
        background-color: var(--bg-white);
        border-radius: var(--radius);
        overflow: hidden;
        box-shadow: var(--shadow-lg);
    }
    
    .featured-image {
        position: relative;
        min-height: 300px;
        background: linear-gradient(135deg, #4361ee, #3a56d4);
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .featured-badge {
        position: absolute;
        top: 20px;
        left: 20px;
        background-color: var(--warning-color);
        color: var(--text-primary);
        padding: 8px 15px;
        border-radius: 20px;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 8px;
    }
    
    .featured-image:before {
        content: "📚";
        font-size: 4rem;
        opacity: 0.2;
    }
    
    .featured-content {
        padding: 40px;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
    
    .featured-content .article-category {
        margin-bottom: 15px;
        align-self: flex-start;
    }
    
    .featured-content h2 {
        font-size: 1.8rem;
        margin-bottom: 20px;
        color: var(--text-primary);
        line-height: 1.4;
    }
    
    .article-excerpt {
        color: var(--text-secondary);
        margin-bottom: 30px;
        line-height: 1.6;
    }
    
    .article-meta {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: auto;
    }
    
    .author {
        display: flex;
        align-items: center;
        gap: 15px;
    }
    
    .author img {
        width: 45px;
        height: 45px;
        border-radius: 50%;
    }
    
    .author-name {
        display: block;
        font-weight: 600;
        color: var(--text-primary);
        margin-bottom: 5px;
    }
    
    .article-date {
        display: block;
        font-size: 0.9rem;
        color: var(--text-secondary);
    }
    
    .blog-categories {
        margin-bottom: 40px;
    }
    
    .blog-categories h2 {
        font-size: 1.5rem;
        margin-bottom: 25px;
        color: var(--text-primary);
    }
    
    .categories-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 15px;
    }
    
    .category-card {
        padding: 20px;
        background-color: var(--bg-white);
        border: 2px solid var(--border-color);
        border-radius: var(--radius);
        cursor: pointer;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 15px;
        transition: var(--transition);
    }
    
    .category-card:hover {
        border-color: var(--primary-color);
        transform: translateY(-3px);
        box-shadow: var(--shadow);
    }
    
    .category-card.active {
        background-color: var(--primary-color);
        border-color: var(--primary-color);
        color: white;
    }
    
    .category-card.active i {
        color: white;
    }
    
    .category-card i {
        font-size: 2rem;
        color: var(--primary-color);
    }
    
    .category-card span {
        font-weight: 500;
    }
    
    .blog-search {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 40px;
        padding-bottom: 30px;
        border-bottom: 1px solid var(--border-color);
    }
    
    .search-box {
        flex: 1;
        max-width: 500px;
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
    
    .sort-options {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .sort-options label {
        color: var(--text-secondary);
    }
    
    .sort-options select {
        padding: 8px 15px;
        border: 1px solid var(--border-color);
        border-radius: var(--radius-sm);
        background-color: var(--bg-white);
        color: var(--text-primary);
    }
    
    .articles-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 30px;
        margin-bottom: 60px;
    }
    
    .article-card {
        background-color: var(--bg-white);
        border-radius: var(--radius);
        overflow: hidden;
        box-shadow: var(--shadow);
        transition: var(--transition);
        cursor: pointer;
    }
    
    .article-card:hover {
        transform: translateY(-10px);
        box-shadow: var(--shadow-lg);
    }
    
    .article-image {
        height: 180px;
        background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
        position: relative;
    }
    
    .article-category {
        position: absolute;
        top: 15px;
        left: 15px;
        padding: 5px 15px;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: 600;
        color: white;
    }
    
    .article-category.exam-tips {
        background-color: var(--primary-color);
    }
    
    .article-category.study-techniques {
        background-color: var(--secondary-color);
    }
    
    .article-category.subject-guides {
        background-color: var(--accent-color);
    }
    
    .article-category.career-advice {
        background-color: var(--warning-color);
        color: var(--text-primary);
    }
    
    .article-category.motivation {
        background-color: var(--danger-color);
    }
    
    .article-content {
        padding: 25px;
    }
    
    .article-content h3 {
        font-size: 1.2rem;
        margin-bottom: 15px;
        color: var(--text-primary);
        line-height: 1.4;
    }
    
    .article-content .article-excerpt {
        color: var(--text-secondary);
        margin-bottom: 20px;
        line-height: 1.6;
        font-size: 0.95rem;
    }
    
    .article-content .article-meta {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        padding-bottom: 20px;
        border-bottom: 1px solid var(--border-color);
    }
    
    .article-content .author {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .article-content .author img {
        width: 35px;
        height: 35px;
    }
    
    .article-content .author span {
        font-size: 0.9rem;
        font-weight: 500;
        color: var(--text-primary);
    }
    
    .article-info {
        display: flex;
        gap: 15px;
        font-size: 0.8rem;
        color: var(--text-secondary);
    }
    
    .article-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .article-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
    }
    
    .tag {
        padding: 3px 10px;
        background-color: var(--bg-light);
        border-radius: 15px;
        font-size: 0.8rem;
        color: var(--text-secondary);
    }
    
    .no-articles {
        text-align: center;
        padding: 60px 20px;
        grid-column: 1 / -1;
    }
    
    .no-articles i {
        font-size: 3rem;
        color: var(--border-color);
        margin-bottom: 15px;
    }
    
    .no-articles h3 {
        font-size: 1.5rem;
        margin-bottom: 10px;
        color: var(--text-primary);
    }
    
    .no-articles p {
        color: var(--text-secondary);
    }
    
    .newsletter-section {
        background-color: var(--bg-white);
        border-radius: var(--radius);
        padding: 50px;
        text-align: center;
        margin-bottom: 60px;
        box-shadow: var(--shadow);
    }
    
    .newsletter-content h2 {
        font-size: 1.8rem;
        margin-bottom: 15px;
        color: var(--text-primary);
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
    }
    
    .newsletter-content p {
        color: var(--text-secondary);
        margin-bottom: 30px;
        max-width: 500px;
        margin-left: auto;
        margin-right: auto;
    }
    
    .newsletter-form {
        display: flex;
        max-width: 400px;
        margin: 0 auto 20px;
    }
    
    .newsletter-form input {
        flex: 1;
        padding: 15px;
        border: 1px solid var(--border-color);
        border-radius: var(--radius-sm) 0 0 var(--radius-sm);
        background-color: var(--bg-light);
        color: var(--text-primary);
    }
    
    .newsletter-form button {
        border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
    }
    
    .privacy-note {
        font-size: 0.9rem;
        color: var(--text-secondary);
    }
    
    .popular-tags {
        margin-bottom: 60px;
    }
    
    .popular-tags h2 {
        font-size: 1.5rem;
        margin-bottom: 25px;
        color: var(--text-primary);
    }
    
    .tags-container {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
    }
    
    .tags-container .tag {
        padding: 8px 15px;
        background-color: var(--bg-light);
        border-radius: 20px;
        font-size: 0.9rem;
        cursor: pointer;
        transition: var(--transition);
    }
    
    .tags-container .tag:hover {
        background-color: var(--primary-color);
        color: white;
    }
    
    /* Article Modal */
    .article-header {
        margin-bottom: 30px;
        padding-bottom: 20px;
        border-bottom: 1px solid var(--border-color);
    }
    
    .article-header .article-meta {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 20px;
    }
    
    .article-stats {
        display: flex;
        gap: 20px;
        color: var(--text-secondary);
        font-size: 0.9rem;
    }
    
    .article-content {
        line-height: 1.8;
        color: var(--text-primary);
        margin-bottom: 40px;
    }
    
    .article-content h3 {
        font-size: 1.3rem;
        margin: 30px 0 15px;
        color: var(--text-primary);
    }
    
    .article-content p {
        margin-bottom: 15px;
    }
    
    .article-content ul {
        margin-left: 20px;
        margin-bottom: 15px;
    }
    
    .article-content li {
        margin-bottom: 8px;
    }
    
    .article-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 25px 0;
        border-top: 1px solid var(--border-color);
        border-bottom: 1px solid var(--border-color);
        margin-bottom: 40px;
    }
    
    .article-actions {
        display: flex;
        gap: 10px;
    }
    
    .related-articles h3 {
        font-size: 1.3rem;
        margin-bottom: 25px;
        color: var(--text-primary);
    }
    
    .related-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 20px;
    }
    
    .related-card {
        padding: 20px;
        background-color: var(--bg-light);
        border-radius: var(--radius);
        cursor: pointer;
        transition: var(--transition);
    }
    
    .related-card:hover {
        background-color: var(--border-color);
    }
    
    .related-card h4 {
        font-size: 1rem;
        margin-bottom: 10px;
        color: var(--text-primary);
    }
    
    .related-excerpt {
        color: var(--text-secondary);
        font-size: 0.9rem;
        margin-bottom: 15px;
    }
    
    .related-meta {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 0.9rem;
        color: var(--text-secondary);
    }
    
    .btn-text {
        background: none;
        border: none;
        color: var(--primary-color);
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 5px;
        font-weight: 500;
    }
    
    .btn-text:hover {
        text-decoration: underline;
    }
    
    @media (max-width: 992px) {
        .featured-article {
            grid-template-columns: 1fr;
        }
        
        .featured-image {
            min-height: 200px;
        }
    }
    
    @media (max-width: 768px) {
        .blog-search {
            flex-direction: column;
            gap: 20px;
            align-items: flex-start;
        }
        
        .search-box {
            max-width: 100%;
            width: 100%;
        }
        
        .article-header .article-meta {
            flex-direction: column;
            gap: 15px;
            align-items: flex-start;
        }
        
        .article-footer {
            flex-direction: column;
            gap: 20px;
            align-items: flex-start;
        }
        
        .newsletter-section {
            padding: 30px;
        }
        
        .newsletter-form {
            flex-direction: column;
        }
        
        .newsletter-form input {
            border-radius: var(--radius-sm);
            margin-bottom: 10px;
        }
        
        .newsletter-form button {
            border-radius: var(--radius-sm);
            width: 100%;
        }
    }
    
    @media (max-width: 576px) {
        .articles-grid {
            grid-template-columns: 1fr;
        }
        
        .categories-grid {
            grid-template-columns: 1fr 1fr;
        }
        
        .blog-stats {
            flex-direction: column;
            gap: 10px;
        }
        
        .related-grid {
            grid-template-columns: 1fr;
        }
    }
    `;
    document.head.appendChild(blogStyles);
});