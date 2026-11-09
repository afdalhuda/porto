/* ==========================================================================
   TEKS WEBSITE (English + Indonesia) — EDIT TEKS DI FILE INI SAJA
   ==========================================================================

   CARA EDIT
   ---------
   Setiap teks punya satu "kotak" seperti ini:

     "hero.subtitle": {
       en: "An aspiring engineer who ...",     <- teks bahasa Inggris
       id: "Calon insinyur yang ...",          <- teks bahasa Indonesia (EDIT DI SINI)
     },

   Cukup ganti isi di dalam tanda kutip "..." pada baris  id:
   Teks Inggris ada tepat di atasnya sebagai contoh/acuan.

   FORMAT KHUSUS (opsional)
   ------------------------
     {kata}     -> kata tampil berwarna oranye (aksen)
     **kata**   -> kata tampil tebal

   Contoh:  id: "Tentang {Saya}"            -> "Saya" berwarna oranye
            id: "Aku **Afdal**, ..."        -> "Afdal" tebal

   ATURAN AGAR TIDAK ERROR
   -----------------------
   1. Jangan hapus tanda kutip "..." maupun koma (,) di ujung baris.
   2. Jangan pakai tanda kutip ganda lurus (") di dalam teks. Pakai ' atau “ ”.
      (Kalau terpaksa, tulis dengan garis miring: \"  )
   3. Kalau baris id: dikosongkan ("") atau dihapus, otomatis tampil versi Inggris.
   4. Tidak perlu menulis kode HTML (<b>, <span>, dll). Pakai {..} dan **..** saja.

   MENAMBAH TEKS BARU
   ------------------
   1. Di index.html, beri elemennya atribut  data-i18n="nama.kunci"
   2. Di file ini, tambahkan kotak baru dengan "nama.kunci" yang sama.

   BAHASA OTOMATIS
   ---------------
   Website membaca bahasa browser pengunjung: browser berbahasa Indonesia ->
   tampil Indonesia, selain itu -> Inggris. Kalau pengunjung menekan tombol
   EN/ID, pilihannya diingat.
   ========================================================================== */

window.AFDAL_TEXT = {

  /* ---------- NAVBAR ---------- */
  "nav.home":      { en: "Home",      id: "Beranda" },
  "nav.about":     { en: "About",     id: "Tentang" },
  "nav.skills":    { en: "Skills",    id: "Keahlian" },
  "nav.projects":  { en: "Projects",  id: "Proyek" },
  "nav.education": { en: "Education", id: "Pendidikan" },
  "nav.contact":   { en: "Contact",   id: "Kontak" },


  /* ---------- HERO (halaman utama) ---------- */
  "hero.greeting": { en: "Hi, My name is", id: "Halo, Nama saya" },

  "hero.subtitle": {
    en: "An aspiring ENGINEER who loves technology, creativity, and solving problems.",
    id: "Seorang calon ENGINEER yang memiliki minat besar pada teknologi, kreativitas, dan problem solving.",
  },

  "hero.cta1":   { en: "Explore My Work", id: "Lihat Karya Saya" },
  "hero.cta2":   { en: "Get In Touchh",   id: "Hubungi Saya" },
  "hero.scroll": { en: "Scroll",          id: "Gulir ke Bawah" },


  /* ---------- ABOUT ---------- */
  "about.label": { en: "About",         id: "Tentang" },
  "about.title": { en: "About {Me}",    id: "Tentang {Saya}" },

  "about.lead": {
    en: "I'm **M. Afdal Huda**, an Informatics Management student with a deep curiosity for how technology works — from the code that powers applications to the hardware that runs them.",
    id: "Saya **M. Afdal Huda**, seorang mahasiswa Manajemen Informatika dengan ketertarikan mendalam terhadap cara kerja teknologi — mulai dari baris kode yang menggerakkan aplikasi hingga perangkat keras yang menopangnya.",
  },

  "about.text": {
    en: "I enjoy learning programming, exploring computer hardware, and building things for the web. For me, engineering is about creativity and problem solving: understanding a problem deeply, then crafting a solution that is simple, useful, and well-made.",
    id: "Saya gemar mempelajari pemrograman, mengeksplorasi perangkat keras komputer, dan mengembangkan teknologi web. Bagi saya, dunia rekayasa (engineering) adalah tentang kreativitas dan pemecahan masalah: memahami suatu kendala secara menyeluruh, lalu merancang solusi yang praktis, bermanfaat, dan berkualitas tinggi.",
  },

  "about.chip1": { en: "🎓 Informatics Management Student", id: "🎓 Mahasiswa Manajemen Informatika" },
  "about.chip2": { en: "⚙️ Aspiring ENGINEER",              id: "⚙️ Calon ENGINEER" },
  "about.chip3": { en: "💡 Technology Enthusiast",          id: "💡 Penggiat Teknologi" },


  /* ---------- SKILLS ---------- */
  "skills.label": { en: "Skills",                id: "Keahlian" },
  "skills.title": { en: "Skills & {Interests}",  id: "Keahlian & {Minat}" },

  "skills.desc": {
    en: "Areas I'm actively learning and passionate about.",
    id: "Berbagai bidang yang sedang saya pelajari secara mendalam dan menjadi minat utama saya.",
  },

  "skills.s1t": { en: "Programming", id: "Pemrograman" },
  "skills.s1d": {
    en: "Learning to write clean, logical code and turn ideas into working software.",
    id: "Mempelajari penulisan kode yang rapi dan terstruktur, serta mewujudkan gagasan menjadi perangkat lunak yang fungsional.",
  },

  "skills.s2t": { en: "Computer Hardware", id: "Perangkat Keras Komputer" },
  "skills.s2d": {
    en: "Fascinated by how machines work — components, assembly, and performance.",
    id: "Memiliki ketertarikan besar pada cara kerja mesin — mulai dari komponen, proses perakitan, hingga optimasi performa.",
  },

  "skills.s3t": { en: "Web Development", id: "Pengembangan Web" },
  "skills.s3d": {
    en: "Building responsive, interactive experiences with HTML, CSS, and JavaScript.",
    id: "Menciptakan antarmuka visual yang responsif dan interaktif menggunakan HTML, CSS, dan JavaScript.",
  },

  "skills.s4t": { en: "Problem Solving", id: "Pemecahan Masalah" },
  "skills.s4d": {
    en: "Breaking big problems into small steps and finding elegant solutions.",
    id: "Menguraikan masalah kompleks menjadi langkah-langkah sistematis untuk menemukan solusi yang efisien.",
  },

  "skills.s5t": { en: "Technology & Engineering", id: "Teknologi & Rekayasa" },
  "skills.s5d": {
    en: "Always exploring new tools, systems, and how things are engineered.",
    id: "Selalu antusias mengeksplorasi berbagai perangkat, sistem, dan bagaimana suatu teknologi dirancang.",
  },


  /* ---------- PROJECTS ---------- */
  "projects.label": { en: "Projects",                  id: "Proyek" },
  "projects.title": { en: "Featured {Projects}",       id: "Proyek {Unggulan}" },

  "projects.p1d": {
    en: "A class information portal — a central hub for announcements, schedules, and shared resources for my classmates.",
    id: "Portal informasi kelas — sebuah pusat layanan terpadu untuk pengumuman, jadwal, dan berbagi materi pembelajaran bagi rekan-rekan mahasiswa.",
  },
  "projects.p1tag1": { en: "Web",                id: "Web" },
  "projects.p1tag2": { en: "Information Portal", id: "Portal Informasi" },

  "projects.soon": { en: "Coming Soon", id: "Segera Hadir" },

  "projects.p2d":  { en: "A new project is in the works. Stay tuned.", id: "Sebuah proyek baru sedang dalam tahap pengembangan. Nantikan kehadirannya." },
  "projects.tag2": { en: "In Progress",                                id: "Sedang Berjalan" },

  "projects.p3d":  { en: "Space reserved for the next big idea.", id: "Ruang yang dipersiapkan untuk gagasan besar selanjutnya." },
  "projects.tag3": { en: "Future",                                id: "Mendatang" },


  /* ---------- EDUCATION ---------- */
  "edu.label": { en: "Education",         id: "Pendidikan" },
  "edu.title": { en: "My {Journey}",      id: "Perjalanan {Akademik}" },

  "edu.e1p": { en: "Now", id: "Sekarang" },
  "edu.e1t": { en: "Informatics Management PNP", id: "Manajemen Informatika PNP" },
  "edu.e1d": {
    en: "Currently studying at Padang State Polytechnic— focusing on programming, information systems, and technology.",
    id: "Saat ini sedang menempuh pendidikan di Politeknik Negeri Padang— berfokus pada pemrograman, sistem informasi, dan teknologi terapan.",
  },

  // TODO: isi tahun & nama sekolah yang sebenarnya
  "edu.e2p": { en: "2025 — 2026", id: "2025 — 2026" },
  "edu.e2t": { en: "Mechanical Engginering", id: "Teknik Mesin" },
  "edu.e2d": {
    en: "I once studied Mechanical Engineering at Padang State University.",
    id: "Sempat berkuliah Teknik Mesin di Universitas Negeri Padang.",
  },

  "edu.e3p": { en: "Year — Year", id: "Tahun — Tahun" },
  "edu.e3t": { en: "Junior High School", id: "Sekolah Menengah Pertama" },
  "edu.e3d": {
    en: "[Nama sekolah] — early curiosity about computers.",
    id: "[Nama sekolah] — titik awal munculnya rasa ingin tahu saya terhadap dunia komputer.",
  },

  
  "edu.e4p": { en: "2022 — 2025", id: "2022 — 2025" },
  "edu.e4t": { en: "Senior High School", id: "Sekolah Menengah Atas" },
  "edu.e4d": {
    en: "SMAN 02 SOLSEL — where my interest in technology began to grow.",
    id: "SMAN 02 SOLSEL — tempat di mana minat saya terhadap teknologi mulai berkembang pesat.",
  },


  /* ---------- CONTACT ---------- */
  "contact.label": { en: "Contact",           id: "Kontak" },
  "contact.title": { en: "Get In {Touch}",    id: "Mari {Terhubung}" },

  "contact.desc": {
    en: "Have an idea, a question, or just want to say hi? My inbox is open.",
    id: "Memiliki ide, pertanyaan, atau sekadar ingin menyapa? Jangan ragu untuk menghubungi saya.",
  },

  "contact.wa": { en: "Whatsapp Me", id: "WhatsApp Saya" },


  /* ---------- FOOTER ---------- */
  "footer.text": {
    en: "© 2026 M. Afdal Huda — Designed & built with curiosity.",
    id: "© 2026 M. Afdal Huda — Designed & built with curiosity.",
  },

};
