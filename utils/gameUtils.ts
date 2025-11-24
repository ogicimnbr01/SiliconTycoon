export const getReputationBonuses = (rep: number) => {
    return {
        priceBonus: rep >= 20 ? 1.10 : 1.0,
        siliconDiscount: rep >= 40 ? 0.85 : 1.0,
        contractBonus: rep >= 60 ? 1.20 : 1.0,
        researchBonus: rep >= 80 ? 1.25 : 1.0
    };
};
