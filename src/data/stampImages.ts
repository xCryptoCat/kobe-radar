// Map spot IDs to their stamp images
export const STAMP_IMAGES = {
  'meriken-park': require('../../assets/stamps/meriken-park.png'),
  'test-FamilyMart': require('../../assets/stamps/test-FamilyMart.png'),
  'nankinmachi': require('../../assets/stamps/nankinmachi.png'),
  'kobe-port-tower': require('../../assets/stamps/kobe-port-tower.png'),
  'kitano-ijinkan': require('../../assets/stamps/kitano-ijinkan.png'),
  'harborland': require('../../assets/stamps/harborland.png'),
  'nunobiki-falls': require('../../assets/stamps/nunobiki-falls.png'),
  'sorakuen-garden': require('../../assets/stamps/sorakuen-garden.png'),
  'kobe-animal-kingdom': require('../../assets/stamps/kobe-animal-kingdom.png'),
  'suma-beach': require('../../assets/stamps/suma-beach.png'),
  'venus-bridge': require('../../assets/stamps/venus-bridge.png'),
} as const;

export type StampImageKey = keyof typeof STAMP_IMAGES;
