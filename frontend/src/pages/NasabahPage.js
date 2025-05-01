import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

const NasabahPage = () => {
  const [nasabah, setNasabah] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedNasabah, setSelectedNasabah] = useState(null);
  const [formData, setFormData] = useState({
    nama: '',
    alamat: '',
    nomorTelepon: ''
  });

  // Fetch nasabah data
  const fetchNasabah = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/nasabah');
      setNasabah(response.data.data);
    } catch (error) {
      console.error('Error fetching nasabah:', error);
      toast.error('Gagal mengambil data nasabah');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNasabah();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Open modal for add/edit
  const handleOpenModal = (data = null) => {
    if (data) {
      setSelectedNasabah(data);
      setFormData({
        nama: data.nama,
        alamat: data.alamat,
        nomorTelepon: data.nomorTelepon
      });
    } else {
      setSelectedNasabah(null);
      setFormData({
        nama: '',
        alamat: '',
        nomorTelepon: ''
      });
    }
    setShowModal(true);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (selectedNasabah) {
        // Update existing nasabah
        await axios.put(`http://localhost:5000/api/nasabah/${selectedNasabah.id}`, formData);
        toast.success('Nasabah berhasil diperbarui');
      } else {
        // Add new nasabah
        await axios.post('http://localhost:5000/api/nasabah', formData);
        toast.success('Nasabah berhasil ditambahkan');
      }

      setShowModal(false);
      fetchNasabah();
    } catch (error) {
      console.error('Error saving nasabah:', error);
      toast.error('Gagal menyimpan data nasabah');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle delete nasabah
  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus nasabah ini?')) {
      setIsLoading(true);
      try {
        await axios.delete(`http://localhost:5000/api/nasabah/${id}`);
        toast.success('Nasabah berhasil dihapus');
        fetchNasabah();
      } catch (error) {
        console.error('Error deleting nasabah:', error);
        toast.error('Gagal menghapus nasabah');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Data Nasabah</h1>
          <p className="mt-1 text-gray-600">Kelola data nasabah koperasi</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="btn-primary flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Tambah Nasabah
        </button>
      </div>

      {/* Nasabah Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nama
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Alamat
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nomor Telepon
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                    <i className="fas fa-circle-notch fa-spin mr-2"></i>
                    Loading...
                  </td>
                </tr>
              ) : nasabah.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                    Belum ada data nasabah
                  </td>
                </tr>
              ) : (
                nasabah.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.nama}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.alamat}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.nomorTelepon}
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
                ))
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
                {selectedNasabah ? 'Edit Nasabah' : 'Tambah Nasabah'}
              </h3>

              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  {/* Nama */}
                  <div>
                    <label htmlFor="nama" className="label">
                      Nama
                    </label>
                    <input
                      type="text"
                      id="nama"
                      name="nama"
                      value={formData.nama}
                      onChange={handleInputChange}
                      className="input"
                      required
                    />
                  </div>

                  {/* Alamat */}
                  <div>
                    <label htmlFor="alamat" className="label">
                      Alamat
                    </label>
                    <textarea
                      id="alamat"
                      name="alamat"
                      value={formData.alamat}
                      onChange={handleInputChange}
                      className="input"
                      rows="3"
                      required
                    ></textarea>
                  </div>

                  {/* Nomor Telepon */}
                  <div>
                    <label htmlFor="nomorTelepon" className="label">
                      Nomor Telepon
                    </label>
                    <input
                      type="tel"
                      id="nomorTelepon"
                      name="nomorTelepon"
                      value={formData.nomorTelepon}
                      onChange={handleInputChange}
                      className="input"
                      required
                      pattern="[0-9]{10,13}"
                      title="Nomor telepon harus 10-13 digit"
                    />
                  </div>
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

export default NasabahPage;
