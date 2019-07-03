import i18n from 'react-native-i18n';
import en_US from './locales/en_US';

i18n.fallbacks = true;

i18n.translations = {
  en: en_US,
  "en-US": en_US,
};

export default i18n;
