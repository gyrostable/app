import NextImage from "next/image";

// opt-out of image optimization, no-op
const customLoader = ({ src }: { src: string }) => {
  return src;
};

export default function Image(props: any) {
  return <NextImage {...props} loader={customLoader} unoptimized={true} />;
}
