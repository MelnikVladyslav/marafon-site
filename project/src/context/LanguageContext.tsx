import React, { createContext, useState, useContext, ReactNode } from 'react';

type Language = 'en' | 'uk';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation dictionaries
const translations: Record<Language, Record<string, string>> = {
  en: {
    // Header
    'tournaments': 'Tournaments',
    'my_bets': 'My Bets',
    'leaderboard': 'Leaderboard',
    'connect_wallet': 'Connect Wallet',
    'disconnect': 'Disconnect',
    'connect_wallet_to_place_bet': 'Connect Wallet to Place Bet',
    
    // Hero section
    'hero_title': 'Solana Esports Betting',
    'hero_subtitle': 'Connect your wallet, place bets on your favorite teams, and win SOL',
    'connect_wallet_to_start': 'Connect Wallet to Start',
    'connecting': 'Connecting...',
    
    // Tournament section
    'upcoming_tournaments': 'Upcoming Tournaments',
    'view_details': 'View Details',
    'place_bet': 'Place Bet',
    'starts': 'Starts',
    'prize_pool': 'Prize Pool',
    'teams': 'Teams',
    'view_full_leaderboard': 'View Full Leaderboard',
    'tournament_status_upcoming': 'UPCOMING',
    'tournament_status_live': 'LIVE',
    'tournament_status_completed': 'COMPLETED',
    'search_tournaments_teams': 'Search tournaments or teams...',
    'all_games': 'All Games',
    'all_status': 'All Status',
    'no_tournaments_found': 'No tournaments found matching your filters',
    
    // User bets section
    'your_bets': 'Your Bets',
    'no_bets': 'You have no active bets',
    'bet_on': 'Bet on',
    'potential_win': 'Potential Win',
    'status': 'Status',
    'withdraw': 'Withdraw',
    'processing': 'Processing...',
    'date_placed': 'Date Placed',
    
    // Token display
    'your_tokens': 'Your Tokens',
    'balance': 'Balance',
    'no_tokens_available': 'No tokens available.',
    'add_custom_token': 'Add Custom Token',
    
    // Program info
    'program_info': 'Program Info',
    'betting_program': 'Betting Program',
    'network': 'Network',
    'view_on_solana': 'View on Solana Explorer',
    
    // Tournament details
    'back_to_home': 'Back to Home',
    'back_to_tournaments': 'Back to Tournaments',
    'tournament_details': 'Tournament Details',
    'about_tournament': 'About Tournament',
    'game': 'Game',
    'format': 'Format',
    'participating_teams': 'Participating Teams',
    'team': 'Team',
    'team_id': 'Team ID',
    'odds': 'Odds',
    'action': 'Action',
    'bet_amount': 'Bet Amount',
    'place_your_bet': 'Place Your Bet',
    'confirm': 'Confirm',
    'cancel': 'Cancel',
    'vs': 'VS',
    'start_time': 'Start Time',
    'betting_stats': 'Betting Stats',
    'best_of_5': 'Best of 5',
    'total_bets_placed': 'Total Bets Placed',
    'total_volume': 'Total Volume',
    'average_bet_size': 'Average Bet Size',
    'betting_distribution': 'Betting Distribution',
    'recent_bets': 'Recent Bets',
    'tournament_description': '{tournamentName} is a premier esports event featuring top teams competing for glory and prizes. This tournament showcases the best talent in {gameName} and promises exciting matches and unforgettable moments for fans and bettors alike.',
    
    // Footer
    'about': 'About',
    'terms': 'Terms',
    'privacy': 'Privacy',
    'contact': 'Contact',
    'copyright': '© 2025 UaDep. All rights reserved.',
    'quick_links': 'Quick Links',
    'resources': 'Resources',
    'faq': 'FAQ',
    'footer_description': 'The future of esports betting. Connect your wallet, place bets on your favorite teams, and withdraw your winnings instantly using smart contracts.',
    'demo_disclaimer': 'This is a demo application. Not intended for real betting.',
    
    // Leaderboard
    'top_performers': 'Top performers in crypto esports betting',
    'player': 'Player',
    'winnings': 'Winnings',
    'win_rate': 'Win Rate',
    'how_to_join_leaderboard': 'How to Join the Leaderboard',
    'connect_wallet_place_bets': 'Connect your wallet and place bets on tournaments',
    'win_more_bets': 'Win more bets to increase your win rate',
    'leaderboard_updated_daily': 'The leaderboard is updated daily based on your performance',
    'top_performers_rewards': 'Top performers may receive special rewards and bonuses',
    
    // Misc
    'active': 'Active',
    'completed': 'Completed',
    'won': 'Won',
    'lost': 'Lost',
    'pending': 'Pending',
  },
  uk: {
    // Header
    'tournaments': 'Турніри',
    'my_bets': 'Мої ставки',
    'leaderboard': 'Таблиця лідерів',
    'connect_wallet': 'Підключити гаманець',
    'disconnect': 'Відключити',
    'connect_wallet_to_place_bet': 'Підключіть гаманець для ставки',
    
    // Hero section
    'hero_title': 'Ставки на кіберспорт на Solana',
    'hero_subtitle': 'Підключіть свій гаманець, робіть ставки на улюблені команди та вигравайте SOL',
    'connect_wallet_to_start': 'Підключіть гаманець, щоб почати',
    'connecting': 'Підключення...',
    
    // Tournament section
    'upcoming_tournaments': 'Майбутні турніри',
    'view_details': 'Деталі',
    'place_bet': 'Зробити ставку',
    'starts': 'Початок',
    'prize_pool': 'Призовий фонд',
    'teams': 'Команди',
    'view_full_leaderboard': 'Переглянути повну таблицю лідерів',
    'tournament_status_upcoming': 'ОЧІКУЄТЬСЯ',
    'tournament_status_live': 'НАЖИВО',
    'tournament_status_completed': 'ЗАВЕРШЕНО',
    'search_tournaments_teams': 'Пошук турнірів або команд...',
    'all_games': 'Всі ігри',
    'all_status': 'Всі статуси',
    'no_tournaments_found': 'Не знайдено турнірів, що відповідають вашим фільтрам',
    
    // User bets section
    'your_bets': 'Ваші ставки',
    'no_bets': 'У вас немає активних ставок',
    'bet_on': 'Ставка на',
    'potential_win': 'Потенційний виграш',
    'status': 'Статус',
    'withdraw': 'Вивести',
    'processing': 'Обробка...',
    'date_placed': 'Дата ставки',
    
    // Token display
    'your_tokens': 'Ваші токени',
    'balance': 'Баланс',
    'no_tokens_available': 'Токени недоступні.',
    'add_custom_token': 'Додати власний токен',
    
    // Program info
    'program_info': 'Інформація про програму',
    'betting_program': 'Програма ставок',
    'network': 'Мережа',
    'view_on_solana': 'Переглянути в Solana Explorer',
    
    // Tournament details
    'back_to_home': 'На головну',
    'back_to_tournaments': 'Назад до турнірів',
    'tournament_details': 'Деталі турніру',
    'about_tournament': 'Про турнір',
    'game': 'Гра',
    'format': 'Формат',
    'participating_teams': 'Команди-учасники',
    'team': 'Команда',
    'team_id': 'ID команди',
    'odds': 'Коефіцієнти',
    'action': 'Дія',
    'bet_amount': 'Сума ставки',
    'place_your_bet': 'Зробіть вашу ставку',
    'confirm': 'Підтвердити',
    'cancel': 'Скасувати',
    'vs': 'ПРОТИ',
    'start_time': 'Час початку',
    'betting_stats': 'Статистика ставок',
    'best_of_5': 'До 5 перемог',
    'total_bets_placed': 'Загальна кількість ставок',
    'total_volume': 'Загальний обсяг',
    'average_bet_size': 'Середній розмір ставки',
    'betting_distribution': 'Розподіл ставок',
    'recent_bets': 'Останні ставки',
    'tournament_description': '{tournamentName} - це преміальна кіберспортивна подія, в якій беруть участь найкращі команди, що змагаються за славу та призи. Цей турнір демонструє найкращі таланти в {gameName} і обіцяє захоплюючі матчі та незабутні моменти для фанатів і гравців.',
    
    // Footer
    'about': 'Про нас',
    'terms': 'Умови',
    'privacy': 'Конфіденційність',
    'contact': 'Контакти',
    'copyright': '© 2025 UaDep. Всі права захищені.',
    'quick_links': 'Швидкі посилання',
    'resources': 'Ресурси',
    'faq': 'Часті питання',
    'footer_description': 'Майбутнє ставок на кіберспорт. Підключіть свій гаманець, робіть ставки на улюблені команди та миттєво виводьте виграші за допомогою смарт-контрактів.',
    'demo_disclaimer': 'Це демонстраційна програма. Не призначена для реальних ставок.',
    
    // Leaderboard
    'top_performers': 'Найкращі гравці у крипто ставках на кіберспорт',
    'player': 'Гравець',
    'winnings': 'Виграші',
    'win_rate': 'Відсоток перемог',
    'how_to_join_leaderboard': 'Як потрапити до таблиці лідерів',
    'connect_wallet_place_bets': 'Підключіть гаманець та робіть ставки на турніри',
    'win_more_bets': 'Вигравайте більше ставок, щоб збільшити відсоток перемог',
    'leaderboard_updated_daily': 'Таблиця лідерів оновлюється щодня на основі ваших результатів',
    'top_performers_rewards': 'Найкращі гравці можуть отримати особливі нагороди та бонуси',
    
    // Misc
    'active': 'Активна',
    'completed': 'Завершена',
    'won': 'Виграна',
    'lost': 'Програна',
    'pending': 'В очікуванні',
  }
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');
  
  // Translation function
  const t = (key: string): string => {
    // Check if the key exists in the current language
    if (translations[language][key]) {
      return translations[language][key];
    }
    
    // Fallback to English if key doesn't exist in current language
    if (translations['en'][key]) {
      return translations['en'][key];
    }
    
    // Return the key itself if not found in any language
    return key;
  };
  
  const value = {
    language,
    setLanguage,
    t
  };
  
  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
