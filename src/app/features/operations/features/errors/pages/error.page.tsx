import AnimationUI from "src/app/ui/animations/animation.ui";
import { ButtonUI } from "src/app/ui/buttons/button.ui";
import { SpinnerUI } from "../../../ui/spinner.ui";
import errorAnimation from "./error.animation.json";
import { ErrorUI } from "./error.ui";
import { CustomError } from "./error.model";

const ErrorsPage = ({ errors }: { errors?: CustomError[] }) => {
  return (
    <div
      className="flex h-full w-full flex-col items-center justify-center pb-20"
      role="alert"
    >
      <AnimationUI
        className="animFadeIn"
        style={{
          opacity: "0.8",
          width: "130px",
        }}
        animation={errorAnimation}
      />
      {errors?.length ? (
        <>
          {errors.map((e, key: number) => {
            return (
              <div key={key} className="animHeightIn">
                <ErrorUI error={e} />
                <div className="h-4" />
              </div>
            );
          })}
        </>
      ) : (
        <div className="mb-5 mt-4">
          <SpinnerUI />
        </div>
      )}
      <div style={{ animationDelay: "260ms" }} className="animFadeIn">
        <ButtonUI onClick={() => window.location.reload()}>Refresh</ButtonUI>
      </div>
    </div>
  );
};

export default ErrorsPage;
