export const metadata = {
  title: 'rvthless links',
  description: 'Personal link shortener + click tracker',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: '#0b0b0d', color: '#eaeaea', fontFamily: 'system-ui, sans-serif' }}>
        {children}
      </body>
    </html>
  );
}
