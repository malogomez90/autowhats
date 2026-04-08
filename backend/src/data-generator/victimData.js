// Spanish victim data generator for WhatsApp Pentest Simulator
// Generates realistic synthetic Spanish user data

// Spanish names database
const SPANISH_NAMES = {
  male: [
    'Antonio', 'José', 'Manuel', 'Francisco', 'David', 'Juan', 'Javier', 'Daniel', 'José Antonio', 'José Luis',
    'Carlos', 'Jesús', 'Alejandro', 'Miguel', 'Rafael', 'Pedro', 'Ángel', 'Sergio', 'Fernando', 'Luis',
    'Pablo', 'Jorge', 'Alberto', 'Rubén', 'Enrique', 'Ramón', 'Víctor', 'Ignacio', 'Óscar', 'Andrés',
    'Diego', 'Adrián', 'Joaquín', 'Santiago', 'Vicente', 'Eduardo', 'Mario', 'Roberto', 'Jaime', 'Francisco Javier'
  ],
  female: [
    'María', 'Carmen', 'Ana', 'Isabel', 'Dolores', 'Pilar', 'Josefa', 'Teresa', 'Rosa', 'Cristina',
    'Angela', 'Laura', 'Antonia', 'Elena', 'Francisca', 'Lucía', 'Mercedes', 'Manuela', 'Patricia', 'Paula',
    'Sandra', 'Raquel', 'Sara', 'Beatriz', 'Nuria', 'Silvia', 'Rocío', 'Montserrat', 'Julia', 'Alba',
    'Marta', 'Irene', 'Andrea', 'Claudia', 'Eva', 'Marina', 'Concepción', 'Lourdes', 'Miriam', 'Noelia'
  ],
  surnames: [
    'García', 'González', 'Rodríguez', 'Fernández', 'López', 'Martínez', 'Sánchez', 'Pérez', 'Gómez', 'Martín',
    'Jiménez', 'Ruiz', 'Hernández', 'Díaz', 'Moreno', 'Muñoz', 'Álvarez', 'Romero', 'Alonso', 'Gutiérrez',
    'Navarro', 'Torres', 'Domínguez', 'Vázquez', 'Ramos', 'Gil', 'Ramírez', 'Serrano', 'Blanco', 'Molina',
    'Morales', 'Suárez', 'Ortega', 'Delgado', 'Castro', 'Ortiz', 'Rubio', 'Marín', 'Sanz', 'Núñez',
    'Iglesias', 'Medina', 'Garrido', 'Cortés', 'Castillo', 'Santos', 'Lozano', 'Guerrero', 'Cano', 'Prieto'
  ]
};

// Spanish cities and regions
const SPANISH_LOCATIONS = [
  { city: 'Madrid', region: 'Comunidad de Madrid', population: '3.2M', coordinates: { lat: 40.4168, lon: -3.7038 } },
  { city: 'Barcelona', region: 'Cataluña', population: '1.6M', coordinates: { lat: 41.3851, lon: 2.1734 } },
  { city: 'Valencia', region: 'Comunidad Valenciana', population: '800K', coordinates: { lat: 39.4699, lon: -0.3763 } },
  { city: 'Sevilla', region: 'Andalucía', population: '700K', coordinates: { lat: 37.3891, lon: -5.9845 } },
  { city: 'Zaragoza', region: 'Aragón', population: '675K', coordinates: { lat: 41.6488, lon: -0.8891 } },
  { city: 'Málaga', region: 'Andalucía', population: '575K', coordinates: { lat: 36.7194, lon: -4.4200 } },
  { city: 'Murcia', region: 'Región de Murcia', population: '450K', coordinates: { lat: 37.9922, lon: -1.1307 } },
  { city: 'Palma de Mallorca', region: 'Islas Baleares', population: '415K', coordinates: { lat: 39.5696, lon: 2.6502 } },
  { city: 'Las Palmas', region: 'Canarias', population: '380K', coordinates: { lat: 28.1235, lon: -15.4363 } },
  { city: 'Bilbao', region: 'País Vasco', population: '350K', coordinates: { lat: 43.2630, lon: -2.9350 } },
  { city: 'Alicante', region: 'Comunidad Valenciana', population: '335K', coordinates: { lat: 38.3452, lon: -0.4810 } },
  { city: 'Córdoba', region: 'Andalucía', population: '325K', coordinates: { lat: 37.8882, lon: -4.7794 } },
  { city: 'Valladolid', region: 'Castilla y León', population: '300K', coordinates: { lat: 41.6523, lon: -4.7245 } },
  { city: 'Vigo', region: 'Galicia', population: '295K', coordinates: { lat: 42.2406, lon: -8.7207 } },
  { city: 'Gijón', region: 'Asturias', population: '275K', coordinates: { lat: 43.5322, lon: -5.6611 } }
];

// Common Spanish phrases for chat simulation
const SPANISH_PHRASES = {
  greetings: ['Hola', 'Buenos días', 'Buenas tardes', '¿Qué tal?', '¿Cómo estás?', '¿Qué pasa?'],
  responses: ['Bien, gracias', 'Todo bien', 'Por aquí', 'Regular', 'Fenomenal', 'Cansado/a'],
  questions: ['¿Qué haces?', '¿Dónde estás?', '¿Quedamos?', '¿Has visto...?', '¿Sabes algo de...?'],
  casual: ['Vale', 'De acuerdo', 'Claro', 'Perfecto', 'Genial', 'Ostras', 'Guay', 'Flipante'],
  emojis: ['😊', '😂', '❤️', '👍', '👌', '😎', '🤔', '😅', '🙏', '💪']
};

// Generate random Spanish name
const generateSpanishName = () => {
  const gender = Math.random() > 0.5 ? 'male' : 'female';
  const firstName = SPANISH_NAMES[gender][Math.floor(Math.random() * SPANISH_NAMES[gender].length)];
  const surname1 = SPANISH_NAMES.surnames[Math.floor(Math.random() * SPANISH_NAMES.surnames.length)];
  const surname2 = SPANISH_NAMES.surnames[Math.floor(Math.random() * SPANISH_NAMES.surnames.length)];
  
  return {
    fullName: `${firstName} ${surname1} ${surname2}`,
    firstName,
    surnames: `${surname1} ${surname2}`,
    gender,
    formalName: gender === 'male' ? `Sr. ${surname1}` : `Sra. ${surname1}`
  };
};

// Generate random age (18-70)
const generateAge = () => {
  const ageGroups = [
    { min: 18, max: 25, weight: 0.3 },  // Young adults
    { min: 26, max: 35, weight: 0.4 },  // Adults
    { min: 36, max: 50, weight: 0.2 },  // Middle-aged
    { min: 51, max: 70, weight: 0.1 }   // Older adults
  ];
  
  const random = Math.random();
  let cumulativeWeight = 0;
  
  for (const group of ageGroups) {
    cumulativeWeight += group.weight;
    if (random <= cumulativeWeight) {
      return Math.floor(Math.random() * (group.max - group.min + 1)) + group.min;
    }
  }
  
  return 30; // Fallback
};

// Generate random location
const generateLocation = () => {
  const location = SPANISH_LOCATIONS[Math.floor(Math.random() * SPANISH_LOCATIONS.length)];
  const neighborhoods = [
    'Centro', 'Ensanche', 'Periferia', 'Zona Norte', 'Zona Sur', 'Zona Este', 'Zona Oeste',
    'Barrio Histórico', 'Zona Residencial', 'Área Comercial'
  ];
  
  return {
    ...location,
    neighborhood: neighborhoods[Math.floor(Math.random() * neighborhoods.length)],
    address: `Calle ${['Mayor', 'Real', 'Gran Vía', 'Alcalá', 'Paseo de la Castellana'][Math.floor(Math.random() * 5)]}, ${Math.floor(Math.random() * 200) + 1}`,
    timezone: 'Europe/Madrid',
    language: 'es-ES'
  };
};

// Generate employment information
const generateEmployment = () => {
  const sectors = [
    'TECH', 'FINANCE', 'HEALTHCARE', 'EDUCATION', 'RETAIL', 'HOSPITALITY', 'CONSTRUCTION', 'TRANSPORT', 'ADMIN', 'UNEMPLOYED'
  ];
  
  const sector = sectors[Math.floor(Math.random() * sectors.length)];
  const positions = {
    TECH: ['Desarrollador', 'Ingeniero de software', 'Analista de datos', 'Administrador de sistemas'],
    FINANCE: ['Contable', 'Analista financiero', 'Asesor bancario', 'Gestor de inversiones'],
    HEALTHCARE: ['Médico', 'Enfermero/a', 'Farmacéutico', 'Técnico de laboratorio'],
    EDUCATION: ['Profesor', 'Investigador', 'Administrador educativo', 'Orientador'],
    RETAIL: ['Dependiente', 'Gerente de tienda', 'Comercial', 'Comprador'],
    HOSPITALITY: ['Camarero/a', 'Chef', 'Recepcionista', 'Gerente de hotel'],
    CONSTRUCTION: ['Arquitecto', 'Ingeniero civil', 'Obrero', 'Capataz'],
    TRANSPORT: ['Conductor', 'Logístico', 'Operador', 'Gestor de flota'],
    ADMIN: ['Administrativo', 'Secretario/a', 'Asistente', 'Oficinista'],
    UNEMPLOYED: ['En búsqueda activa', 'Estudiante', 'Jubilado/a', 'Autónomo']
  };
  
  return {
    sector,
    position: positions[sector][Math.floor(Math.random() * positions[sector].length)],
    employed: sector !== 'UNEMPLOYED',
    incomeLevel: sector === 'UNEMPLOYED' ? 'LOW' : ['LOW', 'MEDIUM', 'HIGH'][Math.floor(Math.random() * 3)],
    company: sector === 'UNEMPLOYED' ? null : `Empresa ${['Nacional', 'Regional', 'Local'][Math.floor(Math.random() * 3)]} S.L.`
  };
};

// Generate social media profile
const generateSocialMedia = () => {
  const platforms = ['Instagram', 'Facebook', 'Twitter', 'LinkedIn', 'TikTok'];
  const activePlatforms = platforms.filter(() => Math.random() > 0.3);
  
  return {
    active: activePlatforms.length > 0,
    platforms: activePlatforms,
    frequency: ['Daily', 'Weekly', 'Monthly'][Math.floor(Math.random() * 3)],
    followers: Math.floor(Math.random() * 5000),
    publicProfile: Math.random() > 0.5
  };
};

// Generate WhatsApp contacts
const generateContacts = (count = 15) => {
  const contacts = [];
  const relationshipTypes = ['FAMILY', 'FRIEND', 'WORK', 'ACQUAINTANCE', 'SERVICE'];
  
  for (let i = 0; i < count; i++) {
    const name = generateSpanishName();
    const relationship = relationshipTypes[Math.floor(Math.random() * relationshipTypes.length)];
    
    contacts.push({
      id: `contact_${i + 1}`,
      name: name.fullName,
      phoneNumber: `+34${600000000 + Math.floor(Math.random() * 100000000)}`,
      relationship,
      lastContact: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      chatCount: Math.floor(Math.random() * 100),
      favorite: Math.random() > 0.8,
      groups: relationship === 'FRIEND' ? ['Amigos', 'Familia', 'Trabajo'][Math.floor(Math.random() * 3)] : null
    });
  }
  
  return contacts;
};

// Generate WhatsApp chat messages
const generateChats = (contactCount = 8) => {
  const chats = [];
  const contacts = generateContacts(contactCount);
  
  contacts.forEach(contact => {
    const messageCount = Math.floor(Math.random() * 20) + 5;
    const messages = [];
    
    let timestamp = Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000; // Within last 7 days
    
    for (let i = 0; i < messageCount; i++) {
      const isFromVictim = i % 2 === 0;
      const sender = isFromVictim ? 'VICTIM' : 'CONTACT';
      
      // Generate message content
      let content = '';
      if (i === 0) {
        content = SPANISH_PHRASES.greetings[Math.floor(Math.random() * SPANISH_PHRASES.greetings.length)];
      } else if (i === messageCount - 1) {
        content = 'Adiós 👋';
      } else {
        const phraseType = ['greetings', 'responses', 'questions', 'casal'][Math.floor(Math.random() * 4)];
        content = SPANISH_PHRASES[phraseType][Math.floor(Math.random() * SPANISH_PHRASES[phraseType].length)];
        
        // Add emoji occasionally
        if (Math.random() > 0.7) {
          content += ' ' + SPANISH_PHRASES.emojis[Math.floor(Math.random() * SPANISH_PHRASES.emojis.length)];
        }
      }
      
      messages.push({
        id: `msg_${contact.id}_${i}`,
        sender,
        content,
        timestamp: new Date(timestamp).toISOString(),
        read: true,
        delivered: true,
        ...(Math.random() > 0.8 && { media: `media_${Math.floor(Math.random() * 100)}.jpg` })
      });
      
      timestamp += Math.random() * 60 * 60 * 1000; // Next message within 0-60 minutes
    }
    
    chats.push({
      contactId: contact.id,
      contactName: contact.name,
      lastMessage: messages[messages.length - 1].content,
      lastTimestamp: messages[messages.length - 1].timestamp,
      unreadCount: Math.floor(Math.random() * 3),
      messages
    });
  });
  
  return chats;
};

// Generate media files
const generateMediaFiles = () => {
  const mediaTypes = ['PHOTO', 'VIDEO', 'AUDIO', 'DOCUMENT'];
  const files = [];
  
  for (let i = 0; i < Math.floor(Math.random() * 50) + 10; i++) {
    const type = mediaTypes[Math.floor(Math.random() * mediaTypes.length)];
    const date = new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000);
    
    files.push({
      id: `media_${i}`,
      type,
      filename: `${type.toLowerCase()}_${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}_${Math.floor(Math.random() * 1000)}.${type === 'PHOTO' ? 'jpg' : type === 'VIDEO' ? 'mp4' : type === 'AUDIO' ? 'mp3' : 'pdf'}`,
      size: Math.floor(Math.random() * 10000000) + 1000, // 1KB - 10MB
      date: date.toISOString(),
      from: Math.random() > 0.5 ? 'VICTIM' : 'CONTACT',
      ...(type === 'PHOTO' && { dimensions: `${Math.floor(Math.random() * 2000) + 800}x${Math.floor(Math.random() * 2000) + 800}` }),
      ...(type === 'VIDEO' && { duration: `${Math.floor(Math.random() * 300) + 5}s` })
    });
  }
  
  return files;
};

// Generate status updates
const generateStatusUpdates = () => {
  const statuses = [
    'En el trabajo 💼',
    'De vacaciones 🌴',
    'Con amigos 🍻',
    'En casa 🏠',
    'De viaje ✈️',
    'Estudiando 📚',
    'Haciendo deporte 🏃‍♂️',
    'Cenando 🍽️',
    'Viendo una película 🎬',
    'Escuchando música 🎵'
  ];
  
  const updates = [];
  
  for (let i = 0; i < Math.floor(Math.random() * 10) + 3; i++) {
    const date = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);
    
    updates.push({
      id: `status_${i}`,
      text: statuses[Math.floor(Math.random() * statuses.length)],
      timestamp: date.toISOString(),
      views: Math.floor(Math.random() * 100),
      emoji: ['😊', '😂', '❤️', '👍', '👌'][Math.floor(Math.random() * 5)]
    });
  }
  
  return updates;
};

// Main victim data generator
export const generateVictimData = (phoneNumber) => {
  const name = generateSpanishName();
  const age = generateAge();
  const location = generateLocation();
  const employment = generateEmployment();
  const socialMedia = generateSocialMedia();
  
  const victimData = {
    // Basic info
    id: `victim_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    phoneNumber,
    name: name.fullName,
    firstName: name.firstName,
    age,
    gender: name.gender,
    nationality: 'Spanish',
    language: 'es-ES',
    
    // Location
    location,
    
    // Employment
    employment,
    
    // Social media
    socialMedia,
    
    // WhatsApp data
    whatsapp: {
      registeredSince: new Date(Date.now() - Math.random() * 5 * 365 * 24 * 60 * 60 * 1000).toISOString(),
      lastSeen: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
      profilePicture: `https://api.dicebear.com/7.x/avatars/svg?seed=${name.fullName.replace(/ /g, '')}`,
      status: 'Available',
      twoStepEnabled: Math.random() > 0.7,
      backupEnabled: Math.random() > 0.5
    },
    
    // Contacts and chats
    contacts: generateContacts(),
    chats: generateChats(),
    
    // Media
    mediaFiles: generateMediaFiles(),
    
    // Status updates
    statusUpdates: generateStatusUpdates(),
    
    // Metadata
    generatedAt: new Date().toISOString(),
    dataType: 'SYNTHETIC_EDUCATIONAL',
    legalNotice: 'This data is synthetically generated for educational purposes only. No real user data is accessed or stored.'
  };
  
  return victimData;
};

// Generate specific data type
export const generateSpecificData = (type, phoneNumber) => {
  switch (type) {
    case 'CONTACTS':
      return generateContacts();
    case 'CHATS':
      return generateChats();
    case 'MEDIA':
      return generateMediaFiles();
    case 'STATUS':
      return generateStatusUpdates();
    case 'PROFILE':
      return {
        name: generateSpanishName().fullName,
        age: generateAge(),
        location: generateLocation(),
        employment: generateEmployment()
      };
    default:
      return generateVictimData(phoneNumber);
  }
};

// Helper to validate Spanish phone number
export const isValidSpanishNumber = (phoneNumber) => {
  const clean = phoneNumber.replace(/\D/g, '');
  return clean.startsWith('34') && clean.length === 11;
};

export default {
  generateVictimData,
  generateSpecificData,
  isValidSpanishNumber,
  SPANISH_NAMES,
  SPANISH_LOCATIONS
};