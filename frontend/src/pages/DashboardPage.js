import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  UserGroupIcon,
  CurrencyDollarIcon,
  BanknotesIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

const DashboardPage = () => {
  const [stats, setStats] = useState({
    totalNasabah: 0,
    totalPinjaman: 0,
    totalNilaiPinjaman: 0,
    rataRataTenor: 0,
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch nasabah data
        const nasabahResponse = await axios.get('http://localhost:5000/api/nasabah');
        const nasabahData = nasabahResponse.data.data;

        // Fetch pinjaman data
        const pinjamanResponse = await axios.get('http://localhost:5000/api/pinjaman');
        const pinjamanData = pinjamanResponse.data.data;

        // Calculate statistics
        const totalNasabah = nasabahData.length;
        const totalPinjaman = pinjamanData.length;
        const totalNilaiPinjaman = pinjamanData.reduce(
          (sum, pinjaman) => sum + pinjaman.jumlahPinjaman,
          0
        );
        const rataRataTenor = pinjamanData.length
          ? pinjamanData.reduce((sum, pinjaman) => sum + pinjaman.tenor, 0) /
            pinjamanData.length
          : 0;

        setStats({
          totalNasabah,
          totalPinjaman,
          totalNilaiPinjaman,
          rataRataTenor,
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    }).format(amount);
  };

  const stats_items = [
    {
      id: 1,
      title: 'Total Nasabah',
      value: stats.totalNasabah,
      icon: UserGroupIcon,
      color: 'bg-blue-500',
    },
    {
      id: 2,
      title: 'Total Pinjaman',
      value: stats.totalPinjaman,
      icon: CurrencyDollarIcon,
      color: 'bg-green-500',
    },
    {
      id: 3,
      title: 'Total Nilai Pinjaman',
      value: formatCurrency(stats.totalNilaiPinjaman),
      icon: BanknotesIcon,
      color: 'bg-purple-500',
    },
    {
      id: 4,
      title: 'Rata-rata Tenor',
      value: `${Math.round(stats.rataRataTenor)} Bulan`,
      icon: ClockIcon,
      color: 'bg-orange-500',
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2 text-gray-600">
          <i className="fas fa-circle-notch fa-spin text-2xl"></i>
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Selamat Datang di Dashboard Koperasi
        </h1>
        <p className="mt-1 text-gray-600">
          Berikut adalah ringkasan data pinjaman dan nasabah
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats_items.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center">
              <div
                className={`${item.color} rounded-lg p-3 text-white mr-4`}
              >
                <item.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">{item.title}</p>
                <p className="mt-1 text-xl font-semibold text-gray-900">
                  {item.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Additional Info */}
      <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Informasi Penting
        </h2>
        <div className="prose prose-green">
          <ul className="list-disc list-inside text-gray-600">
            <li>Pastikan data nasabah selalu diperbarui</li>
            <li>Periksa status pembayaran pinjaman secara berkala</li>
            <li>Lakukan backup data secara rutin</li>
            <li>Hubungi admin jika menemukan kendala sistem</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
