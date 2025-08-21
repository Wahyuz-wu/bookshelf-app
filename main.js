const localKey = "Storage_Bookshelf";
let books = [];

document.addEventListener("DOMContentLoaded", () => {
  const bookForm = document.getElementById("bookForm");
  const searchForm = document.getElementById("searchBook");
  const searchInput = document.getElementById("searchBookTitle");
  const isCompleteCheckbox = document.getElementById("bookFormIsComplete");
  const submitButton1 = document.getElementById("bookFormSubmit");

  loadData();
  Cari_Buku();

  if (isCompleteCheckbox && submitButton1) {
    const UpdateDataSubmit = () => {
      const informasi = submitButton1.querySelector("span");
      if (!informasi) return;
      informasi.textContent = isCompleteCheckbox.checked
        ? "Selesai dibaca"
        : "Belum selesai dibaca";
    };
    UpdateDataSubmit();
    isCompleteCheckbox.addEventListener("change", UpdateDataSubmit);
  }

  if (bookForm) {
    bookForm.addEventListener("submit", (book) => {
      book.preventDefault();
      TambahBuku();
    });
  }

  if (searchForm) {
    searchForm.addEventListener("submit", (search) => {
      search.preventDefault();
      MencariBuku();
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", MencariBuku);
  }
});

function generateId() {
  return new Date().getTime();
}

function TambahBuku() {
  const judul = document.getElementById("bookFormTitle");
  const pengarang = document.getElementById("bookFormAuthor");
  const tahunterbit = document.getElementById("bookFormYear");
  const isCompleteEl = document.getElementById("bookFormIsComplete");

  const title = (judul?.value ?? "").trim();
  const author = (pengarang?.value ?? "").trim();
  const tahunX = (tahunterbit?.value ?? "").trim();
  const tahun = parseInt(tahunX, 10);
  const isComplete = !!isCompleteEl?.checked;

  if (!title || !author || !tahunX || Number.isNaN(tahun)) {
    alert("Mohon lengkapi judul, penulis, dan tahun dengan benar.");
    return;
  }

  const year = tahun;

  const bookObject = { id: generateId(), title, author, year, isComplete };
  books.push(bookObject);
  saveData();
  Cari_Buku();

  document.getElementById("bookForm").reset();
}

function Cari_Buku(filteredBooks = null, query = "") {
  const incompleteList = document.getElementById("incompleteBookList");
  const completeList = document.getElementById("completeBookList");
  if (!incompleteList || !completeList) return;

  incompleteList.innerHTML = "";
  completeList.innerHTML = "";

  const data = filteredBooks ?? books;

  if (!data.length) {
    const pesan = document.createElement("p");
    pesan.style.opacity = "0.8";
    pesan.style.fontSize = "13px";
    pesan.textContent = query
      ? `Tidak ada hasil untuk "${query}".`
      : "Belum ada data buku";
    incompleteList.appendChild(pesan.cloneNode(true));
    completeList.appendChild(pesan);
    return;
  }

  for (const book of data) {
    const bookItem = document.createElement("div");
    bookItem.setAttribute("data-bookid", String(book.id));
    bookItem.setAttribute("data-testid", "bookItem");

    const Judul_Buku = document.createElement("h3");
    Judul_Buku.setAttribute("data-testid", "bookItemTitle");
    Judul_Buku.innerText = book.title;

    const Pengarang_Buku = document.createElement("p");
    Pengarang_Buku.setAttribute("data-testid", "bookItemAuthor");
    Pengarang_Buku.innerText = `Penulis: ${book.author}`;

    const TahunTerbit_Buku = document.createElement("p");
    TahunTerbit_Buku.setAttribute("data-testid", "bookItemYear");
    TahunTerbit_Buku.innerText = `Tahun: ${book.year}`;

    const div = document.createElement("div");

    const ubah_status = document.createElement("button");
    ubah_status.setAttribute("data-testid", "bookItemIsCompleteButton");
    ubah_status.innerText = book.isComplete ? "Belum selesai dibaca" : "Selesai dibaca";
    ubah_status.addEventListener("click", () => StatusBuku(book.id));

    const deleteBtn = document.createElement("button");
    deleteBtn.setAttribute("data-testid", "bookItemDeleteButton");
    deleteBtn.innerText = "Hapus Buku";
    deleteBtn.addEventListener("click", () => deleteBook(book.id));

    const editBtn = document.createElement("button");
    editBtn.setAttribute("data-testid", "bookItemEditButton");
    editBtn.innerText = "Edit Buku";
    editBtn.addEventListener("click", () => editBook(book.id));

    div.append(ubah_status, deleteBtn, editBtn);
    bookItem.append(Judul_Buku, Pengarang_Buku, TahunTerbit_Buku, div);

    if (book.isComplete) completeList.appendChild(bookItem);
    else incompleteList.appendChild(bookItem);
  }
}

function StatusBuku(bookId) {
  const book = books.find((book) => book.id === bookId);
  if (!book) return;
  book.isComplete = !book.isComplete;
  saveData();
  MencariBuku(); 
}

function deleteBook(bookId) {
  const book = books.find((book) => book.id === bookId);
  if (!book) return;

  const yakin = confirm(`Apakah kamu yakin ingin menghapus buku dengan judul ${book.title}?`);
  if (!yakin) return;

  books = books.filter((book) => book.id !== bookId);
  saveData();
  MencariBuku();
}

function editBook(bookId) {
  const book = books.find((book) => book.id === bookId);
  if (!book) return;

  const newJudul = prompt("Ubah Judul:", book.title)?.trim();
  if (newJudul === null) return;
  const newPenulis = prompt("Ubah Penulis:", book.author)?.trim();
  if (newPenulis === null) return;
  const newtahunX = prompt("Ubah Tahun:", String(book.year))?.trim();
  if (newtahunX === null) return;

  const newTahun = parseInt(newtahunX, 10);
  if (!newJudul || !newPenulis || Number.isNaN(newTahun)) {
    alert("Input tidak valid. Perubahan dibatalkan.");
    return;
  }

  book.title = newJudul;
  book.author = newPenulis;
  book.year = newTahun;
  saveData();
  MencariBuku();
}

function MencariBuku() {
  const pencarian = document.getElementById("searchBookTitle");
  const cek_pencarian = (pencarian?.value ?? "").toLowerCase().trim();

  if (!cek_pencarian) {
    Cari_Buku();
    return;
  }

  const cari = books.filter((book) => book.title.toLowerCase().includes(cek_pencarian));
  Cari_Buku(cari, pencarian.value);
}

function saveData() {
  try {
    localStorage.setItem(localKey, JSON.stringify(books));
  } catch (error) {
    console.error("Gagal menyimpan ke localStorage:", error);
  }
}

function loadData() {
  try {
    const data = localStorage.getItem(localKey);
    books = data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Gagal membaca dari localStorage:", error);
    books = [];
  }
}

const cekConsole = JSON.parse(localStorage.getItem(localKey));
console.log(JSON.stringify(cekConsole, null, 2));