export interface TokenomicsData {
  totalSupply: string;
  buyTax: string;
  sellTax: string;
  taxAllocation: {
    liquidity: string;
    marketing: string;
    burn: string;
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

// Convert wei to BEATS (1 wei = 1 million BEATS)
export const weiToBeats = (wei: number) => wei * 1000000;

// Format number with BEATS conversion
export const formatNumber = (num: string) => {
  const numValue = parseFloat(num);
  const beatsValue = weiToBeats(numValue);
  
  if (beatsValue >= 1e12) return `${(beatsValue / 1e12).toFixed(2)}T BEATS`;
  if (beatsValue >= 1e9) return `${(beatsValue / 1e9).toFixed(2)}B BEATS`;
  if (beatsValue >= 1e6) return `${(beatsValue / 1e6).toFixed(2)}M BEATS`;
  if (beatsValue >= 1e3) return `${(beatsValue / 1e3).toFixed(2)}K BEATS`;
  return `${beatsValue.toLocaleString()} BEATS`;
};
