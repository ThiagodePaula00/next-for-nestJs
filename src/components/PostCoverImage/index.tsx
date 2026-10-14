import Image from "next/image";
import Link from "next/link";
import { normalizeUploadedImageSrc } from "@/src/utils/normalize-uploaded-image-src";

type PostCoverImageProps = {
  imageProps: React.ComponentProps<typeof Image>;
  linkProps: React.ComponentProps<typeof Link>;
};

export function PostCoverImage({ imageProps, linkProps }: PostCoverImageProps) {
  return (
        <Link {...linkProps} className={`w-full h-full overflow-hidden rounded-xl ${linkProps.className}`}>

            <Image {...imageProps} src={normalizeUploadedImageSrc(imageProps.src.toString())} className={`w-full h-full object-cover object-center group-hover:scale-105 transition ${imageProps.className}`} alt={imageProps.alt} />
        </Link>
    )
}