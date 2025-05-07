<<<<<<< Updated upstream
import React from 'react';
import { Github, Twitter, Disc as Discord } from 'lucide-react';
=======
import React from "react"
import { Github, Twitter } from "lucide-react"
import { useLanguage } from "../context/LanguageContext"
>>>>>>> Stashed changes

const Footer: React.FC = React.memo(() => {
  const { t } = useLanguage()
  return (
    <footer className="bg-[#0d1117] border-t border-[#30363d] py-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-white font-bold text-lg mb-3">Ua<span className="text-[#00a8ff]">Dep</span></h3>
            <p className="text-gray-400 mb-4">
<<<<<<< Updated upstream
              The future of esports betting. Connect your wallet, place bets on your favorite teams,
              and withdraw your winnings instantly using smart contracts.
=======
              {t('connectWalletPlaceBets')}
>>>>>>> Stashed changes
            </p>
            <div className="flex space-x-4">
              <a href="https://x.com/sha256_na_rosny?s=11" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://github.com/MelnikVladyslav/marafon-site" className="text-gray-400 hover:text-white transition-colors">
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">{t('quickLinks')}</h4>
            <ul className="space-y-2">
              <li>
<<<<<<< Updated upstream
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Tournaments</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">My Bets</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Leaderboard</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Smart Contracts</a>
=======
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  {t('tournaments')}
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  {t('myBets')}
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  {t('leaderboard')}
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  {t('smartContracts')}
                </a>
>>>>>>> Stashed changes
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">{t('resources')}</h4>
            <ul className="space-y-2">
              <li>
<<<<<<< Updated upstream
                <a href="#" className="text-gray-400 hover:text-white transition-colors">FAQ</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Support</a>
=======
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  {t('faq')}
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  {t('termsOfService')}
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  {t('privacyPolicy')}
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  {t('support')}
                </a>
>>>>>>> Stashed changes
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-[#30363d] mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
<<<<<<< Updated upstream
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} UaDep. All rights reserved.
          </p>
=======
          <p className="text-gray-400 text-sm">&copy; {new Date().getFullYear()} UaDep. {t('allRightsReserved')}</p>
>>>>>>> Stashed changes
          <p className="text-gray-500 text-xs mt-2 md:mt-0">
            {t('demoApplication')}
          </p>
        </div>
      </div>
    </footer>
  );
});

export default Footer;