
export interface TokenomicsData {
  totalSupply: string;
  buyTax: string;
  sellTax: string;
  taxAllocation: {
    liquidity: string;
    marketing: string;
    reflection: string;
  };
  supplyAllocation: {
    pulsex: string;
    airdrop: string;
    dev: string;
    marketing: string;
    burn: string;
  };
}

export const validateAllocations = (tokenomics: TokenomicsData) => {
  const errors: {[key: string]: string} = {};
  
  // Validate tax allocation
  const taxTotal = Object.values(tokenomics.taxAllocation).reduce((sum, val) => sum + parseFloat(val || '0'), 0);
  if (Math.abs(taxTotal - 100) > 0.01) {
    errors.taxAllocation = `Tax allocations must equal 100% (currently ${taxTotal.toFixed(1)}%)`;
  }
  
  // Validate supply allocation
  const supplyTotal = Object.values(tokenomics.supplyAllocation).reduce((sum, val) => sum + parseFloat(val || '0'), 0);
  if (Math.abs(supplyTotal - 100) > 0.01) {
    errors.supplyAllocation = `Supply allocations must equal 100% (currently ${supplyTotal.toFixed(1)}%)`;
  }
  
  return errors;
};

export const formatNumber = (num: string) => {
  return parseFloat(num).toLocaleString();
};
