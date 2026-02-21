# Stamp Image Generation Prompts

Generate **square images (512x512px minimum)** for each stamp using an AI image generator (Midjourney, DALL-E, Stable Diffusion, etc.).

## Design Guidelines

- **Format**: Square, 512x512px or larger (will be scaled to 60x60 in app)
- **Style**: Minimalist icon/badge design, clean and recognizable
- **Background**: Match the spot's color OR use transparent background
- **Theme**: Japanese exploration/travel stamp aesthetic
- **Details**: Simple, bold, high contrast - must be clear at small sizes

---

## 1. Meriken Park (メリケンパーク)
**Color**: `#FF6B9D` (Pink)

**Prompt**:
```
A minimalist travel stamp icon for Meriken Park in Kobe, Japan. Features a stylized geometric waterfront park with modern sculptures and port buildings. Circular stamp badge design with clean lines. Pink color scheme (#FF6B9D). Simple, iconic, suitable for 60x60px display. Vector art style, flat design, high contrast.
```

**Alternative prompt**:
```
Japanese travel stamp badge, circular design, featuring Meriken Park's iconic modern red port buildings silhouette against water. Minimalist geometric shapes, pink (#FF6B9D) color palette, bold outlines, flat design suitable for small icon display.
```

---

## 2. Nankinmachi (南京町)
**Color**: `#C44569` (Deep Red)

**Prompt**:
```
A minimalist travel stamp icon for Nankinmachi Chinatown in Kobe. Features a traditional Chinese gate (paifang) or lantern design. Circular badge with bold geometric shapes. Red color scheme (#C44569). Simple iconic design, suitable for 60x60px. Flat vector art style, high contrast, clean lines.
```

**Alternative prompt**:
```
Japanese travel stamp for Kobe's Chinatown (Nankinmachi). Stylized Chinese gate entrance, geometric minimalist design, circular badge format, deep red (#C44569), bold outlines, flat design icon.
```

---

## 3. Kobe Port Tower (神戸ポートタワー)
**Color**: `#F8B500` (Golden Yellow)

**Prompt**:
```
A minimalist travel stamp icon featuring Kobe Port Tower's distinctive red hyperboloid lattice structure. Circular badge design with geometric tower silhouette. Golden yellow color scheme (#F8B500). Bold, iconic, suitable for 60x60px display. Flat vector art, high contrast, clean modernist style.
```

**Alternative prompt**:
```
Japanese travel stamp badge, Kobe Port Tower landmark, geometric hourglass-shaped tower silhouette, minimalist circular design, golden yellow (#F8B500), bold simple shapes, flat icon design.
```

---

## 4. Kitano Ijinkan (北野異人館)
**Color**: `#A8E6CF` (Mint Green)

**Prompt**:
```
A minimalist travel stamp icon for Kitano Ijinkan (foreign residences) in Kobe. Features a Victorian-style western house with peaked roof and weathervane. Circular badge with geometric building design. Mint green color scheme (#A8E6CF). Simple, iconic, suitable for 60x60px. Flat vector art, clean architectural lines.
```

**Alternative prompt**:
```
Japanese travel stamp for Kitano foreign houses, stylized European mansion silhouette, geometric minimalist design, circular badge, mint green (#A8E6CF), bold outlines, flat architectural icon.
```

---

## 5. Harborland (ハーバーランド)
**Color**: `#3DC1D3` (Cyan Blue)

**Prompt**:
```
A minimalist travel stamp icon for Kobe Harborland. Features a modern shopping complex with Ferris wheel and harbor elements. Circular badge with geometric shapes. Cyan blue color scheme (#3DC1D3). Bold, iconic design suitable for 60x60px display. Flat vector art, maritime theme, high contrast.
```

**Alternative prompt**:
```
Japanese travel stamp badge, Harborland Kobe, stylized Ferris wheel and waterfront buildings, geometric minimalist circular design, cyan blue (#3DC1D3), bold simple shapes, flat icon.
```

---

## 6. Nunobiki Falls (布引の滝)
**Color**: `#38ADA9` (Teal)

**Prompt**:
```
A minimalist travel stamp icon for Nunobiki Falls. Features a stylized waterfall cascading down with mountain silhouette and trees. Circular badge with geometric natural elements. Teal color scheme (#38ADA9). Simple, iconic, suitable for 60x60px. Flat vector art, nature theme, bold lines.
```

**Alternative prompt**:
```
Japanese travel stamp for Nunobiki waterfall, geometric waterfall streams, mountain landscape silhouette, minimalist circular badge design, teal (#38ADA9), bold natural shapes, flat icon.
```

---

## 7. Sorakuen Garden (相楽園)
**Color**: `#78E08F` (Light Green)

**Prompt**:
```
A minimalist travel stamp icon for Sorakuen Japanese Garden. Features traditional garden elements: pine tree, pond, and stone lantern. Circular badge with geometric zen garden design. Light green color scheme (#78E08F). Simple, iconic, suitable for 60x60px. Flat vector art, serene Japanese aesthetic.
```

**Alternative prompt**:
```
Japanese travel stamp badge, Sorakuen Garden, stylized bonsai pine tree and stone lantern, geometric minimalist circular design, light green (#78E08F), zen garden aesthetic, flat icon.
```

---

## 8. Kobe Animal Kingdom (神戸どうぶつ王国)
**Color**: `#FDCB6E` (Warm Yellow)

**Prompt**:
```
A minimalist travel stamp icon for Kobe Animal Kingdom. Features cute stylized animals (capybara, bird, or generic animal silhouettes). Circular badge with playful geometric shapes. Warm yellow color scheme (#FDCB6E). Bold, friendly design suitable for 60x60px. Flat vector art, kawaii aesthetic.
```

**Alternative prompt**:
```
Japanese travel stamp for Kobe Animal Kingdom, geometric cute animal silhouettes, minimalist circular badge, warm yellow (#FDCB6E), playful bold shapes, flat icon design, kawaii style.
```

---

## 9. Suma Beach (須磨海岸)
**Color**: `#6C5CE7` (Purple)

**Prompt**:
```
A minimalist travel stamp icon for Suma Beach. Features stylized waves, beach umbrella, and sunset over ocean. Circular badge with geometric coastal elements. Purple color scheme (#6C5CE7). Simple, iconic, suitable for 60x60px. Flat vector art, beach theme, high contrast.
```

**Alternative prompt**:
```
Japanese travel stamp badge, Suma Beach, geometric wave patterns and sun, minimalist circular seaside design, purple (#6C5CE7), bold ocean shapes, flat icon, coastal aesthetic.
```

---

## 10. Venus Bridge (ビーナスブリッジ)
**Color**: `#FD79A8` (Light Pink)

**Prompt**:
```
A minimalist travel stamp icon for Venus Bridge viewpoint. Features a stylized bridge arch with heart lock symbols and city skyline view. Circular badge with romantic geometric design. Light pink color scheme (#FD79A8). Bold, iconic, suitable for 60x60px. Flat vector art, romantic theme.
```

**Alternative prompt**:
```
Japanese travel stamp for Venus Bridge, geometric bridge arch with heart padlock, city skyline silhouette, minimalist circular badge, light pink (#FD79A8), romantic bold shapes, flat icon.
```

---

## Where to Save Generated Images

After generating the images, save them in the following structure:

```
/home/ec2-user/u/assets/stamps/
├── meriken-park.png
├── nankinmachi.png
├── kobe-port-tower.png
├── kitano-ijinkan.png
├── harborland.png
├── nunobiki-falls.png
├── sorakuen-garden.png
├── kobe-animal-kingdom.png
├── suma-beach.png
└── venus-bridge.png
```

**Image specifications:**
- Format: PNG with transparency (preferred) or solid background matching spot color
- Size: 512x512px minimum (will be automatically scaled to 60x60 in app)
- Quality: High resolution, clean edges
- Naming: Use exact spot IDs from above (lowercase, hyphenated)

---

## Implementation Instructions

After generating and saving all 10 stamp images:

1. Create the `assets/stamps/` directory if it doesn't exist
2. Save all 10 generated images with the exact filenames listed above
3. The code will need to be updated to use these images (I'll provide the code changes separately)

---

## Tips for AI Image Generation

- **Midjourney**: Add `--ar 1:1 --style minimalist --v 6` to prompts
- **DALL-E**: Use "square image, minimalist icon design" in prompts
- **Stable Diffusion**: Use "icon design, badge, flat vector art" style keywords
- **Test scaling**: Make sure icons are recognizable when scaled down to 60x60px
- **Consistency**: Generate all stamps in a single session for visual consistency
- **Export**: Export as PNG at 512x512px or higher with transparent or colored background
