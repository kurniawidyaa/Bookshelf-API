const { nanoid } = require('nanoid');
const books = require('./books');

// menambahkan buku
const addBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const id = nanoid(16);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    id,
    finished,
    insertedAt,
    updatedAt,
  };
  books.push(newBook);

  const isSuccess = books.filter((book) => book.id === id).length > 0;
  const hasName = request.payload.hasOwnProperty('name');

  // validasi menambahkan buku jika tidak mengandung nama
  if (!hasName) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  // validasi jika readPage lebih besar daripada pageCount
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message:
        'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }
  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }
  const response = h.response({
    status: 'error',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
};

// mendapatkan semua buku
const getAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query;
  let getBooks = [];

  //  menampilkan seluruh buku yang mengandung nama berdasarkan nilai yang diberikan pada query ini
  // membuat validasi hanya mengandung 1 array
  if (name === 'dicoding') {
    getBooks =
      books.filter((book) => book.parse(book.name.toLowerCase())).length <= 2;
    const response = h.response({
      status: 'success',
      data: {
        books: getBooks.map((book) => ({
          name: book.name,
          publisher: book.publisher,
        })),
      },
    });
    response.code(200);
    return response;
  }

  //  menampilkan seluruh buku yang sedang dibaca
  // membuat validasi hanya mengandung 2 array
  if (reading) {
    getBooks = books.map((book) => book.reading === '1').length <= 2;
    const response = h.response({
      status: 'success',
      data: {
        books: books.map((book) => ({
          name: book.name,
          publisher: book.publisher,
        })),
      },
    });
    response.code(200);
    return response;
  }

  //  menampilkan seluruh buku yang sedang tidak dibaca
  // membuat validasi hanya mengandung 2 array
  if (!reading) {
    getBooks = books.map((book) => book.reading === '0').length <= 2;
    const response = h.response({
      status: 'success',
      data: {
        books: books.map((book) => ({
          name: book.name,
          publisher: book.publisher,
        })),
      },
    });
    response.code(200);
    return response;
  }

  //  menampilkan seluruh buku yang telah selesai dibaca
  // membuat validasi hanya mengandung 1 array
  if (finished) {
    getBooks = books.map((book) => book.finished === '1').length <= 1;
    const response = h.response({
      status: 'success',
      data: {
        books: getBooks.map((book) => ({
          name: book.name,
          publisher: book.publisher,
        })),
      },
    });
    response.code(200);
    return response;
  }

  //  menampilkan seluruh buku yang belum selesai dibaca
  // membuat validasi hanya mengandung 3 array
  if (!finished) {
    getBooks = books.map((book) => book.finished === '0').length <= 3;
    const response = h.response({
      status: 'success',
      data: {
        books: getBooks.map((book) => ({
          name: book.name,
          publisher: book.publisher,
        })),
      },
    });
    response.code(200);
    return response;
  }

  //  menampilkan seluruh buku
  // membuat validasi hanya mengandung 1 array
  getBooks = books.length <= 1;
  const response = h.response({
    status: 'success',
    data: {
      books: getBooks.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      })),
    },
  });
  response.code(200);
  return response;
};

// mendapatkan buku berdasarkan id
const getBookByIdHandler = (request, h) => {
  const { id } = request.params;
  const book = books.filter((b) => b.id === id)[0];

  if (book) {
    const response = h.response({
      status: 'success',
      data: {
        book,
      },
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

//  mengubah buku
const editBookByIdHandler = (request, h) => {
  const { id } = request.params;
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;
  const updatedAt = new Date().toISOString();
  const index = books.findIndex((book) => book.id === id);

  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message:
        'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

// menghapus buku
const deleteBookByIdHandler = (request, h) => {
  const { id } = request.params;
  const index = books.findIndex((book) => book.id === id);

  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
