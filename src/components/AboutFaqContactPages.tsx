import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Mail, Phone, MapPin, CheckCircle2, HelpCircle, FileText } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-8">
      <div className="text-center space-y-3">
        <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full uppercase">
          Profil Perusahaan
        </span>
        <h1 className="text-3xl font-serif font-bold text-gray-900">PT Distribusi Kurban Nasional</h1>
        <p className="text-xs text-gray-500 max-w-xl mx-auto">
          Penyelenggara Marketplace Kurban Nasional Indonesia yang menghubungkan masyarakat shohibul qurban dengan lembaga zakat terpercaya.
        </p>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-md space-y-6 text-xs text-gray-700 leading-relaxed">
        <div>
          <h3 className="font-serif font-bold text-gray-900 text-base mb-2">Visi & Misi</h3>
          <p>
            Menjadi platform marketplace kurban nasional yang menghubungkan masyarakat dengan lembaga zakat dan kemanusiaan terpercaya melalui sistem digital yang transparan, aman, dan berbasis data nasional.
          </p>
        </div>

        <div>
          <h3 className="font-serif font-bold text-gray-900 text-base mb-2">Pilar Utama Platform</h3>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              <span><strong>National Data Hub:</strong> Agregasi data populasi & distribusi kurban bekerjasama dengan Kementan RI.</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              <span><strong>Marketplace Engine:</strong> Katalog hewan kurban terintegrasi Midtrans Payment Gateway.</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              <span><strong>Digital Transparency:</strong> Pelacakan progress pemotongan dan penerbitan Sertifikat Digital.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export const FaqPage: React.FC = () => {
  const faqs = [
    { q: 'Apakah transaksi kurban online sah menurut Islam?', a: 'Sah. Sesuai Fatwa MUI, kurban online dikategorikan sebagai akad Wakalah (pemberian kuasa). Pembeli berniat memberi kuasa kepada lembaga untuk membeli, menyembelih, dan membagikan hewan.' },
    { q: 'Bagaimana cara memastikan kesehatan hewan?', a: 'Seluruh hewan di Marketplace Kurban Nasional telah lolos kualifikasi kesehatan dan memiliki Surat Keterangan Kesehatan Hewan (SKKH) dari Dinas Peternakan Kementan RI.' },
    { q: 'Apakah saya bisa mendapatkan laporan pemotongan?', a: 'Ya. Setiap pesanan akan dilengkapi foto/video pemotongan dan Sertifikat Digital Kurban yang memuat nama Shohibul Qurban.' },
    { q: 'Metode pembayaran apa saja yang didukung?', a: 'Kami mendukung QRIS (GoPay, OVO, Dana), Virtual Account (BCA, Mandiri, BRI, BNI), E-Wallet, dan Transfer Bank via Midtrans Gateway.' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-serif font-bold text-gray-900">Pertanyaan Sering Diajukan (FAQ)</h1>
        <p className="text-xs text-gray-500">Jawaban seputar kurban digital dan keamanan transaksi.</p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <div key={idx} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-2 text-xs">
            <h4 className="font-serif font-bold text-emerald-950 text-sm flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-amber-500" /> {faq.q}
            </h4>
            <p className="text-gray-600 leading-relaxed pl-6">{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export const ContactPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-serif font-bold text-gray-900">Hubungi Kami</h1>
        <p className="text-xs text-gray-500">Tim Customer Concierge Kurban Nasional siap membantu Anda 24/7.</p>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-md grid grid-cols-1 md:grid-cols-2 gap-8 text-xs">
        <div className="space-y-4">
          <h3 className="font-serif font-bold text-gray-900 text-sm border-b pb-2">Kontak Kantor Pusat</h3>
          <p className="flex items-start gap-2.5">
            <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <span>Gedung Palma Tower Lt. 12, Jl. RA Kartini III-S, Cilandak, Jakarta Selatan, DKI Jakarta 12430</span>
          </p>
          <p className="flex items-center gap-2.5">
            <Phone className="w-4 h-4 text-amber-500 shrink-0" />
            <span>Hotline: (021) 7884-9900 / WhatsApp: 0811-1000-8899</span>
          </p>
          <p className="flex items-center gap-2.5">
            <Mail className="w-4 h-4 text-amber-500 shrink-0" />
            <span>info@kurbannasional.com</span>
          </p>
        </div>

        <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); alert('Pesan Anda berhasil terkirim!'); }}>
          <h3 className="font-serif font-bold text-gray-900 text-sm border-b pb-2">Kirim Pesan Layanan</h3>
          <input type="text" placeholder="Nama Anda" required className="w-full bg-gray-50 border rounded-xl p-2.5" />
          <input type="email" placeholder="Email Anda" required className="w-full bg-gray-50 border rounded-xl p-2.5" />
          <textarea rows={3} placeholder="Pesan atau Pertanyaan Anda..." required className="w-full bg-gray-50 border rounded-xl p-2.5" />
          <button type="submit" className="w-full bg-emerald-800 text-white font-bold py-2.5 rounded-xl hover:bg-emerald-900">
            Kirim Pesan
          </button>
        </form>
      </div>
    </div>
  );
};
