import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, Product, Order, Article, Organization, ProvinceStat, NationalDataSummary, AuditLog, YearlyOrganizationRealization, ProvinceRealizationDetail } from '../types';
import { mockOrganizations, mockProducts, mockOrders, mockArticles, mockProvinces, mockNationalSummary, mockAuditLogs } from '../data/mockData';

interface CartItem {
  product: Product;
  quantity: number;
}

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  currentUser: User;
  updateUserProfile: (fields: Partial<User>) => void;
  activeView: string;
  setActiveView: (view: string) => void;
  
  // Data State
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  articles: Article[];
  setArticles: React.Dispatch<React.SetStateAction<Article[]>>;
  organizations: Organization[];
  setOrganizations: React.Dispatch<React.SetStateAction<Organization[]>>;
  provinces: ProvinceStat[];
  setProvinces: React.Dispatch<React.SetStateAction<ProvinceStat[]>>;
  updateProvinceStat: (provinceId: string, fields: Partial<ProvinceStat>) => void;
  addProvinceStat: (newProv: ProvinceStat) => void;
  nationalSummary: NationalDataSummary;
  setNationalSummary: React.Dispatch<React.SetStateAction<NationalDataSummary>>;
  updateNationalSummary: (fields: Partial<NationalDataSummary>) => void;
  auditLogs: AuditLog[];
  logAuditEvent: (action: string, details: string, userEmail?: string) => void;

  // Selected State
  selectedProduct: Product | null;
  setSelectedProduct: (p: Product | null) => void;
  trackingOrderId: string | null;
  setTrackingOrderId: (id: string | null) => void;
  certificateOrderId: string | null;
  setCertificateOrderId: (id: string | null) => void;

  // Cart & Checkout
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  
  // AI Assistant
  isAiModalOpen: boolean;
  setIsAiModalOpen: (open: boolean) => void;

  // Actions
  createNewOrder: (orderData: Partial<Order>) => Order;
  updateOrderStatus: (orderId: string, status: Order['orderStatus'], photoUrl?: string) => void;
  updateOrderExecutionFlow: (
    orderId: string,
    flowData: {
      animalArrivedAtLocation?: boolean;
      animalArrivedDate?: string;
      slaughteredDate?: string;
      liveWeightKg?: number;
      photoBeforeSlaughterUrl?: string;
      photoAfterSlaughterUrl?: string;
      photoDistributionUrl?: string;
      submitForAdminVerification?: boolean;
    }
  ) => void;
  verifyAndIssueCertificate: (orderId: string) => void;
  approveProduct: (productId: string) => void;
  toggleFeaturedHomeProduct: (productId: string) => void;
  toggleFeaturedLiveFeedProduct: (productId: string) => void;
  togglePremiumUnikProduct: (productId: string) => void;
  approveArticle: (articleId: string) => void;
  editArticle: (articleId: string, updatedFields: Partial<Article>) => void;
  requestArticleRevision: (articleId: string, notes: string) => void;
  resubmitArticle: (articleId: string, updatedFields: Partial<Article>) => void;
  requestCertificateRevision: (orderId: string, notes: string) => void;
  editExecutionOrder: (orderId: string, updatedFields: Partial<Order>) => void;
  verifyOrganization: (orgId: string) => void;
  addOrganization: (newOrg: Omit<Organization, 'id'>) => void;
  updateOrganization: (orgId: string, updatedFields: Partial<Organization>) => void;
  updateOrganizationYearlyRealization: (
    orgId: string,
    year: number,
    data: {
      sapi: number;
      kambing: number;
      domba: number;
      tonMeat: number;
      beneficiaries: number;
      shohibul: number;
      provinceBreakdown?: ProvinceRealizationDetail[];
      reportStatus?: 'terverifikasi' | 'terkirim' | 'pending';
    }
  ) => void;
  addNewProduct: (newProd: Omit<Product, 'id' | 'isApproved'>) => void;
  updateProduct: (productId: string, updatedFields: Partial<Product>) => void;
  deleteProduct: (productId: string) => void;
  addNewArticle: (newArt: Omit<Article, 'id' | 'isApproved' | 'views'>) => void;
  
  // Filter helper for marketplace
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedAnimalType: string;
  setSelectedAnimalType: (type: string) => void;
  selectedProvince: string;
  setSelectedProvince: (prov: string) => void;
  selectedOrg: string;
  setSelectedOrg: (org: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>('guest');
  const [activeView, setActiveView] = useState<string>('home');
  
  // Current user defaults based on role
  const [currentUser, setCurrentUser] = useState<User>({
    id: 'guest-1',
    name: 'Pengunjung Tamu',
    email: 'guest@kurbannasional.com',
    role: 'guest',
  });

  useEffect(() => {
    if (role === 'pembeli') {
      setCurrentUser({
        id: 'usr-1',
        name: 'Budi Santoso',
        email: 'budi.santoso@gmail.com',
        role: 'pembeli',
        phone: '0812-9988-7766',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        address: 'Jl. Senopati No. 45, Kebayoran Baru, Jakarta Selatan',
      });
    } else if (role === 'penjual') {
      setCurrentUser({
        id: 'seller-1',
        name: 'Ahmad Juwaini (Dompet Dhuafa)',
        email: 'kurban@dompetdhuafa.org',
        role: 'penjual',
        organizationId: 'org-1',
        phone: '0811-1544-488',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        address: 'Jl. Warung Buncit Raya No. 98, Jakarta Selatan',
      });
    } else if (role === 'admin') {
      setCurrentUser({
        id: 'admin-1',
        name: 'Admin Utama Kurban Nasional',
        email: 'admin@kurbannasional.com',
        role: 'admin',
        organizationId: 'org-official',
        phone: '0811-9900-1122',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        adminTitle: 'Superintendent & Verifikator Nasional',
        address: 'Gedung Kementan RI Lt. 4, Pasarminggu, Jakarta Selatan',
      });
    } else {
      setCurrentUser({
        id: 'guest-1',
        name: 'Pengunjung Tamu',
        email: 'guest@kurbannasional.com',
        role: 'guest',
      });
    }
  }, [role]);

  // Main collections initialized with mock data
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('kn_products');
    return saved ? JSON.parse(saved) : mockProducts;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('kn_orders');
    return saved ? JSON.parse(saved) : mockOrders;
  });

  const [articles, setArticles] = useState<Article[]>(() => {
    const saved = localStorage.getItem('kn_articles');
    return saved ? JSON.parse(saved) : mockArticles;
  });

  const [organizations, setOrganizations] = useState<Organization[]>(() => {
    const saved = localStorage.getItem('kn_orgs');
    return saved ? JSON.parse(saved) : mockOrganizations;
  });

  const [provinces, setProvinces] = useState<ProvinceStat[]>(() => {
    const saved = localStorage.getItem('kn_provinces');
    return saved ? JSON.parse(saved) : mockProvinces;
  });

  const [nationalSummary, setNationalSummary] = useState<NationalDataSummary>(() => {
    const saved = localStorage.getItem('kn_national_summary');
    return saved ? JSON.parse(saved) : mockNationalSummary;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('kn_audit_logs');
    return saved ? JSON.parse(saved) : mockAuditLogs;
  });

  // Save to local storage on changes
  useEffect(() => {
    localStorage.setItem('kn_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('kn_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('kn_articles', JSON.stringify(articles));
  }, [articles]);

  useEffect(() => {
    localStorage.setItem('kn_orgs', JSON.stringify(organizations));
  }, [organizations]);

  useEffect(() => {
    localStorage.setItem('kn_provinces', JSON.stringify(provinces));
  }, [provinces]);

  useEffect(() => {
    localStorage.setItem('kn_national_summary', JSON.stringify(nationalSummary));
  }, [nationalSummary]);

  useEffect(() => {
    localStorage.setItem('kn_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  const logAuditEvent = (action: string, details: string, userEmail?: string) => {
    const nowStr = new Date().toLocaleString('id-ID');
    const newLog: AuditLog = {
      id: `audit-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: nowStr,
      user: userEmail || currentUser.email || currentUser.name,
      action,
      details,
      ip: '180.252.19.84 (Verified SSL)',
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Selection & Modal States
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [trackingOrderId, setTrackingOrderId] = useState<string | null>(null);
  const [certificateOrderId, setCertificateOrderId] = useState<string | null>(null);

  // Cart & Checkout States
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);

  // AI Assistant
  const [isAiModalOpen, setIsAiModalOpen] = useState<boolean>(false);

  // Search & Filter Global State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedAnimalType, setSelectedAnimalType] = useState<string>('all');
  const [selectedProvince, setSelectedProvince] = useState<string>('all');
  const [selectedOrg, setSelectedOrg] = useState<string>('all');

  const addToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    setIsCartOpen(true);
  };

  const updateUserProfile = (fields: Partial<User>) => {
    setCurrentUser((prev) => {
      const updated = { ...prev, ...fields };
      logAuditEvent('UPDATE_USER_PROFILE', `Pengguna ${updated.name} (${updated.role}) memperbarui profil.`);
      return updated;
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const clearCart = () => setCart([]);

  const createNewOrder = (orderData: Partial<Order>): Order => {
    const orderNum = `KN/${new Date().getFullYear()}/08/${Math.floor(10000 + Math.random() * 90000)}`;
    const certNum = `CERT-KN-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
    
    // Process pekurbanList or build default from orderData
    let finalPekurbanList: any[] = [];
    if (orderData.pekurbanList && orderData.pekurbanList.length > 0) {
      finalPekurbanList = orderData.pekurbanList.map((entry, idx) => ({
        ...entry,
        id: entry.id || `pek-${Date.now()}-${idx}`,
        certificateNumber: entry.certificateNumber || `CERT-KN-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}-${idx + 1}`,
      }));
    } else {
      const defaultName = orderData.shohibulQurbanName || currentUser.name;
      const firstItem = orderData.items?.[0];
      finalPekurbanList = [
        {
          id: `pek-${Date.now()}-0`,
          name: defaultName,
          productTitle: firstItem?.product.title || 'Hewan Kurban',
          animalType: firstItem?.product.type || 'sapi',
          breed: firstItem?.product.breed || 'Limosin',
          shareLabel: 'Shohibul Qurban Utama',
          certificateNumber: certNum,
        },
      ];
    }

    const summaryNames = finalPekurbanList.map((p) => p.name).join(', ');

    const newOrd: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: orderNum,
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      userPhone: orderData.userPhone || currentUser.phone || '0812-3456-7890',
      shohibulQurbanName: orderData.shohibulQurbanName || summaryNames || currentUser.name,
      pekurbanList: finalPekurbanList,
      niatDoa: orderData.niatDoa || 'Niat kurban lillahi ta’ala',
      items: orderData.items || [],
      totalAmount: orderData.totalAmount || 0,
      paymentMethod: orderData.paymentMethod || 'qris',
      paymentProvider: orderData.paymentProvider || 'Midtrans QRIS',
      paymentStatus: 'paid',
      orderStatus: 'payment_confirmed',
      createdAt: new Date().toLocaleString('id-ID'),
      distributionProvince: orderData.distributionProvince || 'Jawa Barat',
      distributionCity: orderData.distributionCity || 'Pelosok Desa',
      beneficiariesCount: Math.floor(Math.random() * 150) + 100,
      timeline: [
        { step: '1', title: 'Pesanan Dibuat', description: 'Order berhasil dibuat di Kurban Nasional', timestamp: new Date().toLocaleString('id-ID'), isCompleted: true },
        { step: '2', title: 'Pembayaran Sukses', description: 'Pembayaran terverifikasi Midtrans Payment Gateway', timestamp: new Date().toLocaleString('id-ID'), isCompleted: true },
        { step: '3', title: 'Konfirmasi Lembaga', description: 'Diproses oleh lembaga pengelola kurban', timestamp: 'Memproses...', isCompleted: true },
        { step: '4', title: 'Persiapan Hewan', description: 'Pemeriksaan ulang kesehatan & SKKH oleh Dokter Hewan', isCompleted: false },
        { step: '5', title: 'Pemotongan Syar’i', description: 'Penyembelihan oleh Juleha (Juru Sembelih Halal)', isCompleted: false },
        { step: '6', title: 'Distribusi Daging', description: 'Pengiriman daging kurban segar ke penerima manfaat', isCompleted: false },
        { step: '7', title: 'Dokumentasi', description: 'Upload foto/video bukti pemotongan & penerima', isCompleted: false },
        { step: '8', title: 'Selesai', description: 'Sertifikat digital terbit penuh untuk setiap nama pekurban', isCompleted: false },
      ],
      certificateId: certNum,
    };

    setOrders((prev) => [newOrd, ...prev]);

    // Decrement stock for purchased products & province allocations
    if (orderData.items && orderData.items.length > 0) {
      setProducts((prevProducts) =>
        prevProducts.map((p) => {
          const purchasedItem = orderData.items?.find((it) => it.product.id === p.id);
          if (!purchasedItem) return p;

          const qty = purchasedItem.quantity;
          const newTotalStock = Math.max(0, p.stock - qty);

          let newAllocations = p.provinceAllocations;
          if (p.provinceAllocations && p.provinceAllocations.length > 0 && newOrd.distributionProvince) {
            newAllocations = p.provinceAllocations.map((alloc) => {
              if (
                alloc.province.toLowerCase() === newOrd.distributionProvince.toLowerCase() ||
                alloc.province.toLowerCase().includes(newOrd.distributionProvince.toLowerCase())
              ) {
                return {
                  ...alloc,
                  stock: Math.max(0, alloc.stock - qty),
                };
              }
              return alloc;
            });
          }

          return {
            ...p,
            stock: newTotalStock,
            provinceAllocations: newAllocations,
          };
        })
      );
    }

    clearCart();
    return newOrd;
  };

  const updateOrderStatus = (orderId: string, status: Order['orderStatus'], photoUrl?: string) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id !== orderId) return ord;
        
        let updatedTimeline = [...ord.timeline];
        const nowStr = new Date().toLocaleString('id-ID');

        if (status === 'animal_preparation') {
          updatedTimeline[3] = { ...updatedTimeline[3], isCompleted: true, timestamp: nowStr };
        } else if (status === 'slaughtering') {
          updatedTimeline[3] = { ...updatedTimeline[3], isCompleted: true };
          updatedTimeline[4] = { ...updatedTimeline[4], isCompleted: true, timestamp: nowStr, photoUrl: photoUrl || ord.slaughterPhotoUrl };
        } else if (status === 'distributing') {
          updatedTimeline[4] = { ...updatedTimeline[4], isCompleted: true };
          updatedTimeline[5] = { ...updatedTimeline[5], isCompleted: true, timestamp: nowStr };
        } else if (status === 'completed') {
          updatedTimeline = updatedTimeline.map((t) => ({ ...t, isCompleted: true }));
        }

        return {
          ...ord,
          orderStatus: status,
          slaughterPhotoUrl: photoUrl || ord.slaughterPhotoUrl,
          timeline: updatedTimeline,
        };
      })
    );
  };

  const updateOrderExecutionFlow = (
    orderId: string,
    flowData: {
      animalArrivedAtLocation?: boolean;
      animalArrivedDate?: string;
      slaughteredDate?: string;
      liveWeightKg?: number;
      photoBeforeSlaughterUrl?: string;
      photoAfterSlaughterUrl?: string;
      photoDistributionUrl?: string;
      submitForAdminVerification?: boolean;
    }
  ) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id !== orderId) return ord;

        const liveWeight = flowData.liveWeightKg || ord.liveWeightKg || ord.items[0]?.product.weightKg || 350;
        const distributedMeat = Math.round(liveWeight * 0.5);
        const families = distributedMeat;
        const souls = families * 4;

        const nowStr = new Date().toLocaleString('id-ID');

        let updatedTimeline = [...ord.timeline];

        if (flowData.animalArrivedAtLocation) {
          updatedTimeline[3] = {
            ...updatedTimeline[3],
            title: 'Hewan Tiba di Lokasi Pemotongan',
            description: `Hewan telah tiba di lokasi/kandang (${flowData.animalArrivedDate || nowStr})`,
            timestamp: flowData.animalArrivedDate || nowStr,
            isCompleted: true,
          };
        }

        if (flowData.slaughteredDate || flowData.photoAfterSlaughterUrl) {
          updatedTimeline[4] = {
            ...updatedTimeline[4],
            title: 'Pemotongan Syar’i Selesai',
            description: `Penyembelihan syar'i dilaksanakan pada ${flowData.slaughteredDate || nowStr}`,
            timestamp: flowData.slaughteredDate || nowStr,
            isCompleted: true,
            photoUrl: flowData.photoAfterSlaughterUrl || ord.photoAfterSlaughterUrl,
          };
        }

        if (flowData.photoDistributionUrl) {
          updatedTimeline[5] = {
            ...updatedTimeline[5],
            title: 'Daging Terdistribusi Ke Penerima Manfaat',
            description: `Distribusi ${distributedMeat} kg daging kepada ${families} KK (Estimasi ${souls} jiwa)`,
            timestamp: nowStr,
            isCompleted: true,
            photoUrl: flowData.photoDistributionUrl,
          };
        }

        if (flowData.submitForAdminVerification) {
          updatedTimeline[6] = {
            ...updatedTimeline[6],
            title: 'Laporan Dikirim ke Admin',
            description: 'Laporan dan 3 foto bukti dikirim untuk verifikasi penerbitan sertifikat digital',
            timestamp: nowStr,
            isCompleted: true,
          };
        }

        let newStatus: Order['orderStatus'] = ord.orderStatus;
        if (flowData.photoDistributionUrl) newStatus = 'distributing';
        else if (flowData.slaughteredDate) newStatus = 'slaughtering';
        else if (flowData.animalArrivedAtLocation) newStatus = 'animal_preparation';

        return {
          ...ord,
          orderStatus: newStatus,
          animalArrivedAtLocation: flowData.animalArrivedAtLocation ?? ord.animalArrivedAtLocation,
          animalArrivedDate: flowData.animalArrivedDate || ord.animalArrivedDate || nowStr,
          slaughteredDate: flowData.slaughteredDate || ord.slaughteredDate,
          liveWeightKg: liveWeight,
          distributedMeatKg: distributedMeat,
          beneficiaryFamiliesCount: families,
          estimatedSoulsCount: souls,
          photoBeforeSlaughterUrl: flowData.photoBeforeSlaughterUrl || ord.photoBeforeSlaughterUrl,
          photoAfterSlaughterUrl: flowData.photoAfterSlaughterUrl || ord.photoAfterSlaughterUrl,
          photoDistributionUrl: flowData.photoDistributionUrl || ord.photoDistributionUrl,
          submittedForAdminVerification: flowData.submitForAdminVerification ?? ord.submittedForAdminVerification,
          beneficiariesCount: souls,
          timeline: updatedTimeline,
        };
      })
    );

    logAuditEvent('UPDATE_EXECUTION_FLOW', `Penjual memperbarui alur pelaksanaan kurban Order ID: ${orderId}`);
  };

  const verifyAndIssueCertificate = (orderId: string) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id !== orderId) return ord;

        const certNum = ord.certificateId || `CERT-KN-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
        const nowStr = new Date().toLocaleString('id-ID');

        const updatedTimeline = ord.timeline.map((step) => ({
          ...step,
          isCompleted: true,
          timestamp: step.timestamp || nowStr,
        }));

        return {
          ...ord,
          orderStatus: 'completed',
          adminVerifiedForCertificate: true,
          certificateIssued: true,
          revisionRequestedForCertificate: false,
          resubmittedForAdminVerification: false,
          certificateId: certNum,
          timeline: updatedTimeline,
        };
      })
    );

    logAuditEvent('VERIFY_CERTIFICATE', `Admin memverifikasi laporan pelaksanaan kurban & menerbitkan sertifikat digital untuk Order ID: ${orderId}`);
  };

  const approveProduct = (productId: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, isApproved: true } : p))
    );
    logAuditEvent('APPROVE_PRODUCT', `Admin menyetujui (approve) katalog produk hewan ID: ${productId}`);
  };

  const toggleFeaturedHomeProduct = (productId: string) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          return { ...p, isFeaturedHome: !p.isFeaturedHome };
        }
        // Ensure only 1 product is featured on homepage
        return { ...p, isFeaturedHome: false };
      })
    );
    logAuditEvent('TOGGLE_FEATURED_HOME', `Admin memperbarui produk unggulan Halaman Depan untuk ID: ${productId}`);
  };

  const toggleFeaturedLiveFeedProduct = (productId: string) => {
    setProducts((prev) => {
      const target = prev.find((p) => p.id === productId);
      if (!target) return prev;
      return prev.map((p) => {
        if (p.id === productId) {
          return { ...p, isFeaturedLiveFeed: !p.isFeaturedLiveFeed };
        }
        return p;
      });
    });
    logAuditEvent('TOGGLE_FEATURED_LIVE_FEED', `Admin memperbarui status VIP Live Feed Kandang 24/7 untuk ID: ${productId}`);
  };

  const togglePremiumUnikProduct = (productId: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, isPremiumUnik: !p.isPremiumUnik } : p))
    );
    logAuditEvent('TOGGLE_VIP_PRODUCT', `Admin/Penjual mengubah status Kurban Sultan (VIP) untuk ID: ${productId}`);
  };

  const approveArticle = (articleId: string) => {
    setArticles((prev) =>
      prev.map((a) => (a.id === articleId ? { ...a, isApproved: true, status: 'approved', revisionNotes: '' } : a))
    );
    logAuditEvent('APPROVE_ARTICLE', `Admin menyetujui & mempublikasikan artikel ID: ${articleId}`);
  };

  const editArticle = (articleId: string, updatedFields: Partial<Article>) => {
    setArticles((prev) =>
      prev.map((a) => (a.id === articleId ? { ...a, ...updatedFields } : a))
    );
    logAuditEvent('EDIT_ARTICLE', `Admin memperbarui isi artikel ID: ${articleId}`);
  };

  const requestArticleRevision = (articleId: string, notes: string) => {
    setArticles((prev) =>
      prev.map((a) =>
        a.id === articleId
          ? { ...a, isApproved: false, status: 'revision_requested', revisionNotes: notes }
          : a
      )
    );
    logAuditEvent('REQUEST_ARTICLE_REVISION', `Admin meminta revisi moderasi artikel ID: ${articleId}. Catatan: "${notes}"`);
  };

  const resubmitArticle = (articleId: string, updatedFields: Partial<Article>) => {
    setArticles((prev) =>
      prev.map((a) =>
        a.id === articleId
          ? {
              ...a,
              ...updatedFields,
              isApproved: false,
              status: 'pending_review',
              resubmittedAt: new Date().toLocaleString('id-ID'),
            }
          : a
      )
    );
    logAuditEvent('RESUBMIT_ARTICLE', `Penjual memperbarui & mengirim ulang artikel ID: ${articleId} untuk ditinjau Admin`);
  };

  const requestCertificateRevision = (orderId: string, notes: string) => {
    setOrders((prev) =>
      prev.map((ord) =>
        ord.id === orderId
          ? {
              ...ord,
              submittedForAdminVerification: false,
              revisionRequestedForCertificate: true,
              certificateRevisionNotes: notes,
            }
          : ord
      )
    );
    logAuditEvent('REQUEST_CERTIFICATE_REVISION', `Admin meminta moderasi/revisi laporan pemotongan kurban Order ID: ${orderId}. Catatan: "${notes}"`);
  };

  const editExecutionOrder = (orderId: string, updatedFields: Partial<Order>) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, ...updatedFields } : ord))
    );
    logAuditEvent('EDIT_EXECUTION_ORDER', `Admin/Penjual menyunting data pelaksanaan kurban Order ID: ${orderId}`);
  };

  const verifyOrganization = (orgId: string) => {
    setOrganizations((prev) =>
      prev.map((o) => (o.id === orgId ? { ...o, isVerified: true } : o))
    );
    logAuditEvent('VERIFY_LEMBAGA', `Admin memverifikasi legalitas SK Kemenag Lembaga ID: ${orgId}`);
  };

  const addOrganization = (newOrg: Omit<Organization, 'id'>) => {
    const orgId = `org-${Date.now()}`;
    const createdOrg: Organization = {
      ...newOrg,
      id: orgId,
    };
    setOrganizations((prev) => [...prev, createdOrg]);
    logAuditEvent('ADD_LEMBAGA', `Admin menambahkan lembaga terverifikasi baru: ${newOrg.name} (${newOrg.legalNumber})`);
  };

  const updateOrganization = (orgId: string, updatedFields: Partial<Organization>) => {
    let oldOrgName = '';
    let oldOrgLogo = '';
    let oldContact = '';

    setOrganizations((prev) => {
      const target = prev.find((o) => o.id === orgId);
      if (target) {
        oldOrgName = target.name;
        oldOrgLogo = target.logo;
        oldContact = target.contactPerson;
      }
      return prev.map((o) => (o.id === orgId ? { ...o, ...updatedFields } : o));
    });

    const newOrgName = updatedFields.name ?? oldOrgName;
    const newOrgLogo = updatedFields.logo ?? oldOrgLogo;
    const newContact = updatedFields.contactPerson ?? oldContact;

    // 1. Synchronize Catalog Products
    setProducts((prev) =>
      prev.map((p) => {
        if (p.organizationId === orgId || p.organizationName === oldOrgName) {
          return {
            ...p,
            organizationId: orgId,
            organizationName: newOrgName || p.organizationName,
            organizationLogo: newOrgLogo || p.organizationLogo,
          };
        }
        return p;
      })
    );

    // 2. Synchronize Articles
    setArticles((prev) =>
      prev.map((a) => {
        const isTargetArticle =
          a.organizationId === orgId ||
          a.organizationName === oldOrgName ||
          (oldOrgName && a.author.includes(oldOrgName)) ||
          (oldContact && a.author.includes(oldContact));

        if (isTargetArticle) {
          let updatedAuthor = a.author;
          if (oldOrgName && newOrgName && oldOrgName !== newOrgName && updatedAuthor.includes(oldOrgName)) {
            updatedAuthor = updatedAuthor.replaceAll(oldOrgName, newOrgName);
          }
          if (oldContact && newContact && oldContact !== newContact && updatedAuthor.includes(oldContact)) {
            updatedAuthor = updatedAuthor.replaceAll(oldContact, newContact);
          }

          return {
            ...a,
            organizationId: orgId,
            organizationName: newOrgName || a.organizationName,
            author: updatedAuthor,
          };
        }
        return a;
      })
    );

    // 3. Synchronize Orders & Order Items
    setOrders((prev) =>
      prev.map((ord) => ({
        ...ord,
        items: ord.items.map((item) => {
          if (
            item.product.organizationId === orgId ||
            item.product.organizationName === oldOrgName
          ) {
            return {
              ...item,
              product: {
                ...item.product,
                organizationId: orgId,
                organizationName: newOrgName || item.product.organizationName,
                organizationLogo: newOrgLogo || item.product.organizationLogo,
              },
            };
          }
          return item;
        }),
      }))
    );

    logAuditEvent(
      'UPDATE_LEMBAGA',
      `Admin memperbarui profil lembaga ID: ${orgId} (${newOrgName || ''}), otomatis tersinkronisasi ke katalog produk, artikel, & pesanan.`
    );
  };

  const updateOrganizationYearlyRealization = (
    orgId: string,
    year: number,
    data: {
      sapi: number;
      kambing: number;
      domba: number;
      tonMeat: number;
      beneficiaries: number;
      shohibul: number;
      provinceBreakdown?: ProvinceRealizationDetail[];
      reportStatus?: 'terverifikasi' | 'terkirim' | 'pending';
    }
  ) => {
    const currentYear = nationalSummary.currentYear || 2026;
    const nowStr = new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });

    setOrganizations((prev) =>
      prev.map((org) => {
        if (org.id !== orgId) return org;

        const existingYearly = org.yearlyRealization || {};
        const newReport: YearlyOrganizationRealization = {
          year,
          sapi: Number(data.sapi) || 0,
          kambing: Number(data.kambing) || 0,
          domba: Number(data.domba) || 0,
          tonMeat: Number(data.tonMeat) || 0,
          beneficiaries: Number(data.beneficiaries) || 0,
          shohibul: Number(data.shohibul) || 0,
          reportStatus: data.reportStatus || 'terverifikasi',
          lastReportedDate: nowStr,
          provinceBreakdown: data.provinceBreakdown || existingYearly[year]?.provinceBreakdown || [],
        };

        const updatedYearly = {
          ...existingYearly,
          [year]: newReport,
        };

        if (year === currentYear) {
          return {
            ...org,
            realizationSapi: newReport.sapi,
            realizationKambing: newReport.kambing,
            realizationDomba: newReport.domba,
            realizationTonMeat: newReport.tonMeat,
            realizationBeneficiaries: newReport.beneficiaries,
            realizationShohibul: newReport.shohibul,
            reportStatus: newReport.reportStatus,
            lastReportedDate: nowStr,
            yearlyRealization: updatedYearly,
          };
        }

        return {
          ...org,
          yearlyRealization: updatedYearly,
        };
      })
    );

    // Update provincial stats for that year if province breakdown is provided
    if (data.provinceBreakdown && data.provinceBreakdown.length > 0) {
      setProvinces((prevProvinces) =>
        prevProvinces.map((prov) => {
          const foundDetail = data.provinceBreakdown?.find(
            (pb) => pb.province.toLowerCase() === prov.name.toLowerCase() || pb.province.toLowerCase() === prov.code.toLowerCase()
          );
          if (!foundDetail) return prov;

          const currentYearlyStats = prov.yearlyStats || {};
          const existingForYear = currentYearlyStats[year] || {
            sapiCount: prov.sapiCount,
            kambingCount: prov.kambingCount,
            dombaCount: prov.dombaCount,
            totalAnimalCount: prov.totalAnimalCount,
            beneficiariesCount: prov.beneficiariesCount,
          };

          const newYearlyForProv = {
            ...existingForYear,
            sapiCount: Math.max(existingForYear.sapiCount, foundDetail.sapi),
            kambingCount: Math.max(existingForYear.kambingCount, foundDetail.kambing),
            dombaCount: Math.max(existingForYear.dombaCount, foundDetail.domba),
            totalAnimalCount: foundDetail.sapi + foundDetail.kambing + foundDetail.domba,
            beneficiariesCount: foundDetail.beneficiaries || (foundDetail.sapi + foundDetail.kambing + foundDetail.domba) * 10,
          };

          return {
            ...prov,
            yearlyStats: {
              ...currentYearlyStats,
              [year]: newYearlyForProv,
            },
          };
        })
      );
    }

    logAuditEvent(
      'UPDATE_REALIZATION_REPORT',
      `Lembaga ID ${orgId} memperbarui Laporan Realisasi Implementasi Kurban Tahun ${year}.`
    );
  };

  const addNewProduct = (newProd: Omit<Product, 'id' | 'isApproved'>) => {
    // Auto sync with official organization profile if matched
    const matchedOrg = organizations.find(
      (o) => o.id === newProd.organizationId || o.name === newProd.organizationName
    );

    let calculatedStock = newProd.stock;
    let computedProvince = newProd.province;

    if (newProd.provinceAllocations && newProd.provinceAllocations.length > 0) {
      calculatedStock = newProd.provinceAllocations.reduce((acc, curr) => acc + (Number(curr.stock) || 0), 0);
      computedProvince = newProd.provinceAllocations.map((a) => a.province).filter(Boolean).join(', ');
    }

    const prod: Product = {
      ...newProd,
      id: `prod-${Date.now()}`,
      stock: calculatedStock > 0 ? calculatedStock : newProd.stock,
      province: computedProvince || newProd.province || 'Jawa Barat',
      organizationId: matchedOrg ? matchedOrg.id : (newProd.organizationId || 'org-official'),
      organizationName: matchedOrg ? matchedOrg.name : (newProd.organizationName || 'Kurban Nasional Official'),
      organizationLogo: matchedOrg ? matchedOrg.logo : (newProd.organizationLogo || 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=150&auto=format&fit=crop&q=80'),
      locationDetails: newProd.isPremiumUnik ? (newProd.locationDetails || 'Kandang VIP Sultan') : undefined,
      isApproved: role === 'admin' ? true : (newProd as any).isApproved ?? false,
    };
    setProducts((prev) => [prod, ...prev]);
    logAuditEvent('ADD_PRODUCT', `Admin/Penjual (${prod.organizationName}) menambahkan produk hewan baru: ${prod.title}`);
  };

  const updateProduct = (productId: string, updatedFields: Partial<Product>) => {
    let matchedOrg: Organization | undefined;
    if (updatedFields.organizationId || updatedFields.organizationName) {
      matchedOrg = organizations.find(
        (o) => o.id === updatedFields.organizationId || o.name === updatedFields.organizationName
      );
    }

    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== productId) return p;
        return {
          ...p,
          ...updatedFields,
          organizationId: matchedOrg ? matchedOrg.id : (updatedFields.organizationId || p.organizationId),
          organizationName: matchedOrg ? matchedOrg.name : (updatedFields.organizationName || p.organizationName),
          organizationLogo: matchedOrg ? matchedOrg.logo : (updatedFields.organizationLogo || p.organizationLogo),
        };
      })
    );
    logAuditEvent('UPDATE_PRODUCT', `Admin/Penjual memperbarui data produk hewan ID: ${productId}`);
  };

  const deleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    logAuditEvent('DELETE_PRODUCT', `Admin menghapus produk hewan ID: ${productId} dari katalog`);
  };

  const addNewArticle = (newArt: Omit<Article, 'id' | 'isApproved' | 'views'>) => {
    // Auto sync with official organization profile
    const matchedOrg = organizations.find(
      (o) => o.id === newArt.organizationId || o.name === newArt.organizationName
    ) || organizations[0];

    const finalOrgName = matchedOrg ? matchedOrg.name : newArt.organizationName || 'Dompet Dhuafa';
    const finalAuthor = newArt.author && newArt.author !== 'Penjual'
      ? newArt.author
      : matchedOrg ? `${matchedOrg.contactPerson} (${matchedOrg.name})` : 'Penulis Lembaga';

    const art: Article = {
      ...newArt,
      id: `art-${Date.now()}`,
      organizationId: matchedOrg ? matchedOrg.id : newArt.organizationId,
      organizationName: finalOrgName,
      author: finalAuthor,
      isApproved: role === 'admin',
      views: 1,
    };
    setArticles((prev) => [art, ...prev]);
    logAuditEvent('ADD_ARTICLE', `Penjual/Admin (${art.author}) mengajukan draf artikel baru: ${art.title}`);
  };

  const updateNationalSummary = (fields: Partial<NationalDataSummary>) => {
    setNationalSummary((prev) => {
      const nextYear = fields.currentYear ?? fields.year ?? prev.currentYear ?? 2026;
      const nextPhase = fields.consolidationPhase ?? prev.consolidationPhase ?? 'post_iduladha';

      // Data 1 (Stok Tahun Berjalan Kementan)
      const stockForYear = (prev.stockByYear && prev.stockByYear[nextYear]) 
        || fields.kementanStock 
        || prev.kementanStock;

      // Data 2 (Realisasi Lembaga: Pre-Iduladha = Tahun Sebelumnya; Post-Iduladha = Tahun Berjalan)
      const targetRealizationYear = nextPhase === 'pre_iduladha' ? (nextYear - 1) : nextYear;
      const realizationForYear = (prev.realizationByYear && prev.realizationByYear[targetRealizationYear])
        || fields.lembagaRealization
        || prev.lembagaRealization;

      return {
        ...prev,
        ...fields,
        currentYear: nextYear,
        year: nextYear,
        consolidationPhase: nextPhase,
        kementanStock: {
          ...stockForYear,
          ...(fields.kementanStock || {}),
          year: nextYear,
        },
        lembagaRealization: {
          ...realizationForYear,
          ...(fields.lembagaRealization || {}),
          year: targetRealizationYear,
          isConsolidatedCurrentYear: nextPhase === 'post_iduladha',
        },
      };
    });
    logAuditEvent('UPDATE_NATIONAL_SUMMARY', `Admin memperbarui Data Agregasi Nasional Kurban.`);
  };

  const updateProvinceStat = (provinceId: string, fields: Partial<ProvinceStat>) => {
    setProvinces((prev) =>
      prev.map((p) => {
        if (p.id === provinceId) {
          const sapiCount = fields.sapiCount !== undefined ? fields.sapiCount : p.sapiCount;
          const kambingCount = fields.kambingCount !== undefined ? fields.kambingCount : p.kambingCount;
          const dombaCount = fields.dombaCount !== undefined ? fields.dombaCount : p.dombaCount;
          const totalAnimalCount = sapiCount + kambingCount + dombaCount;
          return { ...p, ...fields, sapiCount, kambingCount, dombaCount, totalAnimalCount };
        }
        return p;
      })
    );
    logAuditEvent('UPDATE_PROVINCE_STAT', `Admin memperbarui data statistik provinsi ID: ${provinceId}`);
  };

  const addProvinceStat = (newProv: ProvinceStat) => {
    setProvinces((prev) => [...prev, newProv]);
    logAuditEvent('ADD_PROVINCE_STAT', `Admin menambahkan provinsi baru: ${newProv.name}`);
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        currentUser,
        updateUserProfile,
        activeView,
        setActiveView,
        products,
        setProducts,
        orders,
        setOrders,
        articles,
        setArticles,
        organizations,
        setOrganizations,
        provinces,
        setProvinces,
        updateProvinceStat,
        addProvinceStat,
        nationalSummary,
        setNationalSummary,
        updateNationalSummary,
        auditLogs,
        logAuditEvent,
        selectedProduct,
        setSelectedProduct,
        trackingOrderId,
        setTrackingOrderId,
        certificateOrderId,
        setCertificateOrderId,
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isAiModalOpen,
        setIsAiModalOpen,
        createNewOrder,
        updateOrderStatus,
        updateOrderExecutionFlow,
        verifyAndIssueCertificate,
        approveProduct,
        toggleFeaturedHomeProduct,
        toggleFeaturedLiveFeedProduct,
        togglePremiumUnikProduct,
        approveArticle,
        editArticle,
        requestArticleRevision,
        resubmitArticle,
        requestCertificateRevision,
        editExecutionOrder,
        verifyOrganization,
        addOrganization,
        updateOrganization,
        updateOrganizationYearlyRealization,
        addNewProduct,
        updateProduct,
        deleteProduct,
        addNewArticle,
        searchQuery,
        setSearchQuery,
        selectedAnimalType,
        setSelectedAnimalType,
        selectedProvince,
        setSelectedProvince,
        selectedOrg,
        setSelectedOrg,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
