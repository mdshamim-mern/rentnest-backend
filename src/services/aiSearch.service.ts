export const parseSearchText = (text: string) => {
  const lowerText = text.toLowerCase();
  const extracted: any = {};

  const locationMatch = lowerText.match(/(banani|gulshan|dhanmondi|bashundhara|mirpur|mohammadpur|uttara|shyamoli|badda|khilgaon)/i);
  if (locationMatch) {
    extracted.location = locationMatch[1].charAt(0).toUpperCase() + locationMatch[1].slice(1);
  }

  const typeMatch = lowerText.match(/(apartment|villa|duplex|penthouse|townhouse|studio)/i);
  if (typeMatch) {
    extracted.propertyType = typeMatch[1].charAt(0).toUpperCase() + typeMatch[1].slice(1);
  }

  const bedMatch = lowerText.match(/(\d+)\s*(?:bed|bhk|bedroom)/i);
  if (bedMatch) {
    extracted.beds = bedMatch[1];
  }

  const priceMatch = lowerText.match(/(?:under|below|max)\s*(?:tk|bdt|\$)?\s*(\d+)(k|k| thousand)?/i);
  if (priceMatch) {
    let price = parseInt(priceMatch[1], 10);
    if (priceMatch[2] && priceMatch[2].toLowerCase().startsWith('k')) {
      price *= 1000;
    }
    extracted.maxPrice = price.toString();
  }

  return extracted;
};

export const AISearchService = {
  parseSearchText
};