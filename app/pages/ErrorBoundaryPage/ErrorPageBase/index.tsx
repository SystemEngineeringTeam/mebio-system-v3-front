interface Props {
  title: string;
  message: string;
  children?: React.ReactNode;
}

export default function ErrorPageBase({ title, message, children }: Props) {
  return (
    <div data-scrollable="false">
      <h1>{title}</h1>
      <p>{message}</p>
      {children}
    </div>
  );
}
