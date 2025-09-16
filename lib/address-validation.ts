/**
 * Address validation utilities for supporting multiple blockchain address formats
 */

export type AddressType = "ethereum" | "fuel" | "invalid";

export interface AddressValidationResult {
  isValid: boolean;
  type: AddressType;
  normalizedAddress: string;
}

/**
 * Validates Ethereum address format (0x + 40 hex characters)
 */
export function isValidEthereumAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address.trim());
}

/**
 * Validates Fuel address format (fuel1 + 58 base32 characters = 63 total)
 */
export function isValidFuelAddress(address: string): boolean {
  return /^fuel1[a-z0-9]{58}$/.test(address.trim());
}

/**
 * Validates and normalizes wallet addresses for both Ethereum and Fuel formats
 */
export function validateWalletAddress(
  address: string
): AddressValidationResult {
  const trimmedAddress = address.trim();

  if (isValidEthereumAddress(trimmedAddress)) {
    return {
      isValid: true,
      type: "ethereum",
      normalizedAddress: trimmedAddress.toLowerCase(),
    };
  }

  if (isValidFuelAddress(trimmedAddress)) {
    return {
      isValid: true,
      type: "fuel",
      normalizedAddress: trimmedAddress,
    };
  }

  return {
    isValid: false,
    type: "invalid",
    normalizedAddress: trimmedAddress,
  };
}

/**
 * Gets a user-friendly error message for invalid addresses
 */
export function getAddressErrorMessage(address: string): string {
  const trimmedAddress = address.trim();

  if (!trimmedAddress) {
    return "Wallet address is required";
  }

  if (trimmedAddress.startsWith("0x") && trimmedAddress.length !== 42) {
    return "Invalid Ethereum address format (should be 42 characters)";
  }

  if (trimmedAddress.startsWith("fuel1") && trimmedAddress.length !== 63) {
    return "Invalid Fuel address format (should be 63 characters)";
  }

  return "Invalid wallet address format. Please enter a valid Ethereum (0x...) or Fuel (fuel1...) address";
}

/**
 * Gets placeholder text for address input
 */
export function getAddressPlaceholder(): string {
  return "fuel1... or 0x...";
}

/**
 * Gets help text for address input
 */
export function getAddressHelpText(): string {
  return "Enter your Ethereum (0x...) or Fuel (fuel1...) wallet address";
}
