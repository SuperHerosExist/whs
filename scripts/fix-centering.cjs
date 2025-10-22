const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'pages', 'Home.tsx');
let content = fs.readFileSync(filePath, 'utf8');

console.log('🔧 Fixing centering issues in Home.tsx...');

// 1. Replace old background with ESPN grid pattern
content = content.replace(
  `      <section className="relative bg-black text-white overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 text-7xl">🎳</div>
          <div className="absolute bottom-20 right-10 text-7xl">🎯</div>
        </div>`,
  `      <section className="relative bg-black text-white overflow-hidden">
        {/* ESPN Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-900 to-black opacity-90" />`
);

// 2. Update "BOWLING TEAM" to yellow badge
content = content.replace(
  `          <div className="text-xl md:text-2xl font-bold opacity-90 mb-12">
            BOWLING TEAM
          </div>`,
  `          {/* Yellow Badge Subtitle */}
          <div className="text-center mb-10 animate-fade-in" style={{animationDelay: '0.1s'}}>
            <div className="inline-block bg-gradient-to-r from-yellow-500 to-yellow-600 text-black px-6 py-2 rounded-full font-bold text-sm uppercase tracking-widest shadow-glow">
              Bowling Team
            </div>
          </div>`
);

// 3. Update tiger logo to have glow effect
content = content.replace(
  `          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <img src="/assets/logos/tiger-logo.jpg" alt="Willard Tigers" className="h-24 md:h-32 rounded-full shadow-2xl ring-4 ring-yellow-500 ring-opacity-50" />
          </div>`,
  `          {/* Tiger Logo with Glow */}
          <div className="mb-12 flex justify-center animate-scale-in">
            <div className="relative group">
              <div className="absolute inset-0 bg-yellow-500 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 rounded-full" />
              <img
                src="/assets/logos/tiger-logo.jpg"
                alt="Willard Tigers"
                className="relative h-28 md:h-36 rounded-full shadow-2xl ring-4 ring-yellow-500/30 group-hover:ring-yellow-500/60 transition-all duration-300 group-hover:scale-105"
              />
            </div>
          </div>`
);

// 4. Fix CTA section - fully centered with all text centered
content = content.replace(
  `      {/* ⚡ CALL TO ACTION */}
      <section className="w-full bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-willard-black via-willard-grey-900 to-willard-grey-800 rounded-2xl p-12 md:p-16 text-center text-white shadow-xl relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-1/2 left-1/4 text-8xl">🎳</div>
              <div className="absolute top-1/4 right-1/4 text-8xl">⚡</div>
            </div>

            <div className="relative z-10">
              <div className="inline-block bg-yellow-500 text-willard-black px-5 py-2 rounded-full text-xs font-black uppercase tracking-wide mb-6">
                NEW MEMBERS WELCOME
              </div>
              <h3 className="text-3xl md:text-4xl font-black mb-6">
                Ready to Join<br />The Tigers?
              </h3>
              <p className="text-xl md:text-2xl mb-3 font-bold max-w-3xl mx-auto">
                {practiceSchedule.getScheduleText()}
              </p>
              <p className="text-sm md:text-base mb-8 opacity-75 max-w-2xl mx-auto">
                {practiceSchedule.getDetailsText()}
              </p>
              <div className="flex justify-center">
                <button
                  onClick={() => window.location.href = '/contact'}
                  className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-willard-black px-10 py-4 rounded-full font-black text-lg hover:from-yellow-400 hover:to-yellow-500 hover:scale-105 transition-all inline-flex items-center gap-3 shadow-xl"
                >
                  Join the Team
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>`,
  `      {/* ⚡ CALL TO ACTION - FULLY CENTERED */}
      <section className="w-full bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-willard-black via-willard-grey-900 to-willard-grey-800 rounded-2xl p-12 md:p-16 text-white shadow-xl relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-1/2 left-1/4 text-8xl">🎳</div>
              <div className="absolute top-1/4 right-1/4 text-8xl">⚡</div>
            </div>

            <div className="relative z-10 text-center w-full">
              <div className="flex justify-center mb-6">
                <div className="inline-block bg-yellow-500 text-willard-black px-5 py-2 rounded-full text-xs font-black uppercase tracking-wide">
                  NEW MEMBERS WELCOME
                </div>
              </div>
              <h3 className="text-3xl md:text-4xl font-black mb-6 text-center w-full">
                Ready to Join<br />The Tigers?
              </h3>
              <p className="text-xl md:text-2xl mb-3 font-bold max-w-3xl mx-auto text-center w-full">
                {practiceSchedule.getScheduleText()}
              </p>
              <p className="text-sm md:text-base mb-8 opacity-75 max-w-2xl mx-auto text-center w-full">
                {practiceSchedule.getDetailsText()}
              </p>
              <div className="flex justify-center w-full">
                <button
                  onClick={() => window.location.href = '/contact'}
                  className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-willard-black px-10 py-4 rounded-full font-black text-lg hover:from-yellow-400 hover:to-yellow-500 hover:scale-105 transition-all inline-flex items-center gap-3 shadow-xl"
                >
                  Join the Team
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>`
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ Fixed all centering issues in Home.tsx');
