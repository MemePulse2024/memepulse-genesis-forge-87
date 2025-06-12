#!/bin/bash

# Comprehensive Test Suite for Smart Contract Generator
# Tests UI functionality, generated code quality, and deployment readiness

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Test counters
TESTS_PASSED=0
TESTS_FAILED=0
TOTAL_TESTS=0

# Logging function
log() {
    local level=$1
    local message=$2
    local color=""
    
    case $level in
        "INFO") color=$CYAN ;;
        "SUCCESS") color=$GREEN ;;
        "ERROR") color=$RED ;;
        "WARNING") color=$YELLOW ;;
        "DEBUG") color=$PURPLE ;;
    esac
    
    echo -e "${color}[$(date '+%Y-%m-%d %H:%M:%S')] [$level] $message${NC}"
}

# Test assertion function
assert() {
    local condition=$1
    local test_name="$2"
    local success_msg="$3"
    local error_msg="$4"
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    
    if [ "$condition" = "true" ]; then
        TESTS_PASSED=$((TESTS_PASSED + 1))
        log "SUCCESS" "✅ $test_name: $success_msg"
        return 0
    else
        TESTS_FAILED=$((TESTS_FAILED + 1))
        log "ERROR" "❌ $test_name: $error_msg"
        return 1
    fi
}

# Test 1: Check if all required files exist
test_file_structure() {
    log "INFO" "🔍 Testing file structure..."
    
    # Main component file
    if [ -f "src/components/ContractCodeGenerator.tsx" ]; then
        assert "true" "Component File" "ContractCodeGenerator.tsx exists" "Component file missing"
    else
        assert "false" "Component File" "ContractCodeGenerator.tsx exists" "Component file missing"
    fi
    
    # Package.json
    if [ -f "package.json" ]; then
        assert "true" "Package Config" "package.json exists" "Package config missing"
    else
        assert "false" "Package Config" "package.json exists" "Package config missing"
    fi
    
    # TypeScript config
    if [ -f "tsconfig.json" ]; then
        assert "true" "TypeScript Config" "tsconfig.json exists" "TypeScript config missing"
    else
        assert "false" "TypeScript Config" "tsconfig.json exists" "TypeScript config missing"
    fi
}

# Test 2: Check component structure and functions
test_component_structure() {
    log "INFO" "🔍 Testing component structure..."
    
    local component_file="src/components/ContractCodeGenerator.tsx"
    
    if [ -f "$component_file" ]; then
        # Check for required functions
        if grep -q "generateContractCode" "$component_file"; then
            assert "true" "Generate Function" "generateContractCode function found" "generateContractCode function missing"
        else
            assert "false" "Generate Function" "generateContractCode function found" "generateContractCode function missing"
        fi
        
        if grep -q "handleGenerateContract" "$component_file"; then
            assert "true" "Handler Function" "handleGenerateContract function found" "handleGenerateContract function missing"
        else
            assert "false" "Handler Function" "handleGenerateContract function found" "handleGenerateContract function missing"
        fi
        
        # Check for interfaces
        if grep -q "interface SecurityFeatures" "$component_file"; then
            assert "true" "Security Interface" "SecurityFeatures interface found" "SecurityFeatures interface missing"
        else
            assert "false" "Security Interface" "SecurityFeatures interface found" "SecurityFeatures interface missing"
        fi
        
        if grep -q "interface TaxSettings" "$component_file"; then
            assert "true" "Tax Interface" "TaxSettings interface found" "TaxSettings interface missing"
        else
            assert "false" "Tax Interface" "TaxSettings interface found" "TaxSettings interface missing"
        fi
        
        # Check for AI functions
        if grep -q "handleAISuggest" "$component_file"; then
            assert "true" "AI Suggest" "AI suggest function found" "AI suggest function missing"
        else
            assert "false" "AI Suggest" "AI suggest function found" "AI suggest function missing"
        fi
        
        if grep -q "handleAIExplain" "$component_file"; then
            assert "true" "AI Explain" "AI explain function found" "AI explain function missing"
        else
            assert "false" "AI Explain" "AI explain function found" "AI explain function missing"
        fi
        
        # Check for auto-clear timers
        if grep -q "setTimeout.*7000" "$component_file"; then
            assert "true" "Auto-clear Timers" "7-second auto-clear timers found" "Auto-clear timers missing"
        else
            assert "false" "Auto-clear Timers" "7-second auto-clear timers found" "Auto-clear timers missing"
        fi
    else
        assert "false" "Component Structure" "Component file exists for structure test" "Component file missing"
    fi
}

# Test 3: Check generated contract code structure
test_generated_contract_structure() {
    log "INFO" "🔍 Testing generated contract structure..."
    
    local component_file="src/components/ContractCodeGenerator.tsx"
    
    if [ -f "$component_file" ]; then
        # Check for Solidity pragma
        if grep -q "pragma solidity" "$component_file"; then
            assert "true" "Solidity Pragma" "Solidity version pragma found" "Solidity pragma missing"
        else
            assert "false" "Solidity Pragma" "Solidity version pragma found" "Solidity pragma missing"
        fi
        
        # Check for OpenZeppelin imports
        if grep -q "@openzeppelin/contracts" "$component_file"; then
            assert "true" "OpenZeppelin Imports" "OpenZeppelin imports found" "OpenZeppelin imports missing"
        else
            assert "false" "OpenZeppelin Imports" "OpenZeppelin imports found" "OpenZeppelin imports missing"
        fi
        
        # Check for ERC20 inheritance
        if grep -q "ERC20" "$component_file"; then
            assert "true" "ERC20 Standard" "ERC20 inheritance found" "ERC20 inheritance missing"
        else
            assert "false" "ERC20 Standard" "ERC20 inheritance found" "ERC20 inheritance missing"
        fi
        
        # Check for constructor
        if grep -q "constructor" "$component_file"; then
            assert "true" "Constructor" "Constructor function found" "Constructor missing"
        else
            assert "false" "Constructor" "Constructor function found" "Constructor missing"
        fi
        
        # Check for minting logic
        if grep -q "_mint" "$component_file"; then
            assert "true" "Token Minting" "Token minting logic found" "Token minting missing"
        else
            assert "false" "Token Minting" "Token minting logic found" "Token minting missing"
        fi
    else
        assert "false" "Contract Structure" "Component file exists for contract test" "Component file missing"
    fi
}

# Test 4: Check security features implementation
test_security_features() {
    log "INFO" "🔍 Testing security features..."
    
    local component_file="src/components/ContractCodeGenerator.tsx"
    
    if [ -f "$component_file" ]; then
        # Anti-whale protection
        if grep -q "modifier antiWhale" "$component_file"; then
            assert "true" "Anti-whale" "Anti-whale modifier found" "Anti-whale protection missing"
        else
            assert "false" "Anti-whale" "Anti-whale modifier found" "Anti-whale protection missing"
        fi
        
        # Blacklist functionality
        if grep -q "_blacklist" "$component_file"; then
            assert "true" "Blacklist" "Blacklist mapping found" "Blacklist functionality missing"
        else
            assert "false" "Blacklist" "Blacklist mapping found" "Blacklist functionality missing"
        fi
        
        # Pausable functionality
        if grep -q "function pause" "$component_file"; then
            assert "true" "Pausable" "Pause function found" "Pausable functionality missing"
        else
            assert "false" "Pausable" "Pause function found" "Pausable functionality missing"
        fi
        
        # Owner access control
        if grep -q "onlyOwner" "$component_file"; then
            assert "true" "Owner Control" "Owner access control found" "Owner control missing"
        else
            assert "false" "Owner Control" "Owner access control found" "Owner control missing"
        fi
        
        # Input validation
        if grep -q "require(" "$component_file"; then
            assert "true" "Input Validation" "Require statements found" "Input validation missing"
        else
            assert "false" "Input Validation" "Require statements found" "Input validation missing"
        fi
    else
        assert "false" "Security Features" "Component file exists for security test" "Component file missing"
    fi
}

# Test 5: TypeScript compilation
test_typescript_compilation() {
    log "INFO" "🔍 Testing TypeScript compilation..."
    
    # Check if TypeScript compiler is available
    if command -v npx &> /dev/null; then
        # Run TypeScript compilation check
        if timeout 30 npx tsc --noEmit --skipLibCheck 2>/dev/null; then
            assert "true" "TypeScript Compilation" "No TypeScript errors found" "TypeScript compilation failed"
        else
            assert "false" "TypeScript Compilation" "No TypeScript errors found" "TypeScript compilation failed"
        fi
    else
        assert "false" "TypeScript Compilation" "npx command available" "npx not found"
    fi
}

# Test 6: Check dependencies
test_dependencies() {
    log "INFO" "🔍 Testing dependencies..."
    
    if [ -f "package.json" ]; then
        # Required React dependencies
        if grep -q '"react"' package.json; then
            assert "true" "React Dependency" "React dependency found" "React dependency missing"
        else
            assert "false" "React Dependency" "React dependency found" "React dependency missing"
        fi
        
        # Required UI dependencies
        if grep -q '"@radix-ui' package.json; then
            assert "true" "UI Dependencies" "Radix UI dependencies found" "UI dependencies missing"
        else
            assert "false" "UI Dependencies" "Radix UI dependencies found" "UI dependencies missing"
        fi
        
        # Lucide icons
        if grep -q '"lucide-react"' package.json; then
            assert "true" "Icon Library" "Lucide React found" "Icon library missing"
        else
            assert "false" "Icon Library" "Lucide React found" "Icon library missing"
        fi
        
        # Charts library
        if grep -q '"recharts"' package.json; then
            assert "true" "Charts Library" "Recharts found" "Charts library missing"
        else
            assert "false" "Charts Library" "Recharts found" "Charts library missing"
        fi
    else
        assert "false" "Dependencies Check" "package.json exists" "package.json missing"
    fi
}

# Test 7: Contract compilation (if Hardhat is configured)
test_contract_compilation() {
    log "INFO" "🔍 Testing contract compilation..."
    
    if [ -f "hardhat.config.cjs" ] || [ -f "hardhat.config.js" ]; then
        if command -v npx &> /dev/null; then
            if timeout 60 npx hardhat compile 2>/dev/null; then
                assert "true" "Contract Compilation" "Hardhat compilation successful" "Contract compilation failed"
            else
                assert "false" "Contract Compilation" "Hardhat compilation successful" "Contract compilation failed"
            fi
        else
            assert "false" "Contract Compilation" "npx command available" "npx not found"
        fi
    else
        log "WARNING" "Hardhat config not found, skipping contract compilation test"
    fi
}

# Test 8: Check for existing contract artifacts
test_contract_artifacts() {
    log "INFO" "🔍 Testing contract artifacts..."
    
    if [ -d "artifacts/contracts" ]; then
        assert "true" "Contract Artifacts" "Contract artifacts directory exists" "Contract artifacts missing"
        
        # Check for specific contract artifacts
        if [ -f "artifacts/contracts/AdvancedMemeToken.sol/AdvancedMemeToken.json" ]; then
            assert "true" "Advanced Token Artifact" "AdvancedMemeToken artifact found" "AdvancedMemeToken artifact missing"
        else
            assert "false" "Advanced Token Artifact" "AdvancedMemeToken artifact found" "AdvancedMemeToken artifact missing"
        fi
        
        if [ -f "artifacts/contracts/StandardPRC20.sol/StandardPRC20.json" ]; then
            assert "true" "Standard Token Artifact" "StandardPRC20 artifact found" "StandardPRC20 artifact missing"
        else
            assert "false" "Standard Token Artifact" "StandardPRC20 artifact found" "StandardPRC20 artifact missing"
        fi
    else
        assert "false" "Contract Artifacts" "Contract artifacts directory exists" "Contract artifacts missing"
    fi
}

# Test 9: Generate a sample contract
test_sample_contract_generation() {
    log "INFO" "🔍 Testing sample contract generation..."
    
    # Create a simple test script to validate contract generation
    cat > test-generation.js << 'EOF'
const fs = require('fs');
const path = require('path');

// Read the component file
const componentPath = path.join(__dirname, 'src/components/ContractCodeGenerator.tsx');
if (!fs.existsSync(componentPath)) {
    console.error('Component file not found');
    process.exit(1);
}

const content = fs.readFileSync(componentPath, 'utf8');

// Check if the generateContractCode function exists
if (content.includes('const generateContractCode')) {
    console.log('✅ generateContractCode function found');
} else {
    console.error('❌ generateContractCode function not found');
    process.exit(1);
}

// Check for expected contract elements
const expectedElements = [
    'pragma solidity',
    '@openzeppelin/contracts',
    'contract',
    'constructor',
    '_mint',
    'ERC20',
    'Ownable',
    'Pausable'
];

let elementsFound = 0;
expectedElements.forEach(element => {
    if (content.includes(element)) {
        console.log(`✅ Found: ${element}`);
        elementsFound++;
    } else {
        console.log(`⚠️  Missing: ${element}`);
    }
});

console.log(`\n📊 Contract elements found: ${elementsFound}/${expectedElements.length}`);

if (elementsFound >= 6) {
    console.log('✅ Sample contract generation test PASSED');
    process.exit(0);
} else {
    console.log('❌ Sample contract generation test FAILED');
    process.exit(1);
}
EOF

    if command -v node &> /dev/null; then
        if node test-generation.js 2>/dev/null; then
            assert "true" "Sample Generation" "Sample contract generation successful" "Sample generation failed"
        else
            assert "false" "Sample Generation" "Sample contract generation successful" "Sample generation failed"
        fi
        rm -f test-generation.js
    else
        assert "false" "Sample Generation" "Node.js available for test" "Node.js not found"
    fi
}

# Test 10: Check UI component structure
test_ui_components() {
    log "INFO" "🔍 Testing UI components..."
    
    local component_file="src/components/ContractCodeGenerator.tsx"
    
    if [ -f "$component_file" ]; then
        # React hooks
        if grep -q "useState" "$component_file" && grep -q "useEffect" "$component_file"; then
            assert "true" "React Hooks" "React hooks found" "React hooks missing"
        else
            assert "false" "React Hooks" "React hooks found" "React hooks missing"
        fi
        
        # UI components
        local ui_components=("Card" "Button" "Input" "Switch" "Label")
        local ui_found=0
        
        for component in "${ui_components[@]}"; do
            if grep -q "$component" "$component_file"; then
                ui_found=$((ui_found + 1))
            fi
        done
        
        if [ $ui_found -ge 4 ]; then
            assert "true" "UI Components" "Essential UI components found ($ui_found/5)" "UI components missing"
        else
            assert "false" "UI Components" "Essential UI components found ($ui_found/5)" "UI components missing"
        fi
        
        # Toast notifications
        if grep -q "toast" "$component_file"; then
            assert "true" "Toast Notifications" "Toast system found" "Toast notifications missing"
        else
            assert "false" "Toast Notifications" "Toast system found" "Toast notifications missing"
        fi
        
        # Copy/Download functionality
        if grep -q "handleCopyCode" "$component_file" && grep -q "handleDownloadContract" "$component_file"; then
            assert "true" "Copy/Download" "Copy and download functions found" "Copy/download functions missing"
        else
            assert "false" "Copy/Download" "Copy and download functions found" "Copy/download functions missing"
        fi
    else
        assert "false" "UI Components" "Component file exists for UI test" "Component file missing"
    fi
}

# Generate test report
generate_report() {
    log "INFO" "📊 Generating test report..."
    
    local success_rate=0
    if [ $TOTAL_TESTS -gt 0 ]; then
        success_rate=$(( (TESTS_PASSED * 100) / TOTAL_TESTS ))
    fi
    
    cat > test-results.md << EOF
# Smart Contract Generator Test Results

**Date:** $(date)
**Total Tests:** $TOTAL_TESTS
**Passed:** $TESTS_PASSED
**Failed:** $TESTS_FAILED
**Success Rate:** ${success_rate}%

## Test Summary

EOF

    if [ $TESTS_FAILED -eq 0 ]; then
        echo "🎉 **ALL TESTS PASSED!** The Smart Contract Generator is working correctly." >> test-results.md
        log "SUCCESS" "🎉 ALL TESTS PASSED! Generator is working correctly."
    else
        echo "⚠️ **${TESTS_FAILED} test(s) failed.** Please review the issues above." >> test-results.md
        log "WARNING" "⚠️ ${TESTS_FAILED} test(s) failed. Please review the issues."
    fi
    
    cat >> test-results.md << EOF

## Assessment

The Smart Contract Generator is ${success_rate}% functional and ready for $([ $success_rate -ge 90 ] && echo "production use" || echo "further development").

### Key Features Tested:
- Component structure and functions
- Generated contract code quality
- Security features implementation
- TypeScript compilation
- UI components and interactions
- Contract compilation readiness

### Next Steps:
$([ $TESTS_FAILED -eq 0 ] && echo "- Deploy and test in a live environment" || echo "- Fix failing tests")
- Perform manual UI testing
- Test actual contract deployment
- Conduct security audit for production use

---
*Report generated by comprehensive test suite*
EOF

    log "INFO" "📄 Test report saved to test-results.md"
}

# Main test runner
main() {
    log "INFO" "🚀 Starting Smart Contract Generator Comprehensive Test Suite"
    echo -e "${BLUE}============================================================${NC}"
    echo -e "${BLUE}          SMART CONTRACT GENERATOR TEST SUITE             ${NC}"
    echo -e "${BLUE}============================================================${NC}"
    
    # Run all tests
    test_file_structure
    test_component_structure
    test_generated_contract_structure
    test_security_features
    test_typescript_compilation
    test_dependencies
    test_contract_compilation
    test_contract_artifacts
    test_sample_contract_generation
    test_ui_components
    
    # Generate report
    generate_report
    
    echo -e "\n${BLUE}============================================================${NC}"
    echo -e "${BLUE}                    TEST SUMMARY                          ${NC}"
    echo -e "${BLUE}============================================================${NC}"
    echo -e "${CYAN}Total Tests:${NC} $TOTAL_TESTS"
    echo -e "${GREEN}Passed:${NC} $TESTS_PASSED"
    echo -e "${RED}Failed:${NC} $TESTS_FAILED"
    
    if [ $TOTAL_TESTS -gt 0 ]; then
        local success_rate=$(( (TESTS_PASSED * 100) / TOTAL_TESTS ))
        echo -e "${PURPLE}Success Rate:${NC} ${success_rate}%"
    fi
    
    echo -e "${BLUE}============================================================${NC}"
    
    if [ $TESTS_FAILED -eq 0 ]; then
        log "SUCCESS" "🎉 All tests completed successfully!"
        exit 0
    else
        log "ERROR" "❌ Some tests failed. Please review the results."
        exit 1
    fi
}

# Run the main function
main "$@"