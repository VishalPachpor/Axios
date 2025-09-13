/**
 * Random Avatar Generator using DiceBear API
 * Provides utilities for generating random avatars
 */

// Available avatar styles from DiceBear
export const AVATAR_STYLES = {
  adventurer: "adventurer",
  personas: "personas",
  lorelei: "lorelei",
  miniavs: "miniavs",
} as const;

export type AvatarStyle = keyof typeof AVATAR_STYLES;

/**
 * Generate a random seed for avatar generation
 * Uses timestamp + random number for uniqueness
 */
export const generateRandomSeed = (): string => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2);
  return `${timestamp}-${random}`;
};

/**
 * Generate an avatar URL from a seed using DiceBear API
 * @param seed - Unique string identifier for consistent avatar generation
 * @param style - Avatar style to use (defaults to 'adventurer')
 * @param options - Additional customization options
 */
export const generateAvatarUrl = (
  seed: string,
  style: AvatarStyle = "adventurer",
  options: {
    size?: number;
    backgroundColor?: string;
    radius?: number;
  } = {}
): string => {
  const baseUrl = "https://api.dicebear.com/8.x";
  const { size = 128, backgroundColor, radius = 50 } = options;

  const params = new URLSearchParams({
    seed: seed,
    size: size.toString(),
    radius: radius.toString(),
  });

  // Add background color if specified
  if (backgroundColor) {
    params.append("backgroundColor", backgroundColor.replace("#", ""));
  }

  return `${baseUrl}/${AVATAR_STYLES[style]}/svg?${params.toString()}`;
};

/**
 * Generate multiple random avatar options
 * @param count - Number of avatar options to generate
 * @param style - Avatar style to use
 */
export const generateAvatarOptions = (
  count: number = 6,
  style: AvatarStyle = "adventurer"
): string[] => {
  return Array.from({ length: count }, () => generateRandomSeed());
};

/**
 * Get all available avatar styles for user selection
 */
export const getAvailableStyles = () => {
  return Object.keys(AVATAR_STYLES) as AvatarStyle[];
};

/**
 * Get display names for avatar styles
 */
export const getStyleDisplayName = (style: AvatarStyle): string => {
  const displayNames: Record<AvatarStyle, string> = {
    adventurer: "Adventurer",
    personas: "Personas",
    lorelei: "Fantasy",
    miniavs: "Minimal",
  };
  return displayNames[style] || style;
};

/**
 * Generate a preview URL for a specific style (for style selection UI)
 */
export const generateStylePreview = (style: AvatarStyle): string => {
  return generateAvatarUrl("preview", style, { size: 48 });
};

/**
 * Validate if a seed can generate a valid avatar
 * @param seed - Seed to validate
 * @param style - Style to test with
 */
export const validateAvatarSeed = async (
  seed: string,
  style: AvatarStyle = "adventurer"
): Promise<boolean> => {
  try {
    const url = generateAvatarUrl(seed, style);
    const response = await fetch(url, { method: "HEAD" });
    return response.ok;
  } catch {
    return false;
  }
};

/**
 * Generate a deterministic avatar from user data
 * Useful for creating consistent avatars from user identifiers
 */
export const generateDeterministicAvatar = (
  userIdentifier: string,
  style: AvatarStyle = "adventurer"
): string => {
  // Create a more deterministic seed from user identifier
  const seed = btoa(userIdentifier)
    .replace(/[^a-zA-Z0-9]/g, "")
    .toLowerCase();
  return generateAvatarUrl(seed, style);
};

/**
 * Color palette for avatar backgrounds that work well with anime styles
 */
export const AVATAR_BACKGROUNDS = [
  "#FF6B6B", // Coral
  "#4ECDC4", // Turquoise
  "#45B7D1", // Sky Blue
  "#96CEB4", // Mint
  "#FFEAA7", // Warm Yellow
  "#DDA0DD", // Plum
  "#98D8C8", // Seafoam
  "#F7DC6F", // Light Gold
  "#BB8FCE", // Lavender
  "#85C1E9", // Light Blue
] as const;

/**
 * Get a random background color from the predefined palette
 */
export const getRandomBackground = (): string => {
  return AVATAR_BACKGROUNDS[
    Math.floor(Math.random() * AVATAR_BACKGROUNDS.length)
  ];
};
