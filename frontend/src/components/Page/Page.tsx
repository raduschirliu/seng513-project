import { Card, Col, Container, Row, Stack } from 'react-bootstrap';
import Nav from '../Nav/Nav';

export interface IProps {
  children?: React.ReactNode;
}

export default function Page({ children }: IProps) {
  return <div className="w-100 h-100 bg-white page">{children}</div>;
}
