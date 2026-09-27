import { ImageResponse } from 'next/og';
import { fallbackProfile, fallbackProjects, fallbackSettings } from '@/lib/fallbackData';
import { layoutLine, metricNumber } from '@/lib/lines';

export const alt = `${fallbackProfile.name}, ${fallbackProfile.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// The share card: name, headline, and the first featured line drawn to scale.
export default function OpenGraphImage() {
  const project = fallbackProjects.find((p) => p.featured);
  const line = project ? layoutLine(project.processSteps) : null;
  const target = project ? metricNumber(project, /^target/i) : undefined;
  const railLeft = 80;
  const railWidth = 1040;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: '#f4f5f5',
          color: '#14161a',
          padding: '72px 80px',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ fontSize: 30, color: '#525863', display: 'flex' }}>
          {fallbackProfile.name} · {fallbackProfile.role}
        </div>
        <div style={{ fontSize: 84, fontWeight: 700, letterSpacing: -3, lineHeight: 1, marginTop: 28, display: 'flex' }}>
          {fallbackSettings.hero.headline.replaceAll('*', '')}
        </div>

        {line && line.stations.length > 1 && (
          <div style={{ position: 'absolute', left: 0, top: 400, width: 1200, height: 160, display: 'flex' }}>
            <div
              style={{
                position: 'absolute',
                left: railLeft,
                top: 60,
                width: railWidth,
                height: 10,
                borderRadius: 5,
                background: '#d8343a',
              }}
            />
            {target && line.timed && target < line.totalMs && (
              <div
                style={{
                  position: 'absolute',
                  left: railLeft + (railWidth * target) / line.totalMs,
                  top: 18,
                  height: 72,
                  borderLeft: '3px dashed #686e78',
                  display: 'flex',
                }}
              />
            )}
            {line.stations.map((s, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: railLeft + (railWidth * line.at[i]) / 100 - 14,
                  top: 51,
                  width: 28,
                  height: 28,
                  borderRadius: 14,
                  background: '#f4f5f5',
                  border: '7px solid #14161a',
                  display: 'flex',
                }}
              />
            ))}
            <div style={{ position: 'absolute', left: railLeft, top: 100, fontSize: 26, color: '#525863', display: 'flex' }}>
              {project!.title}: {line.timed ? `${line.totalMs} ms to first audio, target ${target} ms` : project!.summary.slice(0, 60)}
            </div>
          </div>
        )}
      </div>
    ),
    size
  );
}
