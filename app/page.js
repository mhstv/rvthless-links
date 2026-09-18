export default function Home() {
  return (
    <main style={{ padding: '4rem 2rem', maxWidth: 480, margin: '0 auto' }}>
      <h1 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>rvthless links</h1>
      <p style={{ color: '#999', lineHeight: 1.6 }}>
        Personal link shortener. Manage links and view click stats from{' '}
        <a href="/dashboard" style={{ color: '#7dd3a8' }}>/dashboard</a>.
      </p>
    </main>
  );
}
