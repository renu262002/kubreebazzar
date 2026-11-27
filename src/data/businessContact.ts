export const OFFICIAL_BUSINESS_NAME = 'KubreeBazzar';

export const OFFICIAL_ADDRESS_LINES = [
  '4/2036, Vallam Main Road,',
  'Opposite RK Mahal,',
  'Vallam / Sengottai Area,',
  'Tamil Nadu – 627809,',
  'India.',
] as const;

export const OFFICIAL_ADDRESS_SINGLE_LINE =
  '4/2036, Vallam Main Road, Opposite RK Mahal, Vallam / Sengottai Area, Tamil Nadu – 627809, India.';

export const OFFICIAL_MAPS_DESTINATION =
  '4/2036, Vallam Main Road, Opposite RK Mahal, Vallam, Sengottai, Tamil Nadu 627809, India';

export const GOOGLE_MAPS_DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
  OFFICIAL_MAPS_DESTINATION
)}`;

export interface OfficialPhoneNumber {
  label: string;
  display: string;
  telHref: string;
}

export const OFFICIAL_PHONE_NUMBERS: readonly OfficialPhoneNumber[] = [
  {
    label: 'Primary Contact Number',
    display: '+91 75588 28671',
    telHref: 'tel:+917558828671',
  },
  {
    label: 'Secondary Contact Number',
    display: '+91 90255 28671',
    telHref: 'tel:+919025528671',
  },
] as const;
