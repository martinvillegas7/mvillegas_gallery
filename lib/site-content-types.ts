export type ExtraSocial = {
  name: string;
  url: string;
};

export type SiteContent = {
  hero: {
    title: string;
    subtitle: string;
  };
  about: {
    text: string;
  };
  contact: {
    email: string;
    instagram: string;
    extraSocials: ExtraSocial[];
  };
};

export const DEFAULT_SITE_CONTENT: SiteContent = {
  hero: {
    title: "Bienvenidos",
    subtitle:
      "Fotografía profesional de naturaleza, retrato y deporte. Cada imagen, un momento que no se repite.",
  },
  about: {
    text: `Soy Martín, fotógrafo apasionado por la naturaleza, los retratos y el deporte. Me fascina observar, esperar y capturar la vida en su entorno: aves en pleno vuelo, la quietud de un paisaje al amanecer o ese instante fugaz en que un animal deja entrever su personalidad.

También me mueve retratar a las personas, congelar momentos especiales y plasmar en imágenes lo que a veces cuesta poner en palabras: una sonrisa espontánea, una mirada sincera, un gesto que dice más que mil palabras.

Y me apasiona capturar la energía del deporte — la tensión de una carrera, el esfuerzo de un atleta en plena acción. Busco imágenes honestas que transmitan emoción y permanezcan en el recuerdo.`,
  },
  contact: {
    email: "mvillegasgallery@gmail.com",
    instagram: "martinvillegas_ph",
    extraSocials: [],
  },
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asString(value: unknown, fallback: string): string {
  return typeof value === "string" ? value : fallback;
}

function parseExtraSocials(value: unknown): ExtraSocial[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((item) => {
    if (!isRecord(item)) {
      return [];
    }

    const name = asString(item.name, "").trim();
    const url = asString(item.url, "").trim();

    if (!name || !url) {
      return [];
    }

    return [{ name, url }];
  });
}

export function mergeSiteContent(raw: unknown): SiteContent {
  const data = isRecord(raw) ? raw : {};
  const hero = isRecord(data.hero) ? data.hero : {};
  const about = isRecord(data.about) ? data.about : {};
  const contact = isRecord(data.contact) ? data.contact : {};

  return {
    hero: {
      title: asString(hero.title, DEFAULT_SITE_CONTENT.hero.title),
      subtitle: asString(hero.subtitle, DEFAULT_SITE_CONTENT.hero.subtitle),
    },
    about: {
      text: asString(about.text, DEFAULT_SITE_CONTENT.about.text),
    },
    contact: {
      email: asString(contact.email, DEFAULT_SITE_CONTENT.contact.email),
      instagram: asString(
        contact.instagram,
        DEFAULT_SITE_CONTENT.contact.instagram,
      ),
      extraSocials: parseExtraSocials(contact.extraSocials),
    },
  };
}

export function instagramProfileUrl(username: string): string {
  const trimmed = username.trim();
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  const handle = trimmed.replace(/^@/, "");
  return `https://instagram.com/${handle}`;
}
