// Menunggu sampai seluruh konten HTML dimuat
document.addEventListener('DOMContentLoaded', () => {

    // 1. Definisikan variabel global untuk menyimpan data
    let studentData = [];

    // 2. Referensi ke elemen-elemen HTML
    const searchButton = document.getElementById('search-btn');
    const rowInput = document.getElementById('row-input');
    const resultContainer = document.getElementById('result-container');

    // 3. Fungsi untuk memuat data JSON
    async function loadData() {
        try {
            // Ambil data dari file JSON yang kita buat
            // Pastikan path-nya benar: 'data/student_data.json'
            const response = await fetch('data/student_data.json');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            studentData = await response.json();
            console.log('Data berhasil dimuat:', studentData.length, 'baris');
            
            // Atur nilai maksimum input berdasarkan jumlah data
            if (studentData.length > 0) {
                rowInput.max = studentData.length;
            }

        } catch (error) {
            console.error('Gagal memuat data:', error);
            // Tampilkan error yang jelas kepada pengguna
            resultContainer.innerHTML = `
                <p style="color: red; font-weight: bold;">
                    ERROR: Gagal memuat file 'data/student_data.json'.
                </p>
                <p style="color: red;">
                    Pastikan Anda sudah menjalankan skrip 'convert_to_json.py' 
                    dan file 'student_data.json' ada di dalam folder 'data'.
                </p>`;
        }
    }

    // 4. Fungsi untuk menangani pencarian
    function handleSearch() {
        // Ambil nilai dari input dan ubah ke angka
        const rowNumber = parseInt(rowInput.value);

        // Validasi input
        if (isNaN(rowNumber) || rowNumber < 1) {
            resultContainer.innerHTML = '<p style="color: red;">Masukkan nomor baris yang valid (mulai dari 1).</p>';
            return;
        }

        // Cari data. Pengguna memasukkan '1', tapi di array itu adalah index '0'
        const dataIndex = rowNumber - 1;

        if (dataIndex >= 0 && dataIndex < studentData.length) {
            // Data ditemukan!
            const data = studentData[dataIndex];
            
            // Tampilkan data
            displayData(data);
        } else {
            // Data tidak ditemukan
            resultContainer.innerHTML = `<p style="color: red;">Data untuk baris ${rowNumber} tidak ditemukan. Total data: ${studentData.length}.</p>`;
        }
    }

    // 5. Fungsi untuk menampilkan data di HTML
    function displayData(data) {
        // Kosongkan kontainer hasil sebelumnya
        resultContainer.innerHTML = '';
        
        // Buat judul
        const title = document.createElement('h3');
        // 'data.index' adalah nomor baris asli (mulai dari 0), jadi + 1
        title.innerText = `Detail Data Baris ${data.index + 1}`; 
        resultContainer.appendChild(title);

        // Ulangi setiap key (seperti 'Age', 'Gender') dalam data
        for (const key in data) {
            // Kita tidak perlu menampilkan 'index' lagi
            if (key === 'index') continue;

            const item = document.createElement('div');
            item.className = 'explanation-item'; // Pakai class dari CSS Anda

            const keyText = document.createElement('p');
            keyText.className = 'question'; // Pakai class dari CSS Anda
            keyText.innerHTML = `${key}:`;
            
            const valueText = document.createElement('p');
            valueText.className = 'answer'; // Pakai class dari CSS Anda
            
            // Jika nilai null atau kosong, tampilkan '-'
            valueText.innerHTML = data[key] !== null && data[key] !== '' ? data[key] : '-';

            item.appendChild(keyText);
            item.appendChild(valueText);
            resultContainer.appendChild(item);
        }
    }

    // 6. Tambahkan event listener ke tombol
    searchButton.addEventListener('click', handleSearch);
    
    // 7. Panggil fungsi loadData() saat halaman pertama kali dibuka
    loadData();
});