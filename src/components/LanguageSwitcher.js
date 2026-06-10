import { useTranslation } from 'react-i18next';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिंदी' },
  { code: 'mr', label: 'मराठी' },
  { code: 'te', label: 'తెలుగు' },
  { code: 'ta', label: 'தமிழ்' },
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const current = i18n.language;

  return (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', padding: '8px' }}>
      {LANGUAGES.map(lang => (
        <button
          key={lang.code}
          onClick={() => i18n.changeLanguage(lang.code)}
          style={{
            padding: '6px 16px',
            borderRadius: '20px',
            border: current === lang.code ? '2px solid #4F46E5' : '2px solid #e2e8f0',
            background: current === lang.code ? '#4F46E5' : 'transparent',
            color: current === lang.code ? 'white' : 'inherit',
            cursor: 'pointer',
            fontWeight: current === lang.code ? 600 : 400,
            fontSize: '14px',
            transition: 'all 0.2s'
          }}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
}