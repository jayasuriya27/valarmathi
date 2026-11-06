// Details shown in the hover tooltip and the popup. Key = finish slug (same slug is stored in products.finishes in the DB).
// Add or change a finish here. The image is in public/images/finishes.
export const FINISH_DETAILS = {
  mahogany: {
    name: 'Mahogany',
    image: '/images/finishes/mahogany.webp',
    badge: 'Popular Finish',
    summary: 'Rich reddish-brown appearance with a natural wooden texture. Suitable for classic and premium furniture designs.',
    features: [
      ['Colour', 'Deep reddish brown'],
      ['Style', 'Classic and elegant'],
      ['Texture', 'Visible wood-grain appearance'],
      ['Suitable for', 'Beds, wardrobes, dining tables and cabinets'],
    ],
    care: [
      'Clean using a soft microfiber cloth.',
      'Avoid harsh chemical cleaners.',
      'Wipe liquid spills immediately.',
      'Avoid prolonged direct sunlight.',
    ],
  },
  'dark-choco': {
    name: 'Dark Choco',
    image: '/images/finishes/dark-choco.webp',
    summary: 'Deep chocolate-brown laminate with a smooth, rich look. Gives a bold and modern feel to any room.',
    features: [['Colour', 'Dark chocolate brown'], ['Style', 'Modern and bold'], ['Texture', 'Smooth with fine grain'], ['Suitable for', 'TV units, wardrobes and study tables']],
    care: ['Clean using a soft microfiber cloth.', 'Avoid harsh chemical cleaners.', 'Wipe liquid spills immediately.', 'Avoid prolonged direct sunlight.'],
  },
  'flower-wenge-dark': {
    name: 'Flower Wenge Dark',
    image: '/images/finishes/flower-wenge-dark.webp',
    summary: 'Dark wenge tone with a flowing grain pattern. Looks premium and hides daily wear well.',
    features: [['Colour', 'Dark brown with black grain'], ['Style', 'Premium and contemporary'], ['Texture', 'Flowing wood-grain pattern'], ['Suitable for', 'Wardrobes, cots and office tables']],
    care: ['Clean using a soft microfiber cloth.', 'Avoid harsh chemical cleaners.', 'Wipe liquid spills immediately.', 'Avoid prolonged direct sunlight.'],
  },
  'light-choco': {
    name: 'Light Choco',
    image: '/images/finishes/light-choco.webp',
    summary: 'Soft milk-chocolate brown that keeps the room warm and bright. Easy to match with most wall colours.',
    features: [['Colour', 'Light chocolate brown'], ['Style', 'Warm and simple'], ['Texture', 'Smooth wood look'], ['Suitable for', 'Wardrobes, pooja racks and cabinets']],
    care: ['Clean using a soft microfiber cloth.', 'Avoid harsh chemical cleaners.', 'Wipe liquid spills immediately.', 'Avoid prolonged direct sunlight.'],
  },
  'taj-marble': {
    name: 'Taj Marble',
    image: '/images/finishes/taj-marble.webp',
    summary: 'Off-white marble-style laminate with soft veins. Gives a clean, elegant and spacious look.',
    features: [['Colour', 'Off-white with light veins'], ['Style', 'Elegant and clean'], ['Texture', 'Glossy marble pattern'], ['Suitable for', 'Pooja units, TV panels and kitchen shutters']],
    care: ['Clean using a soft microfiber cloth.', 'Avoid harsh chemical cleaners.', 'Wipe liquid spills immediately.', 'Avoid scratching the glossy surface.'],
  },
  'rolex-ash-light': {
    name: 'Rolex Ash Light',
    image: '/images/finishes/rolex-ash-light.webp',
    summary: 'Light ash-grey wood finish with a calm, modern look. Makes small rooms feel open.',
    features: [['Colour', 'Light ash grey'], ['Style', 'Modern and minimal'], ['Texture', 'Soft ash grain'], ['Suitable for', 'Wardrobes, tables and TV units']],
    care: ['Clean using a soft microfiber cloth.', 'Avoid harsh chemical cleaners.', 'Wipe liquid spills immediately.', 'Avoid prolonged direct sunlight.'],
  },
  'ralph-wood-light': {
    name: 'Ralph Wood Light',
    image: '/images/finishes/ralph-wood-light.webp',
    summary: 'Light natural wood tone with a fresh, airy feel. Works well in bedrooms and living rooms.',
    features: [['Colour', 'Light natural wood'], ['Style', 'Fresh and natural'], ['Texture', 'Light wood grain'], ['Suitable for', 'Cots, wardrobes and dressing tables']],
    care: ['Clean using a soft microfiber cloth.', 'Avoid harsh chemical cleaners.', 'Wipe liquid spills immediately.', 'Avoid prolonged direct sunlight.'],
  },
  'rolex-ash-dark': {
    name: 'Rolex Ash Dark',
    image: '/images/finishes/rolex-ash-dark.webp',
    summary: 'Deep ash-grey wood finish with a strong, stylish look. A good match for modern interiors.',
    features: [['Colour', 'Dark ash grey'], ['Style', 'Modern and stylish'], ['Texture', 'Ash wood grain'], ['Suitable for', 'Wardrobes, TV units and office tables']],
    care: ['Clean using a soft microfiber cloth.', 'Avoid harsh chemical cleaners.', 'Wipe liquid spills immediately.', 'Avoid prolonged direct sunlight.'],
  },
  'aroma-walnut': {
    name: 'Aroma Walnut',
    image: '/images/finishes/aroma-walnut.webp',
    summary: 'Warm walnut-brown finish with a natural wood grain. A classic choice that suits every room.',
    features: [['Colour', 'Warm walnut brown'], ['Style', 'Classic and cosy'], ['Texture', 'Natural walnut grain'], ['Suitable for', 'Office desks, wardrobes, TV units and cots']],
    care: ['Clean using a soft microfiber cloth.', 'Avoid harsh chemical cleaners.', 'Wipe liquid spills immediately.', 'Avoid prolonged direct sunlight.'],
  },
  'light-pine': {
    name: 'Light Pine',
    image: '/images/finishes/light-pine.webp',
    summary: 'Warm golden pine wood look with natural knots and a flowing grain. Makes a room feel bright, open and welcoming.',
    features: [['Colour', 'Light golden honey'], ['Style', 'Warm, natural and bright'], ['Texture', 'Natural pine grain with small knots'], ['Suitable for', 'Cots, wardrobes, kids rooms and study tables']],
    care: ['Clean using a soft microfiber cloth.', 'Avoid harsh chemical cleaners.', 'Wipe liquid spills immediately.', 'Avoid prolonged direct sunlight.'],
  },
}

export const FINISH_SLUGS = Object.keys(FINISH_DETAILS)
