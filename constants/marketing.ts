import { MarketingCampaign } from '../types';

export const MARKETING_CAMPAIGNS: MarketingCampaign[] = [
    {
        id: 'camp_social',
        name: 'Social Media Ads',
        cost: 5000,
        duration: 7,
        brandAwarenessBoost: 5,
        salesBoost: 1.1,
        unlockCost: 0
    },
    {
        id: 'camp_influencer',
        name: 'Tech Influencer Review',
        cost: 25000,
        duration: 14,
        brandAwarenessBoost: 15,
        salesBoost: 1.25,
        unlockCost: 10000
    },
    {
        id: 'camp_tv',
        name: 'TV Commercial',
        cost: 100000,
        duration: 30,
        brandAwarenessBoost: 30,
        salesBoost: 1.5,
        unlockCost: 50000
    },
    {
        id: 'camp_event',
        name: 'Tech Expo Booth',
        cost: 500000,
        duration: 3, // Short but powerful
        brandAwarenessBoost: 50,
        salesBoost: 2.0,
        unlockCost: 200000
    }
];

// --- HİKAYE & ATMOSFER METİNLERİ ---
export const FLAVOR_TEXTS = {
    en: {
        siliconSpike: [
            "BREAKING: Earthquake in Taiwan halts chip production!",
            "NEWS: Cargo ship stuck in canal. Supply chain frozen.",
            "ALERT: Trade war escalates! Tariffs on raw silicon increased.",
            "MARKET: Tech giant buys 40% of global silicon supply."
        ],
        siliconDrop: [
            "NEWS: New massive silicon deposit found in Africa.",
            "MARKET: Trade restrictions lifted. Materials flowing freely.",
            "UPDATE: Recycling breakthrough lowers material costs.",
            "NEWS: Competitor bankruptcy floods market with cheap supply."
        ],
        marketBoom: [
            "WALL STREET: Tech stocks rallying! Investors are euphoric.",
            "NEWS: Government announces massive tech subsidies.",
            "REPORT: Global demand for electronics hits all-time high.",
            "ANALYSIS: 'Golden Age of Silicon' declared by experts."
        ],
        marketCrash: [
            "PANIC: Global recession fears trigger sell-off!",
            "NEWS: Tech bubble bursts? Analysts advise caution.",
            "SCANDAL: Major bank collapse shakes tech sector.",
            "MARKET: Consumer spending drops to 10-year low."
        ],
        staffResign: [
            "MAIL: 'I can't take this stress anymore. I quit.'",
            "MAIL: 'My health is more important than this deadline. Goodbye.'",
            "HR ALERT: Lead researcher poached by rival company.",
            "MAIL: 'This toxic environment is destroying me. I'm leaving.'"
        ]
    },
    tr: {
        siliconSpike: [
            "SON DAKİKA: Tayvan'daki deprem çip üretimini durdurdu!",
            "HABER: Kargo gemisi kanalda sıkıştı. Tedarik zinciri dondu.",
            "UYARI: Ticaret savaşı kızışıyor! Ham silikon vergileri arttı.",
            "PİYASA: Teknoloji devi küresel silikon arzının %40'ını satın aldı."
        ],
        siliconDrop: [
            "HABER: Afrika'da devasa yeni silikon yatağı bulundu.",
            "PİYASA: Ticaret kısıtlamaları kalktı. Malzeme akışı rahatladı.",
            "GÜNCELLEME: Geri dönüşüm atılımı malzeme maliyetlerini düşürdü.",
            "HABER: Rakip iflası piyasayı ucuz stokla doldurdu."
        ],
        marketBoom: [
            "BORSA: Teknoloji hisseleri ralli yapıyor! Yatırımcılar coşkulu.",
            "HABER: Hükümet devasa teknoloji teşvikleri açıkladı.",
            "RAPOR: Küresel elektronik talebi tüm zamanların en yükseğinde.",
            "ANALİZ: Uzmanlar 'Silikonun Altın Çağı'nı ilan etti."
        ],
        marketCrash: [
            "PANİK: Küresel durgunluk korkuları satış dalgasını tetikledi!",
            "HABER: Teknoloji balonu patladı mı? Analistler dikkatli olunmasını öneriyor.",
            "SKANDAL: Büyük banka çöküşü teknoloji sektörünü sarstı.",
            "PİYASA: Tüketici harcamaları son 10 yılın en düşüğünde."
        ],
        staffResign: [
            "POSTA: 'Bu strese daha fazla dayanamıyorum. İstifa ediyorum.'",
            "POSTA: 'Sağlığım bu teslim tarihinden daha önemli. Hoşçakalın.'",
            "İK UYARISI: Baş araştırmacı rakip şirket tarafından ayartıldı.",
            "POSTA: 'Bu zehirli ortam beni mahvediyor. Gidiyorum.'"
        ]
    }
};
