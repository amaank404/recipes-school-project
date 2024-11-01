import type {Metadata} from 'next';

export const metedata: Metadata = {
    title: "Recipes.com"
};

export default function Layout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return <>{children}</>
}