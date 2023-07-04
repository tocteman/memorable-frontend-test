import { SpinnerUI } from "../../../ui/spinner.ui";

export const LoadingPage = () => {
  return (
    <div
      className="animFadeIn pointer-events-none fixed inset-0 flex h-full w-full items-center justify-center"
      style={{
        animationDuration: "1s",
      }}
    >
      <SpinnerUI />
    </div>
  );
};
