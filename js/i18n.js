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
  "hero.greeting": { en: "Hi, My name is", id: "Hai, Nama saya" },

  "hero.subtitle": {
    en: "An aspiring engineer who loves technology, creativity, and solving problems.",
    id: "Calon insinyur yang mencintai teknologi, kreativitas, dan pemecahan masalah.",
  },

  "hero.cta1":   { en: "Explore My Work", id: "Lihat Karya Saya" },
  "hero.cta2":   { en: "Get In Touch",    id: "Hubungi Saya" },
  "hero.scroll": { en: "Scroll",          id: "Gulir" },


  /* ---------- ABOUT ---------- */
  "about.label": { en: "About",         id: "Tentang" },
  "about.title": { en: "About {Me}",    id: "Tentang {Saya}" },

  "about.lead": {
    en: "I'm **M. Afdal Huda**, an Informatics Management student with a deep curiosity for how technology works — from the code that powers applications to the hardware that runs them.",
    id: "Saya **M. Afdal Huda**, mahasiswa Manajemen Informatika dengan rasa ingin tahu mendalam tentang cara kerja teknologi — dari kode yang menjalankan aplikasi hingga perangkat keras yang menopangnya.",
  },

  "about.text": {
    en: "I enjoy learning programming, exploring computer hardware, and building things for the web. For me, engineering is about creativity and problem solving: understanding a problem deeply, then crafting a solution that is simple, useful, and well-made.",
    id: "Saya senang belajar pemrograman, mengeksplorasi perangkat keras komputer, dan membangun hal-hal untuk web. Bagi saya, rekayasa adalah soal kreativitas dan pemecahan masalah: memahami masalah secara mendalam, lalu merancang solusi yang sederhana, berguna, dan dibuat dengan baik.",
  },

  "about.chip1": { en: "🎓 Informatics Management Student", id: "🎓 Mahasiswa Manajemen Informatika" },
  "about.chip2": { en: "⚙️ Aspiring Engineer",              id: "⚙️ Calon Insinyur" },
  "about.chip3": { en: "💡 Technology Enthusiast",          id: "💡 Penggemar Teknologi" },


  /* ---------- SKILLS ---------- */
  "skills.label": { en: "Skills",                id: "Keahlian" },
  "skills.title": { en: "Skills & {Interests}",  id: "Keahlian & {Minat}" },

  "skills.desc": {
    en: "Areas I'm actively learning and passionate about.",
    id: "Bidang yang sedang aktif saya pelajari dan saya minati.",
  },

  "skills.s1t": { en: "Programming", id: "Pemrograman" },
  "skills.s1d": {
    en: "Learning to write clean, logical code and turn ideas into working software.",
    id: "Belajar menulis kode yang bersih dan logis, serta mengubah ide menjadi perangkat lunak.",
  },

  "skills.s2t": { en: "Computer Hardware", id: "Perangkat Keras Komputer" },
  "skills.s2d": {
    en: "Fascinated by how machines work — components, assembly, and performance.",
    id: "Terpukau oleh cara kerja mesin — komponen, perakitan, dan performa.",
  },

  "skills.s3t": { en: "Web Development", id: "Pengembangan Web" },
  "skills.s3d": {
    en: "Building responsive, interactive experiences with HTML, CSS, and JavaScript.",
    id: "Membangun pengalaman yang responsif dan interaktif dengan HTML, CSS, dan JavaScript.",
  },

  "skills.s4t": { en: "Problem Solving", id: "Pemecahan Masalah" },
  "skills.s4d": {
    en: "Breaking big problems into small steps and finding elegant solutions.",
    id: "Memecah masalah besar menjadi langkah kecil dan menemukan solusi yang elegan.",
  },

  "skills.s5t": { en: "Technology & Engineering", id: "Teknologi & Rekayasa" },
  "skills.s5d": {
    en: "Always exploring new tools, systems, and how things are engineered.",
    id: "Selalu mengeksplorasi alat, sistem, dan cara segala sesuatu direkayasa.",
  },


  /* ---------- PROJECTS ---------- */
  "projects.label": { en: "Projects",                  id: "Proyek" },
  "projects.title": { en: "Featured {Projects}",       id: "Proyek {Unggulan}" },

  "projects.p1d": {
    en: "A class information portal — a central hub for announcements, schedules, and shared resources for my classmates.",
    id: "Portal informasi kelas — pusat pengumuman, jadwal, dan berbagi materi untuk teman sekelas saya.",
  },
  "projects.p1tag1": { en: "Web",                id: "Web" },
  "projects.p1tag2": { en: "Information Portal", id: "Portal Informasi" },

  "projects.soon": { en: "Coming Soon", id: "Segera Hadir" },

  "projects.p2d":  { en: "A new project is in the works. Stay tuned.", id: "Proyek baru sedang dikerjakan. Nantikan." },
  "projects.tag2": { en: "In Progress",                                id: "Sedang Berjalan" },

  "projects.p3d":  { en: "Space reserved for the next big idea.", id: "Ruang untuk ide besar berikutnya." },
  "projects.tag3": { en: "Future",                                id: "Mendatang" },


  /* ---------- EDUCATION ---------- */
  "edu.label": { en: "Education",         id: "Pendidikan" },
  "edu.title": { en: "My {Journey}",      id: "Perjalanan {Saya}" },

  "edu.e1p": { en: "Now", id: "Sekarang" },
  "edu.e1t": { en: "Informatics Management", id: "Manajemen Informatika" },
  "edu.e1d": {
    en: "Currently studying — focusing on programming, information systems, and technology.",
    id: "Sedang menempuh studi — fokus pada pemrograman, sistem informasi, dan teknologi.",
  },

  // TODO: isi tahun & nama sekolah yang sebenarnya
  "edu.e2p": { en: "Year — Year", id: "Tahun — Tahun" },
  "edu.e2t": { en: "Senior High School", id: "Sekolah Menengah Atas" },
  "edu.e2d": {
    en: "[Nama sekolah] — where my interest in technology began to grow.",
    id: "[Nama sekolah] — tempat minat saya pada teknologi mulai tumbuh.",
  },

  "edu.e3p": { en: "Year — Year", id: "Tahun — Tahun" },
  "edu.e3t": { en: "Junior High School", id: "Sekolah Menengah Pertama" },
  "edu.e3d": {
    en: "[Nama sekolah] — early curiosity about computers.",
    id: "[Nama sekolah] — awal rasa penasaran terhadap komputer.",
  },


  /* ---------- CONTACT ---------- */
  "contact.label": { en: "Contact",           id: "Kontak" },
  "contact.title": { en: "Get In {Touch}",    id: "Mari {Terhubung}" },

  "contact.desc": {
    en: "Have an idea, a question, or just want to say hi? My inbox is open.",
    id: "Punya ide, pertanyaan, atau sekadar ingin menyapa? Pesan saya selalu terbuka.",
  },

  "contact.wa": { en: "Whatsapp Me", id: "WhatsApp Saya" },


  /* ---------- FOOTER ---------- */
  "footer.text": {
    en: "© 2026 M. Afdal Huda — Designed & built with curiosity.",
    id: "© 2026 M. Afdal Huda — Didesain & dibuat dengan rasa ingin tahu.",
  },

};
