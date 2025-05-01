import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ArrowDownTrayIcon,
} from '@heroicons/react/24/outline';

const PinjamanPage = () => {
  const [pinjaman, setPinjaman] = useState([]);
  const [nasabah, setNasabah] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedPinjaman, setSelectedPinjaman] = useState(null);
  const [formData, setFormData] = useState({
    nasabahId: '',
    jumlahPinjaman: '',
    tenor: '',
    tanggalPinjam: '',
    bunga: ''
  });

  // Fetch data
  const fetchData = async () => {
    try {
      const [pinjamanRes, nasabahRes] = await Promise.all([
        axios.get('http://localhost:5000/api/pinjaman'),
        axios.get('http://localhost:5000/api/nasabah')
      ]);

      setPinjaman(pinjamanRes.data.data);
      setNasabah(nasabahRes.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Gagal mengambil data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Calculate cicilan bulanan
  const hitungCicilan = (jumlahPinjaman, bunga, tenor) => {
    const bungaDecimal = bunga / 100;
    return (jumlahPinjaman + (jumlahPinjaman * bungaDecimal * tenor/12)) / tenor;
  };

  // Open modal for add/edit
  const handleOpenModal = (data = null) => {
    if (data) {
      setSelectedPinjaman(data);
      setFormData({
        nasabahId: data.nasabahId,
        jumlahPinjaman: data.jumlahPinjaman,
        tenor: data.tenor,
        tanggalPinjam: data.tanggalPinjam,
        bunga: data.bunga
      });
    } else {
      setSelectedPinjaman(null);
      setFormData({
        nasabahId: '',
        jumlahPinjaman: '',
        tenor: '',
        tanggalPinjam: new Date().toISOString().split('T')[0],
        bunga: ''
      });
    }
    setShowModal(true);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (selectedPinjaman) {
        // Update existing pinjaman
        await axios.put(`http://localhost:5000/api/pinjaman/${selectedPinjaman.id}`, formData);
        toast.success('Pinjaman berhasil diperbarui');
      } else {
        // Add new pinjaman
        await axios.post('http://localhost:5000/api/pinjaman', formData);
        toast.success('Pinjaman berhasil ditambahkan');
      }

      setShowModal(false);
      fetchData();
    } catch (error) {
      console.error('Error saving pinjaman:', error);
      toast.error('Gagal menyimpan data pinjaman');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle delete pinjaman
  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus pinjaman ini?')) {
      setIsLoading(true);
      try {
        await axios.delete(`http://localhost:5000/api/pinjaman/${id}`);
        toast.success('Pinjaman berhasil dihapus');
        fetchData();
      } catch (error) {
        console.error('Error deleting pinjaman:', error);
        toast.error('Gagal menghapus pinjaman');
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Handle download data
  const handleDownload = async (nasabahId = null) => {
    try {
      const url = nasabahId
        ? `http://localhost:5000/api/download/nasabah/${nasabahId}`
        : 'http://localhost:5000/api/download';
      
      const response = await axios.get(url, {
        responseType: 'blob'
      });
      
      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = nasabahId ? `pinjaman-nasabah-${nasabahId}.xlsx` : 'data-pinjaman.xlsx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading data:', error);
      toast.error('Gagal mengunduh data');
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(amount);
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Data Pinjaman</h1>
          <p className="mt-1 text-gray-600">Kelola data pinjaman nasabah</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => handleDownload()}
            className="btn-outline flex items-center"
          >
            <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
            Download Data
          </button>
          <button
            onClick={() => handleOpenModal()}
            className="btn-primary flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Tambah Pinjaman
          </button>
        </div>
      </div>

      {/* Pinjaman Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nasabah
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Jumlah Pinjaman
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tenor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bunga
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cicilan Bulanan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sisa Angsuran
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                    <i className="fas fa-circle-notch fa-spin mr-2"></i>
                    Loading...
                  </td>
                </tr>
              ) : pinjaman.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                    Belum ada data pinjaman
                  </td>
                </tr>
              ) : (
                pinjaman.map((item) => {
                  const nasabahData = nasabah.find(n => n.id === item.nasabahId);
                  return (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {nasabahData?.nama || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(item.jumlahPinjaman)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.tenor} Bulan
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.bunga}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(item.cicilanBulanan)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(item.sisaAngsuran)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <button
                          onClick={() => handleOpenModal(item)}
                          className="text-primary-600 hover:text-primary-800 mr-3"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            {/* Overlay */}
            <div
              className="fixed inset-0 bg-black bg-opacity-30 transition-opacity"
              onClick={() => setShowModal(false)}
            ></div>

            {/* Modal Content */}
            <div className="relative bg-white rounded-lg max-w-md w-full p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {selectedPinjaman ? 'Edit Pinjaman' : 'Tambah Pinjaman'}
              </h3>

              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  {/* Nasabah */}
                  <div>
                    <label htmlFor="nasabahId" className="label">
                      Nasabah
                    </label>
                    <select
                      id="nasabahId"
                      name="nasabahId"
                      value={formData.nasabahId}
                      onChange={handleInputChange}
                      className="input"
                      required
                    >
                      <option value="">Pilih Nasabah</option>
                      {nasabah.map(n => (
                        <option key={n.id} value={n.id}>
                          {n.nama}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Jumlah Pinjaman */}
                  <div>
                    <label htmlFor="jumlahPinjaman" className="label">
                      Jumlah Pinjaman
                    </label>
                    <input
                      type="number"
                      id="jumlahPinjaman"
                      name="jumlahPinjaman"
                      value={formData.jumlahPinjaman}
                      onChange={handleInputChange}
                      className="input"
                      min="0"
                      required
                    />
                  </div>

                  {/* Tenor */}
                  <div>
                    <label htmlFor="tenor" className="label">
                      Tenor (Bulan)
                    </label>
                    <input
                      type="number"
                      id="tenor"
                      name="tenor"
                      value={formData.tenor}
                      onChange={handleInputChange}
                      className="input"
                      min="1"
                      max="60"
                      required
                    />
                  </div>

                  {/* Tanggal Pinjam */}
                  <div>
                    <label htmlFor="tanggalPinjam" className="label">
                      Tanggal Pinjam
                    </label>
                    <input
                      type="date"
                      id="tanggalPinjam"
                      name="tanggalPinjam"
                      value={formData.tanggalPinjam}
                      onChange={handleInputChange}
                      className="input"
                      required
                    />
                  </div>

                  {/* Bunga */}
                  <div>
                    <label htmlFor="bunga" className="label">
                      Bunga (%)
                    </label>
                    <input
                      type="number"
                      id="bunga"
                      name="bunga"
                      value={formData.bunga}
                      onChange={handleInputChange}
                      className="input"
                      min="0"
                      max="100"
                      step="0.01"
                      required
                    />
                  </div>

                  {/* Preview Cicilan */}
                  {formData.jumlahPinjaman && formData.tenor && formData.bunga && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm font-medium text-gray-700">
                        Cicilan Bulanan:
                      </p>
                      <p className="text-lg font-semibold text-primary-600">
                        {formatCurrency(
                          hitungCicilan(
                            parseFloat(formData.jumlahPinjaman),
                            parseFloat(formData.bunga),
                            parseInt(formData.tenor)
                          )
                        )}
                      </p>
                    </div>
                  )}
                </div>

                {/* Form Actions */}
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="btn bg-gray-100 text-gray-700 hover:bg-gray-200"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <i className="fas fa-circle-notch fa-spin mr-2"></i>
                        Loading...
                      </>
                    ) : (
                      'Simpan'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PinjamanPage;
