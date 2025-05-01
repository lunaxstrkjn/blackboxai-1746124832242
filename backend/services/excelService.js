const ExcelJS = require('exceljs');

class ExcelService {
  async generateExcel(data, type = 'all') {
    const workbook = new ExcelJS.Workbook();
    
    if (type === 'all' || type === 'nasabah') {
      const nasabahSheet = workbook.addWorksheet('Data Nasabah');
      this.setupNasabahSheet(nasabahSheet, data.nasabah || []);
    }
    
    if (type === 'all' || type === 'pinjaman') {
      const pinjamanSheet = workbook.addWorksheet('Data Pinjaman');
      this.setupPinjamanSheet(pinjamanSheet, data.pinjaman || []);
    }

    return await workbook.xlsx.writeBuffer();
  }

  setupNasabahSheet(sheet, data) {
    // Set up columns
    sheet.columns = [
      { header: 'ID', key: 'id', width: 20 },
      { header: 'Nama', key: 'nama', width: 30 },
      { header: 'Alamat', key: 'alamat', width: 40 },
      { header: 'Nomor Telepon', key: 'nomorTelepon', width: 15 }
    ];

    // Style the header row
    const headerRow = sheet.getRow(1);
    headerRow.font = { bold: true };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF90EE90' } // Light green background
    };

    // Add data
    data.forEach(item => {
      sheet.addRow(item);
    });

    // Add borders to all cells
    sheet.eachRow((row) => {
      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });
    });
  }

  setupPinjamanSheet(sheet, data) {
    // Set up columns
    sheet.columns = [
      { header: 'ID', key: 'id', width: 20 },
      { header: 'ID Nasabah', key: 'nasabahId', width: 20 },
      { header: 'Jumlah Pinjaman', key: 'jumlahPinjaman', width: 15 },
      { header: 'Tenor (Bulan)', key: 'tenor', width: 12 },
      { header: 'Tanggal Pinjam', key: 'tanggalPinjam', width: 15 },
      { header: 'Bunga (%)', key: 'bunga', width: 10 },
      { header: 'Cicilan Bulanan', key: 'cicilanBulanan', width: 15 },
      { header: 'Sisa Angsuran', key: 'sisaAngsuran', width: 15 }
    ];

    // Style the header row
    const headerRow = sheet.getRow(1);
    headerRow.font = { bold: true };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF90EE90' } // Light green background
    };

    // Add data and format numbers
    data.forEach(item => {
      const row = sheet.addRow(item);
      
      // Format currency columns
      ['jumlahPinjaman', 'cicilanBulanan', 'sisaAngsuran'].forEach(key => {
        const cell = row.getCell(key);
        cell.numFmt = 'Rp#,##0.00';
      });
      
      // Format percentage
      const bungaCell = row.getCell('bunga');
      bungaCell.numFmt = '0.00%';
    });

    // Add borders to all cells
    sheet.eachRow((row) => {
      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });
    });
  }
}

module.exports = new ExcelService();
