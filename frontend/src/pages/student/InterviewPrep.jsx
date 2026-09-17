import { useState } from 'react';
import { ChevronDown, ChevronUp, MessageSquare, Lightbulb, Mic, BookOpen, Star, Target } from 'lucide-react';

const CATEGORIES = [
  {
    id: 'common',
    icon: MessageSquare,
    color: 'blue',
    title: 'Preguntas comunes de entrevista',
    questions: [
      { q: '¿Cuéntame sobre ti?', a: 'Estructura tu respuesta en 3 partes: quién eres académicamente, tus habilidades clave y qué buscas profesionalmente. Ejemplo: "Soy estudiante de Ingeniería de Sistemas en el 8° semestre. Me especializo en desarrollo web y tengo habilidades en React y Node.js. Busco una primera experiencia donde pueda aplicar mis conocimientos y seguir creciendo."' },
      { q: '¿Por qué quieres trabajar en nuestra empresa?', a: 'Investiga la empresa antes. Menciona su misión, productos o cultura. Conecta sus valores con los tuyos. Evita respuestas genéricas como "porque pagan bien".' },
      { q: '¿Cuáles son tus fortalezas?', a: 'Elige 2-3 fortalezas relevantes para el cargo. Apoya cada una con un ejemplo concreto. Usa la metodología STAR: Situación, Tarea, Acción, Resultado.' },
      { q: '¿Cuáles son tus debilidades?', a: 'Elige una debilidad real (no falsa), explica cómo la estás trabajando y qué has aprendido. Ejemplo: "Tiendo a ser muy detallista, lo que a veces me ralentiza. Estoy aprendiendo a establecer plazos internos para cada tarea."' },
      { q: '¿Dónde te ves en 5 años?', a: 'Muestra ambición pero realismo. Conecta tu visión con el crecimiento dentro de la empresa. Ejemplo: "Me veo liderando proyectos técnicos, habiendo desarrollado expertise en [área del cargo] y aportando a la innovación del equipo."' },
    ]
  },
  {
    id: 'behavioral',
    icon: Target,
    color: 'purple',
    title: 'Preguntas de comportamiento (STAR)',
    questions: [
      { q: 'Cuéntame de un trabajo en equipo exitoso', a: 'Usa STAR: Situación (proyecto de clase), Tarea (tu rol específico), Acción (qué hiciste), Resultado (qué lograron juntos). Destaca tu contribución específica, no el trabajo del grupo.' },
      { q: '¿Cómo manejas los conflictos?', a: 'Da un ejemplo real. Muestra que escuchas activamente, buscas entender la perspectiva del otro y propones soluciones concretas. Evita decir "nunca tengo conflictos".' },
      { q: 'Habla de un fracaso y qué aprendiste', a: 'Sé honesto pero no te hundas. Describe brevemente qué salió mal, asume responsabilidad y enfócate en el aprendizaje y cómo aplicaste esa lección después.' },
    ]
  },
  {
    id: 'tips',
    icon: Lightbulb,
    color: 'yellow',
    title: 'Tips antes de la entrevista',
    questions: [
      { q: 'Investiga la empresa', a: '✓ Revisa su sitio web y redes sociales\n✓ Lee sobre sus productos y servicios\n✓ Conoce su misión, visión y valores\n✓ Busca noticias recientes sobre la empresa\n✓ Prepara preguntas inteligentes para hacerles' },
      { q: 'Cuida tu presentación', a: '✓ Llega 10-15 minutos antes (o conecta 5 minutos antes si es virtual)\n✓ Viste de forma profesional o semi-formal\n✓ Asegura conexión estable si es videollamada\n✓ Busca un lugar tranquilo y con buena iluminación\n✓ Mantén tu celular en silencio' },
      { q: 'Lenguaje corporal', a: '✓ Mantén contacto visual (70% del tiempo)\n✓ Sonríe de forma natural y segura\n✓ Siéntate erguido pero relajado\n✓ Evita cruzar los brazos\n✓ Habla con fluidez y claridad, sin apresurar' },
    ]
  },
  {
    id: 'salary',
    icon: Star,
    color: 'green',
    title: 'Negociación salarial para principiantes',
    questions: [
      { q: '¿Cuándo hablar de salario?', a: 'Idealmente al final del proceso, cuando ya hayan demostrado interés en ti. Nunca seas el primero en mencionar una cifra. Si te preguntan, devuelve la pregunta: "¿Cuál es el rango que tienen presupuestado para este cargo?"' },
      { q: '¿Cómo investigar el salario justo?', a: 'Revisa plataformas como Glassdoor, LinkedIn Salary o Computrabajo. Considera tu ciudad, empresa, sector e industria. Para prácticas en Colombia, el mínimo legal aplica. Para empleos, el promedio de tu carrera es tu referencia.' },
      { q: '¿Cómo pedir más sin quedar mal?', a: 'Usa datos, no emociones. Ejemplo: "Investigué el mercado y para un cargo como este en [ciudad], el rango usual es [X-Y]. Con mis habilidades en [Z], esperaría estar en ese rango." Siempre agradece y muestra entusiasmo por el rol.' },
    ]
  }
];

const colorMap = {
  blue: { icon: 'text-blue-600 bg-blue-100', border: 'border-blue-200', header: 'text-blue-700' },
  purple: { icon: 'text-purple-600 bg-purple-100', border: 'border-purple-200', header: 'text-purple-700' },
  yellow: { icon: 'text-yellow-700 bg-yellow-100', border: 'border-yellow-200', header: 'text-yellow-700' },
  green: { icon: 'text-emerald-600 bg-emerald-100', border: 'border-emerald-200', header: 'text-emerald-700' },
};

function Accordion({ items, color }) {
  const [open, setOpen] = useState(null);
  const c = colorMap[color] || colorMap.blue;

  return (
    <div className="space-y-2">
      {items.map((item, idx) => (
        <div key={idx} className={`border ${open === idx ? c.border : 'border-gray-100'} rounded-xl overflow-hidden transition-all`}>
          <button
            className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
            onClick={() => setOpen(open === idx ? null : idx)}
          >
            <span className={`font-medium text-sm ${open === idx ? c.header : 'text-gray-800'}`}>{item.q}</span>
            {open === idx ? <ChevronUp size={16} className="text-gray-400 flex-shrink-0" /> : <ChevronDown size={16} className="text-gray-400 flex-shrink-0" />}
          </button>
          {open === idx && (
            <div className="px-4 pb-4">
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{item.a}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function InterviewPrep() {
  const [activeCategory, setActiveCategory] = useState('common');

  const current = CATEGORIES.find(c => c.id === activeCategory);
  const c = colorMap[current?.color || 'blue'];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Outfit' }}>Preparación para entrevistas</h1>
        <p className="text-gray-500 text-sm mt-1">
          Practica las preguntas más comunes y mejora tu desempeño en entrevistas laborales.
        </p>
      </div>

      {/* Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white flex items-center gap-4">
        <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
          <Mic size={28} className="text-white" />
        </div>
        <div>
          <h2 className="text-lg font-bold mb-1">Consejos para tu primera entrevista</h2>
          <p className="text-sm text-blue-100">
            Más del 60% de los candidatos fallan en entrevistas por falta de preparación. ¡Tú no serás uno de ellos!
          </p>
        </div>
      </div>

      {/* Category nav */}
      <div className="flex gap-2 flex-wrap">
        {CATEGORIES.map(cat => {
          const Icon = cat.icon;
          const cc = colorMap[cat.color];
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeCategory === cat.id
                  ? `${cc.icon.replace('text-', 'border-2 text-').replace('bg-', 'bg-')} shadow-sm`
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              <Icon size={15} /> {cat.title}
            </button>
          );
        })}
      </div>

      {/* Content */}
      {current && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className={`flex items-center gap-3 p-5 border-b border-gray-100`}>
            <div className={`w-10 h-10 rounded-xl ${c.icon} flex items-center justify-center`}>
              {(() => { const Icon = current.icon; return <Icon size={20} />; })()}
            </div>
            <h2 className="font-semibold text-gray-900">{current.title}</h2>
            <span className="ml-auto text-xs text-gray-400">{current.questions.length} preguntas</span>
          </div>
          <div className="p-5">
            <Accordion items={current.questions} color={current.color} />
          </div>
        </div>
      )}

      {/* Reminder */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
        <BookOpen size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-amber-800">Tip final</p>
          <p className="text-xs text-amber-700 mt-0.5">
            La mejor preparación es practicar en voz alta. Grábate respondiendo, escúchate y mejora. 
            La confianza viene con la práctica.
          </p>
        </div>
      </div>
    </div>
  );
}
