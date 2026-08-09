export type UserRole = 'guest' | 'pembeli' | 'penjual' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  organizationId?: string; // If penjual
  phone?: string;
  avatar?: string;
  address?: string;
  adminTitle?: string;
}

export interface ProvinceRealizationDetail {
  province: string;
  sapi: number;
  kambing: number;
  domba: number;
  beneficiaries?: number;
}

export interface YearlyOrganizationRealization {
  year: number;
  sapi: number;
  kambing: number;
  domba: number;
  tonMeat: number;
  beneficiaries: number;
  shohibul: number;
  reportStatus?: 'terverifikasi' | 'terkirim' | 'pending';
  lastReportedDate?: string;
  provinceBreakdown?: ProvinceRealizationDetail[];
}

export interface Organization {
  id: string;
  name: string;
  code: string;
  logo: string;
  isVerified: boolean;
  legalNumber: string;
  address: string;
  province: string;
  contactPerson: string;
  phone: string;
  email: string;
  totalDistributed: number;
  rating: number;
  joinedYear: number;

  // Realization report fields for Admin Monitoring & Editing
  realizationSapi?: number;
  realizationKambing?: number;
  realizationDomba?: number;
  realizationTonMeat?: number;
  realizationBeneficiaries?: number;
  realizationShohibul?: number;
  reportStatus?: 'terverifikasi' | 'terkirim' | 'pending';
  lastReportedDate?: string;

  // Multi-year realization reports (e.g. 2025, 2026, etc.)
  yearlyRealization?: Record<number, YearlyOrganizationRealization>;
}

export type AnimalType = 'sapi' | 'kambing' | 'domba';

export interface ProvinceAllocation {
  province: string;
  stock: number;
}

export interface Product {
  id: string;
  title: string;
  organizationId: string;
  organizationName: string;
  organizationLogo: string;
  type: AnimalType;
  breed: string; // e.g. Limosin, Etawa, Garut, Simental, Bali
  weightKg: number;
  ageMonths: number;
  gender: 'jantan' | 'betina';
  price: number;
  discountPrice?: number;
  province: string;
  locationDetails?: string; // Detail kandang (Hanya untuk Kurban Sultan VIP)
  provinceAllocations?: ProvinceAllocation[]; // Kuota stok per lokasi provinsi
  shippingType: 'lokal' | 'olahan_kornet' | 'distribusi_3t' | 'bebas_ongkir';
  estimatedDistributionDate: string;
  healthCertNumber: string;
  isVaccinatedPMK: boolean;
  isVaccinatedLSD: boolean;
  stock: number;
  images: string[];
  videoUrl?: string;
  cctvUrl?: string;
  has360View?: boolean;
  isPremiumUnik?: boolean;
  isFeaturedHome?: boolean;
  isFeaturedLiveFeed?: boolean;
  isApproved: boolean;
  description: string;
  programName?: string;
  targetBeneficiaries?: string;
}

export type OrderStatus =
  | 'pending_payment'
  | 'payment_confirmed'
  | 'lembaga_confirmed'
  | 'animal_preparation'
  | 'slaughtering'
  | 'distributing'
  | 'completed'
  | 'cancelled';

export interface OrderTimeline {
  step: string;
  title: string;
  description: string;
  timestamp?: string;
  isCompleted: boolean;
  photoUrl?: string;
  videoUrl?: string;
}

export interface PekurbanEntry {
  id: string;
  name: string;
  productTitle: string;
  animalType: AnimalType;
  breed: string;
  shareLabel?: string; // e.g., "Sapi 1 Ekor Utuh (Bagian 1 of 7)" or "1/7 Sapi Patungan"
  certificateNumber: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  shohibulQurbanName: string;
  pekurbanList?: PekurbanEntry[]; // List of individual pekurbans under single order ID
  niatDoa?: string;
  items: {
    product: Product;
    quantity: number;
    subtotal: number;
  }[];
  totalAmount: number;
  paymentMethod: 'qris' | 'virtual_account' | 'e_wallet' | 'bank_transfer';
  paymentProvider?: string; // Midtrans provider name e.g. "BCA VA", "GoPay"
  paymentStatus: 'paid' | 'unpaid' | 'failed';
  orderStatus: OrderStatus;
  createdAt: string;
  slaughterDate?: string;
  distributionProvince: string;
  distributionCity?: string;

  // Seller Updates & Execution Flow Fields
  animalArrivedAtLocation?: boolean;
  animalArrivedDate?: string;
  slaughteredDate?: string;

  // Weight & Meat Calculation Logic (50% Bobot Hidup, 1 kg/KK, 4 jiwa/KK)
  liveWeightKg?: number;
  distributedMeatKg?: number;
  beneficiaryFamiliesCount?: number;
  estimatedSoulsCount?: number;

  // 3 Required Photos Uploaded
  photoBeforeSlaughterUrl?: string; // Foto hidup sebelum disembelih
  photoAfterSlaughterUrl?: string;  // Foto setelah disembelih
  photoDistributionUrl?: string;    // Foto distribusi ke penerima manfaat

  // Verification & Certificate Issuance & Moderation
  submittedForAdminVerification?: boolean;
  adminVerifiedForCertificate?: boolean;
  certificateIssued?: boolean;
  revisionRequestedForCertificate?: boolean;
  certificateRevisionNotes?: string;
  resubmittedForAdminVerification?: boolean;

  beneficiariesCount?: number;
  timeline: OrderTimeline[];
  slaughterPhotoUrl?: string;
  slaughterVideoUrl?: string;
  certificateUrl?: string;
  certificateId?: string;
}

export interface ProvinceStat {
  id: string;
  name: string;
  code: string;
  region: 'Sumatera' | 'Jawa' | 'Kalimantan' | 'Sulawesi' | 'Nusa Tenggara' | 'Maluku' | 'Papua';
  mapX: number; // Percentage 0-100 for SVG map rendering
  mapY: number; // Percentage 0-100 for SVG map rendering
  sapiCount: number;
  kambingCount: number;
  dombaCount: number;
  totalAnimalCount: number;
  // Data 2: Realisasi Pelaksanaan Kurban oleh Lembaga per Provinsi
  realizedSapiCount?: number;
  realizedKambingCount?: number;
  realizedDombaCount?: number;
  realizedTotalCount?: number;
  // Multi-year historical implementation stats (e.g. 2022, 2023, 2024, 2025, 2026)
  yearlyStats?: Record<number, {
    sapiCount: number;
    kambingCount: number;
    dombaCount: number;
    totalAnimalCount: number;
    beneficiariesCount: number;
    tonMeatCount?: number;
  }>;
  // 2027 Projected Stock Data
  stock2027?: {
    sapiCount: number;
    kambingCount: number;
    dombaCount: number;
    totalStock: number;
    readinessPercent: number;
  };
  beneficiariesCount: number;
  villagesCount: number;
  districtsCount: number;
  lat: number;
  lng: number;
  povertyIndex?: 'High' | 'Medium' | 'Low'; // High, Medium, Low
}

export interface KementanStockData {
  year: number;
  totalStock: number;
  sapiStock: number;
  kambingStock: number;
  dombaStock: number;
  readinessPercent: number;
  lastUpdated: string;
}

export interface LembagaRealizationData {
  year: number;
  isConsolidatedCurrentYear: boolean;
  stageLabel: string;
  totalRealizedAnimals: number;
  realizedSapi: number;
  realizedKambing: number;
  realizedDomba: number;
  totalTonMeatDistributed: number;
  totalBeneficiaries: number;
  totalBuyers: number;
  totalReportingOrgs: number;
  lastUpdated: string;
}

export interface NationalDataSummary {
  currentYear: number;
  consolidationPhase: 'pre_iduladha' | 'post_iduladha';
  year: number;
  // Data 1: Stok Hewan Secara Nasional (Data Resmi Kementan untuk Tahun Berjalan)
  kementanStock: KementanStockData;
  stockByYear?: Record<number, KementanStockData>;

  // Data 2: Realisasi Pelaksanaan Kurban (Input Lembaga & System - Tahun Sebelumnya atau Berjalan)
  lembagaRealization: LembagaRealizationData;
  realizationByYear?: Record<number, LembagaRealizationData>;

  // Legacy fields for backward compatibility
  totalAnimals: number;
  totalSapi: number;
  totalKambing: number;
  totalDomba: number;
  totalOrganizations: number;
  totalBuyers: number;
  totalBeneficiaries: number;
  totalTonMeatDistributed: number;
  lastUpdatedFromKementan: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  category: 'Berita' | 'Edukasi' | 'Fatwa' | 'Peternakan' | 'Artikel Lembaga';
  author: string;
  organizationName?: string;
  organizationId?: string;
  date: string;
  summary: string;
  content: string;
  imageUrl: string;
  isApproved: boolean;
  views: number;
  status?: 'pending_review' | 'revision_requested' | 'approved' | 'rejected';
  revisionNotes?: string;
  resubmittedAt?: string;
}

export interface Certificate {
  id: string;
  certificateNumber: string;
  orderId: string;
  shohibulQurbanName: string;
  animalType: string;
  breed: string;
  weightKg: number;
  organizationName: string;
  slaughterDate: string;
  distributionLocation: string;
  issueDate: string;
  qrCodeUrl: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  details: string;
  ip: string;
}
