// Departamentos de Colombia y sus principales ciudades/municipios.
// Cobertura: las 32 gobernaciones + Bogotá D.C., con las cabeceras municipales
// más relevantes de cada una (capital primero) para uso en selects de ciudad.
export const COLOMBIA_DEPARTMENTS = [
  {
    name: 'Bogotá D.C.',
    cities: ['Bogotá'],
  },
  {
    name: 'Amazonas',
    cities: ['Leticia', 'Puerto Nariño'],
  },
  {
    name: 'Antioquia',
    cities: [
      'Medellín', 'Bello', 'Envigado', 'Itagüí', 'Sabaneta', 'La Estrella', 'Caldas',
      'Rionegro', 'Apartadó', 'Turbo', 'Copacabana', 'Girardota', 'Marinilla',
      'El Carmen de Viboral', 'Santa Fe de Antioquia', 'Yarumal', 'Caucasia',
      'Necoclí', 'Chigorodó',
    ],
  },
  {
    name: 'Arauca',
    cities: ['Arauca', 'Arauquita', 'Saravena', 'Tame'],
  },
  {
    name: 'Atlántico',
    cities: [
      'Barranquilla', 'Soledad', 'Malambo', 'Sabanalarga', 'Puerto Colombia',
      'Baranoa', 'Galapa', 'Sabanagrande',
    ],
  },
  {
    name: 'Bolívar',
    cities: [
      'Cartagena', 'Magangué', 'Turbaco', 'Arjona', 'El Carmen de Bolívar',
      'Mompóx', 'San Juan Nepomuceno', 'Carmen de Bolívar',
    ],
  },
  {
    name: 'Boyacá',
    cities: [
      'Tunja', 'Duitama', 'Sogamoso', 'Chiquinquirá', 'Paipa', 'Villa de Leyva',
      'Puerto Boyacá', 'Nobsa', 'Moniquirá',
    ],
  },
  {
    name: 'Caldas',
    cities: [
      'Manizales', 'La Dorada', 'Chinchiná', 'Villamaría', 'Riosucio',
      'Anserma', 'Salamina', 'Supía',
    ],
  },
  {
    name: 'Caquetá',
    cities: ['Florencia', 'San Vicente del Caguán', 'Puerto Rico', 'El Doncello'],
  },
  {
    name: 'Casanare',
    cities: ['Yopal', 'Aguazul', 'Villanueva', 'Tauramena', 'Paz de Ariporo'],
  },
  {
    name: 'Cauca',
    cities: [
      'Popayán', 'Santander de Quilichao', 'Puerto Tejada', 'Patía',
      'El Bordo', 'Guapi', 'Timbío',
    ],
  },
  {
    name: 'Cesar',
    cities: [
      'Valledupar', 'Aguachica', 'Codazzi', 'Bosconia', 'La Jagua de Ibirico',
      'Curumaní', 'Chiriguaná',
    ],
  },
  {
    name: 'Chocó',
    cities: ['Quibdó', 'Istmina', 'Tadó', 'Condoto', 'Riosucio'],
  },
  {
    name: 'Córdoba',
    cities: [
      'Montería', 'Lorica', 'Cereté', 'Sahagún', 'Planeta Rica', 'Montelíbano',
      'Tierralta', 'Ciénaga de Oro',
    ],
  },
  {
    name: 'Cundinamarca',
    cities: [
      'Soacha', 'Facatativá', 'Zipaquirá', 'Chía', 'Girardot', 'Fusagasugá',
      'Mosquera', 'Madrid', 'Funza', 'Cajicá', 'Ubaté', 'La Calera',
      'Cota', 'Sibaté',
    ],
  },
  {
    name: 'Guainía',
    cities: ['Inírida'],
  },
  {
    name: 'Guaviare',
    cities: ['San José del Guaviare', 'Calamar', 'El Retorno'],
  },
  {
    name: 'Huila',
    cities: [
      'Neiva', 'Pitalito', 'Garzón', 'La Plata', 'Campoalegre', 'Palermo', 'Gigante',
    ],
  },
  {
    name: 'La Guajira',
    cities: ['Riohacha', 'Maicao', 'Uribia', 'Fonseca', 'San Juan del Cesar', 'Villanueva'],
  },
  {
    name: 'Magdalena',
    cities: [
      'Santa Marta', 'Ciénaga', 'Fundación', 'Aracataca', 'El Banco',
      'Plato', 'Zona Bananera',
    ],
  },
  {
    name: 'Meta',
    cities: [
      'Villavicencio', 'Acacías', 'Granada', 'Puerto López', 'San Martín',
      'Cumaral', 'Restrepo',
    ],
  },
  {
    name: 'Nariño',
    cities: [
      'Pasto', 'Ipiales', 'Tumaco', 'Túquerres', 'Samaniego', 'La Unión',
    ],
  },
  {
    name: 'Norte de Santander',
    cities: [
      'Cúcuta', 'Ocaña', 'Villa del Rosario', 'Los Patios', 'Pamplona',
      'Tibú', 'El Zulia',
    ],
  },
  {
    name: 'Putumayo',
    cities: ['Mocoa', 'Puerto Asís', 'Orito', 'Valle del Guamuez', 'Sibundoy'],
  },
  {
    name: 'Quindío',
    cities: [
      'Armenia', 'Calarcá', 'La Tebaida', 'Montenegro', 'Quimbaya', 'Circasia',
    ],
  },
  {
    name: 'Risaralda',
    cities: [
      'Pereira', 'Dosquebradas', 'Santa Rosa de Cabal', 'La Virginia', 'Belén de Umbría',
    ],
  },
  {
    name: 'San Andrés y Providencia',
    cities: ['San Andrés', 'Providencia'],
  },
  {
    name: 'Santander',
    cities: [
      'Bucaramanga', 'Floridablanca', 'Girón', 'Piedecuesta', 'Barrancabermeja',
      'San Gil', 'Barbosa', 'Socorro', 'Málaga',
    ],
  },
  {
    name: 'Sucre',
    cities: [
      'Sincelejo', 'Corozal', 'Sampués', 'San Marcos', 'Tolú', 'Coveñas',
    ],
  },
  {
    name: 'Tolima',
    cities: [
      'Ibagué', 'Espinal', 'Melgar', 'Honda', 'Chaparral', 'Líbano', 'Mariquita',
      'Flandes', 'Guamo',
    ],
  },
  {
    name: 'Valle del Cauca',
    cities: [
      'Cali', 'Palmira', 'Buenaventura', 'Tuluá', 'Cartago', 'Buga',
      'Jamundí', 'Yumbo', 'Candelaria', 'Florida', 'Zarzal',
    ],
  },
  {
    name: 'Vaupés',
    cities: ['Mitú'],
  },
  {
    name: 'Vichada',
    cities: ['Puerto Carreño', 'La Primavera', 'Cumaribo'],
  },
];

// Lista plana de todas las ciudades (sin duplicar Bogotá) — útil para selects
// simples que no necesitan agrupar por departamento (ej. filtros rápidos).
export const COLOMBIA_CITIES = Array.from(
  new Set(COLOMBIA_DEPARTMENTS.flatMap((d) => d.cities))
).sort((a, b) => a.localeCompare(b, 'es'));

// Dado el nombre de una ciudad, devuelve su departamento (o null si no se encuentra).
export function findDepartmentByCity(cityName) {
  const dep = COLOMBIA_DEPARTMENTS.find((d) => d.cities.includes(cityName));
  return dep ? dep.name : null;
}
