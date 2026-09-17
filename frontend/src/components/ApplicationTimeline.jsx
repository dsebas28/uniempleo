import { CheckCircle, Circle, Clock, AlertCircle, XCircle, Star } from 'lucide-react';

const STATUS_CONFIG = {
  sent: {
    label: 'Postulación enviada',
    desc: 'Tu postulación fue enviada correctamente',
    icon: CheckCircle,
    color: 'text-blue-500',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
  },
  reviewing: {
    label: 'En revisión',
    desc: 'La empresa está revisando tu perfil',
    icon: Clock,
    color: 'text-yellow-500',
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
  },
  preselected: {
    label: 'Preseleccionado',
    desc: '¡Felicidades! Pasaste a la siguiente etapa',
    icon: Star,
    color: 'text-purple-500',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
  },
  interview: {
    label: 'Entrevista',
    desc: 'Tienes una invitación a entrevista',
    icon: AlertCircle,
    color: 'text-emerald-500',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
  },
  selected: {
    label: '¡Seleccionado!',
    desc: '¡Felicidades! Fuiste seleccionado para el cargo',
    icon: Star,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-300',
  },
  rejected: {
    label: 'No seleccionado',
    desc: 'En esta ocasión no fuiste seleccionado',
    icon: XCircle,
    color: 'text-red-400',
    bg: 'bg-red-50',
    border: 'border-red-200',
  },
};

const STATUS_ORDER = ['sent', 'reviewing', 'preselected', 'interview', 'selected'];

export default function ApplicationTimeline({ status }) {
  const currentIdx = STATUS_ORDER.indexOf(status);
  const isRejected = status === 'rejected';

  if (isRejected) {
    return (
      <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-200">
        <XCircle size={20} className="text-red-400 flex-shrink-0" />
        <div>
          <p className="text-sm font-semibold text-red-700">No seleccionado</p>
          <p className="text-xs text-red-500">En esta ocasión no fuiste seleccionado. ¡Sigue intentando!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {STATUS_ORDER.map((step, idx) => {
        const config = STATUS_CONFIG[step];
        const Icon = config.icon;
        const isPast = idx < currentIdx;
        const isCurrent = idx === currentIdx;
        const isFuture = idx > currentIdx;
        const isLast = idx === STATUS_ORDER.length - 1;

        return (
          <div key={step} className="flex gap-3">
            {/* Left: icon + line */}
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                isPast ? 'bg-blue-500' :
                isCurrent ? config.bg + ' border-2 ' + config.border :
                'bg-gray-100'
              }`}>
                {isPast ? (
                  <CheckCircle size={16} className="text-white" />
                ) : isCurrent ? (
                  <Icon size={16} className={config.color} />
                ) : (
                  <Circle size={16} className="text-gray-300" />
                )}
              </div>
              {!isLast && (
                <div className={`w-0.5 h-8 mt-1 rounded-full ${isPast ? 'bg-blue-300' : 'bg-gray-200'}`} />
              )}
            </div>

            {/* Right: text */}
            <div className={`pb-6 min-w-0 ${isLast ? 'pb-0' : ''}`}>
              <p className={`text-sm font-semibold transition-colors ${
                isPast ? 'text-blue-600' :
                isCurrent ? config.color :
                'text-gray-400'
              }`}>
                {config.label}
              </p>
              {(isPast || isCurrent) && (
                <p className="text-xs text-gray-500 mt-0.5">{config.desc}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
