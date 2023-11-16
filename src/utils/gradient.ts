function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}

export function generateDarkGradient(userId: string): string {
  const seed = hashCode(userId);
  const random = (s: number) => {
    s = Math.sin(s) * 10000;
    return s - Math.floor(s);
  };

  // Generate a base hue and a complementary or analogous hue for harmony
  const baseHue = Math.floor(random(seed) * 360);
  const complementaryHue = (baseHue + 180) % 360;

  // Set lower lightness values for darker colors
  const lightness = 30; // Adjust this value to control the darkness (lower is darker)

  // Generate colors with controlled saturation and the lower lightness for darkness
  const color1 = `hsl(${baseHue}, 70%, ${lightness}%)`;
  const color2 = `hsl(${complementaryHue}, 70%, ${lightness}%)`;

  return `linear-gradient(${color1}, ${color2})`;
}
