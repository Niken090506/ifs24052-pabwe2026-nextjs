import clsx from "clsx";

function getInitials(name?: string | null) {
  return (
    String(name || "?")
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("") || "?"
  );
}

const SIZES = {
  sm: { box: "h-8 w-8 text-xs", pixel: 32 },
  md: { box: "h-10 w-10 text-sm", pixel: 40 },
  lg: { box: "h-24 w-24 text-2xl", pixel: 96 },
};

interface AvatarProps {
  name?: string | null;
  photo?: string | null;
  size?: keyof typeof SIZES;
  className?: string;
}

/**
 * Avatar pengguna. Gambar bersifat dekoratif (nama ditampilkan di dekatnya),
 * sehingga alt dikosongkan.
 */
export default function Avatar({ name, photo, size = "md", className }: AvatarProps) {
  const { box, pixel } = SIZES[size];

  if (photo) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={photo}
        alt=""
        width={pixel}
        height={pixel}
        loading="lazy"
        decoding="async"
        className={clsx("rounded-full bg-slate-200 object-cover", box, className)}
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      className={clsx(
        "inline-flex items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-800",
        box,
        className
      )}
    >
      {getInitials(name)}
    </span>
  );
}
