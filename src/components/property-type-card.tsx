import Image from "next/image";
import Link from "next/link";

interface PropertyTypeCardProps {
  title: string;
  description?: string;
  image: string;
  href: string;
}

export function PropertyTypeCard({
  title,
  description,
  image,
  href,
}: PropertyTypeCardProps) {
  return (
    <Link
      href={href}
      className="group relative mb-3 flex-1 overflow-hidden rounded-2xl shadow-md md:mb-0"
    >
      <div className="relative h-48 w-full">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>
      <div className="absolute inset-0 flex flex-col justify-end p-4 text-white">
        <h3 className="text-lg font-bold">{title}</h3>
        {description && (
          <p className="line-clamp-2 text-sm text-white/80">{description}</p>
        )}
      </div>
    </Link>
  );
}