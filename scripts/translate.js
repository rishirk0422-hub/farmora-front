const fs = require('fs');
const path = require('path');

const LANGUAGES = ['hi', 'mr', 'te', 'ta'];
const LIBRETRANSLATE_URL = 'https://libretranslate.com/translate';

async function translateText(text, targetLang) {
  try {
    const res = await fetch(LIBRETRANSLATE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        q: text,
        source: 'en',
        target: targetLang,
        format: 'text',
        api_key: ''
      })
    });
    const data = await res.json();
    if (data.translatedText) return data.translatedText;
    console.warn(`No translation for "${text}" → ${targetLang}`);
    return text;
  } catch (e) {
    console.warn(`Failed: "${text}" → ${targetLang}, keeping English`);
    return text;
  }
}

async function translateObject(obj, lang) {
  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      result[key] = await translateText(value, lang);
      console.log(`  [${lang}] ${key}: "${value}" → "${result[key]}"`);
    } else if (typeof value === 'object') {
      result[key] = await translateObject(value, lang);
    }
  }
  return result;
}

async function main() {
  const enPath = path.join(__dirname, '../public/locales/en/translation.json');
  const en = JSON.parse(fs.readFileSync(enPath, 'utf-8'));
  const localesRoot = path.join(__dirname, '../public/locales');

  for (const lang of LANGUAGES) {
    console.log(`\nTranslating to ${lang}...`);
    const translated = await translateObject(en, lang);
    const dir = path.join(localesRoot, lang);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(
      path.join(dir, 'translation.json'),
      JSON.stringify(translated, null, 2)
    );
    console.log(`Done: ${lang}`);
  }

  console.log('\nAll translations complete!');
}

main();