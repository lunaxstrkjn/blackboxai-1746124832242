const express = require('express');
const router = express.Router();
const { verifyToken } = require('./auth');
const googleSheetsService = require('../services/googleSheetsService');
const excelService = require('../services/excelService');

// Download all data
router.get('/', verifyToken, async (req, res, next) => {
  try {
    // Get all data
    const nasabah = await googleSheetsService.getNasabahData();
    const pinjaman = await googleSheetsService.getPinjamanData();

    // Generate Excel file
    const buffer = await excelService.generateExcel({
      nasabah,
      pinjaman
    }, 'all');

    // Set headers for file download
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=data-koperasi.xlsx');
    
    // Send the file
    res.send(buffer);
  } catch (error) {
    next(error);
  }
});

// Download data for specific nasabah
router.get('/nasabah/:id', verifyToken, async (req, res, next) => {
  try {
    const { id } = req.params;

    // Get nasabah data
    const allNasabah = await googleSheetsService.getNasabahData();
    const nasabah = allNasabah.filter(n => n.id === id);

    if (nasabah.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Nasabah tidak ditemukan'
      });
    }

    // Get pinjaman data for this nasabah
    const allPinjaman = await googleSheetsService.getPinjamanData();
    const pinjaman = allPinjaman.filter(p => p.nasabahId === id);

    // Generate Excel file
    const buffer = await excelService.generateExcel({
      nasabah,
      pinjaman
    }, 'all');

    // Set headers for file download
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=data-nasabah-${id}.xlsx`);
    
    // Send the file
    res.send(buffer);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
