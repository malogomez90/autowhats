import React, { useState, useEffect } from 'react';
import './index.css';

function App() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [simulationResult, setSimulationResult] = useState(null);
  const [educationalTips, setEducationalTips] = useState([]);

  // Educational tips about security
  const securityTips = [
    "Never share verification codes with anyone",
    "Enable two-factor authentication (2FA)",
    "Use strong, unique passwords for each account",
    "Be cautious of phishing links and messages",
    "Regularly update your apps and devices",
    "Check for HTTPS and security certificates",
    "Use password managers to avoid reuse",
    "Enable SIM lock with your mobile provider"
  ];

  useEffect(() => {
    // Show educational warning on load
    const warningBanner = document.getElementById('warning-banner');
    if (warningBanner) {
      warningBanner.style.display = 'block';
    }

    // Set random educational tips
    const randomTips = [...securityTips]
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    setEducationalTips(randomTips);

    return () => {
      if (warningBanner) {
        warningBanner.style.display = 'none';
      }
    };
  }, []);

  const handleSimulateLogin = async (e) => {
    e.preventDefault();
    
    if (!phoneNumber.trim()) {
      alert('Please enter a phone number for the simulation');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock simulation result
    const mockResult = {
      success: true,
      message: 'Simulated login attempt detected',
      simulatedAttack: 'Phishing Attempt',
      riskLevel: 'Medium',
      details: [
        `Simulated login attempt from IP: 192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        'Location: Unknown (VPN detected)',
        'Device: Windows 10 (simulated)',
        'Time: ' + new Date().toLocaleTimeString()
      ],
      protectionAdvice: [
        'This is how a phishing attack might look',
        'Real attackers try to steal login credentials',
        'Always verify the sender before clicking links',
        'Use official WhatsApp Web from whatsapp.com'
      ]
    };
    
    setSimulationResult(mockResult);
    setIsLoading(false);
  };

  const handleResetSimulation = () => {
    setPhoneNumber('');
    setSimulationResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-4 md:p-8">
      {/* Header */}
      <header className="max-w-6xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-primary-500">
              WhatsApp Security Simulator
            </h1>
            <p className="text-gray-300 mt-2">
              Educational demo showing common security threats - NOT a real hacking tool
            </p>
          </div>
          <div className="bg-red-900/30 border border-red-700 rounded-lg p-3 text-sm">
            <span className="font-bold">⚠️ IMPORTANT:</span> This is for education only
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Simulation */}
          <div className="lg:col-span-2 space-y-8">
            {/* Simulation Card */}
            <div className="card bg-gray-800/50 backdrop-blur-sm">
              <h2 className="text-2xl font-bold mb-6 text-secondary-500">
                Security Simulation
              </h2>
              
              <form onSubmit={handleSimulateLogin} className="space-y-6">
                <div>
                  <label className="block text-gray-300 mb-2" htmlFor="phone">
                    Enter a phone number for simulation:
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    placeholder="+1 234 567 8900"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="input-field"
                    disabled={isLoading}
                  />
                  <p className="text-gray-400 text-sm mt-2">
                    Note: This number is not stored or used for real communication
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary w-full py-3 text-lg"
                >
                  {isLoading ? (
                    <>
                      <span className="animate-spin inline-block mr-2">⟳</span>
                      Running Simulation...
                    </>
                  ) : (
                    'Start Security Simulation'
                  )}
                </button>
              </form>

              {/* Simulation Results */}
              {simulationResult && (
                <div className="mt-8 p-4 bg-gray-900/50 rounded-lg border border-gray-700 animate-fade-in">
                  <h3 className="text-xl font-bold mb-4 text-green-500">
                    Simulation Results
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="p-3 bg-gray-800/50 rounded">
                      <h4 className="font-bold text-yellow-500">Simulated Attack:</h4>
                      <p>{simulationResult.simulatedAttack}</p>
                    </div>
                    
                    <div className="p-3 bg-gray-800/50 rounded">
                      <h4 className="font-bold text-red-500">Risk Level:</h4>
                      <p>{simulationResult.riskLevel}</p>
                    </div>
                    
                    <div className="p-3 bg-gray-800/50 rounded">
                      <h4 className="font-bold text-blue-500">Details:</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {simulationResult.details.map((detail, index) => (
                          <li key={index} className="text-gray-300">{detail}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="p-3 bg-gray-800/50 rounded">
                      <h4 className="font-bold text-green-500">Protection Advice:</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {simulationResult.protectionAdvice.map((advice, index) => (
                          <li key={index} className="text-gray-300">{advice}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleResetSimulation}
                    className="btn-secondary mt-6"
                  >
                    Run Another Simulation
                  </button>
                </div>
              )}
            </div>

            {/* Educational Content */}
            <div className="card bg-gray-800/50 backdrop-blur-sm">
              <h2 className="text-2xl font-bold mb-6 text-primary-500">
                How This Simulation Works
              </h2>
              
              <div className="space-y-4">
                <p className="text-gray-300">
                  This educational tool simulates common security threats to help you understand:
                </p>
                
                <ul className="list-disc list-inside space-y-2 text-gray-300">
                  <li>How phishing attacks attempt to steal credentials</li>
                  <li>What information attackers might try to access</li>
                  <li>How to recognize suspicious login attempts</li>
                  <li>Best practices for protecting your accounts</li>
                </ul>
                
                <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4 mt-4">
                  <h4 className="font-bold text-blue-400 mb-2">Remember:</h4>
                  <p className="text-gray-300">
                    Real WhatsApp uses end-to-end encryption and cannot be "hacked" through methods like this.
                    This simulation is purely educational to help you stay safe online.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right column - Educational Tips */}
          <div className="space-y-8">
            {/* Security Tips */}
            <div className="card bg-gray-800/50 backdrop-blur-sm">
              <h2 className="text-2xl font-bold mb-6 text-green-500">
                Security Tips
              </h2>
              
              <div className="space-y-4">
                {educationalTips.map((tip, index) => (
                  <div 
                    key={index}
                    className="p-3 bg-gray-900/50 rounded-lg border border-gray-700 hover:border-green-500 transition duration-200"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-green-500 font-bold">✓</span>
                      <span className="text-gray-300">{tip}</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <button
                onClick={() => {
                  const randomTips = [...securityTips]
                    .sort(() => Math.random() - 0.5)
                    .slice(0, 3);
                  setEducationalTips(randomTips);
                }}
                className="btn-secondary mt-6 w-full"
              >
                Show More Tips
              </button>
            </div>

            {/* Quick Stats */}
            <div className="card bg-gray-800/50 backdrop-blur-sm">
              <h2 className="text-2xl font-bold mb-6 text-yellow-500">
                Security Statistics
              </h2>
              
              <div className="space-y-4">
                <div className="p-3 bg-gray-900/50 rounded">
                  <p className="text-gray-400">Phishing attacks increased</p>
                  <p className="text-2xl font-bold text-yellow-500">+65%</p>
                  <p className="text-sm text-gray-500">in 2023</p>
                </div>
                
                <div className="p-3 bg-gray-900/50 rounded">
                  <p className="text-gray-400">Accounts with 2FA are</p>
                  <p className="text-2xl font-bold text-green-500">99.9%</p>
                  <p className="text-sm text-gray-500">less likely to be compromised</p>
                </div>
                
                <div className="p-3 bg-gray-900/50 rounded">
                  <p className="text-gray-400">Average time to detect a breach</p>
                  <p className="text-2xl font-bold text-red-500">207 days</p>
                  <p className="text-sm text-gray-500">Stay vigilant!</p>
                </div>
              </div>
            </div>

            {/* Resources */}
            <div className="card bg-gray-800/50 backdrop-blur-sm">
              <h2 className="text-2xl font-bold mb-6 text-blue-500">
                Learning Resources
              </h2>
              
              <div className="space-y-3">
                <a 
                  href="https://www.whatsapp.com/security"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-3 bg-gray-900/50 rounded hover:bg-gray-800 transition duration-200"
                >
                  <span className="font-bold text-blue-400">🔒</span>
                  <span className="ml-2">WhatsApp Security Features</span>
                </a>
                
                <a 
                  href="https://www.consumer.ftc.gov/articles/how-recognize-and-avoid-phishing-scams"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-3 bg-gray-900/50 rounded hover:bg-gray-800 transition duration-200"
                >
                  <span className="font-bold text-green-400">📚</span>
                  <span className="ml-2">FTC: Avoid Phishing Scams</span>
                </a>
                
                <a 
                  href="https://www.cisa.gov/secure-our-world"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-3 bg-gray-900/50 rounded hover:bg-gray-800 transition duration-200"
                >
                  <span className="font-bold text-red-400">🛡️</span>
                  <span className="ml-2">CISA Cybersecurity Tips</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="max-w-6xl mx-auto mt-12 pt-8 border-t border-gray-700">
        <div className="text-center text-gray-400">
          <p className="mb-2">
            <strong>⚠️ DISCLAIMER:</strong> This is an educational simulation only. No real attacks are performed.
          </p>
          <p className="text-sm">
            This tool is designed to teach cybersecurity awareness. Always use technology ethically and legally.
          </p>
          <p className="text-xs mt-4 text-gray-500">
            © {new Date().getFullYear()} Security Education Demo • Built for educational purposes
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;