import { language } from '@language/index';

/**
 * Translate category name from Chinese to current language
 * @param categoryName - The category name (possibly in Chinese)
 * @returns Translated category name or original if no translation exists
 */
export function translateCategoryName(categoryName: string): string {
  // Create a mapping key for the language file
  const translationKey = `category_${categoryName}`;

  try {
    // Try to get translation from language file
    const translated = language.val(translationKey);

    // If translation is found (not "not found"), return it
    if (translated && translated !== 'not found') {
      return translated;
    }
  } catch (error) {
    // If any error occurs, fall back to original name
    console.warn(`Translation failed for category: ${categoryName}`, error);
  }

  // Return original name if no translation exists
  return categoryName;
}
