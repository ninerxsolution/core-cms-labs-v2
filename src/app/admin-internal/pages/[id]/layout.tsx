export default function EditPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 bg-background" style={{ margin: 0, padding: 0 }}>
      {children}
    </div>
  );
}

