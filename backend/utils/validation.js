const validateNasabah = (data) => {
  const errors = [];
  
  if (!data.nama || data.nama.trim() === '') {
    errors.push('Nama is required');
  }
  
  if (!data.alamat || data.alamat.trim() === '') {
    errors.push('Alamat is required');
  }
  
  if (!data.nomorTelepon || !/^[0-9]{10,13}$/.test(data.nomorTelepon)) {
    errors.push('Nomor Telepon must be valid (10-13 digits)');
  }
  
  return errors;
};

const validatePinjaman = (data) => {
  const errors = [];
  
  if (!data.jumlahPinjaman || data.jumlahPinjaman <= 0) {
    errors.push('Jumlah Pinjaman must be greater than 0');
  }
  
  if (!data.tenor || data.tenor < 1 || data.tenor > 60) {
    errors.push('Tenor must be between 1 and 60 months');
  }
  
  if (!data.bunga || data.bunga < 0 || data.bunga > 100) {
    errors.push('Bunga must be between 0 and 100 percent');
  }
  
  if (!data.tanggalPinjam) {
    errors.push('Tanggal Pinjam is required');
  }
  
  return errors;
};

module.exports = {
  validateNasabah,
  validatePinjaman
};
