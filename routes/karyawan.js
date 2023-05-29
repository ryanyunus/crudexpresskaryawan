var express = require('express');
var router = express.Router();

// import database
var connection = require('../library/database');

/**
 * INDEX KARYAWAN
 */
router.get('/', function (req, res, next) {
    // query
    connection.query('SELECT * FROM karyawan ORDER BY id_kar DESC', function (err, rows) {
        if (err) {
            req.flash('error', err);
            res.render('posts/karyawan', {
                data: ''
            });
        } else {
            // render ke view karyawan index
            res.render('posts/karyawan', {
                data: rows // <-- data karyawan
            });
        }
    });
});

/**
 * CREATE KARYAWAN
 */
router.get('/createkaryawan', function (req, res, next) {
    res.render('posts/createkaryawan', {
        no_induk: '',
        nama: '',
        id_jab: ''
    });
});

/**
 * STORE KARYAWAN
 */
router.post('/store', function (req, res, next) {
    let no_induk = req.body.no_induk;
    let nama = req.body.nama;
    let id_jab = req.body.id_jab;
    let errors = false;

    if (no_induk.length === 0) {
        errors = true;
        req.flash('error', 'Silahkan Masukkan Nomor Induk');
    }

    if (nama.length === 0) {
        errors = true;
        req.flash('error', 'Silahkan Masukkan Nama');
    }

    if (id_jab.length === 0) {
        errors = true;
        req.flash('error', 'Silahkan Masukkan ID Jabatan');
    }

    if (errors) {
        res.render('posts/createkaryawan', {
            no_induk: no_induk,
            nama: nama,
            id_jab: id_jab
        });
    } else {
        let formData = {
            no_induk: no_induk,
            nama: nama,
            id_jab: id_jab
        };

        connection.query('INSERT INTO karyawan SET ?', formData, function (err, result) {
            if (err) {
                req.flash('error', err);
                res.render('posts/createkaryawan', {
                    no_induk: formData.no_induk,
                    nama: formData.nama,
                    id_jab: formData.id_jab
                });
            } else {
                req.flash('success', 'Data Berhasil Disimpan!');
                res.redirect('/karyawan');
            }
        });
    }
});

// ...

/**
 * DELETE KARYAWAN
 */
router.get('/delete/:id', function (req, res, next) {
    let id = req.params.id;

    // Query untuk menghapus karyawan dengan ID tertentu
    connection.query('DELETE FROM karyawan WHERE id_kar = ?', id, function (err, result) {
        if (err) {
            req.flash('error', err);
        } else {
            req.flash('success', 'Data Karyawan Berhasil Dihapus!');
        }
        res.redirect('/karyawan'); // Redirect ke halaman karyawan setelah menghapus
    });
});
/**
 * EDIT KARYAWAN
 */
router.get('/edit/:id', function (req, res, next) {
    let id = req.params.id;

    // Query untuk mendapatkan data karyawan dengan ID tertentu
    connection.query('SELECT * FROM karyawan WHERE id_kar = ?', id, function (err, rows) {
        if (err) {
            req.flash('error', err);
            res.redirect('/karyawan');
        } else {
            if (rows.length === 1) {
                res.render('posts/editkaryawan', {
                    id: rows[0].id_kar,
                    no_induk: rows[0].no_induk,
                    nama: rows[0].nama,
                    id_jab: rows[0].id_jab
                });
            } else {
                req.flash('error', 'Data Karyawan Tidak Ditemukan!');
                res.redirect('/karyawan');
            }
        }
    });
});

/**
 * UPDATE KARYAWAN
 */
router.post('/update/:id', function (req, res, next) {
    let id = req.params.id;
    let no_induk = req.body.no_induk;
    let nama = req.body.nama;
    let id_jab = req.body.id_jab;
    let errors = false;

    // Validasi input (jika diperlukan)

    if (errors) {
        // Jika ada kesalahan, kembalikan ke halaman edit dengan pesan kesalahan
        res.render('posts/editkaryawan', {
            id: id,
            no_induk: no_induk,
            nama: nama,
            id_jab: id_jab,
            messages: {
                error: 'Ada kesalahan dalam input data'
            }
        });
    } else {
        let formData = {
            no_induk: no_induk,
            nama: nama,
            id_jab: id_jab
        };

        // Update data karyawan dalam database
        connection.query('UPDATE karyawan SET ? WHERE id_kar = ?', [formData, id], function (err, result) {
            if (err) {
                req.flash('error', err);
                res.render('posts/editkaryawan', {
                    id: id,
                    no_induk: no_induk,
                    nama: nama,
                    id_jab: id_jab
                });
            } else {
                req.flash('success', 'Data Karyawan Berhasil Diperbarui!');
                res.redirect('/karyawan');
            }
        });
    }
});


module.exports = router;
