const { google } = require('googleapis');

class GoogleSheetsService {
  constructor() {
    this.auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    
    this.sheetsApi = google.sheets({ version: 'v4', auth: this.auth });
    this.spreadsheetId = process.env.GOOGLE_SHEETS_ID;
  }

  async getNasabahData() {
    try {
      const response = await this.sheetsApi.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: 'Nasabah!A2:D',
      });
      
      const rows = response.data.values || [];
      return rows.map(row => ({
        id: row[0],
        nama: row[1],
        alamat: row[2],
        nomorTelepon: row[3]
      }));
    } catch (error) {
      console.error('Error reading nasabah data:', error);
      throw error;
    }
  }

  async getPinjamanData() {
    try {
      const response = await this.sheetsApi.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: 'Pinjaman!A2:H',
      });
      
      const rows = response.data.values || [];
      return rows.map(row => ({
        id: row[0],
        nasabahId: row[1],
        jumlahPinjaman: parseFloat(row[2]),
        tenor: parseInt(row[3]),
        tanggalPinjam: row[4],
        bunga: parseFloat(row[5]),
        cicilanBulanan: parseFloat(row[6]),
        sisaAngsuran: parseFloat(row[7])
      }));
    } catch (error) {
      console.error('Error reading pinjaman data:', error);
      throw error;
    }
  }

  async appendNasabah(data) {
    try {
      const values = [[
        Date.now().toString(), // ID
        data.nama,
        data.alamat,
        data.nomorTelepon
      ]];

      await this.sheetsApi.spreadsheets.values.append({
        spreadsheetId: this.spreadsheetId,
        range: 'Nasabah!A2:D',
        valueInputOption: 'USER_ENTERED',
        resource: { values },
      });

      return values[0][0]; // Return the generated ID
    } catch (error) {
      console.error('Error appending nasabah:', error);
      throw error;
    }
  }

  async appendPinjaman(data) {
    try {
      const cicilanBulanan = this.hitungCicilan(
        data.jumlahPinjaman,
        data.bunga,
        data.tenor
      );

      const values = [[
        Date.now().toString(), // ID
        data.nasabahId,
        data.jumlahPinjaman,
        data.tenor,
        data.tanggalPinjam,
        data.bunga,
        cicilanBulanan,
        data.jumlahPinjaman // Sisa angsuran awal = jumlah pinjaman
      ]];

      await this.sheetsApi.spreadsheets.values.append({
        spreadsheetId: this.spreadsheetId,
        range: 'Pinjaman!A2:H',
        valueInputOption: 'USER_ENTERED',
        resource: { values },
      });

      return values[0][0]; // Return the generated ID
    } catch (error) {
      console.error('Error appending pinjaman:', error);
      throw error;
    }
  }

  async updateNasabah(id, data) {
    try {
      const nasabahData = await this.getNasabahData();
      const rowIndex = nasabahData.findIndex(n => n.id === id);
      
      if (rowIndex === -1) {
        throw new Error('Nasabah not found');
      }

      const range = `Nasabah!A${rowIndex + 2}:D${rowIndex + 2}`;
      const values = [[
        id,
        data.nama,
        data.alamat,
        data.nomorTelepon
      ]];

      await this.sheetsApi.spreadsheets.values.update({
        spreadsheetId: this.spreadsheetId,
        range,
        valueInputOption: 'USER_ENTERED',
        resource: { values },
      });
    } catch (error) {
      console.error('Error updating nasabah:', error);
      throw error;
    }
  }

  async updatePinjaman(id, data) {
    try {
      const pinjamanData = await this.getPinjamanData();
      const rowIndex = pinjamanData.findIndex(p => p.id === id);
      
      if (rowIndex === -1) {
        throw new Error('Pinjaman not found');
      }

      const cicilanBulanan = this.hitungCicilan(
        data.jumlahPinjaman,
        data.bunga,
        data.tenor
      );

      const range = `Pinjaman!A${rowIndex + 2}:H${rowIndex + 2}`;
      const values = [[
        id,
        data.nasabahId,
        data.jumlahPinjaman,
        data.tenor,
        data.tanggalPinjam,
        data.bunga,
        cicilanBulanan,
        data.sisaAngsuran
      ]];

      await this.sheetsApi.spreadsheets.values.update({
        spreadsheetId: this.spreadsheetId,
        range,
        valueInputOption: 'USER_ENTERED',
        resource: { values },
      });
    } catch (error) {
      console.error('Error updating pinjaman:', error);
      throw error;
    }
  }

  async deleteNasabah(id) {
    try {
      const nasabahData = await this.getNasabahData();
      const rowIndex = nasabahData.findIndex(n => n.id === id);
      
      if (rowIndex === -1) {
        throw new Error('Nasabah not found');
      }

      const range = `Nasabah!A${rowIndex + 2}:D${rowIndex + 2}`;
      await this.sheetsApi.spreadsheets.values.clear({
        spreadsheetId: this.spreadsheetId,
        range,
      });
    } catch (error) {
      console.error('Error deleting nasabah:', error);
      throw error;
    }
  }

  async deletePinjaman(id) {
    try {
      const pinjamanData = await this.getPinjamanData();
      const rowIndex = pinjamanData.findIndex(p => p.id === id);
      
      if (rowIndex === -1) {
        throw new Error('Pinjaman not found');
      }

      const range = `Pinjaman!A${rowIndex + 2}:H${rowIndex + 2}`;
      await this.sheetsApi.spreadsheets.values.clear({
        spreadsheetId: this.spreadsheetId,
        range,
      });
    } catch (error) {
      console.error('Error deleting pinjaman:', error);
      throw error;
    }
  }

  hitungCicilan(jumlahPinjaman, bunga, tenor) {
    const bungaDecimal = bunga / 100;
    return (jumlahPinjaman + (jumlahPinjaman * bungaDecimal * tenor/12)) / tenor;
  }
}

module.exports = new GoogleSheetsService();
