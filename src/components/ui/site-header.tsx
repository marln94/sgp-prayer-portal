export function SiteHeader() {
  return (
    <header className="fixed w-full flex h-(--header-height) shrink-0 items-center gap-2 border-b bg-neutral-700 text-white">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <h1 className="text-xl font-medium">Portal de peticiones</h1>
      </div>
    </header>
  );
}
