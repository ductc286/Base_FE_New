import { useRouter } from "next/navigation";

export const useAsyncRouter = () => {
  const router = useRouter();

  //Chua thay work
  const pushAsync = (url?: string) => {
    return new Promise((resolve) => {
      router.push(url ?? "");
      // App Router navigation là synchronous trong Next.js 15
      setTimeout(resolve, 0);
    });
  };

  return { pushAsync };
};
