interface Props {
  title: string;
  message: string;
  children?: React.ReactNode;
}

export default function ErrorPageBase({ title, message, children }: Props) {
  return (
    <div data-scrollable="false" className="flex flex-col items-center justify-center h-full">  
      <h1 className="text-5xl font-bold">{title}</h1>
      <p>{message}</p>
      {children}
    </div>
  );
}
