const express = require('express');
const router = express.Router();
const { verifyToken } = require('./auth');
const { validateNasabah } = require('../utils/validation');
const googleSheetsService = require('../services/googleSheetsService');

// Get all nasabah
router.get('/', verifyToken, async (req, res, next) => {
  try {
    const nasabah = await googleSheetsService.getNasabahData();
    res.json({
      success: true,
      data: nasabah
    });
  } catch (error) {
    next(error);
  }
});

// Add new nasabah
router.post('/', verifyToken, async (req, res, next) => {
  try {
    const errors = validateNasabah(req.body);
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        errors
      });
    }

    const id = await googleSheetsService.appendNasabah(req.body);
    res.status(201).json({
      success: true,
      message: 'Nasabah berhasil ditambahkan',
      data: {
        id,
        ...req.body
      }
    });
  } catch (error) {
    next(error);
  }
});

// Update nasabah
router.put('/:id', verifyToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const errors = validateNasabah(req.body);
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        errors
      });
    }

    await googleSheetsService.updateNasabah(id, req.body);
    res.json({
      success: true,
      message: 'Nasabah berhasil diperbarui',
      data: {
        id,
        ...req.body
      }
    });
  } catch (error) {
    next(error);
  }
});

// Delete nasabah
router.delete('/:id', verifyToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    await googleSheetsService.deleteNasabah(id);
    res.json({
      success: true,
      message: 'Nasabah berhasil dihapus'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
