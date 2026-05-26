/**
 * Rido's Creative & Tech Journal
 * Core JavaScript Logic for GitHub Pages Static Version
 * 
 * Mengatur interaktivitas website: Dark/Light Mode, Hamburger Menu,
 * Scroll Animation, Loading Screen, pelacakan Google Analytics event,
 * dan rendering konten artikel dinamis secara client-side.
 */

document.addEventListener("DOMContentLoaded", () => {
    // ----------------------------------------------------
    // 1. PAGE LOADER INITIALIZATION
    // ----------------------------------------------------
    const loader = document.getElementById("loader");
    if (loader) {
        window.addEventListener("load", () => {
            loader.style.opacity = "0";
            loader.style.visibility = "hidden";
        });
        
        setTimeout(() => {
            loader.style.opacity = "0";
            loader.style.visibility = "hidden";
        }, 800);
    }

    // ----------------------------------------------------
    // 2. DARK / LIGHT MODE SWITCHING
    // ----------------------------------------------------
    const themeToggleBtn = document.getElementById("theme-toggle");
    const currentTheme = localStorage.getItem("theme") || "light";

    document.documentElement.setAttribute("data-theme", currentTheme);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener("click", () => {
            let activeTheme = document.documentElement.getAttribute("data-theme");
            let newTheme = "light";

            if (activeTheme === "light") {
                newTheme = "dark";
            }

            document.documentElement.setAttribute("data-theme", newTheme);
            localStorage.setItem("theme", newTheme);

            if (typeof gtag === "function") {
                gtag("event", "theme_toggle", {
                    "event_category": "User Interaction",
                    "event_label": newTheme
                });
            }
        });
    }

    // ----------------------------------------------------
    // 3. RESPONSIVE MOBILE NAVIGATION (HAMBURGER)
    // ----------------------------------------------------
    const hamburger = document.getElementById("hamburger");
    const navMenu = document.getElementById("nav-menu");

    if (hamburger && navMenu) {
        hamburger.addEventListener("click", () => {
            hamburger.classList.toggle("active");
            navMenu.classList.toggle("active");
        });

        document.querySelectorAll(".nav-link").forEach(link => {
            link.addEventListener("click", () => {
                hamburger.classList.remove("active");
                navMenu.classList.remove("active");
            });
        });
    }

    // ----------------------------------------------------
    // 4. GOOGLE ANALYTICS INTERACTION TRACKERS
    // ----------------------------------------------------

    // A. Form Kontak Submission via EmailJS
    const contactForm = document.getElementById("contactForm");
    const toastSuccess = document.getElementById("toast-success");
    const toastError = document.getElementById("toast-error");
    const submitBtn = document.getElementById("contact-submit-btn");

    // Inisialisasi EmailJS dengan Public Key
    // PENTING: Ganti 'YOUR_PUBLIC_KEY' dengan Public Key dari akun EmailJS Anda
    if (typeof emailjs !== "undefined") {
        emailjs.init({ publicKey: "YzDeihn9NVvs0zCSm" });
    }

    if (contactForm) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const name = document.getElementById("name").value;
            const email = document.getElementById("email").value;
            const subject = document.getElementById("subject").value;
            const message = document.getElementById("message").value;

            // Loading state pada tombol submit
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Mengirim...';
            }

            // Kirim email via EmailJS
            // PENTING: Ganti 'YOUR_SERVICE_ID' dan 'YOUR_TEMPLATE_ID' dengan ID dari akun EmailJS Anda
            if (typeof emailjs !== "undefined") {
                emailjs.send("service_qt8mqnt", "template_149bj0d", {
                    from_name: name,
                    from_email: email,
                    subject: subject,
                    message: message,
                    to_email: "ridoanugrah2209@gmail.com"
                }).then(
                    (response) => {
                        console.log("Email berhasil terkirim!", response.status, response.text);

                        // Tampilkan toast sukses
                        if (toastSuccess) {
                            toastSuccess.classList.add("show");
                            setTimeout(() => {
                                toastSuccess.classList.remove("show");
                            }, 4000);
                        }

                        // Kirim event ke Google Analytics
                        if (typeof gtag === "function") {
                            gtag("event", "contact_form_submit", {
                                "event_category": "Contact Form",
                                "event_label": subject,
                                "user_name_masked": name.substring(0, 3) + "***"
                            });
                        }

                        contactForm.reset();
                    },
                    (error) => {
                        console.error("Gagal mengirim email:", error);

                        // Tampilkan toast error
                        if (toastError) {
                            toastError.classList.add("show");
                            setTimeout(() => {
                                toastError.classList.remove("show");
                            }, 4000);
                        }
                    }
                ).finally(() => {
                    // Kembalikan tombol ke state semula
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = 'Kirim Pesan <i class="fa-solid fa-paper-plane"></i>';
                    }
                });
            } else {
                // Fallback jika EmailJS tidak termuat
                console.warn("EmailJS SDK belum termuat. Menggunakan mailto sebagai fallback.");
                window.location.href = `mailto:ridoanugrah2209@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Dari: ${name} (${email})\n\n${message}`)}`;
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = 'Kirim Pesan <i class="fa-solid fa-paper-plane"></i>';
                }
            }
        });
    }

    // B. Form Komentar Submission Tracker
    const commentForm = document.getElementById("commentForm");
    if (commentForm) {
        commentForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const cName = document.getElementById("comment-name").value;
            const cText = document.getElementById("comment-text-input").value;
            const articleId = document.getElementById("comment-article-id").value;

            console.log(`Menambahkan Komentar ke Artikel ID ${articleId} oleh ${cName}: ${cText}`);

            const commentList = document.querySelector(".comment-list");
            if (commentList) {
                const newComment = document.createElement("div");
                newComment.className = "comment-item reveal revealed";
                newComment.innerHTML = `
                    <div class="comment-avatar" style="background-color: var(--secondary); color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700; width: 44px; height: 44px; border-radius: 50%;">${cName.charAt(0).toUpperCase()}</div>
                    <div class="comment-details">
                        <div class="comment-header">
                            <span class="comment-user">${cName}</span>
                            <span class="comment-date">Baru Saja</span>
                        </div>
                        <p class="comment-text">${cText}</p>
                    </div>
                `;
                commentList.appendChild(newComment);
            }

            if (typeof gtag === "function") {
                gtag("event", "comment_submit", {
                    "event_category": "Article Interaction",
                    "event_label": "Article ID: " + articleId
                });
            }

            commentForm.reset();
        });
    }

    // C. Pelacakan klik link sosial media untuk analisis konversi outbound
    const socialLinks = document.querySelectorAll(".social-track");
    socialLinks.forEach(link => {
        link.addEventListener("click", function() {
            const platform = this.getAttribute("data-platform");
            if (typeof gtag === "function") {
                gtag("event", "social_click", {
                    "event_category": "Social Media Link",
                    "event_label": platform,
                    "transport_type": "beacon"
                });
            }
        });
    });

    // D. Pelacakan klik unduh CV
    const downloadCvBtn = document.getElementById("download-cv-btn");
    if (downloadCvBtn) {
        downloadCvBtn.addEventListener("click", () => {
            if (typeof gtag === "function") {
                gtag("event", "file_download", {
                    "event_category": "Interactivity",
                    "event_label": "CV Downloaded",
                    "file_name": "CV_Rido_Anugrah.pdf"
                });
            }
            alert("File CV diunduh! (Simulasi file download untuk analisis event Google Analytics)");
        });
    }

    // ----------------------------------------------------
    // 5. CLIENT-SIDE DYNAMIC CONTENT RENDERING (for Static Pages)
    // ----------------------------------------------------
    
    // Pastikan `articles` global dari `articles-data.js` sudah termuat
    const articlesArray = typeof articles !== "undefined" ? Object.values(articles) : [];

    // A. RENDER LATEST ARTICLES ON HOMEPAGE (index.html)
    const homeArticlesGrid = document.querySelector(".articles-grid-home");
    if (homeArticlesGrid && articlesArray.length > 0) {
        // Ambil 3 artikel terbaru
        const latestArticles = articlesArray.slice(0, 3);
        homeArticlesGrid.innerHTML = latestArticles.map(art => `
            <article class="article-card reveal revealed">
                <div class="article-img-wrap">
                    <img src="${art.image}" alt="${art.title}">
                </div>
                <div class="article-card-content">
                    <div class="article-meta">
                        <span class="badge badge-primary">${art.category}</span>
                        <span><i class="fa-solid fa-calendar-days"></i> ${art.date}</span>
                    </div>
                    <a href="article.html?id=${art.id}">
                        <h3 class="article-card-title">${art.title}</h3>
                    </a>
                    <p class="article-card-summary">${art.summary}</p>
                    <div class="article-card-footer">
                        <span class="article-meta">
                            <span><i class="fa-solid fa-eye"></i> ${art.views} views</span>
                        </span>
                        <a href="article.html?id=${art.id}" class="article-read-more">
                            Baca Selengkapnya <i class="fa-solid fa-arrow-right-long"></i>
                        </a>
                    </div>
                </div>
            </article>
        `).join("");
    }

    // B. RENDER ALL ARTICLES ON BLOG PAGE (blog.html)
    const blogArticlesGrid = document.getElementById("articles-grid-all");
    const categoryBtns = document.querySelectorAll(".category-btn");

    if (blogArticlesGrid && articlesArray.length > 0) {
        const renderBlogArticles = (filterCategory = "all") => {
            const filtered = filterCategory === "all" 
                ? articlesArray 
                : articlesArray.filter(art => art.category_slug === filterCategory);

            if (filtered.length === 0) {
                blogArticlesGrid.innerHTML = `<p style="text-align: center; grid-column: 1/-1; color: var(--text-muted);">Belum ada artikel di kategori ini.</p>`;
                return;
            }

            blogArticlesGrid.innerHTML = filtered.map(art => `
                <article class="article-card reveal revealed">
                    <div class="article-img-wrap">
                        <img src="${art.image}" alt="${art.title}">
                    </div>
                    <div class="article-card-content">
                        <div class="article-meta">
                            <span class="badge badge-primary">${art.category}</span>
                            <span><i class="fa-solid fa-calendar-days"></i> ${art.date}</span>
                        </div>
                        <a href="article.html?id=${art.id}">
                            <h3 class="article-card-title">${art.title}</h3>
                        </a>
                        <p class="article-card-summary">${art.summary}</p>
                        <div class="article-card-footer">
                            <span class="article-meta">
                                <span><i class="fa-solid fa-eye"></i> ${art.views} views</span>
                            </span>
                            <a href="article.html?id=${art.id}" class="article-read-more">
                                Baca Selengkapnya <i class="fa-solid fa-arrow-right-long"></i>
                            </a>
                        </div>
                    </div>
                </article>
            `).join("");
        };

        // Render awal (All)
        renderBlogArticles("all");

        // Event listener untuk tombol filter kategori
        categoryBtns.forEach(btn => {
            btn.addEventListener("click", function() {
                categoryBtns.forEach(b => b.classList.remove("active"));
                this.classList.add("active");
                const categorySlug = this.getAttribute("data-category");
                renderBlogArticles(categorySlug);
            });
        });
    }

    // C. RENDER SINGLE ARTICLE DETAIL (article.html)
    const urlParams = new URLSearchParams(window.location.search);
    const articleIdParam = parseInt(urlParams.get("id"));
    const singleArticleLayout = document.getElementById("single-article-root");

    if (singleArticleLayout && typeof articles !== "undefined") {
        const article = articles[articleIdParam];

        if (!article) {
            // Redirect ke blog.html jika ID artikel tidak valid
            window.location.href = "blog.html";
        } else {
            // Update Title & Meta Description untuk SEO
            document.title = `${article.title} | Rido's Journal`;
            const metaDesc = document.querySelector('meta[name="description"]');
            if (metaDesc) {
                metaDesc.setAttribute("content", article.summary);
            }

            // Render detail artikel
            singleArticleLayout.innerHTML = `
                <!-- HEADER DETAIL ARTIKEL -->
                <header class="section-padding" style="padding-bottom: 20px;">
                    <div class="container article-header">
                        <span class="badge badge-primary reveal revealed">${article.category}</span>
                        <h1 class="article-title reveal revealed">${article.title}</h1>
                        
                        <div class="article-header-meta reveal revealed">
                            <span><i class="fa-solid fa-user"></i> Oleh: ${article.author}</span>
                            <span><i class="fa-solid fa-calendar-days"></i> ${article.date}</span>
                            <span><i class="fa-solid fa-clock"></i> ${article.read_time}</span>
                            <span><i class="fa-solid fa-eye"></i> ${article.views + 1} views</span>
                        </div>
                    </div>
                </header>

                <div class="container" style="margin-bottom: 80px;">
                    <!-- Gambar Utama Cover Artikel -->
                    <img src="${article.image}" alt="${article.title}" class="article-featured-img reveal revealed">

                    <!-- LAYOUT CONTENT & SIDEBAR -->
                    <div class="article-body-layout">
                        
                        <!-- KOLOM UTAMA: Isi Artikel & Komentar -->
                        <main class="reveal revealed">
                            
                            <!-- Konten Artikel -->
                            <article class="article-content">
                                ${article.content}
                            </article>

                            <!-- BAGIAN KOMENTAR -->
                            <section class="comments-section">
                                <h3 class="comments-title">Diskusi & Komentar</h3>

                                <!-- Daftar Komentar Dummy -->
                                <div class="comment-list">
                                    <div class="comment-item">
                                        <div class="comment-avatar" style="background-color: var(--primary); color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700; width: 44px; height: 44px; border-radius: 50%;">B</div>
                                        <div class="comment-details">
                                            <div class="comment-header">
                                                <span class="comment-user">Budi Santoso (IT Student)</span>
                                                <span class="comment-date">2 hari lalu</span>
                                            </div>
                                            <p class="comment-text">Artikel yang sangat bermanfaat! Sebagai mahasiswa semester 6, saya sangat setuju dengan roadmap frontend-nya. Memang dasar Vanilla JS wajib kuat dulu sebelum belajar React.</p>
                                        </div>
                                    </div>

                                    <div class="comment-item">
                                        <div class="comment-avatar" style="background-color: var(--secondary); color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700; width: 44px; height: 44px; border-radius: 50%;">S</div>
                                        <div class="comment-details">
                                            <div class="comment-header">
                                                <span class="comment-user">Siti Aminah</span>
                                                <span class="comment-date">1 hari lalu</span>
                                            </div>
                                            <p class="comment-text">Penulisan bahasanya santai dan mudah dipahami mahasiswa pemula. Terima kasih sudah berbagi tips bermanfaat ini kak Rido!</p>
                                        </div>
                                    </div>
                                </div>

                                <!-- Formulir Tambah Komentar Baru -->
                                <div class="comment-form-box">
                                    <h4 class="comment-form-title">Tinggalkan Komentar</h4>
                                    <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 20px;">Komentar Anda akan langsung dimuat secara instan di halaman ini (Simulasi AJAX untuk melacak event di GA4).</p>
                                    
                                    <form id="commentForm">
                                        <input type="hidden" id="comment-article-id" value="${article.id}">
                                        <div class="form-group">
                                            <label for="comment-name" class="form-label">Nama Lengkap *</label>
                                            <input type="text" id="comment-name" class="form-control" placeholder="Masukkan nama Anda" required>
                                        </div>
                                        <div class="form-group">
                                            <label for="comment-text-input" class="form-label">Isi Komentar *</label>
                                            <textarea id="comment-text-input" class="form-control" placeholder="Tulis tanggapan atau pertanyaan Anda mengenai artikel ini..." required></textarea>
                                        </div>
                                        <button type="submit" class="btn btn-primary">Kirim Komentar <i class="fa-solid fa-paper-plane"></i></button>
                                    </form>
                                </div>
                            </section>
                            
                        </main>

                        <!-- KOLOM KANAN: Mini Bio Penulis -->
                        <aside class="article-sidebar reveal revealed">
                            <div class="author-card">
                                <div class="author-avatar">
                                    <img src="assets/img/2.jpg" alt="Foto Rido Anugrah">
                                </div>
                                <div class="author-name">Rido Anugrah</div>
                                <div class="badge badge-secondary">Penulis Utama</div>
                                <p class="author-bio">
                                    Mahasiswa Teknik Informatika Semester 8 yang memiliki passion di bidang UI/UX, Frontend coding, dan pembuatan konten video kreatif.
                                </p>
                                <a href="about.html" class="btn btn-secondary" style="width: 100%; justify-content: center; padding: 10px 0;">Profil Lengkap</a>
                            </div>
                        </aside>

                    </div>

                    <!-- REKOMENDASI ARTIKEL LAIN -->
                    <section class="related-articles reveal revealed">
                        <h3 class="related-title">Artikel Rekomendasi</h3>
                        <div class="articles-grid-related"></div>
                    </section>
                </div>
            `;

            // Render Artikel Rekomendasi
            const relatedGrid = document.querySelector(".articles-grid-related");
            if (relatedGrid) {
                const recommendedList = articlesArray
                    .filter(art => art.id !== article.id)
                    .slice(0, 3);

                relatedGrid.className = "articles-grid";
                relatedGrid.innerHTML = recommendedList.map(rec => `
                    <article class="article-card">
                        <div class="article-img-wrap">
                            <img src="${rec.image}" alt="${rec.title}">
                        </div>
                        <div class="article-card-content">
                            <div class="article-meta">
                                <span class="badge badge-primary">${rec.category}</span>
                                <span><i class="fa-solid fa-calendar-days"></i> ${rec.date}</span>
                            </div>
                            <a href="article.html?id=${rec.id}">
                                <h3 class="article-card-title">${rec.title}</h3>
                            </a>
                            <p class="article-card-summary">${rec.summary}</p>
                            <div class="article-card-footer">
                                <a href="article.html?id=${rec.id}" class="article-read-more">
                                    Baca Selengkapnya <i class="fa-solid fa-arrow-right-long"></i>
                                </a>
                            </div>
                        </div>
                    </article>
                `).join("");
            }
        }
    }

    // ----------------------------------------------------
    // 6. SCROLL REVEAL ANIMATIONS FALLBACK / INTERSECTION
    // ----------------------------------------------------
    const revealElements = document.querySelectorAll(".reveal");
    if ("IntersectionObserver" in window) {
        const observerOptions = {
            root: null,
            rootMargin: "0px",
            threshold: 0.15
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("revealed");
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        revealElements.forEach(el => observer.observe(el));
    } else {
        revealElements.forEach(el => el.classList.add("revealed"));
    }

    // ----------------------------------------------------
    // 7. SKILL PROGRESS BAR ANIMATION
    // ----------------------------------------------------
    const skillProgressBars = document.querySelectorAll(".skill-progress");
    if (skillProgressBars.length > 0 && "IntersectionObserver" in window) {
        const skillObserver = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Animasikan semua skill bars dengan delay bertahap
                    skillProgressBars.forEach((bar, index) => {
                        const progress = bar.getAttribute("data-progress") || 0;
                        setTimeout(() => {
                            bar.style.width = progress + "%";
                        }, index * 150); // delay 150ms per bar
                    });
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        // Observe parent sidebar agar semua bar teranimasi bersamaan
        const skillsSidebar = document.querySelector(".about-skills-sidebar");
        if (skillsSidebar) {
            skillObserver.observe(skillsSidebar);
        }
    } else {
        // Fallback: langsung set width tanpa animasi
        skillProgressBars.forEach(bar => {
            const progress = bar.getAttribute("data-progress") || 0;
            bar.style.width = progress + "%";
        });
    }
});
