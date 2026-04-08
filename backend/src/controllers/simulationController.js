import logger from '../utils/logger.js';
import crypto from 'crypto';

const simulationController = {
  /**
   * Get available simulation types
   */
  async getAvailableAttacks(req, res) {
    try {
      const simulations = [
        {
          id: 'phishing',
          name: 'Phishing Attack',
          description: 'Simulates deceptive emails/messages tricking users into revealing credentials',
          riskLevel: 'High',
          realWorldExample: 'Fake WhatsApp verification code requests',
          prevention: [
            'Verify sender email addresses',
            'Check for spelling/grammar errors',
            'Never click suspicious links',
            'Use email filtering tools'
          ]
        },
        {
          id: 'brute-force',
          name: 'Brute Force Attack',
          description: 'Simulates automated password guessing attempts',
          riskLevel: 'Medium',
          realWorldExample: 'Automated login attempts with common passwords',
          prevention: [
            'Use strong, unique passwords',
            'Enable account lockout after failed attempts',
            'Implement rate limiting',
            'Use CAPTCHA for suspicious activity'
          ]
        },
        {
          id: 'social-engineering',
          name: 'Social Engineering',
          description: 'Simulates psychological manipulation to gain access',
          riskLevel: 'Very High',
          realWorldExample: 'Impersonating tech support to get credentials',
          prevention: [
            'Verify identities before sharing information',
            'Be skeptical of urgent requests',
            'Use multi-factor authentication',
            'Security awareness training'
          ]
        },
        {
          id: 'malware',
          name: 'Malware/Spyware',
          description: 'Simulates malicious software capturing keystrokes/data',
          riskLevel: 'Critical',
          realWorldExample: 'Fake WhatsApp mods with spyware',
          prevention: [
            'Only install from official stores',
            'Keep software updated',
            'Use antivirus software',
            'Regular security scans'
          ]
        }
      ];
      
      logger.info('Retrieved available simulation types');
      
      res.status(200).json({
        success: true,
        simulations,
        educationalNote: 'These simulations demonstrate common attack vectors. Real attackers use these techniques.',
        disclaimer: 'This is for educational purposes only. No real attacks are performed.',
        learningObjectives: [
          'Recognize different attack types',
          'Understand how attacks work',
          'Learn prevention strategies',
          'Develop security awareness'
        ]
      });
      
    } catch (error) {
      logger.error(`Get attacks error: ${error.message}`);
      throw error;
    }
  },
  
  /**
   * Run phishing simulation
   */
  async runPhishingSimulation(req, res) {
    try {
      const { target } = req.body;
      
      logger.info(`Running phishing simulation for target: ${target}`);
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const simulationId = `phish_${crypto.randomBytes(4).toString('hex')}`;
      
      // Educational results
      const results = {
        simulationId,
        simulationType: 'phishing',
        target,
        timestamp: new Date().toISOString(),
        simulatedAttack: {
          method: 'Deceptive Email',
          sender: `"WhatsApp Support" <support@whatsapp-fake.com>`,
          subject: 'URGENT: Your account requires verification',
          contentPreview: 'Click here to verify your WhatsApp account...',
          fakeLink: 'https://whatsapp-verify-fake.com/login',
          redFlags: [
            'Suspicious sender email',
            'Urgent language creating pressure',
            'Generic greeting ("Dear User")',
            'Link to non-official domain',
            'Request for sensitive information'
          ]
        },
        detectionRate: `${85 + Math.floor(Math.random() * 10)}%`,
        userVulnerability: `${30 + Math.floor(Math.random() * 40)}%`,
        educationalInsights: {
          howItWorks: 'Phishing emails mimic legitimate services to trick users into entering credentials on fake websites',
          commonTargets: [
            'Login credentials',
            'Credit card information',
            'Personal identification',
            'Verification codes'
          ],
          statistics: [
            '91% of cyber attacks start with phishing',
            'Employees receive 14 malicious emails per year on average',
            'Phishing costs businesses $17,700 per minute globally'
          ]
        },
        preventionStrategies: [
          'Always check the sender\'s email address',
          'Hover over links to see the actual URL',
          'Look for HTTPS and security certificates',
          'Contact the company through official channels',
          'Use email security gateways'
        ]
      };
      
      logger.warn(`EDUCATIONAL DEMO: Phishing simulation completed`);
      logger.warn(`Real phishing attacks steal millions of credentials annually`);
      
      res.status(200).json({
        success: true,
        message: 'Phishing simulation completed',
        results,
        securityWarning: 'Phishing is the most common attack vector. Always verify before clicking.',
        resources: [
          'https://www.phishing.org/what-is-phishing',
          'https://www.consumer.ftc.gov/articles/how-recognize-and-avoid-phishing-scams',
          'https://www.cisa.gov/phishing'
        ]
      });
      
    } catch (error) {
      logger.error(`Phishing simulation error: ${error.message}`);
      throw error;
    }
  },
  
  /**
   * Run brute force simulation
   */
  async runBruteForceSimulation(req, res) {
    try {
      const { target } = req.body;
      
      logger.info(`Running brute force simulation for target: ${target}`);
      
      // Simulate password cracking attempts
      const attempts = Math.floor(Math.random() * 10000) + 1000;
      const simulatedPasswords = [
        'password123', '123456', 'qwerty', 'admin', 'welcome',
        'password', '123456789', 'password1', '12345', '12345678'
      ];
      
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const simulationId = `brute_${crypto.randomBytes(4).toString('hex')}`;
      
      const results = {
        simulationId,
        simulationType: 'brute-force',
        target,
        timestamp: new Date().toISOString(),
        simulatedAttack: {
          method: 'Dictionary Attack',
          attempts,
          passwordsTested: simulatedPasswords,
          rate: `${Math.floor(Math.random() * 1000) + 500} attempts/second`,
          duration: `${Math.floor(Math.random() * 10) + 5} minutes`,
          success: Math.random() > 0.8 // 20% chance of "success" for education
        },
        securityMetrics: {
          weakPasswordDetection: `${70 + Math.floor(Math.random() * 25)}%`,
          timeToCrack: {
            'password123': 'Instantly',
            'P@ssw0rd!': '2 hours',
            'MyDogName123': '3 days',
            'Xk8&$pL2*q9': 'Centuries'
          },
          commonWeaknesses: [
            'Short length (<8 characters)',
            'No special characters',
            'Dictionary words',
            'Personal information',
            'Password reuse'
          ]
        },
        educationalInsights: {
          realWorldTools: [
            'John the Ripper',
            'Hashcat',
            'Hydra',
            'Medusa'
          ],
          attackVectors: [
            'Online attacks (against live services)',
            'Offline attacks (against stolen hashes)',
            'Rainbow table attacks',
            'Credential stuffing'
          ],
          statistics: [
            '81% of breaches involve weak/stolen passwords',
            'The average user has 8 passwords with 1.7 variations',
            '59% of people reuse passwords across accounts'
          ]
        }
      };
      
      logger.warn(`EDUCATIONAL DEMO: Brute force simulation shows importance of strong passwords`);
      
      res.status(200).json({
        success: true,
        message: 'Brute force simulation completed',
        results,
        passwordRecommendations: [
          'Minimum 12 characters',
          'Mix of uppercase, lowercase, numbers, symbols',
          'Avoid dictionary words and personal info',
          'Use passphrases: "CorrectHorseBatteryStaple!"',
          'Use password managers to generate/store passwords'
        ],
        securityMeasures: [
          'Account lockout after 5 failed attempts',
          'Multi-factor authentication',
          'Rate limiting login attempts',
          'Password strength indicators',
          'Regular password changes'
        ]
      });
      
    } catch (error) {
      logger.error(`Brute force simulation error: ${error.message}`);
      throw error;
    }
  },
  
  /**
   * Run social engineering simulation
   */
  async runSocialEngineeringSimulation(req, res) {
    try {
      const { target } = req.body;
      
      logger.info(`Running social engineering simulation for target: ${target}`);
      
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      const simulationId = `social_${crypto.randomBytes(4).toString('hex')}`;
      
      const scenarios = [
        {
          type: 'Tech Support Scam',
          script: '"Hello, this is WhatsApp Security. We detected suspicious activity on your account. We need your verification code to secure it."',
          redFlags: [
            'Unsolicited contact',
            'Urgent problem requiring immediate action',
            'Request for verification codes',
            'Pressure to act quickly'
          ]
        },
        {
          type: 'Fake Prize/Giveaway',
          script: '"Congratulations! You won a WhatsApp premium subscription! Click here to claim your prize by verifying your account."',
          redFlags: [
            'Too good to be true offer',
            'Requires personal information',
            'Creates false urgency',
            'Links to suspicious websites'
          ]
        },
        {
          type: 'Impersonation',
          script: '"Hi, this is [Friend\'s Name]. I\'m locked out of my WhatsApp. Can you send me the verification code you just received?"',
          redFlags: [
            'Unexpected request from known contact',
            'Request for verification codes',
            'Unusual communication method',
            'Story creates sympathy/urgency'
          ]
        }
      ];
      
      const randomScenario = scenarios[Math.floor(Math.random() * scenarios.length)];
      
      const results = {
        simulationId,
        simulationType: 'social-engineering',
        target,
        timestamp: new Date().toISOString(),
        scenario: randomScenario,
        successRate: `${60 + Math.floor(Math.random() * 30)}%`,
        victimProfile: {
          mostVulnerable: [
            'Elderly individuals',
            'New technology users',
            'People under stress',
            'Those lacking security awareness'
          ],
          psychologicalTriggers: [
            'Fear (account compromise)',
            'Greed (prizes/money)',
            'Urgency (limited time offers)',
            'Helpfulness (helping "friends")',
            'Authority (impersonating officials)'
          ]
        },
        educationalInsights: {
          whyItWorks: 'Social engineering exploits human psychology rather than technical vulnerabilities',
          commonTechniques: [
            'Pretexting (creating false scenario)',
            'Baiting (offering something desirable)',
            'Quid pro quo (offering help for information)',
            'Tailgating (physical access through social means)'
          ],
          famousExamples: [
            'Kevin Mitnick\'s social engineering attacks',
            'Twitter Bitcoin scam (2020)',
            'Target data breach (started with HVAC vendor)'
          ]
        }
      };
      
      logger.warn(`EDUCATIONAL DEMO: Social engineering bypasses all technical security measures`);
      
      res.status(200).json({
        success: true,
        message: 'Social engineering simulation completed',
        results,
        defenseStrategies: [
          'Security awareness training',
          'Verification procedures for sensitive requests',
          '"Think before you click" mindset',
          'Report suspicious requests to security team',
          'Implement multi-factor authentication'
        ],
        redFlagChecklist: [
          'Is this request unexpected?',
          'Is there urgency/pressure?',
          'Are they asking for sensitive information?',
          'Can you verify through another channel?',
          'Does it feel wrong? (trust your instincts)'
        ]
      });
      
    } catch (error) {
      logger.error(`Social engineering simulation error: ${error.message}`);
      throw error;
    }
  },
  
  /**
   * Get simulation statistics
   */
  async getSimulationStats(req, res) {
    try {
      const stats = {
        globalCybercrime: {
          cost: '$8.4 trillion USD (2024 estimate)',
          growth: '15% year-over-year',
          attacksPerDay: '30,000+ websites hacked daily'
        },
        phishingStatistics: {
          attacksPerYear: 'Over 3.4 billion phishing emails',
          successRate: 'Approximately 5% (still devastating)',
          detectionTime: 'Average 295 days to detect'
        },
        passwordStatistics: {
          weakPasswords: '23 million accounts use "123456"',
          reuseRate: '65% of people reuse passwords',
          breachInvolvement: '81% of breaches involve weak/stolen passwords'
        },
        socialEngineering: {
          successRate: '70-90% for sophisticated attacks',
          costToBusiness: '$100,000+ per successful attack',
          humanFactor: '95% of cybersecurity breaches involve human error'
        },
        awarenessImpact: {
          trainingReduction: 'Security awareness training reduces risk by 70%',
          phishingClickRate: 'Trained employees: <5%, Untrained: >30%',
          costBenefit: 'Every $1 spent on training saves $10 in potential breaches'
        }
      };
      
      logger.info('Retrieved simulation statistics');
      
      res.status(200).json({
        success: true,
        statistics: stats,
        educationalMessage: 'These statistics show why security awareness is critical',
        actionItems: [
          'Implement regular security training',
          'Use password managers',
          'Enable multi-factor authentication',
          'Keep software updated',
          'Backup important data'
        ],
        resources: [
          'https://www.verizon.com/business/resources/reports/dbir/',
          'https://www.ibm.com/reports/data-breach',
          'https://www.cisa.gov/stopransomware',
          'https://www.phishtank.com/'
        ]
      });
      
    } catch (error) {
      logger.error(`Stats error: ${error.message}`);
      throw error;
    }
  }
};

export default simulationController;