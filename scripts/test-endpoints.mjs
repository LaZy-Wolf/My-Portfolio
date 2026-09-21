async function testEndpoints() {
  const urls = [
    'http://localhost:3000',
    'http://localhost:3000/api/profile',
    'http://localhost:3000/api/projects',
    'http://localhost:3000/api/skills',
    'http://localhost:3000/api/settings',
    'http://localhost:3000/api/export',
    'http://localhost:3000/projects/sonar-realtime-voice-agent',
    'http://localhost:3000/robots.txt',
    'http://localhost:3000/sitemap.xml',
  ];

  console.log('--- TESTING CORE ENDPOINTS ---');
  for (const url of urls) {
    try {
      const res = await fetch(url);
      console.log(`[${res.status}] ${url} (Content-Type: ${res.headers.get('content-type')})`);
      if (url.includes('/api/projects')) {
        const data = await res.json();
        console.log(` -> Found ${data.length} projects: ${data.map(p => p.title).join(' | ')}`);
      }
      if (url.includes('/api/skills')) {
        const data = await res.json();
        console.log(` -> Found ${data.length} skill categories: ${data.map(c => c.category).join(' | ')}`);
      }
    } catch (err) {
      console.error(`FAILED: ${url}`, err.message);
    }
  }
}

testEndpoints();
