export function formatPhoneNumber(phoneNumber: number): string {
  // Remove all non-numeric characters
  const cleaned = phoneNumber.toString().replace(/\D/g, '');
  
  // Format as (XXX) XXX-XXXX
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  
  return phoneNumber.toString();
} 