# noteAppsComponentFetch
Repository ini berisi proyek submission kedua atau terakhir Dicoding pada kelas Belajar Fundamental Front-End Web Development.

Cara menjalankan website:<br />
- Install node_modules dengan npm install<br />
- Setelah ter-install, ketik npm run start<br />
- Laman akan berjalan pada http://localhost:8080/<br />

Catatan:<br />
- Menggunakan fitur arsip catatan. Namun ada sedikit kendala dimana ketika sudah mengklik masukkan arsip dan batalkan arsip, laman perlu di-refresh agar muncul catatan yang sudah diklik.<br />
- Menggunakan feedback saat terjadi error pada pencarian. Akan tetapi ada satu kendala, dimana tulisan, "Maaf catatan yang dicari tidak ditemukan." Ternyata tidak muncul saat mencari catatan yang tidak ditemukan. Ini mungkin terjadi karena terhalang oleh Shadow DOM dari note-search-error. Mengingat display pada note-search-error itu none dan juga hidden.<br />
- Menggunakan Prettier sebagai Code Formatter.<br />
- add-note.js hanya file kosong.<br />
