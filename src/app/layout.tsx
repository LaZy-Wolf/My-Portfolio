import type { Metadata, Viewport } from 'next';
import { Archivo, Fragment_Mono, Kalam } from 'next/font/google';
import '@/styles/globals.css';
import { SmoothScroll } from '@/components/providers/SmoothScroll';
import { AuthProvider } from '@/components/providers/AuthProvider';
import { connectDB } from '@/lib/db';
import { Settings } from '@/models/Settings';
import { fallbackSettings } from '@/lib/fallbackData';

const archivo = Archivo({
  subsets: ['latin'],
  axes: ['wdth'],
  variable: '--font-sans',
  display: 'swap',
});

// Margin notes, in an Indian handwriting face.
const kalam = Kalam({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-hand',
  display: 'swap',
});

const fragmentMono = Fragment_Mono({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: fallbackSettings.seo.title,
  description: fallbackSettings.seo.description,
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f4f5f5' },
    { media: '(prefers-color-scheme: dark)', color: '#0f1114' },
  ],
};

// Runs before paint: visitor's choice, else the admin default, else the OS setting.
const themeScript = `(function(){try{var d=document.documentElement,t=localStorage.getItem('theme')||d.dataset.defaultTheme||'system';if(t!=='light'&&t!=='dark'){t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}d.dataset.theme=t;d.classList.add('js')}catch(e){}})()`;

async function getDefaultTheme() {
  try {
    await connectDB();
    const s = await Settings.findById('main').select('theme').lean();
    return s?.theme || 'system';
  } catch {
    return fallbackSettings.theme;
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const defaultTheme = await getDefaultTheme();

  return (
    <html
      lang="en"
      data-default-theme={defaultTheme}
      className={`${archivo.variable} ${fragmentMono.variable} ${kalam.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="font-sans text-ink antialiased">
        <div
          hidden
          dangerouslySetInnerHTML={{
            __html: `<!--
THESIS: Each project is a metro line; each stop is a real pipeline stage with its measured time. Refuses the dark terminal portfolio and the project card grid.
OWN-WORLD: Enamel day map (#F4F5F5, ink #14161A) and night map; Hyderabad Metro line colours as flat 6px rails; paper stations with ink rings; route bullets; pill controls; Archivo in signage widths; tabular numerals.
STORY: A recruiter reads who, what and "open to roles" in one glance, watches SONAR run its real 1412 ms turn against a 900 ms target, then emails. An engineer rides a line into a case study and checks every number against the repo.
FIRST VIEWPORT: Left: name and role strip, two-line headline, one sentence, See the work + Email me. Full width below: SONAR's line to scale, a train running it at real speed, target as a ghost stop, the miss bracketed.
FORM: Transit strip map and network diagram, candidate 6 of 7, seed 121db9f3.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
-->`,
          }}
        />
        <AuthProvider>
          <SmoothScroll>{children}</SmoothScroll>
        </AuthProvider>
      </body>
    </html>
  );
}
