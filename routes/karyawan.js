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

module.exports = router;
