import React from 'react';
import { Github, Twitter, Disc as Discord } from 'lucide-react';

const Footer: React.FC = React.memo(() => {
  return (
    <footer className="bg-[#0d1117] border-t border-[#30363d] py-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-white font-bold text-lg mb-3">Ua<span className="text-[#00a8ff]">Dep</span></h3>
            <p className="text-gray-400 mb-4">
              The future of esports betting. Connect your wallet, place bets on your favorite teams,
              and withdraw your winnings instantly using smart contracts.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Discord className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2">
              <li>
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
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Resources</h4>
            <ul className="space-y-2">
              <li>
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
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-[#30363d] mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} UaDep. All rights reserved.
          </p>
          <p className="text-gray-500 text-xs mt-2 md:mt-0">
            This is a demo application. Not intended for real betting.
          </p>
        </div>
      </div>
    </footer>
  );
});

export default Footer;