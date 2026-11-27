interface KubreeBazzarLogoProps {
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
}

export function KubreeBazzarLogo({
  onClick,
  size = 'md',
}: KubreeBazzarLogoProps) {
  const heightClass =
    size === 'sm'
      ? 'h-9 sm:h-10'
      : size === 'lg'
      ? 'h-14 sm:h-16'
      : 'h-11 sm:h-12';

  return (
    <a
      href="/"
      onClick={(e) => {
        if (onClick) {
          e.preventDefault();
          onClick();
        }
      }}
      className="inline-flex items-center shrink-0 focus:outline-none group"
      aria-label="KubreeBazzar Home"
    >
      <img
        src="/assets/aistudio/Cheerful_Turtle_Shopping_Logo_75435e9c.png"
        alt="KubreeBazzar"
        onError={(e) => {
          const img = e.currentTarget;
          if (img.src.includes('Cheerful_Turtle_Shopping_Logo_75435e9c.png')) {
            img.src = '/images/kubreebazzar-logo.png';
          } else if (img.src.includes('/images/kubreebazzar-logo.png')) {
            img.src = '/kubreebazzar-logo.png';
          }
        }}
        className={`${heightClass} w-auto object-contain transition-transform duration-200 group-hover:scale-[1.02]`}
      />
    </a>
  );
}
