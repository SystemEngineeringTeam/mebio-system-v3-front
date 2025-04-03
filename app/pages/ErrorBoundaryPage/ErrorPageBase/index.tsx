interface Props {
  title: string;
  message: string;
  children?: React.ReactNode;
}

export default function ErrorPageBase({ title, message, children }: Props) {
  return (
    <main className="flex h-full flex-col items-center justify-center" data-scrollable="false">
      <h1 className="text-5xl font-bold">{title}</h1>
      <p>{message}</p>
      {children}
    </main>
  );
}
