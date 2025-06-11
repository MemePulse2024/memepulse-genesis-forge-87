// filepath: /workspaces/memepulse-genesis-forge-87/src/components/ContractCodeGenerator.tsx
import React from 'react';
import { ContractCodeGenerator as ModularContractGenerator } from './contract-generator';
import { ContractCodeGeneratorProps } from './contract-generator/types/interfaces';

// Export the modular version as the main component
export default function ContractCodeGenerator(props: ContractCodeGeneratorProps) {
  return <ModularContractGenerator {...props} />;
}
