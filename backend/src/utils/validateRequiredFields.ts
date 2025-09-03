import { ApiError } from './ApiError';

export function validateRequiredFields(
  fields: Record<string, any>,
  fieldNames: string[],
) {
  const missingFields = fieldNames.filter(
    (field) =>
      !fields[field] ||
      (typeof fields[field] === 'string' && fields[field].trim() === ''),
  );

  if (missingFields.length > 0) {
    throw new ApiError(400, 'All fields are required');
  }
}
