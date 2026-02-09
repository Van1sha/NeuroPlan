// Website JavaScript for Smart Study Planner

// Mobile Navigation Toggle
const navToggle = document.getElementById('navToggle');
const navMenu = document.querySelector('.nav-menu');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Scroll to Top Button
const scrollTopBtn = document.getElementById('scrollTop');

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        scrollTopBtn.classList.add('show');
    } else {
        scrollTopBtn.classList.remove('show');
    }
});

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offset = 80; // Account for fixed navbar
            const targetPosition = target.offsetTop - offset;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Download App Function
function downloadApp() {
    // Create a zip-like download experience
    // In a real scenario, you would have the files zipped
    
    // Show a loading state
    const btn = event.target.closest('.btn');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<span class="btn-icon">⏳</span> Preparing Download...';
    btn.disabled = true;
    
    // Simulate download preparation
    setTimeout(() => {
        // Create download links for each file
        const files = [
            { name: 'index.html', content: 'index.html' },
            { name: 'styles.css', content: 'styles.css' },
            { name: 'script.js', content: 'script.js' },
            { name: 'README.md', content: 'README.md' }
        ];
        
        // Show success message
        btn.innerHTML = '<span class="btn-icon">✓</span> Ready to Download!';
        btn.style.background = 'var(--success)';
        
        setTimeout(() => {
            // Reset button
            btn.innerHTML = originalText;
            btn.disabled = false;
            btn.style.background = '';
            
            // Show instructions
            showDownloadInstructions();
        }, 2000);
    }, 1500);
}

function showDownloadInstructions() {
    // Create modal for download instructions
    const modal = document.createElement('div');
    modal.className = 'download-modal';
    modal.innerHTML = `
        <div class="modal-overlay" onclick="closeDownloadModal()"></div>
        <div class="modal-content">
            <button class="modal-close" onclick="closeDownloadModal()">×</button>
            <h2>📥 Download Instructions</h2>
            <div class="modal-body">
                <h3>Method 1: Direct Download</h3>
                <ol>
                    <li>Right-click on the links below and select "Save Link As..."</li>
                    <li>Save all 4 files to the same folder on your computer</li>
                    <li>Open <code>index.html</code> in your browser</li>
                </ol>
                <div class="download-links">
                    <a href="index.html" download class="download-link">📄 index.html</a>
                    <a href="styles.css" download class="download-link">🎨 styles.css</a>
                    <a href="script.js" download class="download-link">⚙️ script.js</a>
                    <a href="README.md" download class="download-link">📖 README.md</a>
                </div>
                
                <h3 style="margin-top: 2rem;">Method 2: Quick Start</h3>
                <ol>
                    <li>Download the files using the links above</li>
                    <li>Place all files in a folder (e.g., "StudyPlanner")</li>
                    <li>Double-click <code>index.html</code> to open</li>
                    <li>Start planning your studies!</li>
                </ol>
                
                <div class="download-note">
                    <strong>💡 Tip:</strong> Bookmark the planner in your browser for easy access!
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Add modal styles if not already present
    if (!document.getElementById('modal-styles')) {
        const style = document.createElement('style');
        style.id = 'modal-styles';
        style.textContent = `
            .download-modal {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
                animation: fadeIn 0.3s ease;
            }
            
            .modal-overlay {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.7);
                backdrop-filter: blur(4px);
            }
            
            .modal-content {
                position: relative;
                background: white;
                border-radius: 16px;
                padding: 2rem;
                max-width: 600px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                animation: slideUp 0.3s ease;
            }
            
            .modal-close {
                position: absolute;
                top: 1rem;
                right: 1rem;
                background: none;
                border: none;
                font-size: 2rem;
                color: #999;
                cursor: pointer;
                transition: color 0.3s ease;
            }
            
            .modal-close:hover {
                color: #333;
            }
            
            .modal-content h2 {
                color: var(--primary);
                margin-bottom: 1.5rem;
                font-size: 1.8rem;
            }
            
            .modal-content h3 {
                color: var(--text-dark);
                margin: 1.5rem 0 1rem;
                font-size: 1.3rem;
            }
            
            .modal-body ol {
                margin-left: 1.5rem;
                line-height: 2;
            }
            
            .modal-body li {
                margin-bottom: 0.5rem;
                color: var(--text-light);
            }
            
            .modal-body code {
                background: var(--bg-light);
                padding: 0.2rem 0.5rem;
                border-radius: 4px;
                font-family: monospace;
                color: var(--primary);
            }
            
            .download-links {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 1rem;
                margin: 1.5rem 0;
            }
            
            .download-link {
                padding: 1rem;
                background: var(--bg-light);
                border: 2px solid var(--border);
                border-radius: 8px;
                text-decoration: none;
                color: var(--text-dark);
                font-weight: 600;
                text-align: center;
                transition: all 0.3s ease;
                display: block;
            }
            
            .download-link:hover {
                background: var(--gradient);
                color: white;
                border-color: transparent;
                transform: translateY(-2px);
            }
            
            .download-note {
                background: #e6f7ff;
                border-left: 4px solid #1890ff;
                padding: 1rem;
                border-radius: 4px;
                margin-top: 1.5rem;
                color: var(--text-dark);
            }
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            @keyframes slideUp {
                from { transform: translateY(50px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            
            @media (max-width: 768px) {
                .download-links {
                    grid-template-columns: 1fr;
                }
                
                .modal-content {
                    padding: 1.5rem;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

function closeDownloadModal() {
    const modal = document.querySelector('.download-modal');
    if (modal) {
        modal.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
            modal.remove();
            document.body.style.overflow = '';
        }, 300);
    }
}

// Add fadeOut animation
const fadeOutStyle = document.createElement('style');
fadeOutStyle.textContent = `
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
`;
document.head.appendChild(fadeOutStyle);

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    // Add animation styles
    const animationStyle = document.createElement('style');
    animationStyle.textContent = `
        .feature-card,
        .step,
        .benefit-item,
        .testimonial-card,
        .faq-item {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
    `;
    document.head.appendChild(animationStyle);
    
    // Observe all animated elements
    const animatedElements = document.querySelectorAll(
        '.feature-card, .step, .benefit-item, .testimonial-card, .faq-item'
    );
    
    animatedElements.forEach(el => {
        observer.observe(el);
    });
});

// Add counter animation for stats
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start);
        }
    }, 16);
}

// Animate counters when they come into view
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
            entry.target.classList.add('animated');
            const target = entry.target.textContent;
            if (!isNaN(target)) {
                animateCounter(entry.target, parseInt(target));
            }
        }
    });
}, { threshold: 0.5 });

// Observe stat numbers
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.stat-number').forEach(stat => {
        statsObserver.observe(stat);
    });
});

// Add particle effect to hero section
function createParticle() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.cssText = `
        position: absolute;
        width: 4px;
        height: 4px;
        background: rgba(255, 255, 255, 0.5);
        border-radius: 50%;
        pointer-events: none;
        animation: float-particle ${Math.random() * 3 + 2}s linear infinite;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
    `;
    
    hero.appendChild(particle);
    
    setTimeout(() => {
        particle.remove();
    }, 5000);
}

// Add particle animation style
const particleStyle = document.createElement('style');
particleStyle.textContent = `
    @keyframes float-particle {
        0% {
            transform: translateY(0) translateX(0);
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        90% {
            opacity: 1;
        }
        100% {
            transform: translateY(-100px) translateX(${Math.random() * 100 - 50}px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(particleStyle);

// Create particles periodically
setInterval(createParticle, 500);

// Dashboard Mockup Interactivity

// Sidebar navigation and other DOM-dependent code moved to DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    // Hide all detail views initially
    const detailViews = document.querySelectorAll('.detail-view');
    detailViews.forEach(view => view.style.display = 'none');

    // Sidebar navigation
    const sidebarItems = document.querySelectorAll('.sidebar-item');
    const mockupViews = document.querySelectorAll('.mockup-view');

    sidebarItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove active class from all sidebar items
            sidebarItems.forEach(si => si.classList.remove('active'));
            // Add active class to clicked item
            item.classList.add('active');

            // Hide all views
            mockupViews.forEach(view => view.classList.remove('active'));

            // Hide all detail views
            detailViews.forEach(view => view.style.display = 'none');

            // Show selected view
            const viewId = item.getAttribute('data-view') + '-view';
            const targetView = document.getElementById(viewId);
            if (targetView) {
                targetView.classList.add('active');

                // Trigger animations for dashboard view
                if (viewId === 'dashboard-view') {
                    animateDashboardStats();
                }
            }
        });
    });

    // Animated counters for dashboard stats
    function animateDashboardStats() {
        const statNumbers = document.querySelectorAll('#dashboard-view .stat-number[data-target]');

        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'));
            const duration = 2000; // 2 seconds
            const start = 0;
            const increment = target / (duration / 16);
            let current = start;

            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    stat.textContent = target;
                    clearInterval(timer);
                } else {
                    stat.textContent = Math.floor(current);
                }
            }, 16);
        });
    }

    // Add tooltips to stat cards
    const tooltipStatCards = document.querySelectorAll('.stat-card');

    tooltipStatCards.forEach(card => {
        card.addEventListener('mouseenter', (e) => {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = 'Click to view detailed analytics';
            tooltip.style.cssText = `
                position: absolute;
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 0.5rem 1rem;
                border-radius: 6px;
                font-size: 0.8rem;
                pointer-events: none;
                z-index: 1000;
                top: ${e.clientY - 40}px;
                left: ${e.clientX + 10}px;
                animation: fadeInTooltip 0.2s ease;
            `;

            document.body.appendChild(tooltip);

            card.addEventListener('mouseleave', () => {
                tooltip.remove();
            }, { once: true });
        });
    });

    // Add click animations to interactive elements
    const interactiveElements = document.querySelectorAll('.stat-card, .subject-item, .schedule-item, .task-item');

    interactiveElements.forEach(element => {
        element.addEventListener('click', () => {
            element.style.transform = 'scale(0.95)';
            setTimeout(() => {
                element.style.transform = '';
            }, 150);
        });
    });

    // Make task checkboxes functional
    const taskCheckboxes = document.querySelectorAll('#tasks-view .task-checkbox');

    taskCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('click', () => {
            const taskItem = checkbox.closest('.task-item');
            taskItem.classList.toggle('completed');
            if (taskItem.classList.contains('completed')) {
                checkbox.textContent = '✓';
            } else {
                checkbox.textContent = '○';
            }
        });
    });

    // Add Subject functionality
    const addSubjectBtn = document.querySelector('#subjects-view .mockup-btn');
    if (addSubjectBtn) {
        addSubjectBtn.addEventListener('click', () => {
            showAddSubjectModal();
        });
    }

    // Add Task functionality
    const addTaskBtn = document.querySelector('#tasks-view .mockup-btn');
    if (addTaskBtn) {
        addTaskBtn.addEventListener('click', () => {
            showAddTaskModal();
        });
    }

    // Progress bar animations
    function animateProgressBars() {
        const progressFills = document.querySelectorAll('.progress-fill');

        progressFills.forEach(fill => {
            const width = fill.style.width;
            fill.style.width = '0%';
            setTimeout(() => {
                fill.style.width = width;
            }, 500);
        });
    }

    // Chart bar animations for analytics
    function animateChartBars() {
        const chartBars = document.querySelectorAll('.chart-bar');

        chartBars.forEach((bar, index) => {
            const height = bar.style.height;
            bar.style.height = '0%';
            setTimeout(() => {
                bar.style.height = height;
            }, 200 * index);
        });
    }

    // Initialize animations when dashboard view is shown
    // Initial dashboard animation
    setTimeout(() => {
        animateDashboardStats();
        animateProgressBars();
        animateChartBars();
    }, 1000);

    // Add floating animation to mockup
    const mockup = document.querySelector('.hero-mockup');
    if (mockup) {
        mockup.addEventListener('mouseenter', () => {
            mockup.style.animation = 'float 2s ease-in-out infinite';
        });

        mockup.addEventListener('mouseleave', () => {
            mockup.style.animation = 'float 3s ease-in-out infinite';
        });
    }

    const statCards = document.querySelectorAll('.stat-card[data-detail]');
    const detailCloses = document.querySelectorAll('.detail-close');

    // Open detail views
    statCards.forEach(card => {
        card.addEventListener('click', () => {
            const detailType = card.getAttribute('data-detail');
            const detailView = document.getElementById(detailType + '-detail');
            if (detailView) {
                detailView.style.display = 'block';
                // Allow overflow to show detail
                const hero = document.querySelector('.hero');
                const mockupMain = document.querySelector('.mockup-main');
                if (hero) hero.style.overflow = 'visible';
                if (mockupMain) mockupMain.style.overflow = 'visible';
                // Trigger animations
                if (detailType === 'subjects') {
                    // Subjects grid animation
                } else if (detailType === 'analytics') {
                    // Analytics tabs animation
                    setTimeout(() => {
                        const analyticsTabs = document.querySelectorAll('.analytics-tab');
                        analyticsTabs.forEach((tab, index) => {
                            setTimeout(() => {
                                tab.style.transform = 'translateY(0)';
                                tab.style.opacity = '1';
                            }, index * 100);
                        });
                    }, 300);
                }
            }
        });
    });

    // Close detail views
    detailCloses.forEach(close => {
        close.addEventListener('click', () => {
            const detailView = close.closest('.detail-view');
            if (detailView) {
                detailView.style.display = 'none';
                // Reset overflow
                const hero = document.querySelector('.hero');
                const mockupMain = document.querySelector('.mockup-main');
                if (hero) hero.style.overflow = 'hidden';
                if (mockupMain) mockupMain.style.overflow = 'auto';
            }
        });
    });

    // Calendar navigation
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');
    const calendarTitle = document.querySelector('.calendar-title');

    if (prevMonthBtn && nextMonthBtn && calendarTitle) {
        let currentDate = new Date(2024, 2, 15); // March 2024

        function updateCalendarTitle() {
            const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                              'July', 'August', 'September', 'October', 'November', 'December'];
            calendarTitle.textContent = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
        }

        prevMonthBtn.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() - 1);
            updateCalendarTitle();
        });

        nextMonthBtn.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() + 1);
            updateCalendarTitle();
        });
    }

    // Analytics tabs
    const analyticsTabs = document.querySelectorAll('.analytics-tab');
    const analyticsCharts = document.querySelectorAll('.analytics-chart');

    analyticsTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs
            analyticsTabs.forEach(t => t.classList.remove('active'));
            // Add active class to clicked tab
            tab.classList.add('active');

            // Hide all charts
            analyticsCharts.forEach(chart => chart.classList.remove('active'));

            // Show selected chart
            const tabType = tab.getAttribute('data-tab');
            const targetChart = document.getElementById(`${tabType}-chart`);
            if (targetChart) {
                targetChart.classList.add('active');
            }
        });
    });

    // Animate bar charts on view
    function animateBarCharts() {
        const barFills = document.querySelectorAll('.bar-fill');
        barFills.forEach((fill, index) => {
            setTimeout(() => {
                fill.style.height = fill.style.height || '50%';
            }, index * 200);
        });
    }

    // Trigger animations when analytics view is shown
    document.addEventListener('click', (e) => {
        if (e.target.closest('.stat-card[data-detail="analytics"]')) {
            setTimeout(animateBarCharts, 500);
        }
    });

    // Add tooltip styles dynamically
    const tooltipStyle = document.createElement('style');
    tooltipStyle.textContent = `
        @keyframes fadeInTooltip {
            from { opacity: 0; transform: translateY(5px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .analytics-tab {
            transform: translateY(20px);
            opacity: 0;
            transition: all 0.3s ease;
        }
    `;
    document.head.appendChild(tooltipStyle);
});

// Add Subject Modal
function showAddSubjectModal() {
    const modal = document.createElement('div');
    modal.className = 'add-modal';
    modal.innerHTML = `
        <div class="modal-overlay" onclick="closeAddModal()"></div>
        <div class="modal-content">
            <button class="modal-close" onclick="closeAddModal()">×</button>
            <h2>📚 Add New Subject</h2>
            <div class="modal-body">
                <div class="form-group">
                    <label for="subject-name">Subject Name</label>
                    <input type="text" id="subject-name" placeholder="e.g., Mathematics" required>
                </div>
                <div class="form-group">
                    <label for="subject-color">Color</label>
                    <select id="subject-color">
                        <option value="#667eea">Blue</option>
                        <option value="#764ba2">Purple</option>
                        <option value="#f093fb">Pink</option>
                        <option value="#4facfe">Light Blue</option>
                        <option value="#00f2fe">Cyan</option>
                        <option value="#f5576c">Red</option>
                        <option value="#48bb78">Green</option>
                        <option value="#ffbd2e">Orange</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="subject-hours">Weekly Hours Goal</label>
                    <input type="number" id="subject-hours" placeholder="e.g., 10" min="1" max="50" required>
                </div>
                <div class="modal-actions">
                    <button class="btn btn-secondary" onclick="closeAddModal()">Cancel</button>
                    <button class="btn btn-primary" onclick="addSubject()">Add Subject</button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';

    // Add modal styles if not already present
    if (!document.getElementById('add-modal-styles')) {
        const style = document.createElement('style');
        style.id = 'add-modal-styles';
        style.textContent = `
            .add-modal {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
                animation: fadeIn 0.3s ease;
            }
            .modal-overlay {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.7);
                backdrop-filter: blur(4px);
            }
            .modal-content {
                position: relative;
                background: white;
                border-radius: 16px;
                padding: 2rem;
                max-width: 500px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                animation: slideUp 0.3s ease;
            }
            .modal-close {
                position: absolute;
                top: 1rem;
                right: 1rem;
                background: none;
                border: none;
                font-size: 2rem;
                color: #999;
                cursor: pointer;
                transition: color 0.3s ease;
            }
            .modal-close:hover {
                color: #333;
            }
            .modal-content h2 {
                color: var(--primary);
                margin-bottom: 1.5rem;
                font-size: 1.8rem;
            }
            .form-group {
                margin-bottom: 1.5rem;
            }
            .form-group label {
                display: block;
                margin-bottom: 0.5rem;
                font-weight: 600;
                color: var(--text-dark);
            }
            .form-group input, .form-group select {
                width: 100%;
                padding: 0.75rem;
                border: 2px solid var(--border);
                border-radius: 8px;
                font-size: 1rem;
                transition: border-color 0.3s ease;
            }
            .form-group input:focus, .form-group select:focus {
                outline: none;
                border-color: var(--primary);
            }
            .modal-actions {
                display: flex;
                gap: 1rem;
                justify-content: flex-end;
                margin-top: 2rem;
            }
            .btn {
                padding: 0.75rem 1.5rem;
                border-radius: 8px;
                font-size: 1rem;
                font-weight: 600;
                text-decoration: none;
                transition: all 0.3s ease;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                border: none;
            }
            .btn-secondary {
                background: var(--bg-light);
                color: var(--text-dark);
            }
            .btn-primary {
                background: var(--gradient);
                color: white;
            }
            .btn:hover {
                transform: translateY(-2px);
            }
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes slideUp {
                from { transform: translateY(50px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            @media (max-width: 768px) {
                .modal-content {
                    padding: 1.5rem;
                }
                .modal-actions {
                    flex-direction: column;
                }
                .btn {
                    width: 100%;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Add Task Modal
function showAddTaskModal() {
    const modal = document.createElement('div');
    modal.className = 'add-modal';
    modal.innerHTML = `
        <div class="modal-overlay" onclick="closeAddModal()"></div>
        <div class="modal-content">
            <button class="modal-close" onclick="closeAddModal()">×</button>
            <h2>✓ Add New Task</h2>
            <div class="modal-body">
                <div class="form-group">
                    <label for="task-title">Task Title</label>
                    <input type="text" id="task-title" placeholder="e.g., Complete Math Homework" required>
                </div>
                <div class="form-group">
                    <label for="task-priority">Priority</label>
                    <select id="task-priority">
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="task-due">Due Date</label>
                    <input type="date" id="task-due" required>
                </div>
                <div class="modal-actions">
                    <button class="btn btn-secondary" onclick="closeAddModal()">Cancel</button>
                    <button class="btn btn-primary" onclick="addTask()">Add Task</button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
}

// Close Add Modal
function closeAddModal() {
    const modal = document.querySelector('.add-modal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = '';
    }
}

// Add Subject Function
function addSubject() {
    const name = document.getElementById('subject-name').value.trim();
    const color = document.getElementById('subject-color').value;
    const hours = document.getElementById('subject-hours').value;

    if (!name || !hours) {
        alert('Please fill in all required fields.');
        return;
    }

    // Create new subject item
    const subjectItem = document.createElement('div');
    subjectItem.className = 'subject-item';
    subjectItem.style.borderLeftColor = color;
    subjectItem.innerHTML = `
        <div class="subject-name">${name}</div>
        <div class="subject-stats">0 tasks • ${hours}h/week</div>
    `;

    // Add to subjects list
    const subjectsList = document.querySelector('#subjects-view .subjects-list');
    if (subjectsList) {
        subjectsList.appendChild(subjectItem);
    }

    closeAddModal();
}

// Add Task Function
function addTask() {
    const title = document.getElementById('task-title').value.trim();
    const priority = document.getElementById('task-priority').value;
    const dueDate = document.getElementById('task-due').value;

    if (!title || !dueDate) {
        alert('Please fill in all required fields.');
        return;
    }

    // Format due date
    const due = new Date(dueDate);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    let dueText = due.toLocaleDateString();
    if (due.toDateString() === today.toDateString()) {
        dueText = 'Today';
    } else if (due.toDateString() === tomorrow.toDateString()) {
        dueText = 'Tomorrow';
    }

    // Create new task item
    const taskItem = document.createElement('div');
    taskItem.className = 'task-item';
    taskItem.innerHTML = `
        <div class="task-checkbox">○</div>
        <div class="task-content">
            <div class="task-title">${title}</div>
            <div class="task-meta">Due: ${dueText} • ${priority.charAt(0).toUpperCase() + priority.slice(1)} Priority</div>
        </div>
    `;

    // Add click handler for checkbox
    const checkbox = taskItem.querySelector('.task-checkbox');
    checkbox.addEventListener('click', () => {
        taskItem.classList.toggle('completed');
        if (taskItem.classList.contains('completed')) {
            checkbox.textContent = '✓';
        } else {
            checkbox.textContent = '○';
        }
    });

    // Add to tasks list
    const tasksList = document.querySelector('#tasks-view .tasks-list');
    if (tasksList) {
        tasksList.appendChild(taskItem);
    }

    closeAddModal();
}

// Log page load
console.log('🎓 Smart Study Planner Website Loaded!');
console.log('📚 Ready to help students achieve academic excellence!');
console.log('🎯 Dashboard mockup is now fully interactive!');
