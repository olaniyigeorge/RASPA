import Image from "next/image";
import Link from "next/link";

interface ServiceDescriptionCardProps {
  title: string;
  description?: string;
  image: string;
  url: string;
}

export function ServiceDescriptionCard({
  title,
  description,
  image,
  url,
}: ServiceDescriptionCardProps) {
  return (
    <Link
      href={url}
      className="mb-3 flex flex-1 flex-col items-center rounded-2xl border border-purple-100 bg-white p-6 text-center shadow-sm transition-shadow hover:shadow-md md:mb-0"
    >
      <div className="relative mb-4 h-16 w-16">
        <Image src={image} alt={title} fill className="object-contain" />
      </div>
      <h3 className="text-lg font-bold text-gray-900">{title}</h3>
      {description && (
        <p className="mt-2 text-sm text-gray-600">{description}</p>
      )}
    </Link>
  );
}