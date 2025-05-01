const express = require('express');
const router = express.Router();
const { verifyToken } = require('./auth');
const { validatePinjaman } = require('../utils/validation');
const googleSheetsService = require('../services/googleSheetsService');

// Get all pinjaman
router.get('/', verifyToken, async (req, res, next) => {
  try {
    const pinjaman = await googleSheetsService.getPinjamanData();
    
    // Filter by nasabahId if provided
    if (req.query.nasabahId) {
      const filteredPinjaman = pinjaman.filter(p => p.nasabahId === req.query.nasabahId);
      return res.json({
        success: true,
        data: filteredPinjaman
      });
    }

    res.json({
      success: true,
      data: pinjaman
    });
  } catch (error) {
    next(error);
  }
});

// Add new pinjaman
router.post('/', verifyToken, async (req, res, next) => {
  try {
    const errors = validatePinjaman(req.body);
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        errors
      });
    }

    const id = await googleSheetsService.appendPinjaman(req.body);
    
    // Calculate cicilan bulanan
    const cicilanBulanan = googleSheetsService.hitungCicilan(
      req.body.jumlahPinjaman,
      req.body.bunga,
      req.body.tenor
    );

    res.status(201).json({
      success: true,
      message: 'Pinjaman berhasil ditambahkan',
      data: {
        id,
        ...req.body,
        cicilanBulanan,
        sisaAngsuran: req.body.jumlahPinjaman
      }
    });
  } catch (error) {
    next(error);
  }
});

// Update pinjaman
router.put('/:id', verifyToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const errors = validatePinjaman(req.body);
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        errors
      });
    }

    // Calculate new cicilan bulanan if loan terms changed
    const cicilanBulanan = googleSheetsService.hitungCicilan(
      req.body.jumlahPinjaman,
      req.body.bunga,
      req.body.tenor
    );

    const updateData = {
      ...req.body,
      cicilanBulanan
    };

    await googleSheetsService.updatePinjaman(id, updateData);
    res.json({
      success: true,
      message: 'Pinjaman berhasil diperbarui',
      data: {
        id,
        ...updateData
      }
    });
  } catch (error) {
    next(error);
  }
});

// Delete pinjaman
router.delete('/:id', verifyToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    await googleSheetsService.deletePinjaman(id);
    res.json({
      success: true,
      message: 'Pinjaman berhasil dihapus'
    });
  } catch (error) {
    next(error);
  }
});

// Update angsuran (pembayaran cicilan)
router.post('/:id/bayar', verifyToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { jumlahBayar } = req.body;

    const pinjaman = (await googleSheetsService.getPinjamanData())
      .find(p => p.id === id);

    if (!pinjaman) {
      return res.status(404).json({
        success: false,
        message: 'Pinjaman tidak ditemukan'
      });
    }

    // Update sisa angsuran
    const sisaAngsuran = Math.max(0, pinjaman.sisaAngsuran - jumlahBayar);
    const updateData = {
      ...pinjaman,
      sisaAngsuran
    };

    await googleSheetsService.updatePinjaman(id, updateData);
    res.json({
      success: true,
      message: 'Pembayaran berhasil dicatat',
      data: {
        id,
        ...updateData
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
