export interface IProps {
  children?: React.ReactNode;
}

export default function Page({ children }: IProps) {
  return <div className="w-100 bg-white">{children}</div>;
}
