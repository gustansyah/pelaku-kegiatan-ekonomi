document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerOffset = 80; // Height of the fixed header
                const elementPosition = targetSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add active class to navigation items based on scroll position
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('.section');
        const navLinks = document.querySelectorAll('.nav-link');
        const header = document.querySelector('.header');
        
        // Add/remove scrolled class to header
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Only update active nav link if not hovering over navigation
        if (!header.matches(':hover')) {
            let current = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                
                if (window.pageYOffset >= (sectionTop - 100)) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href').slice(1) === current) {
                    link.classList.add('active');
                }
            });
        }
    });

    // Add animation to elements when they come into view
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe material cards, video containers, highlight cards, and flipbook
    document.querySelectorAll('.material-card, .video-container, .highlight-card, .flipbook-container').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Add loading states for iframes
    function addIframeLoading() {
        const iframes = document.querySelectorAll('iframe');
        iframes.forEach(iframe => {
            // Skip the flipbook iframe as it has its own loading handler
            if (iframe.id === 'flipbook-iframe') return;
            
            const wrapper = document.createElement('div');
            wrapper.className = 'iframe-loading-wrapper';
            wrapper.style.position = 'relative';
            
            const loader = document.createElement('div');
            loader.className = 'iframe-loader';
            loader.innerHTML = '<div class="spinner"></div><p>Loading content...</p>';
            
            iframe.parentNode.insertBefore(wrapper, iframe);
            wrapper.appendChild(iframe);
            wrapper.appendChild(loader);
            
            iframe.addEventListener('load', function() {
                setTimeout(() => {
                    loader.style.opacity = '0';
                    setTimeout(() => {
                        loader.style.display = 'none';
                    }, 300);
                }, 500);
                
                // Add loaded class to flipbook wrapper
                const flipbookWrapper = iframe.closest('.flipbook-wrapper');
                if (flipbookWrapper) {
                    flipbookWrapper.classList.add('loaded');
                }
            });
        });
    }

    // Initialize iframe loading
    addIframeLoading();

    // Flipbook specific loading and error handling
    function initFlipbook() {
        const flipbookIframe = document.getElementById('flipbook-iframe');
        const flipbookLoader = document.getElementById('flipbook-loader');
        const flipbookFallback = document.getElementById('flipbook-fallback');
        const flipbookWrapper = document.getElementById('flipbook-wrapper');
        
        if (!flipbookIframe || !flipbookLoader || !flipbookFallback || !flipbookWrapper) return;
        
        let loadAttempted = false;
        let fallbackShown = false;
        
        // Set multiple timeouts with different strategies
        const shortTimeout = setTimeout(() => {
            if (!loadAttempted && !fallbackShown) {
                // First attempt: try to reload with a different approach
                tryAlternativeLoad();
            }
        }, 8000); // 8 seconds
        
        const longTimeout = setTimeout(() => {
            if (!fallbackShown) {
                showFlipbookFallback();
            }
        }, 15000); // 15 seconds final timeout
        
        function tryAlternativeLoad() {
            if (loadAttempted) return;
            loadAttempted = true;
            
            // Try to reload the iframe with a different source or parameters
            const currentSrc = flipbookIframe.src;
            if (currentSrc.includes('heyzine.com')) {
                // Add a timestamp to prevent caching issues
                const separator = currentSrc.includes('?') ? '&' : '?';
                flipbookIframe.src = currentSrc + separator + 't=' + Date.now();
                
                // If this alternative load fails, show fallback after additional time
                setTimeout(() => {
                    if (!fallbackShown) {
                        showFlipbookFallback();
                    }
                }, 7000);
            } else {
                showFlipbookFallback();
            }
        }
        
        // Handle iframe load success
        flipbookIframe.addEventListener('load', function() {
            clearTimeout(shortTimeout);
            clearTimeout(longTimeout);
            
            // Check if iframe actually loaded content
            try {
                // Try to access iframe content (may be blocked by CORS)
                const iframeDoc = flipbookIframe.contentDocument || flipbookIframe.contentWindow.document;
                if (iframeDoc && iframeDoc.body && iframeDoc.body.innerHTML.length > 0) {
                    // Successfully loaded
                    flipbookLoader.classList.add('hidden');
                    flipbookWrapper.classList.add('loaded');
                } else {
                    // Empty content, try alternative load or show fallback
                    if (!loadAttempted) {
                        tryAlternativeLoad();
                    } else {
                        showFlipbookFallback();
                    }
                }
            } catch (e) {
                // CORS error, but iframe might still be loading correctly
                // Wait a bit more to see if it loads
                setTimeout(() => {
                    try {
                        // Check if iframe is visible and has content
                        const rect = flipbookIframe.getBoundingClientRect();
                        if (rect.width > 0 && rect.height > 0) {
                            flipbookLoader.classList.add('hidden');
                            flipbookWrapper.classList.add('loaded');
                        } else if (!fallbackShown) {
                            showFlipbookFallback();
                        }
                    } catch (err) {
                        if (!fallbackShown) {
                            showFlipbookFallback();
                        }
                    }
                }, 3000);
            }
        });
        
        // Handle iframe load error
        flipbookIframe.addEventListener('error', function() {
            clearTimeout(shortTimeout);
            clearTimeout(longTimeout);
            if (!fallbackShown) {
                showFlipbookFallback();
            }
        });
        
        function showFlipbookFallback() {
            if (fallbackShown) return;
            fallbackShown = true;
            
            clearTimeout(shortTimeout);
            clearTimeout(longTimeout);
            
            flipbookLoader.classList.add('hidden');
            flipbookIframe.style.display = 'none';
            flipbookFallback.style.display = 'flex';
            
            // Add a retry button to the fallback
            const fallbackContent = flipbookFallback.querySelector('.fallback-content');
            if (fallbackContent) {
                const retryButton = document.createElement('button');
                retryButton.className = 'assessment-btn';
                retryButton.textContent = 'Coba Lagi';
                retryButton.style.marginTop = '1rem';
                retryButton.addEventListener('click', function() {
                    // Reset and try again
                    flipbookFallback.style.display = 'none';
                    flipbookIframe.style.display = 'block';
                    flipbookLoader.classList.remove('hidden');
                    
                    // Reload the iframe
                    const currentSrc = flipbookIframe.src;
                    flipbookIframe.src = currentSrc;
                    
                    // Reinitialize the flipbook
                    setTimeout(() => {
                        initFlipbook();
                    }, 1000);
                });
                
                fallbackContent.appendChild(retryButton);
            }
        }
    }

    // Initialize flipbook when flipbook section is visible
    const flipbookObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                initFlipbook();
                flipbookObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    const flipbookSection = document.getElementById('flipbook');
    if (flipbookSection) {
        flipbookObserver.observe(flipbookSection);
    }

    // Add interactive hover effects for cards
    function addCardInteractions() {
        const cards = document.querySelectorAll('.material-card, .video-container, .highlight-card');
        cards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-8px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });
    }

    // Initialize card interactions
    addCardInteractions();

    // Add progress indicator for page scroll
    function createProgressBar() {
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        document.body.appendChild(progressBar);
        
        window.addEventListener('scroll', function() {
            const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (window.scrollY / windowHeight) * 100;
            progressBar.style.width = scrolled + '%';
        });
    }

    // Initialize progress bar
    createProgressBar();

    // Add smooth reveal animation for questions in highlight section
    function animateQuestions() {
        const questions = document.querySelectorAll('.questions h3');
        questions.forEach((question, index) => {
            question.style.opacity = '0';
            question.style.transform = 'translateX(-20px)';
            question.style.transition = `opacity 0.5s ease ${index * 0.2}s, transform 0.5s ease ${index * 0.2}s`;
            
            setTimeout(() => {
                question.style.opacity = '1';
                question.style.transform = 'translateX(0)';
            }, 500 + (index * 200));
        });
    }

    // Initialize question animations when highlight section is visible
    const highlightObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateQuestions();
                highlightObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    const highlightSection = document.querySelector('.highlight-section');
    if (highlightSection) {
        highlightObserver.observe(highlightSection);
    }

    // Add keyboard navigation support
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const hamburger = document.querySelector('.hamburger');
            const navMenu = document.querySelector('.nav-menu');
            if (hamburger && navMenu) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        }
    });

    // Add focus management for accessibility
    function manageFocus() {
        const focusableElements = document.querySelectorAll('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
        
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];
                
                if (e.shiftKey && document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                } else if (!e.shiftKey && document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        });
    }

    // Initialize focus management
    manageFocus();

    // Assessment functionality
    function initAssessment() {
        const questions = [
            {
                question: "Kegiatan ekonomi yang dilakukan oleh rumah tangga konsumen adalah...",
                options: [
                    "membayar pajak perusahaan.",
                    "melakukan kegiatan produksi.",
                    "menggunakan faktor produksi untuk konsumsi.",
                    "menggunakan faktor produksi untuk menambah kegunaan suatu barang.",
                    "menggunakan barang dan jasa."
                ],
                correct: 4,
                points: 0
            },
            {
                question: "Diagram arus sirkular dua sektor menunjukkan interaksi antar pelaku ekonomi, yaitu...",
                options: [
                    "masyarakat luar negeri dan pemerintah.",
                    "pemerintah dan rumah tangga produsen.",
                    "rumah tangga konsumen dan pemerintah.",
                    "rumah tangga konsumen dan rumah tangga produsen.",
                    "rumah tangga produsen dan masyarakat luar negeri."
                ],
                correct: 3,
                points: 0
            },
            {
                question: "Kegiatan menyalurkan barang atau jasa disebut...",
                options: [
                    "produksi.",
                    "konsumsi.",
                    "distribusi.",
                    "perdagangan",
                    "perantara"
                ],
                correct: 2,
                points: 0
            },
            {
                question: "Menggunakan faktor produksi, menghasilkan barang dan jasa, serta memberikan imbalan adalah peran rumah tangga....",
                options: [
                    "produksi",
                    "konsumsi",
                    "distribusi",
                    "distributor",
                    "produsen"
                ],
                correct: 4,
                points: 10
            },
            {
                question: "Makan dan minum, menggunakan pakaian, menonton TV merupakan contoh kegiatan ekonomi yang disebut....",
                options: [
                    "distribusi",
                    "konsumsi",
                    "produksi",
                    "pertukaran",
                    "penjualan"
                ],
                correct: 1,
                points: 10
            },
            {
                question: "Peran yang sama dimainkan oleh rumah tangga konsumen dan rumah tangga produsen terhadap pemerintah adalah....",
                options: [
                    "menggunakan faktor produksi",
                    "menawarkan faktor produksi",
                    "mendistribusikan barang",
                    "membayar pajak",
                    "membeli faktor produksi"
                ],
                correct: 3,
                points: 10
            },
            {
                question: "Menyediakan fasilitas umum, memberikan subsidi, menjadi produsen dan konsumen adalah peran rumah tangga....",
                options: [
                    "pemerintah",
                    "produsen",
                    "konsumen",
                    "keluarga",
                    "masyarakat luar negeri"
                ],
                correct: 0,
                points: 10
            },
            {
                question: "Manfaat interaksi antar pelaku ekonomi bagi rumah tangga adalah...",
                options: [
                    "memperluas lapangan kerja dan menghasilkan pendapatan.",
                    "mengurangi daya beli masyarakat.",
                    "mengurangi peredaran uang.",
                    "meminimalkan peluang perdagangan.",
                    "membatasi kegiatan ekspor dan impor."
                ],
                correct: 0,
                points: 20
            },
            {
                question: "Jika pemerintah merekrut dan mempekerjakan pegawai negeri serta membeli material untuk pembangunan proyek jembatan dari PT Semen Padang, maka dalam hal ini pemerintah berperan sebagai...",
                options: [
                    "produsen.",
                    "konsumen.",
                    "distributor.",
                    "pengatur.",
                    "fasilitator."
                ],
                correct: 1,
                points: 20
            },
            {
                question: "Rumah tangga konsumen memegang peran penting dalam kegiatan ekonomi karena...",
                options: [
                    "menciptakan lapangan kerja.",
                    "menggunakan hasil produksi.",
                    "mengatur kegiatan perdagangan.",
                    "mendistribusikan produk industri.",
                    "menetapkan harga pasar."
                ],
                correct: 1,
                points: 20
            }
        ];

        let currentQuestion = 0;
        let score = 0;
        let answers = [];
        let studentName = '';
        let studentClass = '';

        // Quiz form elements
        const quizStartForm = document.getElementById('quiz-start-form');
        const fullNameInput = document.getElementById('full-name');
        const classInput = document.getElementById('class');
        const startQuizBtn = document.getElementById('start-quiz-btn');
        
        // Quiz content elements
        const quizContent = document.getElementById('quiz-content');
        const studentNameDisplay = document.getElementById('student-name');
        const studentClassDisplay = document.getElementById('student-class');
        const assessmentContent = document.getElementById('assessment-content');
        const progressBar = document.getElementById('progress-bar');
        const questionCounter = document.getElementById('question-counter');
        const scoreDisplay = document.getElementById('score-display');
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        const assessmentScore = document.getElementById('assessment-score');
        const scoreValue = document.getElementById('score-value');
        const scoreMessage = document.getElementById('score-message');
        const restartBtn = document.getElementById('restart-btn');

        function startQuiz() {
            studentName = fullNameInput.value.trim();
            studentClass = classInput.value.trim();
            
            if (!studentName || !studentClass) {
                alert('Silakan isi nama dan kelas Anda sebelum memulai kuis.');
                return;
            }
            
            // Hide start form and show quiz content
            quizStartForm.style.display = 'none';
            quizContent.style.display = 'block';
            
            // Update student info display
            studentNameDisplay.textContent = studentName;
            studentClassDisplay.textContent = studentClass;
            
            // Initialize quiz
            displayQuestion();
        }

        function displayQuestion() {
            const question = questions[currentQuestion];
            const questionHTML = `
                <div class="question-container active">
                    <div class="question-text">Pertanyaan ${currentQuestion + 1} dari ${questions.length}</div>
                    <div class="question-text">${question.question}</div>
                    <div class="answer-options">
                        ${question.options.map((option, index) => `
                            <div class="answer-option" data-index="${index}" tabindex="0" role="button" aria-pressed="false">
                                ${String.fromCharCode(65 + index)}. ${option}
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
            
            assessmentContent.innerHTML = questionHTML;
            questionCounter.textContent = `Pertanyaan ${currentQuestion + 1} dari ${questions.length}`;
            updateProgress();
            updateScoreDisplay();
            
            // Add event listeners to answer options
            const answerOptions = document.querySelectorAll('.answer-option');
            answerOptions.forEach(option => {
                option.addEventListener('click', function() {
                    selectAnswer(parseInt(this.dataset.index));
                });
                
                option.addEventListener('keydown', function(e) {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        selectAnswer(parseInt(this.dataset.index));
                    }
                });
            });
            
            // Restore previous answer if exists
            if (answers[currentQuestion] !== undefined) {
                selectAnswer(answers[currentQuestion]);
            }
            
            updateButtons();
        }

        function selectAnswer(index) {
            const answerOptions = document.querySelectorAll('.answer-option');
            answerOptions.forEach(option => {
                option.classList.remove('selected');
                option.setAttribute('aria-pressed', 'false');
            });
            
            answerOptions[index].classList.add('selected');
            answerOptions[index].setAttribute('aria-pressed', 'true');
            
            answers[currentQuestion] = index;
            updateButtons();
        }

        function updateButtons() {
            prevBtn.disabled = currentQuestion === 0;
            nextBtn.disabled = answers[currentQuestion] === undefined;
        }

        function updateProgress() {
            const progress = ((currentQuestion + 1) / questions.length) * 100;
            progressBar.style.width = `${progress}%`;
        }

        function updateScoreDisplay() {
            scoreDisplay.textContent = `Score: ${score}`;
        }

        function calculateScore() {
            score = 0;
            answers.forEach((answer, index) => {
                if (answer === questions[index].correct) {
                    score += questions[index].points;
                }
            });
            return score;
        }

        function showResults() {
            calculateScore();
            
            assessmentContent.style.display = 'none';
            document.querySelector('.assessment-controls').style.display = 'none';
            assessmentScore.style.display = 'block';
            
            scoreValue.textContent = score;
            
            let message = '';
            if (score >= 90) {
                message = 'Luar biasa! Anda memiliki pemahaman yang sempurna tentang pelaku kegiatan ekonomi!';
            } else if (score >= 70) {
                message = 'Kerja bagus! Anda memiliki pemahaman yang baik tentang materi.';
            } else if (score >= 50) {
                message = 'Usaha yang baik. Ada beberapa bidang yang mungkin perlu Anda pelajari kembali.';
            } else {
                message = 'Terus belajar! Pelajari kembali materi dan coba lagi.';
            }
            
            scoreMessage.textContent = message;
        }

        function nextQuestion() {
            if (currentQuestion < questions.length - 1) {
                currentQuestion++;
                displayQuestion();
            } else {
                showResults();
            }
        }

        function prevQuestion() {
            if (currentQuestion > 0) {
                currentQuestion--;
                displayQuestion();
            }
        }

        function restartAssessment() {
            currentQuestion = 0;
            score = 0;
            answers = [];
            
            // Reset form
            fullNameInput.value = '';
            classInput.value = '';
            
            // Show start form and hide quiz content
            quizStartForm.style.display = 'block';
            quizContent.style.display = 'none';
            assessmentContent.style.display = 'block';
            document.querySelector('.assessment-controls').style.display = 'flex';
            assessmentScore.style.display = 'none';
        }

        // Add event listeners
        startQuizBtn.addEventListener('click', startQuiz);
        nextBtn.addEventListener('click', nextQuestion);
        prevBtn.addEventListener('click', prevQuestion);
        restartBtn.addEventListener('click', restartAssessment);

        // Allow Enter key to start quiz
        fullNameInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                classInput.focus();
            }
        });

        classInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                startQuiz();
            }
        });
    }

    // Initialize assessment when assessment section is visible
    const assessmentObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                initAssessment();
                assessmentObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    const assessmentSection = document.getElementById('assessment');
    if (assessmentSection) {
        assessmentObserver.observe(assessmentSection);
    }
});