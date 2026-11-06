// Interiors we do at the customer's home. Used by the header menu, the home page and search.
// id      -> the filter on /interiors (/interiors#bedroom)
// product -> slug of the house-interior photo to show for it
// category -> or the category whose photo to show
export const rooms = [
  { id: 'kitchen', label: 'Modular Kitchen', category: 'modular-kitchen', keywords: 'kitchen modular cooking cabinets chimney interior', text: 'Planned around your space, storage and cooking style.' },
  { id: 'living-room', label: 'Living Room', product: 'house-interior-showcase', keywords: 'living room hall drawing interior home house', text: 'Warm, modern living spaces made to measure.' },
  { id: 'tv-wall', label: 'TV Wall', product: 'living-room-tv-feature-wall', keywords: 'tv wall feature panel television interior home house', text: 'Wooden panelling with storage around your TV.' },
  { id: 'bedroom', label: 'Bedroom', product: 'bedroom-interior', keywords: 'bedroom bed wardrobe interior home house', text: 'Wardrobes, cots and finishes planned around your room.' },
  { id: 'wardrobes', label: 'Wardrobes', category: 'wardrobe', keywords: 'wardrobe wardrobes cupboard almirah storage interior home house', text: 'Built-to-measure wardrobes for every room.' },
  { id: 'home-office', label: 'Home Office', product: 'home-office-interior', keywords: 'home office study desk work interior house', text: 'Desks, storage and finishes for your workspace.' },
]

// Header menu: the rooms under "Home Interiors" (the kitchen has its own heading)
export const roomLinks = rooms.filter((r) => r.id !== 'kitchen').map((r) => [r.label, r.id])
