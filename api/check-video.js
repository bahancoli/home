// api/check-video.js

export default async function handler(req, res) {
  // 1. Keamanan: Hanya izinkan request GET
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  // 2. Ambil ID Video dari URL query (contoh: ?id=xyz123)
  const { id } = req.query;
  
  // 3. Ambil API Key dari Environment Variable Vercel
  const DOOD_API_KEY = process.env.DOOD_API_KEY;

  // Validasi input
  if (!id) {
    return res.status(400).json({ error: 'ID Video diperlukan' });
  }
  if (!DOOD_API_KEY) {
    return res.status(500).json({ error: 'API Key belum disetting di Vercel' });
  }

  try {
    // 4. Panggil API Doodstream
    // Endpoint: /api/file/info
    const apiUrl = `https://doodapi.com/api/file/info?key=${DOOD_API_KEY}&file_code=${id}`;
    
    const response = await fetch(apiUrl);
    const data = await response.json();

    // 5. Cek Respon Doodstream
    if (data.status === 200 && data.result && data.result.length > 0) {
      const videoInfo = data.result[0];
      
      // Kirim balik data penting ke frontend kita
      return res.status(200).json({
        valid: true,
        title: videoInfo.title,
        img: videoInfo.single_img, // Thumbnail resmi
        length: videoInfo.length,
        size: videoInfo.size
      });
    } else {
      // Jika status bukan 200 atau result kosong
      return res.status(404).json({ 
        valid: false, 
        message: 'Video tidak ditemukan atau ID salah' 
      });
    }

  } catch (error) {
    console.error("Error fetching Dood API:", error);
    return res.status(500).json({ error: 'Gagal menghubungi server Doodstream' });
  }
}

