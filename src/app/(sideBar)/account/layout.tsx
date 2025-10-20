export default async function AccountEditLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className="flex w-full">
      <div className="bg-primary-gray min-w-[300px] hidden">
        Account edit side bar
      </div>
      {children}
    </section>
  );
}
